"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { concepts } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"
import { accentFor } from "@/lib/accents"

const EASE = [0.22, 1, 0.36, 1] as const
const SHOWN = concepts.slice(0, 7)
const C = { bg: "#0c0e14", panel: "#0f131b", border: "rgba(255,255,255,0.09)", text: "#cdd3de", dim: "#6b7689", cyan: "#22d3ee", amber: "#f59e0b", violet: "#a78bfa", green: "#34d399" }
const oneLine = (s: string) => (s.length > 52 ? s.slice(0, 49) + "…" : s)
const levelOf = (tags: string[]) => (tags.includes("advanced") ? "adv" : tags.includes("beginner") ? "beg" : "int")

function Term() {
  const L = "var(--font-mono),monospace"
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: C.border, background: C.panel, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.7)" }}>
      <div className="flex items-center gap-2 px-4 h-9 border-b" style={{ borderColor: C.border }}>
        <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} /><span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} /><span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-2 text-[11px]" style={{ fontFamily: L, color: C.dim }}>rnw — explain</span>
      </div>
      <div className="p-4 text-[12.5px] leading-[1.7]" style={{ fontFamily: L, color: C.text }}>
        <div><span style={{ color: C.cyan }}>$</span> rnw explain <span style={{ color: C.amber }}>bridge</span></div>
        <div style={{ color: C.dim }}>↳ tracing JS ⇄ Native, async + serialized…</div>
        <pre className="my-3 leading-[1.5]" style={{ color: C.text }}>{`   ┌─ JS thread ─┐   msg    ┌─ Native ──┐
   │  setLikes() │ ──────▶  │  UIView    │
   └─────────────┘  async   └────────────┘`}</pre>
        <div><span style={{ color: C.violet }}>note</span> <span style={{ color: C.dim }}>// every call is written down, carried over, read aloud</span></div>
        <div className="mt-1"><span style={{ color: C.green }}>✔</span> 18 steps · drawn + narrated</div>
        <div className="mt-2"><span style={{ color: C.cyan }}>$</span> <span className="motion-safe:animate-pulse">▍</span></div>
      </div>
    </div>
  )
}

export default function Terminal() {
  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text }}>
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ borderColor: C.border, background: "rgba(12,14,20,0.7)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between" style={{ fontFamily: "var(--font-mono),monospace" }}>
          <span className="text-[13px] tracking-[0.12em] text-white/90"><span style={{ color: C.cyan }}>~/</span>how-react-native-works</span>
          <a href="https://github.com/sakshya73" className="text-[12px] text-white/50 hover:text-white/90 transition-colors">GitHub ↗</a>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_440px] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="mb-6 text-[12px] tracking-[0.05em]" style={{ fontFamily: "var(--font-mono),monospace", color: C.dim }}>
              <span style={{ color: C.cyan }}>$</span> man react-native <span style={{ color: C.amber }}>--internals</span>
            </p>
            <h1 className="font-display font-bold leading-[1.0] tracking-[-0.035em] text-[3rem] sm:text-[4.2rem] text-white">
              See how React
              <br />
              Native <span style={{ color: C.cyan }}>runs</span>.
            </h1>
            <p className="mt-6 text-[1.0625rem] leading-[1.7] max-w-md" style={{ color: "rgba(205,211,222,0.65)" }}>
              Not the docs — the runtime. The Bridge, JSI, Fabric, Hermes, the threads, traced step by step and narrated like a debugger session.
            </p>
            <div className="mt-8 flex items-center gap-5" style={{ fontFamily: "var(--font-mono),monospace" }}>
              <Link href="/learn/bridge" className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[#06141a] text-[13px] font-semibold transition-transform hover:-translate-y-0.5" style={{ background: C.cyan, boxShadow: "0 8px 30px -10px rgba(34,211,238,0.55)" }}>
                <span style={{ color: "#06141a", opacity: 0.6 }}>$</span> start bridge <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <a href="#concepts" className="text-[12px] text-white/45 hover:text-white/80 transition-colors">rnw list ↓</a>
            </div>
          </motion.div>
          <motion.div className="hidden lg:block" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: EASE }}><Term /></motion.div>
        </div>
      </header>

      <main id="concepts" className="max-w-5xl mx-auto px-6 pb-28" style={{ fontFamily: "var(--font-mono),monospace" }}>
        <div className="flex items-center gap-3 mb-3 border-t pt-5" style={{ borderColor: C.border }}>
          <span className="text-[13px]"><span style={{ color: C.cyan }}>$</span> rnw list</span>
          <span className="flex-1" />
          <span className="text-[11px] tracking-[0.14em] uppercase" style={{ color: C.dim }}>03 live · 13 total</span>
        </div>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.border, background: C.panel }}>
          {SHOWN.map((c, i) => {
            const accent = accentFor(c.id)
            const steps = conceptSteps[c.id]?.length ?? 0
            return (
              <Link key={c.id} href={`/learn/${c.id}`} className="group flex items-center gap-3 sm:gap-5 px-4 py-3 border-b last:border-b-0 transition-colors" style={{ borderColor: C.border }}>
                <span className="text-[12px] w-5 shrink-0" style={{ color: accent }}>›</span>
                <span className="text-[13px] sm:text-[14px] text-white/90 w-[120px] sm:w-[150px] shrink-0 group-hover:underline" style={{ textDecorationColor: accent }}>{c.id}</span>
                <span className="hidden sm:block flex-1 text-[12.5px] truncate" style={{ color: C.dim }}># {oneLine(c.description)}</span>
                <span className="text-[11px] shrink-0" style={{ color: "rgba(205,211,222,0.45)" }}>[{levelOf(c.tags)} · {steps}]</span>
                <span className="text-[13px] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: accent }}>→</span>
              </Link>
            )
          })}
        </div>
        <p className="mt-8 text-[11px] tracking-[0.2em] uppercase" style={{ color: "rgba(205,211,222,0.3)" }}>preview · terminal</p>
      </main>
    </div>
  )
}
