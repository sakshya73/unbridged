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
import { accentFor } from "@/lib/accents"

const EASE = [0.22, 1, 0.36, 1] as const

// Blueprint chrome: ink hairlines + a faint graph-paper drawing surface. Each
// lesson is "drawn" in its own concept accent (accentFor), the home's part-color.
const INK = "#1b2433"
const GRIDBG = {
  backgroundColor: "#fbfcfd",
  backgroundImage:
    "linear-gradient(rgba(27,36,51,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,36,51,0.06) 1px,transparent 1px)",
  backgroundSize: "22px 22px",
} as const

interface Props {
  params: Promise<{ concept: string }>
}

function dwellFor(text: string) {
  return Math.min(7000, Math.max(2800, 1500 + text.length * 34))
}

// Rough upper bound on how long the narration takes to speak, used only as a
// safety fallback so a slow step never stalls — the real signal is speech onEnd.
function estimateSpeechMs(text: string) {
  return Math.max(3000, (text.length / 12) * 1000)
}

export default function LearnPage({ params }: Props) {
  const { concept: conceptId } = use(params)
  const router = useRouter()
  const concept = getConcept(conceptId)
  const accent = accentFor(conceptId)
  const steps: Step[] = conceptSteps[conceptId] ?? []
  const Playground = getPlayground(conceptId)

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [voice, setVoice] = useState(true)
  const [mode, setMode] = useState<"walk" | "play">("walk")
  const speakSeq = useRef(0)
  const prevIndexRef = useRef(0)
  const prevPlayingRef = useRef(false)

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

  // Narrate + advance. Speech is tied to the STEP, not just auto-play: landing
  // on a step speaks it (so the arrow keys narrate too). Auto-advance only
  // happens while playing, and waits for the narration to actually finish.
  useEffect(() => {
    if (mode === "play" || !started) {
      prevIndexRef.current = index
      prevPlayingRef.current = isPlaying
      return
    }

    const indexChanged = prevIndexRef.current !== index
    const justPaused = prevPlayingRef.current && !isPlaying
    prevIndexRef.current = index
    prevPlayingRef.current = isPlaying

    // A bare pause (no step change): stop talking, don't re-narrate the step.
    if (justPaused && !indexChanged) {
      stopSpeaking()
      return
    }

    const last = index >= steps.length - 1
    let done = false
    const advance = () => {
      if (done) return
      done = true
      if (last) setIsPlaying(false)
      else setIndex((i) => Math.min(i + 1, steps.length - 1))
    }

    if (voice && voiceSupported()) {
      const seq = ++speakSeq.current
      const startedAt = Date.now()
      const MIN_MS = 1200
      let maxFallback: number | undefined
      speak(speakText, () => {
        if (seq !== speakSeq.current) return
        if (maxFallback) window.clearTimeout(maxFallback)
        if (!isPlaying) return // arrived via the arrows: narrate once, don't advance
        const wait = Math.max(0, MIN_MS - (Date.now() - startedAt))
        window.setTimeout(() => {
          if (seq === speakSeq.current) advance()
        }, wait)
      })
      // safety net only while playing, sized to the narration so it never cuts it off
      if (isPlaying) maxFallback = window.setTimeout(advance, estimateSpeechMs(speakText) + 8000)
      return () => {
        speakSeq.current++
        if (maxFallback) window.clearTimeout(maxFallback)
        stopSpeaking()
      }
    }

    // voice off: a reading-paced timer drives auto-play; manual nav just sits
    if (isPlaying) {
      const t = window.setTimeout(advance, dwellFor(caption))
      return () => window.clearTimeout(t)
    }
  }, [isPlaying, index, voice, caption, speakText, steps.length, mode, started])

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
      <header className="flex items-center justify-between gap-3 px-4 sm:px-6 h-14 border-b-2 bg-white z-10" style={{ borderColor: INK }}>
        <button onClick={() => router.push("/")} className="font-mono text-[11px] tracking-[0.14em] uppercase hover:opacity-60 transition-opacity shrink-0 whitespace-nowrap" style={{ color: "rgba(27,36,51,0.7)" }}>
          ←<span className="hidden sm:inline"> index</span>
        </button>
        <div className="hidden sm:flex items-baseline gap-2.5 min-w-0">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase shrink-0" style={{ color: accent }}>RN · {conceptId}</span>
          <h1 className="min-w-0 truncate font-display text-[15px] font-semibold tracking-tight" style={{ color: INK }}>{concept.title}</h1>
        </div>
        {Playground ? (
          <div className="flex items-center font-mono text-[11px] uppercase tracking-[0.1em] border-2 rounded-sm overflow-hidden shrink-0" style={{ borderColor: INK }}>
            <button onClick={() => setMode("walk")} className="px-2.5 py-1 transition-colors" style={mode === "walk" ? { background: INK, color: "white" } : { color: "rgba(27,36,51,0.6)" }}>
              walk
            </button>
            <button
              onClick={() => { setIsPlaying(false); stopSpeaking(); setMode("play") }}
              className="px-2.5 py-1 transition-colors border-l-2"
              style={{ borderColor: INK, ...(mode === "play" ? { background: INK, color: "white" } : { color: "rgba(27,36,51,0.6)" }) }}
            >
              play ✦
            </button>
          </div>
        ) : (
          <div className="w-16 hidden sm:block" />
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {mode === "play" && Playground ? (
          <div className="flex-1 flex flex-col" style={GRIDBG}>
            <Playground accent={accent} />
          </div>
        ) : (
        <>
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-10 min-h-[300px]" style={GRIDBG}>
          {/* step counter — drawing readout */}
          {started && (
            <span className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2.5 border px-2 py-0.5 rounded-sm bg-white/70" style={{ borderColor: "rgba(27,36,51,0.25)", color: "rgba(27,36,51,0.6)" }}>
              <span className="hidden sm:inline opacity-70">← → step</span>
              {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
          )}

          {!started ? (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } } }}
              className="relative flex flex-col items-center gap-7 max-w-xl px-4"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                className="relative w-full bg-white border-2 rounded-sm text-left"
                style={{ borderColor: INK, boxShadow: `7px 7px 0 0 ${accent}` }}
              >
                <span className="absolute -top-[3px] -left-[3px] w-2 h-2 border-l-2 border-t-2" style={{ borderColor: accent }} />
                <span className="absolute -bottom-[3px] -right-[3px] w-2 h-2 border-r-2 border-b-2" style={{ borderColor: accent }} />
                {/* title block */}
                <div className="flex items-stretch border-b-2 font-mono text-[10px] tracking-[0.13em] uppercase" style={{ borderColor: INK, color: "rgba(27,36,51,0.7)" }}>
                  <div className="px-3 py-1.5 border-r-2 font-medium" style={{ borderColor: INK, color: accent }}>RN · {conceptId}</div>
                  <div className="px-3 py-1.5 border-r-2 hidden sm:block" style={{ borderColor: INK }}>{concept.tags.includes("advanced") ? "ADV" : concept.tags.includes("beginner") ? "BEG" : "INT"}</div>
                  <div className="px-3 py-1.5 ml-auto">{steps.length} steps</div>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase mb-3 inline-flex items-center gap-1.5" style={{ color: accent }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} /> think of it like
                  </p>
                  <p className="font-display text-[21px] sm:text-[22px] leading-[1.42] tracking-tight text-balance" style={{ color: INK }}>
                    {concept.analogy}
                  </p>
                  <div className="mt-5 pt-5 border-t" style={{ borderColor: "rgba(27,36,51,0.14)" }}>
                    <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase mb-2" style={{ color: "rgba(27,36,51,0.5)" }}>you&apos;ll hit this when</p>
                    <p className="text-[14.5px] leading-relaxed" style={{ color: "rgba(27,36,51,0.7)" }}>{concept.scenario}</p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                onClick={play}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="group inline-flex items-center gap-3 pl-5 pr-3 py-3 rounded-sm text-white text-[15px] font-semibold"
                style={{ background: INK, boxShadow: `4px 4px 0 0 ${accent}` }}
              >
                <svg width="13" height="13" viewBox="0 0 12 14" fill="currentColor" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M0 1.2v11.6a1 1 0 0 0 1.5.87l9.3-5.8a1 1 0 0 0 0-1.74L1.5.33A1 1 0 0 0 0 1.2Z" />
                </svg>
                Watch it explained
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm" style={{ background: accent }}>{steps.length} steps</span>
              </motion.button>
            </motion.div>
          ) : (
            <div className="w-full h-full max-w-5xl flex flex-col-reverse lg:flex-row items-center justify-center gap-4 lg:gap-5">
              {concept.code && (
                <div className="w-full lg:w-[330px] shrink-0 max-h-[34vh] overflow-auto lg:max-h-none lg:overflow-visible">
                  <CodePanel
                    code={concept.code}
                    filename={concept.codeFile}
                    activeLines={current?.codeLines ?? []}
                    accent={accent}
                  />
                </div>
              )}
              <div className="flex-1 w-full flex items-center justify-center">
                <DiagramCanvas state={diagramState} />
              </div>
            </div>
          )}

        </div>

        {/* caption + notes panel — a calm strip below the diagram. min-height
            floors it so the diagram barely shifts between steps, and it grows to
            fit long notes instead of clipping them over the seam. */}
        {started && (
          <div className="border-t-2 bg-white px-5 sm:px-6 h-[172px] sm:h-[208px] overflow-y-auto" style={{ borderColor: INK }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl mx-auto min-h-full flex flex-col justify-center gap-4 py-4"
              >
                <p className="font-display text-[17px] leading-relaxed text-center text-balance" style={{ color: INK }}>
                  {caption}
                </p>
                {stepNotes.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-x-9 gap-y-4">
                    {stepNotes.map((n, ni) => (
                      <div key={ni} className="flex-1 border-l-2 pl-4" style={{ borderColor: accent }}>
                        <span className="text-[10px] font-mono uppercase tracking-[0.14em]" style={{ color: accent }}>
                          {n.label}
                        </span>
                        <p className="text-[12.5px] leading-relaxed mt-1" style={{ color: "rgba(27,36,51,0.68)" }}>
                          {n.term && <span className="font-semibold" style={{ color: INK }}>{n.term}</span>}
                          {n.term && " — "}
                          {n.text}
                          {n.link && (
                            <>
                              {" "}
                              <Link href={n.link.href} className="font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>
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

        {/* control bar — the sheet's instrument strip */}
        <div className="border-t-2 bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4" style={{ borderColor: INK }}>
          {/* voice / restart / prev */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setVoice((v) => !v)}
              className="w-9 h-9 rounded-sm border text-ink-soft hover:bg-ink/[0.04] transition-all flex items-center justify-center"
              title={voice ? "mute narration" : "unmute narration"}
              style={voice ? { color: accent, borderColor: accent } : { borderColor: "rgba(27,36,51,0.2)" }}
            >
              {voice ? "🔊" : "🔇"}
            </button>
            <button
              onClick={() => goTo(0)}
              disabled={!started}
              className="w-9 h-9 rounded-sm border border-[rgba(27,36,51,0.2)] text-ink-soft hover:bg-ink/[0.04] disabled:opacity-30 transition-all flex items-center justify-center"
              title="restart"
            >
              ↺
            </button>
            <button
              onClick={() => goTo(index - 1)}
              disabled={!started || index <= 0}
              className="w-9 h-9 rounded-sm border border-[rgba(27,36,51,0.2)] text-ink-soft hover:bg-ink/[0.04] disabled:opacity-30 transition-all flex items-center justify-center"
            >
              ←
            </button>
          </div>

          {/* progress ticks */}
          <div className="flex-1 flex gap-1 max-w-md mx-auto">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`step ${i + 1}`}
                className="h-1.5 transition-all duration-300 flex-1"
                style={{ background: started && i <= index ? accent : "rgba(27,36,51,0.16)" }}
              />
            ))}
          </div>

          {/* next + play */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goTo(index + 1)}
              disabled={started && index >= steps.length - 1}
              className="w-9 h-9 rounded-sm border border-[rgba(27,36,51,0.2)] text-ink-soft hover:bg-ink/[0.04] disabled:opacity-30 transition-all flex items-center justify-center"
            >
              →
            </button>
            <button
              onClick={isPlaying ? () => setIsPlaying(false) : play}
              disabled={steps.length === 0}
              className="px-4 py-2 rounded-sm text-white text-[13px] font-semibold font-mono tracking-wide transition-transform hover:-translate-y-0.5 disabled:opacity-30 flex items-center gap-2"
              style={{ background: accent, boxShadow: `3px 3px 0 0 ${INK}` }}
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
