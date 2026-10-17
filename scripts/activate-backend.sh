
#!/usr/bin/env bash
set -Eeuo pipefail

umask 077

LOCK_FILE="/home/ec2-user/.tml-deploy.lock"

exec 9>"$LOCK_FILE"

if ! flock -n 9; then
    echo "ERROR: Another deployment operation is running." >&2
    exit 1
fi

# TML-1 backend activation.
# Production activation requires explicit authorization,
# an approved change-control window, and deployment orchestration.

[[ "$(id -un)" == "ec2-user" ]] || {
    echo "ERROR: Must run as ec2-user." >&2
    exit 1
}

SHA="${1:-}"
MODE="${2:-}"

if [[ -n "$MODE" && "$MODE" != "--dry-run" ]]; then
    echo "ERROR: Unknown option: $MODE" >&2
    exit 1
fi

[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || {
    echo "ERROR: Full 40-character commit SHA required." >&2
    exit 1
}

# Explicit authorization is required for actual activation.
# Dry-run is exempt because it does not change the active release.
if [[ "$MODE" != "--dry-run" ]]; then
    if [[ "${TML_APPROVED_DEPLOYMENT:-}" != "YES" ]]; then
        echo "ERROR: Production activation requires TML_APPROVED_DEPLOYMENT=YES." >&2
        exit 1
    fi
fi

# Production change-control window: Friday in Taiwan.
# Dry-run is allowed on other days because it changes nothing.
if [[ "$MODE" != "--dry-run" ]]; then
    TAIWAN_DAY="$(TZ=Asia/Taipei date +%u)"

    if [[ "$TAIWAN_DAY" != "5" ]]; then
        echo "ERROR: Production activation is permitted only on Fridays (Taiwan time)." >&2
        exit 1
    fi
fi

BASE="/home/ec2-user/tml-releases"
RELEASE="$BASE/releases/$SHA"
BACKEND="$RELEASE/backend"
CURRENT="$BASE/current"
APP="tml-backend"
LEGACY="/home/ec2-user/tobler-modernization-lab/backend"
HEALTH_URL="http://127.0.0.1:3000/crm/companies"

export NVM_DIR="/home/ec2-user/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22

for PATH_TO_CHECK in \
    "$BACKEND/dist/main.js" \
    "$BACKEND/.env"; do
    [[ -f "$PATH_TO_CHECK" ]] || {
        echo "ERROR: Missing $PATH_TO_CHECK" >&2
        exit 1
    }
done

[[ -d "$BACKEND/node_modules" ]] || {
    echo "ERROR: Backend dependencies missing." >&2
    exit 1
}

# The existing process must be present before activation.
pm2 describe "$APP" >/dev/null || {
    echo "ERROR: Existing PM2 application not found." >&2
    exit 1
}

# Capture the actual running process configuration, including
# the legacy checkout used by the first deployment.
PREVIOUS_SCRIPT="$(
    pm2 jlist | node -e '
      let input = "";
      process.stdin.on("data", c => input += c);
      process.stdin.on("end", () => {
        const app = JSON.parse(input).find(
          p => p.name === "tml-backend"
        );
        if (!app) process.exit(1);
        process.stdout.write(app.pm2_env.pm_exec_path);
      });
    '
)"

PREVIOUS_CWD="$(
    pm2 jlist | node -e '
      let input = "";
      process.stdin.on("data", c => input += c);
      process.stdin.on("end", () => {
        const app = JSON.parse(input).find(
          p => p.name === "tml-backend"
        );
        if (!app) process.exit(1);
        process.stdout.write(app.pm2_env.pm_cwd);
      });
    '
)"

[[ -f "$PREVIOUS_SCRIPT" && -d "$PREVIOUS_CWD" ]] || {
    echo "ERROR: Previous PM2 configuration invalid." >&2
    exit 1
}

PREVIOUS_RELEASE=""
if [[ -L "$CURRENT" ]]; then
    PREVIOUS_RELEASE="$(readlink -f "$CURRENT")"
fi

echo "Previous script: $PREVIOUS_SCRIPT"
echo "Previous working directory: $PREVIOUS_CWD"
echo "Previous release: ${PREVIOUS_RELEASE:-legacy}"

# Health check with retries.
check_health() {
    local attempt
    for attempt in {1..12}; do
        if curl --fail --silent --show-error \
            --max-time 3 \
            --output /dev/null \
            "$HEALTH_URL"; then
            return 0
        fi
        sleep 5
    done
    return 1
}

restore_pointer() {
    if [[ -n "$PREVIOUS_RELEASE" ]]; then
        local temp_link
        temp_link="$BASE/.rollback-$$"
        ln -s "$PREVIOUS_RELEASE" "$temp_link"
        mv -Tf "$temp_link" "$CURRENT"
    else
        rm -f -- "$CURRENT"
    fi
}

# Refuse activation if the existing backend is unhealthy.
# An unhealthy backend is not a safe rollback target.
if ! curl --fail --silent --show-error \
    --max-time 5 \
    --output /dev/null \
    "$HEALTH_URL"; then
    echo "ERROR: Existing backend is unhealthy. Activation aborted." >&2
    exit 1
fi

if [[ "$MODE" == "--dry-run" ]]; then
    echo "DRY RUN: Backend activation prerequisites passed."
    echo "Target release: $RELEASE"
    echo "Previous script: $PREVIOUS_SCRIPT"
    echo "Previous working directory: $PREVIOUS_CWD"
    echo "No release pointers or PM2 processes were changed."
    exit 0
fi

ACTIVATION_STARTED=false
ROLLBACK_RUNNING=false

rollback() {
    local status=$?

    if [[ "$ACTIVATION_STARTED" != true ||
          "$ROLLBACK_RUNNING" == true ]]; then
        return "$status"
    fi

    ROLLBACK_RUNNING=true
    trap - ERR

    trap - INT TERM
    set +e

    echo "ERROR: Activation failed. Restoring previous backend." >&2

    pm2 delete "$APP" 2>/dev/null || true

    restore_pointer || {
        echo "CRITICAL: Could not restore release pointer." >&2
        return 1
    }

    (
        cd "$PREVIOUS_CWD"
        pm2 start "$PREVIOUS_SCRIPT" \
            --name "$APP" \
            --cwd "$PREVIOUS_CWD" \
            --interpreter "$(command -v node)"
    ) || {
        echo "CRITICAL: Could not restart previous backend." >&2
        return 1
    }

    if check_health; then
        echo "Previous backend restored and healthy."
    else
        echo "CRITICAL: Previous backend health check failed." >&2
        return 1
    fi

    return 0
}

# Handle command failures and interruptions through one exit path.
handle_exit() {
    local status=$?

    trap - EXIT ERR INT TERM
    set +e

    if [[ "$ACTIVATION_STARTED" == true &&
          "$ROLLBACK_RUNNING" == false ]]; then
        if ! rollback; then
            echo "CRITICAL: Rollback failed; manual recovery required." >&2
            status=1
        fi
    fi

    rm -f -- "${TEMP_LINK:-}"
    exit "$status"
}

trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 1' ERR
trap handle_exit EXIT

# The first deployment must not overwrite an existing
# non-symlink current path.
if [[ -e "$CURRENT" && ! -L "$CURRENT" ]]; then
    echo "ERROR: Current release path is not a symlink." >&2
    exit 1
fi

TEMP_LINK="$BASE/.activate-$SHA-$$"

ln -s "$RELEASE" "$TEMP_LINK"

ACTIVATION_STARTED=true

# Switch active release pointer.
mv -Tf "$TEMP_LINK" "$CURRENT"

# Replace PM2 process with the new backend.
pm2 delete "$APP"

cd "$CURRENT/backend"

pm2 start dist/main.js \
    --name "$APP" \
    --cwd "$CURRENT/backend" \
    --interpreter "$(command -v node)"

echo "Checking backend health..."

if ! check_health; then
    echo "ERROR: New backend failed health checks." >&2
    false
fi

ACTIVATION_STARTED=false

echo "Backend activation successful: $SHA"
echo "PM2 process is healthy."
echo "PM2 startup configuration has not been saved."
