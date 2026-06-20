# Delta Public Beta — Full Auth + Public Surface Patch (v1)

This patch adds **complete Sign up + Login**, protected dashboard routes, and public-surface API stubs to a Next.js App Router repo.

## 0) Prereqs
- Next.js App Router (`app/`), TS, Tailwind (you already have)
- A backend service (FastAPI `dpe-core`) will ultimately own real auth.
  - For NOW this patch includes a **local demo auth mode** so UI works immediately.
  - Swap the API base URL later to your real backend.

## 1) Files to copy into your repo root
Copy everything from this patch zip into:
`/workspace/delta-public-beta/`

It only adds new files + minimal safe edits.

## 2) Configure environment
Create or update `.env.local`:

NEXT_PUBLIC_API_URL=http://127.0.0.1:3004
AUTH_DEMO_MODE=true

- `AUTH_DEMO_MODE=true` enables demo auth (in-memory cookie session) so UI works now.
- When your FastAPI auth is ready, set `AUTH_DEMO_MODE=false` and point `NEXT_PUBLIC_API_URL` to it.

## 3) Run
pnpm dev

## 4) What you get
- /signup, /login
- /dashboard (protected)
- /account (protected)
- /trading (protected shell + watermark slot)
- /api/auth/* (login/signup/refresh/logout/me)
- /api/public/* (manifest/assets/events stubs)
- middleware protection for protected routes

## 5) Doctrine-safe defaults
- Founder console remains separate. Do NOT link it from public nav.
- Public surface returns only abstract, non-actionable events.

