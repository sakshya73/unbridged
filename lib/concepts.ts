import { ConceptConfig } from "./types"

export const concepts: ConceptConfig[] = [
  {
    id: "bridge",
    title: "The React Native Bridge",
    description: "How JS and Native threads communicate asynchronously",
    renderer: "ThreadDiagram",
    tags: ["architecture", "core", "intermediate"],
  },
  {
    id: "jsi",
    title: "New Architecture & JSI",
    description: "Direct synchronous JS-to-Native calls without the Bridge",
    renderer: "ThreadDiagram",
    tags: ["architecture", "advanced", "new-arch"],
  },
  {
    id: "lifecycle",
    title: "Component Lifecycle",
    description: "Mount → render → update → unmount, step by step",
    renderer: "Timeline",
    tags: ["components", "beginner"],
  },
  {
    id: "usestate",
    title: "useState & Re-renders",
    description: "How state changes trigger reconciliation and commits",
    renderer: "ComponentTree",
    tags: ["hooks", "beginner"],
  },
  {
    id: "useeffect",
    title: "useEffect",
    description: "When it fires, cleanup, and the dependency array",
    renderer: "Timeline",
    tags: ["hooks", "intermediate"],
  },
  {
    id: "flatlist",
    title: "FlatList Virtualization",
    description: "How the render window and scroll recycling work",
    renderer: "ScrollWindow",
    tags: ["performance", "intermediate"],
  },
  {
    id: "hermes",
    title: "Hermes Engine",
    description: "How JS is compiled to bytecode and executed",
    renderer: "FlowDiagram",
    tags: ["performance", "advanced"],
  },
  {
    id: "metro",
    title: "Metro Bundler",
    description: "How your code is transformed and bundled",
    renderer: "FlowDiagram",
    tags: ["tooling", "intermediate"],
  },
  {
    id: "navigation",
    title: "React Navigation Internals",
    description: "Stack, tab, and drawer navigator mechanics",
    renderer: "NavigationStack",
    tags: ["navigation", "intermediate"],
  },
  {
    id: "animated",
    title: "Animated API",
    description: "JS driver vs Native driver — what runs where",
    renderer: "ThreadDiagram",
    tags: ["animation", "performance", "advanced"],
  },
]

export const getConcept = (id: string) => concepts.find((c) => c.id === id)
