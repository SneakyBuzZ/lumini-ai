const COLORS = [
  "#EF4444", // red
  "#22C55E", // green
  "#FACC15", // yellow
  "#A855F7", // purple
  "#14B8A6", // teal
  "#F97316", // orange
  "#10B981", // emerald
  "#E11D48", // rose
  "#6366F1", // indigo
  "#06B6D4", // cyan
  "#34D399", // mint
  "#F59E0B", // amber
  "#EF7C8E", // pink
];

export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}
