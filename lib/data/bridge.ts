import { Step, DiagramNode, DiagramEdge } from "../types"

// Reusable nodes so the 13 steps stay consistent and DRY.
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
    caption: "Your app runs in two worlds. On the left, the JS thread runs all your React code.",
    narration: "Your app runs in two worlds. On the left, the JS thread runs all your React code.",
    diagram_state: { nodes: [js()], edges: [], highlighted: ["js"], annotations: [] },
  },
  {
    step: 2,
    caption: "On the right, the native thread owns the real UI — actual iOS and Android views.",
    narration: "On the right, the native thread owns the real UI — actual iOS and Android views.",
    diagram_state: { nodes: [js(), native()], edges: [], highlighted: ["native"], annotations: [] },
  },
  {
    step: 3,
    caption: "They can't talk directly — separate runtimes, no shared memory, different languages.",
    narration: "They can't talk directly — separate runtimes, no shared memory, different languages.",
    diagram_state: {
      nodes: [js(), native()],
      edges: [{ id: "blocked", from: "js", to: "native", color: "#DC2626", dashed: true, label: "no direct calls" }],
      highlighted: ["js", "native"],
      annotations: [{ id: "a3", text: "separate runtimes · no shared memory", x: 400, y: 405, color: "#DC2626" }],
    },
  },
  {
    step: 4,
    caption: "So React Native puts a messenger between them — the Bridge.",
    narration: "So React Native puts a messenger between them — the Bridge.",
    diagram_state: { nodes: [js(), bridge, native()], edges: rails, highlighted: ["bridge"], annotations: [] },
  },
  {
    step: 5,
    caption: "Say your JS renders <Text>Hi</Text>. It needs native to build a real text view.",
    narration: "Say your JS renders a Text element. It needs the native side to build a real text view.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["js"],
      annotations: [{ id: "jsx", text: 'render  <Text>Hi</Text>', x: 160, y: 300, color: "#4F46E5" }],
    },
  },
  {
    step: 6,
    caption: "That command can't cross as a live object — it's serialized into a JSON message.",
    narration: "That command can't cross as a live object, so it's serialized into a JSON message.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["js"],
      annotations: [],
      packets: [{ id: "p1", x: 278, y: 210, label: '{ create: "Text" }', color: "#149eca" }],
    },
  },
  {
    step: 7,
    caption: "Messages don't cross instantly. They queue up and are sent across in batches — async.",
    narration: "Messages don't cross instantly. They queue up and get sent across in batches, asynchronously.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["bridge"],
      annotations: [{ id: "a7", text: "async · queued · batched", x: 400, y: 405, color: "#545b66" }],
      packets: [
        { id: "q1", x: 345, y: 210, label: "{…}", color: "#149eca" },
        { id: "q2", x: 400, y: 210, label: "{…}", color: "#149eca" },
        { id: "q3", x: 455, y: 210, label: "{…}", color: "#149eca" },
      ],
    },
  },
  {
    step: 8,
    caption: "The batch travels across the bridge to the native side.",
    narration: "The batch travels across the bridge to the native side.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: [],
      annotations: [],
      packets: [{ id: "cross", x: 300, y: 210, toX: 520, toY: 210, loop: true, label: '{ create: "Text" }', color: "#149eca" }],
    },
  },
  {
    step: 9,
    caption: "Native deserializes the JSON, builds the real view, and your text appears on screen.",
    narration: "The native side deserializes the JSON, builds the real view, and your text appears on screen.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["native"],
      annotations: [{ id: "ok", text: "real <Text> view created ✓", x: 640, y: 300, color: "#059669" }],
      packets: [{ id: "cross2", x: 300, y: 210, toX: 520, toY: 210, loop: true, label: '{ create: "Text" }', color: "#149eca" }],
    },
  },
  {
    step: 10,
    caption: "Taps go back the same way — native serializes the event and sends it to your JS handler.",
    narration: "Taps go back the same way: native serializes the event and sends it across to your JS handler.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: ["native"],
      annotations: [],
      packets: [{ id: "evt", x: 520, y: 240, toX: 300, toY: 240, loop: true, label: "{ onPress }", color: "#D97706" }],
    },
  },
  {
    step: 11,
    caption: "Every interaction pays a tax: serialize, queue, cross, deserialize. Nothing is synchronous.",
    narration: "Every interaction pays a tax: serialize, queue, cross, deserialize. Nothing is synchronous.",
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
    step: 12,
    caption: "If the JS thread is busy, the queue backs up, native waits, and you drop frames.",
    narration: "If the JS thread is busy with heavy work, the queue backs up, the native side waits, and frames drop.",
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
    step: 13,
    caption: "This is exactly what the New Architecture — JSI — was built to fix.",
    narration: "This is exactly the limitation the New Architecture, built on JSI, was designed to remove.",
    diagram_state: {
      nodes: [js(), bridge, native()],
      edges: rails,
      highlighted: [],
      annotations: [{ id: "next", text: "New Architecture (JSI) removes the bridge →", x: 400, y: 410, color: "#8B5CF6" }],
    },
  },
]
