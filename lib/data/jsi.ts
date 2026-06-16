import { Step, DiagramNode, DiagramEdge } from "../types"

const js: DiagramNode = { id: "js", label: "JS Thread\n(Hermes)", x: 60, y: 200, width: 180, height: 84, style: "box", color: "#4F46E5" }
const native: DiagramNode = { id: "native", label: "Native Thread\nUI + platform APIs", x: 560, y: 200, width: 180, height: 84, style: "box", color: "#059669" }
const jsi: DiagramNode = { id: "jsi", label: "JSI\nC++ interface", x: 310, y: 128, width: 180, height: 46, style: "pill", color: "#8B5CF6" }
const turbo: DiagramNode = { id: "turbo", label: "TurboModules\nlazy native modules", x: 560, y: 80, width: 180, height: 60, style: "box", color: "#374151" }
const fabric: DiagramNode = { id: "fabric", label: "Fabric\nC++ shadow tree", x: 560, y: 330, width: 180, height: 60, style: "box", color: "#3B82F6" }
const bridge = (on: boolean): DiagramNode => ({ id: "bridge", label: "Old Bridge\n(async JSON)", x: 310, y: 214, width: 180, height: 46, style: "pill", color: on ? "#D97706" : "#9CA3AF" })

const eSer = (on: boolean): DiagramEdge => ({ id: "e_ser", from: "js", to: "bridge", label: "serialize", dashed: true, animated: on, color: on ? "#FCD34D" : "#CBD5E1" })
const eDes = (on: boolean): DiagramEdge => ({ id: "e_des", from: "bridge", to: "native", label: "deserialize", dashed: true, animated: on, color: on ? "#FCD34D" : "#CBD5E1" })
const eDirect: DiagramEdge = { id: "e_direct", from: "js", to: "native", label: "direct call (HostObject)", animated: true, color: "#818CF8" }
const eTurbo: DiagramEdge = { id: "e_turbo", from: "jsi", to: "turbo", label: "exposed via JSI", color: "#8B5CF6" }
const eFabric: DiagramEdge = { id: "e_fabric", from: "js", to: "fabric", label: "commit shadow tree (JSI)", animated: true, color: "#818CF8" }
const eBack: DiagramEdge = { id: "e_back", from: "native", to: "js", label: "sync reply", dashed: true, animated: true, color: "#FCD34D" }

export const jsiSteps: Step[] = [
  {
    step: 1,
    caption: "Same two worlds as before. On the left, the JS thread runs your React code under the Hermes engine.",
    narration: "Same two worlds as before. On the left, the JS thread runs your React code under the Hermes engine.",
    diagram_state: { nodes: [js], edges: [], highlighted: ["js"], annotations: [] },
  },
  {
    step: 2,
    caption: "On the right, the native thread owns the real UI and the platform APIs — camera, storage, actual views.",
    narration: "On the right, the native thread owns the real UI and the platform APIs, like the camera, storage, and the actual views.",
    diagram_state: { nodes: [js, native], edges: [], highlighted: ["native"], annotations: [] },
  },
  {
    step: 3,
    codeLines: [3, 4],
    caption: "The old architecture linked them with an async Bridge: every call serialized to JSON, queued, and sent across.",
    narration: "The old architecture linked them with an asynchronous Bridge. Every call was serialized to JSON, queued, and sent across.",
    note: {
      label: "Connects to",
      text: "this is the serialize → queue → cross model from the Bridge lesson — the tax JSI was built to remove.",
      link: { href: "/learn/bridge", label: "The React Native Bridge" },
    },
    diagram_state: {
      nodes: [js, bridge(true), native],
      edges: [eSer(true), eDes(true)],
      highlighted: ["bridge"],
      annotations: [{ id: "a", text: "old way: async, serialized, one queue", x: 400, y: 455, color: "#D97706" }],
    },
  },
  {
    step: 4,
    codeLines: [7, 10],
    caption: "The New Architecture takes that bridge off the hot path. In its place: JSI, a thin C++ layer both sides share directly.",
    narration: "The New Architecture takes that bridge off the hot path. In its place is JSI, a thin native layer both sides share directly.",
    notes: [
      {
        label: "Key term",
        term: "JSI",
        text: "the JavaScript Interface — a small C++ API the JS engine talks to directly. Instead of mailing JSON to another runtime, JS holds a real reference to a native object and calls its methods like a normal function. No serialize, no queue.",
      },
      {
        label: "Roughly",
        text: "C++ is the one language both the JS engine and the native platforms compile down to, so it's the neutral middle ground. A 'binding' is just C++ glue that exposes a native function to JS.",
      },
    ],
    diagram_state: {
      nodes: [js, bridge(false), native, jsi],
      edges: [eSer(false), eDes(false)],
      highlighted: ["jsi"],
      annotations: [{ id: "a", text: "JSI: a shared C++ layer, no message queue", x: 400, y: 455, color: "#8B5CF6" }],
    },
  },
  {
    step: 5,
    codeLines: [10, 11],
    caption: "Through JSI, JS holds direct references to native objects — HostObjects — so calling native is a synchronous C++ call. No JSON anywhere.",
    narration: "Through JSI, JavaScript holds direct references to native objects, called HostObjects, so calling native is a direct synchronous call. No JSON anywhere.",
    notes: [
      {
        label: "Key term",
        term: "HostObject",
        text: "a native object the JS engine holds a real handle to, so calling its methods is a direct C++ call — not a copied message. The Bridge lesson said a live object can't cross, only JSON copies; JSI is exactly what changes that.",
      },
      {
        label: "Wait — synchronous?",
        text: "the Bridge lesson warned that waiting synchronously on a slow cross-runtime hop freezes the app. JSI calls are synchronous too — but they're a direct in-process C++ call, microseconds rather than a queued round-trip, so waiting is effectively free.",
      },
    ],
    diagram_state: {
      nodes: [js, bridge(false), native, jsi],
      edges: [eSer(false), eDes(false), eDirect],
      highlighted: ["js", "native", "jsi"],
      annotations: [{ id: "a", text: "HostObject: native methods JS calls directly", x: 400, y: 455, color: "#8B5CF6" }],
    },
  },
  {
    step: 6,
    codeLines: [8],
    caption: "Native modules built on JSI are TurboModules: typed, and loaded lazily the first time you touch them.",
    narration: "Native modules built on JSI are TurboModules. They're typed, and loaded lazily the first time you touch them.",
    notes: [
      {
        label: "Key term",
        term: "TurboModule",
        text: "a native module called straight through JSI, loaded lazily the first time you access it — so startup is faster and memory lower than registering every module up front.",
      },
      {
        label: "Key term",
        term: "Codegen",
        text: "at build time it reads your TypeScript spec files and generates the typed C++/Java/Obj-C glue that TurboModules and Fabric are checked against. That's where 'type-safe' comes from — and one reason the New Architecture needs a native rebuild, not just a JS update.",
      },
    ],
    diagram_state: {
      nodes: [js, bridge(false), native, jsi, turbo],
      edges: [eSer(false), eDes(false), eDirect, eTurbo],
      highlighted: ["turbo"],
      annotations: [{ id: "a", text: "TurboModules: lazy + type-safe (via Codegen)", x: 400, y: 455, color: "#374151" }],
    },
  },
  {
    step: 7,
    caption: "Rendering gets its own JSI system, Fabric. Its shadow tree lives in C++, so layout can run synchronously on the UI thread — no fixed layout thread.",
    narration: "Rendering gets its own JSI system, Fabric. Its shadow tree lives in native code, so layout can run synchronously on the UI thread, with no fixed layout thread.",
    note: {
      label: "Connects to",
      text: "this is the C++ shadow tree the Three Threads lesson promised — no separate layout thread anymore, so layout can be computed and mounted synchronously. React still reconciles in JS; the tree it commits now lives in C++.",
      link: { href: "/learn/threads", label: "The Three Threads" },
    },
    diagram_state: {
      nodes: [js, bridge(false), native, jsi, turbo, fabric],
      edges: [eSer(false), eDes(false), eDirect, eTurbo, eFabric],
      highlighted: ["fabric"],
      annotations: [{ id: "a", text: "Fabric: C++ shadow tree, layout can be synchronous", x: 400, y: 455, color: "#3B82F6" }],
    },
  },
  {
    step: 8,
    caption: "Because the link is synchronous, native can call straight back into JS too — Fabric reading measured layout instantly, with no round-trip queue.",
    narration: "Because the link is synchronous, native can call straight back into JS too, like Fabric reading measured layout instantly, with no round-trip queue.",
    diagram_state: {
      nodes: [js, bridge(false), native, jsi, turbo, fabric],
      edges: [eSer(false), eDes(false), eDirect, eTurbo, eFabric, eBack],
      highlighted: ["js", "native"],
      annotations: [{ id: "a", text: "two-way and synchronous — no batched queue", x: 400, y: 455, color: "#818CF8" }],
    },
  },
  {
    step: 9,
    codeLines: [15, 16, 17, 18, 19],
    caption: "Here's the payoff: a worklet runtime runs on the UI thread, so Reanimated animations and gestures stay at 60fps even while the JS thread is slammed.",
    narration: "Here's the payoff. A worklet runtime runs on the UI thread, so Reanimated animations and gestures stay at 60 frames per second even while the JS thread is slammed.",
    note: {
      label: "Key term",
      term: "Worklet",
      text: "a small JS function shipped to the UI thread's own runtime, so it runs every frame independent of the JS thread. Because the JSI link is synchronous, Reanimated and gesture handlers stay frame-perfect even when JS is fully busy.",
      link: { href: "/learn/animated", label: "Animated API" },
    },
    diagram_state: {
      nodes: [js, bridge(false), native, jsi, turbo, fabric],
      edges: [eSer(false), eDes(false), eDirect, eTurbo, eFabric, eBack],
      highlighted: ["native", "fabric"],
      annotations: [{ id: "a", text: "Reanimated worklets run on the UI thread → frame-perfect", x: 400, y: 455, color: "#DB2777" }],
    },
  },
  {
    step: 10,
    caption: "None of it is free. That direct C++ power means raw memory, calls that can block, and harder debugging — a native rebuild, not a flip of a switch.",
    narration: "None of it is free. That direct native power means raw memory you manage yourself, calls that can block, and harder debugging. It's a native rebuild, not a flip of a switch.",
    note: {
      label: "Honest tradeoffs",
      text: "JSI is raw C++ with manual memory, so a bad HostObject can crash the app instead of throwing a JS error. A synchronous call can now block the thread it runs on. Debugging spans JS and C++. And the old bridge still ships alongside as an interop layer for libraries that haven't migrated.",
    },
    diagram_state: {
      nodes: [js, bridge(false), native, jsi, turbo, fabric],
      edges: [eSer(false), eDes(false), eDirect, eTurbo, eFabric, eBack],
      highlighted: [],
      annotations: [{ id: "a", text: "the costs: raw C++ memory · sync can block · native rebuild", x: 400, y: 455, color: "#DC2626" }],
    },
  },
  {
    step: 11,
    codeLines: [10, 17],
    caption: "So JSI is the one synchronous backbone: TurboModules and Fabric both ride on it, and the old async bridge is gone from the hot path.",
    narration: "So JSI is the one synchronous backbone. TurboModules and Fabric both ride on it, and the old async bridge is gone from the hot path.",
    notes: [
      {
        label: "How it fits",
        text: "four pieces, one shared layer: JSI is the foundation; TurboModules (native modules) and Fabric (rendering) are both built on it; Codegen makes both type-safe.",
      },
      {
        label: "Connects to",
        text: "that closes the loop the other two lessons opened — the async bridge they described is gone from the hot path here.",
        link: { href: "/learn/bridge", label: "The Bridge" },
      },
    ],
    diagram_state: {
      nodes: [js, native, jsi, turbo, fabric],
      edges: [eDirect, eTurbo, eFabric, eBack],
      highlighted: ["jsi", "turbo", "fabric"],
      annotations: [{ id: "a", text: "JSI: one synchronous C++ backbone (the 2026 default)", x: 400, y: 455, color: "#059669" }],
    },
  },
]
