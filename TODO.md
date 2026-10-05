# TODO

## v1 - UX polish and feature completeness (SvelteKit)

- Data fetching / loading state
  - Use cancellable requests (`AbortController`) for route changes and rapid interactions.
  - Standardize loading/error/empty states across pages.
  - Prefer SvelteKit `load` + invalidation patterns over ad-hoc client refetches.
- Lists
  - [x] Edit
  - [x] Remove
    - [x] List archive flag (`isArchived`) + paginated GET /list.
  - [x] Sort by `updatedAt`
  - Sync list detail UI state to the URL (`action`, `sortMode` on `list/[id]`): share/refresh/back; pairs with keeping search in login `?redirect=`.
- Items
  - [x] Edit
  - [x] Remove
  - [x] Sorting :
    - [x] Alphabetical order
    - [x] Fix case-insensitive sort behavior.
    - [x] By Item type
  - [x] Add item type.
  - [x] Add quantity support.
- Subscription
  - [x] Create share/subscription link for a list.
  - [x] Allow users to subscribe/join a shared list.
- Auth
  - [x] Preserve intended destination: redirect to login, then back to requested page.
  - Implement robust logout (clear local state and invalidate cached data).
- Browser/page polish
  - Set dynamic page title per route.
  - Add website icon (favicon + app icons if needed).
- DX / quality
  - [x] Lefthook (oxfmt + eslint on staged files + typecheck).
  - Blocked on Superforms 3: formsnap still peers v2 only — https://github.com/svecosystem/formsnap/issues/234 (keep `sveltekit-superforms` on 2.x until that lands).
- UI styling
  - Improve overall layout and visual hierarchy.
  - Refine Tailwind styling for consistent spacing and typography.
  - Add proper reusable loader/skeleton states.
  - Light toaster (shadcn-svelte sonner) for action/side-effect errors (e.g. item-type create, share revoke) so we stop inventing local error banners; keep field validation inline via `backendErrorsToFormErrors`.

## v2 - Improvements and real-time collaboration

- Auth (follow-ups from login redirect)
  - Remember: new authenticated `+page.server.ts` loads must call `redirectIfUnauthorized`.
  - Restore search/hash in `?redirect=` if deep links need more than pathname.
  - Client 401 mid-session: after refresh fails, send user to `/login?redirect=…` (load-more, mutations, etc.), not only SSR loads.
  - Create-account: after signup, either auto-login or keep `?redirect=` through a forced login.
  - SPA routes without server load (e.g. `/list/create`): unauthenticated users fail in the form — add load/guard when moving off SPA-only.
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
