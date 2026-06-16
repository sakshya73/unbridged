import { Step, DiagramNode } from "../types"

const PINK = "#DB2777" // the Animated.Value node
const AMBER = "#D97706" // the driver
const INDIGO = "#4F46E5" // JS thread
const GREEN = "#059669" // UI / Main thread, smooth
const RED = "#DC2626" // busy / dropped frames
const BLUE = "#2563EB" // opacity output
const VIOLET = "#7C3AED" // rotate output
const TEAL = "#0D9488" // scale output

// ── node builders ────────────────────────────────────────────────────────────
const value = (label = "Animated.Value\n0", color = PINK): DiagramNode => ({ id: "value", label, x: 80, y: 210, width: 190, height: 70, style: "box", color })
const driver = (label = "driver: Animated.timing"): DiagramNode => ({ id: "driver", label, x: 90, y: 350, width: 170, height: 46, style: "pill", color: AMBER })

const js = (busy = false): DiagramNode => ({ id: "js", label: busy ? "JS Thread\nbusy — blocked" : "JS Thread\nyour code", x: 70, y: 200, width: 180, height: 90, style: "box", color: busy ? RED : INDIGO })
const ui = (label = "UI / Main Thread\npaints every frame"): DiagramNode => ({ id: "ui", label, x: 560, y: 200, width: 200, height: 90, style: "box", color: GREEN })

const opacity = (label = "opacity\n0.3 → 1"): DiagramNode => ({ id: "p1", label, x: 560, y: 50, width: 180, height: 60, style: "box", color: BLUE })
const rotate = (label = "rotate\n0° → 180°"): DiagramNode => ({ id: "p2", label, x: 560, y: 215, width: 180, height: 60, style: "box", color: VIOLET })
const scale = (label = "scale\n1 → 1.4"): DiagramNode => ({ id: "p3", label, x: 560, y: 380, width: 180, height: 60, style: "box", color: TEAL })

const okPill: DiagramNode = { id: "ok", label: "Native: transform, opacity, color", x: 90, y: 200, width: 300, height: 50, style: "pill", color: GREEN }
const noPill: DiagramNode = { id: "no", label: "JS: width, height, margin, padding", x: 430, y: 200, width: 300, height: 50, style: "pill", color: RED }

const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 470, color }]

export const animatedSteps: Step[] = [
  {
    step: 1,
    codeLines: [2],
    caption: "An Animated.Value is one animatable node. It holds a single number and starts at 0.",
    narration: "An Animated dot Value is one animatable node. It holds a single number — here it starts at zero. Everything else in this lesson hangs off that one node.",
    note: { label: "Key term", term: "Animated.Value", text: "a single number React Native owns and can change over time — think of it as one node in a graph. useRef keeps the same node across re-renders; you wire it into a style prop and drive it." },
    diagram_state: { nodes: [value()], edges: [], highlighted: ["value"], annotations: an("one node, holding one number") },
  },
  {
    step: 2,
    codeLines: [5, 6, 7, 8, 10],
    caption: "A driver moves the value over time — Animated.timing or .spring, kicked off with .start().",
    narration: "On its own the value just sits there. A driver moves it over time: timing gives an eased ramp, spring gives physics. You kick it off with start.",
    notes: [
      { label: "Key term", term: "Driver", text: "the engine that advances the value each frame — timing (an eased ramp over a duration) or spring (physics-based). Here it's wrapped in Animated.loop(Animated.sequence([…])) so it ping-pongs 0 → 1 → 0 forever." },
      { label: "If you know web React", text: "on the web, opacity and transform transitions hand off to the browser's compositor for free. In React Native nothing runs off the JS thread until you opt in — which is the whole point of the next few steps." },
    ],
    diagram_state: { nodes: [value(), driver()], edges: [{ id: "e_drive", from: "driver", to: "value", label: "advance each frame" }], highlighted: ["driver"], annotations: an("a driver advances the value, frame by frame", AMBER) },
  },
  {
    step: 3,
    codeLines: [7],
    caption: "Default (JS driver): JS recomputes the value every frame and pushes it across to the UI thread.",
    narration: "By default the work runs on the JS thread. Every frame, JavaScript recomputes the value and pushes the new number across to the UI thread to paint — about sixty times a second.",
    note: { label: "Connects to", text: "this is the JS thread from the Threads lesson doing per-frame work. It's fine right up until that thread gets busy.", link: { href: "/learn/threads", label: "The Three Threads" } },
    diagram_state: { nodes: [js(), ui()], edges: [{ id: "e_js_ui", from: "js", to: "ui", label: "new value · every frame", animated: true }], highlighted: ["js"], annotations: an("JS driver: JS computes each frame, then ships it over", INDIGO) },
  },
  {
    step: 4,
    codeLines: [7],
    caption: "Busy JS = dropped frames. A heavy re-render, a fetch, a big JSON.parse — and the animation stutters.",
    narration: "Here's the catch. If the JS thread is busy — a heavy re-render, a fetch callback, a big JSON parse — it can't produce the next value in time. Frames drop, and the animation stutters.",
    note: { label: "Gotcha", text: "the classic JS-driven stutter: the animation is only as smooth as the JS thread is free. One slow callback and you see jank." },
    diagram_state: { nodes: [js(true), ui()], edges: [{ id: "e_js_ui", from: "js", to: "ui", label: "dropped frames", dashed: true, color: RED }], highlighted: ["js"], annotations: an("busy JS thread → no value in time → stutter", RED) },
  },
  {
    step: 5,
    codeLines: [7, 8],
    caption: "Flip useNativeDriver: true. The animation is handed to the UI thread once, at .start().",
    narration: "The fix is one flag: useNativeDriver true. At start, React Native serializes the whole animation — the value, the driver, the output mappings — and hands it to the UI thread once.",
    notes: [
      { label: "Key term", term: "Native driver", text: "useNativeDriver:true hands the per-frame work to the UI/Main thread up front. It holds 60fps even while the JS thread is fully blocked — for non-layout props (transform, opacity, colors), the same idea as the Threads lesson." },
      { label: "Heads up", text: "\"handed off once\" means no per-frame round-trips — not zero communication. start, stop, and the final settled value still sync back to JS so your onAnimationEnd callbacks and state stay correct." },
    ],
    diagram_state: { nodes: [js(), ui()], edges: [{ id: "e_serialize", from: "js", to: "ui", label: "serialize + hand off · once" }], highlighted: ["ui"], annotations: an("useNativeDriver: describe it once, hand it to the UI thread", GREEN) },
  },
  {
    step: 6,
    codeLines: [5, 6, 7, 8, 10],
    caption: "Now the UI thread ticks every frame itself — 60fps straight through a blocked JS thread.",
    narration: "After the handoff, the UI thread runs the frame loop on its own. The JS thread can be completely jammed and the animation still holds sixty frames a second, because JS is no longer in the loop.",
    note: { label: "Why it survives", text: "the busy JS thread isn't on the critical path anymore — the UI thread already has everything it needs to compute each frame locally." },
    diagram_state: { nodes: [js(true), ui("UI / Main Thread\nnative frame loop")], edges: [{ id: "e_serialize", from: "js", to: "ui", label: "handed off", dashed: true, color: "#94A3B8" }], highlighted: ["ui"], annotations: an("UI thread ticks itself → smooth 60fps even while JS is blocked", GREEN) },
  },
  {
    step: 7,
    codeLines: [13, 14, 15],
    caption: "interpolate maps one 0 → 1 driver to many output ranges — numbers, degrees, even colors.",
    narration: "Here's what makes one value go a long way. interpolate maps that single zero-to-one driver onto any output range — an opacity, a rotation in degrees, a scale, even a color.",
    note: { label: "Key term", term: "interpolate", text: "value.interpolate({ inputRange: [0, 1], outputRange: [...] }) turns one driver into opacity, degrees, pixels, or colors. One node feeds many props — you animate the node, not each prop." },
    diagram_state: { nodes: [value(), opacity(), rotate(), scale()], edges: [
      { id: "e_o", from: "value", to: "p1", label: "interpolate" },
      { id: "e_r", from: "value", to: "p2", label: "interpolate" },
      { id: "e_s", from: "value", to: "p3", label: "interpolate" },
    ], highlighted: ["value"], annotations: an("one value, interpolated out to three props") },
  },
  {
    step: 8,
    codeLines: [13, 14, 15, 17],
    caption: "One driver, many synced props: opacity, rotate, and scale all read the same node — so they can never drift.",
    narration: "Because all three read the same node, they move in perfect lockstep. Fade, spin, and grow are guaranteed to stay in sync — there's only one number behind them.",
    note: { label: "Try it", text: "in the Playground tab, drag one slider and watch opacity, rotation, scale, and color all move together off a single value — then mute outputs one at a time to see each interpolation's share." },
    diagram_state: { nodes: [value(), opacity(), rotate(), scale()], edges: [
      { id: "e_o", from: "value", to: "p1", label: "interpolate" },
      { id: "e_r", from: "value", to: "p2", label: "interpolate" },
      { id: "e_s", from: "value", to: "p3", label: "interpolate" },
    ], highlighted: ["value", "p1", "p2", "p3"], annotations: an("all three derived from one node → they can't drift apart", PINK) },
  },
  {
    step: 9,
    codeLines: [17],
    caption: "The native driver's real boundary is layout. It drives transform, opacity, and colors; width, height, and margin fall back to JS.",
    narration: "The native driver has one real boundary, and it's layout. It can change anything that doesn't re-run layout — transform, opacity, and colors. But width, height, margin, anything that resizes or repositions views, needs the layout pass, so those fall back to the JS driver.",
    note: { label: "Gotcha", text: "the rule of thumb is non-layout versus layout — not the old \"transform and opacity only\" line. Native can drive transform ([{ translateX }], scale, rotate), opacity, and colors (backgroundColor, borderColor, tintColor) without re-running layout. Width, height, margin, padding, flex — anything that resizes or repositions other views — needs a layout pass, so it stays on the JS driver." },
    diagram_state: { nodes: [okPill, noPill], edges: [], highlighted: ["ok"], annotations: an("native drives non-layout props (incl. color); layout still needs JS", GREEN) },
  },
  {
    step: 10,
    codeLines: [15],
    caption: "extrapolate: past the input range, outputs either freeze at the edge (clamp) or keep overshooting (extend).",
    narration: "One more knob: extrapolate. Drive the value past its input range and clamp freezes the output at the edge, while extend lets it keep going. The playground's over-drag zone lets you feel the difference.",
    note: { label: "Heads up", text: "extrapolate: 'clamp' is the safe default for something like scale — without it, dragging past 1 keeps growing the box unbounded. You set it per interpolation." },
    diagram_state: { nodes: [value(), scale("scale\nclamp vs extend")], edges: [{ id: "e_s", from: "value", to: "p3", label: "extrapolate" }], highlighted: ["p3"], annotations: an("past the range: clamp freezes, extend overshoots", TEAL) },
  },
  {
    step: 11,
    caption: "The whole chain: value node → driver → interpolate fan-out → useNativeDriver → 60fps through a blocked JS thread.",
    narration: "That's the model. One value node, moved by a driver, interpolated out to many props, and — for transform and opacity — handed to the UI thread so it holds sixty frames a second even when JS is jammed.",
    note: { label: "Next", text: "Reanimated generalizes this: worklets run arbitrary JS — not just transform and opacity — on the UI thread via JSI, reacting to gestures every frame. Same idea, without the native-driver limits.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    diagram_state: { nodes: [value(), driver(), opacity(), rotate(), scale()], edges: [
      { id: "e_drive", from: "driver", to: "value", label: "drive" },
      { id: "e_o", from: "value", to: "p1", label: "interpolate" },
      { id: "e_r", from: "value", to: "p2", label: "interpolate" },
      { id: "e_s", from: "value", to: "p3", label: "interpolate" },
    ], highlighted: ["value", "p1", "p2", "p3"], annotations: an("one node → many synced props → 60fps off the JS thread", PINK) },
  },
]
