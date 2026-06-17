import dynamic from "next/dynamic"
import type { ComponentType } from "react"

// Concepts that have a hands-on interactive sandbox (beyond the walkthrough).
const registry: Record<string, ComponentType> = {
  bridge: dynamic(() => import("./BridgePlayground"), { ssr: false }),
  threads: dynamic(() => import("./ThreadsPlayground"), { ssr: false }),
  jsi: dynamic(() => import("./JsiPlayground"), { ssr: false }),
  usestate: dynamic(() => import("./UseStatePlayground"), { ssr: false }),
  useeffect: dynamic(() => import("./UseEffectPlayground"), { ssr: false }),
  flatlist: dynamic(() => import("./FlatListPlayground"), { ssr: false }),
  animated: dynamic(() => import("./AnimatedPlayground"), { ssr: false }),
  lifecycle: dynamic(() => import("./LifecyclePlayground"), { ssr: false }),
  metro: dynamic(() => import("./MetroPlayground"), { ssr: false }),
  hermes: dynamic(() => import("./HermesPlayground"), { ssr: false }),
  navigation: dynamic(() => import("./NavigationPlayground"), { ssr: false }),
  "render-pipeline": dynamic(() => import("./RenderPipelinePlayground"), { ssr: false }),
  startup: dynamic(() => import("./StartupPlayground"), { ssr: false }),
}

export function getPlayground(conceptId: string): ComponentType | null {
  return registry[conceptId] ?? null
}
