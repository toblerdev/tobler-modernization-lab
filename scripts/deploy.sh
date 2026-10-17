
#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

# TML-1: Download and stage an approved S3 release.
# Does NOT activate or restart the application.

BUCKET="tml-deployment-artifacts-779400169960-us-east-2-an"
REGION="us-east-2"
RELEASES_DIR="/home/ec2-user/tml-releases/releases"
CONFIG_FILE="/home/ec2-user/tml-config/backend.env"
LOCK_FILE="/home/ec2-user/.tml-deploy.lock"

if [[ "$(id -un)" != "ec2-user" ]]; then
    echo "ERROR: Run this script as ec2-user." >&2
    exit 1
fi

DEPLOY_SHA="${1:-}"

if [[ ! "$DEPLOY_SHA" =~ ^[0-9a-f]{40}$ ]]; then
    echo "ERROR: Supply a lowercase 40-character commit SHA." >&2
    exit 1
fi

for tool in aws sha256sum tar flock mktemp python3; do
    if ! command -v "$tool" >/dev/null 2>&1; then
        echo "ERROR: Missing required tool: $tool" >&2
        exit 1
    fi
done

exec 9>"$LOCK_FILE"

if ! flock -n 9; then
    echo "ERROR: Another deployment is running." >&2
    exit 1
fi

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "ERROR: Shared backend configuration is missing." >&2
    exit 1
fi

NEW_RELEASE="$RELEASES_DIR/$DEPLOY_SHA"

if [[ -e "$NEW_RELEASE" || -L "$NEW_RELEASE" ]]; then
    echo "ERROR: Release already exists: $NEW_RELEASE" >&2
    exit 1
fi

WORK_DIR="$(mktemp -d /home/ec2-user/tml-stage.XXXXXX)"
STAGING_DIR=""

cleanup() {
    local status=$?
    trap - EXIT

    if [[ -n "$STAGING_DIR" && -d "$STAGING_DIR" ]]; then
        rm -rf -- "$STAGING_DIR"
    fi

    rm -rf -- "$WORK_DIR"
    exit "$status"
}
trap cleanup EXIT

PREFIX="releases/$DEPLOY_SHA"

echo "Downloading approved artifact: $DEPLOY_SHA"

aws s3 cp \
    "s3://$BUCKET/$PREFIX/release.tar.gz" \
    "$WORK_DIR/release.tar.gz" \
    --region "$REGION"

aws s3 cp \
    "s3://$BUCKET/$PREFIX/release.tar.gz.sha256" \
    "$WORK_DIR/release.tar.gz.sha256" \
    --region "$REGION"

# Validate the checksum file format before using it.
python3 - "$WORK_DIR/release.tar.gz.sha256" <<'PY'
import re
import sys
from pathlib import Path

checksum_file = Path(sys.argv[1])
content = checksum_file.read_bytes()

if not re.fullmatch(
    rb"[0-9a-f]{64}  release\.tar\.gz\n",
    content,
):
    raise SystemExit("ERROR: Invalid release checksum file")

print("Checksum file format validated.")
PY

# Reject unexpectedly large release archives.
MAX_ARCHIVE_BYTES=$((500 * 1024 * 1024))
ARCHIVE_BYTES="$(wc -c < "$WORK_DIR/release.tar.gz")"

if (( ARCHIVE_BYTES > MAX_ARCHIVE_BYTES )); then
    echo "ERROR: Release archive exceeds 500 MiB." >&2
    exit 1
fi

echo "Verifying SHA-256 checksum..."

(
    cd "$WORK_DIR"
    sha256sum -c release.tar.gz.sha256
)

# Inspect archive entries before extraction.
# The archive must contain only relative, regular paths.
python3 - "$WORK_DIR/release.tar.gz" <<'PY'
import sys
import tarfile

archive = sys.argv[1]
allowed = (
    "backend/dist/",
    "backend/node_modules/",
    "frontend/dist/",
)

MAX_EXTRACTED_BYTES = 2 * 1024 * 1024 * 1024
MAX_ENTRIES = 100_000

with tarfile.open(archive, "r:gz") as tar:
    seen_paths = set()
    total_bytes = 0
    entry_count = 0

    for member in tar:
        entry_count += 1

        if entry_count > MAX_ENTRIES:
            raise SystemExit(
                "ERROR: Archive contains too many entries"
            )

        if member.isfile():
            total_bytes += member.size

            if total_bytes > MAX_EXTRACTED_BYTES:
                raise SystemExit(
                    "ERROR: Archive exceeds 2 GiB uncompressed"
                )

        if member.name in (".", "./"):
            if not member.isdir():
                raise SystemExit("Invalid archive root entry")
            continue

        path = member.name.removeprefix("./")
        normalized = path.rstrip("/")

        if normalized in seen_paths:
            raise SystemExit(
                f"Duplicate archive entry: {member.name}"
            )

        seen_paths.add(normalized)

        # Reject unsafe paths before normalization.
        if path.startswith("/") or "\\" in path:
            raise SystemExit(
                f"Unsafe archive path: {member.name}"
            )

        parts = path.rstrip("/").split("/")

        if not parts or any(p in ("", ".", "..") for p in parts):
            raise SystemExit(
                f"Unsafe archive path: {member.name}"
            )

        if member.issym() or member.islnk():
            raise SystemExit(
                f"Archive link not allowed: {member.name}"
            )

        if not (member.isfile() or member.isdir()):
            raise SystemExit(
                f"Unsupported archive entry: {member.name}"
            )

        # Reject setuid, setgid, and sticky permission bits.
        if member.mode & 0o7000:
            raise SystemExit(
                f"Unsafe archive permissions: {member.name}"
            )

        if not (
            path in (
                "backend",
                "frontend",
                "backend/dist",
                "backend/node_modules",
                "frontend/dist",
                "backend/package.json",
                "backend/package-lock.json",
            )
            or any(path.startswith(prefix) for prefix in allowed)
        ):
            raise SystemExit(
                f"Unexpected archive entry: {member.name}"
            )

print("Archive entry validation passed.")
PY

mkdir -p "$RELEASES_DIR"

STAGING_DIR="$(mktemp -d "$RELEASES_DIR/.staging.XXXXXXXX")"

echo "Extracting release into staging..."

tar -xzf "$WORK_DIR/release.tar.gz" \
    -C "$STAGING_DIR" \
    --no-same-owner \
    --no-same-permissions

if [[ ! -f "$STAGING_DIR/backend/dist/main.js" ]]; then
    echo "ERROR: Backend entry point missing." >&2
    exit 1
fi

if [[ ! -f "$STAGING_DIR/frontend/dist/index.html" ]]; then
    echo "ERROR: Frontend index.html missing." >&2
    exit 1
fi

if [[ ! -d "$STAGING_DIR/backend/node_modules" ]]; then
    echo "ERROR: Backend runtime dependencies missing." >&2
    exit 1
fi

ln -s "$CONFIG_FILE" "$STAGING_DIR/backend/.env"

# Atomically publish the staged release without replacing an existing one.
python3 - "$STAGING_DIR" "$NEW_RELEASE" <<'PY'
import ctypes
import os
import sys

source = os.fsencode(sys.argv[1])
destination = os.fsencode(sys.argv[2])

libc = ctypes.CDLL(None, use_errno=True)
renameat2 = libc.renameat2

renameat2.argtypes = [
    ctypes.c_int,
    ctypes.c_char_p,
    ctypes.c_int,
    ctypes.c_char_p,
    ctypes.c_uint,
]

renameat2.restype = ctypes.c_int

AT_FDCWD = -100
RENAME_NOREPLACE = 1

result = renameat2(
    AT_FDCWD, source,
    AT_FDCWD, destination,
    RENAME_NOREPLACE,
)

if result != 0:
    error = ctypes.get_errno()
    raise OSError(
        error,
        os.strerror(error),
        os.fsdecode(destination),
    )

print("Release directory published atomically.")
PY

STAGING_DIR=""

echo "Release staged successfully: $NEW_RELEASE"
echo "No application processes were restarted."
echo "No frontend files were published."
