"use client"

import { useState } from "react"
import { motion } from "framer-motion"

type Props = { textValue: string; imageVer: number }
type Box = { x: number; y: number; w: number; h: number }

const TEXTS = ["Hi", "Hello there", "Welcome back"]

// REAL toy layout: a flex column on the root. Honest arithmetic, not Yoga.
function layout(p: Props): Record<string, Box> {
  const tw = Math.min(p.textValue.length * 9 + 24, 351)
  return {
    root: { x: 0, y: 0, w: 375, h: 176 },
    text: { x: 12, y: 12, w: tw, h: 24 },
    image: { x: 12, y: 44, w: 120, h: 120 },
  }
}

// REAL diff vs the mounted baseline → minimal mutation list.
function diff(base: Props | null, next: Props): { id: string; op: string }[] {
  if (!base) return ["root", "text", "image"].map((id) => ({ id, op: "createView" }))
  const out: { id: string; op: string }[] = []
  if (base.textValue !== next.textValue) out.push({ id: "text", op: "updateView({ value })" })
  if (base.imageVer !== next.imageVer) out.push({ id: "image", op: "updateView({ source })" })
  return out
}

// REAL clone set: a node is cloned if its props changed; the root is cloned if
// any descendant changed (clone the path to the root). Everything else is shared.
function cloneSet(base: Props | null, next: Props): Set<string> {
  if (!base) return new Set(["root", "text", "image"]) // first render: all created
  const s = new Set<string>()
  if (base.textValue !== next.textValue) s.add("text")
  if (base.imageVer !== next.imageVer) s.add("image")
  if (s.size) s.add("root")
  return s
}

const TYPE: Record<string, string> = { root: "View", text: "Text", image: "Image" }
const PHASES = ["RENDER", "COMMIT", "MOUNT"]
const PHASE_COLOR = ["#4F46E5", "#7C3AED", "#0891B2"]

export default function RenderPipelinePlayground() {
  const [baseline, setBaseline] = useState<Props | null>(null)
  const [pending, setPending] = useState<Props>({ textValue: TEXTS[0], imageVer: 1 })
  const [phase, setPhase] = useState(0) // 0 idle, 1 rendered, 2 committed, 3 mounted
  const [cloned, setCloned] = useState<Set<string> | null>(null)
  const [muts, setMuts] = useState<{ id: string; op: string }[] | null>(null)

  const boxes = layout(pending)

  const step = () => {
    if (phase === 0) {
      setCloned(cloneSet(baseline, pending))
      setPhase(1)
    } else if (phase === 1) {
      setPhase(2)
    } else if (phase === 2) {
      setMuts(diff(baseline, pending))
      setBaseline(pending)
      setPhase(3)
    }
  }
  const editText = () => {
    setPending((p) => ({ ...p, textValue: TEXTS[(TEXTS.indexOf(p.textValue) + 1) % TEXTS.length] }))
    setPhase(0); setCloned(null); setMuts(null)
  }
  const editImage = () => {
    setPending((p) => ({ ...p, imageVer: p.imageVer + 1 }))
    setPhase(0); setCloned(null); setMuts(null)
  }
  const reset = () => {
    setBaseline(null); setPending({ textValue: TEXTS[0], imageVer: 1 }); setPhase(0); setCloned(null); setMuts(null)
  }

  const changedIds = new Set((muts ?? []).map((m) => m.id))
  const TreeNode = ({ id }: { id: string }) => {
    const badge = phase >= 1 && cloned ? (cloned.has(id) ? (baseline ? "cloned" : "created") : "shared") : null
    const b = boxes[id]
    return (
      <div className="rounded-lg border-2 px-3 py-2 bg-paper" style={{ borderColor: badge === "shared" ? "#94A3B8" : badge ? "#D97706" : "#e5e7eb", minWidth: 120 }}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[12px] text-ink">{TYPE[id]}</span>
          {badge && (
            <span className="text-[9px] font-mono px-1.5 rounded" style={{ color: badge === "shared" ? "#64748B" : "#D97706", background: badge === "shared" ? "#94A3B815" : "#D9770615" }}>{badge}</span>
          )}
        </div>
        {id === "text" && <span className="text-[10px] text-ink-faint">"{pending.textValue}"</span>}
        {phase >= 2 && <p className="text-[9px] font-mono text-ink-faint mt-0.5">{b.x},{b.y} · {b.w}×{b.h}</p>}
      </div>
    )
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      {/* phase rail */}
      <div className="flex items-center justify-center gap-1.5 pt-5">
        {PHASES.map((p, i) => (
          <span key={p} className="flex items-center gap-1.5">
            <span className="text-[12px] font-mono px-2.5 py-1 rounded-md transition-colors" style={{ color: phase > i ? "#fff" : "#94A3B8", background: phase > i ? PHASE_COLOR[i] : "transparent", border: `1px solid ${phase > i ? PHASE_COLOR[i] : "#e5e7eb"}` }}>{p}</span>
            {i < 2 && <span className="text-ink-faint text-[11px]">→</span>}
          </span>
        ))}
      </div>

      <div className="flex-1 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 py-5">
        {/* shadow tree */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[12px] font-semibold text-ink">shadow tree</p>
          <TreeNode id="root" />
          <div className="h-4 w-px bg-line" />
          <div className="flex gap-4">
            <TreeNode id="text" />
            <TreeNode id="image" />
          </div>
        </div>

        {/* host side + mutations */}
        <div className="w-[260px]">
          <p className="text-[12px] font-semibold text-ink mb-2">host views (main thread)</p>
          <div className="flex gap-2 mb-3">
            {["root", "text", "image"].map((id) => (
              <motion.div
                key={id}
                animate={phase >= 3 && changedIds.has(id) ? { scale: [1, 1.12, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="flex-1 rounded-lg border px-2 py-2 text-center"
                style={{ borderColor: phase >= 3 && changedIds.has(id) ? "#0891B2" : "#e5e7eb", background: phase >= 3 && changedIds.has(id) ? "#0891B210" : "transparent" }}
              >
                <span className="text-[10px] font-mono" style={{ color: phase >= 3 && changedIds.has(id) ? "#0891B2" : "#94A3B8" }}>{TYPE[id]}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-[12px] font-semibold text-ink mb-1">mutations</p>
          <div className="rounded-lg border border-line bg-ink/[0.03] p-2.5 min-h-[72px] font-mono text-[11px] text-ink-soft">
            {phase < 3 ? (
              <span className="text-ink-faint">run to MOUNT to see the diff</span>
            ) : muts && muts.length ? (
              muts.map((m, i) => <div key={i}>{m.op === "createView" ? `createView(${TYPE[m.id]})` : `${m.op.split("(")[0]}(${TYPE[m.id]})`}</div>)
            ) : (
              <span className="text-ink-faint">no change → no mutations</span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
          <button onClick={step} disabled={phase === 3} className="px-4 py-2 rounded-xl text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40" style={{ background: "var(--accent)" }}>
            {phase === 0 ? "▶ Render" : phase === 1 ? "▶ Commit" : phase === 2 ? "▶ Mount" : "✓ mounted"}
          </button>
          <button onClick={editText} className="px-3 py-2 rounded-xl text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors">edit Text</button>
          <button onClick={editImage} className="px-3 py-2 rounded-xl text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors">edit Image</button>
          <button onClick={reset} className="px-3 py-2 rounded-xl text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">↺ reset</button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Step <b className="text-ink">Render → Commit → Mount</b>. Render builds the tree (first time, all nodes are created); edit a node and re-run
          and only the changed node and its ancestors clone — the sibling stays <b className="text-ink">shared</b>. Commit fills in each node's layout box.
          Mount diffs and applies the minimal mutations — only the changed host view pulses.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          The clone set, the structural sharing, the diff, and the layout math are real JavaScript, computed live from the tree above. Simulated: the "C++",
          the thread labels, and the native views — those are plain JS objects, not real Yoga or Fabric, and the layout is a toy flex column. A teaching model
          of render → commit → mount, in your browser, not React Native.
        </p>
      </div>
    </div>
  )
}
