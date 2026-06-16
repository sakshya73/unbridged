"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DiagramState, DiagramNode } from "@/lib/types"
import DiagramRenderer from "@/components/DiagramRenderer"

const SLIDE_PX = 116

function isPrime(n: number) {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false
  return true
}

export default function ThreadsPlayground() {
  const [jamming, setJamming] = useState(false)
  const [tick, setTick] = useState(0)
  const jsBoxRef = useRef<HTMLDivElement>(null)
  const primesRef = useRef(0)

  // JS heartbeat — a plain setInterval. It can only fire while the JS thread is
  // free, so it freezes solid the moment the thread is jammed. The proof.
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 100)
    return () => window.clearInterval(id)
  }, [])

  // The JS-driven box: a requestAnimationFrame loop on the main thread. When the
  // thread is jammed these callbacks stop firing, so this box freezes. (The other
  // box is driven by a CSS transform animation on the compositor thread, which
  // keeps gliding through a main-thread block — the browser's useNativeDriver.)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const t = (performance.now() / 1500) % 2
      const phase = t < 1 ? t : 2 - t // triangle wave 0 → 1 → 0
      if (jsBoxRef.current) jsBoxRef.current.style.transform = `translateX(${phase * SLIDE_PX}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const jam = useCallback(() => {
    if (jamming) return
    setJamming(true)
    // Paint the jammed (red) state first, THEN block the thread for real —
    // otherwise the freeze hits before the UI can show it's frozen.
    window.setTimeout(() => {
      const end = performance.now() + 2000
      let n = 2
      let hits = 0
      while (performance.now() < end) {
        if (isPrime(n)) hits++
        n++
      }
      primesRef.current = hits
      setJamming(false)
    }, 60)
  }, [jamming])

  const reset = () => {
    setJamming(false)
    setTick(0)
  }

  // ---- diagram: the two threads the boxes live on ----
  const js: DiagramNode = {
    id: "js",
    label: jamming ? "JS Thread\n(jammed)" : "JS Thread\nyour code",
    x: 60,
    y: 150,
    width: 200,
    height: 120,
    style: "box",
    color: jamming ? "#DC2626" : "#4F46E5",
  }
  const main: DiagramNode = {
    id: "main",
    label: "Main / UI Thread\npaints every frame",
    x: 540,
    y: 150,
    width: 200,
    height: 120,
    style: "box",
    color: "#059669",
  }
  const state: DiagramState = {
    nodes: [js, main],
    edges: [],
    highlighted: jamming ? ["main"] : ["js", "main"],
    annotations: [
      jamming
        ? { id: "a", text: "JS is jammed — but the Main thread keeps painting", x: 400, y: 320, color: "#DC2626" }
        : { id: "a", text: "each box is driven by one of these threads", x: 400, y: 320, color: "#545b66" },
    ],
  }

  const Track = ({ which }: { which: "native" | "js" }) => {
    const isNative = which === "native"
    const accent = isNative ? "#059669" : "#4F46E5"
    const frozen = jamming && !isNative
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] font-medium text-ink">{isNative ? "Native driver" : "JS driver"}</span>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
            style={
              frozen
                ? { color: "#DC2626", background: "rgba(220,38,38,0.1)" }
                : { color: accent, background: `${accent}1a` }
            }
          >
            {frozen ? "frozen" : isNative ? "Main thread" : "JS thread"}
          </span>
        </div>
        <div className="relative h-11 rounded-xl bg-paper-2 border border-line overflow-hidden">
          <div
            ref={isNative ? undefined : jsBoxRef}
            className={`absolute top-1.5 left-1.5 w-8 h-8 rounded-lg transition-colors ${
              isNative ? "thread-slide-native" : ""
            }`}
            style={
              {
                background: frozen ? "#DC2626" : accent,
                "--slide-distance": `${SLIDE_PX}px`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* diagram */}
          <div className="relative flex-1 w-full max-w-xl">
            <DiagramRenderer state={state} viewBox="20 150 760 210" />
          </div>

          {/* phone */}
          <div className="shrink-0">
            <div className="relative w-[230px] h-[400px] rounded-[32px] bg-ink p-2.5 shadow-[0_20px_50px_-18px_rgba(35,39,47,0.45)]">
              <div className="relative w-full h-full rounded-[26px] bg-paper overflow-hidden flex flex-col">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-ink rounded-full z-10" />
                <div className="pt-7 pb-2 text-center border-b border-line bg-paper-2">
                  <p className="font-semibold text-sm">My App</p>
                </div>

                <div className="flex-1 p-4 flex flex-col gap-4">
                  {/* JS heartbeat — proof the JS thread is (or isn't) free */}
                  <div className="rounded-xl border border-line bg-paper-2 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-ink-soft">JS heartbeat</span>
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                        style={
                          jamming
                            ? { color: "#DC2626", background: "rgba(220,38,38,0.1)" }
                            : { color: "#4F46E5", background: "rgba(79,70,229,0.1)" }
                        }
                      >
                        {jamming ? "frozen" : "ticking"}
                      </span>
                    </div>
                    <p className="font-mono text-2xl font-bold text-ink mt-0.5 tabular-nums">{tick}</p>
                  </div>

                  {/* two boxes, one per thread — the side-by-side contrast */}
                  <Track which="native" />
                  <Track which="js" />
                </div>

                <AnimatePresence>
                  {jamming && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-3 inset-x-3 rounded-lg bg-red-500/10 border border-red-500/30 px-2.5 py-1.5 text-center"
                    >
                      <span className="text-[11px] font-semibold text-red-600">JS thread busy for 2s…</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <p className="text-center text-[13px] text-ink-faint mb-3">
          Both boxes are gliding. Now freeze the JS thread and watch which one keeps moving.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={jam}
            disabled={jamming}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-transform disabled:opacity-70"
            style={{ background: jamming ? "#DC2626" : "var(--accent)" }}
          >
            {jamming ? "JS thread frozen…" : "🔥 Jam the JS thread (2s)"}
          </button>
          <button
            onClick={reset}
            disabled={jamming}
            className="px-3 py-2 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-ink/5 transition-all disabled:opacity-50"
          >
            ↺ reset
          </button>
        </div>

        <p className="mt-3 text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          The <b className="text-ink">JS-driven</b> box and the heartbeat run on the JS thread, so they freeze the
          instant you jam it. The <b className="text-ink">native-driven</b> box was handed to the Main thread up front,
          so it keeps gliding — that&apos;s exactly what <span className="font-mono text-[13px]">useNativeDriver</span> does.
        </p>
      </div>
    </div>
  )
}
