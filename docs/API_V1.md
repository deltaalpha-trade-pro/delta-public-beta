# DeltaAlpha / Whalez API v1

Canonical public API boundary:

`https://api.deltaalpha-trade-pro.com/v1/`

The API is designed to hide internal service ports. Public clients use HTTPS; internal runtime placement remains an implementation detail.

## Public endpoints

- `GET /v1/` — API manifest
- `GET /v1/health` — edge/core connectivity status
- `GET /v1/status` — deployment and Termux transport status
- `GET /v1/capabilities` — public capability catalog
- `POST /v1/intelligence` — authenticated intelligence proxy
- `POST /v1/events` — authenticated event proxy
- `POST /v1/nodes/register` — authenticated Termux/runtime node registration acknowledgement

## Required production environment

Configure these on the Vercel project:

- `WHALEZ_PUBLIC_API_KEY` — bearer credential accepted by protected v1 endpoints
- `WHALEZ_CORE_API_URL` — reachable HTTPS URL for the Whalez core/orchestrator API
- `WHALEZ_INTERNAL_API_TOKEN` — optional bearer credential for the internal core

Do not set `WHALEZ_CORE_API_URL` to `127.0.0.1`, `localhost`, or a phone-local address in production. The API runs remotely.

## Termux

The repository includes `termux/whalez-api.py`. It talks to the public API using outbound HTTPS and therefore does not require a publicly reachable Termux port.

```bash
export WHALEZ_API_URL='https://api.deltaalpha-trade-pro.com/v1'
export WHALEZ_API_KEY='YOUR_API_KEY'
python termux/whalez-api.py health
python termux/whalez-api.py capabilities
python termux/whalez-api.py status
python termux/whalez-api.py register termux-main
python termux/whalez-api.py intelligence 'Summarize the current Whalez runtime state'
```

## Termux-MCP boundary

Termux-MCP remains local to the device. The current Termux-MCP project exposes shell/filesystem, diagnostics, Git, Android device APIs, sensors, media, notifications and other tools over a local HTTP interface, with bearer-token protection available. Keep that server bound to loopback and use the Whalez API/client as the controlled cloud boundary.

This preserves the security boundary:

`Cloud API -> authenticated node request -> Termux local agent -> Termux-MCP -> Android`

rather than:

`Internet -> exposed Termux-MCP port`.
