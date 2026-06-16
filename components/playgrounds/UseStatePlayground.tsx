"use client"

import { memo, useCallback, useRef, useState } from "react"
import { motion } from "framer-motion"

// A live render-count badge that pulses each time it changes.
function RenderBadge({ n, color }: { n: number; color: string }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 1.35, opacity: 0.55 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="text-[10px] font-mono px-1.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ color, background: `${color}1a` }}
    >
      {n} render{n === 1 ? "" : "s"}
    </motion.span>
  )
}

// A real child component that counts its own renders.
function Row({ label, color }: { label: string; color: string }) {
  const r = useRef(0)
  r.current += 1
  return (
    <div className="rounded-xl border border-line bg-paper px-3 py-2.5 flex items-center justify-between gap-2">
      <span className="text-[12px] font-medium text-ink">{label}</span>
      <RenderBadge n={r.current} color={color} />
    </div>
  )
}
const MemoRow = memo(Row)

// The real React tree being observed.
function Demo({ memoOn, updater }: { memoOn: boolean; updater: boolean }) {
  const [count, setCount] = useState(0)
  const pr = useRef(0)
  pr.current += 1

  const bump = useCallback(() => {
    if (updater) setCount((c) => c + 1)
    else setCount(count + 1)
  }, [count, updater])

  const bump3 = useCallback(() => {
    if (updater) {
      setCount((c) => c + 1)
      setCount((c) => c + 1)
      setCount((c) => c + 1)
    } else {
      setCount(count + 1)
      setCount(count + 1)
      setCount(count + 1)
    }
  }, [count, updater])

  const RowB = memoOn ? MemoRow : Row

  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <div className="rounded-xl border-2 px-4 py-3 flex items-center justify-between bg-paper-2" style={{ borderColor: "#4F46E5" }}>
        <div>
          <p className="text-sm font-semibold text-ink">Counter</p>
          <p className="text-[12px] text-ink-soft mt-0.5">
            count: <span className="font-mono font-bold text-ink text-sm">{count}</span>
          </p>
        </div>
        <RenderBadge n={pr.current} color="#4F46E5" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Row label="Row A" color="#3B82F6" />
        <RowB label={memoOn ? "Row B · memo" : "Row B"} color={memoOn ? "#059669" : "#3B82F6"} />
      </div>

      <div className="flex gap-2.5 pt-1">
        <button
          onClick={bump}
          className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold active:scale-95 transition-transform shadow-[0_4px_14px_-6px_rgba(20,158,202,0.6)]"
          style={{ background: "var(--accent)" }}
        >
          +1
        </button>
        <button
          onClick={bump3}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors"
        >
          setCount × 3
        </button>
      </div>
    </div>
  )
}

export default function UseStatePlayground() {
  const [memoOn, setMemoOn] = useState(true)
  const [updater, setUpdater] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const demoKey = `${memoOn}-${updater}-${resetKey}`

  const Toggle = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-colors ${
        on ? "border-line-strong bg-paper-2 text-ink shadow-sm" : "border-line text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <Demo key={demoKey} memoOn={memoOn} updater={updater} />
      </div>

      <div className="border-t border-line bg-paper-2 px-5 py-5">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
          <span className="text-xs text-ink-faint mr-1">Row B</span>
          <Toggle on={memoOn} onClick={() => setMemoOn((v) => !v)}>{memoOn ? "React.memo ON" : "React.memo OFF"}</Toggle>
          <span className="text-xs text-ink-faint ml-2 mr-1">Updater</span>
          <Toggle on={updater} onClick={() => setUpdater((v) => !v)}>{updater ? "c => c + 1" : "count + 1"}</Toggle>
          <button onClick={() => setResetKey((k) => k + 1)} className="px-3 py-1.5 rounded-lg text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">
            ↺ reset
          </button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Tap <b className="text-ink">+1</b> — Counter and Row A re-render together. Row B is memo&apos;d, so it bails out
          (turn memo off to see it join in). Hit <b className="text-ink">setCount × 3</b> (one tap, three calls): the
          render badge moves <b className="text-ink">once</b> (batching), and with <span className="font-mono text-[13px]">count + 1</span> it
          only adds 1 — switch the updater to <span className="font-mono text-[13px]">c =&gt; c + 1</span> for +3.
        </p>

        <p className="mt-3 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          Real browser React in a card — no React Native here. The render counts, batching, the memo bail-out, and the
          count+1-vs-functional result are real React behavior (RN uses the same reconciler). The badge pulse is just a
          highlight.
        </p>
      </div>
    </div>
  )
}
