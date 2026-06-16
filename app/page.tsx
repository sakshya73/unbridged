"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { concepts } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"
import { accentFor } from "@/lib/accents"
import { getPlayground } from "@/components/playgrounds"

const EASE = [0.22, 1, 0.36, 1] as const

const LEVEL: Record<string, { label: string; color: string }> = {
  beginner: { label: "beginner", color: "#059669" },
  intermediate: { label: "intermediate", color: "#D97706" },
  advanced: { label: "advanced", color: "#DC2626" },
}

function levelOf(tags: string[]) {
  if (tags.includes("advanced")) return LEVEL.advanced
  if (tags.includes("beginner")) return LEVEL.beginner
  return LEVEL.intermediate
}

// The one brand mark: a solid source node wired to two ringed satellites.
// Used white in the logo/footer and in the concept accent on the cards — one
// drawing, so the logo and the card glyph never drift apart.
function NodeMark({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="10" y1="10.3" x2="13.8" y2="8.2" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="10" y1="13.7" x2="13.8" y2="15.8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="7" cy="12" r="3.5" fill={color} />
      <circle cx="17" cy="6.5" r="2.7" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="17" cy="17.5" r="2.7" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

// The single hero motif: one source node, two satellites, a packet gliding
// along each edge. Calm by design — only the packets and a faint breathe move.
function HeroGraph() {
  const src = { x: 64, y: 150 }
  const a = { x: 300, y: 86 }
  const b = { x: 300, y: 214 }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
      className="relative rounded-2xl border border-line bg-paper-2 bg-dots p-6 shadow-[0_20px_50px_-24px_rgba(35,39,47,0.18)] overflow-hidden"
    >
      <svg viewBox="0 0 360 300" className="w-full">
        <line x1={src.x} y1={src.y} x2={a.x} y2={a.y} stroke="var(--line-strong)" strokeWidth="1.4" />
        <line x1={src.x} y1={src.y} x2={b.x} y2={b.y} stroke="var(--line-strong)" strokeWidth="1.4" />

        <motion.circle
          r="3.5"
          fill="var(--accent)"
          initial={{ cx: src.x, cy: src.y }}
          animate={{ cx: [src.x, a.x], cy: [src.y, a.y] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
        />
        <motion.circle
          r="3.5"
          fill="var(--accent)"
          initial={{ cx: src.x, cy: src.y }}
          animate={{ cx: [src.x, b.x], cy: [src.y, b.y] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut", delay: 1.3 }}
        />

        <circle cx={src.x} cy={src.y} r="14" fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="8" />
        <circle cx={src.x} cy={src.y} r="13" fill="var(--accent)" />
        <motion.circle
          cx={a.x} cy={a.y} r="10" fill="#7C3AED"
          animate={{ opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={b.x} cy={b.y} r="10" fill="#059669"
          animate={{ opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
      </svg>
    </motion.div>
  )
}

export default function Home() {
  const published = concepts.filter((c) => c.published)

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-line">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <NodeMark color="#fff" size={16} />
            </div>
            <span className="font-display text-[15px] sm:text-base font-bold tracking-tight">How React Native Works</span>
          </div>
          <a
            href="https://github.com/sakshya73"
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink px-3 py-1.5 rounded-lg border border-transparent hover:bg-paper-2 hover:border-line transition-colors"
          >
            <GitHubIcon /> GitHub
          </a>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-12 lg:gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="inline-flex items-center gap-2 text-xs font-mono text-ink-soft mb-6">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              React Native, visually
            </p>
            <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-[3.5rem] font-bold leading-[1.04] tracking-[-0.03em] text-balance">
              Stop memorizing.
              <br />
              <span className="ink-underline">Actually see</span> how it works.
            </h1>
            <p className="mt-7 text-[1.0625rem] sm:text-lg text-ink-soft max-w-md leading-[1.7]">
              Pick a concept. Watch it drawn out step by step — the Bridge, JSI, Fabric,
              Hermes, the things interviews actually ask about.
            </p>
            <div className="mt-9 flex items-center gap-4">
              <Link
                href="/learn/bridge"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-[0_6px_20px_-8px_rgba(20,158,202,0.55)] transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--accent)" }}
              >
                Start with the Bridge
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <a href="#concepts" className="text-sm text-ink-soft hover:text-ink transition-colors">
                or browse the concepts
              </a>
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <HeroGraph />
          </div>
        </div>
      </header>

      <main id="concepts" className="max-w-5xl mx-auto px-6 pt-4 pb-24 scroll-mt-20">
        <div className="flex items-end justify-between mb-7">
          <h2 className="font-mono text-sm text-ink-faint uppercase tracking-[0.12em]">Concepts</h2>
          <span className="text-sm text-ink-faint">{published.length} live · more coming</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 auto-rows-fr">
          {published.map((concept, i) => {
            const accent = accentFor(concept.id)
            const level = levelOf(concept.tags)
            const stepCount = conceptSteps[concept.id]?.length ?? 0
            const interactive = getPlayground(concept.id) !== null
            return (
              <motion.div
                key={concept.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: Math.min(i, 8) * 0.045, ease: EASE } }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              >
                <Link href={`/learn/${concept.id}`} className="group block h-full">
                  <div
                    className={`relative overflow-hidden rounded-2xl p-5 flex flex-col h-full bg-paper-2 transition-[box-shadow,border-color] duration-300 border ${
                      interactive
                        ? "border-line-strong group-hover:shadow-[0_16px_38px_-16px_var(--card-glow)]"
                        : "border-line group-hover:border-line-strong group-hover:shadow-[0_14px_34px_-14px_var(--card-glow)]"
                    }`}
                    style={{ ["--card-glow" as string]: interactive ? `${accent}59` : "rgba(35,39,47,0.20)" }}
                  >
                    {interactive && (
                      <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: accent, opacity: 0.9 }} />
                    )}

                    <div className={interactive ? "" : "opacity-[0.94] group-hover:opacity-100 transition-opacity"}>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:-rotate-3"
                          style={{ background: `${accent}1A`, boxShadow: `inset 0 0 0 1px ${accent}26` }}
                        >
                          <NodeMark color={accent} size={22} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {interactive && (
                            <span
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded-full inline-flex items-center gap-1"
                              style={{ color: accent, background: `${accent}14`, boxShadow: `inset 0 0 0 1px ${accent}2e` }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                              live
                            </span>
                          )}
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full text-ink-faint bg-line inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: level.color }} />
                            {level.label}
                          </span>
                        </div>
                      </div>

                      <h2 className="font-display text-lg font-semibold leading-snug tracking-tight">{concept.title}</h2>
                      <p className="mt-1.5 text-sm text-ink-soft leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {concept.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-line flex items-center justify-between">
                      <span className="text-xs font-mono text-ink-faint">{stepCount} steps</span>
                      {interactive ? (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm transition-transform duration-300 group-hover:translate-x-0.5"
                          style={{ color: accent, background: `${accent}14` }}
                        >
                          →
                        </span>
                      ) : (
                        <span className="text-sm text-ink-faint group-hover:text-ink-soft transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </main>

      <footer className="border-t border-line mt-8">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--accent)" }}>
                <NodeMark color="#fff" size={14} />
              </div>
              <span className="font-display text-sm font-bold tracking-tight">How React Native Works</span>
            </div>
            <p className="mt-3 text-sm text-ink-faint max-w-xs leading-relaxed">
              Built for developers who want to understand, not just ship.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <a href="https://github.com/sakshya73" className="text-sm text-ink-faint hover:text-accent transition-colors">
              GitHub
            </a>
            <span className="font-mono text-xs text-ink-faint">{published.length} concepts live · more on the way</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
