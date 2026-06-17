"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { concepts } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"
import { accentFor } from "@/lib/accents"

const EASE = [0.22, 1, 0.36, 1] as const
const SHOWN = concepts.slice(0, 6)
const PAPER = "#0b2747" // prussian blue ground
const LINE = "rgba(220,233,251,0.85)" // chalk-white drafting line
const CYAN = "#67e8f9"
const FAINT = "rgba(220,233,251,0.10)" // grid
const levelOf = (tags: string[]) => (tags.includes("advanced") ? "ADV" : tags.includes("beginner") ? "BEG" : "INT")

function Schematic() {
  const atom = { x: 100, y: 130 }
  const nodes = [
    { x: 300, y: 60, label: "UI" },
    { x: 300, y: 130, label: "SHADOW" },
    { x: 300, y: 200, label: "NATIVE" },
  ]
  return (
    <div className="relative rounded-sm overflow-hidden" style={{ border: `1.5px solid ${LINE}` }}>
      <div className="flex items-stretch font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: LINE, borderBottom: `1.5px solid ${LINE}` }}>
        <div className="px-3 py-1.5" style={{ borderRight: `1.5px solid ${LINE}` }}>Fig. 1 — runtime topology</div>
        <div className="px-3 py-1.5 hidden sm:block" style={{ borderRight: `1.5px solid ${LINE}` }}>scale 1:1</div>
        <div className="px-3 py-1.5 ml-auto" style={{ color: CYAN }}>rev. A</div>
      </div>
      <div className="relative" style={{ backgroundImage: `linear-gradient(${FAINT} 1px,transparent 1px),linear-gradient(90deg,${FAINT} 1px,transparent 1px)`, backgroundSize: "20px 20px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(360px 200px at 26% 50%, rgba(103,232,249,0.16), transparent 72%)" }} />
        <svg viewBox="0 0 380 260" className="relative w-full">
          <defs>
            <filter id="cglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          {nodes.map((n, i) => (
            <g key={i} filter="url(#cglow)">
              <line x1={atom.x} y1={atom.y} x2={n.x} y2={n.y} stroke={LINE} strokeWidth="1" strokeDasharray="1 3" />
              <rect x={n.x - 9} y={n.y - 9} width="18" height="18" fill="none" stroke={LINE} strokeWidth="1.4" />
              <line x1={n.x - 6} y1={n.y} x2={n.x + 6} y2={n.y} stroke={CYAN} strokeWidth="1.4" />
              <line x1={n.x} y1={n.y - 6} x2={n.x} y2={n.y + 6} stroke={CYAN} strokeWidth="1.4" />
              <text x={n.x + 16} y={n.y + 3.5} fontSize="9" fill={LINE} style={{ fontFamily: "var(--font-mono),monospace", letterSpacing: "1px" }}>{n.label}</text>
            </g>
          ))}
          <motion.circle r="3.2" fill={CYAN} filter="url(#cglow)"
            initial={{ cx: atom.x, cy: atom.y }}
            animate={{ cx: [atom.x, nodes[0].x, atom.x, nodes[2].x], cy: [atom.y, nodes[0].y, atom.y, nodes[2].y] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
          <g transform={`translate(${atom.x} ${atom.y})`} filter="url(#cglow)">
            <circle r="34" fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="2 3" />
            <g stroke={CYAN} strokeWidth="1.7" fill="none">
              <ellipse rx="30" ry="11" /><ellipse rx="30" ry="11" transform="rotate(60)" /><ellipse rx="30" ry="11" transform="rotate(-60)" />
            </g>
            <circle r="4.5" fill={CYAN} />
          </g>
          <text x={atom.x} y={atom.y + 50} textAnchor="middle" fontSize="9" fill={LINE} style={{ fontFamily: "var(--font-mono),monospace", letterSpacing: "1px" }}>JS · REACT [A1]</text>
          <g stroke={LINE} strokeWidth="0.8" fill="none" opacity="0.8">
            <line x1={atom.x} y1="232" x2={nodes[0].x} y2="232" />
            <line x1={atom.x} y1="228" x2={atom.x} y2="236" /><line x1={nodes[0].x} y1="228" x2={nodes[0].x} y2="236" />
          </g>
          <text x={(atom.x + nodes[0].x) / 2} y="227" textAnchor="middle" fontSize="8.5" fill={LINE} style={{ fontFamily: "var(--font-mono),monospace" }}>one tick</text>
        </svg>
      </div>
    </div>
  )
}

export default function Cyanotype() {
  return (
    <div className="min-h-screen" style={{ color: "#dce9fb", background: `radial-gradient(900px 600px at 70% -10%, #103a63, ${PAPER}), ${PAPER}`, backgroundImage: `linear-gradient(${FAINT} 1px,transparent 1px),linear-gradient(90deg,${FAINT} 1px,transparent 1px)`, backgroundSize: "22px 22px" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ borderBottom: `1.5px solid ${LINE}`, background: "rgba(11,39,71,0.7)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between font-mono text-[12px] tracking-[0.14em] uppercase">
          <span className="font-bold">how_react_native_works</span>
          <a href="https://github.com/sakshya73" className="hover:text-white transition-colors" style={{ color: "rgba(220,233,251,0.7)" }}>GitHub ↗</a>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-16 pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-6 inline-flex items-center gap-2" style={{ color: CYAN }}>
              <span>◷</span> spec sheet · the react native runtime
            </p>
            <h1 className="font-display font-bold leading-[1.0] tracking-[-0.035em] text-[2.9rem] sm:text-[4.1rem] text-white">
              The internals,
              <br />
              drawn to <span style={{ color: CYAN, textDecoration: "underline", textDecorationThickness: "3px", textUnderlineOffset: "6px", textShadow: "0 0 24px rgba(103,232,249,0.5)" }}>spec</span>.
            </h1>
            <p className="mt-6 text-[1.0625rem] leading-[1.7] max-w-md" style={{ color: "rgba(220,233,251,0.7)" }}>
              Every concept laid out like an engineering drawing — labeled, annotated, and animated step by step. The Bridge, JSI, Fabric, Hermes, the threads.
            </p>
            <div className="mt-8 flex items-center gap-5">
              <Link href="/learn/bridge" className="group inline-flex items-center gap-2 px-5 py-2.5 text-[#06202f] text-sm font-semibold rounded-sm transition-transform hover:-translate-y-0.5" style={{ background: CYAN, boxShadow: "0 8px 30px -8px rgba(103,232,249,0.55)" }}>
                Open sheet 01 — the Bridge <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </motion.div>
          <motion.div className="hidden lg:block" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: EASE }}><Schematic /></motion.div>
        </div>
      </header>

      <main id="concepts" className="max-w-5xl mx-auto px-6 pb-28">
        <div className="flex items-end justify-between mb-5 pt-4" style={{ borderTop: `1.5px solid ${LINE}` }}>
          <h2 className="font-mono text-[12px] tracking-[0.2em] uppercase font-bold">Index of sheets</h2>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "rgba(220,233,251,0.55)" }}>03 live · 13 total</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SHOWN.map((c, i) => {
            const accent = accentFor(c.id)
            const steps = conceptSteps[c.id]?.length ?? 0
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05, ease: EASE }} whileHover={{ y: -3 }}>
                <Link href={`/learn/${c.id}`} className="group block h-full">
                  <div className="relative h-full p-4 flex flex-col transition-all duration-300" style={{ border: `1.5px solid ${LINE}`, background: "rgba(8,30,56,0.5)" }}>
                    <span className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 border-l-2 border-t-2" style={{ borderColor: CYAN }} />
                    <span className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 border-r-2 border-b-2" style={{ borderColor: CYAN }} />
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: `inset 0 0 30px ${CYAN}22` }} />
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em] uppercase mb-3" style={{ color: "rgba(220,233,251,0.6)" }}>
                      <span style={{ color: CYAN }}>RN-{String(i + 1).padStart(2, "0")}</span>
                      <span>{levelOf(c.tags)} · {steps} st</span>
                    </div>
                    <h3 className="font-display text-[1.05rem] font-semibold tracking-tight leading-snug text-white">{c.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed line-clamp-2 min-h-[2.4rem]" style={{ color: "rgba(220,233,251,0.6)" }}>{c.description}</p>
                    <div className="mt-auto pt-2.5 font-mono text-[10px] tracking-[0.14em] uppercase flex items-center justify-between" style={{ color: "rgba(220,233,251,0.55)" }}>
                      <span>open sheet</span><span className="transition-transform duration-300 group-hover:translate-x-0.5" style={{ color: CYAN }}>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
        <p className="mt-10 font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: "rgba(220,233,251,0.35)" }}>preview · cyanotype</p>
      </main>
    </div>
  )
}
