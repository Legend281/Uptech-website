/** Tiny inline trend line for a StatCard — hand-rolled SVG, no charting dependency for one shape this simple. */
export function Sparkline({ points, colorClassName = "text-teal-500" }: { points: number[]; colorClassName?: string }) {
  if (points.length < 2) return null;

  const width = 100;
  const height = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const areaPath = `M0,${height} L${coords.join(" L")} L${width},${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`h-7 w-full ${colorClassName}`} preserveAspectRatio="none">
      <path d={areaPath} fill="currentColor" opacity={0.08} />
      <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
