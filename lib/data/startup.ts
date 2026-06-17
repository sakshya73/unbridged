import { Step, DiagramNode, DiagramEdge } from "../types"

const MAIN = "#0F766E" // main / UI thread lane + native blocks
const JS = "#4F46E5" // JS thread lane
const SHADOW = "#7C3AED" // shadow thread (layout) lane
const ENGINE = "#8B5CF6" // engine spin-up
const BUNDLE = "#F59E0B" // bundle load + eval
const RENDER = "#059669" // first render / reconcile
const TTIc = "#DC2626" // TTI / first interactive frame
const FLOW = "#818CF8" // forward-flow edges
const LEVER = "#0D9488" // lever / win edges
const SLOW = "#FCA5A5" // dashed "without the lever" cost

const mk = (id: string, label: string, x: number, y: number, w: number, h: number, color: string, style: "box" | "pill" = "box"): DiagramNode => ({ id, label, x, y, width: w, height: h, style, color })

// lane labels (left edge) — same three threads as the Threads lesson
const laneMain = mk("laneMain", "Main / UI thread", 8, 84, 118, 48, MAIN, "pill")
const laneJs = mk("laneJs", "JS thread", 8, 198, 118, 48, JS, "pill")
const laneShadow = mk("laneShadow", "Shadow thread\n(layout)", 8, 312, 118, 52, SHADOW, "pill")
const lanes = [laneMain, laneJs, laneShadow]

// phase blocks (march left → right along the shared time axis)
const launch = (color = MAIN) => mk("launch", "Native launch\n+ RN host", 140, 84, 160, 48, color)
const engine = (color = ENGINE) => mk("engine", "Runtime + engine\n(Hermes)", 150, 198, 150, 48, color)
const evalb = (color = BUNDLE) => mk("eval", "Bundle load + eval\nmmap .hbc", 320, 198, 160, 48, color)
const render = (color = RENDER) => mk("render", "First render\nreconcile", 500, 198, 150, 48, color)
const layoutb = (color = SHADOW) => mk("layout", "Commit + layout\nYoga", 500, 312, 150, 48, color)
const mount = (color = MAIN) => mk("mount", "Mount views", 500, 84, 150, 48, color)
const tti = (color = TTIc) => mk("tti", "First frame\nTTI", 665, 84, 110, 48, color)
const parse = mk("parse", "parse + compile\n(no Hermes · JS thread)", 150, 398, 170, 44, SLOW)

const e = (id: string, from: string, to: string, label: string, color = FLOW, dashed = false): DiagramEdge => ({ id, from, to, label, animated: !dashed, dashed, color })
const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

const E = {
  le: e("e_le", "launch", "engine", "init runtime"),
  ee: e("e_ee", "engine", "eval", "load + eval", BUNDLE),
  er: e("e_er", "eval", "render", "first render", RENDER),
  rl: e("e_rl", "render", "layout", "commit", SHADOW),
  lm: e("e_lm", "layout", "mount", "mount", MAIN),
  mt: e("e_mt", "mount", "tti", "first frame", TTIc),
}

export const startupSteps: Step[] = [
  {
    step: 1,
    codeLines: [1, 2],
    caption: "Cold start runs across three threads at once. We'll lay them out as lanes and march the boot left to right — tap to first interactive frame.",
    narration: "When you tap a React Native app's icon from cold, the work doesn't happen in one place. It runs across three threads: the main thread that draws the screen, the JavaScript thread that runs your code, and a shadow thread that does layout. We'll lay those out as lanes and march the startup left to right, from the tap to the first frame the user can actually use.",
    notes: [
      { label: "Key term", term: "Cold start", text: "launching when the app's process isn't already running — the OS builds it from scratch. A warm start, where the process is still alive in the background, reuses the runtime and skips most of phase one." },
      { label: "Connects to", text: "these are the same three threads from the threads lesson — JS, the main/UI thread, and the shadow thread that runs layout. This is what each is doing at launch.", link: { href: "/learn/threads", label: "The Three Threads" } },
    ],
    diagram_state: { nodes: [...lanes], edges: [], highlighted: ["laneMain", "laneJs", "laneShadow"], annotations: an("tap → first interactive frame, across three threads") },
  },
  {
    step: 2,
    codeLines: [6],
    caption: "Phase 1 — Native launch. The OS creates the process and runs your native app's startup, all on the main thread.",
    narration: "Phase one is native launch. The operating system creates the app's process, loads the native binary, and runs your platform startup code — the iOS app delegate or the Android activity. None of your JavaScript has run yet. This is plain native app launch, on the main thread.",
    notes: [
      { label: "Heads up", text: "this first slice is the same launch any native app pays — process creation, loading the binary, the splash screen. The splash you stare at covers everything up to the first frame. You can't make the OS skip this part." },
    ],
    diagram_state: { nodes: [...lanes, launch()], edges: [], highlighted: ["launch"], annotations: an("OS creates the process, runs native startup — no JS yet", MAIN) },
  },
  {
    step: 3,
    caption: "Still native: your app sets up the React Native host — a ReactHost and a Surface (the RootView) — the container the JS-driven UI will mount into.",
    narration: "Still on the main thread, your native app sets up the React Native host. On the New Architecture that's a React Host and a Surface; you may also hear it called the root view. Think of it as the empty container that your React tree will eventually mount into. The host is native; what fills it is driven by JavaScript.",
    notes: [
      { label: "Key term", term: "Surface / RootView", text: "the native view that hosts a React Native screen. React renders into it, and a native app can have several — that's how RN embeds inside an existing native app." },
      { label: "Heads up", text: "since React Native 0.76 the New Architecture is the default, so this is a bridgeless ReactHost. The startup shape is the same on the old architecture; only the plumbing under the host differs." },
    ],
    diagram_state: { nodes: [...lanes, launch()], edges: [], highlighted: ["launch"], annotations: an("set up the RN host — the native container JS will fill", MAIN) },
  },
  {
    step: 4,
    codeLines: [7],
    caption: "Phase 2 — The RN runtime initializes and the JS engine (Hermes) spins up. The engine has to exist before any of your code can run.",
    narration: "Phase two: the React Native runtime initializes and the JavaScript engine starts up. By default that engine is Hermes. This is real work — creating the runtime, wiring up the native modules it needs, and getting the engine ready to execute. Until the engine exists, not a single line of your JavaScript can run.",
    notes: [
      { label: "Key term", term: "Runtime init", text: "creating the JS engine instance and the React Native runtime around it, then registering the core native modules. It's startup overhead you pay before your code runs." },
      { label: "Connects to", text: "Hermes is the engine being started here — and how it loads its bytecode is the next phase's whole story.", link: { href: "/learn/hermes", label: "Hermes Engine" } },
    ],
    diagram_state: { nodes: [...lanes, launch(), engine()], edges: [E.le], highlighted: ["engine"], annotations: an("runtime + JS engine start — your code still can't run yet", ENGINE) },
  },
  {
    step: 5,
    codeLines: [8, 9],
    caption: "Phase 3 — Bundle load + eval. Hermes memory-maps the precompiled .hbc bytecode (no on-device parse) and evaluates the module factories.",
    narration: "Phase three is where your code finally shows up. The JavaScript bundle is loaded and evaluated. Because Hermes ships your code as precompiled bytecode, it memory-maps the dot h b c file instead of parsing JavaScript text on the device. Then it evaluates the module factories — the wrapped modules Metro produced — which defines your components so they're ready to use.",
    notes: [
      { label: "Key term", term: "Evaluate (eval)", text: "running each module's top-level code once so its exports exist. Metro wraps every module in a factory; evaluating the bundle runs the factories the entry needs. This is separate from loading the file into memory." },
      { label: "Connects to", text: "loading bytecode instead of parsing JS text on device is the Hermes win — the heavy parse and compile already happened at build time.", link: { href: "/learn/hermes", label: "Hermes Engine" } },
      { label: "Connects to", text: "the bundle being loaded here is Metro's single output file, with its __d/__r module registry. In dev it's fetched over Metro's websocket, which is far slower than the release path.", link: { href: "/learn/metro", label: "Metro Bundler" } },
    ],
    diagram_state: { nodes: [...lanes, launch(), engine(), evalb()], edges: [E.le, E.ee], highlighted: ["eval"], annotations: an("Hermes mmaps .hbc (no parse) → evaluate module factories", BUNDLE) },
  },
  {
    step: 6,
    codeLines: [3, 4, 11],
    caption: "The entry runs: AppRegistry.registerComponent('App', () => App) registered your root, and the host calls runApplication to start it.",
    narration: "As the bundle evaluates, your entry file runs. It calls App Registry dot register Component to register your root component under a name. When the native host is ready, it calls run application with that name, which is the signal to actually start rendering. Registering names the component; running it kicks off the first render.",
    notes: [
      { label: "Key term", term: "AppRegistry", text: "React Native's entry point. registerComponent maps a name to your root component; the native side calls runApplication(name) to mount it into a Surface. It's the JS-to-native handshake that starts your UI." },
      { label: "If you know web React", text: "this pair is React Native's version of ReactDOM's createRoot then root.render — register the root, then tell it to start. The split exists because native owns when the Surface is ready." },
    ],
    diagram_state: { nodes: [...lanes, launch(), engine(), evalb()], edges: [E.le, E.ee], highlighted: ["eval"], annotations: an("registerComponent names the root · runApplication starts it", BUNDLE) },
  },
  {
    step: 7,
    codeLines: [14],
    caption: "Phase 4 — First render. React calls your component tree and reconciles it. This is compute on the JS thread, not pixels.",
    narration: "Phase four: the first render. React calls your root component, then its children, all the way down, and reconciles the result into a description of the UI. This is pure calculation on the JavaScript thread — figuring out what should be on screen. Nothing has been drawn yet.",
    notes: [
      { label: "Key term", term: "First render", text: "React's initial pass that turns your component tree into an element tree, ready to become native views. It's a calculation; no native view exists yet." },
      { label: "Heads up", text: "a heavy first render is a real TTI cost — too many components, expensive top-level work, or big synchronous calls at startup all land here, on the one JS thread." },
    ],
    diagram_state: { nodes: [...lanes, launch(), engine(), evalb(), render()], edges: [E.le, E.ee, E.er], highlighted: ["render"], annotations: an("React reconciles your tree — compute on the JS thread, no pixels yet", RENDER) },
  },
  {
    step: 8,
    codeLines: [15, 16],
    caption: "Phase 5 — Commit, layout, mount. Yoga lays out the tree on the shadow thread (off the JS thread), then the first host views mount on the main thread.",
    narration: "Phase five turns that description into real views. React commits the tree, Yoga calculates the layout — where every box goes — on the shadow thread, off the JavaScript thread, and then the first native views are mounted onto the main thread. Render, commit, mount: that's the render pipeline, running for the very first time.",
    notes: [
      { label: "Key term", term: "Commit / mount", text: "commit promotes the new tree and schedules layout; mount applies it as real native views. Layout (Yoga) runs on the shadow/background thread; mounting the views runs on the main thread." },
      { label: "Connects to", text: "this first commit and mount is the render pipeline in full — render on JS, layout on a background thread, mount on the main thread.", link: { href: "/learn/render-pipeline", label: "The Render Pipeline" } },
    ],
    diagram_state: { nodes: [...lanes, launch(), engine(), evalb(), render(), layoutb(), mount()], edges: [E.le, E.ee, E.er, E.rl, E.lm], highlighted: ["layout", "mount"], annotations: an("commit → Yoga layout (shadow thread) → mount host views (main thread)", MAIN) },
  },
  {
    step: 9,
    codeLines: [17],
    caption: "Phase 6 — First frame. The first interactive frame paints. TTI ≈ native init + bundle load+eval + first render + commit/mount.",
    narration: "Phase six: the first interactive frame paints. The user finally sees, and can tap, your app. That moment is time to interactive, or T T I. Add it up: native init, plus bundle load and eval, plus first render, plus commit and mount. Everything in the lanes before this point is the cost you're paying to reach it.",
    notes: [
      { label: "Key term", term: "TTI", text: "time-to-interactive — from the icon tap to the first frame the user can actually use. It's roughly the sum of native init, bundle load and eval, the first render, and the first commit and mount." },
      { label: "Try it", text: "in the Playground tab, toggle Hermes and inline requires and watch the TTI flag slide — the levers change where the time goes." },
    ],
    diagram_state: { nodes: [...lanes, launch(), engine(), evalb(), render(), layoutb(), mount(), tti()], edges: [E.le, E.ee, E.er, E.rl, E.lm, E.mt], highlighted: ["tti"], annotations: an("TTI ≈ native init + load+eval + first render + commit/mount", TTIc) },
  },
  {
    step: 10,
    codeLines: [7, 8],
    caption: "Lever 1 — Hermes. Without it, the engine ships raw JS and pays a parse + compile block on device before eval. Hermes deletes that block.",
    narration: "Now the levers that shrink T T I. The biggest one is Hermes, and it's already the default. Without Hermes, the engine ships raw JavaScript and has to parse and compile it on the device before anything runs — an extra block right before eval, and it grows with your bundle. Hermes does that work at build time instead, so on the device there's nothing to parse. The block disappears.",
    notes: [
      { label: "Key term", term: "Parse + compile", text: "turning JavaScript source text into something the engine can run. With a non-Hermes engine this happens on the device every launch; Hermes moves it to build time, shipping bytecode the engine just loads." },
      { label: "Connects to", text: "why precompiled bytecode skips on-device parse is the whole Hermes lesson.", link: { href: "/learn/hermes", label: "Hermes Engine" } },
    ],
    diagram_state: { nodes: [...lanes, launch(), engine(), evalb(), render(), layoutb(), mount(), tti(), parse], edges: [E.le, E.ee, E.er, E.rl, E.lm, E.mt, e("e_parse", "engine", "parse", "without Hermes", SLOW, true)], highlighted: ["parse", "eval"], annotations: an("no Hermes → parse + compile on device every launch (grows with bundle)", SLOW) },
  },
  {
    step: 11,
    codeLines: [8, 14],
    caption: "Lever 2 — inline requires defer factory eval to first use, shrinking the eval block. Plus: a smaller bundle, and InteractionManager for non-critical work.",
    narration: "The other big lever is inline requires. Without them, the eval phase runs every module factory up front. Inline requires move each require to the moment a module is first used, so factories you don't need at startup don't run yet, and the eval block shrinks. In the React Native CLI they're already on by default. Beyond that: a smaller bundle is simply less to load and run, and Interaction Manager lets you push non-critical work until after the first interactions settle.",
    notes: [
      { label: "Key term", term: "Inline requires", text: "a transform that rewrites top-of-file imports into a require at first use, so module factories evaluate lazily instead of all at startup. On by default in the RN CLI; off by default in Expo, where you opt in via Metro config." },
      { label: "Gotcha", text: "lazy eval changes the order modules run in, and a module that relied on running at startup for a side effect may never run. RAM bundles were the older take on lazy loading, but they're incompatible with Hermes (the default) and superseded by it — reach for inline requires, not RAM bundles." },
    ],
    diagram_state: { nodes: [...lanes, launch(), engine(), evalb(), render(), layoutb(), mount(), tti()], edges: [E.le, E.ee, E.er, E.rl, E.lm, E.mt, e("e_lever", "eval", "tti", "defer eval → shrink", LEVER, true)], highlighted: ["eval", "tti"], annotations: an("inline requires defer factory eval (on by default) · + smaller bundle, InteractionManager", LEVER) },
  },
  {
    step: 12,
    codeLines: [6, 8, 14, 15, 17],
    caption: "The whole cold start: native launch → runtime + engine → bundle load+eval → first render → commit + layout + mount → first frame. TTI is their sum; Hermes and inline requires shrink it.",
    narration: "So the whole cold start, end to end. The OS launches the process and sets up the native host. The runtime and the Hermes engine start. The bundle loads and its factories evaluate. Your entry registers and runs the root. React renders the first tree, commits it, Yoga lays it out on the shadow thread, and the main thread mounts the views. The first interactive frame paints — that's T T I, the sum of all of it. To shrink it: Hermes deletes the on-device parse, inline requires defer the eval, and you defer whatever isn't needed to reach that first frame.",
    note: { label: "Next", text: "the first commit and mount you just watched — render, layout, then mount on the main thread — is the render pipeline, covered in full next.", link: { href: "/learn/render-pipeline", label: "The Render Pipeline" } },
    diagram_state: { nodes: [...lanes, launch(), engine(), evalb(), render(), layoutb(), mount(), tti()], edges: [E.le, E.ee, E.er, E.rl, E.lm, E.mt], highlighted: [], annotations: an("launch → runtime + engine → load+eval → render → commit/mount → first frame", TTIc) },
  },
]
