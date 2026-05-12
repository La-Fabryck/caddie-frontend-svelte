.PHONY: update update-doctor install dedupe lint format loc reset-dev help

update:
	docker compose run --rm frontend npx --yes npm-check-updates --upgrade --interactive --format group

# Like update, but npm-check-updates doctor mode: upgrades that fail lint or e2e are reverted (Compose starts postgres for e2e).
update-doctor:
	@echo "Doctor upgrade (lint gate)..."
	docker compose run --rm frontend npx --yes npm-check-updates --upgrade --interactive --doctor --doctorTest "npm run lint" --format group
	@echo "Update complete!"

# Reset to clean dev: remove prod+dev stack resources, ensure network, remove root .dockerignore (copied by prod build.sh)
reset-dev:
	@echo "Stopping and removing prod stack resources (containers, images, volumes)..."
	docker compose -f docker/app/prod/compose.yml down -v --rmi all --remove-orphans
	@echo "Stopping and removing dev stack resources (containers, images, volumes)..."
	docker compose down -v --rmi all --remove-orphans
	@echo "Ensuring dev network exists..."
	docker network create caddie_network || true
	@echo "Removing root .dockerignore (copied by prod build)..."
	rm -f .dockerignore
	@echo "Dev environment reset complete. Start dev with: docker compose up"

# Install dependencies
install:
	@echo "Create the network"
	docker network create caddie_network || true

	@echo "Pull docker dependencies"
	docker compose pull

	@echo "Install the dependencies"
	docker compose run --rm frontend npm ci

dedupe:
	docker compose run --rm frontend npm dedupe

lint:
	docker compose run --rm frontend npm run lint

format:
	docker compose run --rm frontend npm run format

loc:
	npx --yes cloc --exclude-dir=node_modules,dist,coverage,.svelte-kit,static,build --exclude-list-file=package-lock.json .

# Help target
help:
	@echo "Available targets:"
	@echo "  update         - Update dependencies"
	@echo "  update-doctor  - Update dependencies with lint gate"
	@echo "  reset-dev      - Tear down prod+dev compose, recreate network, remove root .dockerignore"
	@echo "  install  - Install dependencies"
	@echo "  lint     - Invoke lint command"
	@echo "  format   - Invoke format command"
	@echo "  loc      - Counts Lines of Code"