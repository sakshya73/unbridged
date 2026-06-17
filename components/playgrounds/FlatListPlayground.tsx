"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const N = 10000
const ROW_H = 36
const VIEWPORT = 320
const SCROLLVIEW_CAP = 2000 // a real ScrollView would mount all N; we cap so the browser survives
const MAX_SCROLL = N * ROW_H - VIEWPORT

// A real row. It reports its own mount/unmount, so the "mounted" count is genuine.
function Cell({ i, onCount }: { i: number; onCount: (d: number) => void }) {
  useEffect(() => {
    onCount(1)
    return () => onCount(-1)
  }, [onCount])
  return (
    <div className="absolute left-0 right-0 px-3 flex items-center border-b border-line" style={{ top: i * ROW_H, height: ROW_H }}>
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full" style={{ background: `hsl(${(i * 47) % 360} 55% 72%)` }} />
        <span className="text-[12px] text-ink">Contact #{i}</span>
      </div>
    </div>
  )
}

export default function FlatListPlayground({ accent = "#0e7490" }: { accent?: string }) {
  const [mode, setMode] = useState<"flatlist" | "scrollview">("flatlist")
  const [windowSize, setWindowSize] = useState(3)
  const [scrollTop, setScrollTop] = useState(0)
  const [mounted, setMounted] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef(0)
  const rafRef = useRef(0)

  const onCount = useCallback((d: number) => {
    liveRef.current += d
    setMounted(liveRef.current)
  }, [])

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop)
    })
  }, [])

  const visibleCount = Math.ceil(VIEWPORT / ROW_H)
  const buffer = Math.floor((visibleCount * (windowSize - 1)) / 2)
  const first = Math.floor(scrollTop / ROW_H)
  const start = mode === "scrollview" ? 0 : Math.max(0, first - buffer)
  const end = mode === "scrollview" ? Math.min(N, SCROLLVIEW_CAP) : Math.min(N, first + visibleCount + buffer)
  const indices: number[] = []
  for (let i = start; i < end; i++) indices.push(i)

  // minimap: the mounted window as a band sliding through the full list.
  // height is exaggerated (sqrt) so a ~30-of-10,000 window is still visible.
  const RAIL_H = VIEWPORT
  const winRows = end - start
  const bandH = Math.max(8, Math.round(RAIL_H * Math.sqrt(winRows / N)))
  const progress = MAX_SCROLL > 0 ? scrollTop / MAX_SCROLL : 0
  const bandTop = Math.round((RAIL_H - bandH) * progress)

  const reset = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    setScrollTop(0)
    setMode("flatlist")
    setWindowSize(3)
  }

  const heavy = mounted > 100
  const insight =
    mode === "scrollview"
      ? `ScrollView mounts every row up front — ${mounted.toLocaleString()} live components at once (capped at ${SCROLLVIEW_CAP.toLocaleString()}; a real one mounts all ${N.toLocaleString()}). The count explodes and scrolling stutters.`
      : `Only ${mounted} of ${N.toLocaleString()} rows exist right now. Scroll — the window slides (watch the row range and the rail), but the count barely moves. windowSize ${windowSize} sets how much off-screen buffer to keep.`

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-5">
        {/* readout */}
        <div className="flex items-center gap-5">
          <div className="inline-flex items-baseline gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-ink-faint mr-1">mounted</span>
            <motion.span key={mounted} initial={{ scale: 1.25, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 20 }} className="font-mono font-bold text-2xl tabular-nums" style={{ color: heavy ? "#DC2626" : accent }}>
              {mounted.toLocaleString()}
            </motion.span>
            <span className="text-[12px] text-ink-faint">/ {N.toLocaleString()}</span>
          </div>
          <span className="text-[12px] font-mono text-ink-soft">
            window: rows <b className="text-ink">{start}</b>–<b className="text-ink">{Math.max(start, end - 1)}</b>
          </span>
        </div>

        <div className="flex items-stretch gap-3">
          {/* phone */}
          <div className="relative w-[230px] rounded-[28px] bg-ink p-2.5 shadow-[0_20px_50px_-18px_rgba(35,39,47,0.45)]">
            <div className="rounded-[22px] bg-paper overflow-hidden">
              <div className="py-2 text-center border-b border-line bg-paper-2">
                <p className="font-semibold text-[13px]">Contacts</p>
              </div>
              <div ref={scrollRef} onScroll={onScroll} className="relative overflow-y-auto" style={{ height: VIEWPORT }}>
                <div style={{ height: N * ROW_H, position: "relative" }}>
                  {indices.map((i) => (
                    <Cell key={i} i={i} onCount={onCount} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* minimap rail — the mounted window inside the full 10k list */}
          <div className="flex flex-col items-center gap-1.5 pt-9">
            <div className="relative w-2.5 rounded-full bg-ink/[0.06] overflow-hidden" style={{ height: RAIL_H }}>
              <motion.div
                className="absolute left-0 right-0 rounded-full"
                style={{ background: accent }}
                animate={{ top: bandTop, height: bandH }}
                transition={{ type: "tween", duration: 0.15 }}
              />
            </div>
            <span className="text-[9px] font-mono text-ink-faint text-center leading-tight w-12">live<br />window</span>
          </div>
        </div>
      </div>

      <div className="border-t-2 bg-white px-5 py-4" style={{ borderColor: "#1b2433" }}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 mb-3">
          <div className="flex bg-ink/[0.05] rounded-lg p-0.5 text-sm">
            <button onClick={() => setMode("flatlist")} className="px-3 py-1 rounded-md transition-all" style={mode === "flatlist" ? { background: accent, color: "#fff", fontWeight: 600 } : { color: "var(--ink-soft)" }}>
              FlatList
            </button>
            <button onClick={() => setMode("scrollview")} className="px-3 py-1 rounded-md transition-all" style={mode === "scrollview" ? { background: "#DC2626", color: "#fff", fontWeight: 600 } : { color: "var(--ink-soft)" }}>
              ScrollView
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-ink-faint mr-1">windowSize</span>
            {[1, 3, 5].map((w) => (
              <button
                key={w}
                onClick={() => setWindowSize(w)}
                disabled={mode === "scrollview"}
                className="w-8 h-8 rounded-md text-[13px] font-mono font-semibold border-2 transition-all disabled:opacity-40"
                style={windowSize === w ? { background: accent, borderColor: accent, color: "#fff" } : { borderColor: "rgba(27,36,51,0.2)", color: "var(--ink-soft)" }}
              >
                {w}
              </button>
            ))}
          </div>

          <button onClick={reset} className="px-3 py-1.5 rounded-lg text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">
            ↺ reset
          </button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">{insight}</p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          Real browser React — the count is live mounted components (via mount/unmount effects), not a number we made up. Scroll keeps it ~constant
          (that&apos;s virtualization); <b className="text-ink">windowSize</b> changes the buffer; <b className="text-ink">ScrollView</b> mounts everything.
          The rail&apos;s window height is exaggerated so a ~30-of-10,000 sliver stays visible.
        </p>
      </div>
    </div>
  )
}
