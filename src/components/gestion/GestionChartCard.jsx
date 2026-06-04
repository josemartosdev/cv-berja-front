export default function GestionChartCard({ title, subtitle, children, className = "" }) {
  return (
    <article className={`gestion-chart-card ${className}`.trim()}>
      <header className="gestion-chart-card__head">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </header>
      <div className="gestion-chart-card__body">{children}</div>
    </article>
  );
}
