import { ConceptConfig } from "./types"

export const concepts: ConceptConfig[] = [
  {
    id: "bridge",
    title: "The React Native Bridge",
    description: "How JS and Native threads communicate asynchronously",
    renderer: "ThreadDiagram",
    published: true,
    tags: ["architecture", "core", "intermediate"],
    analogy:
      "Two people who don't share a language, passing handwritten notes through a translator. It works — but every note has to be written down, carried across, and read aloud.",
    scenario:
      "You'll feel it when a heavy JSON.parse or a big list calculation on the JS thread makes a swipe or animation stutter.",
    codeFile: "LikeButton.tsx",
    code: `function LikeButton() {
  const [likes, setLikes] = useState(0)

  return (
    <Pressable onPress={() => setLikes(likes + 1)}>
      <Text>♥ {likes} likes</Text>
    </Pressable>
  )
}`,
  },
  {
    id: "threads",
    title: "The Three Threads",
    description: "Why React Native splits work across the JS, layout, and main threads",
    renderer: "ThreadDiagram",
    published: true,
    tags: ["architecture", "core", "intermediate"],
    analogy:
      "A coffee shop. One person takes orders, one makes the drinks, one runs them out to tables — all at once. So when the order-taker gets stuck on a fussy order, the drinks already in progress still reach their tables; the line just can't place anything new until they're free again.",
    scenario:
      "Your screen keeps scrolling smoothly, but the second some heavy JavaScript runs, taps stop landing and new rows flash up blank — until it finishes.",
    codeFile: "ThreadDemo.tsx",
    code: `function ThreadDemo() {
  const [primes, setPrimes] = useState(0)
  const scrollY = useRef(new Animated.Value(0)).current

  // Heavy synchronous work — runs on the JS thread.
  // Until this loop ends, nothing else in JS can run.
  function findPrimes() {
    let n = 2, hits = 0
    const end = Date.now() + 3000
    while (Date.now() < end) if (isPrime(n++)) hits++
    setPrimes(hits)
  }

  return (
    <View>
      <Animated.FlatList
        data={rows}
        renderItem={({ item }) => <Row label={item} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
      <Button title={\`Primes found: \${primes}\`} onPress={findPrimes} />
    </View>
  )
}`,
  },
  {
    id: "jsi",
    title: "New Architecture & JSI",
    description: "Direct synchronous JS-to-Native calls without the Bridge",
    renderer: "ThreadDiagram",
    published: true,
    tags: ["architecture", "advanced", "new-arch"],
    analogy:
      "Swapping the note-passing translator for a shared whiteboard both people read and write at the same time — no more notes going back and forth.",
    scenario:
      "Why the New Architecture can measure a view or call a native module synchronously, with no laggy round-trip.",
    codeFile: "NewArchDemo.tsx",
    code: `// OLD BRIDGE — async only: the value can't come back inline
async function loadOld() {
  const theme = await AsyncStorage.getItem('theme') // Promise, resolves later
  applyTheme(theme)
}

// NEW ARCH (JSI) — a TurboModule call is a direct, synchronous C++ call
import Storage from './specs/NativeStorage'         // Codegen'd, type-safe, lazy
function loadNew() {
  const theme = Storage.getItem('theme')            // returns the string NOW
  applyTheme(theme)                                 // same tick, no queue
}

// because the JS<->native link is synchronous, Reanimated runs on the UI thread:
const x = useSharedValue(0)
const style = useAnimatedStyle(() => {
  'worklet'                          // shipped to the UI thread, not the JS thread
  return { transform: [{ translateX: x.value }] }   // 60fps even if JS is jammed
})`,
  },
  {
    id: "lifecycle",
    published: true,
    title: "Component Lifecycle",
    description: "Mount → render → update → unmount, step by step",
    renderer: "Timeline",
    tags: ["components", "beginner"],
    analogy:
      "A stage actor: they walk on (mount), react to cues during the show (update), and exit when the scene ends (unmount) — tidying up props on the way out.",
    scenario:
      "Why a forgotten cleanup leaves a timer or listener running after you've navigated away from a screen.",
    codeFile: "ProfileScreen.tsx",
    code: `function ProfileScreen({ name }) {
  // RENDER PHASE — pure. May run twice (StrictMode) or be thrown away.
  console.log('render')

  useLayoutEffect(() => {
    console.log('layout effect')          // after commit, BEFORE paint
    return () => console.log('layout cleanup')
  })

  useEffect(() => {
    console.log('passive effect')         // after paint, async
    return () => console.log('cleanup')   // before re-run + on unmount
  }, [name])                              // deps gate the re-run

  return (
    <View>
      <Text>{name}</Text>
    </View>
  )
}`,
  },
  {
    id: "usestate",
    title: "useState & Re-renders",
    description: "How state changes trigger reconciliation and commits",
    renderer: "ComponentTree",
    published: true,
    tags: ["hooks", "beginner"],
    analogy:
      "A whiteboard you erase and redraw: change one number and React redraws that board — and the ones below it — to match.",
    scenario:
      "Why your whole screen re-renders when a single counter changes, and how to stop the parts that don't need to.",
    codeFile: "Counter.tsx",
    code: `function Counter() {
  // React OWNS this slot. \`count\` is just this render's snapshot of it.
  const [count, setCount] = useState(0)

  function handlePress() {
    // Enqueues an update + schedules a re-render. count is NOT changed now.
    setCount(count + 1)
  }

  return (
    <View>
      <Text>Count: {count}</Text>
      <Pressable onPress={handlePress}><Text>+1</Text></Pressable>
      <Row label="A" />
      <MemoRow label="B" />
    </View>
  )
}
const MemoRow = React.memo(Row) // same props → React bails out, skips re-render`,
  },
  {
    id: "useeffect",
    title: "useEffect",
    description: "When it fires, cleanup, and the dependency array",
    renderer: "Timeline",
    tags: ["hooks", "intermediate"],
    analogy:
      "A sticky note that says 'once the room is set up, water the plants' — it runs after the render, not during it, and cleans up before doing it again.",
    scenario:
      "Why your data fetch fires twice or at the wrong moment when the dependency array is wrong.",
    codeFile: "RoomPresence.tsx",
    code: `function RoomPresence({ roomId }) {
  const [online, setOnline] = useState(0)

  useEffect(() => {
    // setup runs after paint
    const conn = chatClient.join(roomId)
    conn.onCount(setOnline)

    return () => conn.leave()      // cleanup: before next effect + on unmount
  }, [roomId])                     // deps: re-run only when roomId changes

  return <Text>{online} online in {roomId}</Text>
}`,
  },
  {
    id: "flatlist",
    title: "FlatList Virtualization",
    description: "How the render window mounts only the rows near the viewport",
    renderer: "ScrollWindow",
    tags: ["performance", "intermediate"],
    analogy:
      "A theater that only puts out chairs for the rows people are actually sitting in, clearing them away as the audience moves.",
    scenario:
      "Why a list of 10,000 items scrolls smoothly — while the same data in a plain ScrollView would freeze the app.",
    codeFile: "ContactList.tsx",
    code: `const ROW_H = 64

function ContactList({ contacts }) {
  const renderItem = useCallback(
    ({ item }) => <Row name={item.name} />,   // mounts a live row
    [],
  )
  const keyExtractor = useCallback((item) => item.id, [])   // stable key, not index
  const getItemLayout = useCallback(
    (_, i) => ({ length: ROW_H, offset: ROW_H * i, index: i }),  // no measuring
    [],
  )
  return (
    <FlatList
      data={contacts}            // 10,000 rows — a ScrollView would mount them all
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      windowSize={5}
    />
  )
}`,
  },
  {
    id: "hermes",
    title: "Hermes Engine",
    description: "How JS is compiled to bytecode and executed",
    renderer: "FlowDiagram",
    tags: ["performance", "advanced"],
    analogy:
      "Meal-prepping on Sunday instead of cooking every dish from scratch at dinnertime — the work is done ahead, so serving is instant.",
    scenario:
      "Why turning on Hermes cuts startup time and memory: the JS ships pre-compiled to bytecode instead of being parsed on the phone.",
    codeFile: "build.sh",
    code: `# How your JS becomes a Hermes app. The split that matters:
# everything above the line is BUILD TIME; below it is ON DEVICE.

# 1. Metro stitches every module into one bundle (build machine)
metro build index.js --out build/bundle.js

# 2. hermesc compiles that bundle AHEAD OF TIME → bytecode
hermesc -emit-binary -out build/index.hbc build/bundle.js
#   → ships build/index.hbc inside the app. No JS source on device.

# 3. ON DEVICE: the Hermes VM mmaps index.hbc and runs it —
hermesVM.run("index.hbc")   # no parse, no compile, no JIT — just execute

# JSC path (the old default, pre-0.70): ship raw bundle.js, then
#   parse + compile it on device every launch — JIT recompiles hot code.`,
  },
  {
    id: "metro",
    title: "Metro Bundler",
    description: "How your code is transformed and bundled",
    renderer: "FlowDiagram",
    tags: ["tooling", "intermediate"],
    analogy:
      "A printing press that gathers every page (module), formats them, and binds them into one book your app can read.",
    scenario:
      "Why a single 'unable to resolve module' breaks the build — and how Fast Refresh hot-swaps just the file you edited.",
    codeFile: "bundle.out.js",
    code: `// ── two source modules (what you wrote) ──────────────────
// Button.js
export const Button = ({ label }) => <Text>{label}</Text>

// index.js
import { Button } from './Button'      // ← Resolution follows this

// ── after Transformation (Babel: JSX + TS → plain JS) ────────
// JSX above becomes React.createElement(...) calls, types erased

// ── after Serialization (what actually ships) ───────────────
// runtime prelude defines __r (require), __d (define), __c (clear)
__d(function (g, _require, _import, module, exports) {
  exports.Button = (p) => _require(2).createElement(/* … */)
}, 0, [2]);                            // module id 0 (Button), deps: [2]
__d(function (g, _require) {
  const Button = _require(0).Button    // require by NUMERIC id, not path
}, 1, [0]);                            // module id 1 (index), deps: [0]
__r(1);                                // boot: run the entry module
// Metro emits this JS text — hermesc compiles it to bytecode later`,
  },
  {
    id: "navigation",
    title: "React Navigation Internals",
    description: "Stack, tab, and drawer navigator mechanics",
    renderer: "NavigationStack",
    tags: ["navigation", "intermediate"],
    analogy:
      "A stack of cards: each new screen lands on top; going back lifts the top card off to reveal the one beneath.",
    scenario:
      "Why a screen stays mounted underneath when you push a new one — and why that back gesture feels truly native.",
    codeFile: "AppNavigator.tsx",
    code: `import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()   // a navigator IS a component

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  )
}

function HomeScreen({ navigation }) {
  // You don't mutate state — you dispatch an ACTION; a router reducer
  // returns the next { index, routes } tree.
  return <Button title="Go" onPress={() => navigation.navigate('Details')} />
}`,
  },
  {
    id: "animated",
    title: "Animated API",
    description: "JS driver vs Native driver — what runs where",
    renderer: "ThreadDiagram",
    tags: ["animation", "performance", "advanced"],
    analogy:
      "Handing a flip-book to someone else to flip at a steady pace, so it keeps playing smoothly even while you're busy with something else.",
    scenario:
      "Why useNativeDriver:true keeps an animation at 60fps even when the JS thread is blocked — and why it covers transform, opacity, and color, but not layout props like width and height.",
    codeFile: "PulseCard.tsx",
    code: `function PulseCard() {
  const progress = useRef(new Animated.Value(0)).current   // one node, starts at 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(progress, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    ).start()                                                // hand off to the UI thread once
  }, [])

  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] })
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4], extrapolate: 'clamp' })

  return <Animated.View style={{ opacity, transform: [{ rotate }, { scale }] }} />
}`,
  },
  {
    id: "render-pipeline",
    title: "The Render Pipeline",
    description: "Fabric's three phases — render, commit, mount — from React's commit to native views",
    renderer: "FlowDiagram",
    tags: ["architecture", "advanced", "new-arch"],
    analogy:
      "A print shop. One station typesets a fresh copy of only the pages you changed, another measures every page and locks the final layout, and a third runs out front and swaps just those pages into the binder on the shelf.",
    scenario:
      "Why layout doesn't freeze when your JS thread is busy, why you never see half-updated frames, and what \"Fabric clones the shadow tree\" actually means in an interview.",
    codeFile: "fabric-pipeline.txt",
    code: `// Fabric's render pipeline, in pseudo host-config ops.
// React commits an element tree → Fabric runs RENDER → COMMIT → MOUNT.

// ── RENDER ── build an IMMUTABLE C++ shadow tree (one node per host component)
const root  = createNode("View",  rootProps)
const text  = createNode("Text",  { value: "Hi" })
const image = createNode("Image", { source: avatar })
appendChild(root, text)
appendChild(root, image)

// On an update the tree is never mutated — it is CLONED.
// Clone only the changed node + the path to the root; SHARE the rest.
const image2 = cloneNodeWithNewProps(image, { source: newAvatar })
const root2  = cloneNode(root)          // text is shared, not cloned
appendChild(root2, image2)

// ── COMMIT ── run Yoga layout, then promote the new tree
layout(root2)            // Yoga computes x/y/width/height — off the JS thread
commit(root2)            // promote root2 as the "next tree" to mount

// ── MOUNT ── diff prev vs next, apply minimal mutations on the MAIN thread
const mutations = diff(previousTree, root2)   // → [updateView(image, …)]
mount(mutations)         // createView / updateView / removeView / deleteView`,
  },
  {
    id: "startup",
    title: "App Startup & TTI",
    description: "Icon tap to first interactive frame: the cold-start sequence across threads",
    renderer: "Timeline",
    tags: ["architecture", "performance", "intermediate"],
    analogy:
      "Opening a restaurant for the day: unlock the doors and turn on the lights, fire up the kitchen, prep every station, plate the first order — and only then can a guest actually be served.",
    scenario:
      "Why your app shows a blank or splash screen for a beat after the icon tap — and which levers (Hermes, inline requires, a smaller bundle) actually move that time.",
    codeFile: "boot.js",
    code: `// index.js — the app entry. The COMMENTED boot order below is what
// happens on a cold start, from icon tap to the first interactive frame.
import { AppRegistry } from 'react-native'
import App from './App'

// 1. NATIVE LAUNCH   — OS creates the process, runs native startup (main thread)
// 2. RUNTIME INIT    — RN runtime + JS engine (Hermes) spin up
// 3. BUNDLE LOAD+EVAL— Hermes mmaps the .hbc bytecode, evaluates module factories
//                      (this file's top-level code runs HERE)

AppRegistry.registerComponent('App', () => App) // name the root component

// 4. The native host then calls runApplication('App') into a Surface, which:
// 5. FIRST RENDER    — React renders your tree (reconcile, on the JS thread)
// 6. COMMIT + LAYOUT — commit the tree, Yoga lays it out (shadow thread)
//    + MOUNT         — mount the first host views (main thread)
// 7. FIRST FRAME     — the first interactive frame paints  →  TTI`,
  },
]

export const getConcept = (id: string) => concepts.find((c) => c.id === id)
