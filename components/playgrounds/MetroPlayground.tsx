"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"

// A fixed toy module graph. The DFS walk, id assignment, dependency arrays, and
// the __d/__r bundle text are all computed for real from this. appConfig.js is
// imported by index.js at registration — OUTSIDE the React tree — which is what
// makes editing it force a full reload (vs a component edit, which hot-swaps).
type Kind = "entry" | "component" | "module" | "config"
const GRAPH: Record<string, { imports: string[]; kind: Kind }> = {
  "index.js": { imports: ["App.js", "appConfig.js"], kind: "entry" },
  "App.js": { imports: ["Button.js", "utils.js"], kind: "component" },
  "Button.js": { imports: ["theme.js"], kind: "component" },
  "utils.js": { imports: ["theme.js"], kind: "module" },
  "theme.js": { imports: [], kind: "module" },
  "appConfig.js": { imports: [], kind: "config" },
}
const ENTRY = "index.js"

// Real post-order DFS from the entry: dependencies get ids before dependents.
function resolveOrder(): string[] {
  const order: string[] = []
  const seen = new Set<string>()
  const visit = (name: string) => {
    if (seen.has(name)) return
    seen.add(name)
    for (const dep of GRAPH[name].imports) visit(dep)
    order.push(name)
  }
  visit(ENTRY)
  return order
}

// Real reverse-dependency lookup: who imports this module (direct importers).
function importersOf(target: string): string[] {
  return Object.keys(GRAPH).filter((m) => GRAPH[m].imports.includes(target))
}

const KIND_COLOR: Record<Kind, string> = {
  entry: "#4F46E5",
  component: "#059669",
  module: "#8B5CF6",
  config: "#D97706",
}

type Phase = "idle" | "resolved" | "transformed" | "serialized"

export default function MetroPlayground() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [ids, setIds] = useState<Record<string, number>>({})
  const [cached, setCached] = useState<Set<string>>(new Set())
  const [flash, setFlash] = useState<Set<string>>(new Set())
  const [count, setCount] = useState(0)
  const [lastAction, setLastAction] = useState<string>("")
  const flashTimer = useRef<number>(0)

  const order = useMemo(() => resolveOrder(), [])

  const doFlash = useCallback((names: string[]) => {
    window.clearTimeout(flashTimer.current)
    setFlash(new Set(names))
    flashTimer.current = window.setTimeout(() => setFlash(new Set()), 900)
  }, [])

  const runResolve = () => {
    const assigned: Record<string, number> = {}
    order.forEach((name, i) => (assigned[name] = i))
    setIds(assigned)
    setPhase("resolved")
    setLastAction("")
    doFlash(order)
  }

  const runTransform = () => {
    if (phase === "idle") return
    // second run: everything is cached (real Set of already-transformed ids)
    if (phase === "transformed" || phase === "serialized") {
      setCached(new Set(order))
    } else {
      setCached(new Set())
    }
    setPhase("transformed")
    doFlash(order)
  }

  const bundleText = useMemo(() => {
    if (Object.keys(ids).length === 0) return ""
    const lines = order.map((name) => {
      const deps = GRAPH[name].imports.map((d) => ids[d])
      return `__d(/* ${name} */, ${ids[name]}, [${deps.join(", ")}]);`
    })
    lines.push(`__r(${ids[ENTRY]});   // boot the entry module`)
    return lines.join("\n")
  }, [ids, order])

  const runSerialize = () => {
    if (phase === "idle") return
    setPhase("serialized")
    doFlash(order)
  }

  const reset = () => {
    setPhase("idle")
    setIds({})
    setCached(new Set())
    setFlash(new Set())
    setCount(0)
    setLastAction("")
  }

  const editComponent = () => {
    // real reverse-dep: re-send Button + its importers; state PRESERVED
    const resend = ["Button.js", ...importersOf("Button.js")]
    doFlash(resend)
    setLastAction("Fast Refresh · re-sent Button.js — state kept")
    // count is NOT reset
  }
  const editConfig = () => {
    // appConfig is imported by index OUTSIDE the React tree → full reload
    doFlash(order)
    setCount(0)
    setLastAction("Full reload · appConfig.js is imported outside the React tree — state reset")
  }

  const canRefresh = phase === "serialized"

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-wrap items-start justify-center gap-x-8 gap-y-5 px-6 py-6">
        {/* module graph */}
        <div className="w-[260px]">
          <p className="text-[12px] font-semibold text-ink mb-2">module graph</p>
          <div className="flex flex-col gap-1.5">
            {order.length === 0 && <span className="text-[12px] text-ink-faint">hit Resolve to walk the graph</span>}
            {(phase === "idle" ? Object.keys(GRAPH) : order).map((name) => {
              const kind = GRAPH[name].kind
              const isFlash = flash.has(name)
              return (
                <motion.div
                  key={name}
                  animate={{ scale: isFlash ? 1.03 : 1, borderColor: isFlash ? KIND_COLOR[kind] : "var(--line, #e5e7eb)" }}
                  className="flex items-center justify-between rounded-lg border bg-paper px-3 py-1.5"
                  style={{ borderColor: isFlash ? KIND_COLOR[kind] : undefined }}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: KIND_COLOR[kind] }} />
                    <span className="font-mono text-[12px] text-ink">{name}</span>
                    {kind === "config" && <span className="text-[10px] text-ink-faint">(outside tree)</span>}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {cached.has(name) && phase !== "resolved" && <span className="text-[10px] text-ink-faint">cached</span>}
                    {ids[name] !== undefined && (
                      <span className="text-[11px] font-mono font-bold px-1.5 rounded" style={{ color: KIND_COLOR[kind], background: `${KIND_COLOR[kind]}1a` }}>
                        id {ids[name]}
                      </span>
                    )}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* serialized bundle */}
        <div className="w-[320px]">
          <p className="text-[12px] font-semibold text-ink mb-2">serialized bundle</p>
          <div className="rounded-xl border border-line bg-ink/[0.03] p-3 min-h-[170px] font-mono text-[11px] leading-relaxed text-ink-soft whitespace-pre overflow-x-auto">
            {phase === "serialized" ? bundleText : <span className="text-ink-faint">run Resolve → Transform → Serialize</span>}
          </div>
          {canRefresh && (
            <div className="mt-3 rounded-xl border border-line bg-paper-2 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-ink-soft">app state</span>
                <button onClick={() => setCount((c) => c + 1)} className="text-[12px] font-mono px-2 py-0.5 rounded border border-line hover:border-line-strong">
                  count = <b className="text-ink">{count}</b> · +1
                </button>
              </div>
              {lastAction && <p className="mt-2 text-[11px] text-ink-faint leading-snug">{lastAction}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
          <button onClick={runResolve} className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors">
            ▶ Resolve
          </button>
          <button onClick={runTransform} disabled={phase === "idle"} className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors disabled:opacity-40">
            ▶ Transform
          </button>
          <button onClick={runSerialize} disabled={phase === "idle"} className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors disabled:opacity-40">
            ▶ Serialize
          </button>
          <button onClick={reset} className="px-3 py-1.5 rounded-lg text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">
            ↺ reset
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
          <span className="text-[11px] text-ink-faint">Fast Refresh:</span>
          <button onClick={editComponent} disabled={!canRefresh} className="px-3 py-1 rounded-lg text-[12px] font-medium border transition-colors disabled:opacity-40" style={{ borderColor: "#059669", color: "#059669" }}>
            edit Button.js (component)
          </button>
          <button onClick={editConfig} disabled={!canRefresh} className="px-3 py-1 rounded-lg text-[12px] font-medium border transition-colors disabled:opacity-40" style={{ borderColor: "#D97706", color: "#D97706" }}>
            edit appConfig.js (outside tree)
          </button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Step the pipeline: <b className="text-ink">Resolve</b> walks the graph and assigns numeric ids, <b className="text-ink">Transform</b> runs each
          module through Babel (cached on a second run), <b className="text-ink">Serialize</b> emits the <span className="font-mono text-[13px]">__d</span>/<span className="font-mono text-[13px]">__r</span> bundle.
          Then bump the counter and edit a module: a component edit keeps your state; editing the config (imported outside the React tree) forces a full reload.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          A simulation — Metro runs on your machine, not in the browser. What's real here is the JavaScript: the dependency-graph
          walk, the post-order id assignment, the dependency arrays, the reverse-dependency lookup, and the <span className="font-mono">__d</span>/<span className="font-mono">__r</span> bundle text are all
          computed live. The Babel transform output and the "workers"/websocket are faked.
        </p>
      </div>
    </div>
  )
}
