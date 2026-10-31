# DeltaAlpha-Trade-Pro Admin Control Panel — staging contract

Status: NOT ACTIVATED; read-only, deny-by-default.

- Canonical eventual hostname: `console.deltaalpha-trade-pro.com`.
- Separate from `alpha.deltaalpha-trade-pro.com` (private Founder Console).
- This repository contains an application route, not an instruction to attach the hostname or deploy a new Vercel project.
- `ADMIN_CONTROL_PANEL_ENABLED` is unset by default; all requests receive 404.
- Activation additionally requires server-originated `role=admin`, `email_verified=true`, and `mfa_verified=true` from the authenticated Runplane `/auth/me` bridge. The legacy backend does not yet supply the MFA claim; activation remains blocked until independently verified.
- No browser-controlled cookie claims are trusted as role authority: `authenticatedUser()` resolves the session through the Runplane authentication service.
- This scaffold provides no direct write actions, finance, minting, Founder/ROOT authority, secure-shell or internal execution.
- Before publication, independently review the Runplane admin endpoints for CSRF, HTML encoding, session binding and MFA; never proxy the legacy /admin HTML directly to the Internet.
- Test unauthorized, customer, non-MFA and administrator sessions; verify each API independently before adding any admin mutations.
- Public hostname cutover remains a separate operational decision: first remove old Vercel Founder association, assign the correct Admin app, capture DNS backup, then switch CNAME and verify rollback and access.
