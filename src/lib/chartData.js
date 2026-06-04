import { PAYMENT_STATUS_LABELS } from "./gestionHelpers";

export const CHART_COLORS = {
  primary: "#e60000",
  primarySoft: "#ff4d4d",
  dark: "#1a1a1a",
  success: "#16a34a",
  warning: "#ca8a04",
  muted: "#94a3b8",
  palette: ["#e60000", "#1a1a1a", "#ff6b6b", "#16a34a", "#ca8a04", "#6366f1"],
};

export function playersByTeamChart(players) {
  const counts = {};
  for (const p of players) {
    if (!p.activo) continue;
    const label = p.team_nombre
      ? `${p.team_nombre}`
      : "Sin equipo";
    counts[label] = (counts[label] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function paymentStatusChart(payments) {
  const counts = { pagado: 0, pendiente: 0, devuelto: 0 };
  for (const p of payments) {
    if (counts[p.estado] !== undefined) counts[p.estado]++;
  }
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: PAYMENT_STATUS_LABELS[key] ?? key,
      value,
      key,
    }));
}

export function paymentsByMonthChart(payments) {
  const totals = {};
  for (const p of payments) {
    if (p.estado !== "pagado") continue;
    const month = p.fecha_pago?.slice(0, 7);
    if (!month) continue;
    totals[month] = (totals[month] || 0) + Number(p.importe);
  }
  return Object.entries(totals)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, total]) => ({
      name: formatMonthLabel(month),
      total: Math.round(total * 100) / 100,
      month,
    }));
}

export function paymentsByMethodChart(payments) {
  const totals = {};
  for (const p of payments) {
    if (p.estado !== "pagado") continue;
    const m = p.metodo || "otros";
    totals[m] = (totals[m] || 0) + Number(p.importe);
  }
  return Object.entries(totals)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value * 100) / 100,
    }))
    .sort((a, b) => b.value - a.value);
}

function formatMonthLabel(ym) {
  const [y, m] = ym.split("-");
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${months[Number(m) - 1]} ${y?.slice(2)}`;
}

export function recentPayments(payments, limit = 6) {
  return [...payments]
    .sort((a, b) => b.fecha_pago.localeCompare(a.fecha_pago))
    .slice(0, limit);
}
