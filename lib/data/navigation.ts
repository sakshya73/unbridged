import { Step, DiagramNode, DiagramEdge } from "../types"

const TEAL = "#0D9488" // navigation state tree (the concept accent / source of truth)
const GREEN = "#059669" // focused / active route
const SLATE = "#374151" // mounted-but-unfocused route
const RED = "#DC2626" // popped / removed route
const NATIVE = "#2563EB" // native container (UINavigationController / Fragment)
const VIOLET = "#8B5CF6" // native gesture + transition (UI thread)
const AMBER = "#D97706" // action / dispatch pill
const BLUE = "#3B82F6" // tab navigator (sibling routes)
const GOLD = "#F59E0B" // nested child navigator
const FLOW = "#818CF8" // forward / parent→route edges
const SETTLE = "#6EE7B7" // route-list handoff (JS → native)
const WARN = "#FCD34D" // bubbled event (native → JS), dashed
const DIM = "#D8DCE6" // carried-but-quiet edge

const mk = (id: string, label: string, x: number, y: number, width: number, height: number, color: string, style: "box" | "pill" = "box"): DiagramNode => ({ id, label, x, y, width, height, style, color })

// left column = the JS state tree (the stack of cards); right column = native side
const state = (label = "Navigation state\n{ index, routes }", color = TEAL) => mk("state", label, 250, 46, 300, 52, color)
const home = (label: string, color: string) => mk("home", label, 250, 350, 300, 56, color)
const details = (label: string, color: string) => mk("details", label, 250, 266, 300, 56, color)
const profile = (label: string, color: string) => mk("profile", label, 250, 182, 300, 56, color)
const nativenav = (color = NATIVE) => mk("nativenav", "Native container\nUINavigationController / Fragment", 600, 266, 190, 64, color)
// tab-mode siblings (same slots, distinct ids → clean scene change)
const feed = (label: string, color: string) => mk("feed", label, 250, 350, 300, 56, color)
const search = (label: string, color: string) => mk("search", label, 250, 266, 300, 56, color)
const prof = (label: string, color: string) => mk("prof", label, 250, 182, 300, 56, color)

const e = (id: string, from: string, to: string, label: string, color = FLOW, dashed = false): DiagramEdge => ({ id, from, to, label, animated: !dashed, dashed, color })
const dim = (id: string, from: string, to: string): DiagramEdge => ({ id, from, to, color: DIM })
const an = (text: string, color = "#545b66") => [{ id: "a", text, x: 400, y: 460, color }]

export const navigationSteps: Step[] = [
  {
    step: 1,
    codeLines: [3],
    caption: "Navigation state is one serializable JSON tree: navigators hold a routes array and an index marking the focused route.",
    narration: "React Navigation keeps your whole navigation in one plain object. It's a tree: each navigator holds a list of routes and an index that points at the focused one. Because it's just data, you can log it, save it, and restore it later.",
    notes: [
      { label: "Key term", term: "Navigation state", text: "a serializable tree. Each navigator node carries routes plus an index marking the focused route — and a few bookkeeping fields (type, key, routeNames, and a stale flag that lets a saved tree rehydrate on restore). No functions, no class instances, just data." },
      { label: "If you know web React", text: "think of it like the URL on the web: one serializable description of where you are. Here it's a JSON tree instead of a string, and it can nest." },
    ],
    diagram_state: { nodes: [state()], edges: [], highlighted: ["state"], annotations: an("one serializable JSON tree = the source of truth", TEAL) },
  },
  {
    step: 2,
    codeLines: [7, 8, 9, 10, 11],
    caption: "A Stack.Navigator is a React component. Its Screen children are routes. On launch, Home is route 0 — index 0, focused.",
    narration: "A navigator is a regular React component. You render a Stack Navigator and give it Screen children, and each Screen becomes a route. When the app opens, only Home is in the routes list, the index is zero, and Home is focused — the bottom card of the stack.",
    notes: [
      { label: "Key term", term: "Navigator", text: "a React component that owns a slice of navigation state. Stack.Navigator, Tab.Navigator, and Drawer.Navigator each render their Screen children as routes and decide how to show them." },
      { label: "Heads up", text: "the Screen elements describe the routes; they aren't the live screens yet. The navigator decides which routes actually mount." },
    ],
    diagram_state: { nodes: [state(), home("Home  (index 0)\nfocused", GREEN)], edges: [e("e1", "state", "home", "route 0")], highlighted: ["home"], annotations: an("navigator = component · first screen is route 0, focused", GREEN) },
  },
  {
    step: 3,
    codeLines: [15, 16, 17],
    caption: "navigation.navigate('Details') doesn't mutate state — it dispatches an ACTION. A router reducer produces the next state.",
    narration: "Here's the core idea. You never edit the navigation state by hand. You dispatch an action — navigate, push, go back, reset — and a router reducer takes the current state plus that action and returns the next state. It's exactly the useReducer mental model.",
    notes: [
      { label: "Key term", term: "Action + reducer", text: "navigate, push, goBack, and reset are actions. Each navigator has a router whose reducer, getStateForAction, turns the current state plus an action into the next state — the same shape as useReducer's (state, action) => newState." },
      { label: "Connects to", text: "this is the reducer pattern: an action in, a brand-new state out. The screen never reaches in and edits the tree.", link: { href: "/learn/usestate", label: "useState & Re-renders" } },
    ],
    diagram_state: { nodes: [state(), home("Home  (index 0)\nfocused", GREEN), mk("action", "navigate('Details')", 600, 60, 190, 44, AMBER, "pill")], edges: [e("e1", "state", "home", "route 0"), e("eAct", "action", "state", "dispatch → reducer", AMBER)], highlighted: ["action"], annotations: an("dispatch an action → reducer returns the next state", AMBER) },
  },
  {
    step: 4,
    codeLines: [17],
    caption: "The reducer appends Details to routes and moves index to it. Details slides in on top and is now focused.",
    narration: "The navigate action produces a new state with Details appended to the routes list and the index bumped to point at it. Details slides in on top and becomes the focused card. The old state object is untouched — the reducer returned a new one.",
    notes: [
      { label: "Key term", term: "push vs navigate", text: "push always adds a new route on top. In v7, navigate stays put if you're already on that route, and otherwise pushes a new one — it no longer jumps back to an earlier instance (use popTo for that). Both run through the same reducer." },
      { label: "Why", text: "because each action returns a fresh state, the history is just the routes array. Undo is removing the last entry — that's what goBack does." },
    ],
    diagram_state: { nodes: [state(), home("Home\nmounted, unfocused", SLATE), details("Details  (index 1)\nfocused", GREEN)], edges: [dim("e0", "state", "home"), e("e1", "state", "details", "focused")], highlighted: ["details"], annotations: an("push appends a route, index moves to it → Details focused", GREEN) },
  },
  {
    step: 5,
    codeLines: [8, 9],
    caption: "Push Profile on top. Home and Details stay MOUNTED underneath — back is instant, their state is preserved.",
    narration: "Push again and Profile lands on top. The screens below are not destroyed — they stay mounted underneath. That's why going back feels instant, and why a scroll position or a half-typed form is still there when you return.",
    notes: [
      { label: "Key term", term: "Stays mounted", text: "a pushed screen doesn't unmount the one beneath it. The lower routes keep their React state and native views; the stack just shows the top one." },
      { label: "Connects to", text: "a screen stays mounted under the one on top — and only when it finally pops does its cleanup run, the same unmount step from the lifecycle lesson.", link: { href: "/learn/lifecycle", label: "Component Lifecycle" } },
    ],
    diagram_state: { nodes: [state(), home("Home\nmounted, unfocused", SLATE), details("Details\nmounted, unfocused", SLATE), profile("Profile  (index 2)\nfocused", GREEN)], edges: [dim("e0", "state", "home"), dim("eD", "state", "details"), e("e1", "state", "profile", "focused")], highlighted: ["profile", "home", "details"], annotations: an("screens below stay mounted → back is instant, state kept", SLATE) },
  },
  {
    step: 6,
    codeLines: [1, 3],
    caption: "@react-navigation/native-stack hands the route list to a NATIVE container: UINavigationController on iOS, a Fragment stack on Android.",
    narration: "The stack you see is not drawn by JavaScript. With native-stack, react-native-screens hands the route list to a real native container — a UINavigationController on iOS, a Fragment-backed stack on Android. JavaScript owns the history; native owns the pixels.",
    notes: [
      { label: "Key term", term: "native-stack", text: "@react-navigation/native-stack renders real platform containers through react-native-screens — UINavigationController on iOS, a Fragment stack on Android — so screens look and behave like a hand-built native app." },
      { label: "Heads up", text: "the older @react-navigation/stack is the contrast: it draws the stack in JavaScript and animates the transition with the Animated API. Same state tree, different renderer underneath." },
    ],
    diagram_state: { nodes: [state(), home("Home", SLATE), details("Details", SLATE), profile("Profile\nfocused", GREEN), nativenav()], edges: [dim("e0", "state", "home"), dim("eD", "state", "details"), e("e1", "state", "profile", "focused"), e("eHand", "state", "nativenav", "route list", SETTLE)], highlighted: ["nativenav"], annotations: an("native-stack: JS owns history, native owns the rendered stack", NATIVE) },
  },
  {
    step: 7,
    codeLines: [1, 3],
    caption: "Because real native primitives back it, the slide transition and edge-swipe back gesture run on the UI thread — smooth even when JS is busy.",
    narration: "Because real native primitives back the stack, you get the platform slide transition and the edge-swipe back gesture for free. Both run on the UI thread, not in JavaScript — so they stay smooth even when the JavaScript thread is busy. The JavaScript stack, by contrast, animates in JavaScript and can stutter under load.",
    notes: [
      { label: "Why", text: "native-stack's transition and back gesture are driven by the platform on the UI thread, so a blocked JS thread can't stall them. The JS stack re-implements both with the Animated API, where heavy JS can make them janky." },
      { label: "Heads up", text: "native-stack also detaches inactive screen views from the native hierarchy to save memory (detachInactiveScreens, on by default). Detaching the native view is not the same as unmounting the React component — the component stays mounted with its state." },
      { label: "Connects to", text: "this is the UI thread from the Threads lesson running the animation, so it survives a jammed JS thread.", link: { href: "/learn/threads", label: "The Three Threads" } },
    ],
    diagram_state: { nodes: [state(), home("Home", SLATE), details("Details", SLATE), profile("Profile\nfocused", GREEN), nativenav(), mk("gesture", "Native transition\n+ edge-swipe", 600, 60, 190, 44, VIOLET, "pill")], edges: [dim("e0", "state", "home"), dim("eD", "state", "details"), e("e1", "state", "profile", "focused"), e("eHand", "state", "nativenav", "route list", SETTLE), { id: "eGest", from: "gesture", to: "nativenav", color: VIOLET }], highlighted: ["gesture"], annotations: an("transition + back gesture run on the UI thread, off JS", VIOLET) },
  },
  {
    step: 8,
    codeLines: [17],
    caption: "Swipe back or call goBack() → native fires an event up to JS → the reducer pops the top route. Profile unmounts, Details refocuses.",
    narration: "When the user swipes back or you call go back, the native side fires an event up to JavaScript. The reducer pops the top route off the array and moves the index down. Profile is removed and unmounts, and Details is focused again. Now that Profile is gone, its cleanup finally runs.",
    notes: [
      { label: "Key term", term: "goBack / pop", text: "removes the top route and moves the index down by one. The screen that was on top unmounts; the one beneath it, already mounted, simply refocuses." },
      { label: "Connects to", text: "the popped screen now unmounts, so every effect's cleanup runs — the unmount beat from the lifecycle lesson.", link: { href: "/learn/lifecycle", label: "Component Lifecycle" } },
    ],
    diagram_state: { nodes: [state(), home("Home", SLATE), details("Details  (index 1)\nfocused again", GREEN), profile("Profile\npopped → unmounts", RED), nativenav(), mk("gesture", "Native transition\n+ edge-swipe", 600, 60, 190, 44, VIOLET, "pill")], edges: [dim("e0", "state", "home"), e("e1", "state", "details", "focused"), e("eHand", "state", "nativenav", "route list", SETTLE), { id: "eGest", from: "gesture", to: "nativenav", color: VIOLET }, e("eEvt", "nativenav", "state", "pop event", WARN, true)], highlighted: ["profile", "details"], annotations: an("native fires an event → reducer pops → prior screen refocuses", RED) },
  },
  {
    step: 9,
    codeLines: [14],
    caption: "A screen can be MOUNTED but UNFOCUSED. focus/blur ≠ mount/unmount — so data fetches belong in useFocusEffect / useIsFocused, not useEffect.",
    narration: "Here's the gotcha that bites everyone. A screen can be mounted but unfocused — still in memory, just covered by the one on top. Focus and blur are not the same as mount and unmount. A plain effect with an empty dependency array runs once on mount and won't re-run when you come back. So a fetch that should refresh on return belongs in use focus effect, or you read use is focused.",
    notes: [
      { label: "Gotcha", text: "useEffect with [] runs once on mount and never again, even though you leave and return many times. For refresh-on-return, use useFocusEffect (runs on every focus, cleans up on blur) or useIsFocused." },
      { label: "Key term", term: "useFocusEffect", text: "React Navigation's effect that runs each time the screen focuses and cleans up when it blurs or unmounts. Wrap its callback in useCallback — otherwise it re-runs on every render while focused, the most common useFocusEffect bug." },
    ],
    diagram_state: { nodes: [state(), home("Home\nmounted · unfocused", SLATE), details("Details\nmounted · focused", GREEN), nativenav()], edges: [dim("e0", "state", "home"), e("e1", "state", "details", "focused"), e("eHand", "state", "nativenav", "route list", SETTLE)], highlighted: ["home", "details"], annotations: an("mounted ≠ focused → fetch in useFocusEffect, not useEffect", AMBER) },
  },
  {
    step: 10,
    codeLines: [7],
    caption: "A Tab navigator holds sibling routes, switched not pushed. A tab mounts on first focus (lazy default), then stays mounted underneath.",
    narration: "A stack is not the only navigator. A tab navigator holds its routes side by side as siblings, and the tab bar switches between them instead of pushing a history. By default each tab is lazy — it doesn't mount until you first visit it — and once visited it stays mounted underneath the others, so switching back is instant.",
    notes: [
      { label: "Key term", term: "Tab navigator", text: "sibling routes with one focused at a time. Switching a tab changes the index, it doesn't push. In v7, tabs are lazy by default: a tab mounts on first focus, then stays mounted." },
      { label: "Heads up", text: "to drop a background tab instead of keeping it mounted, reach for popToTopOnBlur or a useIsFocused check. v7 removed the old unmountOnBlur option." },
    ],
    diagram_state: { nodes: [state("Tab navigator\n{ index, routes }", TEAL), feed("Feed\nfocused", GREEN), search("Search\nmounted", SLATE), prof("Profile\nlazy — not yet mounted", SLATE), mk("tabbar", "Tab bar\nswitch, don't push", 600, 158, 190, 44, BLUE, "pill")], edges: [e("e1", "state", "feed", "index 0"), dim("eS", "state", "search"), { id: "eP", from: "state", to: "prof", color: DIM, dashed: true }, e("eTab", "state", "tabbar", "tabs", BLUE)], highlighted: ["tabbar", "feed"], annotations: an("tabs = sibling routes · lazy first mount, then stay mounted", BLUE) },
  },
  {
    step: 11,
    codeLines: [7, 17],
    caption: "Navigators nest: a tab can contain a stack. One JS state tree of nested navigators drives real native containers — JS owns history, native owns pixels and gestures.",
    narration: "Finally, navigators nest. A tab navigator can be the root, and one of its tabs can itself contain a stack. So the navigation state really is a tree of navigators, each owning its own routes and index. The whole system is one JavaScript state tree, built by reducers from dispatched actions, driving real native containers — JavaScript owns the history and logic, native owns the pixels and gestures, and they stay in sync through actions going down and events bubbling up.",
    notes: [
      { label: "Key term", term: "Nested navigators", text: "a navigator's route can be another navigator. The state tree mirrors that nesting — each node has its own routes and index — and navigate can target a screen deep inside a child navigator." },
      { label: "Next", text: "the synchronous, direct path the native side uses to talk to JS on the New Architecture is JSI.", link: { href: "/learn/jsi", label: "New Architecture & JSI" } },
    ],
    diagram_state: { nodes: [state("Tab navigator\n{ index, routes }", TEAL), feed("Feed", SLATE), search("Search\nfocused", GREEN), prof("Profile", SLATE), mk("tabbar", "Tab bar", 600, 158, 190, 44, BLUE, "pill"), nativenav(), mk("nested", "Stack nested\nin a tab", 600, 360, 190, 56, GOLD)], edges: [dim("e1", "state", "feed"), e("eSf", "state", "search", "focused"), dim("eP", "state", "prof"), e("eTab", "state", "tabbar", "tabs", BLUE), e("eNest", "tabbar", "nested", "child stack", GOLD), e("eHand", "state", "nativenav", "route list", SETTLE), e("eEvt", "nativenav", "state", "events", WARN, true)], highlighted: [], annotations: an("nested navigators · dispatch down, events up · JS history, native pixels", TEAL) },
  },
]
