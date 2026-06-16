import { Step, DiagramNode, DiagramEdge } from "../types"

const BOX = { width: 170, height: 64, style: "box" as const }
const render: DiagramNode = { id: "render", label: "Render\n(pure)", x: 60, y: 165, ...BOX, color: "#4F46E5" }
const commit: DiagramNode = { id: "commit", label: "Commit", x: 250, y: 165, ...BOX, color: "#374151" }
const paint: DiagramNode = { id: "paint", label: "Paint", x: 440, y: 165, ...BOX, color: "#059669" }
const effect = (label = "useEffect runs", color = "#8B5CF6"): DiagramNode => ({ id: "effect", label, x: 620, y: 165, ...BOX, color })
const side: DiagramNode = { id: "side", label: "side effect\nsubscribe · fetch · timer", x: 600, y: 350, width: 190, height: 64, style: "box", color: "#3B82F6" }
const cleanup = (color = "#D97706"): DiagramNode => ({ id: "cleanup", label: "cleanup()", x: 620, y: 60, ...BOX, color })
const pill = (id: string, label: string, x: number, color: string): DiagramNode => ({ id, label, x, y: 360, width: 190, height: 40, style: "pill", color })
const depEmpty = pill("dE", "[ ]  ·  once on mount", 30, "#059669")
const depVal = pill("dV", "[roomId]  ·  on change", 235, "#F59E0B")
const depNone = pill("dN", "no array  ·  every render", 440, "#DC2626")
const depObj = pill("dO", "[{ id: roomId }]  ·  every render", 420, "#DC2626")

const flow: DiagramEdge[] = [
  { id: "f1", from: "render", to: "commit", animated: true, color: "#818CF8" },
  { id: "f2", from: "commit", to: "paint", animated: true, color: "#818CF8" },
  { id: "f3", from: "paint", to: "effect", animated: true, color: "#818CF8" },
]
const eSide: DiagramEdge = { id: "eSide", from: "effect", to: "side", animated: true, color: "#818CF8" }
const eEmpty: DiagramEdge = { id: "eEmpty", from: "dE", to: "effect", dashed: true, color: "#6EE7B7", label: "run 1×" }
const eVal: DiagramEdge = { id: "eVal", from: "dV", to: "effect", dashed: true, color: "#FCD34D", label: "on change" }
const eNone: DiagramEdge = { id: "eNone", from: "dN", to: "effect", dashed: true, color: "#DC2626", label: "always" }
const eObj: DiagramEdge = { id: "eObj", from: "dO", to: "effect", dashed: true, color: "#DC2626", label: "always" }
const eReturns: DiagramEdge = { id: "eRet", from: "effect", to: "cleanup", dashed: true, color: "#FCD34D", label: "returns" }
const eRerun: DiagramEdge = { id: "eRer", from: "cleanup", to: "effect", animated: true, color: "#FCD34D", label: "then re-run" }

const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

export const useeffectSteps: Step[] = [
  {
    step: 1,
    codeLines: [12],
    caption: "React calls your component to produce the next UI — render is pure, no side effects here.",
    narration: "Let's trace what happens when a component renders. First React calls your component to produce the next UI description. Render must stay pure — no side effects.",
    note: { label: "Key term", term: "Effect", text: "the function you pass to useEffect — code that reaches outside React: a fetch, a subscription, a timer. Render itself must stay pure (React may call it many times or throw it away), so effects are where that work goes." },
    diagram_state: { nodes: [render], edges: [], highlighted: ["render"], annotations: an("render is pure — no side effects allowed here", "#4F46E5") },
  },
  {
    step: 2,
    codeLines: [12],
    caption: "React commits the new tree to the host.",
    narration: "Next, React commits those changes to the host tree.",
    notes: [
      { label: "Key term", term: "Commit", text: "React writing the new tree to the host — the DOM on the web, native views in React Native." },
      { label: "Connects to", text: "this is the commit you saw at the end of the useState lesson — effects fire right after it.", link: { href: "/learn/usestate", label: "useState & Re-renders" } },
    ],
    diagram_state: { nodes: [render, commit], edges: [flow[0]], highlighted: ["commit"], annotations: an("commit the new tree to the host", "#374151") },
  },
  {
    step: 3,
    codeLines: [12],
    caption: "The device paints those pixels — before any effect runs.",
    narration: "Then the device paints those pixels to the screen. The user sees the UI here.",
    note: { label: "Key term", term: "Paint", text: "the device drawing the committed pixels to the screen — what the user actually sees, before any effect runs." },
    diagram_state: { nodes: [render, commit, paint], edges: [flow[0], flow[1]], highlighted: ["paint"], annotations: an("the screen shows pixels before any effect runs", "#059669") },
  },
  {
    step: 4,
    codeLines: [4, 5],
    caption: "Only now, after paint, does useEffect run — effects never block what the user sees.",
    narration: "Only now, after paint, does React run your useEffect callback. That's the key idea: effects never block what the user sees.",
    notes: [
      { label: "Key term", term: "useEffect vs useLayoutEffect", text: "useEffect is deferred — it runs after paint, so it never blocks the frame. useLayoutEffect runs right after commit, before paint, for the rare case you must read or set layout before the user sees it." },
      { label: "Connects to", text: "this is the \"update\" phase of a component's life.", link: { href: "/learn/lifecycle", label: "Component Lifecycle" } },
    ],
    diagram_state: { nodes: [render, commit, paint, effect()], edges: flow, highlighted: ["effect"], annotations: an("effects run after the paint, not during render", "#8B5CF6") },
  },
  {
    step: 5,
    codeLines: [6, 7],
    caption: "The effect reaches outside React — open a subscription, fetch, start a timer.",
    narration: "What an effect does best is reach outside React: fetching data, opening a subscription, starting a timer.",
    note: { label: "Next", text: "in React Native, calls like these reach the native side through TurboModules over JSI.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    diagram_state: { nodes: [render, commit, paint, effect(), side], edges: [...flow, eSide], highlighted: ["side"], annotations: an("reach outside React: subscribe, fetch, time", "#3B82F6") },
  },
  {
    step: 6,
    codeLines: [10],
    caption: "[] — runs once after mount (in production).",
    narration: "The dependency array decides when the effect re-runs. With an empty array, it runs once after the first mount.",
    note: { label: "Key term", term: "Deps", text: "the array after the effect. It's how you tell React when to re-run: [] = once after mount; [a, b] = when a or b changes; no array = after every render." },
    diagram_state: { nodes: [render, commit, paint, effect(), depEmpty], edges: [...flow, eEmpty], highlighted: ["dE"], annotations: an("empty deps → mount-only setup", "#059669") },
  },
  {
    step: 7,
    codeLines: [10],
    caption: "[roomId] — re-runs only when roomId changes, by Object.is.",
    narration: "List a value like roomId and React re-runs the effect only when that value changes between renders, comparing with Object dot is.",
    note: { label: "Key term", term: "Shallow compare", text: "React compares each dep by identity (Object.is), not deeply. Two objects with the same contents are still different references — that bites in two steps." },
    diagram_state: { nodes: [render, commit, paint, effect(), depEmpty, depVal], edges: [...flow, eEmpty, eVal], highlighted: ["dV"], annotations: an("re-runs only when a listed dep changes", "#F59E0B") },
  },
  {
    step: 8,
    codeLines: [10],
    caption: "No array — the effect runs after every render (usually a bug).",
    narration: "Omit the array entirely and the effect runs after every single render — almost always a mistake.",
    diagram_state: { nodes: [render, commit, paint, effect(), depEmpty, depVal, depNone], edges: [...flow, eEmpty, eVal, eNone], highlighted: ["dN"], annotations: an("no array → every render (usually a bug)", "#DC2626") },
  },
  {
    step: 9,
    caption: "[{ id: roomId }] is a fresh object every render → Object.is always says \"changed\" → it fires every render. setState inside → infinite loop.",
    narration: "Here's the most common useEffect bug. A dependency like an object literal is a brand-new identity every render, so Object dot is always sees it as changed, so the effect fires every render. If it sets state, that's an infinite loop.",
    note: { label: "Gotcha", text: "depend on the primitive (roomId), not an object, array, or function literal — or stabilize it with useMemo / useCallback. An inline object is a new identity every render, exactly like the memo trap in the useState lesson." },
    diagram_state: { nodes: [render, commit, paint, effect("useEffect (fires every render)", "#DC2626"), depObj], edges: [...flow, eObj], highlighted: ["effect", "dO"], annotations: an("fresh object each render → fires every time → loop", "#DC2626") },
  },
  {
    step: 10,
    caption: "Leave a value out of deps and the effect freezes to the render it was born in — setInterval(() => setCount(count + 1), []) sticks at 1.",
    narration: "The flip side: leave a value out of the deps and the effect freezes to the render it was created in. A setInterval that reads count with empty deps keeps reading the first count and sticks at one.",
    note: { label: "Gotcha", text: "list the value in deps, or use the functional updater setCount(c => c + 1) so you never read a stale snapshot. The exhaustive-deps lint rule catches most of these." },
    diagram_state: { nodes: [render, commit, paint, effect("useEffect (stale closure)", "#DC2626")], edges: flow, highlighted: ["effect"], annotations: an("missing dep → frozen to an old snapshot", "#DC2626") },
  },
  {
    step: 11,
    codeLines: [9],
    caption: "Return a function and it's the cleanup — it runs before the next effect re-run and on unmount.",
    narration: "If your effect returns a function, that's the cleanup. React runs it before the next effect re-run, and once more when the component unmounts.",
    note: { label: "Key term", term: "Cleanup", text: "the teardown you return — unsubscribe, clear the timer, abort the fetch. It pairs with setup so nothing leaks." },
    diagram_state: { nodes: [render, commit, paint, effect(), side, cleanup()], edges: [...flow, eSide, eReturns], highlighted: ["cleanup"], annotations: an("cleanup runs before re-run and on unmount", "#D97706") },
  },
  {
    step: 12,
    codeLines: [9, 6],
    caption: "On a dep change: tear down the old subscription, THEN set up the new one — no leaks.",
    narration: "So the real cycle on every re-run is cleanup, then effect. Tear down the old subscription before setting up the new one. That ordering is what keeps your side effects leak-free.",
    diagram_state: { nodes: [render, commit, paint, effect(), side, cleanup()], edges: [...flow, eSide, eReturns, eRerun], highlighted: ["cleanup", "effect"], annotations: an("tear down old → set up new — no leaks", "#D97706") },
  },
  {
    step: 13,
    codeLines: [6, 9],
    caption: "In dev, StrictMode runs it twice — mount, clean up, mount again — to test that your cleanup is symmetric.",
    narration: "In development, Strict Mode deliberately runs the effect twice: mount, clean up, mount again. It's a test that your cleanup undoes your setup. It does not happen in production.",
    note: { label: "Gotcha", text: "this double-run is a test, not a bug, and it's dev-only. Fix it by making cleanup undo setup exactly — never by deleting deps or adding a \"has run\" guard ref. (This site turns StrictMode off so the playground counts read clean.)" },
    diagram_state: { nodes: [render, commit, paint, effect("useEffect (×2 in dev)", "#8B5CF6"), cleanup()], edges: [...flow, eReturns, eRerun], highlighted: ["effect", "cleanup"], annotations: an("dev only: mount → cleanup → mount again", "#8B5CF6") },
  },
  {
    step: 14,
    caption: "Effects run after commit and paint; the deps array (shallow Object.is) gates re-runs — [] once, [a, b] on change, none every render; cleanup runs before the next effect and on unmount.",
    narration: "The whole picture: effects run after commit and paint. The deps array, compared shallowly, gates re-runs — empty for once, listed values on change, none for every render. And cleanup runs before the next effect and on unmount.",
    note: { label: "Next", text: "next: how all of this fits a component's full life — mount, update, unmount.", link: { href: "/learn/lifecycle", label: "Component Lifecycle" } },
    diagram_state: { nodes: [render, commit, paint, effect(), cleanup()], edges: [...flow, eReturns], highlighted: [], annotations: an("after paint → deps gate re-runs → cleanup before next", "#059669") },
  },
]
