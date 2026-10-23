#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

# TML-1: Controlled frontend activation with rollback.
# REVIEW AND TEST BEFORE PRODUCTION USE.
#
# Usage:
#   sudo ./activate-frontend.sh <40-character-sha> --dry-run
#   sudo env TML_APPROVED_DEPLOYMENT=YES \
#     ./activate-frontend.sh <40-character-sha> --activate
#
# Requires:
#   - Amazon Linux / GNU coreutils
#   - A published, root-owned frontend release
#   - Nginx serving /var/www/tml
#   - Friday in Asia/Taipei for activation
#
# First activation:
#   Preserve the original /var/www/tml directory.
#
# Subsequent activations:
#   Atomically update the current release pointer.

fail() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

[[ "$(id -u)" -eq 0 ]] ||
    fail "Frontend activation requires root."

[[ $# -eq 2 ]] ||
    fail "Usage: script <40-character-sha> --dry-run|--activate"

SHA="$1"
MODE="$2"

[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] ||
    fail "Invalid lowercase Git SHA."

[[ "$MODE" == "--dry-run" || "$MODE" == "--activate" ]] ||
    fail "Invalid activation mode."

BASE="/var/www/tml-releases"
RELEASES="$BASE/releases"
RELEASE="$RELEASES/$SHA"

CURRENT="$BASE/current"
WEB_ROOT="/var/www/tml"
LEGACY="/var/www/tml-pre-tml1-20261023"

HOST="toblermodernizationlab.com"
HEALTH_URL="https://$HOST/"

LOCK="/var/lock/tml-frontend-activation.lock"

for tool in \
    curl grep find flock stat readlink \
    mv ln rm sleep head; do

    command -v "$tool" >/dev/null ||
        fail "Required command unavailable: $tool"
done

# Prevent concurrent frontend activation operations.
exec 9>"$LOCK"
flock -n 9 ||
    fail "Another frontend activation is running."

# Validate directory ownership and write permissions.
validate_directory() {
    local dir="$1"
    local mode

    [[ -d "$dir" && ! -L "$dir" ]] ||
        fail "Invalid directory: $dir"

    [[ "$(stat -c '%u' "$dir")" == "0" ]] ||
        fail "Directory must be root-owned: $dir"

    mode="$(stat -c '%a' "$dir")"

    (( (8#$mode & 8#022) == 0 )) ||
        fail "Directory is group/world writable: $dir"
}

validate_release() {
    validate_directory "$BASE"
    validate_directory "$RELEASES"
    validate_directory "$RELEASE"

    [[ -f "$RELEASE/index.html" &&
       ! -L "$RELEASE/index.html" ]] ||
        fail "Frontend index.html is missing or invalid."

    [[ -d "$RELEASE/assets" &&
       ! -L "$RELEASE/assets" ]] ||
        fail "Frontend assets directory is missing."

    [[ -z "$(find "$RELEASE" -type l -print -quit)" ]] ||
        fail "Frontend release contains symbolic links."

    # Ensure the published build contains a JavaScript asset.
    local asset

    asset="$(get_expected_asset "$RELEASE/index.html")"

    [[ -n "$asset" ]] ||
        fail "Frontend build has no expected JavaScript asset."

    [[ -f "$RELEASE$asset" ]] ||
        fail "Expected JavaScript asset is missing."
}

validate_layout() {
    if [[ -L "$WEB_ROOT" ]]; then
        [[ "$(readlink "$WEB_ROOT")" == "tml-releases/current" ]] ||
            fail "Unexpected frontend web-root symlink."

        [[ -L "$CURRENT" ]] ||
            fail "Active frontend pointer is missing."

        local current_target
        current_target="$(readlink "$CURRENT")"

        [[ "$current_target" =~ ^releases/[0-9a-f]{40}$ ]] ||
            fail "Unexpected active frontend pointer."

        [[ -d "$CURRENT" ]] ||
            fail "Active frontend release is missing."

        [[ "$(readlink -f "$CURRENT")" == "$RELEASES/"* ]] ||
            fail "Active frontend pointer escapes managed releases."

    elif [[ -d "$WEB_ROOT" ]]; then
        [[ ! -e "$CURRENT" && ! -L "$CURRENT" ]] ||
            fail "Unexpected active pointer during first activation."

        [[ ! -e "$LEGACY" && ! -L "$LEGACY" ]] ||
            fail "Legacy frontend backup already exists."

        [[ -f "$WEB_ROOT/index.html" ]] ||
            fail "Existing frontend index.html is missing."

    else
        fail "Unexpected frontend web-root layout."
    fi
}

get_expected_asset() {
    local index_file="$1"

    grep -oE '/assets/[^"]+\.js' "$index_file" |
        head -1 || true
}

# Verify that local Nginx serves the expected frontend build.
# -k is used only for direct origin testing because Cloudflare
# Origin CA certificates may not be trusted by curl.
verify_served_build() {
    local index_file="$1"
    local expected_asset
    local response_file

    [[ -f "$index_file" ]] || return 1

    expected_asset="$(get_expected_asset "$index_file")"
    [[ -n "$expected_asset" ]] || return 1

    response_file="$(mktemp)" || return 1

    if ! curl -ksS --fail --max-time 5 \
        --resolve "$HOST:443:127.0.0.1" \
        "$HEALTH_URL" \
        -o "$response_file"; then

        rm -f -- "$response_file"
        return 1
    fi

    if ! grep -Fq "$expected_asset" "$response_file"; then
        rm -f -- "$response_file"
        return 1
    fi

    rm -f -- "$response_file"

    curl -ksS --fail --max-time 5 \
        --resolve "$HOST:443:127.0.0.1" \
        "https://$HOST$expected_asset" \
        -o /dev/null
}

verify_with_retries() {
    local index_file="$1"
    local attempt

    for attempt in 1 2 3 4 5; do
        echo "Frontend verification attempt $attempt of 5"

        if verify_served_build "$index_file"; then
            return 0
        fi

        sleep 2
    done

    return 1
}

# Atomically replace the current release pointer.
set_pointer() {
    local target="$1"
    local temp="$BASE/.current-$$"

    [[ "$target" =~ ^releases/[0-9a-f]{40}$ ]] ||
        return 1

    [[ ! -e "$temp" && ! -L "$temp" ]] ||
        return 1

    ln -s "$target" "$temp" || return 1

    mv -Tf "$temp" "$CURRENT" || {
        rm -f -- "$temp"
        return 1
    }
}

ACTIVATION_STARTED=false
FIRST_ACTIVATION=false
PREVIOUS_TARGET=""
PREVIOUS_INDEX=""

rollback() {
    [[ "$ACTIVATION_STARTED" == true ]] || return 0

    echo "ERROR: Activation failed. Attempting frontend rollback." >&2

    local rollback_ok=true

    if [[ "$FIRST_ACTIVATION" == true ]]; then

        # Remove only the symlink created by this activation.
        if [[ -L "$WEB_ROOT" ]]; then
            if [[ "$(readlink "$WEB_ROOT")" == "tml-releases/current" ]]; then
                rm -- "$WEB_ROOT" || rollback_ok=false
            else
                rollback_ok=false
            fi
        fi

        # Restore the original production directory.
        if [[ "$rollback_ok" == true &&
              -d "$LEGACY" &&
              ! -e "$WEB_ROOT" &&
              ! -L "$WEB_ROOT" ]]; then

            mv -T "$LEGACY" "$WEB_ROOT" ||
                rollback_ok=false
        fi

        [[ -d "$WEB_ROOT" && ! -L "$WEB_ROOT" ]] ||
            rollback_ok=false

    else
        # Restore the previous versioned release.
        if [[ -n "$PREVIOUS_TARGET" ]]; then
            set_pointer "$PREVIOUS_TARGET" ||
                rollback_ok=false
        else
            rollback_ok=false
        fi
    fi

    # Confirm that Nginx serves the restored frontend.
    if [[ "$rollback_ok" == true ]]; then
        verify_with_retries "$PREVIOUS_INDEX" ||
            rollback_ok=false
    fi

    if [[ "$rollback_ok" == true ]]; then
        echo "Frontend rollback successful." >&2
        return 0
    fi

    echo "CRITICAL: Frontend rollback could not be verified." >&2
    return 1
}

on_failure() {
    local status="$1"

    trap - ERR INT TERM
    set +e

    if ! rollback; then
        echo "CRITICAL: Manual recovery may be required." >&2
    fi

    exit "$status"
}

trap 'on_failure $?' ERR
trap 'on_failure 130' INT
trap 'on_failure 143' TERM

# Validate all prerequisites before changing production.
validate_release
validate_layout

if [[ "$MODE" == "--dry-run" ]]; then
    echo "DRY RUN: Frontend activation prerequisites passed."
    echo "Target release: $RELEASE"
    echo "Active frontend: $WEB_ROOT"
    echo "No production application files or pointers were changed."
    exit 0
fi

[[ "${TML_APPROVED_DEPLOYMENT:-}" == "YES" ]] ||
    fail "Activation requires TML_APPROVED_DEPLOYMENT=YES."

[[ "$(TZ=Asia/Taipei date +%u)" == "5" ]] ||
    fail "Activation is restricted to Friday (Taiwan time)."

if [[ -L "$WEB_ROOT" ]]; then
    # Subsequent deployment.
    PREVIOUS_TARGET="$(readlink "$CURRENT")"
    PREVIOUS_INDEX="$CURRENT/index.html"

    # Resolve the previous index path before changing the pointer.
    PREVIOUS_INDEX="$(readlink -f "$PREVIOUS_INDEX")"

    ACTIVATION_STARTED=true
    set_pointer "releases/$SHA"

else
    # First deployment.
    FIRST_ACTIVATION=true
    PREVIOUS_INDEX="$WEB_ROOT/index.html"

    # The previous index will move with the legacy directory.
    PREVIOUS_INDEX="$LEGACY/index.html"

    ACTIVATION_STARTED=true

    mv -T "$WEB_ROOT" "$LEGACY"

    set_pointer "releases/$SHA"

    ln -s "tml-releases/current" "$WEB_ROOT"
fi

# Verify that Nginx serves the newly activated release.
if ! verify_with_retries "$RELEASE/index.html"; then
    echo "ERROR: New frontend failed HTTP verification." >&2
    false
fi

ACTIVATION_STARTED=false

echo "Frontend activation successful: $SHA"
echo "Active frontend: $RELEASE"
echo "Rollback verification is available for failed activations."
