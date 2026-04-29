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

**App Router layout:**
- `app/layout.tsx` — root layout with Geist fonts; also exports `Header` and `Footer` components (imported directly in `app/page.tsx`, not used in the layout itself)
- `app/page.tsx` — home page: renders `Header`, `BilletsList`, `Footer`
- `app/billets/[id]/page.tsx` — dynamic detail route for a single billet
- `app/components/billets.tsx` — async Server Component that fetches from the external API and renders the list
- `app/components/register.tsx` — registration component (stub, not yet wired up)

**External API:** `https://www.ryanfonseca.fr/b2lp/api/` is the backend. Key endpoints used:
- `GET /billets` — returns `Billet[]` (`id`, `Titre`, `Contenu`, `Date`), fetched with `cache: "no-store"`
- `POST /register` — target for the register form (not yet implemented)

**Styling:** Tailwind CSS v4 imported via `@import "tailwindcss"` in `globals.css`. Color palette in use: purple (header/accents), cyan (titles/links), slate (body text).

**ESLint:** flat config (`eslint.config.mjs`) with `typescript-eslint`, `eslint-plugin-react`, and `react/react-in-jsx-scope` disabled (React 19 JSX transform).
