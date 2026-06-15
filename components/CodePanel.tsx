"use client"

export default function CodePanel({
  code,
  activeLines = [],
  filename = "Example.tsx",
}: {
  code: string
  activeLines?: number[]
  filename?: string
}) {
  const lines = code.replace(/\n+$/, "").split("\n")

  return (
    <div className="rounded-xl border border-line bg-paper-2 overflow-hidden shadow-[0_8px_24px_-16px_rgba(35,39,47,0.3)]">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line bg-[#fbfbf9]">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        <span className="ml-2 text-xs font-mono text-ink-faint">{filename}</span>
      </div>
      <pre className="py-3 text-[12.5px] font-mono leading-[1.75] overflow-x-auto">
        {lines.map((ln, i) => {
          const n = i + 1
          const active = activeLines.includes(n)
          return (
            <div
              key={i}
              className="flex transition-colors duration-300"
              style={{
                background: active ? "color-mix(in srgb, var(--accent) 11%, transparent)" : "transparent",
                boxShadow: active ? "inset 2px 0 0 var(--accent)" : "none",
              }}
            >
              <span className="select-none text-right pr-3 pl-3 w-10 shrink-0 text-ink-faint/70">{n}</span>
              <span className="pr-4 whitespace-pre text-ink">{ln || " "}</span>
            </div>
          )
        })}
      </pre>
    </div>
  )
}
