# Caddie frontend (SvelteKit)

SvelteKit app for Caddie. Local development runs on the host (Node + Vite); production builds use Docker under `docker/app/prod/`.

## Prerequisites

- Node.js 24+ (see [`.node-version`](.node-version))
- Optional: Docker for prod deploy or backing services on `caddie_network`

## Developing

```sh
npm ci
cp .env.sample .env   # required for dev; VITE_BACKEND_URL is read via loadEnv in vite.config.ts
npm run dev           # Vite on :5173; /api proxied to VITE_BACKEND_URL
```

`npm run dev` runs Vite and `svelte-check --watch` in parallel.

Format and lint:

```sh
npm run format   # oxfmt --write . && eslint --fix .
npm run lint     # oxfmt --check . && eslint .
```

Use the [Oxc VS Code extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) for format-on-save and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for lint fixes on save (see [`.vscode/settings.json`](.vscode/settings.json)).

Git hooks (installed via `npm ci` → `prepare`): **Husky** runs **lint-staged** on commit (`oxfmt --write` + `eslint --fix` on staged files).

## Building

```sh
npm run build
npm run preview
```

## Production (Docker)

From the repo root:

```sh
./docker/app/prod/build.sh
```

Prod stack: `docker/app/prod/compose.yml` (app + nginx on port 8080).
