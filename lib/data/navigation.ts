import { Step } from "../types"

export const navigationSteps: Step[] = [
  {
    "step": 1,
    "narration": "At its core, React Navigation holds a single navigation state tree in JavaScript \u2014 a plain serializable object that describes every navigator, route, and which one is focused.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        }
      ],
      "edges": [],
      "highlighted": [
        "state"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "One serializable JS object = source of truth",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 2,
    "narration": "The most common navigator is the Native Stack. Think of it as a stack of cards \u2014 when the app opens, your first screen, Home, sits at the bottom and is the active card.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home (active)",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "home",
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "home"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Stack bottom = first screen, currently focused",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 3,
    "narration": "When you call navigation.navigate('Details') or push, a new route is appended to the stack array \u2014 Details slides in on top and becomes the focused screen.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "details",
          "label": "Details (active)",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "details",
          "color": "#818CF8",
          "animated": true,
          "label": "push"
        }
      ],
      "highlighted": [
        "details"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "push() appends a route; top of stack is active",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 4,
    "narration": "Push again and Profile stacks on top. Each card stays mounted underneath, so going back is instant \u2014 nothing below was destroyed.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "details",
          "label": "Details",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "profile",
          "label": "Profile (active)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "profile",
          "color": "#818CF8",
          "animated": true,
          "label": "push"
        }
      ],
      "highlighted": [
        "profile"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Screens below stay mounted, not torn down",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "Here's the key insight: the stack you see isn't drawn by JS. @react-navigation/native-stack hands the route list to a native container \u2014 UINavigationController on iOS, a Fragment-based stack on Android.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "details",
          "label": "Details",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "profile",
          "label": "Profile (active)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        },
        {
          "id": "nativenav",
          "label": "UINavigationController / Fragment",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "profile",
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "profile",
          "to": "nativenav",
          "color": "#6EE7B7",
          "animated": true,
          "label": "route list"
        }
      ],
      "highlighted": [
        "nativenav"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "react-native-screens maps routes to native stack",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "Because real native primitives back the stack, you get native transitions and the edge-swipe back gesture for free \u2014 the animation runs on the UI thread, not in JS.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "details",
          "label": "Details",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "profile",
          "label": "Profile (active)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        },
        {
          "id": "nativenav",
          "label": "UINavigationController / Fragment",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "gesture",
          "label": "Native gesture + transition",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "profile",
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "profile",
          "to": "nativenav",
          "color": "#6EE7B7",
          "animated": true,
          "label": "route list"
        },
        {
          "id": "e3",
          "from": "gesture",
          "to": "nativenav",
          "color": "#8B5CF6"
        }
      ],
      "highlighted": [
        "gesture"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Transitions run on the UI thread, off JS",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "When the user swipes back or you call goBack(), the native side fires an event up to JS, which pops the top route off the state array \u2014 Profile is removed and Details is focused again.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "details",
          "label": "Details (active)",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        },
        {
          "id": "profile",
          "label": "Profile (popped)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#DC2626",
          "width": 300,
          "height": 64
        },
        {
          "id": "nativenav",
          "label": "UINavigationController / Fragment",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "gesture",
          "label": "Native gesture + transition",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "details",
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "profile",
          "to": "nativenav",
          "color": "#6EE7B7"
        },
        {
          "id": "e3",
          "from": "gesture",
          "to": "nativenav",
          "color": "#8B5CF6"
        },
        {
          "id": "e4",
          "from": "nativenav",
          "to": "state",
          "color": "#FCD34D",
          "dashed": true,
          "label": "pop event"
        }
      ],
      "highlighted": [
        "profile",
        "details"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "goBack() pops top route, prior screen refocuses",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "Stacks aren't the only navigator. A Tab navigator holds sibling routes side by side instead of stacked, and a tab bar lets you jump between them without a push history.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "details",
          "label": "Details (active)",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        },
        {
          "id": "profile",
          "label": "Profile (popped)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#DC2626",
          "width": 300,
          "height": 64
        },
        {
          "id": "nativenav",
          "label": "UINavigationController / Fragment",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "gesture",
          "label": "Native gesture + transition",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "tabbar",
          "label": "Tab Navigator (siblings)",
          "x": 620,
          "y": 165,
          "style": "pill",
          "color": "#3B82F6",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "details",
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "profile",
          "to": "nativenav",
          "color": "#6EE7B7"
        },
        {
          "id": "e3",
          "from": "gesture",
          "to": "nativenav",
          "color": "#8B5CF6"
        },
        {
          "id": "e4",
          "from": "nativenav",
          "to": "state",
          "color": "#FCD34D",
          "dashed": true,
          "label": "pop event"
        },
        {
          "id": "e5",
          "from": "state",
          "to": "tabbar",
          "color": "#3B82F6",
          "label": "tabs"
        }
      ],
      "highlighted": [
        "tabbar"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Tabs = parallel routes, switch not push",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "Navigators nest: the tab navigator can be the root, and one tab can itself contain a native stack \u2014 so the state tree is genuinely a tree of navigators, each owning its own routes.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "details",
          "label": "Details (active)",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        },
        {
          "id": "profile",
          "label": "Profile (popped)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#DC2626",
          "width": 300,
          "height": 64
        },
        {
          "id": "nativenav",
          "label": "UINavigationController / Fragment",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "gesture",
          "label": "Native gesture + transition",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "tabbar",
          "label": "Tab Navigator (siblings)",
          "x": 620,
          "y": 165,
          "style": "pill",
          "color": "#3B82F6",
          "width": 170,
          "height": 40
        },
        {
          "id": "nested",
          "label": "Stack nested in a tab",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "details",
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "profile",
          "to": "nativenav",
          "color": "#6EE7B7"
        },
        {
          "id": "e3",
          "from": "gesture",
          "to": "nativenav",
          "color": "#8B5CF6"
        },
        {
          "id": "e4",
          "from": "nativenav",
          "to": "state",
          "color": "#FCD34D",
          "dashed": true,
          "label": "pop event"
        },
        {
          "id": "e5",
          "from": "state",
          "to": "tabbar",
          "color": "#3B82F6",
          "label": "tabs"
        },
        {
          "id": "e6",
          "from": "tabbar",
          "to": "nested",
          "color": "#F59E0B",
          "label": "child stack"
        }
      ],
      "highlighted": [
        "nested",
        "tabbar"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Navigators nest; each owns its own routes",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 10,
    "narration": "So the whole system is one JS state tree driving real native containers: JS owns history and logic, the native side owns rendering and gestures, and they stay in sync through dispatched actions and bubbled events.",
    "diagram_state": {
      "nodes": [
        {
          "id": "state",
          "label": "Navigation State Tree",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 64
        },
        {
          "id": "home",
          "label": "Home",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#374151",
          "width": 300,
          "height": 64
        },
        {
          "id": "details",
          "label": "Details (active)",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 300,
          "height": 64
        },
        {
          "id": "profile",
          "label": "Profile (popped)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#DC2626",
          "width": 300,
          "height": 64
        },
        {
          "id": "nativenav",
          "label": "UINavigationController / Fragment",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "gesture",
          "label": "Native gesture + transition",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "tabbar",
          "label": "Tab Navigator (siblings)",
          "x": 620,
          "y": 165,
          "style": "pill",
          "color": "#3B82F6",
          "width": 170,
          "height": 40
        },
        {
          "id": "nested",
          "label": "Stack nested in a tab",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "state",
          "to": "details",
          "color": "#818CF8",
          "animated": true,
          "label": "dispatch"
        },
        {
          "id": "e2",
          "from": "profile",
          "to": "nativenav",
          "color": "#6EE7B7"
        },
        {
          "id": "e3",
          "from": "gesture",
          "to": "nativenav",
          "color": "#8B5CF6"
        },
        {
          "id": "e4",
          "from": "nativenav",
          "to": "state",
          "color": "#FCD34D",
          "dashed": true,
          "label": "events"
        },
        {
          "id": "e5",
          "from": "state",
          "to": "tabbar",
          "color": "#3B82F6",
          "label": "tabs"
        },
        {
          "id": "e6",
          "from": "tabbar",
          "to": "nested",
          "color": "#F59E0B",
          "label": "child stack"
        }
      ],
      "highlighted": [
        "state",
        "nativenav"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "JS owns history; native owns pixels and gestures",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  }
]
