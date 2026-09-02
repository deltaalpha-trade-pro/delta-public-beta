# DeltaAlpha / Whalez API v1

Canonical public API boundary:

`https://api.deltaalpha-trade-pro.com/v1/`

Public clients use HTTPS. Internal service ports remain implementation details and are not part of the public contract.

## Endpoints

- `GET /v1/` — API manifest
- `GET /v1/health` — edge/core status
- `GET /v1/status` — API and Termux transport status
- `GET /v1/capabilities` — capability catalog
- `POST /v1/intelligence` — authenticated intelligence proxy
- `POST /v1/events` — authenticated event proxy
- `POST /v1/nodes/register` — authenticated node registration acknowledgement

## Vercel environment variables

Set these in the deployed project:

- `WHALEZ_PUBLIC_API_KEY` — bearer credential for protected endpoints
- `WHALEZ_CORE_API_URL` — reachable HTTPS URL for Whalez core/orchestrator
- `WHALEZ_INTERNAL_API_TOKEN` — optional bearer credential for the internal backend

Production must not use `localhost`, `127.0.0.1`, or a phone-local address for `WHALEZ_CORE_API_URL`.

## Termux

`termux/whalez-api.py` uses outbound HTTPS. No inbound phone port is required.

```bash
export WHALEZ_API_URL='https://api.deltaalpha-trade-pro.com/v1'
export WHALEZ_API_KEY='YOUR_API_KEY'
python termux/whalez-api.py health
python termux/whalez-api.py capabilities
python termux/whalez-api.py status
python termux/whalez-api.py register termux-main
python termux/whalez-api.py intelligence 'Summarize current Whalez runtime state'
```

## Termux-MCP boundary

Termux-MCP should remain local to the device. It provides shell/filesystem, system diagnostics, Android APIs, sensors, communications, media, Git, package management, and other capabilities. Keep it bound to loopback and place a small local Whalez node/agent in front of it when remote orchestration is enabled.

Target flow:

`Cloud API -> authenticated node request -> Termux Whalez agent -> local Termux-MCP -> Android`

Never:

`Internet -> exposed Termux-MCP port`
