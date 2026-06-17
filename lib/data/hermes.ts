import { Step, DiagramNode, DiagramEdge } from "../types"

const SRC = "#4F46E5" // your JS bundle
const HERMESC = "#8B5CF6" // hermesc compiler (build time)
const HBC = "#F59E0B" // .hbc bytecode artifact
const VM = "#059669" // on-device VM / the wins
const JSC = "#DC2626" // JSC / the no-JIT honesty beat
const METRO = "#0891B2" // Metro cross-link node
const FLOW = "#818CF8" // animated flow edges
const WIN = "#6EE7B7" // success edges
const LEGACY = "#FCA5A5" // dashed legacy edge

// ── pipeline builders: bundle → hermesc → .hbc → VM (build time | on device) ──
const bundle = (label = "JS bundle\n(your app)", color = SRC): DiagramNode => ({ id: "bundle", label, x: 40, y: 150, width: 150, height: 60, style: "box", color })
const hermesc = (label = "hermesc\ncompiler", color = HERMESC): DiagramNode => ({ id: "hermesc", label, x: 230, y: 150, width: 150, height: 60, style: "box", color })
const hbc = (label = "index.hbc\nbytecode", color = HBC): DiagramNode => ({ id: "hbc", label, x: 420, y: 150, width: 150, height: 60, style: "box", color })
const vm = (label = "Hermes VM\non device", color = VM): DiagramNode => ({ id: "vm", label, x: 610, y: 150, width: 150, height: 60, style: "box", color })

const buildPill: DiagramNode = { id: "build", label: "BUILD TIME · your machine", x: 40, y: 72, width: 340, height: 40, style: "pill", color: HERMESC }
const devicePill: DiagramNode = { id: "device", label: "ON DEVICE · user's phone", x: 420, y: 72, width: 340, height: 40, style: "pill", color: VM }

const startup: DiagramNode = { id: "startup", label: "Faster startup\nno on-device parse", x: 610, y: 300, width: 150, height: 60, style: "box", color: VM }
const memory: DiagramNode = { id: "memory", label: "Lower memory\nmmap'd bytecode", x: 420, y: 300, width: 150, height: 60, style: "box", color: VM }
const jsc = (label = "JSC\nparse + compile (JIT) on device", color = JSC): DiagramNode => ({ id: "jsc", label, x: 40, y: 300, width: 320, height: 60, style: "box", color })
const metro: DiagramNode = { id: "metro", label: "Metro bundle", x: 40, y: 300, width: 150, height: 60, style: "box", color: METRO }
const jsi: DiagramNode = { id: "jsi", label: "JSI → native modules / Fabric", x: 555, y: 412, width: 225, height: 40, style: "pill", color: "#3B82F6" }

const e = (id: string, from: string, to: string, label: string, color = FLOW, dashed = false): DiagramEdge => ({ id, from, to, label, animated: !dashed, dashed, color })
const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

export const hermesSteps: Step[] = [
  {
    step: 1,
    caption: "Your JavaScript can't run by itself — it needs a JS engine. Since React Native 0.70 the default engine is Hermes (the old default was JSC, JavaScriptCore).",
    narration: "Your JavaScript can't run by itself. It needs a JavaScript engine to execute it. Since React Native version zero point seventy, the default engine is Hermes, built by Meta specifically for mobile. Before that the default was J S C, short for JavaScriptCore, the engine from Safari.",
    notes: [
      { label: "Key term", term: "JS engine", text: "the program that actually runs your JavaScript — parses it, turns it into something executable, and runs it. Your browser uses V8 or JavaScriptCore; a React Native app uses Hermes by default." },
      { label: "Heads up", text: "Hermes is just the engine choice. It runs on both the old and the New Architecture — it is not part of the New Architecture, and you can still opt back to JSC." },
    ],
    diagram_state: { nodes: [vm("Hermes VM\ndefault since RN 0.70")], edges: [], highlighted: ["vm"], annotations: an("Hermes — RN's default JS engine since 0.70", VM) },
  },
  {
    step: 2,
    codeLines: [4, 5],
    caption: "Hermes doesn't start from your source files — it starts from the single JS bundle Metro produces.",
    narration: "Hermes doesn't work on your scattered source files directly. It starts from the one big JavaScript bundle that Metro produces — every module stitched into a single file. That bundle is the input to everything that follows.",
    note: { label: "Connects to", text: "that single bundle is Metro's job — it gathers every module and transforms modern syntax down to plain JavaScript that hermesc can then compile.", link: { href: "/learn/metro", label: "Metro Bundler" } },
    diagram_state: { nodes: [metro, bundle("JS bundle\nfrom Metro")], edges: [e("e_metro", "metro", "bundle", "produces", METRO)], highlighted: ["metro", "bundle"], annotations: an("Metro stitches your modules into one bundle.js", METRO) },
  },
  {
    step: 3,
    codeLines: [7, 8],
    caption: "At build time, on your machine, hermesc compiles that bundle ahead of time. Nothing here runs on the phone yet.",
    narration: "Here's the whole trick, and it happens at build time on your own machine, not on the user's phone. The Hermes compiler, hermesc, takes the bundle and compiles it ahead of time. Ahead of time just means before the app ever runs.",
    note: { label: "Key term", term: "AOT", text: "ahead-of-time compilation. The compile work is done once, at build time, and baked into the app. The opposite is just-in-time — compiling on the device while the app runs, which is what JSC does." },
    diagram_state: { nodes: [buildPill, bundle(), hermesc()], edges: [e("e1", "bundle", "hermesc", "compile")], highlighted: ["hermesc"], annotations: an("AOT: compile once, at build time — not on device", HERMESC) },
  },
  {
    step: 4,
    codeLines: [8, 9],
    caption: "hermesc emits Hermes bytecode — a compact index.hbc file. Your app ships this precompiled, not your JS source.",
    narration: "What hermesc emits is Hermes bytecode, a compact file ending in dot h b c. Your app ships this precompiled bytecode inside the binary, instead of shipping your raw JavaScript text. The phone never sees the source.",
    note: { label: "Key term", term: "Bytecode", text: "a low-level instruction format the Hermes interpreter runs directly. It's already parsed and laid out, so loading it skips the slow parse-and-compile step that raw JavaScript needs." },
    diagram_state: { nodes: [buildPill, bundle(), hermesc(), hbc()], edges: [e("e1", "bundle", "hermesc", "compile"), e("e2", "hermesc", "hbc", "emit .hbc")], highlighted: ["hbc"], annotations: an("ship precompiled .hbc — not your JS source", HBC) },
  },
  {
    step: 5,
    codeLines: [11, 12],
    caption: "On the device, the Hermes VM loads the .hbc and memory-maps it (mmap) — no parse, no compile. It just runs.",
    narration: "Now jump to the device. The Hermes virtual machine takes that bytecode and memory-maps it. Memory-mapping means the file is mapped straight into memory and read on demand, without loading and parsing the whole thing first. There is no parse step and no compile step at startup. The VM just starts executing.",
    note: { label: "Key term", term: "mmap", text: "memory-mapping. The bytecode file is mapped read-only into the app's memory; pages load lazily as they're touched. Because they're read-only and file-backed, the OS can drop them under memory pressure and reload them later — cheaper than heap memory." },
    diagram_state: { nodes: [buildPill, devicePill, bundle(), hermesc(), hbc(), vm()], edges: [e("e1", "bundle", "hermesc", "compile"), e("e2", "hermesc", "hbc", "emit .hbc"), e("e3", "hbc", "vm", "ship + mmap", WIN)], highlighted: ["vm", "device"], annotations: an("device loads + mmaps bytecode → no parse, no compile", VM) },
  },
  {
    step: 6,
    codeLines: [12],
    caption: "Skipping on-device parse + compile is why Hermes reaches your first screen faster — lower time-to-interactive at launch.",
    narration: "Because the heavy parse-and-compile work already happened back at build time, the app reaches your first screen faster. That's the headline win: a lower time to interactive at launch, especially on cheaper phones.",
    notes: [
      { label: "Key term", term: "Time-to-interactive", text: "how long from tapping the icon to a screen the user can actually use. Hermes lowers it by deleting the on-device parse and compile from the startup path." },
      { label: "Try it", text: "in the Playground tab, race a JSC startup against a Hermes startup for the same app and watch where the time goes." },
    ],
    diagram_state: { nodes: [buildPill, devicePill, bundle(), hermesc(), hbc(), vm(), startup], edges: [e("e1", "bundle", "hermesc", "compile"), e("e2", "hermesc", "hbc", "emit .hbc"), e("e3", "hbc", "vm", "ship + mmap", WIN), e("e_start", "vm", "startup", "", WIN)], highlighted: ["startup", "vm"], annotations: an("no on-device parse/compile → faster time-to-interactive", VM) },
  },
  {
    step: 7,
    caption: "Second win: lower memory. Bytecode is mmap'd (evictable), and Hermes uses Hades — a mostly-concurrent, generational GC tuned for mobile.",
    narration: "The second win is memory. The mmap'd bytecode doesn't sit on the heap, and the system can drop those read-only pages when memory runs low. On top of that, Hermes uses a garbage collector called Hades, a mostly concurrent, generational collector tuned for mobile, so cleanup mostly runs on a background thread instead of freezing your app.",
    note: { label: "Key term", term: "Hades", text: "Hermes's garbage collector. \"Generational\" collects short-lived objects cheaply and often; \"mostly concurrent\" does the bulk of its work on a background thread, so pauses on the JS thread stay short." },
    diagram_state: { nodes: [buildPill, devicePill, bundle(), hermesc(), hbc(), vm(), startup, memory], edges: [e("e1", "bundle", "hermesc", "compile"), e("e2", "hermesc", "hbc", "emit .hbc"), e("e3", "hbc", "vm", "ship + mmap", WIN), e("e_start", "vm", "startup", "", WIN), e("e_mem", "vm", "memory", "", WIN)], highlighted: ["memory"], annotations: an("mmap'd bytecode + Hades GC → lower memory on device", VM) },
  },
  {
    step: 8,
    codeLines: [14, 15],
    caption: "The old JSC path shipped raw JS and paid the full parse + compile cost on the device, at every launch.",
    narration: "Compare the old default, J S C. There the device shipped raw JavaScript text and had to parse and compile it at runtime, every single launch. That's exactly the startup cost Hermes moves to build time.",
    note: { label: "Key term", term: "JSC", text: "JavaScriptCore, Safari's engine and React Native's default before 0.70. It parses and compiles your JS on the device, and includes a JIT that recompiles hot code while the app runs. It's now a community package." },
    diagram_state: { nodes: [buildPill, devicePill, bundle(), hermesc(), hbc(), vm(), startup, memory, jsc()], edges: [e("e1", "bundle", "hermesc", "compile"), e("e2", "hermesc", "hbc", "emit .hbc"), e("e3", "hbc", "vm", "ship + mmap", WIN), e("e_start", "vm", "startup", "", WIN), e("e_mem", "vm", "memory", "", WIN), e("e_jsc", "bundle", "jsc", "ship raw JS", LEGACY, true)], highlighted: ["jsc"], annotations: an("legacy JSC: parse + compile paid on device, every launch", JSC) },
  },
  {
    step: 9,
    codeLines: [12, 15],
    caption: "The honest tradeoff: Hermes has no JIT by design. JSC's JIT can make a long, CPU-bound loop run faster than Hermes.",
    narration: "Now the honest tradeoff, the thing interviewers love. Hermes deliberately has no J I T. A J I T recompiles hot code into fast machine code while the app runs, and J S C has one. So a long, CPU-bound loop — heavy number crunching — can actually run faster on J S C than on Hermes. Hermes trades that peak throughput for faster startup, lower memory, and a smaller engine, which is the right deal for most mobile apps.",
    notes: [
      { label: "Gotcha", text: "\"Hermes is faster\" is only true for startup and memory. For a tight CPU-bound loop with no startup involved, JSC's JIT can win. Hermes is not a JIT and never claims to be — don't say it JIT-compiles." },
      { label: "Key term", term: "JIT", text: "just-in-time compilation — turning hot code into machine code at runtime. Great for long-running CPU work; it costs startup time, memory, and a bigger binary, which is why Hermes skips it for mobile." },
    ],
    diagram_state: { nodes: [buildPill, devicePill, bundle(), hermesc(), hbc(), vm("Hermes VM\nno JIT — interprets bytecode"), startup, memory, jsc("JSC\nhas a JIT — wins CPU loops")], edges: [e("e1", "bundle", "hermesc", "compile"), e("e2", "hermesc", "hbc", "emit .hbc"), e("e3", "hbc", "vm", "ship + mmap", WIN), e("e_start", "vm", "startup", "", WIN), e("e_mem", "vm", "memory", "", WIN), e("e_jsc", "bundle", "jsc", "ship raw JS", LEGACY, true)], highlighted: ["vm", "jsc"], annotations: an("no JIT: faster startup + less memory, but slower on heavy CPU loops", JSC) },
  },
  {
    step: 10,
    caption: "The running VM reaches native through JSI — the C++ interface that lets JS call native modules and Fabric directly.",
    narration: "One more connection. Once the VM is running, it reaches the native side through J S I, a C plus plus interface that lets your JavaScript call native modules and the renderer directly. Hermes ships with J S I built in, which is why it pairs so naturally with the New Architecture.",
    note: { label: "Connects to", text: "JSI is the direct C++ replacement for the old bridge — the same interface that lets the New Architecture call native synchronously.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    diagram_state: { nodes: [buildPill, devicePill, bundle(), hermesc(), hbc(), vm(), startup, memory, jsc(), jsi], edges: [e("e1", "bundle", "hermesc", "compile"), e("e2", "hermesc", "hbc", "emit .hbc"), e("e3", "hbc", "vm", "ship + mmap", WIN), e("e_start", "vm", "startup", "", WIN), e("e_mem", "vm", "memory", "", WIN), e("e_jsc", "bundle", "jsc", "ship raw JS", LEGACY, true), e("e_jsi", "vm", "jsi", "calls native", "#3B82F6")], highlighted: ["jsi", "vm"], annotations: an("running VM → JSI → native modules & Fabric", "#3B82F6") },
  },
  {
    step: 11,
    codeLines: [5, 8, 12],
    caption: "The loop: Metro bundle → hermesc compiles AOT to .hbc → ship bytecode → device mmaps + runs it (no parse/compile) → faster startup, lower memory, JSI into native. The cost: no JIT, so heavy CPU loops can trail JSC.",
    narration: "So the whole story. Metro produces a bundle. At build time, hermesc compiles it ahead of time into bytecode. Your app ships that bytecode. On the device, Hermes memory-maps it and runs it straight away, with no parse and no compile at startup. You get faster startup, lower memory, and a clean J S I path into native. The one cost: no J I T, so a heavy CPU loop can trail J S C. For mobile, that's the right trade.",
    note: { label: "Next", text: "once the VM is running, it reaches native through JSI — the direct C++ interface the New Architecture is built on.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    diagram_state: { nodes: [buildPill, devicePill, bundle(), hermesc(), hbc(), vm()], edges: [e("e1", "bundle", "hermesc", "compile"), e("e2", "hermesc", "hbc", "emit .hbc"), e("e3", "hbc", "vm", "ship + mmap", WIN)], highlighted: ["bundle", "hermesc", "hbc", "vm"], annotations: an("bundle → hermesc (AOT) → .hbc → mmap + run on device", VM) },
  },
]
