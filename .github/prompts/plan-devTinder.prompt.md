## Plan: Modern Clean Routing Foundation

Replace the legacy mixed routing setup with a single React Router data-router architecture that is minimal today (Body-first) but scalable for protected/private sections, while preserving path-prefix support and adding robust 404/error handling.

**Steps**
1. Phase 1 - Baseline and safety checks: confirm all active frontend route entry points and remove assumptions from the old HRMS route map before cutover.
2. Inventory active imports/usages of `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/Routes/AppRouting.tsx` and `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/Routes/routing.ts` to identify what can be removed immediately vs staged. *blocks phase 3 cleanup*
3. Phase 2 - Define clean route architecture: introduce a route tree centered on data router and nested structure.
4. Create a router root module (`Routes/index`) that owns `createBrowserRouter` and exports a single router instance for app bootstrap. *depends on step 2*
5. Create a minimal nested route config (`Routes/routes.config`) with:
   - Root route (layout + `Outlet`)
   - Public index route mapped to Body
   - Private parent route shell (auth guard + `Outlet`), even if no private child pages yet
   - Catch-all route (`*`) and/or router `errorElement` for 404/runtime routing errors
   *depends on step 4*
6. Keep `VITE_PATH_PREFIX` support by centralizing path building in one helper (either in routing constants or dedicated path utility) and ensure no double-slash behavior for empty/non-empty prefixes. *parallel with step 5 once module boundaries are decided*
7. Phase 3 - Auth guard modernization: replace old store-coupled guard with hook-driven shell.
8. Refactor `ProtectedRoute` into a route-element guard that reads auth state through hooks/selectors and renders `Navigate` + `Outlet` behavior (no direct store access at module scope). *depends on step 5*
9. Add redirect-state handling (`from`) for future post-login return navigation and keep guard behavior deterministic for initial auth-loading state. *depends on step 8*
10. Phase 4 - Application cutover: make the new router the only runtime path.
11. Update app bootstrap so `App` renders `RouterProvider` with the new router; remove duplicate/legacy route rendering paths. *depends on phases 2-3*
12. Decommission legacy route artifacts from old project (unused route constants and dead route definitions) only after successful cutover and usage verification. *depends on step 11*
13. Phase 5 - Validation and hardening.
14. Run route-behavior checks: `/` renders Body, unknown routes render 404, protected shell redirects unauthenticated users correctly.
15. Run static/build checks (`npm run build`, type checks, lint if configured) and verify there are no stale imports from removed route modules.
16. Manual smoke on prefixed and non-prefixed URLs to verify path-prefix compatibility.

**Relevant files**
- `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/main.tsx` — verify provider composition remains correct with data router.
- `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/App.tsx` — switch to single `RouterProvider` entry.
- `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/Routes/AppRouting.tsx` — legacy artifact to retire after cutover.
- `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/Routes/routing.ts` — keep/reshape as path constants + prefix helper source.
- `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/Routes/ProtectedRoute.tsx` — refactor into hook-based guard element.
- `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/Components/Body.tsx` — current only page route target.
- `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/Routes/index.tsx` — new data-router export surface.
- `/Users/krunal_kk/Desktop/Live-Projects/DevTinder/Frontend/src/Routes/routes.config.ts` — new nested route tree.

**Verification**
1. Runtime route checks in dev server: `/` should render Body without route warnings.
2. Unknown URL check: non-existent paths should render intentional 404/error UI.
3. Guard behavior check: protected parent route should redirect unauthenticated users to login route placeholder and preserve `from` state.
4. Prefix check: with and without `VITE_PATH_PREFIX`, route links and direct URL hits should resolve identically (no `//` path issues).
5. Build/type validation: frontend build and type-check pass with no references to retired legacy routing modules.

**Decisions**
- Use React Router data router now (`createBrowserRouter`) rather than keeping `BrowserRouter` wrappers.
- Include auth-ready routing shell in this cleanup, even with Body as the only concrete page currently.
- Keep `VITE_PATH_PREFIX` support in the new architecture.
- In scope: routing architecture cleanup, guard modernization shell, 404/error handling.
- Out of scope: building full login/dashboard pages or full auth state redesign.

**Further Considerations**
1. Recommended: add route metadata (title, auth-required flag) now if you expect quick page growth; it prevents future route-sprawl.
2. Recommended: decide whether 404 should be an `errorElement`, `*` route, or both; for most apps, both gives best UX and debug behavior.
3. Recommended: if auth bootstraps asynchronously, define a small “auth resolving” UI contract now to avoid redirect flicker later.