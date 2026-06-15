import { Step, DiagramNode, DiagramEdge } from "../types"

// Reusable nodes so the steps stay consistent and DRY.
const js = (busy = false): DiagramNode => ({
  id: "js",
  label: busy ? "JS Thread\n(busy — blocked)" : "JS Thread\nyour React code",
  x: 60,
  y: 150,
  width: 200,
  height: 120,
  style: "box",
  color: busy ? "#DC2626" : "#4F46E5",
})

const native = (waiting = false): DiagramNode => ({
  id: "native",
  label: waiting ? "Native UI Thread\n(waiting…)" : "Native UI Thread\nreal iOS / Android views",
  x: 540,
  y: 150,
  width: 200,
  height: 120,
  style: "box",
  color: waiting ? "#94A3B8" : "#059669",
})

const bridge: DiagramNode = {
  id: "bridge",
  label: "The Bridge",
  x: 300,
  y: 185,
  width: 200,
  height: 50,
  style: "pill",
  color: "#D97706",
}

const rails: DiagramEdge[] = [
  { id: "r1", from: "js", to: "bridge", color: "#D8DCE6" },
  { id: "r2", from: "bridge", to: "native", color: "#D8DCE6" },
]

export const bridgeSteps: Step[] = [
  {
    step: 1,
    codeLines: [1, 2],
    caption: "Your app lives in two worlds. On the left, the JS thread runs all your React code — components, state, the logic you write.",
    narration: "Your app lives in two worlds. On the left, the JS thread runs all your React code — your components, state, and logic.",
    note: {
      label: "Key term",
      term: "Thread",
      text: "a line of work the device runs on its own. JavaScript gets one thread; the screen is drawn on another. They run at the same time, but neither can reach into the other's memory.",
    },
    diagram_state: { nodes: [js()], edges: [], highlighted: ["js"], annotations: [] },
  },
  {
    step: 2,
    codeLines: [6],
    caption: "On the right, the native thread owns the real UI — the actual iOS and Android views the user sees and touches.",
    narration: "On the right, the native thread owns the real UI — the actual iOS and Android views the user sees and touches.",
    note: {
      label: "Heads up",
      text: "The native side is really two threads — one works out the layout, one paints it. We treat it as one here to keep things clear.",
      link: { href: "/learn/threads", label: "The Three Threads" },
    },
    diagram_state: { nodes: [js(), native()], edges: [], highlighted: ["native"], annotations: [] },
  },
  {
    step: 3,
    caption: "These two can't call each other directly. Separate runtimes, separate memory, different languages.",
    narration: "These two can't call each other directly. They're separate runtimes, with separate memory, running different languages.",
    note: {
      label: "Key term",
      term: "Runtime",
      text: "the engine your code runs inside. JS runs in a JS engine (Hermes or JSC); native runs in the OS runtime (Swift, Kotlin). Think two separate computers — neither can read the other's variables.",
    },
    diagram_state: {
      nodes: [js(), native()],
      edges: [{ id: "blocked", from: "js", to: "native", color: "#DC2626", dashed: true, label: "no direct calls" }],
      highlighted: ["js", "native"],
      annotations: [{ id: "a3", text: "separate runtimes · no shared memory", x: 400, y: 405, color: "#DC2626" }],
    },
  },
  {
    step: 4,
    caption: "So React Native puts a messenger between them — the Bridge. Anything one side wants from the other goes through it.",
    narration: "So React Native puts a messenger between them — the Bridge. Anything one side wants from the other goes through it.",
    diagram_state: { nodes: [js(), bridge, native()], edges: rails, highlighted: ["bridge"], annotations: [] },
  },
  {
    step: 5,
    codeLines: [6],
    caption: "Say your JS renders <Text>Hi</Text>. It can't draw anything itself — it needs the native side to build a real text view.",
    narration: "Say your JS renders a Text element. It can't draw anything itself — it needs the native side to build a real text view.",
    note: {
      label: "If you know web React",
      text: "On the web, rendering paints straight to the DOM. Here, rendering only decides what the UI should be — the native side does the actual drawing.",
    },
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["js"],
      annotations: [{ id: "jsx", text: 'render  <Text>Hi</Text>', x: 160, y: 300, color: "#4F46E5" }],
    },
  },
  {
    step: 6,
    codeLines: [6],
    caption: "A live JS object can't cross. So RN describes the view as plain data — type and props — and serializes it to a JSON message.",
    narration: "A live JS object can't cross. So React Native describes the view as plain data — its type and props — and serializes that to a JSON message.",
    note: {
      label: "Key term",
      term: "Serialize",
      text: "turn a live object into plain text (JSON) that can travel; deserialize is rebuilding it on the far side. The object never crosses — only a text description of it does.",
    },
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["js"],
      annotations: [],
      packets: [{ id: "p1", x: 330, y: 210, label: '{ type:"Text" }', color: "#149eca" }],
    },
  },
  {
    step: 7,
    caption: "JSON only carries data — strings, numbers, objects, arrays. A function, a callback, or a 5MB image can't cross.",
    narration: "JSON only carries data — strings, numbers, objects, arrays. A function, a callback, or a big image can't cross.",
    note: {
      label: "Gotcha",
      text: "This is the surprise that bites people most often: pass a callback or raw binary across and it silently comes out empty. Send a value or a file path instead, never a live function.",
    },
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["js"],
      annotations: [{ id: "cant", text: "functions · callbacks · big blobs can't cross", x: 400, y: 405, color: "#DC2626" }],
      packets: [{ id: "x1", x: 278, y: 210, label: "() => {}  ✕", color: "#DC2626" }],
    },
  },
  {
    step: 8,
    caption: "Here's the key choice: JS doesn't wait for a reply. It hands off the message and keeps running. If it stopped to wait every time, the app would freeze.",
    narration: "Here's the key choice: JS doesn't wait for a reply. It hands off the message and keeps running. If it stopped to wait for native every time, the whole app would freeze.",
    note: {
      label: "Why it matters",
      text: "Async is the whole point. JS stays free for the next tap or frame instead of blocking on native. It's also why native APIs like AsyncStorage.getItem() return Promises — you simply can't block waiting for the answer.",
    },
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["js"],
      annotations: [{ id: "why", text: "JS fires the message and keeps running — never waits", x: 400, y: 405, color: "#059669" }],
    },
  },
  {
    step: 9,
    codeLines: [6],
    caption: "Those fire-and-forget messages pile into a queue, then cross together in batches, roughly once a frame, instead of one trip each.",
    narration: "Those fire-and-forget messages pile into a queue, then cross together in batches, roughly once a frame, instead of one trip each.",
    note: {
      label: "Key term",
      term: "Frame",
      text: "the screen refreshes about 60 times a second, so one frame is roughly 16ms. \"Once a frame\" means the queue empties on that same beat.",
    },
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["bridge"],
      annotations: [{ id: "a9", text: "queued · batched · sent ~every frame", x: 400, y: 405, color: "#545b66" }],
      packets: [
        { id: "q1", x: 345, y: 210, label: "{…}", color: "#149eca" },
        { id: "q2", x: 400, y: 210, label: "{…}", color: "#149eca" },
        { id: "q3", x: 455, y: 210, label: "{…}", color: "#149eca" },
      ],
    },
  },
  {
    step: 10,
    codeLines: [6],
    caption: "The batch travels across the bridge to the native side.",
    narration: "The batch travels across the bridge to the native side.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: [],
      annotations: [],
      packets: [{ id: "cross", x: 300, y: 210, toX: 520, toY: 210, label: '{ type:"Text" }', color: "#149eca" }],
    },
  },
  {
    step: 11,
    codeLines: [6],
    caption: "Native deserializes the JSON, builds the real view, and your text finally appears on screen.",
    narration: "The native side deserializes the JSON, builds the real view, and your text finally appears on screen.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["native"],
      annotations: [{ id: "ok", text: "real <Text> view created ✓", x: 640, y: 300, color: "#059669" }],
      packets: [{ id: "cross2", x: 300, y: 210, toX: 520, toY: 210, label: '{ type:"Text" }', color: "#149eca" }],
    },
  },
  {
    step: 12,
    codeLines: [5],
    caption: "Taps travel the other way. Native catches the touch, serializes it as an event, and sends it across to your JS onPress handler.",
    narration: "Taps travel the other way. Native catches the touch, serializes it as an event, and sends it across to your JS onPress handler.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["native"],
      annotations: [],
      packets: [{ id: "evt", x: 520, y: 240, toX: 300, toY: 240, label: "{ onPress }", color: "#D97706" }],
    },
  },
  {
    step: 13,
    caption: "So every interaction pays a tax: serialize, queue, cross, deserialize — in both directions. Nothing here is instant or synchronous.",
    narration: "So every interaction pays a tax: serialize, queue, cross, deserialize, in both directions. Nothing here is instant or synchronous.",
    note: {
      label: "Roughly",
      text: "Each message is cheap on its own. But they stack up: 50ms of heavy JS work overruns three full frames, and that's the stutter you feel.",
    },
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["bridge"],
      annotations: [
        { id: "cost", text: "serialize → queue → cross → deserialize", x: 400, y: 395, color: "#DC2626" },
        { id: "async2", text: "every hop is asynchronous", x: 400, y: 420, color: "#545b66" },
      ],
    },
  },
  {
    step: 14,
    codeLines: [5],
    caption: "Now block the JS thread with heavy work. The queue backs up, native sits waiting, and frames drop — you feel it as a stutter or a scroll that won't stay smooth.",
    narration: "Now block the JS thread with heavy work. The queue backs up, the native side waits, and frames drop — you feel it as a stutter, or a scroll that won't stay smooth.",
    note: {
      label: "Try it",
      text: "Switch to the Playground and flip on Synchronous mode — tap around and watch the phone freeze. That frozen feeling is exactly what async was built to avoid.",
    },
    diagram_state: {
      nodes: [js(true), bridge, native(true)],
      edges: rails,
      highlighted: ["js"],
      annotations: [{ id: "jank", text: "JS busy → queue backs up → frames drop", x: 400, y: 405, color: "#DC2626" }],
      packets: [
        { id: "j1", x: 280, y: 178, label: "{…}", color: "#DC2626" },
        { id: "j2", x: 280, y: 210, label: "{…}", color: "#DC2626" },
        { id: "j3", x: 280, y: 242, label: "{…}", color: "#DC2626" },
      ],
    },
  },
  {
    step: 15,
    caption: "That's the whole model: every message costs serialize → queue → cross → deserialize, and it's async — so a busy JS thread never freezes native outright, it just falls behind.",
    narration: "That's the whole model. Every message costs serialize, queue, cross, deserialize, and it's async — so a busy JS thread never freezes native outright, it just falls behind.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: [],
      annotations: [
        { id: "r-cost", text: "serialize → queue → cross → deserialize", x: 400, y: 395, color: "#545b66" },
        { id: "r-why", text: "async, so a busy JS thread never freezes native", x: 400, y: 420, color: "#059669" },
      ],
    },
  },
  {
    step: 16,
    caption: "The New Architecture removes this bridge entirely. With JSI, JS calls native directly — no serializing, no queue, often synchronous. A different design, with its own trade-offs.",
    narration: "The New Architecture removes this bridge entirely. With JSI, JS calls native directly: no serializing, no queue, often synchronous. It's a different design, with its own trade-offs.",
    note: {
      label: "Next",
      text: "JSI lets JS call native objects directly through C++ bindings — no serializing, no queue. It's how a library like Reanimated runs animations right on the UI thread, staying smooth even while the JS thread is slammed.",
      link: { href: "/learn/jsi", label: "New Architecture & JSI" },
    },
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: [],
      annotations: [{ id: "next", text: "New Architecture (JSI) removes the bridge →", x: 400, y: 410, color: "#8B5CF6" }],
    },
  },
]
