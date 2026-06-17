"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type Size = "small" | "medium" | "large"
type Seg = { label: string; ms: number; color: string }

// Illustrative ms (not measured) — hand-picked so the time goes where it really
// goes: JSC pays parse + compile on device and that cost scales with bundle size;
// Hermes's mmap'd-bytecode load barely moves. The PHASE STRUCTURE is real.
const SIZES: Record<Size, { label: string; jscRead: number; parse: number; compile: number; exec: number; jscCpu: number; hLoad: number; hCpu: number }> = {
  small: { label: "0.5 MB", jscRead: 60, parse: 120, compile: 150, exec: 150, jscCpu: 240, hLoad: 55, hCpu: 380 },
  medium: { label: "2 MB", jscRead: 120, parse: 240, compile: 300, exec: 180, jscCpu: 280, hLoad: 85, hCpu: 440 },
  large: { label: "6 MB", jscRead: 240, parse: 600, compile: 780, exec: 220, jscCpu: 320, hLoad: 130, hCpu: 520 },
}

const GREY = "#94A3B8", RED = "#DC2626", DRED = "#B91C1C", GREEN = "#059669", AMBER = "#F59E0B", BLUE = "#3B82F6"

export default function HermesPlayground() {
  const [size, setSize] = useState<Size>("medium")
  const [cpu, setCpu] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0) // current ms along the shared time axis
  const startRef = useRef(0)
  const tRef = useRef(0)
  tRef.current = t

  const { jsc, hermes, jscTti, hermesTti, maxMs } = useMemo(() => {
    const S = SIZES[size]
    const jsc: Seg[] = [
      { label: "read JS", ms: S.jscRead, color: GREY },
      { label: "parse", ms: S.parse, color: RED },
      { label: "compile", ms: S.compile, color: DRED },
      { label: "execute", ms: S.exec, color: GREEN },
    ]
    const hermes: Seg[] = [
      { label: "load + mmap .hbc", ms: S.hLoad, color: AMBER },
      { label: "execute", ms: S.exec, color: GREEN },
    ]
    if (cpu) {
      jsc.push({ label: "CPU loop (JIT)", ms: S.jscCpu, color: BLUE })
      hermes.push({ label: "CPU loop (no JIT)", ms: S.hCpu, color: RED })
    }
    const jscTti = S.jscRead + S.parse + S.compile // execution can begin here
    const hermesTti = S.hLoad
    const total = (segs: Seg[]) => segs.reduce((a, s) => a + s.ms, 0)
    const maxMs = Math.max(total(jsc), total(hermes))
    return { jsc, hermes, jscTti, hermesTti, maxMs }
  }, [size, cpu])

  // playhead sweep (rAF), ~2.6s real time across the whole axis
  useEffect(() => {
    if (!playing) return
    let raf = 0
    startRef.current = performance.now() - (tRef.current / maxMs) * 2600
    const tick = (now: number) => {
      const ms = ((now - startRef.current) / 2600) * maxMs
      if (ms >= maxMs) {
        setT(maxMs)
        setPlaying(false)
        return
      }
      setT(ms)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, maxMs])

  const play = () => {
    if (t >= maxMs) setT(0)
    setPlaying((p) => !p)
  }
  const reset = useCallback(() => {
    setPlaying(false)
    setT(0)
  }, [])

  const pct = (ms: number) => `${(ms / maxMs) * 100}%`

  const Bar = ({ segs, tti, label }: { segs: Seg[]; tti: number; label: string }) => {
    let acc = 0
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-semibold text-ink">{label}</span>
          <span className="text-[11px] font-mono text-ink-faint">exec starts ~{Math.round(tti)}ms</span>
        </div>
        <div className="relative h-9 rounded-lg overflow-hidden bg-ink/[0.04] flex">
          {segs.map((s, i) => {
            const reached = t > acc
            acc += s.ms
            return (
              <div
                key={i}
                className="h-full flex items-center justify-center overflow-hidden transition-opacity"
                style={{ width: pct(s.ms), background: reached ? s.color : `${s.color}33`, opacity: reached ? 1 : 0.55 }}
              >
                <span className="text-[9px] font-medium text-white/95 px-1 truncate">{s.ms >= 90 ? s.label : ""}</span>
              </div>
            )
          })}
          {/* TTI flag */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-ink" style={{ left: pct(tti) }}>
            <span className="absolute -top-0 left-1 text-[8px] font-bold text-ink whitespace-nowrap">exec</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-col justify-center gap-5 px-6 py-6 max-w-2xl mx-auto w-full">
        <div className="relative">
          {/* shared playhead across both bars */}
          <div className="flex flex-col gap-4">
            <Bar segs={jsc} tti={jscTti} label="JSC (old default) — parse + compile on device" />
            <Bar segs={hermes} tti={hermesTti} label="Hermes — runs precompiled .hbc bytecode" />
          </div>
          <div className="absolute top-[26px] bottom-0 w-[2px] bg-accent/70 pointer-events-none" style={{ left: pct(t) }} />
        </div>

        <div className="flex items-center justify-center gap-6 text-[12px]">
          <span className="font-mono">
            Hermes exec <b style={{ color: GREEN }}>~{Math.round(hermesTti)}ms</b>
          </span>
          <span className="font-mono">
            JSC exec <b style={{ color: RED }}>~{Math.round(jscTti)}ms</b>
          </span>
          <span className="font-mono text-ink-soft">
            Hermes runs your code <b className="text-ink">{Math.round(jscTti / hermesTti)}×</b> sooner
          </span>
        </div>
        {cpu && (
          <p className="text-center text-[12px] text-ink-faint">
            heavy loop: JSC <b style={{ color: BLUE }}>~{SIZES[size].jscCpu}ms</b> vs Hermes <b style={{ color: RED }}>~{SIZES[size].hCpu}ms</b> — JSC's JIT wins the loop
          </p>
        )}
      </div>

      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 mb-3">
          <button onClick={play} className="px-4 py-1.5 rounded-lg text-white text-[13px] font-semibold active:scale-95 transition-transform" style={{ background: "var(--accent)" }}>
            {playing ? "❚❚ pause" : t >= maxMs ? "↻ replay" : "▶ play"}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-ink-faint mr-1">bundle size</span>
            {(["small", "medium", "large"] as Size[]).map((s) => (
              <button
                key={s}
                onClick={() => { setSize(s); reset() }}
                className={`px-2.5 h-7 rounded-lg text-[12px] font-mono border transition-colors ${size === s ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-line text-ink-soft hover:text-ink"}`}
              >
                {SIZES[s].label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setCpu((c) => !c); reset() }}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-colors ${cpu ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-line text-ink-soft hover:text-ink"}`}
          >
            heavy CPU loop {cpu ? "on" : "off"}
          </button>
          <button onClick={reset} className="px-3 py-1.5 rounded-lg text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">
            ↺ reset
          </button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Hit <b className="text-ink">play</b> and watch the same app start on both engines. <b className="text-ink">JSC</b> reads your JS, then
          <b className="text-ink"> parses</b> and <b className="text-ink">compiles</b> it on the phone before a line runs. <b className="text-ink">Hermes</b> ships
          precompiled <span className="font-mono text-[13px]">.hbc</span> and skips straight to execute — its TTI flag lands first. Push <b className="text-ink">bundle size</b> up
          and JSC's parse/compile balloon while Hermes barely moves.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          The phase structure is real — JSC genuinely parses and compiles JS on device every launch; Hermes genuinely doesn't (that
          happened at build time via hermesc, into mmap'd bytecode). The exact milliseconds are illustrative, scaled by the size
          slider. Toggle the heavy CPU loop to see the honest tradeoff: Hermes has no JIT, so a long loop runs slower than on JSC.
          This is a simulation, not a real engine.
        </p>
      </div>
    </div>
  )
}
