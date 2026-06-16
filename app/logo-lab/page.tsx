import type { ReactNode } from "react"

const ACCENT = "#149eca"

function Svg({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  )
}

// ── candidates: each renders the mark in the given color ──────────────────
function c1(c: string) {
  // 1 · node-graph (current): solid hub + two ringed satellites
  return (
    <>
      <line x1="10" y1="10.3" x2="13.8" y2="8.2" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="10" y1="13.7" x2="13.8" y2="15.8" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="7" cy="12" r="3.5" fill={c} />
      <circle cx="17" cy="6.5" r="2.7" fill="none" stroke={c} strokeWidth="2" />
      <circle cx="17" cy="17.5" r="2.7" fill="none" stroke={c} strokeWidth="2" />
    </>
  )
}
function c2(c: string) {
  // 2 · two-node link: JS ↔ Native, the core of the whole site. bold + simple
  return (
    <>
      <line x1="10.2" y1="12" x2="13.8" y2="12" stroke={c} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="6.5" cy="12" r="4" fill={c} />
      <circle cx="17.5" cy="12" r="3" fill="none" stroke={c} strokeWidth="2.4" />
    </>
  )
}
function c3(c: string) {
  // 3 · React atom: classic, instantly "React"
  return (
    <>
      <circle cx="12" cy="12" r="2.2" fill={c} />
      <g stroke={c} strokeWidth="1.5" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </g>
    </>
  )
}
function c4(c: string) {
  // 4 · monogram "rn"
  return (
    <text
      x="12"
      y="17.5"
      fontSize="15"
      fontWeight="800"
      textAnchor="middle"
      fill={c}
      fontFamily="var(--font-sans), system-ui, sans-serif"
      letterSpacing="-0.5"
    >
      rn
    </text>
  )
}
function c5(c: string) {
  // 5 · play triangle: "watch how it works"
  return <path d="M8 6.6 L17 12 L8 17.4 Z" fill={c} stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
}
function c6(c: string) {
  // 6 · signal node: a component emitting/under inspection ("see how it works")
  return (
    <>
      <circle cx="8.5" cy="12" r="3.4" fill={c} />
      <path d="M13 8 A 5.5 5.5 0 0 1 13 16" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M16 5.5 A 9 9 0 0 1 16 18.5" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  )
}

const CANDIDATES: { name: string; render: (c: string) => ReactNode }[] = [
  { name: "1 · Node-graph (current)", render: c1 },
  { name: "2 · Two-node link (JS ↔ Native)", render: c2 },
  { name: "3 · React atom", render: c3 },
  { name: "4 · Monogram “rn”", render: c4 },
  { name: "5 · Play triangle", render: c5 },
  { name: "6 · Signal node", render: c6 },
]

function Tile({ size, mark, children }: { size: number; mark: number; children?: ReactNode }) {
  return (
    <div
      className="rounded-lg flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: ACCENT, borderRadius: size * 0.28 }}
    >
      {children}
    </div>
  )
}

export default function LogoLab() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-6 py-14">
      <h1 className="font-display text-2xl font-bold tracking-tight">Logo candidates</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Each shown at favicon size, nav size, and large. Tell me the number you like (or what to tweak).
      </p>

      <div className="mt-10 flex flex-col divide-y divide-line">
        {CANDIDATES.map((cand) => (
          <div key={cand.name} className="py-7 flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Tile size={20} mark={12}>
                <Svg size={12}>{cand.render("#fff")}</Svg>
              </Tile>
              <Tile size={28} mark={16}>
                <Svg size={16}>{cand.render("#fff")}</Svg>
              </Tile>
              <Tile size={44} mark={26}>
                <Svg size={26}>{cand.render("#fff")}</Svg>
              </Tile>
              <Tile size={80} mark={46}>
                <Svg size={46}>{cand.render("#fff")}</Svg>
              </Tile>
              {/* accent-on-white, the card-glyph context */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${ACCENT}1A`, boxShadow: `inset 0 0 0 1px ${ACCENT}26` }}>
                <Svg size={26}>{cand.render(ACCENT)}</Svg>
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-ink">{cand.name}</p>
              {/* nav-row mock */}
              <div className="mt-2 inline-flex items-center gap-2.5">
                <Tile size={28} mark={16}>
                  <Svg size={16}>{cand.render("#fff")}</Svg>
                </Tile>
                <span className="font-display text-[15px] font-bold tracking-tight">How React Native Works</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
