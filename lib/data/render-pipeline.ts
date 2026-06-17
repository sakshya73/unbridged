import { Step, DiagramNode, DiagramEdge } from "../types"

const REACT = "#059669" // React's commit — the trigger
const RENDER = "#4F46E5" // Fabric RENDER phase
const COMMIT = "#7C3AED" // Fabric COMMIT phase
const MOUNT = "#0891B2" // Fabric MOUNT phase
const TREE = "#374151" // shadow nodes
const CLONE = "#D97706" // cloned node
const SHARED = "#94A3B8" // structurally-shared node
const HOST = "#3B82F6" // host / native view
const FLOW = "#818CF8" // forward-flow edges
const SETTLE = "#6EE7B7" // settle / commit edges
const WARN = "#FCD34D" // diff / mutation edges

const mk = (id: string, label: string, x: number, y: number, w: number, h: number, color: string, style: "box" | "pill" = "box"): DiagramNode => ({ id, label, x, y, width: w, height: h, style, color })

const reactCommit = mk("react", "React commits", 40, 18, 230, 40, REACT, "pill")
const phRender = (color = RENDER) => mk("render", "RENDER\nbuild shadow tree (C++)", 40, 80, 200, 60, color)
const phCommit = (color = COMMIT) => mk("commit", "COMMIT\nlayout (Yoga) + promote", 300, 80, 200, 60, color)
const phMount = (color = MOUNT) => mk("mount", "MOUNT\ndiff → mutate host views", 560, 80, 200, 60, color)
const nRoot = (label = "View\n(shadow node)", color = TREE) => mk("root", label, 330, 185, 150, 54, color)
const nText = (label = "Text\n(shadow node)", color = TREE) => mk("text", label, 200, 300, 150, 54, color)
const nImage = (label = "Image\n(shadow node)", color = TREE) => mk("image", label, 460, 300, 150, 54, color)
const nHost = (label = "Host views\n(UI thread)", color = HOST) => mk("host", label, 330, 392, 160, 50, color)

const e = (id: string, from: string, to: string, label = "", color = FLOW, dashed = false): DiagramEdge => ({ id, from, to, label, animated: !dashed, dashed, color })
const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

export const renderPipelineSteps: Step[] = [
  {
    step: 1,
    codeLines: [1, 2],
    caption: "When React finishes a render, it hands a tree to Fabric — the C++ renderer. Fabric runs its own three-phase pipeline: render, commit, mount.",
    narration: "You already know React's side of the story. React calls your components and then commits. But what actually happens on the native side when React commits? That's Fabric, the C plus plus renderer. Fabric runs its own pipeline with three phases: render, commit, and mount. This lesson zooms into those three.",
    notes: [
      { label: "Key term", term: "Fabric", text: "React Native's renderer, written in C++. It turns the tree React produces into real native views. It's been the default renderer since React Native 0.76." },
      { label: "Connects to", text: "this picks up exactly where the lifecycle lesson's commit step ends. There you saw React commit; here you see what the host does next.", link: { href: "/learn/lifecycle", label: "Component Lifecycle" } },
    ],
    diagram_state: { nodes: [reactCommit, phRender()], edges: [e("t1", "react", "render", "triggers", REACT)], highlighted: ["render"], annotations: an("React's commit triggers Fabric's render → commit → mount", RENDER) },
  },
  {
    step: 2,
    codeLines: [1, 2],
    caption: "Heads up: 'render' and 'commit' mean two different things. React has render and commit phases. Fabric ALSO has render, commit, and mount.",
    narration: "Here's the thing that trips people up in interviews. The words render and commit are used twice. React the library has a render phase and a commit phase. Fabric, the renderer, has its own render, commit, and mount phases. They're not the same phases. The clean way to hold it: React finishes its work and commits, and that commit is what starts Fabric's render phase. Two pipelines, stacked.",
    notes: [
      { label: "Heads up", text: "React's render and commit are about React's element tree and Fibers. Fabric's render, commit, and mount are about the C++ shadow tree and native views. When this lesson says render or commit, it means Fabric's, unless it says React's." },
      { label: "Connects to", text: "React's own render and commit phases, including why React's commit can't be interrupted, are the lifecycle lesson.", link: { href: "/learn/lifecycle", label: "Component Lifecycle" } },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount()], edges: [e("t1", "react", "render", "React commits", REACT), e("p1", "render", "commit"), e("p2", "commit", "mount")], highlighted: ["render", "commit", "mount"], annotations: an("React's commit ≠ Fabric's commit — two stacked pipelines", COMMIT) },
  },
  {
    step: 3,
    codeLines: [5, 6, 7, 8, 9],
    caption: "RENDER: as React reduces your elements, Fabric builds a matching C++ tree of shadow nodes — one per host component (View, Text, Image), not per component you wrote.",
    narration: "Start with the render phase. As React works through your element tree, Fabric builds a parallel tree in C plus plus, made of things called shadow nodes. On the very first render it creates one for every host component — a View, a Text, an Image — but not for your own wrapper components, since those are just functions that return host components. This building is synchronous, and it usually runs on the JavaScript thread.",
    notes: [
      { label: "Key term", term: "Shadow node", text: "a C++ object that mirrors one host component. It holds that node's props, style, and children. The whole set of them is the shadow tree — the renderer's own copy of your UI. On first render, one is created per host component." },
      { label: "Connects to", text: "those synchronous C++ calls from JavaScript are exactly what JSI makes possible — no serialized bridge in between.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot(), nText(), nImage()], edges: [e("t1", "react", "render", "React commits", REACT), e("p1", "render", "commit"), e("p2", "commit", "mount"), e("r1", "root", "text", "", TREE), e("r2", "root", "image", "", TREE)], highlighted: ["render", "root", "text", "image"], annotations: an("RENDER: build one shadow node per host component (C++)", RENDER) },
  },
  {
    step: 4,
    codeLines: [12, 13, 14],
    caption: "On an update the shadow tree is immutable. To change one node, Fabric doesn't mutate it — it CLONES the changed node and re-creates the path up to the root.",
    narration: "Now an update. The shadow tree is immutable, so you never edit a node in place. When state changes and React re-renders, Fabric makes a brand new node — a clone — for the node that changed, and clones every node on the path from it up to the root. Everything else stays exactly as it was. That's how a single update produces a fresh tree without copying the whole thing.",
    notes: [
      { label: "Key term", term: "Immutable", text: "a value that can't be changed after it's created. To represent a change you build a new version instead of editing the old one. Fabric's shadow tree works this way — first render creates the nodes, and every later update clones." },
      { label: "Why", text: "immutability is what makes the renderer concurrent-safe. React can build a new tree on one thread while an old tree is still being read on another, with no risk of one corrupting the other." },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot("View'\n(cloned)", CLONE), nText(), nImage("Image'\n(cloned)", CLONE)], edges: [e("p1", "render", "commit"), e("p2", "commit", "mount"), e("r1", "root", "text", "shared", SHARED, true), e("r2", "root", "image", "", CLONE)], highlighted: ["root", "image"], annotations: an("update → clone the changed node + path to root; Text untouched", CLONE) },
  },
  {
    step: 5,
    codeLines: [12, 13, 14],
    caption: "Everything NOT on the changed path is structurally shared — the old and new trees literally point at the same Text node. Cheap immutability.",
    narration: "And here's the payoff, called structural sharing. The nodes that did not change are not copied. The old tree and the new tree both point at the very same Text node in memory. So you get all the safety of a fresh, immutable tree, but you only pay to recreate the handful of nodes that actually changed.",
    notes: [
      { label: "Key term", term: "Structural sharing", text: "reusing the unchanged parts of an old data structure inside a new one instead of deep-copying. Only the changed nodes and their ancestors are new; the rest are shared by reference." },
      { label: "Try it", text: "in the Playground tab, change the Text and re-run. Watch only the changed node and its ancestors light up as clones, while the sibling stays shared." },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot("View'\n(cloned)", CLONE), nText("Text\n(shared)", SHARED), nImage("Image'\n(cloned)", CLONE)], edges: [e("p1", "render", "commit"), e("p2", "commit", "mount"), e("r1", "root", "text", "shared by both trees", SHARED, true), e("r2", "root", "image", "new", CLONE)], highlighted: ["text"], annotations: an("structural sharing: only the changed path is new memory", SHARED) },
  },
  {
    step: 6,
    codeLines: [17, 18],
    caption: "COMMIT: Fabric runs LAYOUT on the new tree. Yoga computes every node's x, y, width, height — usually on a BACKGROUND thread, off the JS thread.",
    narration: "Now the commit phase. Two things happen. First, layout. Fabric hands the new tree to Yoga, the layout engine, which walks the tree and computes a position and a size for every node — its x, y, width, and height. This layout work usually runs on a background thread, not the JavaScript thread, so a busy JS thread doesn't block it.",
    notes: [
      { label: "Key term", term: "Yoga", text: "React Native's layout engine, written in C++. It turns your flexbox styles into the actual pixel box — position and size — for every node. Most of this is pure C++, though Text and TextInput call back into the host platform to measure text (the same synchronous host call the JSI lesson shows)." },
      { label: "Connects to", text: "layout off the JS thread is the point of splitting work across threads. Commit can also run on the UI thread — then mount runs right after, synchronously — so there's no single fixed layout thread.", link: { href: "/learn/threads", label: "The Three Threads" } },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot("View\n0,0 · 375×200", COMMIT), nText("Text\n12,12 · 200×24", COMMIT), nImage("Image\n12,48 · 120×120", COMMIT)], edges: [e("p1", "render", "commit"), e("p2", "commit", "mount"), e("r1", "root", "text", "", TREE), e("r2", "root", "image", "", TREE), e("lay", "commit", "root", "Yoga lays out", SETTLE)], highlighted: ["commit", "root", "text", "image"], annotations: an("COMMIT: Yoga computes x/y/w/h on every node — off the JS thread", COMMIT) },
  },
  {
    step: 7,
    codeLines: [19],
    caption: "Then COMMIT promotes the laid-out tree as the 'next tree' to mount on the next UI-thread tick.",
    narration: "The second half of commit is promotion. Once the new tree has its full layout, Fabric marks it as the next tree to mount. The actual swap lands on the next tick of the UI thread, when mount applies the whole change at once. That all-at-once apply is what keeps every frame consistent — the screen goes from one complete tree to the next, never to some half-old, half-new mix.",
    notes: [
      { label: "Key term", term: "Promote", text: "mark the newly built, fully laid-out tree as the official 'next' tree — the one the mount phase will apply." },
      { label: "Why", text: "you never see a torn frame because mount applies the entire diff in one go, on a single UI-thread tick. A change either fully takes effect or hasn't happened yet." },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot("View\nnext tree", COMMIT), nText(), nImage()], edges: [e("p1", "render", "commit"), e("p2", "commit", "mount", "promote → next tree", SETTLE), e("r1", "root", "text", "", TREE), e("r2", "root", "image", "", TREE)], highlighted: ["commit", "mount"], annotations: an("COMMIT: promote the laid-out tree as the 'next tree' to mount", COMMIT) },
  },
  {
    step: 8,
    codeLines: [21, 22],
    caption: "MOUNT begins with a DIFF, in C++: compare the previously rendered tree against the next tree to find the minimal set of changes.",
    narration: "Mount is the last phase, and it starts by diffing. In C plus plus, Fabric compares the previously rendered tree against the new next tree and works out the smallest set of real changes. This is the same idea as React's reconciliation, but one level lower — it's comparing native view operations, not React elements.",
    notes: [
      { label: "Key term", term: "Diff", text: "comparing the old tree and the new tree to produce only the changes between them, instead of rebuilding everything. Fabric does this in C++ at the start of mount — it's also where view flattening collapses layout-only views so fewer native views get created." },
      { label: "Heads up", text: "this host-side diff is not React's reconciliation. React already diffed elements to decide what to commit; Fabric diffs shadow trees to decide which native view operations to run." },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot(), nText(), nImage("Image\n(changed)", CLONE), nHost()], edges: [e("p1", "render", "commit"), e("p2", "commit", "mount", "promote", SETTLE), e("r1", "root", "text", "", TREE), e("r2", "root", "image", "", CLONE), e("d", "mount", "image", "diff finds change", WARN, true)], highlighted: ["mount", "image"], annotations: an("MOUNT step 1: diff prev vs next tree → only Image changed", MOUNT) },
  },
  {
    step: 9,
    codeLines: [22, 23],
    caption: "MOUNT then applies the minimal MUTATIONS — createView, updateView, removeView, deleteView — to the real host views, synchronously on the MAIN/UI thread.",
    narration: "Then mount applies the result. The diff becomes a list of mutations — create a view, update a view, remove a view, delete a view — and Fabric runs exactly those on the real native views. This part runs synchronously on the main UI thread, because touching native views has to happen there. Only the views that actually changed get mutated; the rest are left alone. Afterward, the next tree becomes the new baseline, so the following update diffs against it.",
    notes: [
      { label: "Key term", term: "Mutation", text: "one operation on the native view tree: createView, updateView, removeView, or deleteView. The diff produces the list; mount runs it on the main thread." },
      { label: "Connects to", text: "mutations run on the main thread for the same reason every UI toolkit demands it: native views are only safe to touch there.", link: { href: "/learn/threads", label: "The Three Threads" } },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot(), nText(), nImage("Image\n(changed)", CLONE), nHost("Host views\nupdateView(Image)", HOST)], edges: [e("p1", "render", "commit"), e("p2", "commit", "mount", "promote", SETTLE), e("r1", "root", "text", "", TREE), e("r2", "root", "image", "", CLONE), e("m", "mount", "host", "updateView", WARN)], highlighted: ["mount", "host"], annotations: an("MOUNT step 2: apply mutations to host views — main thread, sync", MOUNT) },
  },
  {
    step: 10,
    codeLines: [17, 21, 22],
    caption: "The payoff: layout off the JS thread, consistent frames, immutable trees that make concurrent React safe, and minimal main-thread mutations.",
    narration: "Step back and see why it's built this way. Layout runs off the JavaScript thread, so a busy JS thread doesn't freeze your layout. Mount applies a complete change in one tick, so every frame is consistent. The trees are immutable with structural sharing, which is what lets concurrent React build a tree safely in the background. And mount only touches the views that changed, keeping main-thread work small. That combination is the New Architecture renderer.",
    notes: [
      { label: "Key term", term: "Concurrent-safe", text: "safe to build and inspect from more than one thread at once. Immutable trees give you this for free, because nothing is edited in place — there's nothing to corrupt mid-update." },
      { label: "Connects to", text: "why React can pause, restart, and prioritize the render that feeds this pipeline is React's own concurrent model, in the lifecycle lesson.", link: { href: "/learn/lifecycle", label: "Component Lifecycle" } },
    ],
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot(), nText(), nImage(), nHost()], edges: [e("t1", "react", "render", "", REACT), e("p1", "render", "commit"), e("p2", "commit", "mount"), e("r1", "root", "text", "", TREE), e("r2", "root", "image", "", TREE), e("m", "mount", "host", "mutate", SETTLE)], highlighted: ["render", "commit", "mount"], annotations: an("layout off JS thread · consistent frames · immutable trees · minimal mutations", MOUNT) },
  },
  {
    step: 11,
    codeLines: [6, 17, 21],
    caption: "The pipeline: React commits → RENDER builds an immutable C++ shadow tree (clone changed, share the rest) → COMMIT runs Yoga layout off the JS thread, then promotes → MOUNT diffs and mutates host views on the main thread.",
    narration: "So the whole pipeline. React commits, and that triggers Fabric. Render builds an immutable C plus plus shadow tree, cloning only the nodes that changed and sharing the rest. Commit runs Yoga layout, off the JavaScript thread, then promotes the laid-out tree as the next tree. Mount diffs the previous tree against the next one and applies the minimal mutations to the native views, on the main thread. Render, commit, mount — that's how React reaches the screen on the New Architecture.",
    note: { label: "Next", text: "this same render → commit → mount sequence runs for the first time at app launch — the cold-start path from icon tap to first frame.", link: { href: "/learn/startup", label: "App Startup & TTI" } },
    diagram_state: { nodes: [reactCommit, phRender(), phCommit(), phMount(), nRoot(), nText(), nImage(), nHost()], edges: [e("t1", "react", "render", "commits", REACT), e("p1", "render", "commit"), e("p2", "commit", "mount"), e("m", "mount", "host", "mutate host views", SETTLE)], highlighted: [], annotations: an("commit → render (clone+share) → commit (layout+promote) → mount (diff+mutate)", MOUNT) },
  },
]
