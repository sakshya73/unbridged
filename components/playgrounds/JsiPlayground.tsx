"use client"

import { useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function JsiPlayground() {
  const [ran, setRan] = useState(false)
  const [bridgeLate, setBridgeLate] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const run = useCallback(() => {
    setRan(true)
    setBridgeLate(false)
    window.clearTimeout(timer.current)
    // The bridge's value can only arrive on a LATER tick — modelled with a real
    // setTimeout, which (like the old async bridge) genuinely cannot hand a
    // value back on the calling line.
    timer.current = window.setTimeout(() => setBridgeLate(true), 1200)
  }, [])

  const reset = () => {
    setRan(false)
    setBridgeLate(false)
    window.clearTimeout(timer.current)
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* JSI lane */}
          <div className="rounded-2xl border-2 p-5 bg-paper-2" style={{ borderColor: "#8B5CF6" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold text-ink">JSI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ color: "#8B5CF6", background: "#8B5CF61a" }}>
                direct call
              </span>
            </div>
            <p className="font-mono text-[13px] text-ink-soft">
              const theme = <span className="text-ink font-medium">getTheme()</span>
            </p>
            <div className="mt-3 min-h-[92px]">
              <AnimatePresence mode="wait">
                {ran ? (
                  <motion.div key="r" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="font-mono text-lg text-ink">
                      theme = <span className="font-bold" style={{ color: "#059669" }}>&quot;dark&quot;</span>
                    </p>
                    <p className="text-[12px] text-emerald-600 mt-1.5">✓ returned on the same line, same tick</p>
                  </motion.div>
                ) : (
                  <p key="i" className="text-[12px] text-ink-faint">press Run →</p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Old Bridge lane */}
          <div className="rounded-2xl border-2 p-5 bg-paper-2" style={{ borderColor: "#D97706" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold text-ink">Old Bridge</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ color: "#D97706", background: "#D977061a" }}>
                async
              </span>
            </div>
            <p className="font-mono text-[13px] text-ink-soft">
              const theme = <span className="text-ink font-medium">getTheme()</span>
            </p>
            <div className="mt-3 min-h-[92px]">
              <AnimatePresence mode="wait">
                {ran ? (
                  <motion.div key="r" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="font-mono text-lg text-ink">
                      theme = <span className="font-bold" style={{ color: "#DC2626" }}>Promise</span>
                    </p>
                    <p className="text-[12px] text-red-600 mt-1.5">✕ a Promise, not the value — you must await it</p>
                    <div className="mt-2 h-[22px]">
                      <AnimatePresence mode="wait">
                        {bridgeLate ? (
                          <motion.p key="late" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[12px] text-ink-soft">
                            ↳ await → <span className="font-semibold text-ink">&quot;dark&quot;</span> (a tick later)
                          </motion.p>
                        ) : (
                          <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-ink-faint">
                            ⏳ resolves later…
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <p key="i" className="text-[12px] text-ink-faint">press Run →</p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="h-5 mb-3 text-center">
          <AnimatePresence>
            {ran && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] text-ink-soft">
                JSI handed the value back on the same line. The bridge couldn&apos;t — async isn&apos;t just slower, it&apos;s a wall.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={run}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-transform"
            style={{ background: "var(--accent)" }}
          >
            ▶ {ran ? "Run again" : "Run getTheme() on both"}
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-ink/5 transition-all"
          >
            ↺ reset
          </button>
        </div>
        <p className="mt-3 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          Staged analogy, not a benchmark — the browser has no real bridge or JSI. But it&apos;s literally true of JS: an
          async call hands back a <span className="font-mono">Promise</span>, not the value, so you can&apos;t read it on
          the calling line — you await it and it resolves a tick later. That&apos;s the old bridge&apos;s wall. The JSI lane
          is a plain synchronous function returning at once.
        </p>
      </div>
    </div>
  )
}
