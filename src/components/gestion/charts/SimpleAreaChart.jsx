import { CHART_COLORS } from "../../../lib/chartData";
import { formatEuro } from "../../../lib/gestionHelpers";

export default function SimpleAreaChart({
  data,
  valueKey = "total",
  labelKey = "name",
  color = CHART_COLORS.primary,
  height = 280,
}) {
  if (!data?.length) return null;

  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);
  const w = 100;
  const h = 100;
  const pad = 8;

  const points = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`;

  return (
    <div className="gestion-area-chart" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="gestion-area-chart__svg">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="gestion-area-chart__labels">
        {data.map((d, i) => (
          <span key={i} title={formatEuro(d[valueKey])}>
            {d[labelKey]}
          </span>
        ))}
      </div>
    </div>
  );
}
