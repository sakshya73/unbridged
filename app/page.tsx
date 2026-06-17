"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { concepts } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"
import { accentFor } from "@/lib/accents"
import { getPlayground } from "@/components/playgrounds"
import type { ConceptConfig } from "@/lib/types"

// Drafts (no `published` flag) only ever surface in local dev, so the live
// site keeps showing finished concepts only.
const SHOW_DRAFTS = process.env.NODE_ENV === "development"

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

// The brand mark: a React atom. Used white in the logo/footer and in the
// concept accent on the cards — one drawing, so they never drift apart.
function NodeMark({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
        <ellipse cx="12" cy="12" rx="10" ry="3.85" />
        <ellipse cx="12" cy="12" rx="10" ry="3.85" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.85" transform="rotate(-60 12 12)" />
      </g>
      <circle cx="12" cy="12" r="1.9" fill={color} />
    </svg>
  )
}

// A distinct little glyph per concept so cards are scannable at a glance.
// Falls back to the atom for concepts that don't have a custom one yet.
function ConceptGlyph({ id, color, size = 22 }: { id: string; color: string; size?: number }) {
  const p = { stroke: color, strokeWidth: 1.9, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  if (id === "bridge") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 17 Q12 7 20 17" {...p} />
        <path d="M4 17v3M20 17v3M12 12v8" {...p} />
      </svg>
    )
  }
  if (id === "threads") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 8h16M4 12h16M4 16h16" {...p} />
      </svg>
    )
  }
  if (id === "jsi") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="9" width="5" height="6" rx="1.4" {...p} />
        <rect x="16" y="9" width="5" height="6" rx="1.4" {...p} />
        <path d="M9.4 12h5.2M12.7 10.2 14.8 12 12.7 13.8M11.3 10.2 9.2 12 11.3 13.8" {...p} />
      </svg>
    )
  }
  return <NodeMark color={color} size={size} />
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

// The hero signature: a small live readout of the runtime. The JS thread (the
// React atom) dispatches work to the UI, shadow, and native subsystems; a packet
// glides out along each edge on a calm, staggered loop. One orchestrated moment,
// deliberately restrained — the rest of the page stays quiet.
const HERO_NODES = [
  { id: "ui", x: 288, y: 64, color: "#0891B2", label: "UI THREAD" },
  { id: "shadow", x: 288, y: 138, color: "#7C3AED", label: "SHADOW" },
  { id: "native", x: 288, y: 212, color: "#D97706", label: "NATIVE" },
]
const labelStyle = { fontFamily: "var(--font-mono), monospace", letterSpacing: "1.5px" } as const

function HeroGraph() {
  const atom = { x: 92, y: 138 }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
      className="relative rounded-2xl border border-line bg-paper-2 shadow-instrument overflow-hidden"
    >
      {/* instrument header bar */}
      <div className="flex items-center justify-between px-4 h-9 border-b border-line">
        <span className="mono-label text-ink-faint">runtime</span>
        <span className="mono-label inline-flex items-center gap-1.5 text-ink-faint">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-70 motion-safe:animate-ping bg-[#16a34a]" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
          </span>
          live
        </span>
      </div>

      {/* instrument body — blueprint grid + a soft accent glow under the atom */}
      <div className="relative bg-grid">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(420px 190px at 26% 52%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 72%)" }} />
        <svg viewBox="0 0 360 276" className="relative w-full">
          {HERO_NODES.map((n) => (
            <line key={`e-${n.id}`} x1={atom.x} y1={atom.y} x2={n.x} y2={n.y} stroke="var(--line-strong)" strokeWidth="1.4" />
          ))}

          {HERO_NODES.map((n, i) => (
            <motion.circle
              key={`p-${n.id}`}
              r="3.6"
              fill={n.color}
              initial={{ cx: atom.x, cy: atom.y, opacity: 0 }}
              animate={{ cx: [atom.x, n.x], cy: [atom.y, n.y], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.3, repeat: Infinity, repeatDelay: 1.3, ease: "easeInOut", delay: i * 0.7 }}
            />
          ))}

          {HERO_NODES.map((n) => (
            <g key={`n-${n.id}`}>
              <motion.circle
                cx={n.x} cy={n.y} r="11" fill={n.color}
                animate={{ opacity: [0.62, 0.95, 0.62] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <text x={n.x - 18} y={n.y + 3.5} textAnchor="end" fontSize="9.5" fill="var(--ink-soft)" style={labelStyle}>{n.label}</text>
            </g>
          ))}

          {/* the React atom = the JS thread driving it all */}
          <g transform={`translate(${atom.x} ${atom.y})`}>
            <circle r="30" fill="none" stroke="var(--accent)" strokeOpacity="0.15" strokeWidth="11" />
            <g stroke="var(--accent)" strokeWidth="2" fill="none">
              <ellipse rx="30" ry="11.5" />
              <ellipse rx="30" ry="11.5" transform="rotate(60)" />
              <ellipse rx="30" ry="11.5" transform="rotate(-60)" />
            </g>
            <circle r="6" fill="var(--accent)" />
          </g>
          <text x={atom.x} y={atom.y + 50} textAnchor="middle" fontSize="9.5" fill="var(--ink-soft)" style={labelStyle}>JS · REACT</text>
        </svg>
      </div>
    </motion.div>
  )
}

function ConceptCard({ concept, i, draft = false }: { concept: ConceptConfig; i: number; draft?: boolean }) {
  const accent = accentFor(concept.id)
  const level = levelOf(concept.tags)
  const stepCount = conceptSteps[concept.id]?.length ?? 0
  const interactive = getPlayground(concept.id) !== null
  return (
    <motion.div
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
                <ConceptGlyph id={concept.id} color={accent} size={22} />
              </div>
              <div className="flex items-center gap-1.5">
                {draft && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: "#D97706" }}>
                    draft
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
            <span className="mono-label text-ink-faint">{stepCount} steps</span>
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
}

export default function Home() {
  const published = concepts.filter((c) => c.published)
  const drafts = SHOW_DRAFTS ? concepts.filter((c) => !c.published) : []

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <NodeMark color="#fff" size={16} />
            </div>
            <span className="font-display text-[15px] sm:text-base font-bold tracking-tight">How React Native Works</span>
          </div>
          <a
            href="https://github.com/sakshya73"
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink px-2.5 sm:px-3 py-1.5 rounded-lg border border-transparent hover:bg-paper-2 hover:border-line transition-colors shrink-0"
          >
            <GitHubIcon />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-12 lg:gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="mono-label inline-flex items-center gap-2.5 text-ink-soft mb-7">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping" style={{ background: "var(--accent)" }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              </span>
              React Native · under the hood
            </p>
            <h1 className="font-display text-[3rem] sm:text-[4rem] lg:text-[4.25rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink-strong text-balance">
              Stop memorizing.
              <br />
              <span className="ink-underline">Actually see</span> how it works.
            </h1>
            <p className="mt-7 text-[1.0625rem] sm:text-lg text-ink-soft max-w-md leading-[1.7]">
              Pick a concept. Watch it drawn out step by step — the Bridge, JSI, Fabric,
              Hermes, the things interviews actually ask about.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
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
          <h2 className="mono-label text-ink-soft">Concepts</h2>
          <span className="mono-label text-ink-faint">{published.length} live · more soon</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 auto-rows-fr">
          {published.map((concept, i) => (
            <ConceptCard key={concept.id} concept={concept} i={i} />
          ))}
        </div>

        {drafts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-7">
              <h2 className="font-mono text-sm text-ink-faint uppercase tracking-[0.12em] inline-flex items-center gap-2">
                In review
                <span className="text-[10px] px-2 py-0.5 rounded-full text-white normal-case tracking-normal" style={{ background: "#D97706" }}>
                  local only
                </span>
              </h2>
              <span className="text-sm text-ink-faint">{drafts.length} drafts · not on the live site</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 auto-rows-fr">
              {drafts.map((concept, i) => (
                <ConceptCard key={concept.id} concept={concept} i={i} draft />
              ))}
            </div>
          </section>
        )}
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
