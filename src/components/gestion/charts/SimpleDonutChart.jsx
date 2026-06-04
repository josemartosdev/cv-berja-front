import { CHART_COLORS } from "../../../lib/chartData";

const DEFAULT_COLORS = [
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.muted,
  CHART_COLORS.primary,
];

export default function SimpleDonutChart({ data, valueKey = "value", colors = DEFAULT_COLORS, size = 200 }) {
  if (!data?.length) return null;

  const total = data.reduce((s, d) => s + (Number(d[valueKey]) || 0), 0) || 1;
  let acc = 0;
  const stops = data.map((item, i) => {
    const pct = ((Number(item[valueKey]) || 0) / total) * 100;
    const start = acc;
    acc += pct;
    return `${colors[i % colors.length]} ${start}% ${acc}%`;
  });

  return (
    <div className="gestion-donut-wrap">
      <div
        className="gestion-donut"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${stops.join(", ")})`,
        }}
      >
        <div className="gestion-donut__hole">
          <strong>{total}</strong>
          <span>total</span>
        </div>
      </div>
    </div>
  );
}
