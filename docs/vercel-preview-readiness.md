# Vercel Preview Readiness

Date: 2026-04-13

## Scope

This document covers the current `delta-public-beta` repository as a preview-deployment surface only.

Hard constraints applied during this pass:

- No production domain or DNS changes
- No backend or database contract changes
- No schema changes
- No new architecture
- No production secrets in code

## Architecture Summary

- Framework: Next.js 14 App Router
- UI: React 18, Tailwind CSS 4, local UI primitives under `components/ui`
- Runtime split:
  - Public marketing/preview routes under `app/*`
  - Server routes under `app/api/*`
  - Edge gating for protected preview routes in `middleware.ts`
  - Internal/orchestrator code under `lib/whalez-ai/*`
- Auth posture:
  - Public preview routes `/login` and `/signup` are currently informational, not full credential forms
  - Protected preview routes rely on an `access_token` cookie checked by `middleware.ts`
  - `/api/auth/*` contains a demo-mode shim plus a backend-proxy path that is not fully verified
- Data posture:
  - No direct database client, ORM, or schema migration layer is present in this repo
  - Public API data is static/stubbed or file-backed

## Assumptions That Affect Deployment

- Vercel preview deploys should use Linux SWC builds. Termux/Android remains smoke-only.
- The public beta can ship in `AUTH_DEMO_MODE=true` without breaking current preview behavior.
- The repo should not be relied on for production auth bridging until backend cookie/token behavior is documented.
- `WHALEZ_MODE=PUBLIC` is the intended public posture.
- `proxy.ts` is not treated as the canonical public-beta gate in the current Next 14 build path; `middleware.ts` is.

## Safe Changes Applied

- Consolidated Next config into one file: `next.config.mjs`
- Removed undeclared Vercel analytics imports from the root layout
- Replaced preview-critical UI dependency points with local implementations where safe:
  - `components/ui/label.tsx`
  - `components/ui/progress.tsx`
  - `components/ui/select.tsx`
  - `components/whalezchain/token-circulation.tsx`
- Added `.env.example` with grouped runtime variables
- Added this readiness note

## Remaining Compatibility Risk

### Auth bridge risk: stop before forcing

The non-demo `/api/auth/*` bridge is not safe to treat as verified against the existing backend contract.

Observed issues:

- Server-to-server `fetch()` calls do not currently forward incoming auth cookies explicitly.
- Backend `Set-Cookie` headers are not being relayed back to the browser.
- Protected-route middleware depends on a local `access_token` cookie, but the non-demo login path does not set that cookie locally.
- `README_INSTALL.md` still describes a fuller auth patch posture than the current public preview pages expose.

Result:

- Preview deployment is safe in demo/informational mode.
- Backend-auth compatibility remains a documented risk and should be verified before enabling non-demo auth in preview or production.

## Environment Variables

### Auth and backend bridge

- `AUTH_DEMO_MODE`
  - Used in `app/api/auth/_util.ts`
  - Controls demo-cookie behavior vs backend proxy behavior
- `NEXT_PUBLIC_API_URL`
  - Used in `app/api/auth/login/route.ts`
  - Used in `app/api/auth/signup/route.ts`
  - Used in `app/api/auth/logout/route.ts`
  - Used in `app/api/auth/me/route.ts`
  - Used in `app/api/auth/refresh/route.ts`
  - Required only when `AUTH_DEMO_MODE=false`

### Public/internal runtime mode

- `WHALEZ_MODE`
  - Used in `lib/whalez-ai/config.ts`
  - Controls public vs internal orchestrator behavior
- `EMAIL_PROVIDER`
  - Used in `lib/whalez-ai/config.ts`
  - Currently informational because email is disabled on this surface
- `WHALEZ_AUDIT_LOG`
  - Used in `lib/whalez-ai/layers/layer3.ts`
  - Enables server-side denied-action logging

### Local-only build flags

- `TERMUX`
  - Used in `next.config.mjs`
  - Keeps Termux/Android smoke-only
- `NEXT_DISABLE_SWC`
  - Present in ignored local env
  - Local-only
- `NEXT_FORCE_WASM`
  - Present in ignored local env
  - Local-only

### Inconsistent flag to watch

- `INTERNAL_MODE`
  - Referenced only in `proxy.ts`
  - The rest of the repo uses `WHALEZ_MODE`
  - Do not rely on this without normalizing the founder/internal path intentionally

## Preview Deployment Notes

- No direct database access was found in this repo.
- No schema changes are required for preview deployment.
- No production domain configuration is required or assumed.
- No `vercel.json` is currently required for a basic preview deploy.

## Recommended Next Steps

1. Deploy preview with:
   - `AUTH_DEMO_MODE=true`
   - `WHALEZ_MODE=PUBLIC`
2. Verify page rendering for:
   - `/`
   - `/beta-access`
   - `/simulation`
   - `/settlement`
   - `/whalezchain`
3. Verify protected-route behavior for:
   - `/dashboard`
   - `/account`
   - `/trading`
4. Before enabling non-demo auth, document:
   - Backend login response contract
   - Cookie names and domains
   - Refresh flow contract
   - Whether the backend expects bearer tokens, cookies, or both
