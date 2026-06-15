import { Step } from "../types"

export const useeffectSteps: Step[] = [
  {
    "step": 1,
    "narration": "Let's trace what actually happens when a component renders. First, React calls your function component to produce the next UI description.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [],
      "highlighted": [
        "render"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Render is pure: no side effects allowed here",
          "x": 400,
          "y": 460,
          "color": "#4F46E5"
        }
      ]
    }
  },
  {
    "step": 2,
    "narration": "Next, React commits those changes to the host tree \u2014 under the New Architecture that's the Fabric renderer mutating the native view hierarchy via C++.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "commit"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Fabric commits the new tree to native views",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 3,
    "narration": "Then the platform actually paints those pixels to the screen \u2014 UIKit on iOS, the Android view system on the other side.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "paint",
          "label": "Native Paint",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "commit",
          "to": "paint",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "paint"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Screen shows pixels before any effect runs",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 4,
    "narration": "Only now \u2014 AFTER paint \u2014 does React run your useEffect callback. This is the key idea: effects never block what the user sees.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "paint",
          "label": "Native Paint",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effect",
          "label": "useEffect runs",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "commit",
          "to": "paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "paint",
          "to": "effect",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "effect"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Effects fire asynchronously, after the paint",
          "x": 400,
          "y": 460,
          "color": "#8B5CF6"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "What the effect does best is reach outside React \u2014 fetching data, opening a subscription, or calling a TurboModule over JSI to native code.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "paint",
          "label": "Native Paint",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effect",
          "label": "useEffect runs",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "side",
          "label": "Side Effect\n(fetch / subscribe / TurboModule)",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "commit",
          "to": "paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "paint",
          "to": "effect",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "effect",
          "to": "side",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "side"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "TurboModules call native synchronously via JSI",
          "x": 400,
          "y": 460,
          "color": "#3B82F6"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "The dependency array decides when the effect re-runs. With an empty array, it runs exactly once after the first mount and never again.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "paint",
          "label": "Native Paint",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effect",
          "label": "useEffect runs",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "side",
          "label": "Side Effect\n(fetch / subscribe / TurboModule)",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "deps_empty",
          "label": "[] \u2014 once on mount",
          "x": 60,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "commit",
          "to": "paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "paint",
          "to": "effect",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "effect",
          "to": "side",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "deps_empty",
          "to": "effect",
          "dashed": true,
          "color": "#6EE7B7",
          "label": "run 1x"
        }
      ],
      "highlighted": [
        "deps_empty"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Empty deps = mount-only setup",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "List a value like [userId] and React re-runs the effect only when that value changes between renders, comparing with Object.is.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "paint",
          "label": "Native Paint",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effect",
          "label": "useEffect runs",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "side",
          "label": "Side Effect\n(fetch / subscribe / TurboModule)",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "deps_empty",
          "label": "[] \u2014 once on mount",
          "x": 60,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        },
        {
          "id": "deps_val",
          "label": "[userId] \u2014 on change",
          "x": 250,
          "y": 355,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "commit",
          "to": "paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "paint",
          "to": "effect",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "effect",
          "to": "side",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "deps_empty",
          "to": "effect",
          "dashed": true,
          "color": "#6EE7B7",
          "label": "run 1x"
        },
        {
          "id": "e6",
          "from": "deps_val",
          "to": "effect",
          "dashed": true,
          "color": "#FCD34D",
          "label": "on change"
        }
      ],
      "highlighted": [
        "deps_val"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Re-runs when a listed dep changes identity",
          "x": 400,
          "y": 460,
          "color": "#F59E0B"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "Omit the array entirely and the effect runs after every single render \u2014 almost always a mistake that causes runaway re-renders or repeated fetches.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "paint",
          "label": "Native Paint",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effect",
          "label": "useEffect runs",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "side",
          "label": "Side Effect\n(fetch / subscribe / TurboModule)",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "deps_empty",
          "label": "[] \u2014 once on mount",
          "x": 60,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        },
        {
          "id": "deps_val",
          "label": "[userId] \u2014 on change",
          "x": 250,
          "y": 355,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "deps_none",
          "label": "no array \u2014 every render",
          "x": 440,
          "y": 355,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "commit",
          "to": "paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "paint",
          "to": "effect",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "effect",
          "to": "side",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "deps_empty",
          "to": "effect",
          "dashed": true,
          "color": "#6EE7B7",
          "label": "run 1x"
        },
        {
          "id": "e6",
          "from": "deps_val",
          "to": "effect",
          "dashed": true,
          "color": "#FCD34D",
          "label": "on change"
        },
        {
          "id": "e7",
          "from": "deps_none",
          "to": "effect",
          "dashed": true,
          "color": "#DC2626",
          "label": "always"
        }
      ],
      "highlighted": [
        "deps_none"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "No array = runs every render (usually a bug)",
          "x": 400,
          "y": 460,
          "color": "#DC2626"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "If your effect returns a function, that's the cleanup. React runs it before the next effect re-run and once more when the component unmounts.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "paint",
          "label": "Native Paint",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effect",
          "label": "useEffect runs",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "side",
          "label": "Side Effect\n(fetch / subscribe / TurboModule)",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "deps_empty",
          "label": "[] \u2014 once on mount",
          "x": 60,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        },
        {
          "id": "deps_val",
          "label": "[userId] \u2014 on change",
          "x": 250,
          "y": 355,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "deps_none",
          "label": "no array \u2014 every render",
          "x": 440,
          "y": 355,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        },
        {
          "id": "cleanup",
          "label": "Cleanup fn",
          "x": 620,
          "y": 70,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "commit",
          "to": "paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "paint",
          "to": "effect",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "effect",
          "to": "side",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "deps_empty",
          "to": "effect",
          "dashed": true,
          "color": "#6EE7B7",
          "label": "run 1x"
        },
        {
          "id": "e6",
          "from": "deps_val",
          "to": "effect",
          "dashed": true,
          "color": "#FCD34D",
          "label": "on change"
        },
        {
          "id": "e7",
          "from": "deps_none",
          "to": "effect",
          "dashed": true,
          "color": "#DC2626",
          "label": "always"
        },
        {
          "id": "e8",
          "from": "effect",
          "to": "cleanup",
          "dashed": true,
          "color": "#FCD34D",
          "label": "returns"
        }
      ],
      "highlighted": [
        "cleanup"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Cleanup runs before re-run and on unmount",
          "x": 400,
          "y": 460,
          "color": "#D97706"
        }
      ]
    }
  },
  {
    "step": 10,
    "narration": "So the real lifecycle is cleanup-then-effect on every re-run: tear down the old subscription before setting up the new one. That ordering is what keeps your side effects leak-free.",
    "diagram_state": {
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit (Fabric)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "paint",
          "label": "Native Paint",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effect",
          "label": "useEffect runs",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "side",
          "label": "Side Effect\n(fetch / subscribe / TurboModule)",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "deps_empty",
          "label": "[] \u2014 once on mount",
          "x": 60,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        },
        {
          "id": "deps_val",
          "label": "[userId] \u2014 on change",
          "x": 250,
          "y": 355,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "deps_none",
          "label": "no array \u2014 every render",
          "x": 440,
          "y": 355,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        },
        {
          "id": "cleanup",
          "label": "Cleanup fn",
          "x": 620,
          "y": 70,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "render",
          "to": "commit",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "commit",
          "to": "paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "paint",
          "to": "effect",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "effect",
          "to": "side",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "deps_empty",
          "to": "effect",
          "dashed": true,
          "color": "#6EE7B7",
          "label": "run 1x"
        },
        {
          "id": "e6",
          "from": "deps_val",
          "to": "effect",
          "dashed": true,
          "color": "#FCD34D",
          "label": "on change"
        },
        {
          "id": "e7",
          "from": "deps_none",
          "to": "effect",
          "dashed": true,
          "color": "#DC2626",
          "label": "always"
        },
        {
          "id": "e8",
          "from": "effect",
          "to": "cleanup",
          "dashed": true,
          "color": "#FCD34D",
          "label": "returns"
        },
        {
          "id": "e9",
          "from": "cleanup",
          "to": "effect",
          "animated": true,
          "color": "#FCD34D",
          "label": "then re-run"
        }
      ],
      "highlighted": [
        "cleanup",
        "effect"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Tear down old, then set up new \u2014 no leaks",
          "x": 400,
          "y": 460,
          "color": "#D97706"
        }
      ]
    }
  }
]
