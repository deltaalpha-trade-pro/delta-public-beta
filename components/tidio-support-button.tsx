"use client"

import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type TidioChatApi = {
  open: () => void
  getStatus?: () => string | null
  on?: (event: "ready", listener: () => void) => void
}

type TidioWindow = Window & {
  tidioChatApi?: TidioChatApi
}

export function TidioSupportButton({ label }: { label: string }) {
  const openSupport = () => {
    const target = window as TidioWindow
    const api = target.tidioChatApi

    const openWhenReady = () => target.tidioChatApi?.open()

    if (!api) {
      document.addEventListener("tidioChat-ready", openWhenReady, { once: true })
      return
    }

    const status = api.getStatus?.()
    if (status === null || status === undefined) {
      if (api.on) {
        api.on("ready", openWhenReady)
      } else {
        document.addEventListener("tidioChat-ready", openWhenReady, { once: true })
      }
      return
    }

    api.open()
  }

  return (
    <Button type="button" onClick={openSupport} className="w-full justify-between">
      <span>{label}</span>
      <ArrowUpRight className="ml-2 h-4 w-4" />
    </Button>
  )
}
