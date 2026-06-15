export type NodeStyle = "box" | "circle" | "pill" | "thread"

export interface DiagramNode {
  id: string
  label: string
  x: number
  y: number
  style: NodeStyle
  color?: string
  width?: number
  height?: number
}

export interface DiagramEdge {
  id: string
  from: string
  to: string
  label?: string
  animated?: boolean
  dashed?: boolean
  color?: string
}

export interface DiagramAnnotation {
  id: string
  text: string
  x: number
  y: number
  color?: string
}

// A discrete message/token. If toX/toY are set it travels there; otherwise it sits still (e.g. a queued item).
export interface Packet {
  id: string
  label?: string
  x: number
  y: number
  toX?: number
  toY?: number
  color?: string
  loop?: boolean
}

export interface DiagramState {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  highlighted: string[]
  annotations: DiagramAnnotation[]
  packets?: Packet[]
}

export interface Step {
  step: number
  narration: string
  caption?: string // short on-screen caption; falls back to narration
  diagram_state: DiagramState
}

export type RendererType =
  | "ThreadDiagram"
  | "ComponentTree"
  | "Timeline"
  | "ScrollWindow"
  | "FlowDiagram"
  | "NavigationStack"

export interface ConceptConfig {
  id: string
  title: string
  description: string
  renderer: RendererType
  tags: string[]
  analogy: string // "think of it like…" — an everyday metaphor
  scenario: string // "you'll hit this when…" — a concrete dev situation
}
