import { notFound } from "next/navigation"

// Internal Whalez-Mail routing belongs to the protected communications surface, not the public app.
export default function MailPage() {
  notFound()
}
