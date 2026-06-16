"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DiagramState, Packet, DiagramNode } from "@/lib/types"
import DiagramRenderer from "@/components/DiagramRenderer"

const JS_MOUTH = { x: 272, y: 210 }
const NATIVE_MOUTH = { x: 528, y: 210 }
const FLIGHT_MS = 1400

const bridgeNode: DiagramNode = {
  id: "bridge",
  label: "The Bridge",
  x: 300,
  y: 185,
  width: 200,
  height: 50,
  style: "pill",
  color: "#D97706",
}

type Dir = "out" | "in"

export default function BridgePlayground() {
  const [sync, setSync] = useState(false) // false = async (how RN really works)
  const [blocking, setBlocking] = useState(false) // sync mode: JS frozen mid-call
  const [flights, setFlights] = useState<Packet[]>([])
  const [pulse, setPulse] = useState<"js" | "native" | null>(null)
  const [likes, setLikes] = useState(0)
  const [renders, setRenders] = useState<string[]>([])
  const idRef = useRef(0)

  const applyArrival = useCallback((dir: Dir) => {
    if (dir === "in") setLikes((l) => l + 1)
    else setRenders((r) => [...r, `Text #${r.length + 1}`])
  }, [])

  const launch = useCallback(
    (dir: Dir, onArrive?: () => void) => {
      const id = ++idRef.current
      const from = dir === "out" ? JS_MOUTH : NATIVE_MOUTH
      const to = dir === "out" ? NATIVE_MOUTH : JS_MOUTH
      const lane = dir === "out" ? 0 : 24
      const flight: Packet = {
        id: `f${id}`,
        x: from.x,
        y: from.y + lane,
        toX: to.x,
        toY: to.y + lane,
        label: dir === "out" ? "{ create }" : "{ onPress }",
        color: dir === "out" ? "#149eca" : "#D97706",
      }
      setFlights((f) => [...f, flight])
      window.setTimeout(() => {
        setFlights((f) => f.filter((x) => x.id !== flight.id))
        setPulse(dir === "out" ? "native" : "js")
        applyArrival(dir)
        window.setTimeout(() => setPulse(null), 700)
        onArrive?.()
      }, FLIGHT_MS)
    },
    [applyArrival]
  )

  const fire = useCallback(
    (dir: Dir) => {
      if (sync) {
        if (blocking) return // JS is frozen — you literally cannot do anything
        setBlocking(true)
        launch(dir, () => setBlocking(false))
      } else {
        launch(dir) // fire and keep running
      }
    },
    [sync, blocking, launch]
  )

  const switchMode = (toSync: boolean) => {
    setSync(toSync)
    setBlocking(false)
  }

  const reset = () => {
    setBlocking(false)
    setFlights([])
    setPulse(null)
    setLikes(0)
    setRenders([])
  }

  const frozen = sync && blocking

  // ---- diagram ----
  const js: DiagramNode = {
    id: "js",
    label: frozen ? "JS Thread\n(frozen — waiting)" : "JS Thread\nyour React code",
    x: 60,
    y: 150,
    width: 200,
    height: 120,
    style: "box",
    color: frozen ? "#DC2626" : "#4F46E5",
  }
  const native: DiagramNode = {
    id: "native",
    label: "Native UI Thread\nreal views",
    x: 540,
    y: 150,
    width: 200,
    height: 120,
    style: "box",
    color: "#059669",
  }

  const state: DiagramState = {
    nodes: [js, bridgeNode, native],
    edges: [
      { id: "r1", from: "js", to: "bridge", color: "#D8DCE6" },
      { id: "r2", from: "bridge", to: "native", color: "#D8DCE6" },
    ],
    highlighted: pulse ? [pulse] : frozen ? ["js"] : [],
    annotations: frozen
      ? [{ id: "f", text: "JS is frozen until native replies", x: 400, y: 405, color: "#DC2626" }]
      : sync
      ? [{ id: "s", text: "Synchronous: every call blocks the JS thread", x: 400, y: 405, color: "#D97706" }]
      : [{ id: "a", text: "Async: JS fires a message and keeps running", x: 400, y: 405, color: "#059669" }],
    packets: flights,
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
          {/* diagram (hidden on phones so the phone + controls stay in view) */}
          <div className="relative flex-1 w-full max-w-2xl hidden lg:block">
            <DiagramRenderer state={state} viewBox="0 126 800 300" />
          </div>

          {/* phone */}
          <div className="shrink-0">
            <div className="relative w-[210px] h-[380px] rounded-[32px] bg-ink p-2.5 shadow-[0_20px_50px_-18px_rgba(35,39,47,0.45)]">
              <div className="relative w-full h-full rounded-[26px] bg-paper overflow-hidden flex flex-col">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-ink rounded-full z-10" />
                <div className="pt-7 pb-2 text-center border-b border-line bg-paper-2">
                  <p className="font-semibold text-sm">My App</p>
                </div>
                <div className="flex-1 p-4 overflow-hidden">
                  <button
                    onClick={() => fire("in")}
                    disabled={frozen}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm mb-3 active:scale-95 transition-transform disabled:opacity-60"
                    style={{ background: "var(--accent)" }}
                  >
                    ❤ Like
                  </button>
                  <p className="text-xs text-ink-soft mb-3">
                    Likes: <span className="font-bold text-ink text-sm">{likes}</span>
                  </p>
                  <div className="space-y-1.5">
                    <AnimatePresence initial={false}>
                      {renders.slice(-5).map((r, i) => (
                        <motion.div
                          key={`${r}-${i}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs bg-paper-2 border border-line rounded-lg px-2.5 py-1.5 font-mono text-ink-soft"
                        >
                          {r}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <AnimatePresence>
                  {frozen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1"
                    >
                      <span className="text-2xl">🥶</span>
                      <span className="text-xs font-semibold text-red-600">frozen</span>
                      <span className="text-[10px] text-ink-soft">waiting for native…</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs text-ink-faint mr-1">Bridge mode</span>
          <div className="flex bg-ink/[0.05] rounded-lg p-0.5 text-sm">
            <button
              onClick={() => switchMode(false)}
              className={`px-3 py-1 rounded-md transition-all ${!sync ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
              ⚡ Async (real)
            </button>
            <button
              onClick={() => switchMode(true)}
              className={`px-3 py-1 rounded-md transition-all ${sync ? "bg-paper-2 text-ink font-medium shadow-sm" : "text-ink-soft hover:text-ink"}`}
            >
              🐢 Synchronous
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => fire("out")}
            disabled={frozen}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-line bg-white hover:border-line-strong hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            📤 JS renders a <span className="font-mono text-[13px]">&lt;Text&gt;</span>
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-ink/5 transition-all"
          >
            ↺ reset
          </button>
        </div>

        <p className="mt-3 text-center text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
          {sync ? (
            <>
              <b className="text-ink">Synchronous (a phone call):</b> every call freezes the JS thread until native
              replies — try tapping while it&apos;s frozen, nothing happens. This is why RN <i>doesn&apos;t</i> work this way.
            </>
          ) : (
            <>
              <b className="text-ink">Async (texting):</b> JS fires a message and keeps running — spam the buttons,
              the app stays responsive. The replies arrive a moment later. Now flip to Synchronous to feel the difference.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
