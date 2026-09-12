import { getIntegrationStatus } from "@/lib/integration-relay"

export const runtime = "nodejs"

export function GET() {
  return Response.json(getIntegrationStatus(), {
    headers: {
      "cache-control": "no-store, max-age=0",
    },
  })
}
