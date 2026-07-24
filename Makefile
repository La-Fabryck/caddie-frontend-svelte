.PHONY: update update-doctor ncu-doctor-test install loc reset-dev help

update:
	npx --yes npm-check-updates --upgrade --interactive --format group

# Doctor: each upgrade = lint + typecheck + build (host)
update-doctor:
	@echo "Doctor upgrade (lint + typecheck + build gate)..."
	npx --yes npm-check-updates --upgrade --interactive --doctor --doctorTest "make ncu-doctor-test" --format group
	@echo "Update complete!"

# Fresh eslint run: cache can hide rule/plugin regressions after upgrades
ncu-doctor-test:
	rm -f .eslintcache
	npm run lint
	npm run typecheck
	npm run build

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
	@echo "  update-doctor  - Update dependencies with lint + typecheck + build gate"
	@echo "  reset-dev      - Tear down prod compose, recreate network"
	@echo "  install        - Install dependencies (npm ci)"
	@echo "  loc            - Count lines of code"
