import crypto from "node:crypto"

export const API_VERSION = "v1"
export const API_NAME = "DeltaAlpha / Whalez API"

const trim = (value: string | undefined | null) => value?.trim() ?? ""

export function apiCorsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "Authorization, Content-Type, X-Request-Id, X-Whalez-Node-Id",
    "cache-control": "no-store, max-age=0",
  }
}

export function apiJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set("content-type", "application/json; charset=utf-8")
  for (const [key, value] of Object.entries(apiCorsHeaders())) headers.set(key, value)
  return Response.json(body, { ...init, headers })
}

export function apiOptions() {
  return new Response(null, { status: 204, headers: apiCorsHeaders() })
}

export function requestId(request: Request) {
  return request.headers.get("x-request-id")?.trim() || crypto.randomUUID()
}

export function isProtectedPath(pathname: string) {
  return ["/intelligence", "/events", "/nodes/register"].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function requireApiKey(request: Request) {
  const expected = trim(process.env.WHALEZ_PUBLIC_API_KEY)
  if (!expected) return { ok: false as const, status: 503, error: "api_key_not_configured" }

  const header = request.headers.get("authorization")?.trim() || ""
  const [scheme, token] = header.split(/\s+/, 2)
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return { ok: false as const, status: 401, error: "missing_bearer_token" }
  }

  const left = Buffer.from(token)
  const right = Buffer.from(expected)
  const valid = left.length === right.length && crypto.timingSafeEqual(left, right)
  return valid ? { ok: true as const } : { ok: false as const, status: 401, error: "invalid_api_key" }
}

export async function callInternal(path: string, payload: unknown, request: Request) {
  const base = trim(process.env.WHALEZ_CORE_API_URL).replace(/\/$/, "")
  if (!base) {
    return {
      ok: false as const,
      status: 503,
      error: "core_backend_not_configured",
      message: "Set WHALEZ_CORE_API_URL on the deployed API to enable live ecosystem execution.",
    }
  }

  const token = trim(process.env.WHALEZ_INTERNAL_API_TOKEN)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25_000)

  try {
    const response = await fetch(`${base}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": requestId(request),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    })

    const text = await response.text()
    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    return { ok: response.ok, status: response.status, data }
  } catch (error) {
    return {
      ok: false as const,
      status: 502,
      error: "core_backend_unreachable",
      message: error instanceof Error ? error.message : String(error),
    }
  } finally {
    clearTimeout(timeout)
  }
}

export function publicCapabilities() {
  return [
    { id: "intelligence.reason", version: "1.0", mode: "proxy", status: "available" },
    { id: "integration.relay", version: "1.0", mode: "proxy", status: "available" },
    { id: "node.termux", version: "1.0", mode: "client", status: "available" },
    { id: "whalezchain.settlement", version: "1.0", mode: "internal", status: "gated" },
  ]
}
