# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

No test suite is configured.

## Architecture

**Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · deployed on Vercel at `https://b2lp-ryan.vercel.app`.

**Routes:**
- `/` → `app/page.tsx` → renders `<AllPosts />` (async Server Component — fetches billet list server-side)
- `/billets/[id]` → `app/billets/[id]/page.tsx` → renders `<Post />` (Client Component — requires auth, redirects to `/login` otherwise)
- `/login` → `app/login/page.tsx` → renders `<Login />`
- `/register` → `app/register/page.tsx` → renders `<Register />`
- `POST /api/auth/login` — Next.js proxy for Laravel Sanctum login (handles CSRF server-side)
- `POST /api/auth/register` — Next.js proxy for Sanctum register (same pattern)

**Auth flow:** Token-based (Bearer). After login, the token is stored in `localStorage` via `TOKEN_KEY` from `app/lib/auth.ts`. `BilletService.login()` calls the internal proxy route (not the external API directly) to avoid CORS and Sanctum CSRF restrictions. Client components call `isLoggedIn()` / `getAuthToken()` from `app/lib/auth.ts`. The `<Header />` component watches `usePathname()` and re-checks `isLoggedIn()` on every route change to stay in sync.

**Logout is client-only:** `BilletService.logout()` only removes the token from `localStorage` — it does not call the server. `ENDPOINTS.logout` (`/user/logout`) is defined in `api-config.ts` but intentionally unused.

**Service layer:** `app/services/BilletService.ts` is the single point of contact with the backend. All fetch calls go through `BilletService.request()`, which attaches the Bearer token when `auth: true` is passed. The login/register methods call the internal Next.js proxy routes instead of the external API directly.

**Proxy routing (important):** `BilletService.request()` picks its base URL based on environment. In the browser (`typeof window !== "undefined"`) it routes through the catch-all proxy `/api/proxy` (`app/api/proxy/[...path]/route.ts`); in Server Components it calls `API_BASE_URL` directly. The proxy exists because the external API only whitelists the Vercel production domain, so direct browser calls (e.g. from localhost) would be blocked by CORS. The proxy forwards the `Authorization` and `Content-Type` headers and returns the upstream response verbatim.

**External API:** Two base URLs are defined in `app/lib/api-config.ts`:
- `API_BASE_URL` = `https://www.ryanfonseca.fr/b2lp/api` — used for all API calls
- `APP_BASE_URL` = `https://www.ryanfonseca.fr/b2lp` — used only to fetch the Sanctum CSRF cookie in the login proxy

Endpoints:
- `GET /billets` → list of billets (`Billet[]`)
- `GET /billets/{id}` → billet + nested `Commentaires[]` (requires auth)
- `POST /commentaires` → submit a comment (requires auth; payload: `COM_CONTENU`, `billet_id`, `user_id` — note the `COM_` prefix on the content field)
- `GET /user` → current user info (requires auth)
- `POST /login` / `POST /register` → called via the proxy routes, not directly from the browser

**Types:** All shared types live in `app/types.ts`: `Billet`, `BilletDetail` (extends `Billet` with `Commentaires[]`), `Commentaire`, `CurrentUser`. The API returns capitalized French field names (`Titre`, `Contenu`, `Date`, `Auteur`) which are mostly optional in the types; `CurrentUser` is the exception (`id`, `nom`, `email`, all required).

**Security headers:** `next.config.ts` sets a strict CSP plus `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` on all routes, and `Cache-Control: no-store` on `/login` and `/register`. The CSP `connect-src 'self'` only works because all browser API calls go through the same-origin `/api/proxy` route — adding a direct external fetch from a Client Component would require widening the CSP. `script-src` keeps `unsafe-inline`/`unsafe-eval` because Next.js requires them.

**Utilities:** `app/lib/utils.ts` exports `formatDate(dateStr)` — formats an ISO date string to French locale (e.g. "12 avril 2025"). Used by `<Post />` and `<AllPosts />`.

**Styling:** Tailwind CSS v4 imported via `@import "tailwindcss"` in `globals.css`. Color palette: violet (primary/accents), slate (text/borders), red (errors). Components use Tailwind utility classes directly — no CSS modules.

**ESLint:** flat config (`eslint.config.mjs`) with `typescript-eslint`, `eslint-plugin-react`, and `react/react-in-jsx-scope` disabled (React 19 JSX transform).

## Key constraints

- The Laravel API returns the auth token as **plain text** (not JSON). The `/api/auth/login` proxy normalizes it to `{ auth_token: "..." }` before returning to the client.
- The API field for login is `email`, not `mail` (despite what older docs may say).
- `BilletDetail` fetching requires the user to be authenticated; unauthenticated requests will fail at the API level.
