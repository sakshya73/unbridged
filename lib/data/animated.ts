import { Step } from "../types"

export const animatedSteps: Step[] = [
  {
    "step": 1,
    "narration": "Every Animated value you create is driven by something. By default, that driver lives on the JavaScript thread, right alongside your React code.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
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
        "js"
      ],
      "annotations": []
    }
  },
  {
    "step": 2,
    "narration": "The actual pixels live on the UI thread. Under the New Architecture this is where Fabric renders your views and where the screen refreshes 60 times a second.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [],
      "highlighted": [
        "ui"
      ],
      "annotations": []
    }
  },
  {
    "step": 3,
    "narration": "Here's our animation: an Animated.timing driving opacity from 0 to 1. The question is which thread actually computes each frame.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "anim",
          "label": "Animated.timing (opacity)",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        }
      ],
      "edges": [],
      "highlighted": [
        "anim"
      ],
      "annotations": []
    }
  },
  {
    "step": 4,
    "narration": "Without the native driver, JS computes every single frame's value, then sends each one across to the UI thread to apply. That's a message per frame, roughly 60 times a second.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "anim",
          "label": "Animated.timing (opacity)",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
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
          "id": "e_js_ui",
          "from": "js",
          "to": "ui",
          "label": "value per frame",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "js"
      ],
      "annotations": [
        {
          "id": "a_jsdriver",
          "text": "JS-driven: one update per frame, every frame",
          "x": 400,
          "y": 455,
          "color": "#4F46E5"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "The catch: if the JS thread gets busy \u2014 a heavy re-render, a fetch callback, parsing JSON \u2014 it can't produce those frames on time. The animation visibly stutters and drops frames.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "anim",
          "label": "Animated.timing (opacity)",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "busy",
          "label": "JS busy: heavy work",
          "x": 60,
          "y": 260,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
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
          "id": "e_js_ui",
          "from": "js",
          "to": "ui",
          "label": "blocked / dropped frames",
          "animated": true,
          "dashed": true,
          "color": "#DC2626"
        }
      ],
      "highlighted": [
        "busy",
        "js"
      ],
      "annotations": [
        {
          "id": "a_stutter",
          "text": "Blocked JS thread = stuttering animation",
          "x": 400,
          "y": 455,
          "color": "#DC2626"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "Now flip on useNativeDriver: true. Instead of streaming frames, JS serializes the whole animation \u2014 the value, easing curve, and duration \u2014 and ships that description across exactly once.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "anim",
          "label": "Animated.timing (opacity)",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "busy",
          "label": "JS busy: heavy work",
          "x": 60,
          "y": 260,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialize config (once)",
          "x": 250,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
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
          "id": "e_js_ui",
          "from": "js",
          "to": "ui",
          "label": "blocked / dropped frames",
          "animated": true,
          "dashed": true,
          "color": "#DC2626"
        },
        {
          "id": "e_serialize",
          "from": "anim",
          "to": "serialize",
          "label": "describe animation",
          "animated": true,
          "color": "#F59E0B"
        }
      ],
      "highlighted": [
        "serialize"
      ],
      "annotations": [
        {
          "id": "a_serialize",
          "text": "Native driver: send the recipe once, not frames",
          "x": 400,
          "y": 455,
          "color": "#F59E0B"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "The UI thread takes that recipe and drives the animation entirely on its own, computing each frame natively. No round-trips to JS while it runs.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "anim",
          "label": "Animated.timing (opacity)",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "busy",
          "label": "JS busy: heavy work",
          "x": 60,
          "y": 260,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialize config (once)",
          "x": 250,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "native_loop",
          "label": "Native frame loop",
          "x": 620,
          "y": 260,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e_js_ui",
          "from": "js",
          "to": "ui",
          "label": "blocked / dropped frames",
          "animated": true,
          "dashed": true,
          "color": "#DC2626"
        },
        {
          "id": "e_serialize",
          "from": "anim",
          "to": "serialize",
          "label": "describe animation",
          "animated": true,
          "color": "#F59E0B"
        },
        {
          "id": "e_to_ui",
          "from": "serialize",
          "to": "ui",
          "label": "config handed off once",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "ui",
        "native_loop"
      ],
      "annotations": [
        {
          "id": "a_nativeloop",
          "text": "UI thread computes every frame itself",
          "x": 400,
          "y": 455,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "So even while JS is jammed with heavy work, the animation keeps running at a smooth 60fps \u2014 because the busy thread isn't in the frame loop anymore.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "anim",
          "label": "Animated.timing (opacity)",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "busy",
          "label": "JS busy: heavy work",
          "x": 60,
          "y": 260,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialize config (once)",
          "x": 250,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "native_loop",
          "label": "Native frame loop",
          "x": 620,
          "y": 260,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        },
        {
          "id": "smooth",
          "label": "Smooth 60fps",
          "x": 620,
          "y": 355,
          "style": "pill",
          "color": "#6EE7B7",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e_js_ui",
          "from": "js",
          "to": "ui",
          "label": "blocked / dropped frames",
          "animated": true,
          "dashed": true,
          "color": "#DC2626"
        },
        {
          "id": "e_serialize",
          "from": "anim",
          "to": "serialize",
          "label": "describe animation",
          "animated": true,
          "color": "#F59E0B"
        },
        {
          "id": "e_to_ui",
          "from": "serialize",
          "to": "ui",
          "label": "config handed off once",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e_loop_smooth",
          "from": "native_loop",
          "to": "smooth",
          "label": "uninterrupted",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "smooth",
        "busy"
      ],
      "annotations": [
        {
          "id": "a_smooth",
          "text": "Busy JS no longer stalls the animation",
          "x": 400,
          "y": 455,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "The trade-off: the native driver can only touch non-layout props it can mutate directly off the JS thread \u2014 transform and opacity. It runs through Fabric's native animated node graph.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "anim",
          "label": "Animated.timing (opacity)",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "busy",
          "label": "JS busy: heavy work",
          "x": 60,
          "y": 260,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialize config (once)",
          "x": 250,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "native_loop",
          "label": "Native frame loop",
          "x": 620,
          "y": 260,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        },
        {
          "id": "smooth",
          "label": "Smooth 60fps",
          "x": 620,
          "y": 355,
          "style": "pill",
          "color": "#6EE7B7",
          "width": 170,
          "height": 40
        },
        {
          "id": "supported",
          "label": "OK: transform, opacity",
          "x": 440,
          "y": 165,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e_js_ui",
          "from": "js",
          "to": "ui",
          "label": "blocked / dropped frames",
          "animated": true,
          "dashed": true,
          "color": "#DC2626"
        },
        {
          "id": "e_serialize",
          "from": "anim",
          "to": "serialize",
          "label": "describe animation",
          "animated": true,
          "color": "#F59E0B"
        },
        {
          "id": "e_to_ui",
          "from": "serialize",
          "to": "ui",
          "label": "config handed off once",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e_loop_smooth",
          "from": "native_loop",
          "to": "smooth",
          "label": "uninterrupted",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e_supported",
          "from": "supported",
          "to": "ui",
          "label": "",
          "animated": false,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "supported"
      ],
      "annotations": [
        {
          "id": "a_supported",
          "text": "Native driver supports transform + opacity",
          "x": 400,
          "y": 455,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 10,
    "narration": "Animating layout props like width, height, or margin can't use the native driver \u2014 those need the layout system, so they fall back to the JS thread. Reach for transform and opacity whenever you can.",
    "diagram_state": {
      "nodes": [
        {
          "id": "js",
          "label": "JS Thread",
          "x": 60,
          "y": 165,
          "style": "box",
          "color": "#4F46E5",
          "width": 170,
          "height": 64
        },
        {
          "id": "anim",
          "label": "Animated.timing (opacity)",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#8B5CF6",
          "width": 170,
          "height": 40
        },
        {
          "id": "busy",
          "label": "JS busy: heavy work",
          "x": 60,
          "y": 260,
          "style": "pill",
          "color": "#DC2626",
          "width": 170,
          "height": 40
        },
        {
          "id": "serialize",
          "label": "Serialize config (once)",
          "x": 250,
          "y": 70,
          "style": "pill",
          "color": "#F59E0B",
          "width": 170,
          "height": 40
        },
        {
          "id": "ui",
          "label": "UI Thread (Fabric)",
          "x": 620,
          "y": 165,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 64
        },
        {
          "id": "native_loop",
          "label": "Native frame loop",
          "x": 620,
          "y": 260,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        },
        {
          "id": "smooth",
          "label": "Smooth 60fps",
          "x": 620,
          "y": 355,
          "style": "pill",
          "color": "#6EE7B7",
          "width": 170,
          "height": 40
        },
        {
          "id": "supported",
          "label": "OK: transform, opacity",
          "x": 440,
          "y": 165,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        },
        {
          "id": "unsupported",
          "label": "No: width, height, margin",
          "x": 440,
          "y": 260,
          "style": "pill",
          "color": "#D97706",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e_js_ui",
          "from": "js",
          "to": "ui",
          "label": "blocked / dropped frames",
          "animated": true,
          "dashed": true,
          "color": "#DC2626"
        },
        {
          "id": "e_serialize",
          "from": "anim",
          "to": "serialize",
          "label": "describe animation",
          "animated": true,
          "color": "#F59E0B"
        },
        {
          "id": "e_to_ui",
          "from": "serialize",
          "to": "ui",
          "label": "config handed off once",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e_loop_smooth",
          "from": "native_loop",
          "to": "smooth",
          "label": "uninterrupted",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e_supported",
          "from": "supported",
          "to": "ui",
          "label": "",
          "animated": false,
          "color": "#6EE7B7"
        },
        {
          "id": "e_unsupported",
          "from": "unsupported",
          "to": "js",
          "label": "layout: JS only",
          "animated": true,
          "dashed": true,
          "color": "#D97706"
        }
      ],
      "highlighted": [
        "unsupported"
      ],
      "annotations": [
        {
          "id": "a_unsupported",
          "text": "Layout props can't use the native driver",
          "x": 400,
          "y": 455,
          "color": "#D97706"
        }
      ]
    }
  }
]
