"use client"

import { DiagramState } from "@/lib/types"
import dynamic from "next/dynamic"

const DiagramRenderer = dynamic(() => import("./DiagramRenderer"), { ssr: false })

const EMPTY_STATE: DiagramState = {
  nodes: [],
  edges: [],
  highlighted: [],
  annotations: [],
}

export default function DiagramCanvas({ state }: { state: DiagramState | null }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <DiagramRenderer state={state ?? EMPTY_STATE} />
    </div>
  )
}
