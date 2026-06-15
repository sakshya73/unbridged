import { Step } from "../types"

export const lifecycleSteps: Step[] = [
  {
    "step": 1,
    "narration": "In the hooks era, a function component's life runs along a timeline. It all begins with Mount \u2014 the very first time React puts this component on screen.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
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
        "mount"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Lifecycle = Mount, Update, then Unmount",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 2,
    "narration": "Mounting kicks off the render phase: React calls your function to compute a description of the UI as elements. This phase is pure \u2014 no DOM, no side effects yet.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "render"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Render phase is pure: no side effects",
          "x": 400,
          "y": 460,
          "color": "#4F46E5"
        }
      ]
    }
  },
  {
    "step": 3,
    "narration": "The output is reconciled into a tree of Fabric shadow nodes in C++. Fabric is the New Architecture renderer, and it computes layout right there off the JS thread.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric Shadow Tree",
          "x": 250,
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
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "render",
          "to": "fabric",
          "label": "reconcile",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "fabric"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Fabric reconciles + lays out in C++",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 4,
    "narration": "Next is the commit phase: Fabric mounts that tree to the native host views, so the real pixels actually appear on screen.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric Shadow Tree",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit -> Native Views",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "render",
          "to": "fabric",
          "label": "reconcile",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "fabric",
          "to": "commit",
          "label": "commit phase",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "commit"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Commit mounts views = paint on screen",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "After the paint, React runs your useEffect callbacks. This is where you do side effects \u2014 subscriptions, timers, fetching data \u2014 and return a cleanup function for later.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric Shadow Tree",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit -> Native Views",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effects",
          "label": "Run useEffect",
          "x": 440,
          "y": 355,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "render",
          "to": "fabric",
          "label": "reconcile",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "fabric",
          "to": "commit",
          "label": "commit phase",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e4",
          "from": "commit",
          "to": "effects",
          "label": "after paint",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "effects"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "useEffect fires after the screen paints",
          "x": 400,
          "y": 460,
          "color": "#8B5CF6"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "Now the component is live. When state or props change, we enter the Update phase \u2014 the heart of the timeline that can repeat many times.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric Shadow Tree",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit -> Native Views",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effects",
          "label": "Run useEffect",
          "x": 440,
          "y": 355,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "update",
          "label": "Update (state/props)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "render",
          "to": "fabric",
          "label": "reconcile",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "fabric",
          "to": "commit",
          "label": "commit phase",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e4",
          "from": "commit",
          "to": "effects",
          "label": "after paint",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "update"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "State or prop change triggers an update",
          "x": 400,
          "y": 460,
          "color": "#3B82F6"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "An update re-runs the same render-reconcile-commit cycle, but Fabric diffs against the previous tree so only the changed views are touched. Effects with changed dependencies then re-run their cleanup and fire again.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric Shadow Tree",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit -> Native Views",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effects",
          "label": "Run useEffect",
          "x": 440,
          "y": 355,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "update",
          "label": "Update (state/props)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "render",
          "to": "fabric",
          "label": "reconcile",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "fabric",
          "to": "commit",
          "label": "commit phase",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e4",
          "from": "commit",
          "to": "effects",
          "label": "after paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "update",
          "to": "render",
          "label": "re-render",
          "animated": true,
          "dashed": true,
          "color": "#FCD34D"
        }
      ],
      "highlighted": [
        "update",
        "render",
        "effects"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Update reuses render -> commit -> effects",
          "x": 400,
          "y": 460,
          "color": "#3B82F6"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "Eventually the component leaves the tree \u2014 that's Unmount. React first runs every effect's cleanup function so subscriptions and timers are torn down.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric Shadow Tree",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit -> Native Views",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effects",
          "label": "Run useEffect",
          "x": 440,
          "y": 355,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "update",
          "label": "Update (state/props)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "cleanup",
          "label": "Cleanup Effects",
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
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "render",
          "to": "fabric",
          "label": "reconcile",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "fabric",
          "to": "commit",
          "label": "commit phase",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e4",
          "from": "commit",
          "to": "effects",
          "label": "after paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "update",
          "to": "render",
          "label": "re-render",
          "animated": true,
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e6",
          "from": "effects",
          "to": "cleanup",
          "label": "on unmount",
          "animated": true,
          "dashed": true,
          "color": "#FCD34D"
        }
      ],
      "highlighted": [
        "cleanup"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Unmount runs cleanup before removal",
          "x": 400,
          "y": 460,
          "color": "#F59E0B"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "Then Fabric commits the removal, unmounting the native host views so the UI disappears and memory is reclaimed.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric Shadow Tree",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit -> Native Views",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effects",
          "label": "Run useEffect",
          "x": 440,
          "y": 355,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "update",
          "label": "Update (state/props)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "cleanup",
          "label": "Cleanup Effects",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "remove",
          "label": "Remove Native Views",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "render",
          "to": "fabric",
          "label": "reconcile",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "fabric",
          "to": "commit",
          "label": "commit phase",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e4",
          "from": "commit",
          "to": "effects",
          "label": "after paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "update",
          "to": "render",
          "label": "re-render",
          "animated": true,
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e6",
          "from": "effects",
          "to": "cleanup",
          "label": "on unmount",
          "animated": true,
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e7",
          "from": "cleanup",
          "to": "remove",
          "label": "commit removal",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "remove"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Native views unmount, memory freed",
          "x": 400,
          "y": 460,
          "color": "#DC2626"
        }
      ]
    }
  },
  {
    "step": 10,
    "narration": "So the full picture: Mount renders and paints once, Update repeats render through effects on every change, and Unmount cleans up before the views are gone \u2014 all driven by Fabric's render and commit phases.",
    "diagram_state": {
      "nodes": [
        {
          "id": "mount",
          "label": "Mount",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "render",
          "label": "Render (call fn)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric Shadow Tree",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "commit",
          "label": "Commit -> Native Views",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "effects",
          "label": "Run useEffect",
          "x": 440,
          "y": 355,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "update",
          "label": "Update (state/props)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "cleanup",
          "label": "Cleanup Effects",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "remove",
          "label": "Remove Native Views",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "unmount",
          "label": "Unmount",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "mount",
          "to": "render",
          "label": "render phase",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "render",
          "to": "fabric",
          "label": "reconcile",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "fabric",
          "to": "commit",
          "label": "commit phase",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e4",
          "from": "commit",
          "to": "effects",
          "label": "after paint",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e5",
          "from": "update",
          "to": "render",
          "label": "re-render",
          "animated": true,
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e6",
          "from": "effects",
          "to": "cleanup",
          "label": "on unmount",
          "animated": true,
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e7",
          "from": "cleanup",
          "to": "remove",
          "label": "commit removal",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e8",
          "from": "unmount",
          "to": "cleanup",
          "label": "triggers",
          "animated": true,
          "dashed": true,
          "color": "#FCD34D"
        }
      ],
      "highlighted": [
        "mount",
        "update",
        "unmount"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Mount once, Update often, Unmount to tear down",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  }
]
