"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const DELAY_MS = 220 // simulated async round-trip for the "old bridge" lane
const DISC = 48
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
  const dotRef = useRef<HTMLSpanElement>(null)
  const targetRef = useRef<{ x: number; y: number } | null>(null)
  const bufRef = useRef<{ x: number; y: number; t: number }[]>([])

  const place = (el: HTMLDivElement | null, x: number, y: number, size: number) => {
    if (el) el.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`
  }

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
        const dist = Math.round(Math.hypot(t.x - dx, t.y - dy))
        const locked = dist <= 6
        if (lagRef.current) {
          lagRef.current.textContent = locked ? "locked to your finger" : `${dist} px behind`
          lagRef.current.style.color = locked ? "#059669" : "#D97706"
        }
        if (dotRef.current) dotRef.current.style.background = locked ? "#059669" : "#D97706"
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

  const accent = mode === "jsi" ? "#8B5CF6" : "#D97706"

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
        <p className="text-sm text-ink-soft text-center max-w-md">
          Drag across the pad. The <b className="text-ink">view</b> chases your{" "}
          <b className="text-ink">finger</b> — watch how closely it keeps up.
        </p>

        <div
          ref={padRef}
          onPointerMove={onMove}
          className="relative w-full max-w-2xl h-[360px] rounded-[28px] border border-line overflow-hidden cursor-none shadow-[0_24px_60px_-24px_rgba(35,39,47,0.35)]"
          style={{ background: "radial-gradient(120% 120% at 50% 0%, #ffffff 0%, #f3f4f8 100%)" }}
        >
          {/* the view (follows, lagging or locked) */}
          <div
            ref={discRef}
            className="absolute top-0 left-0 rounded-2xl flex items-center justify-center text-white text-[11px] font-semibold pointer-events-none transition-colors"
            style={{
              width: DISC,
              height: DISC,
              background: `linear-gradient(150deg, ${accent}, ${accent}cc)`,
              boxShadow: `0 10px 24px -6px ${accent}80`,
              willChange: "transform",
            }}
          >
            view
          </div>
          {/* your finger (always exactly on the pointer) */}
          <div
            ref={ringRef}
            className="absolute top-0 left-0 rounded-full border-2 pointer-events-none"
            style={{ width: RING, height: RING, borderColor: "var(--ink)", willChange: "transform" }}
          />

          {/* live lag HUD */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 backdrop-blur px-3 py-1.5 shadow-sm">
            <span ref={dotRef} className="w-2 h-2 rounded-full" style={{ background: "#059669" }} />
            <span className="text-[12px] text-ink-soft">
              view is <span ref={lagRef} className="font-mono font-semibold" style={{ color: "#059669" }}>locked to your finger</span>
            </span>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="border-t border-line bg-paper-2 px-6 py-7">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-ink-faint">Architecture</span>
            <div className="flex bg-ink/[0.05] rounded-xl p-1 text-sm">
              <button
                onClick={() => setMode("jsi")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${mode === "jsi" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: "#8B5CF6" }} /> JSI (New Arch)
              </button>
              <button
                onClick={() => setMode("bridge")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${mode === "bridge" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: "#D97706" }} /> Old Bridge
              </button>
            </div>
          </div>

          <p className="text-center text-[15px] text-ink leading-relaxed max-w-xl text-balance">
            {mode === "jsi"
              ? "The gesture runs synchronously on the UI thread, so the view stays glued to your finger. Flip to Old Bridge to feel the lag JSI removes."
              : "Every move round-trips the async bridge, so the view trails your finger and catches up only when you stop."}
          </p>

          <p className="text-center text-[11px] text-ink-faint max-w-md leading-relaxed">
            Staged analogy — the bridge lag is a simulated ~220ms delay; the JSI lane updates instantly, as a real
            synchronous call would.
          </p>
        </div>
      </div>
    </div>
  )
}
