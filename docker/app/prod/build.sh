#!/usr/bin/env sh
# Docker only reads .dockerignore from the build context root (repo root).
# This script copies the prod ignore file there for the build, then runs compose.
# Run from repo root: ./docker/app/prod/build.sh [compose args...]
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"

if [ ! -f "$SCRIPT_DIR/.env" ]; then
	echo "Error: $SCRIPT_DIR/.env is missing. Copy .env.sample to .env and set the variables." >&2
	exit 1
fi

cp "$SCRIPT_DIR/.dockerignore" "$ROOT_DIR/.dockerignore"
cd "$ROOT_DIR"

export COMPOSE_BAKE=true
exec docker compose -f docker/app/prod/compose-prod.yml up -d --build

