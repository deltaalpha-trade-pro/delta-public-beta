import { notFound } from "next/navigation"

// The private Founder Console is not served by the public beta application.
// Its authority-bearing interface remains on the separately protected console surface.
export default function FounderConsolePage(): never {
  notFound()
}
