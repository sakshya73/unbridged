<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# unbridged — agent guide

A web app that teaches how React Native works under the hood — the Bridge, JSI, Hermes, threads, and so on — by drawing each concept out step by step with narration and interactive playgrounds. The goal is understanding, not API lookup.

All content is hardcoded. There is no AI call or API key at runtime, so the app costs nothing to run and works offline.

> `CLAUDE.md` includes this file. Keep it accurate — it's loaded as context every session. When a change makes the architecture, schema, or conventions below out of date, update this file in the same commit. The same goes for `README.md` (the reader-facing version).

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (theme lives in `app/globals.css` via `@theme`)
- Framer Motion 12 for the SVG animation
- Web Speech API (browser-native) for narration — no TTS service
- Fonts: Geist + Geist Mono

## Layout

```
app/
  page.tsx                 home — concept cards
  learn/[concept]/page.tsx the player (intro card → step walkthrough → optional playground)
  layout.tsx               fonts + metadata
  globals.css              palette, Tailwind theme, .bg-dots / .font-display / .ink-underline
lib/
  types.ts                 the data model (read this first)
  concepts.ts              concept metadata array + getConcept()
  data/<id>.ts             the steps for one concept
  data/index.ts            conceptSteps map (wire new concepts in here)
  speech.ts                Web Speech helpers
components/
  DiagramRenderer.tsx      SVG renderer — nodes, edges, packets, annotations
  DiagramCanvas.tsx        dynamic (ssr:false) wrapper around the renderer
  CodePanel.tsx            light-theme code panel with active-line highlight
  playgrounds/<X>.tsx      optional hands-on sandbox for a concept
  playgrounds/index.ts     registry — getPlayground(id)
```

## How a concept is built

A concept is three pieces, two of them required:

1. **Metadata** — one entry in `lib/concepts.ts` (`ConceptConfig`): `id`, `title`, `description`, `renderer`, `tags`, `analogy` ("think of it like…"), `scenario` ("you'll hit this when…"), and optionally `code` + `codeFile` for the side-by-side code panel.
2. **Steps** — `lib/data/<id>.ts` exporting `Step[]`, then registered in `lib/data/index.ts` under the same `id`.
3. **Playground** (optional) — a component in `components/playgrounds/` registered in `playgrounds/index.ts`. When present, the player shows a Walkthrough / Playground toggle. Only `bridge` has one so far.

## The Step model (`lib/types.ts`)

Each step carries:

- `narration` — **what gets spoken** by the Web Speech API. Keep it plain prose, free of code symbols. `<Text>` read aloud becomes "less-than Text greater-than", so never put angle brackets or `{ }` here.
- `caption` — **what's shown on screen** under the diagram. This one *may* hold code symbols (`<Text>Hi</Text>`). Falls back to `narration` if absent.
- `note` (optional `StepNote`) — a small card above the caption for a definition, a "why", a gotcha, or a cross-link. Shape: `{ label, term?, text, link? }` where `link` is `{ href, label }` for an in-app jump (e.g. `/learn/threads`). Use it to define jargon inline so the learner never has to leave the page. `note` is **not** spoken.
- `codeLines` — 1-based line numbers of the concept's `code` snippet to highlight this step.
- `diagram_state` — the full diagram for this step.

### Diagram conventions

- Coordinate system is a fixed `0 0 800 500` viewBox.
- States are **cumulative and incremental** — add roughly one element per step so the animation reads as a build-up, not a redraw.
- Annotations around `y 395–420` sit in the caption band along the bottom; keep everything inside the viewBox.
- `Packet`s are travelling messages: give `toX/toY` to make one move, omit them for a queued token sitting in place.

## Conventions

- **Humanize all reader-facing copy** (analogies, scenarios, captions, narration, notes, README) — strip AI tells before shipping. Vary rhythm, define terms, cut stacked em-dashes.
- **Light theme only**, modelled on reactnative.dev. Colors come from the CSS variables in `globals.css` (`--accent` is React blue `#149eca`). Per-concept accent colors live in `app/page.tsx`.
- **Commits**: conventional style, scoped by area — `feat(content)`, `feat(learn)`, `feat(playground)`, `fix(...)`, `docs(...)`. Commit module by module rather than one giant change.
- Verify with `npm run build` (it runs the TypeScript check) before committing content changes.

## Concepts (current)

`bridge` (flagship, has playground), `threads`, `jsi`, `lifecycle`, `usestate`, `useeffect`, `flatlist`, `hermes`, `metro`, `navigation`, `animated`.
