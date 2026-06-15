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
  const [busy, setBusy] = useState(false)
  const [queue, setQueue] = useState<{ id: number; dir: Dir }[]>([])
  const [flights, setFlights] = useState<Packet[]>([])
  const [dropped, setDropped] = useState(0)
  const [pulse, setPulse] = useState<"js" | "native" | null>(null)
  // what the phone actually shows
  const [likes, setLikes] = useState(0)
  const [renders, setRenders] = useState<string[]>([])
  const idRef = useRef(0)
  const nextId = () => ++idRef.current

  // the visible effect of a message once it has crossed the bridge
  const applyArrival = useCallback((dir: Dir) => {
    if (dir === "in") setLikes((l) => l + 1)
    else setRenders((r) => [...r, `Text #${r.length + 1}`])
  }, [])

  const launch = useCallback(
    (dir: Dir) => {
      const id = nextId()
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
      }, FLIGHT_MS)
    },
    [applyArrival]
  )

  const send = useCallback(
    (dir: Dir) => {
      if (busy) {
        setQueue((q) => [...q, { id: nextId(), dir }])
        setDropped((d) => d + 1)
      } else {
        launch(dir)
      }
    },
    [busy, launch]
  )

  const toggleBusy = useCallback(() => {
    setBusy((b) => {
      const now = !b
      if (!now) {
        setQueue((q) => {
          q.forEach((msg, i) => window.setTimeout(() => launch(msg.dir), i * 300))
          return []
        })
      }
      return now
    })
  }, [launch])

  const reset = () => {
    setBusy(false)
    setQueue([])
    setFlights([])
    setDropped(0)
    setPulse(null)
    setLikes(0)
    setRenders([])
  }

  // ---- diagram state ----
  const js: DiagramNode = {
    id: "js",
    label: busy ? "JS Thread\n(busy — blocked)" : "JS Thread\nyour React code",
    x: 60,
    y: 150,
    width: 200,
    height: 120,
    style: "box",
    color: busy ? "#DC2626" : "#4F46E5",
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

  const outQueue = queue.filter((m) => m.dir === "out")
  const inQueue = queue.filter((m) => m.dir === "in")
  const queuePackets: Packet[] = [
    ...outQueue.slice(0, 5).map((m, i) => ({ id: `q${m.id}`, x: 285, y: 150 + i * 25, label: "{ create }", color: "#DC2626" })),
    ...inQueue.slice(0, 5).map((m, i) => ({ id: `q${m.id}`, x: 515, y: 150 + i * 25, label: "{ onPress }", color: "#DC2626" })),
  ]

  const state: DiagramState = {
    nodes: [js, bridgeNode, native],
    edges: [
      { id: "r1", from: "js", to: "bridge", color: "#D8DCE6" },
      { id: "r2", from: "bridge", to: "native", color: "#D8DCE6" },
    ],
    highlighted: pulse ? [pulse] : busy ? ["js"] : [],
    annotations: busy ? [{ id: "warn", text: "JS blocked → nothing reaches the screen", x: 400, y: 410, color: "#DC2626" }] : [],
    packets: [...queuePackets, ...flights],
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        {/* diagram */}
        <div className="relative flex-1 w-full max-w-2xl">
          <DiagramRenderer state={state} viewBox="0 126 800 300" />
          <AnimatePresence>
            {busy && dropped > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono font-semibold"
                style={{ background: "#FEE2E2", color: "#DC2626" }}
              >
                ● {dropped} {dropped === 1 ? "message" : "messages"} stuck
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* phone simulator */}
        <div className="shrink-0">
          <div className="relative w-[210px] h-[380px] rounded-[32px] bg-ink p-2.5 shadow-[0_20px_50px_-18px_rgba(35,39,47,0.45)]">
            <div className="relative w-full h-full rounded-[26px] bg-paper overflow-hidden flex flex-col">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-ink rounded-full z-10" />
              <div className="pt-7 pb-2 text-center border-b border-line bg-paper-2">
                <p className="font-semibold text-sm">My App</p>
              </div>
              <div className="flex-1 p-4 overflow-hidden">
                <button
                  onClick={() => send("in")}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm mb-3 active:scale-95 transition-transform"
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

              {/* frozen overlay — taps still queue */}
              <AnimatePresence>
                {busy && (
                  <motion.button
                    onClick={() => send("in")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/55 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="text-2xl">🥶</span>
                    <span className="text-xs font-semibold text-red-600">UI frozen</span>
                    <span className="text-[10px] text-ink-soft">tap anyway — it queues</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* controls */}
      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => send("out")}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-line bg-white hover:border-line-strong hover:-translate-y-0.5 transition-all"
          >
            📤 JS renders a <span className="font-mono text-[13px]">&lt;Text&gt;</span>
          </button>
          <button
            onClick={toggleBusy}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: busy ? "#DC2626" : "#23272f" }}
          >
            {busy ? "🧱 unblock JS thread" : "🧱 Block the JS thread"}
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-ink/5 transition-all"
          >
            ↺ reset
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-ink-soft max-w-xl mx-auto">
          {busy
            ? `Tap the frozen phone — nothing happens, the events just pile up (${queue.length} queued). Unblock and watch them all fire at once.`
            : "Tap ❤ Like or render a <Text>, and watch the message cross the bridge before it shows on screen. Then block the JS thread and try again."}
        </p>
      </div>
    </div>
  )
}
