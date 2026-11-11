import { notFound } from "next/navigation"

// This legacy public route is retired. Restricted consoles are not served by the public gateway.
export default function RetiredRoute() {
  notFound()
}
