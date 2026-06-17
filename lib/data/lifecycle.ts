import { Step, DiagramNode, DiagramEdge } from "../types"

const INDIGO = "#4F46E5" // render (pure)
const SLATE = "#374151" // commit / host
const SKY = "#0EA5E9" // useLayoutEffect (before paint)
const GREEN = "#059669" // paint
const VIOLET = "#8B5CF6" // useEffect (passive)
const AMBER = "#D97706" // cleanup
const BLUE = "#3B82F6" // update (state/props)
const RED = "#DC2626" // unmount / teardown
const FLOW = "#818CF8" // forward-flow edges
const SETTLE = "#6EE7B7" // host / paint settle edges
const WARN = "#FCD34D" // re-render loop + cleanup edges

// ── node builders (positions are fixed so the timeline builds up, never jumps) ──
const render = (color = INDIGO): DiagramNode => ({ id: "render", label: "Render\n(pure)", x: 30, y: 175, width: 150, height: 58, style: "box", color })
const commit = (color = SLATE): DiagramNode => ({ id: "commit", label: "Commit\n(host mutate)", x: 215, y: 175, width: 150, height: 58, style: "box", color })
const layout = (color = SKY): DiagramNode => ({ id: "layout", label: "useLayoutEffect\n(before paint)", x: 210, y: 72, width: 165, height: 52, style: "box", color })
const paint = (color = GREEN): DiagramNode => ({ id: "paint", label: "Paint", x: 400, y: 175, width: 120, height: 58, style: "box", color })
const passive = (color = VIOLET): DiagramNode => ({ id: "passive", label: "useEffect\n(after paint)", x: 560, y: 175, width: 150, height: 58, style: "box", color })
const cleanup = (color = AMBER): DiagramNode => ({ id: "cleanup", label: "cleanup()", x: 650, y: 72, width: 124, height: 52, style: "box", color })
const host = (label = "Host views\nFabric C++ · Paper UIManager", color = SLATE): DiagramNode => ({ id: "host", label, x: 320, y: 388, width: 230, height: 54, style: "box", color })
const update = (color = BLUE): DiagramNode => ({ id: "update", label: "state / prop\nchange", x: 30, y: 300, width: 160, height: 46, style: "pill", color })
const unmount = (color = RED): DiagramNode => ({ id: "unmount", label: "Unmount", x: 648, y: 300, width: 128, height: 46, style: "pill", color })

const e = (id: string, from: string, to: string, label: string, color = FLOW, dashed = false): DiagramEdge => ({ id, from, to, label, animated: !dashed, dashed, color })
const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

export const lifecycleSteps: Step[] = [
  {
    step: 1,
    codeLines: [2, 3],
    caption: "First mount: React calls ProfileScreen() to produce an element tree. This is the render phase — and it must be pure.",
    narration: "The first time a component appears, React calls your function to produce a description of the UI. This is the render phase. It has to be pure: no fetching, no timers, no touching the screen — just compute and return.",
    notes: [
      { label: "Key term", term: "Render phase", text: "React calling your component function to produce an element tree. It's a calculation, not pixels. Nothing is on screen yet." },
      { label: "If you know web React", text: "this is identical to React on the web. The lifecycle here is React's, not React Native's — the only thing that differs is the host it commits to at the end." },
    ],
    diagram_state: { nodes: [render()], edges: [], highlighted: ["render"], annotations: an("render = call the function, build elements — pure, no side effects", INDIGO) },
  },
  {
    step: 2,
    codeLines: [2, 3],
    caption: "React may call render more than once and throw the result away — StrictMode double-invokes it in dev, and concurrent React can interrupt and restart it.",
    narration: "Because render is pure, React is free to call it more than once and discard the result. In development, Strict Mode runs it twice on purpose to flush out hidden side effects. And concurrent React can start a render, pause it, and restart it. So never put a side effect in the function body — you can't count on it running exactly once.",
    notes: [
      { label: "Gotcha", text: "rendering is not the same as \"happens once\". A mutation in the render body — pushing to an array, starting a timer, bumping a ref to count renders — can run twice or be thrown away. Side effects belong in effects, not the body." },
      { label: "Connects to", text: "Strict Mode's deliberate double-run is the same dev-only check covered in the effects lesson.", link: { href: "/learn/useeffect", label: "useEffect" } },
    ],
    diagram_state: { nodes: [render()], edges: [], highlighted: ["render"], annotations: an("pure → React may call it twice (StrictMode) or restart it (concurrent)", INDIGO) },
  },
  {
    step: 3,
    codeLines: [15, 16, 17, 18, 19],
    caption: "After render, React commits — it mutates the real host tree to match. This phase is synchronous and can't be interrupted.",
    narration: "Once React has the element tree, it commits. It walks the differences and mutates the real host tree to match. Unlike render, the commit is synchronous — it runs start to finish without being paused.",
    notes: [
      { label: "Key term", term: "Commit phase", text: "React applying the computed changes to the host tree. On the web that host is the DOM; in React Native it's the native view tree. This phase is React's, the same on both RN architectures." },
      { label: "Why", text: "concurrent React can pause and restart a render, but it never pauses a commit. A half-applied commit would leave the UI in a broken in-between state, so React always finishes it in one go." },
    ],
    diagram_state: { nodes: [render(), commit()], edges: [e("f1", "render", "commit", "")], highlighted: ["commit"], annotations: an("commit = mutate the host tree, synchronously", SLATE) },
  },
  {
    step: 4,
    codeLines: [16, 17],
    caption: "The host tree is native views — Fabric's C++ shadow tree on the New Architecture, the UIManager view tree on the old one. The React phases above are the same either way.",
    narration: "What does React commit into? Native views. On the New Architecture that's Fabric's C++ shadow tree; on the old architecture it's the UIManager's view tree. Either way the part above — render and commit — is React's reconciler doing the same work. The architecture only changes what sits underneath.",
    notes: [
      { label: "Heads up", text: "don't tie this lifecycle to Fabric. Render, commit, and effects are React's phases and run the same on the old architecture (Paper / UIManager) and the New one (Fabric). Fabric changes what the commit targets underneath, not the React phases themselves." },
      { label: "Next", text: "what Fabric actually does when React commits — build the shadow tree, lay it out, mount it — is the render pipeline.", link: { href: "/learn/render-pipeline", label: "The Render Pipeline" } },
    ],
    diagram_state: { nodes: [render(), commit(), host()], edges: [e("f1", "render", "commit", ""), e("fHost", "commit", "host", "native views", SETTLE)], highlighted: ["host"], annotations: an("host = Fabric C++ tree (new arch) or UIManager (old arch) — same React phases", SLATE) },
  },
  {
    step: 5,
    codeLines: [5, 6],
    caption: "useLayoutEffect fires synchronously right after commit, before the device paints — the moment to measure or fix layout with no flicker.",
    narration: "Right after the commit, and before anything is painted, React runs your useLayoutEffect callbacks synchronously. The host tree exists, so you can measure a node or adjust a position, and the user never sees the in-between frame. Because it blocks painting, keep it light.",
    notes: [
      { label: "Key term", term: "useLayoutEffect", text: "an effect that runs synchronously after commit but before paint. Use it for the rare case where you must read or set layout before the user sees the frame — measuring a view, repositioning to avoid a flash." },
      { label: "Gotcha", text: "it blocks the paint, so heavy work here delays the frame the user sees — a dropped frame, visible jank. Reach for it only to avoid a flicker; otherwise use useEffect." },
    ],
    diagram_state: { nodes: [render(), commit(), host(), layout()], edges: [e("f1", "render", "commit", ""), e("fHost", "commit", "host", "native views", SETTLE), e("fLayout", "commit", "layout", "sync")], highlighted: ["layout"], annotations: an("useLayoutEffect: after commit, before paint — synchronous", SKY) },
  },
  {
    step: 6,
    caption: "Then the device paints the committed frame. This is the first moment the user actually sees the new UI.",
    narration: "Now the device paints. Pixels hit the screen and the user finally sees the result. Everything before this — render, commit, layout effects — happened before a single pixel changed.",
    note: { label: "Key term", term: "Paint", text: "the device drawing the committed frame to the screen. Layout effects run before it; passive effects run after it." },
    diagram_state: { nodes: [render(), commit(), host(), layout(), paint()], edges: [e("f1", "render", "commit", ""), e("fHost", "commit", "host", "native views", SETTLE), e("fLayout", "commit", "layout", "sync"), e("f2", "layout", "paint", "", SETTLE)], highlighted: ["paint"], annotations: an("paint = pixels on screen — the first thing the user sees", GREEN) },
  },
  {
    step: 7,
    codeLines: [10, 11, 13],
    caption: "After paint, React runs useEffect — passive effects. They're deferred and async, so they never block the frame. Subscriptions, fetches, and timers live here.",
    narration: "After the paint, and asynchronously, React runs your useEffect callbacks. These are the passive effects. They don't block the frame, which is why fetching, subscriptions, and timers belong here, not in render or in a layout effect.",
    notes: [
      { label: "Key term", term: "Passive effect", text: "the function you pass to useEffect. It runs after paint, asynchronously, so the user sees the UI first. This is where side effects that reach outside React go." },
      { label: "Try it", text: "in the Playground tab, hit Mount and watch render → layout effect → (paint) → passive effect fire in that real order, then Rename to see cleanup run before setup." },
      { label: "Connects to", text: "when these re-run and how their deps gate that is the whole effects lesson.", link: { href: "/learn/useeffect", label: "useEffect" } },
    ],
    diagram_state: { nodes: [render(), commit(), host(), layout(), paint(), passive()], edges: [e("f1", "render", "commit", ""), e("fHost", "commit", "host", "native views", SETTLE), e("fLayout", "commit", "layout", "sync"), e("f2", "layout", "paint", "", SETTLE), e("f3", "paint", "passive", "async")], highlighted: ["passive"], annotations: an("useEffect: after paint, async — never blocks the frame", VIOLET) },
  },
  {
    step: 8,
    codeLines: [1, 13],
    caption: "A state or prop change re-runs render → commit, but React commits only the diff. Mount happens once; updates can happen many times.",
    narration: "The component is now live. A state or prop change starts the loop again: render the function, reconcile against the last tree, and commit only what actually changed. Mount runs once; this update path can run over and over.",
    notes: [
      { label: "Key term", term: "Update", text: "any render after the first. React diffs the new tree against the old and mutates only the host views that changed — not the whole tree." },
      { label: "Connects to", text: "the enqueue, batch, re-run, reconcile, commit mechanics of an update are the useState lesson.", link: { href: "/learn/usestate", label: "useState & Re-renders" } },
    ],
    diagram_state: { nodes: [render(), commit(), host(), layout(), paint(), passive(), update()], edges: [e("f1", "render", "commit", ""), e("fHost", "commit", "host", "native views", SETTLE), e("fLayout", "commit", "layout", "sync"), e("f2", "layout", "paint", "", SETTLE), e("f3", "paint", "passive", "async"), e("fUpd", "update", "render", "re-render", WARN, true)], highlighted: ["update", "render"], annotations: an("update → re-render → reconcile → commit only the diff", BLUE) },
  },
  {
    step: 9,
    codeLines: [12, 11],
    caption: "On an update, effects whose deps changed run cleanup() first, then re-run. Layout-effect cleanup is synchronous before paint; passive-effect cleanup is async after.",
    narration: "When dependencies change, the matching effects don't just fire again. React first runs the old effect's cleanup, then runs the new setup. Layout effects clean up and re-run synchronously around the commit; passive effects do it after the paint. That cleanup-then-setup order is what keeps subscriptions and timers from piling up.",
    notes: [
      { label: "Key term", term: "cleanup()", text: "the function an effect returns. React runs it before the effect re-runs on a dep change, and once more on unmount. Pair it with setup and nothing leaks." },
      { label: "Connects to", text: "the deps array and the cleanup-before-setup ordering are covered in depth in the effects lesson.", link: { href: "/learn/useeffect", label: "useEffect" } },
    ],
    diagram_state: { nodes: [render(), commit(), host(), layout(), paint(), passive(), update(), cleanup()], edges: [e("f1", "render", "commit", ""), e("fHost", "commit", "host", "native views", SETTLE), e("fLayout", "commit", "layout", "sync"), e("f2", "layout", "paint", "", SETTLE), e("f3", "paint", "passive", "async"), e("fUpd", "update", "render", "re-render", WARN, true), e("fClean", "passive", "cleanup", "returns", WARN, true), e("fRerun", "cleanup", "passive", "then re-run", WARN)], highlighted: ["cleanup", "passive"], annotations: an("dep changed → cleanup() old, then run new setup", AMBER) },
  },
  {
    step: 10,
    codeLines: [7, 12],
    caption: "On unmount React runs every effect's cleanup once more, then removes the host views. A forgotten cleanup is how a timer or listener leaks after you navigate away.",
    narration: "Eventually the component leaves the tree. React runs every effect's cleanup one last time, then removes its host views and reclaims the memory. This is exactly why a missing cleanup bites you — the screen is gone but its timer or listener is still running.",
    notes: [
      { label: "Gotcha", text: "no cleanup means the subscription or interval outlives the screen — a leak, and often a \"can't update state on an unmounted component\" warning. Return a cleanup from every effect that sets something up." },
      { label: "Connects to", text: "a screen that stays mounted underneath a pushed screen — and when it finally unmounts — is the navigation lesson.", link: { href: "/learn/navigation", label: "React Navigation Internals" } },
    ],
    diagram_state: { nodes: [render(), commit(), host("Host views\nremoving…", RED), layout(), paint(), passive(), cleanup(), unmount()], edges: [e("f1", "render", "commit", ""), e("fLayout", "commit", "layout", "sync"), e("f2", "layout", "paint", "", SETTLE), e("f3", "paint", "passive", "async"), e("fUnmount", "unmount", "cleanup", "", RED, true), e("fRemove", "cleanup", "host", "remove views", RED)], highlighted: ["unmount", "cleanup"], annotations: an("unmount: run every cleanup → remove host views → free memory", RED) },
  },
  {
    step: 11,
    caption: "The whole life: render (pure, may re-run) → commit (sync) → useLayoutEffect (before paint) → paint → useEffect (after paint). Update re-runs the loop; unmount runs every cleanup before the views are gone.",
    narration: "So the whole life of a function component: render is pure and may run more than once, commit mutates the host synchronously, layout effects fire before paint, the screen paints, and passive effects fire after. An update re-runs that loop and commits only the diff. Unmount runs every cleanup, then removes the views. All of it is React — the same on both React Native architectures.",
    note: { label: "Next", text: "the synchronous, direct path React uses to mutate native views on the New Architecture is JSI.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    diagram_state: { nodes: [render(), commit(), host(), layout(), paint(), passive(), cleanup(), update(), unmount()], edges: [e("f1", "render", "commit", ""), e("fHost", "commit", "host", "host", SETTLE), e("fLayout", "commit", "layout", "sync"), e("f2", "layout", "paint", "", SETTLE), e("f3", "paint", "passive", "async"), e("fUpd", "update", "render", "re-render", WARN, true), e("fUnmount", "unmount", "cleanup", "", RED, true)], highlighted: [], annotations: an("render → commit → layout effect → paint → passive · update loops · unmount cleans up", GREEN) },
  },
]
