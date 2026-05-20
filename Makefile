.PHONY: update update-doctor install loc reset-dev help

update:
	npx --yes npm-check-updates --upgrade --interactive --format group

# Like update, but npm-check-updates doctor mode: upgrades that fail lint are reverted.
update-doctor:
	@echo "Doctor upgrade (lint gate)..."
	npx --yes npm-check-updates --upgrade --interactive --doctor --doctorTest "npm run lint" --format group
	@echo "Update complete!"

# Reset prod Docker stack and optional external network for prod compose.
reset-dev:
	@echo "Stopping and removing prod stack resources (containers, images, volumes)..."
	docker compose -f docker/app/prod/compose.yml down -v --rmi all --remove-orphans
	@echo "Ensuring prod network exists..."
	docker network create caddie_network || true
	@echo "Dev environment reset complete. Start dev with: npm run dev"

install:
	npm ci

loc:
	npx --yes cloc --exclude-dir=node_modules,dist,coverage,.svelte-kit,static,build --exclude-list-file=package-lock.json .

help:
	@echo "Available targets:"
	@echo "  update         - Update dependencies"
	@echo "  update-doctor  - Update dependencies with lint gate"
	@echo "  reset-dev      - Tear down prod compose, recreate network"
	@echo "  install        - Install dependencies (npm ci)"
	@echo "  loc            - Count lines of code"
