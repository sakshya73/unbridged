"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DiagramState, DiagramNode, DiagramEdge, Packet } from "@/lib/types"

const VIEW_W = 800
const VIEW_H = 500
const DEFAULT_W = 170
const DEFAULT_H = 64

interface Box {
  x: number
  y: number
  w: number
  h: number
  cx: number
  cy: number
  hw: number
  hh: number
}

function boxOf(node: DiagramNode): Box {
  const w = node.width ?? DEFAULT_W
  const h = node.height ?? DEFAULT_H
  return { x: node.x, y: node.y, w, h, cx: node.x + w / 2, cy: node.y + h / 2, hw: w / 2, hh: h / 2 }
}

// Point where the line from a box center toward (tx,ty) crosses the box border.
function borderPoint(b: Box, tx: number, ty: number) {
  const dx = tx - b.cx
  const dy = ty - b.cy
  if (dx === 0 && dy === 0) return { x: b.cx, y: b.cy }
  const sx = dx !== 0 ? b.hw / Math.abs(dx) : Infinity
  const sy = dy !== 0 ? b.hh / Math.abs(dy) : Infinity
  const s = Math.min(sx, sy)
  return { x: b.cx + dx * s, y: b.cy + dy * s }
}

function edgeGeometry(edge: DiagramEdge, boxes: Record<string, Box>) {
  const from = boxes[edge.from]
  const to = boxes[edge.to]
  if (!from || !to) return null
  const start = borderPoint(from, to.cx, to.cy)
  const end = borderPoint(to, from.cx, from.cy)
  const dx = end.x - start.x
  const dy = end.y - start.y
  const dist = Math.hypot(dx, dy)
  // Bow the curve perpendicular to its line. The normal is computed from a
  // CANONICAL endpoint order (lower id → higher id) so an A→B / B→A pair bow to
  // OPPOSITE sides instead of collapsing onto the same curve.
  const fwd = edge.from < edge.to
  const cdx = fwd ? dx : -dx
  const cdy = fwd ? dy : -dy
  const nx = dist === 0 ? 0 : -cdy / dist
  const ny = dist === 0 ? 0 : cdx / dist
  const bow = Math.min(dist * 0.16, 46) * (fwd ? 1 : -1)
  const mx = (start.x + end.x) / 2 + nx * bow
  const my = (start.y + end.y) / 2 + ny * bow
  const path = `M ${start.x} ${start.y} Q ${mx} ${my} ${end.x} ${end.y}`
  // label anchor = point on the quadratic at t=0.5
  const lx = 0.25 * start.x + 0.5 * mx + 0.25 * end.x
  const ly = 0.25 * start.y + 0.5 * my + 0.25 * end.y
  return { path, dist, lx, ly, end }
}

function colorId(color: string) {
  return "c" + color.replace(/[^a-z0-9]/gi, "")
}

function Node({ node, highlighted }: { node: DiagramNode; highlighted: boolean }) {
  const b = boxOf(node)
  const fill = node.color ?? "#4F46E5"
  const isCircle = node.style === "circle"
  const radius = node.style === "pill" ? b.h / 2 : 14
  const lines = node.label.split("\n")

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      {/* glow when highlighted */}
      <AnimatePresence>
        {highlighted && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.rect
              x={b.x - 6}
              y={b.y - 6}
              width={b.w + 12}
              height={b.h + 12}
              rx={radius + 6}
              fill={fill}
              filter="url(#soft-glow)"
              animate={{ opacity: [0.18, 0.4, 0.18] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {isCircle ? (
        <circle cx={b.cx} cy={b.cy} r={Math.min(b.w, b.h) / 2} fill={fill} filter="url(#drop)" />
      ) : (
        <rect
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={radius}
          fill={fill}
          filter="url(#drop)"
        />
      )}
      {/* top sheen */}
      {!isCircle && (
        <rect x={b.x} y={b.y} width={b.w} height={b.h / 2} rx={radius} fill="url(#sheen)" />
      )}
      {/* border ring on highlight */}
      <motion.rect
        x={b.x}
        y={b.y}
        width={b.w}
        height={b.h}
        rx={radius}
        fill="none"
        stroke="#ffffff"
        animate={{ strokeOpacity: highlighted ? 0.85 : 0 }}
        strokeWidth={2}
      />

      <foreignObject x={b.x} y={b.y} width={b.w} height={b.h}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            padding: "0 10px",
            textAlign: "center",
          }}
        >
          {lines.map((line, i) => (
            <span
              key={i}
              style={{
                color: "#fff",
                fontSize: i === 0 ? 13.5 : 11,
                fontWeight: i === 0 ? 600 : 500,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                opacity: i === 0 ? 1 : 0.85,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              }}
            >
              {line}
            </span>
          ))}
        </div>
      </foreignObject>
    </motion.g>
  )
}

function Edge({ edge, boxes }: { edge: DiagramEdge; boxes: Record<string, Box> }) {
  const geo = edgeGeometry(edge, boxes)
  if (!geo) return null
  const color = edge.color ?? "#9b938a"
  const markerId = `arrow-${colorId(color)}`

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* base path draws on like ink */}
      <motion.path
        d={geo.path}
        fill="none"
        stroke={color}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeDasharray={edge.dashed ? "2 7" : undefined}
        markerEnd={`url(#${markerId})`}
        initial={{ pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: edge.dashed ? 0.7 : 0.9 }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
      />

      {/* flowing pulse along active edges */}
      {edge.animated && (
        <motion.path
          d={geo.path}
          fill="none"
          stroke={color}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray="9 600"
          initial={{ strokeDashoffset: 600 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.7, ease: "linear", repeat: Infinity }}
          style={{ filter: "drop-shadow(0 0 4px " + color + ")" }}
        />
      )}

      {edge.label && (
        <motion.g
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <rect
            x={geo.lx - (edge.label.length * 3.1 + 8)}
            y={geo.ly - 11}
            width={edge.label.length * 6.2 + 16}
            height={20}
            rx={10}
            fill="#ffffff"
            stroke="#ebecf0"
            strokeWidth={1}
          />
          <text
            x={geo.lx}
            y={geo.ly + 3}
            textAnchor="middle"
            fontSize={11}
            fontWeight={500}
            fill="#545b66"
            fontFamily="var(--font-mono), monospace"
          >
            {edge.label}
          </text>
        </motion.g>
      )}
    </motion.g>
  )
}

function PacketToken({ p }: { p: Packet }) {
  const w = (p.label?.length ?? 2) * 6.6 + 18
  const color = p.color ?? "#149eca"
  const travels = p.toX !== undefined && p.toY !== undefined
  return (
    <motion.g
      initial={{ x: p.x, y: p.y, opacity: 0, scale: 0.85 }}
      animate={
        travels
          ? { x: [p.x, p.toX!], y: [p.y, p.toY!], opacity: [0, 1, 1, 1], scale: 1 }
          : { x: p.x, y: p.y, opacity: 1, scale: 1 }
      }
      transition={
        travels
          ? { duration: 1.4, ease: "easeInOut" }
          : { type: "spring", stiffness: 240, damping: 20 }
      }
    >
      <rect x={-w / 2} y={-12} width={w} height={24} rx={7} fill="#ffffff" stroke={color} strokeWidth={1.5} filter="url(#drop)" />
      {p.label && (
        <text x={0} y={4} textAnchor="middle" fontSize={11} fontWeight={600} fill={color} fontFamily="var(--font-mono), monospace">
          {p.label}
        </text>
      )}
    </motion.g>
  )
}

export default function DiagramRenderer({
  state,
  viewBox = `0 0 ${VIEW_W} ${VIEW_H}`,
}: {
  state: DiagramState
  viewBox?: string
}) {
  const boxes: Record<string, Box> = {}
  for (const n of state.nodes) boxes[n.id] = boxOf(n)
  const highlightSet = new Set(state.highlighted)

  const edgeColors = Array.from(
    new Set(state.edges.map((e) => e.color ?? "#9b938a"))
  )

  return (
    <svg viewBox={viewBox} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="drop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1c1a17" floodOpacity="0.16" />
        </filter>
        <filter id="soft-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {edgeColors.map((color) => (
          <marker
            key={color}
            id={`arrow-${colorId(color)}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={color} />
          </marker>
        ))}
      </defs>

      <AnimatePresence>
        {state.edges.map((edge) => (
          <Edge key={edge.id} edge={edge} boxes={boxes} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {state.nodes.map((node) => (
          <Node key={node.id} node={node} highlighted={highlightSet.has(node.id)} />
        ))}
      </AnimatePresence>

      {/* Packets are NOT wrapped in AnimatePresence: when the step changes they
          unmount instantly (no lingering ghosts from a previous step). */}
      {(state.packets ?? []).map((p) => (
        <PacketToken key={`${p.id}-${p.x}-${p.toX ?? "s"}`} p={p} />
      ))}

      <AnimatePresence>
        {state.annotations.map((ann) => (
          <motion.g
            key={ann.id}
            initial={{ opacity: 0, y: ann.y + 6 }}
            animate={{ opacity: 1, y: ann.y }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <rect
              x={ann.x - (ann.text.length * 3.3 + 10)}
              y={ann.y - 13}
              width={ann.text.length * 6.6 + 20}
              height={24}
              rx={12}
              fill="#ffffff"
              stroke="#ebecf0"
              strokeWidth={1}
            />
            <text
              x={ann.x}
              y={ann.y + 3}
              textAnchor="middle"
              fontSize={12}
              fontWeight={500}
              fill={ann.color ?? "#6b6661"}
              fontFamily="var(--font-sans), system-ui, sans-serif"
            >
              {ann.text}
            </text>
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  )
}
