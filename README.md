# How React Native Works

Most of us can ship a React Native app without ever being able to explain how it actually runs. We lean on the framework, the work gets done, and then an interview asks "so how does the bridge work?" and the answer is a shrug.

How React Native Works is the fix. Pick a concept — the Bridge, JSI, Hermes, the thread model — and watch it drawn out one step at a time, with a short caption (and optional voice) for each move. Where a concept has a real "feel" to it, there's a playground you can poke at. The Bridge one, for example, lets you flip between async and synchronous mode and watch the phone freeze, so "why is it async?" stops being a thing you memorize.

Everything is hardcoded. There's no AI call and no API key, so it runs for free and works offline.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To build:

```bash
npm run build
```

## What's inside

- **Walkthroughs** — each concept is a sequence of steps. A diagram builds up as you go, with a caption underneath and, where it helps, a "key term" or "why" note so you don't have to look anything up elsewhere.
- **Code panel** — a real snippet sits beside the diagram, and the relevant lines light up as the explanation reaches them.
- **Playgrounds** — hands-on sandboxes for the concepts that are easier to feel than to read.
- **Voice** — narration via the browser's built-in speech, toggleable. Keyboard arrows step through.

Concepts so far: the Bridge, the Three Threads, and JSI / New Architecture (all with playgrounds), plus component lifecycle, useState, useEffect, FlatList, Hermes, Metro, navigation, and the Animated API.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, and Framer Motion for the SVG animation. Narration uses the Web Speech API.

## Adding or editing a concept

The conventions, the data model, and the project map live in [`AGENTS.md`](./AGENTS.md). The short version: a concept is a metadata entry in `lib/concepts.ts`, a steps file in `lib/data/`, and an optional playground in `components/playgrounds/`.
