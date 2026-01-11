
const interactions = {
  primary: "#00FF66", // Neon Green
  primaryDim: "#00CC52",
  accentPurple: "#8B5CF6",
  accentBlue: "#3B82F6",
  backgroundDark: "#030303",
  surfaceDark: "#0A0A0A",
  surfaceCard: "#0F0F0F",
  surfaceBorder: "rgba(255, 255, 255, 0.08)",
  surfaceHighlight: "#141414",
  gridLine: "#222222",
  white: "#FFFFFF",
  gray400: "#9CA3AF", // Tailwind gray-400
  gray500: "#6B7280", // Tailwind gray-500
  gray600: "#4B5563",
};

export const Colors = {
  ...interactions,
  // Aliases for flat usage which seems to be Dark Mode by default
  background: interactions.backgroundDark,
  surface: interactions.surfaceDark,

  // Nested structure for hooks and standard components
  light: {
    ...interactions,
    text: '#11181C',
    background: '#fff',
    tint: interactions.primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: interactions.primary,
  },
  dark: {
    ...interactions,
    text: '#ECEDEE',
    background: interactions.backgroundDark,
    tint: interactions.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: interactions.primary,
  },
};

export const Typography = {
  fontFamily: {
    display: "Inter_400Regular", // Default for display
    displayBold: "Inter_700Bold",
    displayLight: "Inter_300Light",
    displayMedium: "Inter_500Medium",
    mono: "JetBrainsMono_400Regular",
  },
};
