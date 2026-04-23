# TODO

## v1 - UX polish and feature completeness (SvelteKit)

- Data fetching / loading state
  - Use cancellable requests (`AbortController`) for route changes and rapid interactions.
  - Standardize loading/error/empty states across pages.
  - Prefer SvelteKit `load` + invalidation patterns over ad-hoc client refetches.
- Lists
  - [x] Edit
  - [x] Remove
  - Add list status flag (`active` / `inactive`).
  - Fix stale data after creating a list (invalidate or refresh the right data source).
  - Sorting
    - [x] Sort by `updatedAt`
- Items
  - [x] Edit
  - [x] Remove
  - Sorting :
    - [x] Alphabetical order
    - [x] Fix case-insensitive sort behavior.
  - Add item type.
  - [x] Add quantity support.
- Subscription
  - Create share/subscription link for a list.
  - Allow users to subscribe/join a shared list.
- Auth
  - Preserve intended destination: redirect to login, then back to requested page.
  - Implement robust logout (clear local state and invalidate cached data).
- Browser/page polish
  - Set dynamic page title per route.
  - Add website icon (favicon + app icons if needed).
- DX / quality
  - Add or finish Husky hooks (lint, format, checks on commit).
- UI styling
  - Improve overall layout and visual hierarchy.
  - Refine Tailwind styling for consistent spacing and typography.
  - Add proper reusable loader/skeleton states.



## v2 - Improvements and real-time collaboration

- Lists
  - Create a new list from missing items.
- Consider server-driven forms (later)
  - Use SvelteKit form actions + `load` instead of SPA-only form submission.
  - Let SvelteKit proxy to NestJS and map API errors to Superforms via `fail()`.
  - Keep NestJS as validation source of truth (no duplicated validation rules).
- Real-time updates
  - Evaluate SSE integration for live list/item updates.
  - References:
    - https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
    - https://github.com/nestjs/nest/issues/12670
- Ops
  - Add PM2-based monitoring/restart strategy for backend deployment:
    - https://pm2.keymetrics.io/
