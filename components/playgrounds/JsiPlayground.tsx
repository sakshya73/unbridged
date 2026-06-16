"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const DELAY_MS = 220 // simulated async round-trip for the "old bridge" lane
const DISC = 46
const RING = 18

export default function JsiPlayground() {
  const [mode, setMode] = useState<"bridge" | "jsi">("jsi")
  const modeRef = useRef<"bridge" | "jsi">("jsi")
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const padRef = useRef<HTMLDivElement>(null)
  const discRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const lagRef = useRef<HTMLSpanElement>(null)
  const targetRef = useRef<{ x: number; y: number } | null>(null)
  const bufRef = useRef<{ x: number; y: number; t: number }[]>([])

  const place = (el: HTMLDivElement | null, x: number, y: number, size: number) => {
    if (el) el.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`
  }

  // start centered
  useEffect(() => {
    const pad = padRef.current
    if (!pad) return
    const r = pad.getBoundingClientRect()
    const c = { x: r.width / 2, y: r.height / 2 }
    targetRef.current = c
    bufRef.current = [{ ...c, t: performance.now() }]
    place(discRef.current, c.x, c.y, DISC)
    place(ringRef.current, c.x, c.y, RING)
  }, [])

  // follow loop: ring is always exactly on the pointer; the disc follows it,
  // locked in JSI mode or trailing by DELAY_MS in bridge mode.
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const t = targetRef.current
      if (t) {
        place(ringRef.current, t.x, t.y, RING)
        let dx = t.x
        let dy = t.y
        if (modeRef.current === "bridge") {
          const now = performance.now()
          const buf = bufRef.current
          let pos = buf[0] ?? t
          for (let i = 0; i < buf.length; i++) {
            if (buf[i].t <= now - DELAY_MS) pos = buf[i]
            else break
          }
          while (buf.length > 2 && buf[1].t <= now - DELAY_MS) buf.shift()
          dx = pos.x
          dy = pos.y
        }
        place(discRef.current, dx, dy, DISC)
        if (lagRef.current) {
          lagRef.current.textContent = `${Math.round(Math.hypot(t.x - dx, t.y - dy))} px`
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMove = useCallback((e: React.PointerEvent) => {
    const pad = padRef.current
    if (!pad) return
    const r = pad.getBoundingClientRect()
    targetRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    bufRef.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() })
  }, [])

  const discColor = mode === "jsi" ? "#8B5CF6" : "#D97706"

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-4">
        <p className="text-[13px] text-ink-faint text-center">
          Move your cursor across the pad. The <b className="text-ink">view</b> (filled) chases your{" "}
          <b className="text-ink">finger</b> (ring).
        </p>

        <div
          ref={padRef}
          onPointerMove={onMove}
          className="relative w-full max-w-2xl h-[320px] rounded-2xl border border-line bg-paper-2 overflow-hidden cursor-none shadow-[0_10px_30px_-18px_rgba(35,39,47,0.3)]"
          style={{ touchAction: "none" }}
        >
          {/* the view (follows, lagging or locked) */}
          <div
            ref={discRef}
            className="absolute top-0 left-0 rounded-2xl shadow-lg flex items-center justify-center text-white text-[11px] font-semibold pointer-events-none"
            style={{ width: DISC, height: DISC, background: discColor, willChange: "transform" }}
          >
            view
          </div>
          {/* your finger (always exactly on the pointer) */}
          <div
            ref={ringRef}
            className="absolute top-0 left-0 rounded-full border-2 pointer-events-none"
            style={{ width: RING, height: RING, borderColor: "var(--ink)", willChange: "transform" }}
          />
        </div>

        <div className="text-[13px] text-ink-soft">
          view is <span ref={lagRef} className="font-mono font-semibold text-ink">0 px</span> behind your finger
        </div>
      </div>

      {/* controls */}
      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs text-ink-faint mr-1">Architecture</span>
          <div className="flex bg-ink/[0.05] rounded-lg p-0.5 text-sm">
            <button
              onClick={() => setMode("jsi")}
              className={`px-3 py-1 rounded-md transition-all ${mode === "jsi" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
              🟣 JSI (New Arch)
            </button>
            <button
              onClick={() => setMode("bridge")}
              className={`px-3 py-1 rounded-md transition-all ${mode === "bridge" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
              🟠 Old Bridge (async)
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          {mode === "jsi" ? (
            <>
              <b className="text-ink">JSI:</b> the gesture runs synchronously on the UI thread (a Reanimated worklet), so
              the view stays locked to your finger. Now flip to Old Bridge to feel the difference.
            </>
          ) : (
            <>
              <b className="text-ink">Old Bridge:</b> every move round-trips the async bridge, so the view trails your
              finger and only catches up when you stop. This is the lag JSI removes.
            </>
          )}
        </p>

        <p className="mt-3 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          Staged analogy: the lag is a simulated ~220ms delay standing in for the async round-trip (serialize → queue →
          cross → deserialize). The JSI lane updates immediately, like a real synchronous call on the UI thread.
        </p>
      </div>
    </div>
  )
}
