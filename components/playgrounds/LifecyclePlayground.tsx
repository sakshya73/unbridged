"use client"

import { memo, useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Entry = { key: number; phase: string }

// phase → display color. (paint) is the only inserted marker; the rest are real.
const PHASE_COLOR: Record<string, string> = {
  render: "#4F46E5",
  "layout effect": "#0EA5E9",
  "layout cleanup": "#0EA5E9",
  "(paint)": "#94A3B8",
  "passive effect": "#8B5CF6",
  cleanup: "#D97706",
}

// A REAL child. Each lifecycle moment calls onLog in React's genuine order.
// First mount: render → layout effect → (paint marker) → passive effect.
// Update (deps changed): render → layout cleanup → layout effect → (paint) → passive cleanup → passive effect.
function ProfileScreen({ name, onLog }: { name: string; onLog: (p: string) => void }) {
  const renders = useRef(0)
  renders.current += 1
  onLog("render")

  useLayoutEffect(() => {
    onLog("layout effect")
    onLog("(paint)") // inserted marker: paint happens here, after layout effects, before passive
    return () => onLog("layout cleanup")
  })

  useEffect(() => {
    onLog("passive effect")
    return () => onLog("cleanup")
  }, [name])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="rounded-2xl border-2 px-5 py-4 bg-paper-2 w-[200px]"
      style={{ borderColor: "#4F46E5" }}
    >
      <p className="text-[12px] text-ink-faint font-mono mb-1">ProfileScreen</p>
      <p className="text-xl font-semibold text-ink">{name}</p>
      <p className="mt-2 text-[12px] text-ink-soft">
        renders: <span className="font-mono font-bold text-ink">{renders.current}</span>
      </p>
    </motion.div>
  )
}
const MemoProfile = memo(ProfileScreen)

const NAMES = ["Ada", "Lin", "Mei", "Rey"]

export default function LifecyclePlayground() {
  const [mounted, setMounted] = useState(true)
  const [name, setName] = useState(NAMES[0])
  const logRef = useRef<Entry[]>([])
  const keyRef = useRef(0)
  const pendingRef = useRef(false)
  const mountsRef = useRef(1)
  const [, force] = useReducer((x: number) => x + 1, 0)

  // Append to the log via a ref (safe to call during the child's render — it does
  // NOT setState synchronously), then batch one re-render per microtask tick so
  // a whole lifecycle pass shows up in one go, in real order.
  const push = useCallback((phase: string) => {
    logRef.current = [...logRef.current, { key: keyRef.current++, phase }].slice(-11)
    if (!pendingRef.current) {
      pendingRef.current = true
      queueMicrotask(() => {
        pendingRef.current = false
        force()
      })
    }
  }, [])

  const toggleMount = () => {
    setMounted((m) => {
      if (!m) mountsRef.current += 1
      return !m
    })
  }
  const rename = () => setName((n) => NAMES[(NAMES.indexOf(n) + 1) % NAMES.length])
  const reset = () => {
    logRef.current = []
    keyRef.current = 0
    mountsRef.current = 1
    setName(NAMES[0])
    setMounted(true)
    force()
  }

  const entries = logRef.current

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 py-6">
        {/* the live child (or empty slot when unmounted) */}
        <div className="h-[150px] w-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {mounted ? (
              <MemoProfile key="profile" name={name} onLog={push} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-line w-[200px] h-[108px] flex items-center justify-center"
              >
                <span className="text-[12px] text-ink-faint">unmounted</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* the real lifecycle log */}
        <div className="w-[280px] rounded-2xl border border-line bg-paper-2 p-3.5">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-line">
            <span className="text-[12px] font-semibold text-ink">lifecycle log</span>
            <span className="text-[11px] text-ink-faint font-mono">mounts: {mountsRef.current}</span>
          </div>
          <div className="flex flex-col gap-1 min-h-[180px]">
            <AnimatePresence initial={false}>
              {entries.map((entry) => (
                <motion.div
                  key={entry.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-[12px] font-mono"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PHASE_COLOR[entry.phase] ?? "#94A3B8" }} />
                  <span style={{ color: PHASE_COLOR[entry.phase] ?? "#94A3B8" }}>{entry.phase}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {entries.length === 0 && <span className="text-[12px] text-ink-faint">— hit Mount to begin —</span>}
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
          <button
            onClick={toggleMount}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold active:scale-95 transition-transform shadow-[0_4px_14px_-6px_rgba(20,158,202,0.6)]"
            style={{ background: "var(--accent)" }}
          >
            {mounted ? "Unmount" : "Mount"}
          </button>
          <button
            onClick={rename}
            disabled={!mounted}
            className="px-3.5 py-2 rounded-xl text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors disabled:opacity-40"
          >
            Rename (update)
          </button>
          <button onClick={reset} className="px-3 py-2 rounded-xl text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">
            ↺ reset
          </button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Hit <b className="text-ink">Mount</b> and watch the real order: render → layout effect → (paint) → passive effect.
          <b className="text-ink"> Rename</b> to force an update — the <span className="font-mono text-[13px]">[name]</span> effect runs
          cleanup first, then setup. Hit <b className="text-ink">Unmount</b> and every cleanup fires before the card is gone.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          Real browser React — the render count and the order of these logs are genuine (React Native runs the same reconciler).
          The <span className="font-mono">(paint)</span> line is a marker we insert between the synchronous layout effect and the
          deferred passive effect; React gives no real paint callback. There's no native view or Fabric here. StrictMode is off so
          counts read clean; in real dev you'd see one extra mount → unmount → mount pass.
        </p>
      </div>
    </div>
  )
}
