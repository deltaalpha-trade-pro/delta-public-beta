import { redirect } from "next/navigation"

export default function LegacyAccessRoute() {
  redirect("/signup")
}
