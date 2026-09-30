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


## 6) Runtime-backed platform domains

The public gateway now exposes authenticated BFF routes for:
- `/account`
- `/settings`
- `/settings/security`
- `/portfolio`
- `/signals`
- `/coach`

Additional runtime-backed domain APIs cover banking read models, escrow state, trading order state, and settlement intents.

The browser is not the financial source of truth.

### Required internal bridge configuration

In non-demo environments, configure:

    WHALEZ_CORE_PLATFORM_URL=http://127.0.0.1:8081
    WHALEZ_SERVICE_AUTH_SECRET=<32+ random characters>

The same service-auth secret must be available to Whalez-AI Core. The bridge mints short-lived service identities per authenticated request; no browser request carries a service token.

These values are server-side secrets and must never be committed to Git.

### Current capability lifecycle

Account/profile/settings/security view: IMPLEMENTED, not independently LIVE.

Portfolio/signals/coach: IMPLEMENTED as runtime-backed domain services; portfolio is a read model, signals are observational, coach is educational-context mode.

Trading/investment: existing simulation capabilities remain intact; live execution still requires provider routes and authorization.

Banking: provider-linked read model; no fabricated customer funds.

Escrow: persisted governed state; live release still depends on provider/WhalezChain authority.

Settlement: existing NGN/Paystack live corridor retained, with canonical WhalezChain WHZ bond state now required for live authorization.

See:
- `docs/architecture/FULL_ECOSYSTEM_DOMAIN_MAP_V1.md`
- `docs/architecture/REPOSITORY_RESPONSIBILITY_MATRIX_V1.md`