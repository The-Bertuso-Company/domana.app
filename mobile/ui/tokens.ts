export const tokens = {
  light: {
    bg: "#FFFFFF",
    surface: "#F7F7FA",
    card: "#FFFFFF",
    border: "#E6E6EB",
    text: "#0B0B0F",
    muted: "#6B6B76",
    primary: "#E53935"
  },
  dark: {
    bg: "#0B0B0F",
    surface: "#111217",
    card: "#151821",
    border: "#2A2D35",
    text: "#F2F3F7",
    muted: "#A3A6AF",
    primary: "#FF4D4D"
  }
} as const;

export function getTheme(scheme: "light" | "dark" | null | undefined) {
  return scheme === "dark" ? tokens.dark : tokens.light;
}
