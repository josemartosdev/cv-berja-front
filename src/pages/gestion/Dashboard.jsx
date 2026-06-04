import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCircle,
  Wallet,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { gestionApi } from "../../api/gestionApi";
import GestionChartCard from "../../components/gestion/GestionChartCard";
import SimpleBarChart from "../../components/gestion/charts/SimpleBarChart";
import SimpleDonutChart from "../../components/gestion/charts/SimpleDonutChart";
import SimpleAreaChart from "../../components/gestion/charts/SimpleAreaChart";
import { formatEuro, isCoachRole, PAYMENT_STATUS_LABELS } from "../../lib/gestionHelpers";
import {
  CHART_COLORS,
  playersByTeamChart,
  paymentStatusChart,
  paymentsByMonthChart,
  recentPayments,
} from "../../lib/chartData";

const STATUS_COLORS = {
  pagado: CHART_COLORS.success,
  pendiente: CHART_COLORS.warning,
  devuelto: CHART_COLORS.muted,
};

export default function Dashboard() {
  const { user } = useAuth();
  const isCoach = isCoachRole(user?.role);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, p] = await Promise.all([
          gestionApi.teams.list(),
          gestionApi.players.list(),
        ]);
        let pay = [];
        if (!isCoach) {
          pay = await gestionApi.payments.list();
        }
        if (!cancelled) {
          setTeams(t);
          setPlayers(p);
          setPayments(pay);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isCoach]);

  const stats = useMemo(() => {
    const pending = payments.filter((x) => x.estado === "pendiente");
    const paid = payments.filter((x) => x.estado === "pagado");
    const income = paid.reduce((s, x) => s + Number(x.importe), 0);
    const pendingAmount = pending.reduce((s, x) => s + Number(x.importe), 0);
    return {
      teams: teams.filter((t) => t.activo).length,
      players: players.filter((p) => p.activo).length,
      paymentsPending: pending.length,
      income,
      pendingAmount,
    };
  }, [teams, players, payments]);

  const teamChart = useMemo(() => playersByTeamChart(players), [players]);
  const statusChart = useMemo(() => paymentStatusChart(payments), [payments]);
  const monthChart = useMemo(() => paymentsByMonthChart(payments), [payments]);
  const latest = useMemo(() => recentPayments(payments), [payments]);

  const kpis = isCoach
    ? [
        {
          icon: Users,
          label: "Mis equipos",
          value: stats.teams,
          hint: "A tu cargo",
          to: "/gestion/equipos",
          tone: "dark",
        },
        {
          icon: UserCircle,
          label: "Mis jugadores",
          value: stats.players,
          hint: "En tus categorías",
          to: "/gestion/jugadores",
          tone: "red",
        },
      ]
    : [
        {
          icon: Users,
          label: "Equipos activos",
          value: stats.teams,
          hint: "Categorías en juego",
          to: "/gestion/equipos",
          tone: "dark",
        },
        {
          icon: UserCircle,
          label: "Jugadores activos",
          value: stats.players,
          hint: "Fichas al día",
          to: "/gestion/jugadores",
          tone: "red",
        },
        {
          icon: Wallet,
          label: "Ingresos cobrados",
          value: formatEuro(stats.income),
          hint: "Pagos confirmados",
          to: "/gestion/contabilidad",
          tone: "green",
        },
        {
          icon: TrendingUp,
          label: "Pendiente de cobro",
          value: formatEuro(stats.pendingAmount),
          hint: `${stats.paymentsPending} cuotas`,
          to: "/gestion/contabilidad",
          tone: "amber",
        },
      ];

  return (
    <div className="gestion-page gestion-page--dashboard">
      <div className="gestion-dashboard-hero">
        <div>
          <p className="gestion-page__kicker">Panel CV Berja</p>
          <h1>Hola, {user?.nombre ?? "equipo"}</h1>
          <p>
            {isCoach
              ? "Resumen de tus equipos y jugadores. Gestiona tácticas y fichas médicas desde el menú."
              : "Vista general del club: plantilla, equipos y economía en tiempo real."}
          </p>
        </div>
        <div className="gestion-dashboard-hero__actions">
          <Link
            to={isCoach ? "/gestion/mi-perfil" : "/gestion/jugadores"}
            className="gestion-btn gestion-btn--primary"
          >
            {isCoach ? "Mi perfil" : "Nuevo jugador"}
          </Link>
          {!isCoach && (
            <Link to="/gestion/contabilidad" className="gestion-btn gestion-btn--ghost">
              Registrar pago
            </Link>
          )}
        </div>
      </div>

      {error && (
        <p className="gestion-alert gestion-alert--error">
          <AlertCircle size={16} />
          {error}
        </p>
      )}

      <div className="gestion-kpi-grid">
        {kpis.map(({ icon: Icon, label, value, hint, to, tone }) => (
          <Link key={label} to={to} className={`gestion-kpi gestion-kpi--${tone}`}>
            <span className="gestion-kpi__icon">
              <Icon size={22} />
            </span>
            <div>
              <span className="gestion-kpi__label">{label}</span>
              <strong>{loading ? "…" : value}</strong>
              <span className="gestion-kpi__hint">{hint}</span>
            </div>
            <ArrowRight size={18} className="gestion-kpi__arrow" />
          </Link>
        ))}
      </div>

      <div className={`gestion-charts-grid${isCoach ? " gestion-charts-grid--single" : ""}`}>
        <GestionChartCard
          title={isCoach ? "Jugadores por equipo" : "Jugadores por equipo"}
          subtitle={isCoach ? "Tus categorías" : "Plantilla activa"}
          className={isCoach ? "gestion-chart-card--wide" : undefined}
        >
          {teamChart.length === 0 ? (
            <p className="gestion-chart-empty">Sin datos de equipos</p>
          ) : (
            <SimpleBarChart data={teamChart} />
          )}
        </GestionChartCard>

        {!isCoach && (
        <GestionChartCard title="Estado de cuotas" subtitle="Todos los movimientos">
          {statusChart.length === 0 ? (
            <p className="gestion-chart-empty">Aún no hay pagos</p>
          ) : (
            <div className="gestion-donut-layout">
              <SimpleDonutChart
                data={statusChart}
                colors={statusChart.map((s) => STATUS_COLORS[s.key] ?? CHART_COLORS.primary)}
              />
              <div className="gestion-chart-legend gestion-chart-legend--col">
                {statusChart.map((s) => (
                  <span key={s.key}>
                    <i style={{ background: STATUS_COLORS[s.key] }} />
                    {s.name} ({s.value})
                  </span>
                ))}
              </div>
            </div>
          )}
        </GestionChartCard>
        )}

        {!isCoach && (
        <GestionChartCard
          title="Ingresos por mes"
          subtitle="Solo pagos confirmados"
          className="gestion-chart-card--wide"
        >
          {monthChart.length === 0 ? (
            <p className="gestion-chart-empty">Registra pagos para ver la tendencia</p>
          ) : (
            <SimpleAreaChart data={monthChart} />
          )}
        </GestionChartCard>
        )}
      </div>

      {!isCoach && (
      <GestionChartCard title="Últimos movimientos" subtitle="Actividad reciente">
        {latest.length === 0 ? (
          <p className="gestion-chart-empty">No hay pagos registrados</p>
        ) : (
          <ul className="gestion-activity-list">
            {latest.map((pay) => (
              <li key={pay.id}>
                <div>
                  <strong>
                    {pay.player_apellidos}, {pay.player_nombre}
                  </strong>
                  <span>
                    {pay.fecha_pago} · {pay.metodo || "—"}
                  </span>
                </div>
                <div className="gestion-activity-list__end">
                  <strong>{formatEuro(pay.importe)}</strong>
                  <span className={`gestion-badge gestion-badge--${pay.estado}`}>
                    {PAYMENT_STATUS_LABELS[pay.estado]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </GestionChartCard>
      )}
    </div>
  );
}
