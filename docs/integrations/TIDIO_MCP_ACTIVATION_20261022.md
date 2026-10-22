# Tidio integration bootstrap — DeltaAlpha-Trade-Pro

Status: implementation prepared on a feature branch; not deployed or live-verified.

## Website widget

The root layout conditionally loads the Tidio widget when the public project key is configured:

- Environment variable: `NEXT_PUBLIC_TIDIO_PUBLIC_KEY`
- Script origin: `https://code.tidio.co/<PUBLIC_KEY>.js`
- Load strategy: after the page becomes interactive
- If the key is missing or contains unsupported characters, no widget script is injected.

Set the variable in the appropriate Vercel project/environment, then redeploy the website. Use the Tidio Public Key from Project Data. The public key is intended for browser use; do not put Tidio OpenAPI client secrets in any `NEXT_PUBLIC_*` variable.

## MCP bridge — separate remaining work

The widget only enables customer chat. It does not connect Tidio conversations to the private MCP gateway by itself.

Before enabling a server-side adapter, confirm the Tidio account's available API/webhook features and event schemas. Keep API credentials in server-only environment variables, authenticate inbound events, validate signatures where supported, implement idempotency, redact sensitive customer/payment data, and restrict MCP tools to explicit allowlisted actions. Do not expose the private MCP gateway directly to the public internet.

## Required environment inventory

- [ ] `NEXT_PUBLIC_TIDIO_PUBLIC_KEY` — public widget key, configured for the intended Vercel environments.
- [ ] Tidio OpenAPI client ID/secret — server-only, only if required by the selected API integration.
- [ ] Authenticated webhook endpoint and verification material — only if supported/configured for the selected Tidio events.
- [ ] MCP gateway base URL and server-side authentication — private and least-privilege.
- [ ] Approved event mapping, retry/dead-letter handling, audit logging, and privacy policy.

## Verification checklist

- [ ] Production build/typecheck passes on the feature branch.
- [ ] Widget appears once on the intended website domain.
- [ ] Widget is absent when the public key is unset.
- [ ] Browser bundle/network inspection confirms no private API secret is exposed.
- [ ] Test conversation produces an authenticated, deduplicated event.
- [ ] MCP adapter rejects unauthenticated requests and disallowed actions.
- [ ] End-to-end notification is confirmed before marking the integration live.

No production deployment, external message, customer conversation, or MCP action was performed by this bootstrap change.
