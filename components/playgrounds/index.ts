import dynamic from "next/dynamic"
import type { ComponentType } from "react"

// Concepts that have a hands-on interactive sandbox (beyond the walkthrough).
const registry: Record<string, ComponentType> = {
  bridge: dynamic(() => import("./BridgePlayground"), { ssr: false }),
  threads: dynamic(() => import("./ThreadsPlayground"), { ssr: false }),
  jsi: dynamic(() => import("./JsiPlayground"), { ssr: false }),
}

export function getPlayground(conceptId: string): ComponentType | null {
  return registry[conceptId] ?? null
}
