# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Next.js with Turbopack)
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

No test suite is configured.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · deployed on Vercel.

**Routes:**
- `/` → `app/page.tsx` → renders `<AllPosts />` (async Server Component — fetches billet list server-side)
- `/billets/[id]` → `app/billets/[id]/page.tsx` → renders `<Post />` (Client Component — requires auth, redirects to `/login` otherwise)
- `/login` → `app/login/page.tsx` → renders `<Login />`
- `/register` → `app/register/page.tsx` → renders `<Register />`
- `POST /api/auth/login` — Next.js proxy for Laravel Sanctum login (handles CSRF server-side)
- `POST /api/auth/register` — Next.js proxy for Sanctum register (same pattern)

**Auth flow:** Token-based (Bearer). After login, the token is stored in `localStorage` via `TOKEN_KEY` from `app/lib/auth.ts`. `BilletService.login()` calls the internal proxy route (not the external API directly) to avoid CORS and Sanctum CSRF restrictions. Client components call `isLoggedIn()` / `getAuthToken()` from `app/lib/auth.ts`.

**Service layer:** `app/services/BilletService.ts` is the single point of contact with the backend. All fetch calls go through `BilletService.request()`, which attaches the Bearer token when `auth: true` is passed. The login/register methods call the internal Next.js proxy routes instead of the external API directly.

**External API:** `https://www.ryanfonseca.fr/b2lp/api/` (Laravel backend). All endpoints are defined in `app/lib/api-config.ts`:
- `GET /billets` → list of billets (`Billet[]`)
- `GET /billets/{id}` → billet + nested `Commentaires[]` (requires auth)
- `POST /commentaires` → submit a comment (requires auth; payload: `contenu`, `date`, `billet_id`, `user_id`)
- `GET /user` → current user info (requires auth)
- `POST /login` / `POST /register` → called via the proxy routes, not directly from the browser

**Types:** All shared types live in `app/types.ts`: `Billet`, `BilletDetail` (extends `Billet` with `Commentaires[]`), `Commentaire`, `CurrentUser`.

**Styling:** Tailwind CSS v4 imported via `@import "tailwindcss"` in `globals.css`. Color palette: violet (primary/accents), slate (text/borders), red (errors). Components use Tailwind utility classes directly — no CSS modules.

**ESLint:** flat config (`eslint.config.mjs`) with `typescript-eslint`, `eslint-plugin-react`, and `react/react-in-jsx-scope` disabled (React 19 JSX transform).

## Key constraints

- The Laravel API returns the auth token as **plain text** (not JSON). The `/api/auth/login` proxy normalizes it to `{ auth_token: "..." }` before returning to the client.
- The API field for login is `email`, not `mail` (despite what older docs may say).
- `BilletDetail` fetching requires the user to be authenticated; unauthenticated requests will fail at the API level.
