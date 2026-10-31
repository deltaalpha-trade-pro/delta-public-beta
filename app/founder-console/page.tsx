import { notFound } from "next/navigation"

// Private Founder capabilities must never render from the public DeltaAlpha application.
export default function FounderConsolePage() {
  notFound()
}
