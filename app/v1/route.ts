import { apiCorsHeaders, apiJson, apiOptions } from "@/lib/whalez-api"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function OPTIONS() {
  return apiOptions()
}

export function GET() {
  return apiJson({
    name: "DeltaAlpha / Whalez API",
    version: "v1",
    status: "online",
    purpose: "Canonical public API boundary for the Whalez-AI ecosystem.",
    deployment: "Vercel + Cloudflare",
    runtime_model: "public HTTPS API -> orchestrator -> capability/provider/runtime",
    endpoints: {
      health: "/v1/health",
      capabilities: "/v1/capabilities",
      intelligence: "/v1/intelligence",
      status: "/v1/status",
    },
    transport: ["HTTPS", "JSON"],
    headers: apiCorsHeaders(),
  })
}
