"use client"

const INK = "#1b2433"

export default function CodePanel({
  code,
  activeLines = [],
  filename = "Example.tsx",
  accent = "#0e7490",
}: {
  code: string
  activeLines?: number[]
  filename?: string
  accent?: string
}) {
  const lines = code.replace(/\n+$/, "").split("\n")

  return (
    <div className="rounded-sm border-2 overflow-hidden bg-white" style={{ borderColor: INK }}>
      <div className="flex items-stretch border-b-2 font-mono text-[10px] tracking-[0.12em] uppercase" style={{ borderColor: INK }}>
        <span className="px-2.5 py-1.5 border-r-2 font-medium" style={{ borderColor: INK, color: accent }}>src</span>
        <span className="px-2.5 py-1.5 truncate" style={{ color: "rgba(27,36,51,0.7)" }}>{filename}</span>
      </div>
      <pre className="py-3 text-[11px] sm:text-[12.5px] font-mono leading-[1.7] sm:leading-[1.75] overflow-x-auto">
        {lines.map((ln, i) => {
          const n = i + 1
          const active = activeLines.includes(n)
          return (
            <div
              key={i}
              className="flex transition-colors duration-300"
              style={{
                background: active ? `${accent}1a` : "transparent",
                boxShadow: active ? `inset 2px 0 0 ${accent}` : "none",
              }}
            >
              <span className="select-none text-right pr-3 pl-3 w-10 shrink-0" style={{ color: "rgba(27,36,51,0.4)" }}>{n}</span>
              <span className="pr-4 whitespace-pre" style={{ color: INK }}>{ln || " "}</span>
            </div>
          )
        })}
      </pre>
    </div>
  )
}
