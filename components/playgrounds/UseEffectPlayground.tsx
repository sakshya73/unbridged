"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Entry = { id: number; type: "setup" | "cleanup"; room: string }
type DepsMode = "dep" | "empty" | "none" | "obj"

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

// Real child with a real useEffect. Memoized and given only stable/primitive
// props, so a log-driven parent re-render bails out here instead of re-firing
// the effect — that's what prevents the obj/none modes from looping. It
// re-renders only on a real prop change (room / depsMode / tick).
const RoomPresence = memo(function RoomPresence({
  roomId,
  depsMode,
  tick,
  onLog,
}: {
  roomId: string
  depsMode: DepsMode
  tick: number
  onLog: (t: "setup" | "cleanup", r: string) => void
}) {
  const r = useRef(0)
  r.current += 1
  const deps: unknown[] | undefined =
    depsMode === "none" ? undefined : depsMode === "empty" ? [] : depsMode === "obj" ? [{ id: roomId }] : [roomId]
  useEffect(() => {
    onLog("setup", roomId)
    return () => onLog("cleanup", roomId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return (
    <div data-tick={tick} className="rounded-xl border-2 px-4 py-3 flex items-center justify-between bg-paper-2" style={{ borderColor: "#8B5CF6" }}>
      <div>
        <p className="text-sm font-semibold text-ink">RoomPresence</p>
        <p className="text-[12px] text-ink-soft mt-0.5">
          room: <span className="font-mono font-bold text-ink">{roomId}</span>
        </p>
      </div>
      <RenderBadge n={r.current} color="#8B5CF6" />
    </div>
  )
})

const ROOMS = ["general", "random", "support"]
const DEPS: { id: DepsMode; label: string }[] = [
  { id: "dep", label: "[roomId]" },
  { id: "empty", label: "[ ]" },
  { id: "none", label: "no array" },
  { id: "obj", label: "[{…}]" },
]

export default function UseEffectPlayground() {
  const [room, setRoom] = useState("general")
  const [depsMode, setDepsMode] = useState<DepsMode>("dep")
  const [tick, setTick] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const [log, setLog] = useState<Entry[]>([])
  const idRef = useRef(0)
  const setupsRef = useRef(0)

  const onLog = useCallback((type: "setup" | "cleanup", r: string) => {
    if (type === "setup") setupsRef.current += 1
    setLog((l) => [...l, { id: ++idRef.current, type, room: r }].slice(-8))
  }, [])

  const switchMode = (m: DepsMode) => {
    setupsRef.current = 0
    setDepsMode(m)
    setLog([])
    setRoom("general")
    setTick(0)
    setResetKey((k) => k + 1)
  }
  const reset = () => {
    setupsRef.current = 0
    setLog([])
    setRoom("general")
    setTick(0)
    setResetKey((k) => k + 1)
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-sm flex flex-col gap-3">
          <RoomPresence key={`${depsMode}-${resetKey}`} roomId={room} depsMode={depsMode} tick={tick} onLog={onLog} />

          <div className="rounded-xl border border-line bg-paper px-3 py-2.5 min-h-[176px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint">effect log</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ color: "#8B5CF6", background: "#8B5CF61a" }}>
                {setupsRef.current} setup{setupsRef.current === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <AnimatePresence initial={false}>
                {log.map((e) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono text-[12px] flex items-center gap-2"
                    style={{ color: e.type === "setup" ? "#8B5CF6" : "#D97706" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
                    {e.type}(room=<span className="font-semibold">{e.room}</span>)
                  </motion.div>
                ))}
              </AnimatePresence>
              {log.length === 0 && <span className="text-[12px] text-ink-faint">— switch room or force a render —</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-faint mr-1">Room</span>
            {ROOMS.map((rm) => (
              <button
                key={rm}
                onClick={() => setRoom(rm)}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-colors ${room === rm ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-line text-ink-soft hover:text-ink"}`}
              >
                {rm}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-faint mr-1">Deps</span>
            {DEPS.map((d) => (
              <button
                key={d.id}
                onClick={() => switchMode(d.id)}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-mono border transition-colors ${depsMode === d.id ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-line text-ink-soft hover:text-ink"}`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setTick((t) => t + 1)}
              className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors"
            >
              force re-render
            </button>
            <button onClick={reset} className="px-3 py-1.5 rounded-lg text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">
              ↺ reset
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Switch <b className="text-ink">room</b> and watch the log fire <span style={{ color: "#D97706" }}>cleanup(old)</span> then{" "}
          <span style={{ color: "#8B5CF6" }}>setup(new)</span>, in that order. With <span className="font-mono text-[13px]">[roomId]</span>,{" "}
          <b className="text-ink">force re-render</b> bumps the render count but the log stays put (deps gate the effect, not the render).
          With <span className="font-mono text-[13px]">[{"{…}"}]</span> or no array, every render re-fires it.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          Real browser React with a real useEffect — firing and ordering are genuine (RN shares the reconciler). The chat
          client is a stub (no network). StrictMode is off here so counts read clean; in real dev you&apos;d see one extra
          setup/cleanup pair on mount, which is exactly why cleanup must be symmetric.
        </p>
      </div>
    </div>
  )
}
