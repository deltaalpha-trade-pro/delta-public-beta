import {
  apiJson,
  apiOptions,
  callInternal,
  isProtectedPath,
  publicCapabilities,
  requireApiKey,
  requestId,
} from "@/lib/whalez-api"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function OPTIONS() {
  return apiOptions()
}

export async function GET(request: Request, context: { params: { path: string[] } }) {
  const { path } = context.params
  const normalized = `/${path.join("/")}`

  if (normalized === "/health") {
    const coreConfigured = Boolean(process.env.WHALEZ_CORE_API_URL?.trim())
    return apiJson({
      service: "delta-public-beta",
      api: "v1",
      status: "ok",
      public_edge: "online",
      core_backend: coreConfigured ? "configured" : "not_configured",
      request_id: requestId(request),
      timestamp: new Date().toISOString(),
    })
  }

  if (normalized === "/capabilities") {
    return apiJson({ capabilities: publicCapabilities() })
  }

  if (normalized === "/status") {
    return apiJson({
      api: { status: "online", version: "v1" },
      core_backend: Boolean(process.env.WHALEZ_CORE_API_URL?.trim()),
      termux_node: {
        transport: "outbound_https",
        localhost_dependency: false,
      },
    })
  }

  return apiJson({ error: "not_found", path: normalized }, { status: 404 })
}

export async function POST(request: Request, context: { params: { path: string[] } }) {
  const { path } = context.params
  const normalized = `/${path.join("/")}`

  if (isProtectedPath(normalized)) {
    const auth = requireApiKey(request)
    if (!auth.ok) return apiJson({ error: auth.error }, { status: auth.status })
  }

  let payload: unknown = {}
  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  if (normalized === "/intelligence") {
    const result = await callInternal("/intelligence", {
      api_version: "v1",
      request_id: requestId(request),
      input: payload,
    }, request)

    if (!result.ok) {
      return apiJson({
        error: result.error,
        message: result.message,
        request_id: requestId(request),
      }, { status: result.status })
    }

    return apiJson(result.data, { status: result.status })
  }

  if (normalized === "/events") {
    const result = await callInternal("/events", {
      api_version: "v1",
      request_id: requestId(request),
      event: payload,
    }, request)

    if (!result.ok) {
      return apiJson({ error: result.error, message: result.message, request_id: requestId(request) }, { status: result.status })
    }

    return apiJson(result.data, { status: result.status })
  }

  if (normalized === "/nodes/register") {
    return apiJson({
      accepted: true,
      transport: "outbound_https",
      node_id: request.headers.get("x-whalez-node-id") || null,
      request_id: requestId(request),
      note: "Node registration is acknowledged at the API edge. Durable node state will be enabled when the ecosystem state store is attached.",
    }, { status: 202 })
  }

  return apiJson({ error: "not_found", path: normalized }, { status: 404 })
}
