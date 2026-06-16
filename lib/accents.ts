// Per-concept accent colors. Shared by the home grid and the per-concept
// intro card so a concept's color is defined in exactly one place.
export const ACCENT: Record<string, string> = {
  bridge: "#D97706",
  threads: "#7C3AED",
  jsi: "#8B5CF6",
  lifecycle: "#059669",
  usestate: "#4F46E5",
  useeffect: "#3B82F6",
  flatlist: "#0891B2",
  hermes: "#DC2626",
  metro: "#F59E0B",
  navigation: "#0D9488",
  animated: "#DB2777",
}

export const accentFor = (id: string) => ACCENT[id] ?? "#149eca"
