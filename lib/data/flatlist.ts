import { Step } from "../types"

export const flatlistSteps: Step[] = [
  {
    "step": 1,
    "narration": "Imagine a list of hundreds of rows. The naive approach mounts every single one as a native view, which torches your memory and startup time.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        }
      ],
      "edges": [],
      "highlighted": [
        "item1",
        "item2",
        "item3",
        "item4",
        "item5",
        "item6"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "A long data list: 100s of rows",
          "x": 400,
          "y": 460,
          "color": "#374151"
        }
      ]
    }
  },
  {
    "step": 2,
    "narration": "FlatList's trick is virtualization: only the rows near the visible viewport actually exist as mounted components. Picture the phone screen as a window sliding over the data.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        }
      ],
      "edges": [],
      "highlighted": [
        "viewport"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Viewport = what the user actually sees",
          "x": 400,
          "y": 460,
          "color": "#3B82F6"
        }
      ]
    }
  },
  {
    "step": 3,
    "narration": "Rows inside that viewport window get fully rendered. Here items 3 and 4 are on screen, so they're live native views.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3 (visible)",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4 (visible)",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "viewport",
          "to": "item3",
          "label": "renders",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e2",
          "from": "viewport",
          "to": "item4",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "item3",
        "item4"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Visible rows = mounted, green = live views",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 4,
    "narration": "FlatList also keeps a buffer of rows just outside the screen so scrolling feels seamless. That buffer is controlled by windowSize, measured in viewport-heights above and below.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2 (buffer)",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3 (visible)",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4 (visible)",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5 (buffer)",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#374151",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "viewport",
          "to": "item3",
          "label": "renders",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e2",
          "from": "viewport",
          "to": "item4",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "item2",
        "item5"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "windowSize=21 default: ~10 screens each side",
          "x": 400,
          "y": 460,
          "color": "#F59E0B"
        }
      ]
    }
  },
  {
    "step": 5,
    "narration": "Anything beyond that window gets unmounted and recycled \u2014 its native views are torn down, leaving only a blank spacer to preserve scroll height. Item 1 and Item 6 are gray ghosts here.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1 (unmounted)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2 (buffer)",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3 (visible)",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4 (visible)",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5 (buffer)",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6 (unmounted)",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "viewport",
          "to": "item3",
          "label": "renders",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e2",
          "from": "viewport",
          "to": "item4",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "item1",
        "item6"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Offscreen rows replaced by blank spacers",
          "x": 400,
          "y": 460,
          "color": "#9CA3AF"
        }
      ]
    }
  },
  {
    "step": 6,
    "narration": "On first mount, FlatList doesn't render the whole window at once \u2014 initialNumToRender sets how many rows appear in that very first synchronous pass, keeping time-to-interactive fast.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1 (unmounted)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2 (buffer)",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3 (visible)",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4 (visible)",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5 (buffer)",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6 (unmounted)",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        },
        {
          "id": "initial",
          "label": "initialNumToRender = 10",
          "x": 60,
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
          "from": "viewport",
          "to": "item3",
          "label": "renders",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e2",
          "from": "viewport",
          "to": "item4",
          "animated": true,
          "color": "#6EE7B7"
        }
      ],
      "highlighted": [
        "initial"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "First paint shows only N rows, then fills in",
          "x": 400,
          "y": 460,
          "color": "#4F46E5"
        }
      ]
    }
  },
  {
    "step": 7,
    "narration": "As the user scrolls down, the window slides with them. New rows entering the buffer mount on the fly, so Item 5 promotes from buffer to a freshly rendered visible row.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1 (unmounted)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2 (buffer)",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3 (visible)",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4 (visible)",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5 (mounting)",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6 (unmounted)",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        },
        {
          "id": "initial",
          "label": "initialNumToRender = 10",
          "x": 60,
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
          "from": "viewport",
          "to": "item3",
          "label": "renders",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e2",
          "from": "viewport",
          "to": "item4",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e3",
          "from": "viewport",
          "to": "item5",
          "label": "scroll in",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "item5"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Scrolling mounts new rows, unmounts old ones",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  },
  {
    "step": 8,
    "narration": "The catch: to position rows it can't see, FlatList must asynchronously measure each one as it mounts, which can cause blank flashes during fast scrolls.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1 (unmounted)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2 (buffer)",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3 (visible)",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4 (visible)",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5 (mounting)",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6 (unmounted)",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        },
        {
          "id": "initial",
          "label": "initialNumToRender = 10",
          "x": 60,
          "y": 355,
          "style": "pill",
          "color": "#4F46E5",
          "width": 170,
          "height": 40
        },
        {
          "id": "measure",
          "label": "Async onLayout measure",
          "x": 620,
          "y": 250,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 50
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "viewport",
          "to": "item3",
          "label": "renders",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e2",
          "from": "viewport",
          "to": "item4",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e3",
          "from": "viewport",
          "to": "item5",
          "label": "scroll in",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "item5",
          "to": "measure",
          "label": "measures",
          "dashed": true,
          "color": "#FCD34D"
        }
      ],
      "highlighted": [
        "measure"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Measuring on mount = layout cost + blank gaps",
          "x": 400,
          "y": 460,
          "color": "#D97706"
        }
      ]
    }
  },
  {
    "step": 9,
    "narration": "If your rows are a fixed height, give FlatList getItemLayout. It computes each row's offset arithmetically, skipping measurement entirely and enabling instant scroll-to-index.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1 (unmounted)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2 (buffer)",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3 (visible)",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4 (visible)",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5 (mounting)",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6 (unmounted)",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        },
        {
          "id": "initial",
          "label": "initialNumToRender = 10",
          "x": 60,
          "y": 355,
          "style": "pill",
          "color": "#4F46E5",
          "width": 170,
          "height": 40
        },
        {
          "id": "measure",
          "label": "Async onLayout measure",
          "x": 620,
          "y": 250,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 50
        },
        {
          "id": "getlayout",
          "label": "getItemLayout (precomputed)",
          "x": 620,
          "y": 130,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 50
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "viewport",
          "to": "item3",
          "label": "renders",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e2",
          "from": "viewport",
          "to": "item4",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e3",
          "from": "viewport",
          "to": "item5",
          "label": "scroll in",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "item5",
          "to": "measure",
          "label": "measures",
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e5",
          "from": "getlayout",
          "to": "item5",
          "label": "offset = index * h",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "getlayout"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "getItemLayout: offset=index*height, no measure",
          "x": 400,
          "y": 460,
          "color": "#8B5CF6"
        }
      ]
    }
  },
  {
    "step": 10,
    "narration": "So virtualization keeps memory flat by mounting only viewport plus buffer, and getItemLayout removes the measurement cost \u2014 together that's how a thousand-row list scrolls at 60fps under the Fabric renderer.",
    "diagram_state": {
      "nodes": [
        {
          "id": "item1",
          "label": "Item 1 (unmounted)",
          "x": 440,
          "y": 70,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "item2",
          "label": "Item 2 (buffer)",
          "x": 440,
          "y": 130,
          "style": "box",
          "color": "#F59E0B",
          "width": 170,
          "height": 50
        },
        {
          "id": "item3",
          "label": "Item 3 (visible)",
          "x": 440,
          "y": 190,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item4",
          "label": "Item 4 (visible)",
          "x": 440,
          "y": 250,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item5",
          "label": "Item 5 (mounting)",
          "x": 440,
          "y": 310,
          "style": "box",
          "color": "#059669",
          "width": 170,
          "height": 50
        },
        {
          "id": "item6",
          "label": "Item 6 (unmounted)",
          "x": 440,
          "y": 370,
          "style": "box",
          "color": "#9CA3AF",
          "width": 170,
          "height": 50
        },
        {
          "id": "viewport",
          "label": "Viewport (visible screen)",
          "x": 60,
          "y": 190,
          "style": "box",
          "color": "#3B82F6",
          "width": 170,
          "height": 120
        },
        {
          "id": "initial",
          "label": "initialNumToRender = 10",
          "x": 60,
          "y": 355,
          "style": "pill",
          "color": "#4F46E5",
          "width": 170,
          "height": 40
        },
        {
          "id": "measure",
          "label": "Async onLayout measure",
          "x": 620,
          "y": 250,
          "style": "box",
          "color": "#D97706",
          "width": 170,
          "height": 50
        },
        {
          "id": "getlayout",
          "label": "getItemLayout (precomputed)",
          "x": 620,
          "y": 130,
          "style": "box",
          "color": "#8B5CF6",
          "width": 170,
          "height": 50
        },
        {
          "id": "fabric",
          "label": "Fabric renders 60fps",
          "x": 60,
          "y": 70,
          "style": "pill",
          "color": "#059669",
          "width": 170,
          "height": 40
        }
      ],
      "edges": [
        {
          "id": "e1",
          "from": "viewport",
          "to": "item3",
          "label": "renders",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e2",
          "from": "viewport",
          "to": "item4",
          "animated": true,
          "color": "#6EE7B7"
        },
        {
          "id": "e3",
          "from": "viewport",
          "to": "item5",
          "label": "scroll in",
          "animated": true,
          "color": "#818CF8"
        },
        {
          "id": "e4",
          "from": "item5",
          "to": "measure",
          "label": "measures",
          "dashed": true,
          "color": "#FCD34D"
        },
        {
          "id": "e5",
          "from": "getlayout",
          "to": "item5",
          "label": "offset = index * h",
          "animated": true,
          "color": "#818CF8"
        }
      ],
      "highlighted": [
        "fabric",
        "viewport",
        "getlayout"
      ],
      "annotations": [
        {
          "id": "a1",
          "text": "Flat memory + no measure = smooth scrolling",
          "x": 400,
          "y": 460,
          "color": "#059669"
        }
      ]
    }
  }
]
