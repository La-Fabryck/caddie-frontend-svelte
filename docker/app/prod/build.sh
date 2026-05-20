#!/usr/bin/env sh
# Prod Docker: start stack (detached, build). Run from repo root: ./docker/app/prod/build.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"

if [ ! -f "$SCRIPT_DIR/.env" ]; then
	echo "Error: $SCRIPT_DIR/.env is missing. Copy .env.sample to .env and set the variables." >&2
	exit 1
fi

cd "$ROOT_DIR"

export COMPOSE_BAKE=true
exec docker compose -f docker/app/prod/compose.yml up -d --build

