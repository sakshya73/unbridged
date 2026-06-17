"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { concepts } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"
import { accentFor } from "@/lib/accents"

const EASE = [0.22, 1, 0.36, 1] as const
const SHOWN = concepts.slice(0, 7)
const ACCENT = "#1d4ed8"
const levelOf = (tags: string[]) =>
  tags.includes("advanced") ? "advanced" : tags.includes("beginner") ? "beginner" : "intermediate"

export default function Editorial() {
  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      <nav className="border-b-2 border-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-display font-bold tracking-tight text-[15px]">How React Native Works</span>
          <a href="https://github.com/sakshya73" className="text-sm font-medium hover:text-[#1d4ed8] transition-colors">GitHub →</a>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-14 pb-16">
        <div className="flex items-center gap-3 mb-7">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase">No. 01 — The Runtime</span>
          <span className="flex-1 h-px bg-[#0a0a0a]/20" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#0a0a0a]/50">interview-ready</span>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
          className="font-display font-bold leading-[0.9] tracking-[-0.045em] text-[3.4rem] sm:text-[6rem] lg:text-[7.5rem]">
          How React Native
          <br />
          <span style={{ color: ACCENT }}>actually</span> works.
        </motion.h1>
        <div className="mt-9 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
          <p className="text-xl sm:text-2xl text-[#0a0a0a]/70 max-w-xl leading-[1.45]">
            Not how to <i>use</i> it — how it <b className="text-[#0a0a0a]">runs</b>. Every concept drawn out and animated, step by step, until the internals click.
          </p>
          <Link href="/learn/bridge" className="group inline-flex items-center gap-2 px-6 py-3 text-white text-base font-semibold whitespace-nowrap transition-transform hover:-translate-y-0.5" style={{ background: ACCENT }}>
            Start with the Bridge <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </header>

      <main id="concepts" className="max-w-6xl mx-auto px-6 pb-28">
        <div className="flex items-end justify-between mb-2 border-t-2 border-[#0a0a0a] pt-4">
          <h2 className="font-display text-2xl font-bold tracking-tight">The concepts</h2>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#0a0a0a]/50">{SHOWN.length} of 13 · more soon</span>
        </div>
        <div>
          {SHOWN.map((c, i) => {
            const accent = accentFor(c.id)
            const steps = conceptSteps[c.id]?.length ?? 0
            return (
              <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: Math.min(i, 7) * 0.04 }}>
                <Link href={`/learn/${c.id}`} className="group relative block border-b border-[#0a0a0a]/15 overflow-hidden">
                  <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out" style={{ background: accent }} />
                  <div className="relative flex items-center gap-5 sm:gap-8 py-6 px-2 transition-colors duration-300 group-hover:text-white">
                    <span className="font-mono text-sm tabular-nums w-8 shrink-0 text-[#0a0a0a]/40 group-hover:text-white/70 transition-colors">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-2xl sm:text-[2rem] font-semibold tracking-tight shrink-0 min-w-0">{c.title}</h3>
                    <p className="hidden md:block flex-1 text-[15px] text-[#0a0a0a]/55 group-hover:text-white/80 transition-colors line-clamp-1">{c.description}</p>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0a0a0a]/40 group-hover:text-white/70 transition-colors hidden sm:inline whitespace-nowrap">{levelOf(c.tags)} · {steps} steps</span>
                    <span className="text-2xl shrink-0 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
        <p className="mt-12 font-mono text-[11px] tracking-[0.2em] uppercase text-[#0a0a0a]/30">preview · editorial</p>
      </main>
    </div>
  )
}
