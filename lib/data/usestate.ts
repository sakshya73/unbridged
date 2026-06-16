import { Step, DiagramNode, DiagramEdge } from "../types"

const BOX = { width: 170, height: 64, style: "box" as const }
const parent = (label: string, color = "#4F46E5"): DiagramNode => ({ id: "parent", label, x: 250, y: 70, ...BOX, color })
const rowA = (label = "Row A", color = "#3B82F6"): DiagramNode => ({ id: "childA", label, x: 60, y: 260, ...BOX, color })
const rowB = (label = "Row B (memo)", color = "#3B82F6"): DiagramNode => ({ id: "childB", label, x: 440, y: 260, ...BOX, color })
const setPill: DiagramNode = { id: "set", label: "setCount(…)", x: 600, y: 78, width: 180, height: 40, style: "pill", color: "#F59E0B" }
const reconciler: DiagramNode = { id: "rec", label: "Reconciler\ndiff new vs old", x: 250, y: 360, ...BOX, color: "#8B5CF6" }
const host: DiagramNode = { id: "host", label: "Host commit\nscreen updates", x: 600, y: 360, width: 180, height: 64, style: "box", color: "#059669" }

const eA = (animated = false): DiagramEdge => ({ id: "eA", from: "parent", to: "childA", animated, color: animated ? "#818CF8" : "#D8DCE6" })
const eB = (variant: "plain" | "flow" | "skip"): DiagramEdge =>
  variant === "skip"
    ? { id: "eB", from: "parent", to: "childB", dashed: true, color: "#6EE7B7", label: "props equal" }
    : { id: "eB", from: "parent", to: "childB", animated: variant === "flow", color: variant === "flow" ? "#818CF8" : "#D8DCE6" }
const eSet: DiagramEdge = { id: "eSet", from: "set", to: "parent", label: "schedule", animated: true, color: "#818CF8" }
const eDiff: DiagramEdge = { id: "eDiff", from: "childA", to: "rec", label: "diff", animated: true, color: "#818CF8" }
const eCommit: DiagramEdge = { id: "eCommit", from: "rec", to: "host", label: "commit", animated: true, color: "#6EE7B7" }

const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

export const usestateSteps: Step[] = [
  {
    step: 1,
    codeLines: [2, 3],
    caption: "const [count, setCount] = useState(0) — React reserves a slot for this component and remembers it between renders.",
    narration: "When you call useState, React reserves a slot for this component and remembers its value between renders. The count variable just reads that slot.",
    notes: [
      { label: "Key term", term: "Slot", text: "a piece of memory React owns, attached to this component's instance. It survives every re-render; your variable only reads a copy of it." },
      { label: "If you know web React", text: "this is plain React, identical to the web. The only React Native difference is the final commit target — native views instead of the DOM." },
    ],
    diagram_state: { nodes: [parent("Counter")], edges: [], highlighted: ["parent"], annotations: an("state slot:  count = 0  (React owns it)", "#4F46E5") },
  },
  {
    step: 2,
    codeLines: [3, 12],
    caption: "Inside a render, count is a frozen snapshot of the slot — it can't change while the component runs.",
    narration: "Inside a render, count is a frozen snapshot of the slot's value. It can't change while the component runs; setCount asks React for a new value on the next render.",
    note: { label: "Key term", term: "Snapshot", text: "count holds the value React handed this render. setCount doesn't update this variable — it requests a fresh value for the next render." },
    diagram_state: { nodes: [parent("Counter")], edges: [], highlighted: ["parent"], annotations: an("count = 0  ·  this render's copy of the slot", "#4F46E5") },
  },
  {
    step: 3,
    codeLines: [14, 15],
    caption: "Counter renders two children — Row A, and Row B wrapped in React.memo.",
    narration: "Counter renders two children, Row A and Row B, passing props down. Row B is wrapped in React.memo — a wrapper that lets a component skip re-rendering when its props don't change. That matters in a moment.",
    diagram_state: { nodes: [parent("Counter"), rowA(), rowB()], edges: [eA(), eB("plain")], highlighted: ["childA", "childB"], annotations: [] },
  },
  {
    step: 4,
    codeLines: [5, 6, 7],
    caption: "Press +1 → setCount enqueues an update and schedules a re-render. It does not change count now.",
    narration: "You press plus one. setCount doesn't change anything on the spot — it enqueues an update for this component and schedules a re-render. This render's count keeps its old value.",
    note: { label: "Key term", term: "Render", text: "\"render\" means React calling your function to produce its UI description — not painting pixels. setCount enqueues a value and schedules that call; nothing happens synchronously." },
    diagram_state: { nodes: [parent("Counter"), rowA(), rowB(), setPill], edges: [eA(), eB("plain"), eSet], highlighted: ["set"], annotations: an("enqueued — count is still 0 this render", "#D97706") },
  },
  {
    step: 5,
    codeLines: [5, 6, 7],
    caption: "Fire setCount three times in one handler and React still re-renders once — it batches them.",
    narration: "Call setCount several times in the same event and React groups them and re-renders once, not once per call.",
    notes: [
      { label: "Key term", term: "Batch", text: "React collects every setState fired in the same event or tick and re-renders a single time. React 18 and up batches everywhere; older React only inside event handlers." },
      { label: "Try it", text: "in the Playground tab, hit \"setCount × 3\" and watch the render count tick up only once." },
    ],
    diagram_state: {
      nodes: [parent("Counter"), rowA(), rowB(), setPill],
      edges: [eA(), eB("plain"), eSet],
      highlighted: ["set"],
      annotations: an("3 setCount calls in one event  →  1 render"),
      packets: [
        { id: "q1", x: 560, y: 135, label: "+1", color: "#F59E0B" },
        { id: "q2", x: 605, y: 135, label: "+1", color: "#F59E0B" },
        { id: "q3", x: 650, y: 135, label: "+1", color: "#F59E0B" },
      ],
    },
  },
  {
    step: 6,
    codeLines: [7],
    caption: "setCount(count + 1) three times only adds 1 — count is a stale snapshot. setCount(c => c + 1) adds 3.",
    narration: "Here's the classic gotcha. Calling setCount of count plus one three times only adds one, because all three read the same frozen count. The functional form, c arrow c plus one, reads the latest queued value each time, so it adds three.",
    note: { label: "Gotcha", text: "setCount(count + 1) ×3 adds 1 — every call reads the same snapshot. setCount(c => c + 1) ×3 adds 3 — each updater gets the latest queued value, not the frozen closure." },
    diagram_state: { nodes: [parent("Counter"), rowA(), rowB(), setPill], edges: [eA(), eB("plain"), eSet], highlighted: ["set"], annotations: an("count+1 ×3 → +1     ·     c=>c+1 ×3 → +3", "#DC2626") },
  },
  {
    step: 7,
    codeLines: [1, 3],
    caption: "React flags Counter's fiber as dirty and re-runs the function with the new value.",
    narration: "React flags Counter's fiber as having pending work, dirty, and on the next pass re-runs the Counter function — producing a fresh snapshot with the new count.",
    notes: [
      { label: "Key term", term: "Fiber", text: "React's persistent record for a component instance. It holds the state slot and the update queue — the thing that survives between renders." },
      { label: "Connects to", text: "this re-run is the \"update\" phase of a component's life.", link: { href: "/learn/lifecycle", label: "Component Lifecycle" } },
    ],
    diagram_state: { nodes: [parent("Counter (dirty)", "#DC2626"), rowA(), rowB(), setPill], edges: [eA(), eB("plain"), eSet], highlighted: ["parent"], annotations: an("dirty → re-run on the next pass", "#DC2626") },
  },
  {
    step: 8,
    codeLines: [14, 15],
    caption: "Re-running Counter re-runs its children by default — React doesn't check their props unless they're memoized.",
    narration: "Re-running the parent re-runs its children too. Row A and Row B both get called again — React doesn't inspect their props at all, unless they're memoized.",
    diagram_state: {
      nodes: [parent("Counter (dirty)", "#DC2626"), rowA("Row A (re-render)", "#DC2626"), rowB("Row B (re-render)", "#DC2626"), setPill],
      edges: [eA(true), eB("flow"), eSet],
      highlighted: ["childA", "childB"],
      annotations: an("a re-render cascades to children", "#DC2626"),
    },
  },
  {
    step: 9,
    codeLines: [15, 19],
    caption: "Row B is memo-wrapped: same props → React bails out and reuses its last result.",
    narration: "But Row B is wrapped in React.memo. React compares its props one by one, by identity; they're equal, so it bails out and skips the re-render.",
    note: { label: "Gotcha", text: "React.memo compares each prop shallowly, by identity (Object.is). An inline object, array, or function prop is a new identity every render, so memo never bails — that's exactly why useMemo and useCallback exist." },
    diagram_state: {
      nodes: [parent("Counter (dirty)", "#DC2626"), rowA("Row A (re-render)", "#DC2626"), rowB("Row B (skipped)", "#059669"), setPill],
      edges: [eA(true), eB("skip"), eSet],
      highlighted: ["childB"],
      annotations: an("memo: equal props → skip the re-render", "#059669"),
    },
  },
  {
    step: 10,
    codeLines: [11, 12],
    caption: "The components that re-ran produce new elements; the reconciler diffs them against the old tree.",
    narration: "The components that re-ran produce new element descriptions. The reconciler diffs this new tree against the previous one to find the minimal set of real changes.",
    note: { label: "Key term", term: "Reconcile", text: "rendering produces a description of the UI; reconciling is React comparing it to the last one to decide what actually changed." },
    diagram_state: {
      nodes: [parent("Counter (dirty)", "#DC2626"), rowA("Row A (re-render)", "#DC2626"), rowB("Row B (skipped)", "#059669"), setPill, reconciler],
      edges: [eA(true), eB("skip"), eSet, eDiff],
      highlighted: ["rec"],
      annotations: an("diff new vs old → the minimal real changes", "#8B5CF6"),
    },
  },
  {
    step: 11,
    codeLines: [11, 12],
    caption: "React commits only the changes to the host — the DOM on web, native views in React Native — and the screen updates.",
    narration: "Finally React commits just those changes to the host. On the web that's the DOM; in React Native it's the native views. The user sees the new count.",
    note: { label: "Next", text: "in React Native that commit hands off to Fabric, the New Architecture's renderer — its own story.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    diagram_state: {
      nodes: [parent("Counter"), rowA("Row A", "#3B82F6"), rowB("Row B", "#059669"), setPill, reconciler, host],
      edges: [eA(true), eB("skip"), eSet, eDiff, eCommit],
      highlighted: ["host"],
      annotations: an("commit changed views → the screen updates", "#059669"),
    },
  },
  {
    step: 12,
    caption: "The loop: state lives in a slot React owns; setCount enqueues a value and schedules a render; React batches the calls, re-runs the function (and children, unless memo bails), reconciles, and commits only what changed.",
    narration: "The whole loop: state lives in a slot React owns. setCount enqueues a value and schedules a render. React batches the calls, re-runs the function and its children unless memo bails, reconciles new against old, and commits only what changed.",
    note: { label: "Next", text: "effects run right after this commit — when they fire and how to clean them up is the next lesson.", link: { href: "/learn/useeffect", label: "useEffect" } },
    diagram_state: {
      nodes: [parent("Counter"), rowA("Row A", "#3B82F6"), rowB("Row B", "#059669"), reconciler, host],
      edges: [eA(), eB("plain"), eDiff, eCommit],
      highlighted: [],
      annotations: an("slot → enqueue → batch → re-run → reconcile → commit", "#059669"),
    },
  },
]
