export default function GestionPageHeader({ title, description, action }) {
  return (
    <header className="gestion-page__header">
      <div>
        <p className="gestion-page__kicker">CV Berja · Gestión</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="gestion-page__actions">{action}</div>}
    </header>
  );
}
