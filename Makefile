.PHONY: update update-doctor install dedupe lint format loc help

update:
	docker compose run --rm frontend npx --yes npm-check-updates -u -i --format group

# Like update, but npm-check-updates doctor mode: upgrades that fail lint or e2e are reverted (Compose starts postgres for e2e).
update-doctor:
	@echo "Doctor upgrade (lint gate)..."
	docker compose run --rm frontend npx --yes npm-check-updates --doctor -u -i --doctorTest "npm run lint" --format group
	@echo "Update complete!"

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
	@echo "  install  - Install dependencies"
	@echo "  lint     - Invoke lint command"
	@echo "  format   - Invoke format command"
	@echo "  loc      - Counts Lines of Code"