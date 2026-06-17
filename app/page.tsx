"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { concepts } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"
import { accentFor } from "@/lib/accents"
import type { ConceptConfig } from "@/lib/types"

const EASE = [0.22, 1, 0.36, 1] as const
const INK = "#1b2433"
const ACCENT = "#0e7490"
const GRID = "rgba(27,36,51,0.06)"

// Drafts (no `published` flag) only surface in local dev, so the live site
// keeps showing finished concepts only.
const SHOW_DRAFTS = process.env.NODE_ENV === "development"

const levelOf = (tags: string[]) => (tags.includes("advanced") ? "ADV" : tags.includes("beginner") ? "BEG" : "INT")

// The hero signature: the runtime drawn as an engineering schematic with a
// title block, leader lines, crosshair part-markers and a dimension line.
function Schematic() {
  const atom = { x: 100, y: 130 }
  const nodes = [
    { x: 300, y: 60, label: "UI" },
    { x: 300, y: 130, label: "SHADOW" },
    { x: 300, y: 200, label: "NATIVE" },
  ]
  return (
    <div className="relative border-2 rounded-sm overflow-hidden bg-white" style={{ borderColor: INK }}>
      <div className="flex items-stretch border-b-2 font-mono text-[10px] tracking-[0.14em] uppercase" style={{ borderColor: INK, color: INK }}>
        <div className="px-3 py-1.5 border-r-2" style={{ borderColor: INK }}>Fig. 1 — runtime topology</div>
        <div className="px-3 py-1.5 border-r-2 hidden sm:block" style={{ borderColor: INK }}>scale 1:1</div>
        <div className="px-3 py-1.5 ml-auto" style={{ color: ACCENT }}>rev. A</div>
      </div>
      <div className="relative" style={{ backgroundImage: `linear-gradient(${GRID} 1px,transparent 1px),linear-gradient(90deg,${GRID} 1px,transparent 1px)`, backgroundSize: "20px 20px" }}>
        <svg viewBox="0 0 380 260" className="w-full" role="img" aria-label="Schematic of the React Native runtime: the JS thread talks to the UI, shadow and native subsystems.">
          {nodes.map((n, i) => (
            <g key={i}>
              <line x1={atom.x} y1={atom.y} x2={n.x} y2={n.y} stroke={INK} strokeWidth="1" strokeDasharray="1 3" />
              <rect x={n.x - 9} y={n.y - 9} width="18" height="18" fill="white" stroke={INK} strokeWidth="1.4" />
              <line x1={n.x - 6} y1={n.y} x2={n.x + 6} y2={n.y} stroke={ACCENT} strokeWidth="1.4" />
              <line x1={n.x} y1={n.y - 6} x2={n.x} y2={n.y + 6} stroke={ACCENT} strokeWidth="1.4" />
              <text x={n.x + 16} y={n.y + 3.5} fontSize="9" fill={INK} style={{ fontFamily: "var(--font-mono),monospace", letterSpacing: "1px" }}>{n.label}</text>
            </g>
          ))}
          <motion.circle r="3" fill={ACCENT}
            initial={{ cx: atom.x, cy: atom.y }}
            animate={{ cx: [atom.x, nodes[0].x, atom.x, nodes[2].x], cy: [atom.y, nodes[0].y, atom.y, nodes[2].y] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
          <g transform={`translate(${atom.x} ${atom.y})`}>
            <circle r="34" fill="none" stroke={INK} strokeWidth="1" strokeDasharray="2 3" />
            <g stroke={ACCENT} strokeWidth="1.6" fill="none">
              <ellipse rx="30" ry="11" /><ellipse rx="30" ry="11" transform="rotate(60)" /><ellipse rx="30" ry="11" transform="rotate(-60)" />
            </g>
            <circle r="4.5" fill={INK} />
          </g>
          <text x={atom.x} y={atom.y + 50} textAnchor="middle" fontSize="9" fill={INK} style={{ fontFamily: "var(--font-mono),monospace", letterSpacing: "1px" }}>JS · REACT [A1]</text>
          <g stroke={INK} strokeWidth="0.8" fill="none">
            <line x1={atom.x} y1="232" x2={nodes[0].x} y2="232" />
            <line x1={atom.x} y1="228" x2={atom.x} y2="236" /><line x1={nodes[0].x} y1="228" x2={nodes[0].x} y2="236" />
          </g>
          <text x={(atom.x + nodes[0].x) / 2} y="228" textAnchor="middle" fontSize="8.5" fill={INK} style={{ fontFamily: "var(--font-mono),monospace" }}>one tick</text>
        </svg>
      </div>
    </div>
  )
}

function SheetCard({ concept, n, draft = false }: { concept: ConceptConfig; n: number; draft?: boolean }) {
  const accent = accentFor(concept.id)
  const steps = conceptSteps[concept.id]?.length ?? 0
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(n, 8) * 0.045, ease: EASE }} whileHover={{ y: -3 }}>
      <Link href={`/learn/${concept.id}`} className="group block h-full">
        <div className="relative h-full bg-white border-2 p-4 flex flex-col transition-shadow duration-300 group-hover:shadow-[6px_6px_0_0_var(--g)]" style={{ borderColor: INK, ["--g" as string]: accent }}>
          <span className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 border-l-2 border-t-2" style={{ borderColor: accent }} />
          <span className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 border-r-2 border-b-2" style={{ borderColor: accent }} />
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em] uppercase mb-3" style={{ color: "rgba(27,36,51,0.6)" }}>
            <span style={{ color: accent }}>RN-{String(n).padStart(2, "0")}</span>
            <span className="flex items-center gap-2">
              {draft && <span className="px-1.5 rounded-sm text-white" style={{ background: "#b45309" }}>draft</span>}
              {levelOf(concept.tags)} · {steps} st
            </span>
          </div>
          <h3 className="font-display text-[1.05rem] font-semibold tracking-tight leading-snug" style={{ color: INK }}>{concept.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed line-clamp-2 min-h-[2.4rem]" style={{ color: "rgba(27,36,51,0.62)" }}>{concept.description}</p>
          <div className="mt-auto pt-2.5 font-mono text-[10px] tracking-[0.14em] uppercase flex items-center justify-between" style={{ color: "rgba(27,36,51,0.5)" }}>
            <span>open sheet</span><span className="transition-transform duration-300 group-hover:translate-x-0.5" style={{ color: accent }}>→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Home() {
  const published = concepts.filter((c) => c.published)
  const drafts = SHOW_DRAFTS ? concepts.filter((c) => !c.published) : []

  return (
    <div className="min-h-screen" style={{ color: INK, background: "#fbfcfd", backgroundImage: `linear-gradient(${GRID} 1px,transparent 1px),linear-gradient(90deg,${GRID} 1px,transparent 1px)`, backgroundSize: "22px 22px" }}>
      <nav className="border-b-2 sticky top-0 z-50 backdrop-blur-md" style={{ borderColor: INK, background: "rgba(251,252,253,0.82)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between font-mono text-[11px] sm:text-[12px] tracking-[0.14em] uppercase">
          <span className="font-bold truncate">how_react_native_works</span>
          <a href="https://github.com/sakshya73" className="hover:opacity-60 transition-opacity shrink-0">GitHub ↗</a>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-14 sm:pt-16 pb-14 sm:pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-6 inline-flex items-center gap-2" style={{ color: ACCENT }}>
              <span aria-hidden>◷</span> spec sheet · the react native runtime
            </p>
            <h1 className="font-display font-bold leading-[1.0] tracking-[-0.035em] text-[2.6rem] sm:text-[4.1rem]">
              The internals,
              <br />
              drawn to <span style={{ color: ACCENT, textDecoration: "underline", textDecorationThickness: "3px", textUnderlineOffset: "6px" }}>spec</span>.
            </h1>
            <p className="mt-6 text-[1.0625rem] leading-[1.7] max-w-md" style={{ color: "rgba(27,36,51,0.68)" }}>
              Every concept laid out like an engineering drawing — labeled, annotated, and animated step by step. The Bridge, JSI, Fabric, Hermes, the threads.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/learn/bridge" className="group inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-sm transition-transform hover:-translate-y-0.5" style={{ background: INK }}>
                Open sheet 01 — the Bridge <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <a href="#concepts" className="font-mono text-[11px] tracking-[0.16em] uppercase hover:opacity-60 transition-opacity" style={{ color: "rgba(27,36,51,0.55)" }}>index ↓</a>
            </div>
          </motion.div>
          <motion.div className="hidden lg:block" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: EASE }}><Schematic /></motion.div>
        </div>
      </header>

      <main id="concepts" className="max-w-5xl mx-auto px-6 pb-24 scroll-mt-20">
        <div className="flex items-end justify-between mb-5 border-t-2 pt-4" style={{ borderColor: INK }}>
          <h2 className="font-mono text-[12px] tracking-[0.2em] uppercase font-bold">Index of sheets</h2>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "rgba(27,36,51,0.5)" }}>{String(published.length).padStart(2, "0")} live · {concepts.length} total</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {published.map((c, i) => <SheetCard key={c.id} concept={c} n={i + 1} />)}
        </div>

        {drafts.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between mb-5 border-t-2 pt-4" style={{ borderColor: "rgba(27,36,51,0.35)" }}>
              <h2 className="font-mono text-[12px] tracking-[0.2em] uppercase font-bold inline-flex items-center gap-2">
                In review <span className="text-[10px] px-1.5 rounded-sm text-white normal-case tracking-normal" style={{ background: "#b45309" }}>local only</span>
              </h2>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "rgba(27,36,51,0.5)" }}>{drafts.length} drafts · not live</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {drafts.map((c, i) => <SheetCard key={c.id} concept={c} n={i + 1} draft />)}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t-2 mt-6" style={{ borderColor: INK }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: "rgba(27,36,51,0.6)" }}>
          <span>how_react_native_works — built to understand, not just ship</span>
          <a href="https://github.com/sakshya73" className="hover:opacity-60 transition-opacity">GitHub ↗</a>
        </div>
      </footer>
    </div>
  )
}
