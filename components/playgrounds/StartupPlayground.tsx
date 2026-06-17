"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type Lane = "main" | "js" | "shadow"
type Size = "small" | "medium" | "large"

const LANES: { id: Lane; label: string }[] = [
  { id: "main", label: "Main / UI" },
  { id: "js", label: "JS thread" },
  { id: "shadow", label: "Shadow (layout)" },
]
const LANE_ROW: Record<Lane, number> = { main: 0, js: 1, shadow: 2 }

// illustrative ms (not measured) — phase structure + lever direction are real
const SIZES: Record<Size, { label: string; evalMs: number; parseMs: number }> = {
  small: { label: "0.5 MB", evalMs: 160, parseMs: 180 },
  medium: { label: "2 MB", evalMs: 260, parseMs: 320 },
  large: { label: "6 MB", evalMs: 520, parseMs: 680 },
}
const C = { main: "#0F766E", engine: "#8B5CF6", parse: "#DC2626", eval: "#F59E0B", render: "#059669", layout: "#7C3AED", mount: "#0891B2" }

export default function StartupPlayground({ accent = "#0e7490" }: { accent?: string }) {
  const [size, setSize] = useState<Size>("medium")
  const [hermes, setHermes] = useState(true)
  const [inlineReq, setInlineReq] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const startRef = useRef(0)
  const tRef = useRef(0)
  tRef.current = t

  const { blocks, total } = useMemo(() => {
    const s = SIZES[size]
    const evalMs = Math.round(s.evalMs * (inlineReq ? 0.55 : 1))
    const seq: { lane: Lane; label: string; ms: number; color: string }[] = [
      { lane: "main", label: "native launch", ms: 350, color: C.main },
      { lane: "main", label: "host", ms: 120, color: C.main },
      { lane: "js", label: "runtime", ms: 160, color: C.engine },
      { lane: "js", label: "engine", ms: 140, color: C.engine },
    ]
    if (!hermes) seq.push({ lane: "js", label: "parse+compile", ms: s.parseMs, color: C.parse })
    seq.push({ lane: "js", label: "bundle eval", ms: evalMs, color: C.eval })
    seq.push({ lane: "js", label: "first render", ms: 220, color: C.render })
    seq.push({ lane: "shadow", label: "layout", ms: 90, color: C.layout })
    seq.push({ lane: "main", label: "mount", ms: 110, color: C.mount })
    let acc = 0
    const blocks = seq.map((b) => { const start = acc; acc += b.ms; return { ...b, start } })
    return { blocks, total: acc }
  }, [size, hermes, inlineReq])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    startRef.current = performance.now() - (tRef.current / total) * 2600
    const tick = (now: number) => {
      const ms = ((now - startRef.current) / 2600) * total
      if (ms >= total) { setT(total); setPlaying(false); return }
      setT(ms); raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, total])

  const play = () => { if (t >= total) setT(0); setPlaying((p) => !p) }
  const reset = () => { setPlaying(false); setT(0) }
  const pct = (ms: number) => `${(ms / total) * 100}%`

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-col justify-center gap-4 px-6 py-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-ink-faint">cold start · tap → first interactive frame</span>
          <span className="font-mono text-sm">TTI ≈ <b style={{ color: C.parse }}>{Math.round(total)}ms</b></span>
        </div>

        <div className="relative">
          {LANES.map((lane) => (
            <div key={lane.id} className="flex items-center gap-2 mb-1.5">
              <span className="w-[110px] shrink-0 text-[11px] font-mono text-ink-soft text-right pr-1">{lane.label}</span>
              <div className="relative flex-1 h-9 rounded-lg bg-ink/[0.04]">
                {blocks.filter((b) => b.lane === lane.id).map((b, i) => {
                  const reached = t > b.start
                  return (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 rounded-md flex items-center justify-center overflow-hidden transition-opacity"
                      style={{ left: pct(b.start), width: pct(b.ms), background: reached ? b.color : `${b.color}33`, opacity: reached ? 1 : 0.5 }}
                    >
                      <span className="text-[9px] font-medium text-white/95 px-1 truncate">{b.ms >= 110 ? b.label : ""}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          {/* shared playhead + TTI flag, aligned to the lane tracks (offset by the 110px label + 8px gap) */}
          <div className="absolute top-0 bottom-1.5 pointer-events-none" style={{ left: `calc(118px + ${total ? t / total : 0} * (100% - 118px))` }}>
            <div className="w-[2px] h-full bg-accent/70" />
          </div>
          <div className="absolute top-0 bottom-1.5 right-0 pointer-events-none">
            <div className="w-[2px] h-full bg-ink" />
            <span className="absolute top-0 right-1 text-[8px] font-bold text-ink whitespace-nowrap">TTI</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-[12px] font-mono">
          {!hermes && <span>parse+compile adds <b style={{ color: C.parse }}>+{SIZES[size].parseMs}ms</b></span>}
          {inlineReq && <span>inline requires save <b style={{ color: C.main }}>~{Math.round(SIZES[size].evalMs * 0.45)}ms</b></span>}
        </div>
      </div>

      <div className="border-t-2 bg-white px-5 py-4" style={{ borderColor: "#1b2433" }}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 mb-3">
          <button onClick={play} className="px-4 py-1.5 rounded-md text-white text-[13px] font-semibold active:scale-95 transition-transform" style={{ background: accent, boxShadow: "3px 3px 0 0 #1b2433" }}>
            {playing ? "❚❚ pause" : t >= total ? "↻ replay" : "▶ play"}
          </button>
          <button onClick={() => { setHermes((h) => !h); reset() }} className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-colors ${hermes ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-[rgba(27,36,51,0.2)] text-ink-soft hover:text-ink"}`}>
            Hermes {hermes ? "on" : "off"}
          </button>
          <button onClick={() => { setInlineReq((v) => !v); reset() }} className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-colors ${inlineReq ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-[rgba(27,36,51,0.2)] text-ink-soft hover:text-ink"}`}>
            inline requires {inlineReq ? "on" : "off"}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-ink-faint mr-1">bundle</span>
            {(["small", "medium", "large"] as Size[]).map((s) => (
              <button key={s} onClick={() => { setSize(s); reset() }} className={`px-2.5 h-7 rounded-lg text-[12px] font-mono border transition-colors ${size === s ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-[rgba(27,36,51,0.2)] text-ink-soft hover:text-ink"}`}>{SIZES[s].label}</button>
            ))}
          </div>
          <button onClick={reset} className="px-3 py-1.5 rounded-lg text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">↺ reset</button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Hit <b className="text-ink">play</b> and watch a cold start march across the three threads to the first interactive frame.
          Turn <b className="text-ink">Hermes</b> off and a parse+compile block appears in the JS lane and TTI jumps right; turn <b className="text-ink">inline requires</b> off
          and the eval block grows. Push <b className="text-ink">bundle size</b> up and parse and eval balloon, so the levers buy more.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          The phase order is real — native launch, runtime + engine, bundle load + eval, first render, commit + layout, mount, then the first frame at the TTI flag — and so is
          each lever's direction: Hermes removes the on-device parse, inline requires defer factory eval (they're on by default in the RN CLI), a bigger bundle costs more.
          The milliseconds are illustrative, scaled by the size control, not measured. (Different from the Hermes playground, which races two engines for one phase;
          this is the whole bootstrap across threads.) A browser simulation, not a real launch.
        </p>
      </div>
    </div>
  )
}
