"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { concepts } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"

const ACCENT: Record<string, string> = {
  bridge: "#D97706",
  jsi: "#8B5CF6",
  lifecycle: "#059669",
  usestate: "#4F46E5",
  useeffect: "#3B82F6",
  flatlist: "#0891B2",
  hermes: "#DC2626",
  metro: "#F59E0B",
  navigation: "#0D9488",
  animated: "#DB2777",
}

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

// tiny node-graph glyph — signals "this is a diagram"
function Glyph({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7.5 12 L16.5 6.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 12 L16.5 17.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6" cy="12" r="3.2" fill={color} />
      <circle cx="18" cy="6" r="2.6" fill={color} fillOpacity="0.55" />
      <circle cx="18" cy="18" r="2.6" fill={color} fillOpacity="0.55" />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
            <span className="text-white text-sm font-display font-bold">↦</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">unbridged</span>
        </div>
        <a href="https://github.com/sakshya73" className="text-sm text-ink-soft hover:text-ink transition-colors">
          github
        </a>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-20 pb-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-ink-soft mb-5 font-mono">React Native, visually</p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl">
            Stop memorizing.
            <br />
            <span className="ink-underline">Actually see</span> how it works.
          </h1>
          <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
            Pick a concept. Watch it drawn out step by step — the Bridge, JSI, Fabric,
            Hermes, the things interviews actually ask about.
          </p>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((concept, i) => {
            const accent = ACCENT[concept.id] ?? "#4F46E5"
            const level = levelOf(concept.tags)
            const stepCount = conceptSteps[concept.id]?.length ?? 0
            return (
              <motion.div
                key={concept.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.04 * i }}
              >
                <Link href={`/learn/${concept.id}`} className="group block h-full">
                  <div className="h-full bg-paper-2 rounded-2xl border border-line p-5 flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:border-line-strong group-hover:shadow-[0_14px_34px_-14px_rgba(35,39,47,0.22)]">
                    {/* top row: glyph + level */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                        style={{ background: `${accent}14` }}
                      >
                        <Glyph color={accent} />
                      </div>
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                        style={{ color: level.color, background: `${level.color}14` }}
                      >
                        {level.label}
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-semibold leading-snug tracking-tight">
                      {concept.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-ink-soft leading-relaxed line-clamp-2">
                      {concept.description}
                    </p>

                    {/* footer */}
                    <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                      <span className="text-xs font-mono text-ink-faint flex items-center gap-1.5">
                        <span style={{ color: accent }}>▷</span> {stepCount} steps
                      </span>
                      <span
                        className="text-sm transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: accent }}
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 pb-12 text-sm text-ink-faint">
        Built for developers who want to understand, not just ship.
      </footer>
    </div>
  )
}
