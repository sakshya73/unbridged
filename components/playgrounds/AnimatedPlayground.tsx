"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// interpolate() math, recreated in plain JS — the same linear map + clamp/extend
// extrapolation React Native's Animated.Value.interpolate uses. Only the render
// substrate (inline style vs a native view) differs; the math is real.
function interp(t: number, outMin: number, outMax: number, extend: boolean) {
  let p = t // inputRange is [0, 1], so the driver value IS the progress
  if (!extend) p = Math.max(0, Math.min(1, p))
  return outMin + p * (outMax - outMin)
}

const C_FROM = [203, 213, 225] // #CBD5E1 (slate-300)
const C_TO = [110, 89, 199] // #6E59C7 (violet)
const hex = (rgb: number[]) => "#" + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")
function lerpColor(t: number, extend: boolean) {
  const p = extend ? t : Math.max(0, Math.min(1, t))
  return hex(C_FROM.map((c, i) => c + p * (C_TO[i] - c)))
}

const MIN = -0.4 // over-drag zone below 0
const MAX = 1.6 // over-drag zone above 1
const SPAN = MAX - MIN
const pctOf = (v: number) => ((v - MIN) / SPAN) * 100

type Key = "opacity" | "rotate" | "translateX" | "scale" | "color"

export default function AnimatedPlayground() {
  const [driver, setDriver] = useState(0.45)
  const [extend, setExtend] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState<Record<Key, boolean>>({ opacity: false, rotate: false, translateX: false, scale: false, color: false })

  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const driverRef = useRef(driver)
  driverRef.current = driver

  const setFromX = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const p = (clientX - rect.left) / rect.width
    setDriver(Math.max(MIN, Math.min(MAX, MIN + p * SPAN)))
  }, [])

  const onDown = (e: React.PointerEvent) => {
    setPlaying(false)
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setFromX(e.clientX)
  }
  const onMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromX(e.clientX)
  }
  const onUp = () => {
    dragging.current = false
  }

  // hands-free loop: ramp the driver 0 -> 1 -> 0; on pause it leaves the value
  // wherever it stopped, so the slider picks up from there.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    // the loop runs the 0..1 range; if we're parked in an over-drag zone, ease in from the nearest edge
    const v0 = Math.max(0, Math.min(1, driverRef.current))
    if (v0 !== driverRef.current) setDriver(v0)
    driverRef.current = v0
    let dir = v0 >= 1 ? -1 : 1
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      let v = driverRef.current + (dir * dt) / 0.9
      if (v >= 1) { v = 1; dir = -1 }
      if (v <= 0) { v = 0; dir = 1 }
      setDriver(v)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const out = {
    opacity: muted.opacity ? 1 : interp(driver, 0.3, 1, extend),
    rotate: muted.rotate ? 0 : interp(driver, 0, 180, extend),
    translateX: muted.translateX ? 0 : interp(driver, 0, 40, extend),
    scale: muted.scale ? 1 : interp(driver, 1, 1.4, extend),
    color: muted.color ? hex(C_FROM) : lerpColor(driver, extend),
  }

  const rows: { k: Key; label: string; range: string; value: string }[] = [
    { k: "opacity", label: "opacity", range: "[0.3, 1]", value: out.opacity.toFixed(2) },
    { k: "rotate", label: "rotate", range: "[0°, 180°]", value: `${Math.round(out.rotate)}°` },
    { k: "translateX", label: "translateX", range: "[0, 40]", value: `${Math.round(out.translateX)}px` },
    { k: "scale", label: "scale", range: "[1, 1.4]", value: out.scale.toFixed(2) },
    { k: "color", label: "backgroundColor", range: "slate → violet", value: out.color },
  ]

  const reset = () => {
    setPlaying(false)
    setDriver(0.45)
    setExtend(false)
    setMuted({ opacity: false, rotate: false, translateX: false, scale: false, color: false })
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 py-6">
        {/* the one box every output reads */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-[180px] w-[180px] flex items-center justify-center">
            <div
              className="h-20 w-20 rounded-2xl shadow-[0_10px_30px_-12px_rgba(35,39,47,0.5)] flex items-center justify-center"
              style={{
                opacity: out.opacity,
                background: out.color,
                transform: `translateX(${out.translateX}px) rotate(${out.rotate}deg) scale(${out.scale})`,
              }}
            >
              <span className="text-white text-[11px] font-semibold tracking-wide">VALUE</span>
            </div>
          </div>
          <span className="text-[12px] text-ink-faint">one box · five outputs · one driver</span>
        </div>

        {/* live read-out: numeric proof all five derive from the same input */}
        <div className="w-[260px] rounded-2xl border border-line bg-paper-2 p-3.5">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-line">
            <span className="text-[12px] font-semibold text-ink">driver value</span>
            <span className="font-mono text-base font-bold" style={{ color: "var(--accent)" }}>{driver.toFixed(2)}</span>
          </div>
          <div className="flex flex-col gap-2">
            {rows.map((r) => (
              <div key={r.k} className={`flex items-center justify-between text-[12px] ${muted[r.k] ? "opacity-35" : ""}`}>
                <span className="font-mono text-ink-soft">{r.label}</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-ink-faint text-[11px]">{r.range}</span>
                  <span className="font-mono font-semibold text-ink w-[52px] text-right">{r.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-paper-2 px-5 py-4">
        {/* the single driver slider, with the out-of-range zones drawn in */}
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] text-ink-faint">progress (one Animated.Value)</span>
            <span className="text-[11px] text-ink-faint">drag past the ends →</span>
          </div>
          <div
            ref={trackRef}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="relative h-7 cursor-pointer select-none touch-none"
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden flex">
              <div style={{ width: `${pctOf(0)}%`, background: "#FCA5A5" }} />
              <div style={{ width: `${pctOf(1) - pctOf(0)}%`, background: "#D1D5DB" }} />
              <div style={{ width: `${100 - pctOf(1)}%`, background: "#FCA5A5" }} />
            </div>
            {/* fill from 0 to the thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full"
              style={{ left: `${pctOf(0)}%`, width: `${Math.max(0, pctOf(driver) - pctOf(0))}%`, background: "var(--accent)" }}
            />
            <div
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-paper shadow-md"
              style={{ left: `${pctOf(driver)}%`, background: "var(--accent)" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-ink-faint font-mono mt-1 px-0.5">
            <span>-0.4</span><span>0</span><span>1</span><span>1.6</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 mt-4">
          <div className="flex bg-ink/[0.05] rounded-lg p-0.5 text-sm">
            <button onClick={() => setExtend(false)} className={`px-3 py-1 rounded-md transition-all ${!extend ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}>clamp</button>
            <button onClick={() => setExtend(true)} className={`px-3 py-1 rounded-md transition-all ${extend ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}>extend</button>
          </div>

          <button
            onClick={() => setPlaying((p) => !p)}
            className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors"
          >
            {playing ? "❚❚ pause" : "▶ play loop"}
          </button>

          {/* driver eligibility — JS driver is active; native can't do color or a live slider */}
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-[12px] font-medium text-white" style={{ background: "#2563EB" }}>JS driver</span>
            <span className="px-2.5 py-1 rounded-md text-[12px] border border-line text-ink-faint cursor-not-allowed" title="unavailable here: the slider value is driven from React state every frame, which needs JS">Native driver</span>
          </div>

          <button onClick={reset} className="px-3 py-1.5 rounded-lg text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">↺ reset</button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-3">
          <span className="text-[11px] text-ink-faint">mute an output:</span>
          {rows.map((r) => (
            <button
              key={r.k}
              onClick={() => setMuted((m) => ({ ...m, [r.k]: !m[r.k] }))}
              className={`px-2 py-0.5 rounded-md text-[11px] font-mono border transition-colors ${muted[r.k] ? "border-line text-ink-faint line-through" : "border-line-strong bg-paper text-ink"}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <p className="mt-3.5 text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Drag the one <b className="text-ink">progress</b> slider and the box fades, spins, slides, grows, and shifts color
          together — five outputs, one driver. Over-drag into the red zones: with <b className="text-ink">clamp</b> the outputs
          freeze at their edges, with <b className="text-ink">extend</b> they overshoot.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          The interpolate math, clamp-vs-extend, and the one-driver-many-props relationship are all real React Native behavior —
          only the render target differs (inline style here, a native view in an app). This demo stays on the JS driver because its
          slider value is driven from React state every frame; in a real app, opacity, transform, and color would all run on the
          native driver.
        </p>
      </div>
    </div>
  )
}
