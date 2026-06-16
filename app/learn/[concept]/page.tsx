"use client"

import { use, useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { getConcept } from "@/lib/concepts"
import { conceptSteps } from "@/lib/data"
import { Step, DiagramState } from "@/lib/types"
import { speak, stopSpeaking, voiceSupported, warmVoices } from "@/lib/speech"
import DiagramCanvas from "@/components/DiagramCanvas"
import CodePanel from "@/components/CodePanel"
import { getPlayground } from "@/components/playgrounds"

interface Props {
  params: Promise<{ concept: string }>
}

function dwellFor(text: string) {
  return Math.min(7000, Math.max(2800, 1500 + text.length * 34))
}

export default function LearnPage({ params }: Props) {
  const { concept: conceptId } = use(params)
  const router = useRouter()
  const concept = getConcept(conceptId)
  const steps: Step[] = conceptSteps[conceptId] ?? []
  const Playground = getPlayground(conceptId)

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [voice, setVoice] = useState(true)
  const [mode, setMode] = useState<"walk" | "play">("walk")
  const speakSeq = useRef(0)

  const current = steps[index]
  const diagramState: DiagramState | null = current?.diagram_state ?? null
  const caption = current?.caption ?? current?.narration ?? ""
  const speakText = current?.narration ?? caption // clean prose for the voice; caption may hold code symbols
  const stepNotes = current?.notes ?? (current?.note ? [current.note] : [])
  const atEnd = index >= steps.length - 1

  // warm up the browser voice list once
  useEffect(() => warmVoices(), [])
  // stop any speech when leaving the page
  useEffect(() => () => stopSpeaking(), [])

  // Advance loop: voice-driven when enabled (advance when narration finishes),
  // otherwise a reading-paced timer.
  useEffect(() => {
    if (!isPlaying) return
    const last = index >= steps.length - 1
    let done = false
    const advance = () => {
      if (done) return
      done = true
      setIndex((i) => (i < steps.length - 1 ? i + 1 : i))
      if (last) setIsPlaying(false)
    }

    if (voice && voiceSupported()) {
      const seq = ++speakSeq.current
      const startedAt = Date.now()
      const MIN_MS = 1600 // never blow past a step faster than this
      const MAX_MS = 13000 // …but never stall if onend never fires
      speak(speakText, () => {
        if (seq !== speakSeq.current) return
        const wait = Math.max(0, MIN_MS - (Date.now() - startedAt))
        window.setTimeout(() => {
          if (seq === speakSeq.current) advance()
        }, wait)
      })
      const maxFallback = window.setTimeout(advance, MAX_MS)
      return () => {
        speakSeq.current++
        window.clearTimeout(maxFallback)
        stopSpeaking()
      }
    }

    const t = window.setTimeout(advance, dwellFor(caption))
    return () => window.clearTimeout(t)
  }, [isPlaying, index, voice, caption, speakText, steps.length])

  const play = useCallback(() => {
    if (!started) setStarted(true)
    if (atEnd) setIndex(0)
    setIsPlaying(true)
  }, [started, atEnd])

  const goTo = (i: number) => {
    setIsPlaying(false)
    setStarted(true)
    setIndex(Math.max(0, Math.min(i, steps.length - 1)))
  }

  // keyboard navigation (walkthrough only): ← / → step, space play-pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode === "play") return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "ArrowRight") {
        e.preventDefault()
        if (!started) setStarted(true)
        else goTo(index + 1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        if (started) goTo(index - 1)
      } else if (e.key === " ") {
        e.preventDefault()
        if (isPlaying) setIsPlaying(false)
        else play()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, started, index, steps.length, isPlaying, play])

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-soft mb-4">Concept not found</p>
          <Link href="/" className="text-accent underline">go home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-line bg-paper-2 z-10">
        <button onClick={() => router.push("/")} className="text-sm text-ink-soft hover:text-ink transition-colors">
          ← all concepts
        </button>
        <h1 className="font-display text-base font-semibold tracking-tight">{concept.title}</h1>
        {Playground ? (
          <div className="flex items-center gap-0.5 bg-ink/[0.05] rounded-lg p-0.5 text-sm">
            <button
              onClick={() => setMode("walk")}
              className={`px-3 py-1 rounded-md transition-all ${mode === "walk" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
              Walkthrough
            </button>
            <button
              onClick={() => {
                setIsPlaying(false)
                stopSpeaking()
                setMode("play")
              }}
              className={`px-3 py-1 rounded-md transition-all ${mode === "play" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
              ✦ Playground
            </button>
          </div>
        ) : (
          <div className="w-24 hidden sm:block" />
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {mode === "play" && Playground ? (
          <div className="flex-1 flex flex-col bg-dots">
            <Playground />
          </div>
        ) : (
        <>
        <div className="relative flex-1 bg-dots flex items-center justify-center p-4 sm:p-10 min-h-[300px]">
          {/* step counter */}
          {started && (
            <span className="absolute top-4 right-5 text-xs font-mono text-ink-faint flex items-center gap-2.5">
              <span className="hidden sm:inline opacity-60">← → to step</span>
              {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
          )}

          {!started ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 max-w-lg px-4"
            >
              <div className="w-full bg-paper-2 border border-line rounded-2xl p-5 text-left shadow-[0_10px_30px_-16px_rgba(35,39,47,0.3)]">
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-faint mb-2">
                  Think of it like
                </p>
                <p className="font-display text-[17px] leading-relaxed text-ink">{concept.analogy}</p>
                <div className="mt-4 pt-4 border-t border-line">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-ink-faint mb-1.5">
                    You&apos;ll hit this when
                  </p>
                  <p className="text-sm text-ink-soft leading-relaxed">{concept.scenario}</p>
                </div>
              </div>
              <motion.button
                onClick={play}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl text-white text-sm font-semibold flex items-center gap-2 shadow-[0_4px_14px_-4px_rgba(20,158,202,0.5)]"
                style={{ background: "var(--accent)" }}
              >
                ▶ Watch it explained · {steps.length} steps
              </motion.button>
            </motion.div>
          ) : (
            <div className="w-full h-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-5">
              {concept.code && (
                <div className="w-full lg:w-[330px] shrink-0">
                  <CodePanel
                    code={concept.code}
                    filename={concept.codeFile}
                    activeLines={current?.codeLines ?? []}
                  />
                </div>
              )}
              <div className="flex-1 w-full flex items-center justify-center">
                <DiagramCanvas state={diagramState} />
              </div>
            </div>
          )}

        </div>

        {/* caption + notes panel — fixed height + normal flow, so it never
            overlaps the diagram and the diagram never rescales between steps */}
        {started && (
          <div className="border-t border-line bg-paper-2 px-6 h-[164px] flex items-center overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl mx-auto flex flex-col gap-2.5"
              >
                <p className="font-display text-[17px] leading-relaxed text-ink text-center text-balance">
                  {caption}
                </p>
                {stepNotes.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {stepNotes.map((n, ni) => (
                      <div key={ni} className="flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                          {n.label}
                        </span>
                        <p className="text-[13px] text-ink-soft leading-relaxed mt-0.5">
                          {n.term && <span className="font-semibold text-ink">{n.term}</span>}
                          {n.term && " — "}
                          {n.text}
                          {n.link && (
                            <>
                              {" "}
                              <Link
                                href={n.link.href}
                                className="font-medium whitespace-nowrap hover:underline"
                                style={{ color: "var(--accent)" }}
                              >
                                {n.link.label} →
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* control bar */}
        <div className="border-t border-line bg-paper-2 px-6 py-3.5 flex items-center justify-between gap-4">
          {/* voice / prev / restart */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoice((v) => !v)}
              className="w-9 h-9 rounded-lg text-ink-soft hover:text-ink hover:bg-ink/5 transition-all flex items-center justify-center"
              title={voice ? "mute narration" : "unmute narration"}
              style={voice ? { color: "var(--accent)" } : undefined}
            >
              {voice ? "🔊" : "🔇"}
            </button>
            <button
              onClick={() => goTo(0)}
              disabled={!started}
              className="w-9 h-9 rounded-lg text-ink-soft hover:text-ink hover:bg-ink/5 disabled:opacity-30 transition-all flex items-center justify-center"
              title="restart"
            >
              ↺
            </button>
            <button
              onClick={() => goTo(index - 1)}
              disabled={!started || index <= 0}
              className="w-9 h-9 rounded-lg text-ink-soft hover:text-ink hover:bg-ink/5 disabled:opacity-30 transition-all flex items-center justify-center"
            >
              ←
            </button>
          </div>

          {/* progress dots */}
          <div className="flex-1 flex gap-1.5 max-w-md mx-auto">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="h-1.5 rounded-full transition-all duration-300 flex-1"
                style={{
                  background: started && i <= index ? "var(--accent)" : "var(--line-strong)",
                }}
              />
            ))}
          </div>

          {/* next + play */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(index + 1)}
              disabled={started && index >= steps.length - 1}
              className="w-9 h-9 rounded-lg text-ink-soft hover:text-ink hover:bg-ink/5 disabled:opacity-30 transition-all flex items-center justify-center"
            >
              →
            </button>
            <button
              onClick={isPlaying ? () => setIsPlaying(false) : play}
              disabled={steps.length === 0}
              className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-30 hover:opacity-90 flex items-center gap-2 shadow-[0_4px_14px_-4px_rgba(20,158,202,0.5)]"
              style={{ background: "var(--accent)" }}
            >
              {isPlaying ? "❙❙ pause" : atEnd && started ? "↺ replay" : started ? "▶ resume" : "▶ play"}
            </button>
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  )
}
