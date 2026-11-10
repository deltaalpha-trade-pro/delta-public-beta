export const runtime = "nodejs"

export function GET() {
  // Keep this legacy endpoint as a minimal liveness response. Integration
  // routes, feature flags, and relay configuration are internal-only.
  return Response.json(
    { ok: true },
    {
      headers: {
        "cache-control": "no-store, max-age=0",
      },
    },
  )
}
