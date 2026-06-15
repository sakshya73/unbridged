import { Step, DiagramNode } from "../types"

const js: DiagramNode = {
  id: "js",
  label: "JS Thread\nyour React code",
  x: 60,
  y: 100,
  width: 200,
  height: 110,
  style: "box",
  color: "#4F46E5",
}
const main: DiagramNode = {
  id: "main",
  label: "Main / UI Thread\nrenders native views",
  x: 540,
  y: 100,
  width: 200,
  height: 110,
  style: "box",
  color: "#059669",
}
const shadow: DiagramNode = {
  id: "shadow",
  label: "Shadow Thread\nlayout (Yoga)",
  x: 300,
  y: 300,
  width: 200,
  height: 110,
  style: "box",
  color: "#8B5CF6",
}
const modules: DiagramNode = {
  id: "modules",
  label: "Native modules\n(background threads)",
  x: 540,
  y: 300,
  width: 200,
  height: 90,
  style: "box",
  color: "#374151",
}

const e1 = { id: "e1", from: "js", to: "shadow", label: "element tree", animated: true, color: "#818CF8" }
const e2 = { id: "e2", from: "shadow", to: "main", label: "layout", animated: true, color: "#6EE7B7" }
const e3 = { id: "e3", from: "main", to: "js", label: "touch", dashed: true, color: "#FCD34D" }

const cap = (s: string) => ({ caption: s, narration: s })

export const threadsSteps: Step[] = [
  {
    step: 1,
    ...cap("Your JavaScript runs on its own thread — the JS thread — where all your React code and logic live."),
    diagram_state: { nodes: [js], edges: [], highlighted: ["js"], annotations: [] },
  },
  {
    step: 2,
    ...cap("The Main thread, also called the UI thread, is the native side. It draws the real views and handles every touch."),
    diagram_state: { nodes: [js, main], edges: [], highlighted: ["main"], annotations: [] },
  },
  {
    step: 3,
    ...cap("There's a third thread between them: the Shadow thread. It runs Yoga to turn your styles into real positions and sizes."),
    diagram_state: { nodes: [js, main, shadow], edges: [], highlighted: ["shadow"], annotations: [] },
  },
  {
    step: 4,
    ...cap("Here's a render. The JS thread builds your element tree and hands it to the Shadow thread."),
    diagram_state: { nodes: [js, main, shadow], edges: [e1], highlighted: ["js", "shadow"], annotations: [] },
  },
  {
    step: 5,
    ...cap("The Shadow thread works out the layout — where each view goes — off the main thread, so that math never freezes the screen."),
    diagram_state: {
      nodes: [js, main, shadow],
      edges: [e1],
      highlighted: ["shadow"],
      annotations: [{ id: "a5", text: "layout runs off the main thread", x: 400, y: 450, color: "#8B5CF6" }],
    },
  },
  {
    step: 6,
    ...cap("The finished layout goes to the Main thread, which builds the real native views and paints them."),
    diagram_state: { nodes: [js, main, shadow], edges: [e1, e2], highlighted: ["main"], annotations: [] },
  },
  {
    step: 7,
    ...cap("Touches go the other way. They land on the Main thread and get passed to the JS thread to run your handlers."),
    diagram_state: { nodes: [js, main, shadow], edges: [e1, e2, e3], highlighted: ["main"], annotations: [] },
  },
  {
    step: 8,
    ...cap("Why three threads? On a single thread one heavy calculation would freeze everything. Splitting the work keeps scrolling and animation smooth."),
    diagram_state: {
      nodes: [js, main, shadow],
      edges: [e1, e2, e3],
      highlighted: [],
      annotations: [{ id: "a8", text: "one thread → frozen UI · split → smooth", x: 400, y: 450, color: "#DC2626" }],
    },
  },
  {
    step: 9,
    ...cap("There's more underneath: native modules can run on their own background threads, and the New Architecture lets layout and rendering span threads too."),
    diagram_state: {
      nodes: [js, main, shadow, modules],
      edges: [e1, e2, e3],
      highlighted: ["modules"],
      annotations: [{ id: "a9", text: "native modules use their own background threads", x: 400, y: 450, color: "#545b66" }],
    },
  },
  {
    step: 10,
    ...cap("So the JS thread thinks, the Shadow thread lays out, and the Main thread paints — all at once. That parallel work is what keeps an app responsive."),
    diagram_state: {
      nodes: [js, main, shadow, modules],
      edges: [e1, e2, e3],
      highlighted: ["js", "shadow", "main"],
      annotations: [{ id: "a10", text: "JS thinks · Shadow lays out · Main paints", x: 400, y: 450, color: "#059669" }],
    },
  },
]
