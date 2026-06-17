"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const N = 10000
const ROW_H = 36
const VIEWPORT = 300
const SCROLLVIEW_CAP = 2000 // a real ScrollView would mount all N; we cap so the browser survives

// A real row component. It reports its own mount/unmount, so the "mounted cells"
// badge counts genuine live components — not a number we made up.
function Cell({ i, blank, onCount }: { i: number; blank: boolean; onCount: (d: number) => void }) {
  useEffect(() => {
    onCount(1)
    return () => onCount(-1)
  }, [onCount])
  return (
    <div className="absolute left-0 right-0 px-3 flex items-center border-b border-line" style={{ top: i * ROW_H, height: ROW_H }}>
      {blank ? (
        <div className="h-3 w-28 rounded bg-line" />
      ) : (
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full" style={{ background: `hsl(${(i * 47) % 360} 55% 72%)` }} />
          <span className="text-[12px] text-ink">Contact #{i}</span>
        </div>
      )}
    </div>
  )
}

export default function FlatListPlayground({ accent = "#0e7490" }: { accent?: string }) {
  const [mode, setMode] = useState<"flatlist" | "scrollview">("flatlist")
  const [windowSize, setWindowSize] = useState(3)
  const [scrollTop, setScrollTop] = useState(0)
  const [mounted, setMounted] = useState(0)
  const [flinging, setFlinging] = useState(false)
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

  const fling = () => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = Math.min(N * ROW_H - VIEWPORT, el.scrollTop + 4200)
    setScrollTop(el.scrollTop)
    if (mode === "flatlist") {
      setFlinging(true)
      window.setTimeout(() => setFlinging(false), 170)
    }
  }
  const reset = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    setScrollTop(0)
    setMode("flatlist")
    setWindowSize(3)
    setFlinging(false)
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3.5 py-1.5">
          <span className="text-[12px] text-ink-soft">mounted cells</span>
          <span className="font-mono font-bold text-base" style={{ color: mounted > 100 ? "#DC2626" : "#059669" }}>
            {mounted.toLocaleString()}
          </span>
          <span className="text-[11px] text-ink-faint">/ {N.toLocaleString()} rows</span>
        </div>

        <div className="relative w-[230px] rounded-[28px] bg-ink p-2.5 shadow-[0_20px_50px_-18px_rgba(35,39,47,0.45)]">
          <div className="rounded-[22px] bg-paper overflow-hidden">
            <div className="py-2 text-center border-b border-line bg-paper-2">
              <p className="font-semibold text-[13px]">Contacts</p>
            </div>
            <div ref={scrollRef} onScroll={onScroll} className="relative overflow-y-auto" style={{ height: VIEWPORT }}>
              <div style={{ height: N * ROW_H, position: "relative" }}>
                {indices.map((i) => (
                  <Cell key={i} i={i} blank={flinging && mode === "flatlist"} onCount={onCount} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 bg-white px-5 py-4" style={{ borderColor: "#1b2433" }}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 mb-3">
          <div className="flex bg-ink/[0.05] rounded-lg p-0.5 text-sm">
            <button
              onClick={() => setMode("flatlist")}
              className={`px-3 py-1 rounded-md transition-all ${mode === "flatlist" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
              FlatList
            </button>
            <button
              onClick={() => setMode("scrollview")}
              className={`px-3 py-1 rounded-md transition-all ${mode === "scrollview" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
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
                className={`w-7 h-7 rounded-lg text-[12px] font-mono border transition-colors disabled:opacity-40 ${windowSize === w ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-[rgba(27,36,51,0.2)] text-ink-soft hover:text-ink"}`}
              >
                {w}
              </button>
            ))}
          </div>

          <button onClick={fling} className="px-3.5 py-1.5 rounded-md text-[13px] font-medium text-white transition-colors" style={{ background: accent, boxShadow: "3px 3px 0 0 #1b2433" }}>
            ⚡ fast fling
          </button>
          <button onClick={reset} className="px-3 py-1.5 rounded-lg text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">
            ↺ reset
          </button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Scroll the list — in <b className="text-ink">FlatList</b> mode the mounted count stays tiny no matter how far you
          go. Flip to <b className="text-ink">ScrollView</b> and it jumps to thousands (and the scroll stutters). Hit{" "}
          <b className="text-ink">fast fling</b> to catch blank cells when the JS thread falls behind.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          Real browser React — only rows inside the window are mounted, positioned by computed offsets (the in-browser twin
          of getItemLayout), and the badge counts live components for real via mount/unmount effects. ScrollView is capped
          at {SCROLLVIEW_CAP.toLocaleString()} so your browser survives; a real one mounts all {N.toLocaleString()}. The blank-cell
          fling briefly blanks the visible rows (~170ms) to make a normally sub-frame race visible.
        </p>
      </div>
    </div>
  )
}
