.PHONY: update install dedupe lint format loc help

update:
	docker compose run --rm frontend npx --yes npm-check-updates -u -i --format group

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
	npx --yes cloc --exclude-dir=node_modules,dist,coverage,.svelte-kit,static --exclude-list-file=package-lock.json .

# Help target
help:
	@echo "Available targets:"
	@echo "  update   - Update all dependencies except fastify"
	@echo "  deps     - Alias for update"
	@echo "  check    - Check for available updates (dry run)"
	@echo "  versions - Show current Fastify package versions"
	@echo "  install  - Install dependencies"
	@echo "  lint     - Invoke lint command"
	@echo "  format   - Invoke format command"
	@echo "  loc      - Counts Lines of Code"