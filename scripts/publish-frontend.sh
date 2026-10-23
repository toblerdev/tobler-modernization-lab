
#!/usr/bin/env bash
set -Eeuo pipefail

# TML-1: Publish a staged React build.
# Run only through an approved, trusted deployment process.
# This script does not activate the published release.

if [[ "$(id -u)" -ne 0 ]]; then
    echo "ERROR: Frontend publishing requires root." >&2
    exit 1
fi

DEPLOY_SHA="${1:-}"

if [[ ! "$DEPLOY_SHA" =~ ^[0-9a-fA-F]{40}$ ]]; then
    echo "ERROR: A full 40-character Git SHA is required." >&2
    exit 1
fi

SOURCE_DIR="/home/ec2-user/tml-releases/releases/$DEPLOY_SHA/frontend/dist"
RELEASE_BASE="/var/www/tml-releases"
RELEASES_DIR="$RELEASE_BASE/releases"
DEST_DIR="$RELEASES_DIR/$DEPLOY_SHA"

echo "Publishing frontend release: $DEPLOY_SHA"

# Verify the staged React build.
if [[ ! -f "$SOURCE_DIR/index.html" ||
      -L "$SOURCE_DIR" ||
      -L "$SOURCE_DIR/index.html" ]]; then
    echo "ERROR: Invalid staged frontend build." >&2
    exit 1
fi

# Verify the source's expected parent directories.
for DIR in \
    "/home/ec2-user/tml-releases" \
    "/home/ec2-user/tml-releases/releases" \
    "/home/ec2-user/tml-releases/releases/$DEPLOY_SHA" \
    "/home/ec2-user/tml-releases/releases/$DEPLOY_SHA/frontend"; do

    if [[ ! -d "$DIR" || -L "$DIR" ]]; then
        echo "ERROR: Invalid source directory: $DIR" >&2
        exit 1
    fi
done

# Refuse to follow an unexpected destination symlink.
if [[ -L "$RELEASE_BASE" || -L "$RELEASES_DIR" ]]; then
    echo "ERROR: Frontend release path contains a symlink." >&2
    exit 1
fi

# Check existing release-directory ownership.
for DIR in "$RELEASE_BASE" "$RELEASES_DIR"; do
    if [[ -e "$DIR" ]]; then
        if [[ ! -d "$DIR" ||
              "$(stat -c '%u' "$DIR")" != "0" ]]; then
            echo "ERROR: Unsafe release directory: $DIR" >&2
            exit 1
        fi

        MODE=$(stat -c '%a' "$DIR")
        if (( (8#$MODE & 8#022) != 0 )); then
            echo "ERROR: Release directory is group/world writable: $DIR" >&2
            exit 1
        fi
    fi
done

# Do not overwrite an existing release.
if [[ -e "$DEST_DIR" || -L "$DEST_DIR" ]]; then
    echo "ERROR: Frontend release already exists." >&2
    exit 1
fi

# Create root-owned release directories.
install -d -o root -g root -m 755 "$RELEASE_BASE"
install -d -o root -g root -m 755 "$RELEASES_DIR"

# Create a private temporary staging directory.
TEMP_DIR=$(mktemp -d "$RELEASES_DIR/.staging.XXXXXXXX")

cleanup() {
    local status=$?

    if [[ -n "${TEMP_DIR:-}" && -d "$TEMP_DIR" ]]; then
        rm -rf -- "$TEMP_DIR"
    fi

    exit "$status"
}

trap cleanup EXIT

#####################################
# # Copy the frontend build without preserving source ownership.
# rsync -r --copy-links \
#     --exclude='.env' \
#     --exclude='.env.*' \
#     --exclude='.git' \
#     "$SOURCE_DIR/" "$TEMP_DIR/"

# Reject symbolic links anywhere in the staged frontend build.
if [[ -n "$(find "$SOURCE_DIR" -type l -print -quit)" ]]; then
    echo "ERROR: Frontend build contains symbolic links." >&2
    exit 1
fi

# Copy frontend files without following symbolic links.
rsync -r \
    --exclude='.env' \
    --exclude='.env.*' \
    --exclude='.git' \
    "$SOURCE_DIR/" "$TEMP_DIR/"
#####################################

# Set permissions for Nginx.
chown -R root:root "$TEMP_DIR"
chmod -R u=rwX,go=rX "$TEMP_DIR"

# Verify copied build.
if [[ ! -f "$TEMP_DIR/index.html" ]]; then
    echo "ERROR: Published build verification failed." >&2
    exit 1
fi

# Finalize the versioned release.
# mv -T refuses to place the source inside an existing directory.
if [[ -e "$DEST_DIR" || -L "$DEST_DIR" ]]; then
    echo "ERROR: Destination appeared during publishing." >&2
    exit 1
fi

mv -T -- "$TEMP_DIR" "$DEST_DIR"
TEMP_DIR=""

echo "Frontend release published successfully."
echo "Release location: $DEST_DIR"
echo "Active website remains unchanged."
