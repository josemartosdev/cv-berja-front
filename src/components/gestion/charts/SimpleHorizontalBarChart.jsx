import { CHART_COLORS } from "../../../lib/chartData";
import { formatEuro } from "../../../lib/gestionHelpers";

export default function SimpleHorizontalBarChart({
  data,
  valueKey = "value",
  labelKey = "name",
  color = CHART_COLORS.dark,
  formatValue = (v) => v,
}) {
  if (!data?.length) return null;

  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1);

  return (
    <ul className="gestion-h-bar-list">
      {data.map((item, i) => {
        const v = Number(item[valueKey]) || 0;
        const pct = (v / max) * 100;
        return (
          <li key={`${item[labelKey]}-${i}`}>
            <div className="gestion-h-bar-list__head">
              <span>{item[labelKey]}</span>
              <strong>{formatValue(v)}</strong>
            </div>
            <div className="gestion-h-bar-list__track">
              <div className="gestion-h-bar-list__fill" style={{ width: `${pct}%`, background: color }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
