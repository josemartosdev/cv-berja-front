export default function GestionAlert({ type = "error", children }) {
  if (!children) return null;
  return <p className={`gestion-alert gestion-alert--${type}`}>{children}</p>;
}
