# DeltaAlpha-Trade-Pro Admin Control Panel — staging contract

Status: NOT ACTIVATED; read-only, deny-by-default.

- Canonical eventual hostname: `console.deltaalpha-trade-pro.com`.
- Separate from `alpha.deltaalpha-trade-pro.com` (private Founder Console).
- This repository contains an application route, not an instruction to attach the hostname or deploy a new Vercel project.
- `ADMIN_CONTROL_PANEL_ENABLED` is unset by default; all requests receive 404.
- Activation additionally requires server-originated `role=admin`, `email_verified=true`, and `mfa_verified=true` from the authenticated Runplane `/auth/me` bridge. The legacy backend does not yet supply the MFA claim; activation remains blocked until independently verified.
- No browser-controlled cookie claims are trusted as role authority: the server route calls Runplane `/auth/me` using the auth bridge, and Runplane resolves the session against stored account state.
- This scaffold provides no direct write actions, finance, minting, Founder/ROOT authority, secure-shell or internal execution.
- Before publication, independently review the Runplane admin endpoints for CSRF, HTML encoding, session binding and MFA; never proxy the legacy /admin HTML directly to the Internet.
- Test unauthorized, customer, non-MFA and administrator sessions; verify each API independently before adding any admin mutations.
- Public hostname cutover remains a separate operational decision: first remove old Vercel Founder association, assign the correct Admin app, capture DNS backup, then switch CNAME and verify rollback and access.

## Admin Console expanded in this branch — evidence and boundaries

Application: `app/admin-control/page.tsx`. It provides account-operation workspaces, customer-care oversight, Whalez-Mail/Resend, Tidio/Lyro, governed public AI modes, identity/audit and PTN/PRN/WHZ readiness labels. These are **administrative views**, not financial actions or verified production dashboards.

Authoritative server access check: `lib/admin-console/authorization.ts` uses the deployed Runplane authentication bridge, with the pure authorization predicates in `lib/admin-console/policy.ts`.

Denied by default unless **all** are true:
- `ADMIN_CONTROL_PANEL_ENABLED=true` is explicitly configured.
- Both HTTP Host and any forwarded hostname match the exact `console.deltaalpha-trade-pro.com` subdomain (no Vercel direct hosts).
- An HTTP-only session cookie is present and the Runplane auth bridge is configured.
- `GET /auth/me` authenticates that session and returns `role=admin`, `email_verified=true`, `mfa_verified=true` as **actual booleans**.
- Any network error, failed /auth/me response, missing claim or misconfigured host leads to a 404.

**The legacy Runplane backend currently does not issue an audited MFA claim**, so this route cannot be activated for real administrators yet. Do not fake `mfa_verified`, accept self-reported tokens or bypass the bridge. Independent MFA implementation/testing is a release prerequisite.

## Whalez-Mail + Resend integration evidence

- Termux local Whalez-Mail service on port 8797: `GET /health` returned 200 and `{"ok":true}`; its authenticated `GET /api/internal/health` returned 401 with no token — a correct denial check. These results do not guarantee delivery or continuing uptime.
- Resend provider account: the domain `deltaalpha-trade-pro.com` reports verified, sending enabled and receiving enabled (October 31, 2026). A Resend events webhook exists for `https://mail.deltaalpha-trade-pro.com/api/webhooks/resend`, but is **disabled** at the provider.
- `lib/admin-console/readiness.ts` intentionally shows only server-side environment-configuration indicators, not message contents, API keys, delivery receipts or live backend claims. Provider-level readiness remains unverified in this UI.
- The backend has existing internal message/event list routes protected by a service token, but that token can also authorize sensitive mail operations. **Do not place a broad Whalez-Mail service token in Vercel to build a dashboard.** Instead establish a separately scoped, read-only observation identity and API, with masked/pseudonymized data, before enabling live operational feeds.

## Tidio and Lyro integration

- Public widget uses the `NEXT_PUBLIC_TIDIO_PUBLIC_KEY` identifier and `components/integration-scripts.tsx`.
- Public webhook is disabled unless `TIDIO_WEBHOOK_ENABLED=true`; require signed event, strict timestamp freshness, expected project, allowlisted topic and exact dedicated Whalez-Mail destination. Only event routing metadata may cross; no arbitrary customer message text and no relay to the control plane.
- Under a provider plan without webhook entitlement, **widget plus manual operator inbox** remains the supported mode. Do not pay for an upgrade automatically or describe chat messages as verified identity.
- Customer identity/KYC, refunds, payment exceptions, irreversible settlement and account security cases require human handoff and authenticated internal review.

## Verify before activation

1. Run `npx tsx --test tests/admin-console-policy.test.ts tests/admin-tidio-relay-boundary.test.ts` in an approved development environment. Preserve project data; do not reinstall packages on storage-constrained Termux without capacity checks.
2. Verify Vercel preview build READY on the exact PR commit; a build is not proof of live app authorization.
3. Verify default-disabled Admin route on a protected preview; direct Vercel host must return 404 after passing preview SSO, and the `www` host must never expose admin data.
4. Verify Runplane MFA issuance, enrollment, expiry, session revocation and admin role reassignment; test negative cases. Do not accept a self-asserted MFA flag.
5. Use a scoped observer to connect Whalez-Mail health/read-only event metadata; verify actual Resend receipt and monitored support inbox separately.
6. Verify Tidio operator inbox and a single synthetic live chat on the authorized provider plan. Do not enable the webhook if unavailable.
7. Obtain Founder approval for the separate admin domain ownership assignment, exact CNAME, cutover, rollback and post-deployment TLS/host/security checks.
8. Never redirect `console` to the private Founder Vercel project or use the old Cloudflare tunnel; preserve unrelated `www`, `alpha` and Mail routing.

**Current decision: NO-GO for Admin activation, private origin cutover, provider webhook activation, real settlement, mail send, or privileged writes.**
