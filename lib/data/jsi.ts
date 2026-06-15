import { Step } from "../types"

export const jsiSteps: Step[] = [
  {
    "step": 1,
    "narration": "Like before, React Native runs two worlds. The JS thread on the left runs all your React code under the Hermes engine.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        }
      ],
      "edges": [],
      "highlighted": [
        "js"
      ],
      "annotations": []
    }
  },
  {
    "step": 2,
    "narration": "And the Native thread on the right owns the real UI and platform APIs \u2014 the camera, storage, actual views.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        },
        {
          "id": "native",
          "label": "Native Thread",
          "x": 560,
          "y": 200,
          "style": "box",
          "color": "#059669",
          "width": 180,
          "height": 70
        }
      ],
      "edges": [],
      "highlighted": [
        "native"
      ],
      "annotations": []
    }
  },
  {
    "step": 3,
    "narration": "The old architecture connected them with an asynchronous Bridge. Every call got serialized to JSON, queued, and sent across \u2014 slow and batched.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        },
        {
          "id": "bridge",
          "label": "Old Bridge (async, JSON)",
          "x": 310,
          "y": 215,
          "style": "pill",
          "color": "#D97706",
          "width": 180,
          "height": 40
        },
        {
          "id": "native",
          "label": "Native Thread",
          "x": 560,
          "y": 200,
          "style": "box",
          "color": "#059669",
          "width": 180,
          "height": 70
        }
      ],
      "edges": [
        {
          "id": "e_js_bridge",
          "from": "js",
          "to": "bridge",
          "label": "serialize",
          "animated": true,
          "color": "#FCD34D",
          "dashed": true
        },
        {
          "id": "e_bridge_native",
          "from": "bridge",
          "to": "native",
          "label": "deserialize",
          "animated": true,
          "color": "#FCD34D",
          "dashed": true
        }
      ],
      "highlighted": [
        "bridge"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Old way: async, serialized, one bottleneck",
          "x": 400,
          "y": 460,
          "color": "#D97706"
        }
      ]
    }
  },
  {
    "step": 4,
    "narration": "The New Architecture rips out that bridge and replaces it with JSI \u2014 the JavaScript Interface, a thin C++ layer that both sides share directly.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        },
        {
          "id": "bridge",
          "label": "Old Bridge (async, JSON)",
          "x": 310,
          "y": 215,
          "style": "pill",
          "color": "#9CA3AF",
          "width": 180,
          "height": 40
        },
        {
          "id": "native",
          "label": "Native Thread",
          "x": 560,
          "y": 200,
          "style": "box",
          "color": "#059669",
          "width": 180,
          "height": 70
        },
        {
          "id": "jsi",
          "label": "JSI (C++ interface)",
          "x": 310,
          "y": 130,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 180,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e_js_bridge",
          "from": "js",
          "to": "bridge",
          "label": "serialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_bridge_native",
          "from": "bridge",
          "to": "native",
          "label": "deserialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        }
      ],
      "highlighted": [
        "jsi"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "JSI: shared C++ layer, no message queue",
          "x": 400,
          "y": 460,
          "color": "#8B5CF6"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "Through JSI, the JS engine holds direct references to native objects called HostObjects \u2014 so calling native is a synchronous C++ function call, no JSON in sight.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        },
        {
          "id": "bridge",
          "label": "Old Bridge (async, JSON)",
          "x": 310,
          "y": 215,
          "style": "pill",
          "color": "#9CA3AF",
          "width": 180,
          "height": 40
        },
        {
          "id": "native",
          "label": "Native Thread",
          "x": 560,
          "y": 200,
          "style": "box",
          "color": "#059669",
          "width": 180,
          "height": 70
        },
        {
          "id": "jsi",
          "label": "JSI (C++ interface)",
          "x": 310,
          "y": 130,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 180,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e_js_bridge",
          "from": "js",
          "to": "bridge",
          "label": "serialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_bridge_native",
          "from": "bridge",
          "to": "native",
          "label": "deserialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_jsi_direct",
          "from": "js",
          "to": "native",
          "label": "direct sync call (HostObject)",
          "animated": true,
          "color": "#818CF8",
          "dashed": false
        }
      ],
      "highlighted": [
        "js",
        "native",
        "jsi"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "HostObject = native methods JS calls directly",
          "x": 400,
          "y": 460,
          "color": "#8B5CF6"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "Native modules built on JSI are TurboModules. They expose typed methods to JS and, crucially, load lazily \u2014 only when you first require them.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        },
        {
          "id": "bridge",
          "label": "Old Bridge (async, JSON)",
          "x": 310,
          "y": 215,
          "style": "pill",
          "color": "#9CA3AF",
          "width": 180,
          "height": 40
        },
        {
          "id": "native",
          "label": "Native Thread",
          "x": 560,
          "y": 200,
          "style": "box",
          "color": "#059669",
          "width": 180,
          "height": 70
        },
        {
          "id": "jsi",
          "label": "JSI (C++ interface)",
          "x": 310,
          "y": 130,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 180,
          "height": 40
        },
        {
          "id": "turbo",
          "label": "TurboModules (lazy)",
          "x": 560,
          "y": 95,
          "style": "box",
          "color": "#374151",
          "width": 180,
          "height": 60
        }
      ],
      "edges": [
        {
          "id": "e_js_bridge",
          "from": "js",
          "to": "bridge",
          "label": "serialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_bridge_native",
          "from": "bridge",
          "to": "native",
          "label": "deserialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_jsi_direct",
          "from": "js",
          "to": "native",
          "label": "direct sync call (HostObject)",
          "animated": true,
          "color": "#818CF8",
          "dashed": false
        },
        {
          "id": "e_native_turbo",
          "from": "native",
          "to": "turbo",
          "label": "register",
          "animated": false,
          "color": "#6EE7B7",
          "dashed": false
        }
      ],
      "highlighted": [
        "turbo"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Lazy load = faster startup, lower memory",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "Rendering gets its own JSI-powered system: Fabric. It runs C++ shadow tree work and lets React's concurrent features schedule and prioritize UI updates.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        },
        {
          "id": "bridge",
          "label": "Old Bridge (async, JSON)",
          "x": 310,
          "y": 215,
          "style": "pill",
          "color": "#9CA3AF",
          "width": 180,
          "height": 40
        },
        {
          "id": "native",
          "label": "Native Thread",
          "x": 560,
          "y": 200,
          "style": "box",
          "color": "#059669",
          "width": 180,
          "height": 70
        },
        {
          "id": "jsi",
          "label": "JSI (C++ interface)",
          "x": 310,
          "y": 130,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 180,
          "height": 40
        },
        {
          "id": "turbo",
          "label": "TurboModules (lazy)",
          "x": 560,
          "y": 95,
          "style": "box",
          "color": "#374151",
          "width": 180,
          "height": 60
        },
        {
          "id": "fabric",
          "label": "Fabric Renderer (concurrent)",
          "x": 560,
          "y": 320,
          "style": "box",
          "color": "#3B82F6",
          "width": 180,
          "height": 60
        }
      ],
      "edges": [
        {
          "id": "e_js_bridge",
          "from": "js",
          "to": "bridge",
          "label": "serialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_bridge_native",
          "from": "bridge",
          "to": "native",
          "label": "deserialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_jsi_direct",
          "from": "js",
          "to": "native",
          "label": "direct sync call (HostObject)",
          "animated": true,
          "color": "#818CF8",
          "dashed": false
        },
        {
          "id": "e_native_turbo",
          "from": "native",
          "to": "turbo",
          "label": "register",
          "animated": false,
          "color": "#6EE7B7",
          "dashed": false
        },
        {
          "id": "e_js_fabric",
          "from": "js",
          "to": "fabric",
          "label": "render via JSI",
          "animated": true,
          "color": "#818CF8",
          "dashed": false
        }
      ],
      "highlighted": [
        "fabric"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Fabric: C++ shadow tree, concurrent React",
          "x": 400,
          "y": 460,
          "color": "#3B82F6"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "Because the link is synchronous, native can also call straight back into JS \u2014 like Fabric reading measured layout instantly, with no round-trip queue.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        },
        {
          "id": "bridge",
          "label": "Old Bridge (async, JSON)",
          "x": 310,
          "y": 215,
          "style": "pill",
          "color": "#9CA3AF",
          "width": 180,
          "height": 40
        },
        {
          "id": "native",
          "label": "Native Thread",
          "x": 560,
          "y": 200,
          "style": "box",
          "color": "#059669",
          "width": 180,
          "height": 70
        },
        {
          "id": "jsi",
          "label": "JSI (C++ interface)",
          "x": 310,
          "y": 130,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 180,
          "height": 40
        },
        {
          "id": "turbo",
          "label": "TurboModules (lazy)",
          "x": 560,
          "y": 95,
          "style": "box",
          "color": "#374151",
          "width": 180,
          "height": 60
        },
        {
          "id": "fabric",
          "label": "Fabric Renderer (concurrent)",
          "x": 560,
          "y": 320,
          "style": "box",
          "color": "#3B82F6",
          "width": 180,
          "height": 60
        }
      ],
      "edges": [
        {
          "id": "e_js_bridge",
          "from": "js",
          "to": "bridge",
          "label": "serialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_bridge_native",
          "from": "bridge",
          "to": "native",
          "label": "deserialize",
          "animated": false,
          "color": "#9CA3AF",
          "dashed": true
        },
        {
          "id": "e_jsi_direct",
          "from": "js",
          "to": "native",
          "label": "direct sync call (HostObject)",
          "animated": true,
          "color": "#818CF8",
          "dashed": false
        },
        {
          "id": "e_native_turbo",
          "from": "native",
          "to": "turbo",
          "label": "register",
          "animated": false,
          "color": "#6EE7B7",
          "dashed": false
        },
        {
          "id": "e_js_fabric",
          "from": "js",
          "to": "fabric",
          "label": "render via JSI",
          "animated": true,
          "color": "#818CF8",
          "dashed": false
        },
        {
          "id": "e_native_js",
          "from": "native",
          "to": "js",
          "label": "sync callback",
          "animated": true,
          "color": "#FCD34D",
          "dashed": true
        }
      ],
      "highlighted": [
        "js",
        "native"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Two-way, synchronous \u2014 no batched queue",
          "x": 400,
          "y": 460,
          "color": "#818CF8"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "So the deprecated Bridge fades out entirely, and JSI becomes the single synchronous backbone underneath TurboModules and Fabric.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread (Hermes)",
          "x": 60,
          "y": 200,
          "style": "box",
          "color": "#4F46E5",
          "width": 180,
          "height": 70
        },
        {
          "id": "native",
          "label": "Native Thread",
          "x": 560,
          "y": 200,
          "style": "box",
          "color": "#059669",
          "width": 180,
          "height": 70
        },
        {
          "id": "jsi",
          "label": "JSI (C++ interface)",
          "x": 310,
          "y": 130,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 180,
          "height": 40
        },
        {
          "id": "turbo",
          "label": "TurboModules (lazy)",
          "x": 560,
          "y": 95,
          "style": "box",
          "color": "#374151",
          "width": 180,
          "height": 60
        },
        {
          "id": "fabric",
          "label": "Fabric Renderer (concurrent)",
          "x": 560,
          "y": 320,
          "style": "box",
          "color": "#3B82F6",
          "width": 180,
          "height": 60
        }
      ],
      "edges": [
        {
          "id": "e_jsi_direct",
          "from": "js",
          "to": "native",
          "label": "direct sync call (HostObject)",
          "animated": true,
          "color": "#818CF8",
          "dashed": false
        },
        {
          "id": "e_native_turbo",
          "from": "native",
          "to": "turbo",
          "label": "register",
          "animated": false,
          "color": "#6EE7B7",
          "dashed": false
        },
        {
          "id": "e_js_fabric",
          "from": "js",
          "to": "fabric",
          "label": "render via JSI",
          "animated": true,
          "color": "#818CF8",
          "dashed": false
        },
        {
          "id": "e_native_js",
          "from": "native",
          "to": "js",
          "label": "sync callback",
          "animated": true,
          "color": "#FCD34D",
          "dashed": true
        }
      ],
      "highlighted": [
        "jsi",
        "turbo",
        "fabric"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "New Architecture = the 2026 default",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  }
]
