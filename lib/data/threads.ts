import { Step, DiagramNode } from "../types"

const js = (busy = false): DiagramNode => ({
  id: "js",
  label: busy ? "JS Thread\n(busy — blocked)" : "JS Thread\nyour React code",
  x: 60,
  y: 100,
  width: 200,
  height: 110,
  style: "box",
  color: busy ? "#DC2626" : "#4F46E5",
})
const main: DiagramNode = {
  id: "main",
  label: "Main / UI Thread\ndraws real views",
  x: 540,
  y: 100,
  width: 200,
  height: 110,
  style: "box",
  color: "#059669",
}
const shadow: DiagramNode = {
  id: "shadow",
  label: "Shadow tree\nlayout (Yoga)",
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

export const threadsSteps: Step[] = [
  {
    step: 1,
    codeLines: [2, 3],
    caption: "Your app runs across a few threads — independent lines of work the device handles at the same time. Start with the JS thread: it runs all your React code, state, and logic.",
    narration: "Your app runs across a few threads — independent lines of work the device handles at the same time. Start with the JS thread: it runs all your React code, your state, and your logic.",
    notes: [
      {
        label: "Key term",
        term: "Thread",
        text: "an independent line of work the device runs. Several run at the same time, so slow work on one doesn't have to stall the others — that's the whole reason React Native splits the job up.",
      },
      {
        label: "Heads up",
        text: "This is the classic (pre-Fabric) model. It's the clearest way to see why the work gets split — the New Architecture reshuffles it, which is the last step.",
      },
    ],
    diagram_state: { nodes: [js()], edges: [], highlighted: ["js"], annotations: [] },
  },
  {
    step: 2,
    codeLines: [15, 24],
    caption: "The Main thread draws the real native views — and it's the only thing the user actually sees. While it's busy, the screen can't update, so anything slow here freezes the UI.",
    narration: "The Main thread draws the real native views, and it's the only thing the user actually sees. While it's busy, the screen can't update — so anything slow that runs here freezes the UI.",
    note: {
      label: "Key term",
      term: "Main / UI thread",
      text: "on iOS and Android the app's main thread is also the UI thread — the only one allowed to touch real views. The two names mean the same thing here.",
    },
    diagram_state: { nodes: [js(), main], edges: [], highlighted: ["main"], annotations: [] },
  },
  {
    step: 3,
    codeLines: [18],
    caption: "Between them sits a third worker running Yoga, React Native's layout engine. It turns your flexbox styles into exact pixel positions — off the main thread.",
    narration: "Between them sits a third worker running Yoga, React Native's layout engine. It turns your flexbox styles into exact pixel positions, off the main thread.",
    note: {
      label: "Why the name",
      term: "Shadow",
      text: "it keeps an invisible, lightweight copy of your view tree — a 'shadow' of the real UI — used only for layout math. It's not the web's shadow DOM, and none of it is ever shown. The lasting idea is the shadow tree; 'shadow thread' is just informal for the background thread that processes it.",
    },
    diagram_state: { nodes: [js(), main, shadow], edges: [], highlighted: ["shadow"], annotations: [] },
  },
  {
    step: 4,
    codeLines: [15, 16, 18, 24],
    caption: "Here's a render. The JS thread builds your element tree — the <View> / <Text> nodes you return — and hands it to the layout thread.",
    narration: "Here's a render. The JS thread builds your element tree — the View and Text nodes you return — and hands it to the layout thread.",
    note: {
      label: "If you know web React",
      text: "it's the same React elements you return from a component — the tree of View and Text nodes. On the web, React commits that to the DOM. Here, a description of it is handed to another thread to lay out and draw.",
    },
    diagram_state: { nodes: [js(), main, shadow], edges: [e1], highlighted: ["js", "shadow"], annotations: [] },
  },
  {
    step: 5,
    codeLines: [18],
    caption: "The layout thread works out where every view goes — off the main thread — so all that measuring never blocks the screen from painting.",
    narration: "The layout thread works out where every view goes, off the main thread, so all that measuring never blocks the screen from painting.",
    note: {
      label: "Key term",
      term: "Yoga",
      text: "the layout engine React Native runs here. It's the same flexbox idea as the web — flex, padding, margin — turned into an exact pixel position and size for every view, computed ahead of time.",
    },
    diagram_state: {
      nodes: [js(), main, shadow],
      edges: [e1],
      highlighted: ["shadow"],
      annotations: [{ id: "a5", text: "layout runs off the main thread", x: 400, y: 450, color: "#8B5CF6" }],
    },
  },
  {
    step: 6,
    codeLines: [15, 24],
    caption: "The finished layout goes to the Main thread, which builds the real native views and paints them to the screen.",
    narration: "The finished layout goes to the Main thread, which builds the real native views and paints them to the screen.",
    diagram_state: { nodes: [js(), main, shadow], edges: [e1, e2], highlighted: ["main"], annotations: [] },
  },
  {
    step: 7,
    codeLines: [24],
    caption: "Touches travel the other way. They land on the Main thread, which hands them to the JS thread to run your onPress and onScroll handlers.",
    narration: "Touches travel the other way. They land on the Main thread, which hands them to the JS thread to run your press and scroll handlers.",
    diagram_state: { nodes: [js(), main, shadow], edges: [e1, e2, e3], highlighted: ["main"], annotations: [] },
  },
  {
    step: 8,
    caption: "Why three threads? Each frame leaves only ~16ms to do its job. Splitting the work lets all three race toward that deadline at once instead of waiting in line.",
    narration: "Why three threads? Each frame leaves only about 16 milliseconds to do its job. Splitting the work lets all three race toward that deadline at once, instead of waiting in line.",
    note: {
      label: "Key term",
      term: "Frame",
      text: "the screen refreshes about 60 times a second, so each frame is only ~16ms. Miss that budget and the user sees a stutter. Splitting the work is how each thread keeps hitting it.",
    },
    diagram_state: {
      nodes: [js(), main, shadow],
      edges: [e1, e2, e3],
      highlighted: ["js", "shadow", "main"],
      annotations: [{ id: "a8", text: "~16ms per frame · each thread races in parallel", x: 400, y: 450, color: "#545b66" }],
    },
  },
  {
    step: 9,
    codeLines: [7, 8, 9, 10, 11],
    caption: "Now jam the JS thread with heavy work. The screen keeps painting and scrolling what it already has — but anything that needs JS stalls: new list rows, touch handlers, JS-driven animation.",
    narration: "Now jam the JS thread with heavy work. The screen keeps painting and scrolling what it already has — but anything that needs JS stalls: new list rows, touch handlers, and JS-driven animation.",
    note: {
      label: "Why it matters",
      text: "a jammed JS thread can't freeze frames the Main thread already has, so existing content keeps scrolling. But new rows, touch handlers, and JS-driven animation all queue behind it. The classic tell is blank cells flashing during a fast scroll — the list is waiting on JS.",
      link: { href: "/learn/flatlist", label: "FlatList Virtualization" },
    },
    diagram_state: {
      nodes: [js(true), main, shadow],
      edges: [e1, e2, e3],
      highlighted: ["js"],
      annotations: [{ id: "a9", text: "JS busy → new rows + handlers stall · paint keeps going", x: 400, y: 450, color: "#DC2626" }],
    },
  },
  {
    step: 10,
    codeLines: [19, 20, 21],
    caption: "This is why animations use useNativeDriver. The motion is handed to the Main thread up front, so it stays at 60fps even while the JS thread is still blocked.",
    narration: "This is why animations use the native driver. The motion is handed to the Main thread up front, so it stays at 60 frames per second even while the JS thread is still blocked.",
    note: {
      label: "Key term",
      term: "Native driver",
      text: "with useNativeDriver: true, the animation's per-frame work is handed to the Main thread up front, so it holds 60fps even while JS is fully blocked. It only covers transform and opacity — the things native can change without asking JS to re-measure.",
      link: { href: "/learn/animated", label: "Animated API" },
    },
    diagram_state: {
      nodes: [js(true), main, shadow],
      edges: [e1, e2, e3],
      highlighted: ["main"],
      annotations: [{ id: "a10", text: "native-driven animation runs on Main — survives the block", x: 400, y: 450, color: "#059669" }],
    },
  },
  {
    step: 11,
    caption: "There's more underneath. Native modules — storage, network, the camera — run on background threads, off both the JS and Main threads.",
    narration: "There's more underneath. Native modules, like storage, network, and the camera, run on background threads, off both the JS and Main threads.",
    note: {
      label: "Roughly",
      text: "by default native modules share one background queue; a module can ask for its own. In the New Architecture, Turbo Modules are called straight through JSI and often run on the JS thread instead.",
    },
    diagram_state: {
      nodes: [js(), main, shadow, modules],
      edges: [e1, e2, e3],
      highlighted: ["modules"],
      annotations: [{ id: "a11", text: "native modules run off the JS and Main threads", x: 400, y: 450, color: "#545b66" }],
    },
  },
  {
    step: 12,
    codeLines: [16, 18, 21],
    caption: "So the JS thread thinks, the layout thread measures, and the Main thread paints — all at once. In the Bridge lesson the native side was one box; these threads are what's inside it.",
    narration: "So the JS thread thinks, the layout thread measures, and the Main thread paints, all at once. In the Bridge lesson the native side was one box; these threads are what's really inside it.",
    note: {
      label: "Connects to",
      text: "in the Bridge lesson the whole native side was a single box. These threads — layout off the main thread, Main for paint — are what that box actually holds.",
      link: { href: "/learn/bridge", label: "The React Native Bridge" },
    },
    diagram_state: {
      nodes: [js(), main, shadow, modules],
      edges: [e1, e2, e3],
      highlighted: ["js", "shadow", "main"],
      annotations: [{ id: "a12", text: "JS thinks · Shadow lays out · Main paints", x: 400, y: 450, color: "#059669" }],
    },
  },
  {
    step: 13,
    caption: "The New Architecture reshuffles all of this — which is a story of its own.",
    narration: "The New Architecture reshuffles all of this, which is a story of its own.",
    note: {
      label: "Next",
      text: "the New Architecture (Fabric + JSI) blurs these lines: the shadow tree moves to C++, there's no fixed layout thread, and layout can even run synchronously on the UI thread.",
      link: { href: "/learn/jsi", label: "New Architecture & JSI" },
    },
    diagram_state: {
      nodes: [js(), main, shadow, modules],
      edges: [e1, e2, e3],
      highlighted: [],
      annotations: [{ id: "a13", text: "New Architecture (Fabric + JSI) reshuffles these →", x: 400, y: 450, color: "#8B5CF6" }],
    },
  },
]
