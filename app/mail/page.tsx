import { redirect } from "next/navigation"

// The former internal communications overview is not a public product surface.
// Preserve the legacy URL for existing bookmarks, but return visitors to public channels.
export default function MailPage() {
  redirect("/#communications")
}
