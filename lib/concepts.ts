import { ConceptConfig } from "./types"

export const concepts: ConceptConfig[] = [
  {
    id: "bridge",
    title: "The React Native Bridge",
    description: "How JS and Native threads communicate asynchronously",
    renderer: "ThreadDiagram",
    tags: ["architecture", "core", "intermediate"],
    analogy:
      "Two people who don't share a language, passing handwritten notes through a translator. It works — but every note has to be written down, carried across, and read aloud.",
    scenario:
      "You'll feel it when a heavy JSON.parse or a big list calculation on the JS thread makes a swipe or animation stutter.",
  },
  {
    id: "jsi",
    title: "New Architecture & JSI",
    description: "Direct synchronous JS-to-Native calls without the Bridge",
    renderer: "ThreadDiagram",
    tags: ["architecture", "advanced", "new-arch"],
    analogy:
      "Swapping the note-passing translator for a shared whiteboard both people read and write at the same time — no more notes going back and forth.",
    scenario:
      "Why the New Architecture can measure a view or call a native module synchronously, with no laggy round-trip.",
  },
  {
    id: "lifecycle",
    title: "Component Lifecycle",
    description: "Mount → render → update → unmount, step by step",
    renderer: "Timeline",
    tags: ["components", "beginner"],
    analogy:
      "A stage actor: they walk on (mount), react to cues during the show (update), and exit when the scene ends (unmount) — tidying up props on the way out.",
    scenario:
      "Why a forgotten cleanup leaves a timer or listener running after you've navigated away from a screen.",
  },
  {
    id: "usestate",
    title: "useState & Re-renders",
    description: "How state changes trigger reconciliation and commits",
    renderer: "ComponentTree",
    tags: ["hooks", "beginner"],
    analogy:
      "A whiteboard you erase and redraw: change one number and React redraws that board — and the ones below it — to match.",
    scenario:
      "Why your whole screen re-renders when a single counter changes, and how to stop the parts that don't need to.",
  },
  {
    id: "useeffect",
    title: "useEffect",
    description: "When it fires, cleanup, and the dependency array",
    renderer: "Timeline",
    tags: ["hooks", "intermediate"],
    analogy:
      "A sticky note that says 'once the room is set up, water the plants' — it runs after the render, not during it, and cleans up before doing it again.",
    scenario:
      "Why your data fetch fires twice or at the wrong moment when the dependency array is wrong.",
  },
  {
    id: "flatlist",
    title: "FlatList Virtualization",
    description: "How the render window and scroll recycling work",
    renderer: "ScrollWindow",
    tags: ["performance", "intermediate"],
    analogy:
      "A theater that only puts out chairs for the rows people are actually sitting in, folding them away as the audience moves.",
    scenario:
      "Why a list of 10,000 items scrolls smoothly — while the same data in a plain ScrollView would freeze the app.",
  },
  {
    id: "hermes",
    title: "Hermes Engine",
    description: "How JS is compiled to bytecode and executed",
    renderer: "FlowDiagram",
    tags: ["performance", "advanced"],
    analogy:
      "Meal-prepping on Sunday instead of cooking every dish from scratch at dinnertime — the work is done ahead, so serving is instant.",
    scenario:
      "Why turning on Hermes cuts startup time and memory: the JS ships pre-compiled to bytecode instead of being parsed on the phone.",
  },
  {
    id: "metro",
    title: "Metro Bundler",
    description: "How your code is transformed and bundled",
    renderer: "FlowDiagram",
    tags: ["tooling", "intermediate"],
    analogy:
      "A printing press that gathers every page (module), formats them, and binds them into one book your app can read.",
    scenario:
      "Why a single 'unable to resolve module' breaks the build — and how Fast Refresh hot-swaps just the file you edited.",
  },
  {
    id: "navigation",
    title: "React Navigation Internals",
    description: "Stack, tab, and drawer navigator mechanics",
    renderer: "NavigationStack",
    tags: ["navigation", "intermediate"],
    analogy:
      "A stack of cards: each new screen lands on top; going back lifts the top card off to reveal the one beneath.",
    scenario:
      "Why a screen stays mounted underneath when you push a new one — and why that back gesture feels truly native.",
  },
  {
    id: "animated",
    title: "Animated API",
    description: "JS driver vs Native driver — what runs where",
    renderer: "ThreadDiagram",
    tags: ["animation", "performance", "advanced"],
    analogy:
      "Handing a flip-book to someone else to flip at a steady pace, so it keeps playing smoothly even while you're busy with something else.",
    scenario:
      "Why useNativeDriver:true keeps an animation at 60fps even when the JS thread is blocked — and why it only works on transform and opacity.",
  },
]

export const getConcept = (id: string) => concepts.find((c) => c.id === id)
