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
      speak(caption, () => {
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
  }, [isPlaying, index, voice, caption, steps.length])

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
        <div className="relative flex-1 bg-dots flex items-center justify-center p-4 sm:p-10 min-h-[440px]">
          {/* step counter */}
          {started && (
            <span className="absolute top-4 right-5 text-xs font-mono text-ink-faint">
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
            <div className="w-full h-full max-w-4xl flex items-center justify-center">
              <DiagramCanvas state={diagramState} />
            </div>
          )}

          {/* in-canvas caption (subtitle) */}
          {started && (
            <div className="absolute inset-x-0 bottom-5 flex justify-center px-4 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="max-w-2xl bg-paper-2/95 backdrop-blur-sm border border-line rounded-2xl px-5 py-3.5 shadow-[0_8px_28px_-12px_rgba(35,39,47,0.3)]"
                >
                  <p className="font-display text-[17px] leading-relaxed text-ink text-center text-balance">
                    {caption}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

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
