import { Resend } from "resend"

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.FOUNDER_EMAIL!,
    subject: "DeltaAlpha Resend Test",
    html: "<strong>Resend is live in production.</strong>",
  })

  return new Response("OK")
}
