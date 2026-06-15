"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DiagramState, Packet, DiagramNode } from "@/lib/types"
import DiagramRenderer from "@/components/DiagramRenderer"

// fixed geometry (matches the 800x500 renderer viewBox)
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

interface Flight extends Packet {}

export default function BridgePlayground() {
  const [busy, setBusy] = useState(false)
  const [queue, setQueue] = useState<{ id: number; dir: "out" | "in" }[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [dropped, setDropped] = useState(0)
  const [pulse, setPulse] = useState<"js" | "native" | null>(null)
  const idRef = useRef(0)

  const nextId = () => ++idRef.current

  const launch = useCallback((dir: "out" | "in") => {
    const id = nextId()
    const from = dir === "out" ? JS_MOUTH : NATIVE_MOUTH
    const to = dir === "out" ? NATIVE_MOUTH : JS_MOUTH
    const lane = dir === "out" ? 0 : 24
    const flight: Flight = {
      id: `f${id}`,
      x: from.x,
      y: from.y + lane,
      toX: to.x,
      toY: to.y + lane,
      label: dir === "out" ? '{ create }' : '{ onPress }',
      color: dir === "out" ? "#149eca" : "#D97706",
    }
    setFlights((f) => [...f, flight])
    window.setTimeout(() => {
      setFlights((f) => f.filter((x) => x.id !== flight.id))
      setPulse(dir === "out" ? "native" : "js")
      window.setTimeout(() => setPulse(null), 700)
    }, FLIGHT_MS)
  }, [])

  const send = useCallback(
    (dir: "out" | "in") => {
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
        // unblocking: flush the queue across the bridge, staggered
        setQueue((q) => {
          q.forEach((msg, i) => window.setTimeout(() => launch(msg.dir), i * 280))
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
  }

  // ---- compute diagram state from interactive state ----
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
    label: busy && queue.length ? "Native UI Thread\n(waiting…)" : "Native UI Thread\nreal views",
    x: 540,
    y: 150,
    width: 200,
    height: 120,
    style: "box",
    color: busy && queue.length ? "#94A3B8" : "#059669",
  }

  const queuePackets: Packet[] = queue.slice(0, 5).map((m, i) => ({
    id: `q${m.id}`,
    x: 285,
    y: 150 + i * 25,
    label: m.dir === "out" ? "{ create }" : "{ onPress }",
    color: "#DC2626",
  }))

  const highlighted = pulse ? [pulse] : busy ? ["js"] : []

  const annotations = busy
    ? [{ id: "warn", text: "JS blocked → messages can't cross", x: 400, y: 410, color: "#DC2626" }]
    : []

  const state: DiagramState = {
    nodes: [js, bridgeNode, native],
    edges: [
      { id: "r1", from: "js", to: "bridge", color: "#D8DCE6" },
      { id: "r2", from: "bridge", to: "native", color: "#D8DCE6" },
    ],
    highlighted,
    annotations,
    packets: [...queuePackets, ...flights],
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* diagram */}
      <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
        <div className="w-full max-w-3xl">
          <DiagramRenderer state={state} />
        </div>
        {/* dropped-frame flash */}
        <AnimatePresence>
          {busy && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono font-semibold"
              style={{ background: "#FEE2E2", color: "#DC2626" }}
            >
              ● dropped {dropped} {dropped === 1 ? "message" : "messages"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="border-t border-line bg-paper-2 px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => send("out")}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-line bg-white hover:border-line-strong hover:-translate-y-0.5 transition-all"
          >
            📤 JS renders <span className="font-mono text-[13px]">&lt;Text&gt;</span>
          </button>
          <button
            onClick={() => send("in")}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-line bg-white hover:border-line-strong hover:-translate-y-0.5 transition-all"
          >
            👆 User taps the screen
          </button>
          <button
            onClick={toggleBusy}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: busy ? "#DC2626" : "#23272f" }}
          >
            {busy ? "🧱 JS blocked — click to unblock" : "🧱 Block the JS thread"}
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-ink/5 transition-all"
          >
            ↺ reset
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-ink-soft">
          {busy
            ? `Messages are stacking up in the queue (${queue.length}). Unblock the JS thread and watch them flush across.`
            : "Fire some messages, then block the JS thread and try again — see how the bridge backs up."}
        </p>
      </div>
    </div>
  )
}
