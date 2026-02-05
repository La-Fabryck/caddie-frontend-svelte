# TODO

- **Consider server-driven forms (later):** Use SvelteKit form actions + load instead of SPA mode: client submits to SvelteKit, SvelteKit proxies to NestJS, maps API errors to Superforms and returns `fail()`. Reuse `backendErrorsToFormErrors` + message maps on the server; no duplication of validation (NestJS stays source of truth).
