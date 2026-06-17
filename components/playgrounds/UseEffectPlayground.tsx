"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Entry = { id: number; type: "setup" | "cleanup"; room: string }
type DepsMode = "dep" | "empty" | "none"

const SETUP = "#8B5CF6" // setup = connect
const CLEAN = "#D97706" // cleanup = disconnect

function RenderBadge({ n, color }: { n: number; color: string }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 1.3, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="text-[10px] font-mono px-1.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ color, background: `${color}1a` }}
    >
      {n} render{n === 1 ? "" : "s"}
    </motion.span>
  )
}

// Real child with a real useEffect. Memoized with stable/primitive props so a
// log-driven parent re-render bails out here (no infinite loop in "none" mode).
// It re-renders only on a real prop change: room / depsMode / tick.
const ChatRoom = memo(function ChatRoom({
  room,
  depsMode,
  tick,
  onLog,
}: {
  room: string
  depsMode: DepsMode
  tick: number
  onLog: (t: "setup" | "cleanup", r: string) => void
}) {
  const r = useRef(0)
  r.current += 1
  const deps: unknown[] | undefined = depsMode === "none" ? undefined : depsMode === "empty" ? [] : [room]
  useEffect(() => {
    onLog("setup", room)
    return () => onLog("cleanup", room)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return (
    <div data-tick={tick} className="rounded-xl border-2 px-4 py-3 flex items-center justify-between bg-paper-2" style={{ borderColor: SETUP }}>
      <div>
        <p className="text-sm font-semibold text-ink">ChatRoom</p>
        <p className="text-[12px] text-ink-soft mt-0.5">
          connected to <span className="font-mono font-bold text-ink">{room}</span>
        </p>
      </div>
      <RenderBadge n={r.current} color={SETUP} />
    </div>
  )
})

const ROOMS = ["#general", "#random"]
const DEPS: { id: DepsMode; label: string; sub: string }[] = [
  { id: "dep", label: "[room]", sub: "re-run only when room changes" },
  { id: "empty", label: "[ ]", sub: "run once, on mount" },
  { id: "none", label: "no deps", sub: "run after every render" },
]
const EXPECT: Record<DepsMode, string> = {
  dep: "Switch room → disconnect the old, connect the new. Re-render → nothing (the room didn't change).",
  empty: "Runs once on mount. Switch room or re-render and nothing re-fires — it's stuck on the first room.",
  none: "Re-runs after every render — Switch room AND Re-render both disconnect then reconnect.",
}

export default function UseEffectPlayground({ accent = "#0e7490" }: { accent?: string }) {
  const [roomIdx, setRoomIdx] = useState(0)
  const [depsMode, setDepsMode] = useState<DepsMode>("dep")
  const [tick, setTick] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const [log, setLog] = useState<Entry[]>([])
  const idRef = useRef(0)
  const room = ROOMS[roomIdx]

  const onLog = useCallback((type: "setup" | "cleanup", r: string) => {
    setLog((l) => [...l, { id: ++idRef.current, type, room: r }].slice(-7))
  }, [])

  const switchMode = (m: DepsMode) => {
    setDepsMode(m)
    setLog([])
    setRoomIdx(0)
    setTick(0)
    setResetKey((k) => k + 1)
  }
  const reset = () => {
    setLog([])
    setRoomIdx(0)
    setTick(0)
    setResetKey((k) => k + 1)
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-sm flex flex-col gap-3">
          <ChatRoom key={`${depsMode}-${resetKey}`} room={room} depsMode={depsMode} tick={tick} onLog={onLog} />

          <div className="rounded-xl border border-line bg-paper px-3 py-2.5 min-h-[170px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint">effect log</span>
              <span className="text-[10px] text-ink-faint">setup = connect · cleanup = disconnect</span>
            </div>
            <div className="flex flex-col gap-1">
              <AnimatePresence initial={false}>
                {log.map((e) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono text-[12px] flex items-center gap-2"
                    style={{ color: e.type === "setup" ? SETUP : CLEAN }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
                    {e.type === "setup" ? "connect" : "disconnect"}(<span className="font-semibold">{e.room}</span>)
                  </motion.div>
                ))}
              </AnimatePresence>
              {log.length === 0 && <span className="text-[12px] text-ink-faint">— switch room or re-render to see the effect run —</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 bg-white px-5 py-4" style={{ borderColor: "#1b2433" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-start gap-2">
            <span className="text-xs text-ink-faint mr-1 mt-1.5">deps</span>
            {DEPS.map((d) => (
              <button
                key={d.id}
                onClick={() => switchMode(d.id)}
                className="flex flex-col items-center px-3 py-1.5 rounded-lg border-2 transition-all"
                style={depsMode === d.id ? { background: accent, borderColor: accent } : { borderColor: "rgba(27,36,51,0.2)" }}
              >
                <span className={`text-[12px] font-mono font-semibold ${depsMode === d.id ? "text-white" : "text-ink"}`}>{d.label}</span>
                <span className={`text-[9px] leading-tight ${depsMode === d.id ? "text-white/80" : "text-ink-faint"}`}>{d.sub}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setRoomIdx((i) => (i + 1) % ROOMS.length)}
              className="px-4 py-2 rounded-md text-[13px] font-semibold text-white transition-transform active:scale-95"
              style={{ background: accent, boxShadow: "3px 3px 0 0 #1b2433" }}
            >
              Switch room →
            </button>
            <button
              onClick={() => setTick((t) => t + 1)}
              className="px-3.5 py-2 rounded-md text-[13px] font-medium border border-[rgba(27,36,51,0.25)] text-ink-soft hover:text-ink hover:bg-ink/[0.03] transition-colors"
            >
              Re-render
            </button>
            <button onClick={reset} className="px-3 py-2 rounded-md text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">
              ↺ reset
            </button>
          </div>
        </div>

        <p className="mt-3.5 text-center text-sm max-w-xl mx-auto leading-relaxed">
          <span className="font-mono text-[12px] px-1.5 py-0.5 rounded" style={{ color: accent, background: `${accent}14` }}>{DEPS.find((d) => d.id === depsMode)!.label}</span>{" "}
          <span className="text-ink-soft">{EXPECT[depsMode]}</span>
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-xl mx-auto leading-relaxed">
          Real browser React with a real useEffect — the firing and the cleanup-before-setup order are genuine (RN shares the
          reconciler). The render badge shows that a re-render is not the same as the effect re-running. StrictMode is off so the
          counts read clean; in real dev you&apos;d see one extra connect/disconnect on mount.
        </p>
      </div>
    </div>
  )
}
