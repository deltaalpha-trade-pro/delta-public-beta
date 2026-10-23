# Authentication and Founder-reviewed access integration

This integration keeps identity, Founder authority, and email delivery in their existing owners. The public site does not hold credentials for Founder Console or Resend in browser code.

## Runtime configuration

Set the following as **server-side environment variables** in the deployment/runtime that owns each service. Do not commit values or expose them through \`NEXT_PUBLIC_*\`.

### DeltaAlpha public app

- \`RUNPLANE_AUTH_ENABLED=true\` enables the real identity bridge.
- \`RUNPLANE_AUTH_URL\` is the HTTPS base URL for the authoritative identity API, whose existing routes are \`/auth/login\`, \`/auth/signup\`, \`/auth/me\`, \`/auth/refresh\`, and \`/auth/logout\`.
- \`AUTH_DEMO_MODE=false\` selects real identity. When explicitly set to \`true\`, the UI uses a non-persistent simulation-only session; it is not a real account.
- \`WHALEZ_ORIGIN_API_URL\` is the HTTPS base URL of the configured origin/orchestrator ingress that serves \`POST /public/access/request\`.
- \`DELTA_PUBLIC_ACCESS_TOKEN\` is a long random server-to-server secret. It must match the token configured on the origin/orchestrator runtime. The browser never receives it.

The access request endpoint fails closed with HTTP 503 when the origin URL or token is missing. Login/signup fail with HTTP 503 when real authentication is selected but the identity bridge is not configured.

### Origin/orchestrator runtime

- \`DELTA_PUBLIC_ACCESS_TOKEN\` must match the public app's server-only value.
- \`WHALEZ_MAIL_URL\` and \`WHALEZ_MAIL_INTERNAL_TOKEN\` allow the origin/orchestrator service to call Whalez-Mail.
- \`FOUNDER_ACCESS_PATH\` may be set to a stable, writable JSONL path shared by the origin/orchestrator and Founder Console processes. If unset, the repository-root \`store/access_requests.jsonl\` path is used.

Expose only the bounded access-request ingress through the origin routing layer. Do not expose the Founder Console UI or its audit-token endpoints as public product routes.

### Founder Console API / review runtime

- \`FOUNDER_AUDIT_TOKEN\` protects the Founder access queue and review actions.
- \`FOUNDER_ADMISSION_URL\` and \`FOUNDER_ADMISSION_TOKEN\` connect approval to the authoritative identity entitlement endpoint.
- \`WHALEZ_MAIL_URL\` and \`WHALEZ_MAIL_INTERNAL_TOKEN\` connect receipt/decision notices to Whalez-Mail.
- \`FOUNDER_ACCESS_PATH\` and \`FOUNDER_EMAIL_QUEUE_PATH\` must point to stable writable paths shared by the API and worker processes. Defaults are repository-root files.
- Run the Founder Console email worker process to retry queued Whalez-Mail notices when the mail service is temporarily unavailable.

The Founder Console remains private. The public app cannot approve requests, grant entitlements, or use the Founder audit token.

### Whalez-Mail runtime

Configure these only in Whalez-Mail's private runtime:

- \`RESEND_API_KEY\`: server-side Resend sending key.
- \`RESEND_FROM_EMAIL\`: sender on the verified sending domain.
- \`WHALEZ_MAIL_INTERNAL_TOKEN\`: the same long random secret used by authorized internal callers.
- \`WHALEZ_MILESTONE_RECIPIENTS\`: optional comma-separated recipient override. If unset, the code defaults to the founder and developer notification recipients configured for this ecosystem.

Do not copy Resend keys into the DeltaAlpha repository or browser variables. Confirm delivery in Resend after a runtime test; an API acceptance response is not equivalent to inbox delivery.

## End-to-end behavior

1. The public access form validates name, email, and intended use, then POSTs to the same-origin submission route.
2. The server route forwards the form to the origin/orchestrator ingress using the server-only access token.
3. The ingress stores an idempotent request in the Founder access queue and creates a WhalezChain observation artifact. The artifact is marked pending; no external chain finality is claimed.
4. Whalez-Mail sends a receipt email. If delivery is temporarily unavailable, the Founder Console queue stores a retryable notice.
5. A Founder reviews the request in the private Founder Console. Approval attempts to synchronize the user's entitlement through the identity authority; a failed synchronization remains explicitly pending.
6. Whalez-Mail sends the final approve/deny notice to the submitted email. Approval email text distinguishes review approval from entitlement activation.

Signup creates/uses identity through the identity authority. It does not by itself grant beta entitlement. Public financial execution remains governed by the existing public-mode controls.

## Pre-release verification

Before claiming this flow is live, verify:

- [ ] Origin ingress responds over HTTPS and is routed to the orchestrator instance containing \`/public/access/request\`.
- [ ] Shared access token matches in the app deployment and origin runtime.
- [ ] A real signup creates an identity through the authoritative service and establishes HttpOnly access/refresh cookies.
- [ ] Login, \`/api/auth/me\`, refresh, logout, invalid credentials, and service-unavailable cases behave correctly.
- [ ] A test access request appears in the private Founder queue with name, email, intended use, and pending status.
- [ ] WhalezChain provenance is confirmed by its authoritative service before it is reported as finalized.
- [ ] Approve and deny actions persist; approval only grants entitlement after the admission service confirms it.
- [ ] Receipt and decision emails are accepted by Resend and then checked for delivered/bounced status.
- [ ] A temporarily unavailable Whalez-Mail service leaves retryable queue records rather than silently losing notifications.
- [ ] Public surfaces never receive or expose Founder audit tokens, Resend API keys, or shared server-to-server tokens.

Code review alone does not establish that runtime secrets are configured, deployment is live, or end-to-end tests passed.
