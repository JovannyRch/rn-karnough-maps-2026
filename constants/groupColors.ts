// Single source of truth for group colors. The order MUST match the order
// KMaps assigns groups (groupIndex i -> GROUP_COLORS[i % length]) so the
// K-map overlays, result legend, circuit terms, and PDFs stay in sync.
export const GROUP_COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "#ff6699",
  "lightblue",
  "#CD7F32",
  "#50C878",
] as const;

export const getGroupColor = (index: number): string =>
  GROUP_COLORS[((index % GROUP_COLORS.length) + GROUP_COLORS.length) %
    GROUP_COLORS.length];
