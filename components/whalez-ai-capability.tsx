import * as React from "react"
import type { WhalezAICapability } from "@/lib/whalez-ai/identity"
import { whalezAICapabilityLabel } from "@/lib/whalez-ai/identity"

export function WhalezAICapabilityBadge({
  capability,
  className,
}: {
  capability: Pick<WhalezAICapability, "name">
  className?: string
}) {
  return (
    <span
      className={className}
      aria-label={whalezAICapabilityLabel(capability)}
      data-whalez-ai="capability"
    >
      {whalezAICapabilityLabel(capability)}
    </span>
  )
}
