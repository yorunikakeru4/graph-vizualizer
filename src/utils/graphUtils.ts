export function getDynamicRadius(vertices: number, edges: number): number {
  if (vertices <= 1) return 100;
  return Math.min(250, 100 + 10 * Math.log(vertices + edges));
}


export function getNodePosition(
  idx: number,
  total: number,
  radius?: number,
  centerX = 350,
  centerY = 250
) {
  // sanity-check
  if (typeof idx !== "number" || typeof total !== "number" || total <= 0 || idx < 0 || idx >= total) {
    return { x: centerX, y: centerY };
  }

  // Логарифмический радиус, если не передан явно
  const baseRadius = 120;
  const r =
    typeof radius === "number"
      ? radius
      : baseRadius + 60 * Math.log2(Math.max(2, total)); // log2(2)=1, log2(20)≈4.3

  if (total === 1) return { x: centerX, y: centerY };
  const angle = (2 * Math.PI * idx) / total - Math.PI / 2;
  return {
    x: centerX + r * Math.cos(angle) - 24,
    y: centerY + r * Math.sin(angle) - 24,
  };
}
