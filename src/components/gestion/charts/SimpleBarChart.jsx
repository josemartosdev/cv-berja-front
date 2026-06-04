import { CHART_COLORS } from "../../../lib/chartData";

export default function SimpleBarChart({
  data,
  valueKey = "value",
  labelKey = "name",
  color = CHART_COLORS.primary,
  height = 260,
}) {
  if (!data?.length) return null;

  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1);

  return (
    <div className="gestion-svg-chart" style={{ height }}>
      <div className="gestion-svg-chart__bars">
        {data.map((item, i) => {
          const pct = ((Number(item[valueKey]) || 0) / max) * 100;
          return (
            <div key={`${item[labelKey]}-${i}`} className="gestion-svg-chart__bar-col">
              <div className="gestion-svg-chart__bar-track">
                <div
                  className="gestion-svg-chart__bar-fill"
                  style={{ height: `${pct}%`, background: color }}
                  title={`${item[labelKey]}: ${item[valueKey]}`}
                />
              </div>
              <span className="gestion-svg-chart__bar-label">{item[labelKey]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
