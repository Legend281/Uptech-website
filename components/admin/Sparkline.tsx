/**
 * A stat-tile companion, not a standalone chart — no axes, no tooltip, no
 * legend, because the value it illustrates is already stated (and
 * accessible) as text right above it. Purely decorative, so it's hidden
 * from assistive tech rather than announced as a second, unlabeled number.
 */
export function Sparkline({
  data,
  strokeClassName = "stroke-teal-500",
  fillClassName = "fill-teal-500/10",
}: {
  data: number[];
  strokeClassName?: string;
  fillClassName?: string;
}) {
  const width = 100;
  const height = 28;
  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = i * stepX;
    // 2px top/bottom padding so a peak or trough doesn't clip against the viewBox edge.
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-7 w-full" aria-hidden="true">
      <path d={areaPath} className={fillClassName} stroke="none" />
      <path d={linePath} className={strokeClassName} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
