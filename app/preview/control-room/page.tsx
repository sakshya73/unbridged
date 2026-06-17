"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { concepts } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"
import { accentFor } from "@/lib/accents"

const EASE = [0.22, 1, 0.36, 1] as const
const SHOWN = concepts.slice(0, 6)
const levelOf = (tags: string[]) =>
  tags.includes("advanced") ? { label: "advanced", color: "#fb7185" } : tags.includes("beginner") ? { label: "beginner", color: "#34d399" } : { label: "intermediate", color: "#fbbf24" }

const NODES = [
  { id: "ui", x: 300, y: 70, color: "#22d3ee", label: "UI THREAD" },
  { id: "shadow", x: 300, y: 150, color: "#a78bfa", label: "SHADOW" },
  { id: "native", x: 300, y: 230, color: "#fbbf24", label: "NATIVE" },
]

function Scope() {
  const atom = { x: 96, y: 150 }
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ background: "linear-gradient(180deg,#0d1219,#0a0e14)" }}>
      <div className="flex items-center justify-between px-4 h-10 border-b border-white/10">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-cyan-300/70">runtime · scope</span>
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase inline-flex items-center gap-1.5 text-emerald-300/80">
          <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" /><span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" /></span>live
        </span>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(420px 220px at 28% 55%, rgba(34,211,238,0.18), transparent 70%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
        <svg viewBox="0 0 380 300" className="relative w-full">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {NODES.map((n) => (
            <line key={n.id} x1={atom.x} y1={atom.y} x2={n.x} y2={n.y} stroke={n.color} strokeOpacity="0.35" strokeWidth="1.4" />
          ))}
          {NODES.map((n, i) => (
            <motion.circle key={`p${n.id}`} r="4" fill={n.color} filter="url(#glow)"
              initial={{ cx: atom.x, cy: atom.y, opacity: 0 }}
              animate={{ cx: [atom.x, n.x], cy: [atom.y, n.y], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut", delay: i * 0.6 }} />
          ))}
          {NODES.map((n) => (
            <g key={`n${n.id}`}>
              <motion.circle cx={n.x} cy={n.y} r="12" fill={n.color} filter="url(#glow)" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
              <text x={n.x - 20} y={n.y + 3.5} textAnchor="end" fontSize="9.5" fill="rgba(230,233,240,0.65)" style={{ fontFamily: "var(--font-mono),monospace", letterSpacing: "1.5px" }}>{n.label}</text>
            </g>
          ))}
          <g transform={`translate(${atom.x} ${atom.y})`} filter="url(#glow)">
            <g stroke="#22d3ee" strokeWidth="2.2" fill="none">
              <ellipse rx="32" ry="12" /><ellipse rx="32" ry="12" transform="rotate(60)" /><ellipse rx="32" ry="12" transform="rotate(-60)" />
            </g>
            <circle r="6.5" fill="#67e8f9" />
          </g>
          <text x={atom.x} y={atom.y + 52} textAnchor="middle" fontSize="9.5" fill="rgba(230,233,240,0.6)" style={{ fontFamily: "var(--font-mono),monospace", letterSpacing: "1.5px" }}>JS · REACT</text>
        </svg>
      </div>
    </div>
  )
}

export default function ControlRoom() {
  return (
    <div className="min-h-screen text-[#e6e9f0]" style={{ background: "#0a0d13" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10" style={{ background: "rgba(10,13,19,0.7)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-mono text-[13px] tracking-[0.14em] uppercase text-white/90">how_react_native_works</span>
          <a href="https://github.com/sakshya73" className="font-mono text-[12px] tracking-wide text-white/50 hover:text-white/90 transition-colors">GitHub ↗</a>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-20 pb-20">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-cyan-300/80 mb-7 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> the invisible runtime, made visible
            </p>
            <h1 className="font-display font-bold leading-[0.98] tracking-[-0.04em] text-[3.2rem] sm:text-[4.5rem]">
              Stop guessing.
              <br />
              <span style={{ color: "#22d3ee" }}>Watch</span> it run.
            </h1>
            <p className="mt-7 text-[1.0625rem] text-white/60 max-w-md leading-[1.7]">
              The Bridge, JSI, Fabric, Hermes, the threads — drawn out step by step and animated, so the internals finally click.
            </p>
            <div className="mt-9 flex items-center gap-5">
              <Link href="/learn/bridge" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[#06141a] text-sm font-semibold transition-transform hover:-translate-y-0.5" style={{ background: "#22d3ee", boxShadow: "0 8px 30px -8px rgba(34,211,238,0.6)" }}>
                Start with the Bridge <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <a href="#concepts" className="font-mono text-[12px] tracking-wide uppercase text-white/45 hover:text-white/80 transition-colors">browse ↓</a>
            </div>
          </motion.div>
          <motion.div className="hidden lg:block" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: EASE }}><Scope /></motion.div>
        </div>
      </header>

      <main id="concepts" className="max-w-5xl mx-auto px-6 pb-28 scroll-mt-20">
        <div className="flex items-end justify-between mb-7 border-t border-white/10 pt-6">
          <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/40">concepts</h2>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/30">probe any module ↗</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOWN.map((c, i) => {
            const accent = accentFor(c.id)
            const level = levelOf(c.tags)
            const steps = conceptSteps[c.id]?.length ?? 0
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05, ease: EASE }} whileHover={{ y: -4 }}>
                <Link href={`/learn/${c.id}`} className="group block h-full">
                  <div className="relative h-full rounded-2xl p-5 flex flex-col border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/20" style={{ background: "#11151d", ["--g" as string]: accent }}>
                    <span className="absolute inset-x-0 top-0 h-px opacity-60" style={{ background: accent }} />
                    <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(220px 120px at 50% 0%, ${accent}26, transparent 70%)` }} />
                    <div className="flex items-center justify-between mb-5">
                      <span className="h-8 w-8 rounded-lg grid place-items-center font-mono text-[11px]" style={{ background: `${accent}1f`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}40` }}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-mono text-[10px] tracking-[0.12em] uppercase inline-flex items-center gap-1.5" style={{ color: level.color }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: level.color }} />{level.label}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-white">{c.title}</h3>
                    <p className="mt-1.5 text-sm text-white/50 leading-relaxed line-clamp-2 min-h-[2.5rem]">{c.description}</p>
                    <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">{steps} steps</span>
                      <span className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" style={{ color: accent }}>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
        <p className="mt-10 text-center font-mono text-[11px] tracking-[0.2em] uppercase text-white/25">preview · control room</p>
      </main>
    </div>
  )
}
