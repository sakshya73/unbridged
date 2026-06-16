import { Step, DiagramNode } from "../types"

const G = "#059669" // mounted (in window)
const BF = "#34D399" // buffer
const U = "#94A3B8" // unmounted
const D = "#374151" // ScrollView: all mounted
const B = "#DC2626" // blank (not mounted yet)

const mk = (n: number, color: string, label?: string): DiagramNode => ({
  id: `r${n}`,
  label: label ?? `Row ${n}`,
  x: 430,
  y: 60 + (n - 1) * 62,
  width: 200,
  height: 50,
  style: "box",
  color,
})
const list = (colors: string[], labels?: (string | undefined)[]): DiagramNode[] => colors.map((c, i) => mk(i + 1, c, labels?.[i]))
const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

export const flatlistSteps: Step[] = [
  {
    step: 1,
    codeLines: [15],
    caption: "A ScrollView mounts all 10,000 rows up front — 10,000 live native views = frozen startup or out-of-memory.",
    narration: "A ScrollView mounts all of its children up front. With ten thousand rows, that's ten thousand live native views — frozen startup, or out of memory.",
    notes: [
      { label: "Key term", term: "Mount", text: "to create the real native view for a row — not just a React element. Ten thousand mounted rows is ten thousand real views the OS has to hold." },
      { label: "Gotcha", text: "use a ScrollView only for small, finite content. The moment a list can grow, reach for FlatList." },
    ],
    diagram_state: { nodes: list([D, D, D, D, D, D]), edges: [], highlighted: [], annotations: an("ScrollView: every row mounted → heavy", D) },
  },
  {
    step: 2,
    codeLines: [14],
    caption: "FlatList's trick is virtualization: only rows near the viewport actually exist — a window sliding over the data.",
    narration: "FlatList does something smarter, called virtualization. Only the rows near the visible viewport actually exist as mounted components — a window that slides over the data.",
    note: { label: "Key term", term: "Virtualization", text: "render only what's near the screen. The visible area plus a buffer is the \"window\"; everything else is just empty space holding the scroll height." },
    diagram_state: { nodes: list([U, U, G, G, U, U]), edges: [], highlighted: ["r3", "r4"], annotations: an("only the window of rows is mounted", G) },
  },
  {
    step: 3,
    codeLines: [4, 5, 16],
    caption: "Rows inside the window are live, mounted components — Rows 3 and 4 here.",
    narration: "The rows inside the window are live, mounted components — Rows 3 and 4 here. renderItem is what builds each one.",
    diagram_state: { nodes: list([U, U, G, G, U, U], [undefined, undefined, "Row 3 (mounted)", "Row 4 (mounted)"]), edges: [], highlighted: ["r3", "r4"], annotations: an("live rows = mounted by renderItem", G) },
  },
  {
    step: 4,
    codeLines: [20],
    caption: "A buffer of rows just offscreen keeps scrolling seamless — windowSize controls it, counted in screenfuls.",
    narration: "Around the visible rows, FlatList keeps a buffer just offscreen so scrolling stays seamless. windowSize controls how big it is.",
    note: { label: "Key term", term: "windowSize", text: "how many screenfuls to keep mounted — the default 21 means 1 visible plus 10 above and 10 below. It's measured in viewport-heights, not rows. (This lesson's code sets 5 — a tighter buffer: less memory, a bit more blank-cell risk.)" },
    diagram_state: { nodes: list([U, BF, G, G, BF, U]), edges: [], highlighted: ["r2", "r5"], annotations: an("visible + a buffer above and below", BF) },
  },
  {
    step: 5,
    codeLines: [20],
    caption: "Rows beyond the window are unmounted — torn down to a blank spacer that keeps the scroll height. Rows 1 and 6 are gone.",
    narration: "Rows beyond the window get unmounted — torn down completely, leaving a blank spacer that preserves the scroll height. Rows 1 and 6 are gone.",
    notes: [
      { label: "Key term", term: "Unmount", text: "destroy the row's native view. Memory tracks the window, not the data length — a 100-row list and a 100,000-row list keep about the same number of live rows." },
      { label: "Gotcha", text: "unmount is not recycling. RN tears the row down and rebuilds it from scratch when it returns. True cell reuse (rebind an existing view) is RecyclerView / FlashList, not FlatList." },
    ],
    diagram_state: { nodes: list([U, BF, G, G, BF, U], ["Row 1 (unmounted)", undefined, undefined, undefined, undefined, "Row 6 (unmounted)"]), edges: [], highlighted: ["r1", "r6"], annotations: an("beyond the window → unmounted (memory ≈ O(window))", U) },
  },
  {
    step: 6,
    codeLines: [8, 17],
    caption: "A stable key (item.id, never the index) lets React match each row to its own instance as the window slides.",
    narration: "keyExtractor gives every row a stable key, item id, never the array index. That lets React match each row to its own instance as the window slides, so state follows the data, not the screen slot.",
    note: { label: "Connects to", text: "this is reconciliation by key from the useState lesson — an index key reuses the wrong row's state (a toggle or text input ending up on the wrong row after a scroll).", link: { href: "/learn/usestate", label: "useState & Re-renders" } },
    diagram_state: { nodes: list([U, BF, G, G, BF, U]), edges: [], highlighted: ["r3", "r4"], annotations: an("stable keys keep each row's state with its data", "#4F46E5") },
  },
  {
    step: 7,
    codeLines: [19],
    caption: "First paint renders only initialNumToRender rows (default 10) for a fast time-to-interactive, then fills in.",
    narration: "On first paint FlatList renders only a few rows — initialNumToRender, default ten — so the list appears fast, then fills in the rest.",
    note: { label: "Key term", term: "initialNumToRender", text: "how many rows to render in the very first pass. Small = the list shows up quickly (fast time-to-interactive); the rest stream in right after." },
    diagram_state: { nodes: list([G, G, U, U, U, U]), edges: [], highlighted: ["r1", "r2"], annotations: an("first paint: just initialNumToRender rows", G) },
  },
  {
    step: 8,
    caption: "Then it fills the window in incremental batches of up to maxToRenderPerBatch rows per pass — so it never blocks the JS thread.",
    narration: "After that first paint, FlatList fills the window in incremental batches — up to maxToRenderPerBatch rows per pass — so it never blocks the JS thread for too long.",
    notes: [
      { label: "Key term", term: "maxToRenderPerBatch", text: "rows rendered per incremental pass. Larger fills faster but risks dropping frames; smaller is smoother but leaves more chance of a blank cell." },
      { label: "Gotcha", text: "removeClippedSubviews can detach offscreen views on the native side for extra savings — platform-specific, and a known source of blanking bugs, so test before relying on it." },
    ],
    diagram_state: { nodes: list([G, G, BF, BF, U, U]), edges: [], highlighted: ["r3", "r4"], annotations: an("fill in batches → don't block the JS thread", BF) },
  },
  {
    step: 9,
    codeLines: [16],
    caption: "Scroll down and the window slides with you — rows entering the buffer mount, rows leaving it unmount.",
    narration: "Scroll down and the window slides with you. Rows entering the buffer mount on the fly; rows leaving it unmount. The live count stays about the same.",
    diagram_state: { nodes: list([U, U, BF, G, G, BF], ["Row 1 (unmounted)", "Row 2 (unmounted)"]), edges: [], highlighted: ["r4", "r5"], annotations: an("scroll → the window slides, mounting & unmounting", G) },
  },
  {
    step: 10,
    codeLines: [16],
    caption: "Fling fast and you see blank cells: native scroll outran the JS thread, which hasn't mounted the incoming rows yet.",
    narration: "Fling fast and you can catch blank cells. The native scroll outran the JS thread, which hasn't mounted the incoming rows yet — so FlatList shows a blank spacer until JS catches up.",
    note: { label: "Connects to", text: "a busy JS thread makes this worse — rendering new rows competes for the one JS thread, the same bottleneck from the Threads lesson.", link: { href: "/learn/threads", label: "The Three Threads" } },
    diagram_state: { nodes: list([U, U, B, B, BF, U], [undefined, undefined, "Row 7 (blank…)", "Row 8 (blank…)"]), edges: [], highlighted: ["r3", "r4"], annotations: an("fling → JS thread behind → blank cells for a frame", B) },
  },
  {
    step: 11,
    codeLines: [9, 10, 18],
    caption: "Fixed-height rows? getItemLayout gives FlatList offset = index × ROW_H — no per-row measuring, and instant scroll-to-index.",
    narration: "If your rows are a fixed height, getItemLayout hands FlatList each row's offset directly — index times row height. No per-row measuring, instant scroll-to-index, and less work for the JS thread to keep up on a fast fling.",
    note: { label: "Key term", term: "getItemLayout", text: "you tell FlatList each row's size and position up front, so it never has to measure. Only works when rows are a known fixed height." },
    diagram_state: { nodes: list([U, BF, G, G, BF, U]), edges: [], highlighted: ["r3", "r4"], annotations: an("getItemLayout: offset = index × ROW_H (no measuring)", "#4F46E5") },
  },
  {
    step: 12,
    codeLines: [14, 19, 20],
    caption: "The loop: ScrollView mounts all → FlatList mounts only window + buffer → windowSize/initialNumToRender/maxToRenderPerBatch tune it → getItemLayout skips measuring → a stable key keeps row state correct.",
    narration: "The whole picture: a ScrollView mounts everything; FlatList mounts only the window plus a buffer. windowSize, initialNumToRender, and maxToRenderPerBatch tune it; getItemLayout skips measuring; and a stable key keeps each row's state correct. Memory tracks the window, not the data length.",
    note: { label: "Next", text: "the renderer that finally commits those mounted rows to the screen is Fabric — the New Architecture's renderer.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    diagram_state: { nodes: list([U, BF, G, G, BF, U]), edges: [], highlighted: [], annotations: an("mount only the window → memory ≈ O(window), not O(data)", G) },
  },
]
