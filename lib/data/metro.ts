import { Step } from "../types"

export const metroSteps: Step[] = [
  {
    "step": 1,
    "narration": "Before any React Native code can run, Metro has to turn your hundreds of source files into something the JS engine can execute. It all starts from a single entry file, usually index.js.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [],
      "highlighted": [
        "entry"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Metro builds your app from one entry file",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 2,
    "narration": "First comes Resolution. Metro reads your entry file, follows every import and require, and walks the whole tree to discover every module your app touches.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "resolution"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Follow every import starting at the entry",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 3,
    "narration": "The output of resolution is a dependency graph \u2014 every module as a node, every import as an edge. This graph is what the rest of the pipeline operates on.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "graph",
          "label": "Dependency Graph",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "resolution",
          "to": "graph",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "graph"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Modules = nodes, imports = edges",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 4,
    "narration": "Next is Transformation. Metro hands each module to Babel, which strips out JSX and TypeScript and lowers modern syntax into plain JavaScript that Hermes can parse.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "graph",
          "label": "Dependency Graph",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "transform",
          "label": "Transformation (Babel)",
          "x": 440,
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
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "resolution",
          "to": "graph",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "graph",
          "to": "transform",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "transform"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "JSX + TS -> plain JS, per module",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "Transformation runs per module and is heavily cached, so on a rebuild Metro only re-transforms the files that actually changed. That cache is why your second start is so much faster than the first.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "graph",
          "label": "Dependency Graph",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "transform",
          "label": "Transformation (Babel)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        },
        {
          "id": "cache",
          "label": "Transform Cache",
          "x": 440,
          "y": 165,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "resolution",
          "to": "graph",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "graph",
          "to": "transform",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "transform",
          "to": "cache",
          "dashed": true,
          "color": "#FCD34D"
        }
      ],
      "highlighted": [
        "cache"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Cached per-module: only rebuild what changed",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "Finally Serialization stitches every transformed module together \u2014 in dependency order, each wrapped with its own ID \u2014 and concatenates them into one big file.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "graph",
          "label": "Dependency Graph",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "transform",
          "label": "Transformation (Babel)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        },
        {
          "id": "cache",
          "label": "Transform Cache",
          "x": 440,
          "y": 165,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialization",
          "x": 620,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "resolution",
          "to": "graph",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "graph",
          "to": "transform",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "transform",
          "to": "cache",
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e5",
          "from": "transform",
          "to": "serialize",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "serialize"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Combine modules in dependency order",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "The result is a single JS bundle that gets shipped to the device, where Hermes loads and runs it. One file, one request \u2014 fast for the engine to start up.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "graph",
          "label": "Dependency Graph",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "transform",
          "label": "Transformation (Babel)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        },
        {
          "id": "cache",
          "label": "Transform Cache",
          "x": 440,
          "y": 165,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialization",
          "x": 620,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "bundle",
          "label": "JS Bundle -> Hermes",
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
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "resolution",
          "to": "graph",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "graph",
          "to": "transform",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "transform",
          "to": "cache",
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e5",
          "from": "transform",
          "to": "serialize",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e6",
          "from": "serialize",
          "to": "bundle",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "bundle"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "One bundle shipped to the device",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "In development Metro stays running as a server and holds an open websocket to the app. This is the channel that powers Fast Refresh.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "graph",
          "label": "Dependency Graph",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "transform",
          "label": "Transformation (Babel)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        },
        {
          "id": "cache",
          "label": "Transform Cache",
          "x": 440,
          "y": 165,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialization",
          "x": 620,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "bundle",
          "label": "JS Bundle -> Hermes",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "ws",
          "label": "Metro Dev Server",
          "x": 250,
          "y": 355,
          "style": "pill",
          "color": "#4F46E5",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "resolution",
          "to": "graph",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "graph",
          "to": "transform",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "transform",
          "to": "cache",
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e5",
          "from": "transform",
          "to": "serialize",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e6",
          "from": "serialize",
          "to": "bundle",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e7",
          "from": "ws",
          "to": "bundle",
          "dashed": true,
          "color": "#FCD34D",
          "label": "websocket"
        }
      ],
      "highlighted": [
        "ws"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Dev server keeps an open websocket to the app",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "When you save a file, Metro re-transforms only that one changed module \u2014 not the whole bundle \u2014 and pushes just that module over the websocket to the running app.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "graph",
          "label": "Dependency Graph",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "transform",
          "label": "Transformation (Babel)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        },
        {
          "id": "cache",
          "label": "Transform Cache",
          "x": 440,
          "y": 165,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialization",
          "x": 620,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "bundle",
          "label": "JS Bundle -> Hermes",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "ws",
          "label": "Metro Dev Server",
          "x": 250,
          "y": 355,
          "style": "pill",
          "color": "#4F46E5",
          "width": 170,
          "height": 40
        },
        {
          "id": "changed",
          "label": "Changed Module",
          "x": 440,
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
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "resolution",
          "to": "graph",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "graph",
          "to": "transform",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "transform",
          "to": "cache",
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e5",
          "from": "transform",
          "to": "serialize",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e6",
          "from": "serialize",
          "to": "bundle",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e7",
          "from": "ws",
          "to": "bundle",
          "dashed": true,
          "color": "#FCD34D",
          "label": "websocket"
        },
        {
          "id": "e8",
          "from": "changed",
          "to": "ws",
          "animated": true,
          "color": "#F59E0B"
        }
      ],
      "highlighted": [
        "changed",
        "ws"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "On save: send only the changed module",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 10,
    "narration": "The app's HMR runtime hot-swaps that module in place and re-renders the affected React components, so your edit shows up instantly while your component state is preserved.",
    "diagram_state": {
      "nodes": [
        {
          "id": "entry",
          "label": "index.js (entry)",
          "x": 60,
          "y": 260,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "resolution",
          "label": "Resolution",
          "x": 250,
          "y": 70,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 64
        },
        {
          "id": "graph",
          "label": "Dependency Graph",
          "x": 250,
          "y": 260,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "transform",
          "label": "Transformation (Babel)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        },
        {
          "id": "cache",
          "label": "Transform Cache",
          "x": 440,
          "y": 165,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialization",
          "x": 620,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 64
        },
        {
          "id": "bundle",
          "label": "JS Bundle -> Hermes",
          "x": 620,
          "y": 260,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "ws",
          "label": "Metro Dev Server",
          "x": 250,
          "y": 355,
          "style": "pill",
          "color": "#4F46E5",
          "width": 170,
          "height": 40
        },
        {
          "id": "changed",
          "label": "Changed Module",
          "x": 440,
          "y": 355,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "hmr",
          "label": "HMR: hot-swap + re-render",
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
          "id": "e1",
          "from": "entry",
          "to": "resolution",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e2",
          "from": "resolution",
          "to": "graph",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e3",
          "from": "graph",
          "to": "transform",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "transform",
          "to": "cache",
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e5",
          "from": "transform",
          "to": "serialize",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e6",
          "from": "serialize",
          "to": "bundle",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e7",
          "from": "ws",
          "to": "bundle",
          "dashed": true,
          "color": "#FCD34D",
          "label": "websocket"
        },
        {
          "id": "e8",
          "from": "changed",
          "to": "ws",
          "animated": true,
          "color": "#F59E0B"
        },
        {
          "id": "e9",
          "from": "ws",
          "to": "hmr",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "hmr"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Fast Refresh swaps the module, keeps state",
          "x": 400,
          "y": 465,
          "color": "#374151"
        }
      ]
    }
  }
]
