import { Step, DiagramNode, DiagramEdge } from "../types"

const INDIGO = "#4F46E5" // entry / source
const BLUE = "#3B82F6" // resolution
const VIOLET = "#8B5CF6" // dependency graph
const AMBER = "#D97706" // transformation (Babel)
const GOLD = "#F59E0B" // cache / changed module
const SLATE = "#374151" // serialization
const GREEN = "#059669" // output bundle / state preserved
const TEAL = "#0D9488" // dev server / websocket
const FLOW = "#818CF8" // animated flow edges
const OK = "#6EE7B7" // emit / hot-swap edges
const DASH = "#FCD34D" // dashed cache / ws edges

// ── pipeline nodes (fixed positions; the diagram builds up across steps) ──
const entry: DiagramNode = { id: "entry", label: "index.js\n(entry)", x: 40, y: 210, width: 150, height: 64, style: "box", color: INDIGO }
const resolve: DiagramNode = { id: "resolve", label: "Resolution", x: 215, y: 60, width: 160, height: 64, style: "box", color: BLUE }
const graph: DiagramNode = { id: "graph", label: "Dependency graph", x: 215, y: 210, width: 160, height: 64, style: "box", color: VIOLET }
const transform: DiagramNode = { id: "transform", label: "Transformation\n(Babel)", x: 415, y: 60, width: 170, height: 64, style: "box", color: AMBER }
const cache: DiagramNode = { id: "cache", label: "transform cache", x: 415, y: 162, width: 170, height: 40, style: "pill", color: GOLD }
const serialize: DiagramNode = { id: "serialize", label: "Serialization", x: 620, y: 60, width: 160, height: 64, style: "box", color: SLATE }
const bundle = (color = GREEN): DiagramNode => ({ id: "bundle", label: "one JS bundle", x: 620, y: 210, width: 160, height: 64, style: "box", color })
const hermesc: DiagramNode = { id: "hermesc", label: "hermesc → .hbc\n(separate step)", x: 620, y: 350, width: 160, height: 54, style: "box", color: GOLD }
// dev-loop row
const devserver: DiagramNode = { id: "devserver", label: "Metro dev server", x: 215, y: 355, width: 160, height: 44, style: "pill", color: TEAL }
const changed: DiagramNode = { id: "changed", label: "changed module", x: 415, y: 350, width: 170, height: 54, style: "box", color: GOLD }
const app = (label = "running app", color = GREEN): DiagramNode => ({ id: "app", label, x: 620, y: 350, width: 160, height: 54, style: "box", color })

const ed = (id: string, from: string, to: string, label: string, color = FLOW, dashed = false): DiagramEdge => ({ id, from, to, label, animated: !dashed, dashed, color })
const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

export const metroSteps: Step[] = [
  {
    step: 1,
    codeLines: [3, 6],
    caption: "Metro starts at one entry file (index.js) and turns your hundreds of source files into something the engine can run.",
    narration: "Before a single line of your app runs, Metro has to gather every source file and turn it into something the JavaScript engine can execute. It always starts from one entry file, usually index dot js.",
    notes: [
      { label: "Key term", term: "Metro", text: "React Native's default bundler. It runs three phases — resolution, transformation, serialization — to produce the JavaScript your app loads. Webpack and Vite do the same job for the web." },
      { label: "If you know web React", text: "same role as webpack or Vite, but tuned for one big mobile bundle and a fast dev server, not many small chunks for the browser." },
    ],
    diagram_state: { nodes: [entry], edges: [], highlighted: ["entry"], annotations: an("one entry file in → one bundle out", INDIGO) },
  },
  {
    step: 2,
    codeLines: [6],
    caption: "Phase 1 — Resolution: from the entry, follow every import/require and walk the whole tree of modules.",
    narration: "Phase one is resolution. Metro reads the entry file, follows every import and require, then follows the imports inside those files, and keeps going until it has found every module your app touches.",
    note: { label: "Key term", term: "Resolution", text: "turning an import string like './Button' or 'react-native' into an actual file on disk. Metro uses Node-style resolution plus React Native's platform extensions." },
    diagram_state: { nodes: [entry, resolve], edges: [ed("e_res", "entry", "resolve", "follow imports")], highlighted: ["resolve"], annotations: an("start at the entry, follow every import", BLUE) },
  },
  {
    step: 3,
    codeLines: [6],
    caption: "Resolution picks platform files (Button.ios.js vs Button.android.js) and outputs a dependency graph: modules = nodes, imports = edges.",
    narration: "Resolution is also where platform wins. An import of Button can resolve to Button dot i o s dot js on iOS, or Button dot android dot js on Android. The output of the whole phase is a dependency graph: every module is a node, every import is an edge.",
    notes: [
      { label: "Key term", term: "Platform extensions", text: "Metro prefers a platform-specific file when one exists — Button.ios.js on iOS, Button.android.js on Android, Button.native.js for both, then plain Button.js. You import './Button'; Metro picks the file." },
      { label: "Gotcha", text: "\"Unable to resolve module X\" is a resolution-phase failure — the import string didn't map to any file. Usually a missing dependency, a typo in the path, or a stale Metro cache after installing a package." },
    ],
    diagram_state: { nodes: [entry, resolve, graph], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph")], highlighted: ["graph"], annotations: an("modules = nodes, imports = edges", VIOLET) },
  },
  {
    step: 4,
    codeLines: [8, 9],
    caption: "Phase 2 — Transformation: each module goes through Babel (JSX, TypeScript, the RN preset) into plain JS the engine can parse.",
    narration: "Phase two is transformation. Metro hands each module to Babel, which strips out JSX and TypeScript and lowers modern syntax down to plain JavaScript. This is per module, not the whole app at once.",
    note: { label: "Key term", term: "Transform", text: "compile one module's source into plain JS using Babel and @react-native/babel-preset (the default since RN 0.73; it used to be called metro-react-native-babel-preset). JSX becomes function calls, TypeScript types are erased, newer syntax is lowered." },
    diagram_state: { nodes: [entry, resolve, graph, transform], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph"), ed("e_tx", "graph", "transform", "per module")], highlighted: ["transform"], annotations: an("JSX + TypeScript → plain JS, one module at a time", AMBER) },
  },
  {
    step: 5,
    codeLines: [8, 9],
    caption: "Transformation runs in a worker pool (parallel processes) and is cached — unchanged files are reused, so your second start is much faster.",
    narration: "Transformation is the slow part, so Metro runs it in a pool of worker processes, in parallel across your CPU cores. It also caches the result of every module. On a rebuild, only the files that actually changed get re-transformed, which is why your second start is so much faster than the first.",
    notes: [
      { label: "Key term", term: "Worker pool", text: "Metro spins up several worker processes and transforms modules across them at once, scaling to your CPU cores. Babel handles one file at a time, so the parallelism is the speed-up." },
      { label: "Gotcha", text: "the transform cache is keyed on file contents and config. If a new package or a Babel config change seems ignored, clear it: start with --reset-cache (RN CLI) or --clear (Expo)." },
    ],
    diagram_state: { nodes: [entry, resolve, graph, transform, cache], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph"), ed("e_tx", "graph", "transform", "per module"), ed("e_cache", "transform", "cache", "reuse unchanged", DASH, true)], highlighted: ["cache"], annotations: an("parallel workers + cache → only re-transform what changed", GOLD) },
  },
  {
    step: 6,
    codeLines: [13, 15, 16, 18],
    caption: "Phase 3 — Serialization: wrap each module in __d(factory, moduleId, deps) — a numeric id per module — in dependency order.",
    narration: "Phase three is serialization. Metro takes the transformed modules and assembles them into one output bundle. Each module is wrapped in a define call — written underscore underscore d — registered under a numeric id, with the list of ids it depends on.",
    notes: [
      { label: "Key term", term: "__d (define)", text: "Metro's module-registration function. Every module becomes __d(factory, moduleId, dependencyMap). Ids are plain numbers by default — there are no file paths left in the runtime bundle, which is why source maps exist to map errors back to your code." },
      { label: "Heads up", text: "Metro does not tree-shake the way webpack or Rollup do. It keeps a registry of every reached module; require is dynamic, so unused exports can't be safely dropped. (A tree-shaking mode exists — experimental in bare RN, on by default in recent Expo — but the classic answer is that Metro doesn't.)" },
    ],
    diagram_state: { nodes: [entry, resolve, graph, transform, cache, serialize], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph"), ed("e_tx", "graph", "transform", "per module"), ed("e_cache", "transform", "cache", "reuse unchanged", DASH, true), ed("e_ser", "transform", "serialize", "assemble")], highlighted: ["serialize"], annotations: an("each module → __d(factory, id, deps), numeric ids", SLATE) },
  },
  {
    step: 7,
    codeLines: [12, 19],
    caption: "A small runtime prelude defines __r (require), __d (define), __c (clear); the bundle ends with __r(entryId) to boot. One JS bundle by default.",
    narration: "The bundle opens with a small runtime: the define function, the require function — written underscore underscore r — and a few polyfills, all guaranteed to load first. At the very end, a single call to require with the entry module's id kicks everything off. By default this is one file: one bundle, one load.",
    notes: [
      { label: "Key term", term: "__r (require)", text: "the runtime require. __r(id) looks up a registered module by its numeric id, runs its factory once, and caches the exports. __r(entryId) at the end of the bundle starts your app." },
      { label: "Why one bundle", text: "a single file means one load and a fast cold start on device. RAM bundles and inlineRequires are optional optimizations that defer evaluating modules until first use — handy for large apps, off by default." },
    ],
    diagram_state: { nodes: [entry, resolve, graph, transform, cache, serialize, bundle()], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph"), ed("e_tx", "graph", "transform", "per module"), ed("e_cache", "transform", "cache", "reuse unchanged", DASH, true), ed("e_ser", "transform", "serialize", "assemble"), ed("e_bundle", "serialize", "bundle", "emit", OK)], highlighted: ["bundle"], annotations: an("runtime + modules + __r(entryId) → one JS bundle", GREEN) },
  },
  {
    step: 8,
    codeLines: [20],
    caption: "Important: Metro emits JavaScript text, not bytecode. Compiling that JS to Hermes bytecode (hermesc) is a separate, later build step.",
    narration: "One thing people conflate: Metro's output is JavaScript text, not bytecode. Turning that JavaScript into Hermes bytecode is a completely separate downstream step, run by the Hermes compiler during the native build. Metro bundles; Hermes compiles.",
    note: { label: "Next", text: "the JavaScript bundle Metro emits is what the Hermes compiler turns into bytecode ahead of time — that's the next lesson.", link: { href: "/learn/hermes", label: "Hermes Engine" } },
    diagram_state: { nodes: [entry, resolve, graph, transform, cache, serialize, bundle(), hermesc], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph"), ed("e_tx", "graph", "transform", "per module"), ed("e_cache", "transform", "cache", "reuse unchanged", DASH, true), ed("e_ser", "transform", "serialize", "assemble"), ed("e_bundle", "serialize", "bundle", "emit", OK), ed("e_hermesc", "bundle", "hermesc", "later build step", DASH, true)], highlighted: ["bundle", "hermesc"], annotations: an("Metro → JS text   ·   Hermes → bytecode (separate)", GOLD) },
  },
  {
    step: 9,
    caption: "In dev, Metro stays running as a server with an open websocket to the app — the channel that powers Fast Refresh.",
    narration: "That is the production path. In development, Metro keeps running as a server and holds an open websocket to your app. This is the live channel that powers Fast Refresh.",
    note: { label: "Key term", term: "Fast Refresh", text: "React Native's hot reload, built on React Refresh. It re-sends only the modules you changed over the websocket and re-evaluates them in place — not a full rebuild. It replaced the older, flakier \"hot reloading\"." },
    diagram_state: { nodes: [entry, resolve, graph, transform, cache, serialize, bundle(), devserver, app()], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph"), ed("e_tx", "graph", "transform", "per module"), ed("e_cache", "transform", "cache", "reuse unchanged", DASH, true), ed("e_ser", "transform", "serialize", "assemble"), ed("e_bundle", "serialize", "bundle", "emit", OK), ed("e_ws", "devserver", "app", "websocket", DASH, true)], highlighted: ["devserver", "app"], annotations: an("dev: an open websocket between Metro and the app", TEAL) },
  },
  {
    step: 10,
    codeLines: [3],
    caption: "Edit a module that only exports React components → Metro re-sends just that module; Fast Refresh re-renders it and PRESERVES function-component state.",
    narration: "Save an edit to a file that only exports React components. Metro re-transforms just that one module and pushes it over the websocket. Fast Refresh swaps it in and re-renders the component, and here's the magic: the local state of your function components survives. Your counter keeps its value.",
    notes: [
      { label: "Why", text: "Fast Refresh preserves useState and useRef for function components and Hooks, as long as the Hook order doesn't change. Class components do not keep their state — only function components and Hooks do." },
      { label: "Try it", text: "in the Playground tab, run Resolve → Transform → Serialize, bump the counter, then edit the Button component and watch its value survive the hot-swap — then edit the config module and watch it reset to zero." },
    ],
    diagram_state: { nodes: [entry, resolve, graph, transform, cache, serialize, bundle(), devserver, changed, app("running app\nstate preserved")], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph"), ed("e_tx", "graph", "transform", "per module"), ed("e_cache", "transform", "cache", "reuse unchanged", DASH, true), ed("e_ser", "transform", "serialize", "assemble"), ed("e_bundle", "serialize", "bundle", "emit", OK), ed("e_changed", "changed", "devserver", "re-send", GOLD), ed("e_swap", "devserver", "app", "hot-swap", OK)], highlighted: ["changed", "app"], annotations: an("component edit → re-send one module → state preserved", GREEN) },
  },
  {
    step: 11,
    codeLines: [12, 13, 16, 19, 20],
    caption: "The loop: resolve the graph → transform in parallel (cached) → serialize to __d/__r with numeric ids → one JS bundle → Hermes compiles it → in dev, Fast Refresh re-sends just what changed.",
    narration: "The whole picture: Metro resolves your dependency graph, transforms each module with Babel in parallel and caches it, serializes everything into define and require calls with numeric ids, and emits one JavaScript bundle that Hermes later compiles to bytecode. In dev, Fast Refresh re-sends only what you changed. One catch: edit a file that's imported outside the React tree, and Fast Refresh can't hot-swap it, so it does a full reload and your state resets.",
    notes: [
      { label: "Gotcha", text: "the full-reload trap: editing a file imported outside the React tree — say a config module pulled in at app registration, not by a rendered component — forces a full reload and loses state. (Editing a file with non-component exports re-runs that module and its importers, which often still keeps component state.)" },
      { label: "Connects to", text: "once that bundle loads, your code runs on the one JS thread, which is where a heavy module can stall the app.", link: { href: "/learn/threads", label: "The Three Threads" } },
    ],
    diagram_state: { nodes: [entry, resolve, graph, transform, cache, serialize, bundle(), devserver, changed, app()], edges: [ed("e_res", "entry", "resolve", "follow imports"), ed("e_graph", "resolve", "graph", "build graph"), ed("e_tx", "graph", "transform", "per module"), ed("e_cache", "transform", "cache", "reuse unchanged", DASH, true), ed("e_ser", "transform", "serialize", "assemble"), ed("e_bundle", "serialize", "bundle", "emit", OK), ed("e_changed", "changed", "devserver", "re-send", GOLD), ed("e_swap", "devserver", "app", "hot-swap", OK)], highlighted: [], annotations: an("resolve → transform → serialize → bundle → (Hermes) → Fast Refresh", GREEN) },
  },
]
