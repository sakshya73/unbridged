# How React Native Works — Roadmap

The full list of concepts we're covering, step by step. A topic only goes **live on the site** once it hits the bar: a step-by-step walkthrough, inline definitions, a synced code panel, a playground where it earns one, and a verification pass. Only published topics appear on the home page; everything else is hidden until it's ready.

## Status

- ✅ **Done** — published, on the site (has a playground)
- 📝 **Draft** — full step data already written, not yet brought to bar / published
- ⬜ **Planned** — not started

**6 tracks · 75 topics · 3 done · 11 draft · 61 planned.** Every planned topic reuses an existing renderer type (ThreadDiagram, ComponentTree, Timeline, ScrollWindow, FlowDiagram, NavigationStack) or a small extension — no new rendering engine needed.

## Up next (build order)

1. 📝 **The render pipeline: render → commit → mount** — at bar: 11 steps + a scrub-through-three-phases playground (unpublished, in review).
2. ⬜ **Yoga layout engine in depth** — sits beside the pipeline (layout happens in commit); turns "flexbox just works" into an algorithm with an editable flex-tree playground.
3. 📝 **App startup & bootstrap sequence** — at bar: a 12-step swimlane timeline + a lever playground (Hermes / inline requires / bundle size). Unpublished, in review.
4. 📝 **useState & re-renders** — fastest win: steps already written, mostly polish + publish + a small playground. Opens both Rendering and Hooks.
5. 📝 **useEffect: commit, cleanup, deps** — already drafted; the after-paint timeline with cleanup-before-next-effect is a top interview topic. Pairs with useState.
6. 📝 **FlatList virtualization internals** — drafted; the render-window band with a flat mounted-cell counter is one of the most satisfying visuals. Anchors Performance.
7. 📝 **Native driver vs JS driver (Animated)** — drafted; "block the JS thread, watch one box freeze" is a memorable callback to Threads. Opens Animation.
8. ⬜ **Why a component re-renders (and bailouts)** — the canonical setup for the referential-equality / memo cluster; a reusable cascade-then-stop-at-memo heatmap.

---

## Track 1 — Architecture & Internals

The finished track lives here, and it's the spine the other tracks refer back to. One arc: what hosts RN → startup → render pipeline → layout → module/view layers → scheduling → new-arch migration.

- [x] ✅ **The React Native Bridge** · intermediate · high — how JS and native communicate over a serialized, batched queue, and why that boundary causes jank.
- [x] ✅ **The Three Threads** · intermediate · high — why work splits across JS, shadow/layout, and main/UI threads, and how blocking one starves the others.
- [x] ✅ **New Architecture & JSI** · advanced · high — direct synchronous JS↔native calls: HostObjects, TurboModules, Fabric, Codegen, why Reanimated worklets become possible.
- [ ] 📝 **App startup & bootstrap sequence** · intermediate · high — icon tap → first frame: native launch, instance init, engine spin-up, bundle load+eval, first render, mount, where TTI goes. _(at bar as the `startup` page — swimlane timeline + lever playground; covers the Track 4 TTI-optimization row too. Unpublished, in review.)_
- [ ] ⬜ **How RN embeds in a native app (the host)** · intermediate · medium — RN as a hosted library: RootView/Surface, a native tree containing a JS-driven subtree, lifecycle ownership, brownfield.
- [ ] 📝 **The render pipeline: render → commit → mount** · advanced · high — Fabric's three phases: build the immutable C++ shadow tree, lay out + diff atomically, apply mutations on the main thread. _(at bar, unpublished — in review.)_
- [ ] ⬜ **Reconciliation & the React commit-to-host boundary** · advanced · medium — how Fiber diffs the element tree and what the RN host config does at each commit (createInstance/appendChild/commitUpdate).
- [ ] ⬜ **Yoga layout engine in depth** · advanced · high — how Flexbox resolves on a shadow-node tree: the layout pass, grow/shrink/basis, measure functions, dirty-marking, that it runs synchronously in commit.
- [ ] ⬜ **Native Modules vs TurboModules** · advanced · high — the module layer: legacy async JSON-batched modules vs lazy, Codegen-typed, synchronous JSI HostObject TurboModules.
- [ ] ⬜ **Fabric Native Components & view flattening** · advanced · medium — how custom native UI is built (ComponentDescriptors, host/shadow/state split) and how layout-only views collapse.
- [ ] ⬜ **Bundle loading: parse, eval & inline requires** · intermediate · medium — what the device does with the Metro bundle: the `__d`/`__r` registry, lazy vs eager eval, Hermes bytecode skipping parse.
- [ ] ⬜ **Event loop, task queues & scheduling** · advanced · high — RN's single JS runtime: micro/macrotasks, how native events enqueue back, rAF/InteractionManager, lane-based time-slicing.
- [ ] ⬜ **Event & touch handling pipeline** · intermediate · medium — how a touch travels: native capture → responder/emitter → JS dispatch with target tags → onPress; why gestures lag when JS is busy.
- [ ] ⬜ **Memory model & retain cycles across the JS/native boundary** · advanced · medium — JS heap (Hermes GC) vs native heap and the JSI references bridging them; common leak shapes.
- [ ] ⬜ **New Architecture interop & migration layer** · advanced · medium — how old/new arch coexist: bridgeless mode, interop shims for legacy modules/Paper components, the real half-migrated app.
- [ ] 📝 **Hermes engine** · advanced · medium — JS compiled to bytecode (no on-device parse), startup/memory wins. _(draft written; feeds Startup/TTI + Bundle loading.)_

## Track 2 — Rendering & Reconciliation

React's render/reconcile/commit model — the bridge between "React the library" and "RN the host," and the most-asked area after architecture.

- [ ] ⬜ **Elements vs Fiber: the two trees** · intermediate · high — JSX makes immutable throwaway elements each render; React keeps a persistent Fiber tree (state, hooks, the WIP alternate).
- [ ] ⬜ **Render → reconcile → commit (a render is not a paint)** · intermediate · high — render produces elements (pure, pausable), reconcile diffs, commit applies mutations; many renders can precede one commit.
- [ ] ⬜ **Reconciliation & the diffing heuristics** · intermediate · high — different type at a position tears down the subtree; same type keeps the fiber and updates props. Why changing a wrapper type unmounts everything below.
- [ ] ⬜ **Keys & list reconciliation** · beginner · high — without stable keys React matches by index → stale state, lost focus, needless remounts. The foundation FlatList relies on.
- [ ] ⬜ **Why a component re-renders (and bailouts)** · intermediate · high — re-renders on own state, parent render, or consumed context — not on prop change. memo/useMemo/useCallback + the same-state bailout stop the wave.
- [ ] 📝 **useState & re-renders** · beginner · high — state is a React-owned slot, not a variable; setState enqueues, React re-runs + reconciles, multiple setStates batch into one render. _(draft written; canonical page under Hooks.)_
- [ ] ⬜ **State batching & the update queue** · intermediate · high — setState enqueues on the fiber and batches; functional updaters read the queue, not the closure (the "three setCount(count+1) adds one" bug).
- [ ] ⬜ **Context: propagation & re-render cost** · intermediate · high — context is DI/propagation, not a store; a value change re-renders all consumers; a fresh object literal re-renders them every parent render.
- [ ] ⬜ **Refs & imperative handles** · intermediate · medium — the escape hatch: a mutable `.current` that persists without re-rendering; useImperativeHandle to expose a curated child API.
- [ ] ⬜ **Concurrent rendering: interruptible work & priority** · advanced · medium — render splits into pausable units; React yields to higher-priority taps; startTransition/useDeferredValue, and why render must be pure.
- [ ] ⬜ **Error boundaries** · intermediate · medium — the only way to catch render-phase errors (getDerivedStateFromError/componentDidCatch); does not catch handlers, async, or its own errors.
- [ ] ⬜ **Suspense: suspending & fallbacks** · advanced · medium — a component suspends by throwing a promise; the nearest boundary shows a fallback until it resolves, then retries.
- [ ] ⬜ **Controlled vs uncontrolled inputs** · beginner · medium — controlled TextInput round-trips each keystroke through render (can drop chars on lag); the RN native/JS text desync behind cursor-jump bugs.

## Track 3 — Hooks & State

The daily surface and the densest "explain why" interview source. Almost every hook resolves to one visual insight (a slot, a queue, an identity check, a snapshot).

- [ ] 📝 **Component lifecycle (mount → update → unmount)** · beginner · medium — the arc the effect hooks plug into; why cleanup matters. _(draft written.)_
- [ ] 📝 **useState: state cell, queue, re-render** · beginner · high — same mechanism as the Rendering page, from the hook angle. _(one page — id `usestate`; canonical here, cross-linked from Rendering.)_
- [ ] 📝 **useEffect: commit, cleanup, dependency array** · intermediate · high — effects run after paint; deps is a shallow-compare gate that runs the previous cleanup then the new effect on change. _(draft written.)_
- [ ] ⬜ **useRef: mutable box that survives renders** · beginner · high — a stable object whose `.current` you mutate without re-rendering; for values across renders and host handles.
- [ ] ⬜ **Rules of Hooks: why order and call-site matter** · intermediate · high — React tracks hooks by call order in a per-component slot list; a conditional hook shifts the order and reads the wrong slot.
- [ ] ⬜ **Referential equality: why functions/objects break memoization** · intermediate · high — every render makes new literals with new identity; React compares by `Object.is`, so inline `{}`/`()=>{}` defeats deps arrays and memo.
- [ ] ⬜ **useMemo & useCallback: caching values and identities** · intermediate · high — cache a value / a function identity, keyed on deps, to stabilize references or skip expensive compute. Often misused.
- [ ] ⬜ **Stale closures: when a hook captures an old value** · advanced · high — each render is a snapshot; a callback in a ref/interval/wrong-deps effect keeps reading stale values. Fixes: deps, functional updates, a latest-ref.
- [ ] ⬜ **useReducer: centralized state transitions** · intermediate · medium — a `(state, action) => newState` reducer colocates interdependent transitions; stable dispatch identity sidesteps stale closures.
- [ ] ⬜ **Custom hooks: composing and sharing stateful logic** · intermediate · medium — a function calling other hooks; shares logic, not state (each caller gets its own instance).
- [ ] ⬜ **State colocation & lifting state up** · intermediate · medium — where state lives sets the re-render blast radius; keep it local, lift only to the nearest common ancestor.
- [ ] ⬜ **External state (Redux / Zustand / Jotai / React Query): the models** · advanced · medium — why reach outside React state; single-store+selectors, hook-store, atoms, server-cache — and why selector subscription beats context.

## Track 4 — Performance

The most common "hard problem you solved" area, and it pays off the architecture track directly — jank, the frame budget, the native driver, bridge cost.

- [ ] ⬜ **Why the JS thread janks** · intermediate · high — one single-threaded JS event loop shared by updates, handlers, and animations; a long sync task misses the 16.6ms budget and the UI freezes.
- [ ] ⬜ **The 60fps frame budget** · beginner · high — smoothness is a per-frame deadline, not an average; each thread must finish its slice within ~16.6ms (8.3ms at 120Hz).
- [ ] ⬜ **Re-render optimization in practice (memo / useMemo / useCallback)** · intermediate · high — the applied, profiler-driven companion to the Hooks memo pages; inline objects/functions break equality.
- [ ] 📝 **FlatList virtualization internals** · intermediate · high — mounts only rows in a moving window and unmounts the rest; windowSize/initialNumToRender/getItemLayout tune it. _(draft written.)_
- [ ] ⬜ **List pitfalls: keys, getItemLayout, blank cells** · intermediate · high — index keys force remounts; missing getItemLayout makes it measure every row (blank cells on fast scroll); non-memoized renderItem re-renders all.
- [ ] 📝 **Native driver vs JS driver (Animated)** · intermediate · high — useNativeDriver:true serializes values once and runs on the UI thread (60fps when JS is busy); only transform/opacity qualify. _(draft written.)_
- [ ] 📝 **Startup time & TTI optimization** · advanced · high — TTI = native init + bundle load/parse + first render; shrink with Hermes bytecode, inline requires, deferring work. _(covered by the `startup` page's lever section — unpublished, in review.)_
- [ ] ⬜ **Bridge serialization & batched updates as a perf cost** · advanced · medium — old-arch cross-thread calls are JSON-serialized and batched; chatty patterns flood it; JSI removes serialization.
- [ ] ⬜ **InteractionManager & scheduling work** · intermediate · medium — defer non-urgent work until after animations settle (runAfterInteractions); rAF vs setTimeout vs concurrent scheduling.
- [ ] ⬜ **Image & asset performance** · intermediate · medium — decoding full-res for a thumbnail blows up memory; resize at source, cache decoded bitmaps, use FastImage/expo-image.
- [ ] ⬜ **Bundle size & code splitting** · intermediate · medium — every byte costs load+parse at startup; tree-shaking, avoiding barrel imports, inline requires, RAM bundles.
- [ ] ⬜ **Profiling tools: DevTools Profiler, Perf Monitor, Hermes CPU profiler** · intermediate · medium — flame graph (which components re-render and why), live JS+UI fps, JS-thread attribution. Maps symptom → tool.

## Track 5 — Navigation, Animation & Gestures

Turns the off-thread payoff of JSI into something you can feel: navigation is "just state + reducers," and Reanimated/RNGH answer "how do I stay at 60fps when JS is busy."

- [ ] 📝 **React Navigation: the navigation state tree** · intermediate · high — navigation state is a serializable JSON tree; navigators are components; an action produces a new state via a router reducer. _(at bar: 11 steps, notes, code panel, push/pop playground — unpublished, in review.)_
- [ ] ⬜ **Stack navigator internals & native-stack vs JS stack** · intermediate · high — how a stack keeps mounted-screen history, why screens stay mounted underneath, JS stack vs native-stack transitions/memory.
- [ ] ⬜ **Screen lifecycle: focus/blur vs mount, and useFocusEffect** · intermediate · high — a screen can be mounted but unfocused; why fetches belong in useFocusEffect/useIsFocused, not useEffect.
- [ ] ⬜ **Tabs, drawers & screen optimization (lazy / unmountOnBlur / freeze)** · intermediate · high — navigators mount all routes by default; lazy/detach/react-freeze stop background screens re-rendering.
- [ ] ⬜ **Deep linking & URL ↔ state mapping** · advanced · medium — a linking config parses an incoming URL into a full nested navigation state (and back); initial vs runtime links.
- [ ] ⬜ **Animated API internals: the value-node graph & interpolation** · intermediate · medium — Animated builds a graph of value nodes feeding props; interpolate maps an input range to many synchronized outputs.
- [ ] ⬜ **Reanimated worklets & the UI runtime** · advanced · high — a worklet is JS run on a separate UI-thread runtime; runs animation/gesture logic off the bridge and React render. runOnUI/runOnJS. The JSI payoff.
- [ ] ⬜ **Shared values, useAnimatedStyle & the reactive update flow** · advanced · high — a shared value is a box readable on both runtimes; mutating `.value` re-runs dependent worklets on the UI thread, no React re-render.
- [ ] ⬜ **Gesture Handler: native recognizers, the gesture tree & composition** · advanced · high — RNGH replaces JS PanResponder with native recognizers on the UI thread; began/active/end; simultaneous/exclusive/race.
- [ ] ⬜ **Layout animations & entering/exiting/layout transitions** · intermediate · medium — Reanimated animates views appearing/disappearing/repositioning by measuring before/after and tweening on the UI thread.
- [ ] ⬜ **Capstone: a 60fps gesture-driven bottom sheet** · advanced · high — gesture → shared value → interpolate → animated style on the UI thread; modern stack holds 60fps where PanResponder + JS-driver stutters.

## Track 6 — Tooling, Build & Platform

The operational half: how code becomes a running app, and how you ship and debug it.

- [ ] 📝 **Metro bundler** · intermediate · high — resolves the import graph, transforms each module into a factory keyed by id, serializes to one bundle with a tiny `__d`/`__r` runtime. _(draft written.)_
- [ ] ⬜ **Fast Refresh / HMR** · intermediate · high — on save, only the changed module ships over a websocket; the runtime swaps that factory and re-renders affected trees, preserving state when it can.
- [ ] ⬜ **Inline requires & lazy module evaluation** · advanced · medium — by default every factory runs at startup; inline requires move `require()` to first use so factories run lazily. The core startup lever.
- [ ] ⬜ **Native module authoring (old vs Turbo)** · advanced · high — the authoring surface: legacy export macros + bridge serialization vs Codegen JSI bindings for lazy, synchronous, type-safe calls.
- [ ] ⬜ **Networking, fetch & the JS event loop** · intermediate · high — fetch is native-backed async: the request leaves to native while JS runs, the response re-enters as a callback on the event loop; micro vs macrotask order.
- [ ] ⬜ **Storage & persistence (AsyncStorage vs MMKV)** · beginner · medium — AsyncStorage is async (crosses the native boundary off the JS thread); MMKV is synchronous via JSI. When each fits.
- [ ] ⬜ **Platform-specific code (build-time vs runtime)** · beginner · medium — Metro picks `Foo.ios.js`/`Foo.android.js` at build time; Platform.OS/Platform.select branch at runtime. The two devs conflate.
- [ ] ⬜ **Release & OTA updates (EAS Update / CodePush)** · intermediate · high — OTA swaps only the JS bundle at next launch; native changes need a store build; runtimeVersion gates incompatible pushes.
- [ ] ⬜ **Debugging & testing (Jest / RNTL / Detox)** · intermediate · high — Jest unit-tests logic; RNTL renders against the test renderer with user-facing queries; Detox is gray-box E2E with native idling-sync.
- [ ] ⬜ **Expo vs bare & EAS Build** · intermediate · medium — the managed → prebuild → bare continuum; prebuild generates native dirs from config plugins; EAS builds in the cloud.

---

## Deliberately out of scope (trivia)

Left out because they're API lookup or config checklists, not transferable mental models worth a visual:

- Permissions lifecycle and per-API permission recipes (camera/location/notifications) — config + a tiny state machine; the declaration-vs-runtime split fits as a note, not a page.
- Config-plugin authoring recipes and per-library native setup — operational reference; the Expo-vs-bare continuum captures the one idea that matters.
- Exhaustive FlatList/Image prop catalogs — the virtualization-window and decode-cost concepts already teach the behavior; prop lists belong in docs.

## Structure & dedup notes

The six domain sweeps overlapped heavily; resolved as:

- **`usestate` is one page**, not two — canonical under Hooks, cross-linked from Rendering. (Both tracks describe it from different angles.)
- **Render pipeline** is split: the deep Fabric/shadow-tree version lives in Architecture (`render → commit → mount`); a lighter React-mechanics version in Rendering (`a render is not a paint`). Can merge into one basics→internals page if we want fewer.
- **memo / useMemo / useCallback / referential-equality** appeared in three tracks → canonical pages in Hooks; Performance's `re-render optimization in practice` is an applied companion that links back.
- **Context** → one page (Rendering). **Event loop** → canonical in Architecture; Tooling's networking page reuses it.
- **Native Modules vs TurboModules** → split into the Architecture call-path concept and the Tooling authoring surface, cross-linked.
- **Animated native-driver** → canonical in Performance (where the draft sits); the Navigation/Animation Animated page focuses on the value-node graph + interpolation.

Per AGENTS.md: run all reader-facing copy through `/humanizer`, and `npm run build` before publishing each module.
