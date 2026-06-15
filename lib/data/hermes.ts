import { Step } from "../types"

export const hermesSteps: Step[] = [
  {
    "step": 1,
    "narration": "Every React Native app needs a JavaScript engine to actually run your code. In the modern New Architecture, that engine is Hermes \u2014 built by Meta specifically for mobile.",
    "diagram_state": {
      "nodes": [
        {
          "id": "hermes",
          "label": "Hermes Engine",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 70
        }
      ],
      "edges": [],
      "highlighted": [
        "hermes"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "The default JS engine in RN's New Architecture",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 2,
    "narration": "Hermes' big trick happens at build time, on your machine \u2014 not on the user's phone. It all starts with your plain JavaScript source.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "hermes",
          "label": "Hermes Engine",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 300,
          "height": 70
        }
      ],
      "edges": [],
      "highlighted": [
        "src"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Compilation happens on YOUR build machine",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 3,
    "narration": "During the build, the Hermes compiler takes that source and compiles it ahead of time. Nothing here runs on the device yet.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "compiler",
          "label": "Hermes Compiler\n(build time)",
          "x": 250,
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
          "from": "src",
          "to": "compiler",
          "animated": true,
          "color": "#818CF8",
          "label": "compile"
        }
      ],
      "highlighted": [
        "compiler"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Ahead-Of-Time (AOT) compilation, not on device",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 4,
    "narration": "The output is Hermes bytecode \u2014 a compact .hbc file. Your app ships this precompiled bundle instead of raw text JavaScript.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "compiler",
          "label": "Hermes Compiler\n(build time)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "bytecode",
          "label": "Bytecode Bundle\n(.hbc)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "src",
          "to": "compiler",
          "animated": true,
          "color": "#818CF8",
          "label": "compile"
        },
        {
          "id": "e2",
          "from": "compiler",
          "to": "bytecode",
          "animated": true,
          "color": "#818CF8",
          "label": "emit"
        }
      ],
      "highlighted": [
        "bytecode"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Precompiled .hbc ships inside the app binary",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "On the device, the Hermes VM loads that bytecode directly. There's no parsing or compiling step at startup \u2014 it just executes.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "compiler",
          "label": "Hermes Compiler\n(build time)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "bytecode",
          "label": "Bytecode Bundle\n(.hbc)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "vm",
          "label": "Hermes VM\n(on device)",
          "x": 620,
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
          "from": "src",
          "to": "compiler",
          "animated": true,
          "color": "#818CF8",
          "label": "compile"
        },
        {
          "id": "e2",
          "from": "compiler",
          "to": "bytecode",
          "animated": true,
          "color": "#818CF8",
          "label": "emit"
        },
        {
          "id": "e3",
          "from": "bytecode",
          "to": "vm",
          "animated": true,
          "color": "#6EE7B7",
          "label": "load & run"
        }
      ],
      "highlighted": [
        "vm"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "VM executes bytecode straight away \u2014 no parse step",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "Because the heavy parse-and-compile work already happened at build time, the app reaches your first screen much faster. That's the headline win: faster startup.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "compiler",
          "label": "Hermes Compiler\n(build time)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "bytecode",
          "label": "Bytecode Bundle\n(.hbc)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "vm",
          "label": "Hermes VM\n(on device)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "startup",
          "label": "Faster Startup\n(no on-device parse)",
          "x": 620,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "src",
          "to": "compiler",
          "animated": true,
          "color": "#818CF8",
          "label": "compile"
        },
        {
          "id": "e2",
          "from": "compiler",
          "to": "bytecode",
          "animated": true,
          "color": "#818CF8",
          "label": "emit"
        },
        {
          "id": "e3",
          "from": "bytecode",
          "to": "vm",
          "animated": true,
          "color": "#6EE7B7",
          "label": "load & run"
        },
        {
          "id": "e4",
          "from": "vm",
          "to": "startup",
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "startup",
        "vm"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Time-to-interactive drops sharply at launch",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "Hermes is also tuned for tight memory: a smaller heap and a garbage collector designed for mobile. That keeps RAM use low on constrained devices.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "compiler",
          "label": "Hermes Compiler\n(build time)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "bytecode",
          "label": "Bytecode Bundle\n(.hbc)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "vm",
          "label": "Hermes VM\n(on device)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "startup",
          "label": "Faster Startup\n(no on-device parse)",
          "x": 620,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        },
        {
          "id": "memory",
          "label": "Lower Memory\n(smaller heap)",
          "x": 440,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "src",
          "to": "compiler",
          "animated": true,
          "color": "#818CF8",
          "label": "compile"
        },
        {
          "id": "e2",
          "from": "compiler",
          "to": "bytecode",
          "animated": true,
          "color": "#818CF8",
          "label": "emit"
        },
        {
          "id": "e3",
          "from": "bytecode",
          "to": "vm",
          "animated": true,
          "color": "#6EE7B7",
          "label": "load & run"
        },
        {
          "id": "e4",
          "from": "vm",
          "to": "startup",
          "color": "#6EE7B7"
        },
        {
          "id": "e5",
          "from": "vm",
          "to": "memory",
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "memory"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Mobile-tuned GC keeps the heap small",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "Compare this to the old JavaScriptCore path. There the device shipped raw JS and had to parse and compile it at runtime, often JIT-compiling hot code while the app ran.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "compiler",
          "label": "Hermes Compiler\n(build time)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "bytecode",
          "label": "Bytecode Bundle\n(.hbc)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "vm",
          "label": "Hermes VM\n(on device)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "startup",
          "label": "Faster Startup\n(no on-device parse)",
          "x": 620,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        },
        {
          "id": "memory",
          "label": "Lower Memory\n(smaller heap)",
          "x": 440,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        },
        {
          "id": "jsc",
          "label": "JSC: parse + JIT\nat runtime",
          "x": 60,
          "y": 355,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "src",
          "to": "compiler",
          "animated": true,
          "color": "#818CF8",
          "label": "compile"
        },
        {
          "id": "e2",
          "from": "compiler",
          "to": "bytecode",
          "animated": true,
          "color": "#818CF8",
          "label": "emit"
        },
        {
          "id": "e3",
          "from": "bytecode",
          "to": "vm",
          "animated": true,
          "color": "#6EE7B7",
          "label": "load & run"
        },
        {
          "id": "e4",
          "from": "vm",
          "to": "startup",
          "color": "#6EE7B7"
        },
        {
          "id": "e5",
          "from": "vm",
          "to": "memory",
          "color": "#6EE7B7"
        },
        {
          "id": "e6",
          "from": "src",
          "to": "jsc",
          "dashed": true,
          "color": "#FCD34D",
          "label": "ship raw JS"
        }
      ],
      "highlighted": [
        "jsc"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Legacy JSC: all parse/compile cost paid on device",
          "x": 400,
          "y": 460,
          "color": "#D97706"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "Hermes connects to the rest of the New Architecture through JSI, the C++ interface that lets the engine call TurboModules and Fabric directly \u2014 no serialized Bridge in between.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "compiler",
          "label": "Hermes Compiler\n(build time)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "bytecode",
          "label": "Bytecode Bundle\n(.hbc)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "vm",
          "label": "Hermes VM\n(on device)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "startup",
          "label": "Faster Startup\n(no on-device parse)",
          "x": 620,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        },
        {
          "id": "memory",
          "label": "Lower Memory\n(smaller heap)",
          "x": 440,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        },
        {
          "id": "jsc",
          "label": "JSC: parse + JIT\nat runtime",
          "x": 60,
          "y": 355,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        },
        {
          "id": "jsi",
          "label": "JSI -> TurboModules / Fabric",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#3B82F6",
          "width": 170,
          "height": 44
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "src",
          "to": "compiler",
          "animated": true,
          "color": "#818CF8",
          "label": "compile"
        },
        {
          "id": "e2",
          "from": "compiler",
          "to": "bytecode",
          "animated": true,
          "color": "#818CF8",
          "label": "emit"
        },
        {
          "id": "e3",
          "from": "bytecode",
          "to": "vm",
          "animated": true,
          "color": "#6EE7B7",
          "label": "load & run"
        },
        {
          "id": "e4",
          "from": "vm",
          "to": "startup",
          "color": "#6EE7B7"
        },
        {
          "id": "e5",
          "from": "vm",
          "to": "memory",
          "color": "#6EE7B7"
        },
        {
          "id": "e6",
          "from": "src",
          "to": "jsc",
          "dashed": true,
          "color": "#FCD34D",
          "label": "ship raw JS"
        },
        {
          "id": "e7",
          "from": "vm",
          "to": "jsi",
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "jsi",
        "vm"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "JSI: direct C++ calls, no serialized Bridge",
          "x": 400,
          "y": 460,
          "color": "#3B82F6"
        }
      ]
    }
  },
  {
    "step": 10,
    "narration": "So Hermes shifts work from runtime to build time: compile once on your machine, ship bytecode, and the device just runs it \u2014 giving faster startup, lower memory, and a clean JSI path into native.",
    "diagram_state": {
      "nodes": [
        {
          "id": "src",
          "label": "JS Source\n(.js / .ts)",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "compiler",
          "label": "Hermes Compiler\n(build time)",
          "x": 250,
          "y": 165,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 64
        },
        {
          "id": "bytecode",
          "label": "Bytecode Bundle\n(.hbc)",
          "x": 440,
          "y": 165,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 64
        },
        {
          "id": "vm",
          "label": "Hermes VM\n(on device)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "startup",
          "label": "Faster Startup\n(no on-device parse)",
          "x": 620,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        },
        {
          "id": "memory",
          "label": "Lower Memory\n(smaller heap)",
          "x": 440,
          "y": 355,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 44
        },
        {
          "id": "jsc",
          "label": "JSC: parse + JIT\nat runtime",
          "x": 60,
          "y": 355,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 64
        },
        {
          "id": "jsi",
          "label": "JSI -> TurboModules / Fabric",
          "x": 620,
          "y": 70,
          "style": "pill",
          "color": "#3B82F6",
          "width": 170,
          "height": 44
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "src",
          "to": "compiler",
          "animated": true,
          "color": "#818CF8",
          "label": "compile"
        },
        {
          "id": "e2",
          "from": "compiler",
          "to": "bytecode",
          "animated": true,
          "color": "#818CF8",
          "label": "emit"
        },
        {
          "id": "e3",
          "from": "bytecode",
          "to": "vm",
          "animated": true,
          "color": "#6EE7B7",
          "label": "load & run"
        },
        {
          "id": "e4",
          "from": "vm",
          "to": "startup",
          "color": "#6EE7B7"
        },
        {
          "id": "e5",
          "from": "vm",
          "to": "memory",
          "color": "#6EE7B7"
        },
        {
          "id": "e6",
          "from": "src",
          "to": "jsc",
          "dashed": true,
          "color": "#FCD34D",
          "label": "ship raw JS"
        },
        {
          "id": "e7",
          "from": "vm",
          "to": "jsi",
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "src",
        "compiler",
        "bytecode",
        "vm"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Build-time AOT bytecode = the Hermes advantage",
          "x": 400,
          "y": 460,
          "color": "#4F46E5"
        }
      ]
    }
  }
]
