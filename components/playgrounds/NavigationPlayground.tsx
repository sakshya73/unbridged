"use client"

import { useReducer, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Route = { key: string; name: string }
type NavState = { index: number; routes: Route[] }
type Action = { type: "PUSH"; name: string; key: string } | { type: "POP" } | { type: "RESET"; key: string }

// The real router reducer: (state, action) => nextState. PUSH appends + focuses;
// POP removes the top (the only action that unmounts a screen); never mutates.
function reducer(state: NavState, action: Action): NavState {
  switch (action.type) {
    case "PUSH":
      return { index: state.routes.length, routes: [...state.routes, { key: action.key, name: action.name }] }
    case "POP":
      if (state.routes.length <= 1) return state
      return { index: state.routes.length - 2, routes: state.routes.slice(0, -1) }
    case "RESET":
      return { index: 0, routes: [{ key: action.key, name: "Home" }] }
    default:
      return state
  }
}

const PUSH_ORDER = ["Details", "Profile", "Settings"]
const TABS = ["Feed", "Search", "Profile"]
const COLOR: Record<string, string> = { Home: "#0D9488", Details: "#3B82F6", Profile: "#8B5CF6", Settings: "#D97706", Feed: "#0D9488", Search: "#3B82F6" }

export default function NavigationPlayground() {
  const keyRef = useRef(1)
  const nextKey = () => `r${keyRef.current++}`
  const [mode, setMode] = useState<"stack" | "tabs">("stack")
  const [stack, dispatch] = useReducer(reducer, { index: 0, routes: [{ key: "r0", name: "Home" }] })
  const [tabIndex, setTabIndex] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(new Set([0]))

  const push = () => {
    const name = PUSH_ORDER[Math.min(stack.routes.length - 1, PUSH_ORDER.length - 1)]
    dispatch({ type: "PUSH", name, key: nextKey() })
  }
  const pop = () => dispatch({ type: "POP" })
  const reset = () => {
    dispatch({ type: "RESET", key: nextKey() })
    setTabIndex(0)
    setVisited(new Set([0]))
  }
  const jumpTab = (i: number) => {
    setTabIndex(i)
    setVisited((v) => new Set(v).add(i))
  }

  const tabState: NavState = { index: tabIndex, routes: TABS.map((name, i) => ({ key: `t${i}`, name })) }
  const shown = mode === "stack" ? stack : tabState
  const mounted = mode === "stack" ? stack.routes.length : visited.size
  const canPush = mode === "stack" && stack.routes.length < PUSH_ORDER.length + 1
  const canPop = mode === "stack" && stack.routes.length > 1

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 py-6">
        {/* phone frame */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-[230px] h-[400px] rounded-[28px] bg-ink p-2.5 shadow-[0_20px_50px_-18px_rgba(35,39,47,0.45)]">
            <div className="relative w-full h-full rounded-[22px] bg-paper overflow-hidden">
              {mode === "stack" ? (
                <AnimatePresence initial={false}>
                  {stack.routes.map((r, i) => {
                    const depth = stack.routes.length - 1 - i // 0 = top/focused
                    return (
                      <motion.div
                        key={r.key}
                        initial={{ x: 230, opacity: 0 }}
                        animate={{ x: 0, opacity: 1, scale: 1 - depth * 0.03, y: -depth * 10 }}
                        exit={{ x: 230, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className="absolute inset-0 rounded-[22px] border-t-4 flex flex-col"
                        style={{ borderColor: COLOR[r.name] ?? "#64748B", background: "var(--paper, #fff)", zIndex: i }}
                      >
                        <div className="px-4 py-3 border-b border-line">
                          <p className="text-[11px] font-mono text-ink-faint">route {i}{i === stack.index ? " · focused" : " · mounted"}</p>
                          <p className="text-lg font-semibold" style={{ color: COLOR[r.name] }}>{r.name}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-[12px] text-ink-faint">{r.name} screen</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
                    <p className="text-lg font-semibold" style={{ color: COLOR[TABS[tabIndex]] }}>{TABS[tabIndex]}</p>
                    <p className="text-[11px] text-ink-faint">tab {tabIndex} · focused</p>
                  </div>
                  <div className="flex border-t border-line">
                    {TABS.map((t, i) => (
                      <button
                        key={t}
                        onClick={() => jumpTab(i)}
                        className="flex-1 py-2.5 text-[11px] font-medium transition-colors"
                        style={{ color: i === tabIndex ? COLOR[t] : "var(--ink-faint, #94a3b8)", background: i === tabIndex ? `${COLOR[t]}12` : "transparent" }}
                      >
                        {t}
                        {!visited.has(i) && <span className="block text-[8px] text-ink-faint">lazy</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-1">
            <span className="text-[11px] text-ink-soft">mounted screens</span>
            <span className="font-mono font-bold text-sm" style={{ color: "#0D9488" }}>{mounted}</span>
          </span>
        </div>

        {/* live navigation state tree */}
        <div className="w-[280px]">
          <p className="text-[12px] font-semibold text-ink mb-2">navigation state</p>
          <pre className="rounded-xl border border-line bg-ink/[0.03] p-3 font-mono text-[11px] leading-relaxed text-ink-soft overflow-x-auto min-h-[200px]">
{JSON.stringify({ index: shown.index, routes: shown.routes.map((r) => ({ name: r.name })) }, null, 2)}
          </pre>
          <p className="mt-1.5 text-[11px] text-ink-faint">focused = routes[{shown.index}] = {shown.routes[shown.index]?.name}</p>
        </div>
      </div>

      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
          <div className="flex bg-ink/[0.05] rounded-lg p-0.5 text-sm">
            <button onClick={() => setMode("stack")} className={`px-3 py-1 rounded-md transition-all ${mode === "stack" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}>Stack</button>
            <button onClick={() => setMode("tabs")} className={`px-3 py-1 rounded-md transition-all ${mode === "tabs" ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}>Tabs</button>
          </div>
          {mode === "stack" ? (
            <>
              <button onClick={push} disabled={!canPush} className="px-4 py-2 rounded-xl text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40" style={{ background: "var(--accent)" }}>
                Push screen
              </button>
              <button onClick={pop} disabled={!canPop} className="px-3.5 py-2 rounded-xl text-[13px] font-medium border border-line bg-paper-2 hover:border-line-strong transition-colors disabled:opacity-40">
                ← Go back
              </button>
            </>
          ) : (
            <span className="text-[12px] text-ink-soft">tap a tab below the phone to switch — watch mounted tick up only on a tab's first visit</span>
          )}
          <button onClick={reset} className="px-3 py-2 rounded-xl text-[13px] text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors">↺ reset</button>
        </div>

        <p className="text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          Hit <b className="text-ink">Push</b> and the state tree grows a route and moves its <span className="font-mono text-[13px]">index</span> — the
          mounted count climbs because screens below stay mounted. <b className="text-ink">Go back</b> pops the top route, the only action that drops the count.
          Switch to <b className="text-ink">Tabs</b>: tapping a tab changes <span className="font-mono text-[13px]">index</span> without pushing, and a tab only mounts the first time you visit it.
        </p>
        <p className="mt-2 text-center text-[12px] text-ink-faint max-w-2xl mx-auto leading-relaxed">
          The reducer, the <span className="font-mono">{"{ index, routes }"}</span> state tree, the mounted-screen count, and the focused index are real
          JavaScript — the same (state, action) =&gt; nextState model React Navigation uses. Only the phone frame and the slide between cards are simulated:
          real native-stack runs that transition and the edge-swipe back gesture on the platform's UI thread. No react-native here — browser React.
        </p>
      </div>
    </div>
  )
}
