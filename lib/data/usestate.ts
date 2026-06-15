import { Step } from "../types"

export const usestateSteps: Step[] = [
  {
    "step": 1,
    "narration": "Here's a tiny component tree: a Parent holding state, with two children below it. This is the structure React keeps in memory as the element tree.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (useState)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [],
      "highlighted": [
        "parent"
      ],
      "annotations": []
    }
  },
  {
    "step": 2,
    "narration": "The Parent renders two children, ChildA and ChildB. Each gets props passed down from the Parent.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (useState)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "childA",
          "label": "ChildA",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e-pa",
          "from": "parent",
          "to": "childA"
        }
      ],
      "highlighted": [
        "childA"
      ],
      "annotations": []
    }
  },
  {
    "step": 3,
    "narration": "And here's the second child. Both ChildA and ChildB sit one level below the Parent in the tree.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (useState)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "childA",
          "label": "ChildA",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "childB",
          "label": "ChildB",
          "x": 440,
          "y": 260,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e-pa",
          "from": "parent",
          "to": "childA"
        },
        {
          "id": "e-pb",
          "from": "parent",
          "to": "childB"
        }
      ],
      "highlighted": [
        "childB"
      ],
      "annotations": []
    }
  },
  {
    "step": 4,
    "narration": "Now an event fires and you call setState. That doesn't mutate anything synchronously \u2014 it just hands React a new state value and schedules an update.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (useState)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "childA",
          "label": "ChildA",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "childB",
          "label": "ChildB",
          "x": 440,
          "y": 260,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "setstate",
          "label": "setState(next)",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e-pa",
          "from": "parent",
          "to": "childA"
        },
        {
          "id": "e-pb",
          "from": "parent",
          "to": "childB"
        },
        {
          "id": "e-set",
          "from": "setstate",
          "to": "parent",
          "label": "schedule",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "setstate"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "setState is async: it queues an update",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "React marks the Parent as dirty \u2014 it needs to re-render. On the next render pass React calls the Parent function again to produce a fresh element tree.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (dirty)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childA",
          "label": "ChildA",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "childB",
          "label": "ChildB",
          "x": 440,
          "y": 260,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "setstate",
          "label": "setState(next)",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e-pa",
          "from": "parent",
          "to": "childA"
        },
        {
          "id": "e-pb",
          "from": "parent",
          "to": "childB"
        },
        {
          "id": "e-set",
          "from": "setstate",
          "to": "parent",
          "label": "schedule",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "parent"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Dirty = re-render this component next pass",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "By default, re-rendering a parent re-renders its children too. So ChildA and ChildB both get called again \u2014 even if their props didn't really change.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (dirty)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childA",
          "label": "ChildA (re-render)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childB",
          "label": "ChildB (re-render)",
          "x": 440,
          "y": 260,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "setstate",
          "label": "setState(next)",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e-pa",
          "from": "parent",
          "to": "childA",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e-pb",
          "from": "parent",
          "to": "childB",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e-set",
          "from": "setstate",
          "to": "parent",
          "label": "schedule",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "childA",
        "childB"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Re-render cascades to children by default",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "If you wrap ChildB in React.memo, React compares its incoming props. Same props means it bails out and reuses the previous render \u2014 ChildB stays untouched.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (dirty)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childA",
          "label": "ChildA (re-render)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childB",
          "label": "ChildB (memo, skip)",
          "x": 440,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "setstate",
          "label": "setState(next)",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e-pa",
          "from": "parent",
          "to": "childA",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e-pb",
          "from": "parent",
          "to": "childB",
          "dashed": true,
          "color": "#6EE7B7",
          "label": "props equal"
        },
        {
          "id": "e-set",
          "from": "setstate",
          "to": "parent",
          "label": "schedule",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "childB"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "React.memo skips re-render on equal props",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "The components that did re-render produce new React elements. The reconciler diffs this new tree against the previous one to find what actually changed.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (dirty)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childA",
          "label": "ChildA (re-render)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childB",
          "label": "ChildB (memo, skip)",
          "x": 440,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "setstate",
          "label": "setState(next)",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "reconciler",
          "label": "Reconciler (diff)",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e-pa",
          "from": "parent",
          "to": "childA",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e-pb",
          "from": "parent",
          "to": "childB",
          "dashed": true,
          "color": "#6EE7B7",
          "label": "props equal"
        },
        {
          "id": "e-set",
          "from": "setstate",
          "to": "parent",
          "label": "schedule",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e-ar",
          "from": "childA",
          "to": "reconciler",
          "animated": true,
          "color": "#818CF8",
          "label": "diff"
        }
      ],
      "highlighted": [
        "reconciler"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Reconciler diffs new vs old element tree",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "Under the New Architecture, the diff hands a minimal set of mutations to Fabric, which commits only the changed native views on the main thread \u2014 no Bridge serialization involved.",
    "diagram_state": {
      "nodes": [
        {
          "id": "parent",
          "label": "Parent (dirty)",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childA",
          "label": "ChildA (re-render)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#DC2626",
          "width": 170,
          "height": 64
        },
        {
          "id": "childB",
          "label": "ChildB (memo, skip)",
          "x": 440,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "setstate",
          "label": "setState(next)",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "reconciler",
          "label": "Reconciler (diff)",
          "x": 250,
          "y": 355,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "fabric",
          "label": "Fabric commit",
          "x": 620,
          "y": 355,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e-pa",
          "from": "parent",
          "to": "childA",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e-pb",
          "from": "parent",
          "to": "childB",
          "dashed": true,
          "color": "#6EE7B7",
          "label": "props equal"
        },
        {
          "id": "e-set",
          "from": "setstate",
          "to": "parent",
          "label": "schedule",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e-ar",
          "from": "childA",
          "to": "reconciler",
          "animated": true,
          "color": "#818CF8",
          "label": "diff"
        },
        {
          "id": "e-rf",
          "from": "reconciler",
          "to": "fabric",
          "animated": true,
          "color": "#6EE7B7",
          "label": "commit changes"
        }
      ],
      "highlighted": [
        "fabric"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Fabric commits only changed views via JSI",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  }
]
