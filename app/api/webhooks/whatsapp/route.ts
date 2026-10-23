export const runtime = "nodejs"

function unavailable() {
  return Response.json(
    { accepted: false, error: "WhatsApp webhook integration is not available." },
    { status: 503 },
  )
}

// This route remains closed until a real WhatsApp Business webhook contract and
// separate signature/verification configuration are implemented.
export function GET() {
  return unavailable()
}

export function POST() {
  return unavailable()
}
