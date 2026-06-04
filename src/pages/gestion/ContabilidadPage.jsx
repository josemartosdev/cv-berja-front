import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { gestionApi } from "../../api/gestionApi";
import SimpleDonutChart from "../../components/gestion/charts/SimpleDonutChart";
import SimpleAreaChart from "../../components/gestion/charts/SimpleAreaChart";
import SimpleHorizontalBarChart from "../../components/gestion/charts/SimpleHorizontalBarChart";
import { useAuth } from "../../context/AuthContext";
import {
  canManagePayments,
  formatDate,
  formatEuro,
  PAYMENT_STATUS_LABELS,
  playerFullName,
} from "../../lib/gestionHelpers";
import {
  CHART_COLORS,
  paymentStatusChart,
  paymentsByMonthChart,
  paymentsByMethodChart,
} from "../../lib/chartData";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionModal from "../../components/gestion/GestionModal";
import GestionAlert from "../../components/gestion/GestionAlert";
import GestionChartCard from "../../components/gestion/GestionChartCard";
import ConfirmDialog from "../../components/gestion/ConfirmDialog";

const emptyPayment = {
  playerId: "",
  feePlanId: "",
  importe: "",
  fechaPago: new Date().toISOString().slice(0, 10),
  metodo: "efectivo",
  estado: "pagado",
  notas: "",
};

const emptyFeePlan = { nombre: "", importe: "", temporada: "2025-26" };

const STATUS_COLORS = {
  pagado: CHART_COLORS.success,
  pendiente: CHART_COLORS.warning,
  devuelto: CHART_COLORS.muted,
};

export default function ContabilidadPage() {
  const { user } = useAuth();
  const canEdit = canManagePayments(user?.role);
  const [tab, setTab] = useState("pagos");
  const [payments, setPayments] = useState([]);
  const [feePlans, setFeePlans] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [feeModal, setFeeModal] = useState(false);
  const [editFee, setEditFee] = useState(null);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [feeForm, setFeeForm] = useState(emptyFeePlan);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [pay, plans, pl] = await Promise.all([
        gestionApi.payments.list(),
        gestionApi.payments.feePlans(),
        gestionApi.players.list(),
      ]);
      setPayments(pay);
      setFeePlans(plans);
      setPlayers(pl.filter((p) => p.activo));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => {
    const paid = payments.filter((p) => p.estado === "pagado");
    const pending = payments.filter((p) => p.estado === "pendiente");
    return {
      income: paid.reduce((s, p) => s + Number(p.importe), 0),
      pending: pending.reduce((s, p) => s + Number(p.importe), 0),
      count: payments.length,
    };
  }, [payments]);

  const statusChart = useMemo(() => paymentStatusChart(payments), [payments]);
  const monthChart = useMemo(() => paymentsByMonthChart(payments), [payments]);
  const methodChart = useMemo(() => paymentsByMethodChart(payments), [payments]);

  const onFeePlanChange = (feePlanId) => {
    const plan = feePlans.find((f) => String(f.id) === feePlanId);
    setPaymentForm((prev) => ({
      ...prev,
      feePlanId,
      importe: plan ? String(plan.importe) : prev.importe,
    }));
  };

  const openEditPayment = (pay) => {
    setEditPayment(pay);
    setPaymentForm({
      playerId: String(pay.player_id),
      feePlanId: pay.fee_plan_id ? String(pay.fee_plan_id) : "",
      importe: String(pay.importe),
      fechaPago: pay.fecha_pago,
      metodo: pay.metodo || "efectivo",
      estado: pay.estado,
      notas: pay.notas || "",
    });
    setPaymentModal(true);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        importe: paymentForm.importe,
        fechaPago: paymentForm.fechaPago,
        metodo: paymentForm.metodo,
        estado: paymentForm.estado,
        notas: paymentForm.notas || null,
      };
      if (editPayment) {
        await gestionApi.payments.update(editPayment.id, body);
      } else {
        await gestionApi.payments.create({
          playerId: Number(paymentForm.playerId),
          feePlanId: paymentForm.feePlanId ? Number(paymentForm.feePlanId) : null,
          ...body,
        });
      }
      setPaymentModal(false);
      setEditPayment(null);
      setPaymentForm(emptyPayment);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openEditFee = (plan) => {
    setEditFee(plan);
    setFeeForm({
      nombre: plan.nombre,
      importe: String(plan.importe),
      temporada: plan.temporada,
    });
    setFeeModal(true);
  };

  const submitFeePlan = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editFee) {
        await gestionApi.payments.updateFeePlan(editFee.id, feeForm);
      } else {
        await gestionApi.payments.createFeePlan(feeForm);
      }
      setFeeModal(false);
      setEditFee(null);
      setFeeForm(emptyFeePlan);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    setError("");
    try {
      if (confirm.type === "payment") {
        await gestionApi.payments.remove(confirm.id);
      } else {
        await gestionApi.payments.removeFeePlan(confirm.id);
      }
      setConfirm(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="gestion-page">
      <GestionPageHeader
        title="Contabilidad"
        description="Cuotas, cobros y análisis económico del club."
        action={
          canEdit && (
            <div className="gestion-page__actions-group">
              {tab === "pagos" ? (
                <button
                  type="button"
                  className="gestion-btn gestion-btn--primary"
                  onClick={() => {
                    setEditPayment(null);
                    setPaymentForm(emptyPayment);
                    setPaymentModal(true);
                  }}
                >
                  <Plus size={18} />
                  Registrar pago
                </button>
              ) : (
                <button
                  type="button"
                  className="gestion-btn gestion-btn--primary"
                  onClick={() => {
                    setEditFee(null);
                    setFeeForm(emptyFeePlan);
                    setFeeModal(true);
                  }}
                >
                  <Plus size={18} />
                  Nueva cuota
                </button>
              )}
            </div>
          )
        }
      />

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-kpi-grid gestion-kpi-grid--compact">
        <div className="gestion-kpi gestion-kpi--green gestion-kpi--static">
          <span className="gestion-kpi__label">Ingresos cobrados</span>
          <strong>{loading ? "…" : formatEuro(summary.income)}</strong>
        </div>
        <div className="gestion-kpi gestion-kpi--amber gestion-kpi--static">
          <span className="gestion-kpi__label">Pendiente</span>
          <strong>{loading ? "…" : formatEuro(summary.pending)}</strong>
        </div>
        <div className="gestion-kpi gestion-kpi--dark gestion-kpi--static">
          <span className="gestion-kpi__label">Movimientos</span>
          <strong>{loading ? "…" : summary.count}</strong>
        </div>
      </div>

      <div className="gestion-charts-grid gestion-charts-grid--triple">
        <GestionChartCard title="Estado de pagos" subtitle="Distribución">
          {statusChart.length === 0 ? (
            <p className="gestion-chart-empty">Sin datos</p>
          ) : (
            <div className="gestion-donut-layout gestion-donut-layout--sm">
              <SimpleDonutChart
                data={statusChart}
                size={160}
                colors={statusChart.map((e) => STATUS_COLORS[e.key] ?? CHART_COLORS.muted)}
              />
              <div className="gestion-chart-legend gestion-chart-legend--col">
                {statusChart.map((e) => (
                  <span key={e.key}>
                    <i style={{ background: STATUS_COLORS[e.key] }} />
                    {e.name} ({e.value})
                  </span>
                ))}
              </div>
            </div>
          )}
        </GestionChartCard>
        <GestionChartCard title="Ingresos mensuales" subtitle="Pagados">
          {monthChart.length === 0 ? (
            <p className="gestion-chart-empty">Sin datos</p>
          ) : (
            <SimpleAreaChart data={monthChart} height={220} />
          )}
        </GestionChartCard>
        <GestionChartCard title="Por método de pago" subtitle="Importe cobrado">
          {methodChart.length === 0 ? (
            <p className="gestion-chart-empty">Sin datos</p>
          ) : (
            <SimpleHorizontalBarChart data={methodChart} formatValue={formatEuro} />
          )}
        </GestionChartCard>
      </div>

      <div className="gestion-tabs">
        <button
          type="button"
          className={`gestion-tabs__btn${tab === "pagos" ? " gestion-tabs__btn--active" : ""}`}
          onClick={() => setTab("pagos")}
        >
          Pagos
        </button>
        <button
          type="button"
          className={`gestion-tabs__btn${tab === "cuotas" ? " gestion-tabs__btn--active" : ""}`}
          onClick={() => setTab("cuotas")}
        >
          Tipos de cuota
        </button>
      </div>

      <div className="gestion-panel">
        {loading ? (
          <p className="gestion-muted">Cargando…</p>
        ) : tab === "pagos" ? (
          payments.length === 0 ? (
            <p className="gestion-muted">No hay pagos registrados.</p>
          ) : (
            <div className="gestion-table-wrap">
              <table className="gestion-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Jugador</th>
                    <th>Concepto</th>
                    <th>Importe</th>
                    <th>Estado</th>
                    {canEdit && <th />}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((pay) => (
                    <tr key={pay.id}>
                      <td>{formatDate(pay.fecha_pago)}</td>
                      <td>
                        <strong>
                          {pay.player_apellidos}, {pay.player_nombre}
                        </strong>
                      </td>
                      <td>{pay.fee_plan_nombre || "—"}</td>
                      <td>{formatEuro(pay.importe)}</td>
                      <td>
                        <span className={`gestion-badge gestion-badge--${pay.estado}`}>
                          {PAYMENT_STATUS_LABELS[pay.estado]}
                        </span>
                      </td>
                      {canEdit && (
                        <td className="gestion-table__actions">
                          <button type="button" className="gestion-icon-btn" onClick={() => openEditPayment(pay)} aria-label="Editar">
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="gestion-icon-btn gestion-icon-btn--danger"
                            onClick={() =>
                              setConfirm({
                                type: "payment",
                                id: pay.id,
                                message: `¿Eliminar el pago de ${formatEuro(pay.importe)}?`,
                              })
                            }
                            aria-label="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : feePlans.length === 0 ? (
          <p className="gestion-muted">No hay tipos de cuota.</p>
        ) : (
          <div className="gestion-table-wrap">
            <table className="gestion-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Importe</th>
                  <th>Temporada</th>
                  {canEdit && <th />}
                </tr>
              </thead>
              <tbody>
                {feePlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <strong>{plan.nombre}</strong>
                    </td>
                    <td>{formatEuro(plan.importe)}</td>
                    <td>{plan.temporada}</td>
                    {canEdit && (
                      <td className="gestion-table__actions">
                        <button type="button" className="gestion-icon-btn" onClick={() => openEditFee(plan)} aria-label="Editar">
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="gestion-icon-btn gestion-icon-btn--danger"
                          onClick={() =>
                            setConfirm({
                              type: "fee",
                              id: plan.id,
                              message: `¿Eliminar la cuota "${plan.nombre}"?`,
                            })
                          }
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GestionModal
        title={editPayment ? "Editar pago" : "Registrar pago"}
        open={paymentModal}
        onClose={() => {
          setPaymentModal(false);
          setEditPayment(null);
        }}
      >
        <form className="gestion-form" onSubmit={submitPayment}>
          {!editPayment && (
            <>
              <label className="gestion-field">
                <span>Jugador</span>
                <select
                  className="gestion-input gestion-select"
                  value={paymentForm.playerId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, playerId: e.target.value })}
                  required
                >
                  <option value="">Seleccionar…</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {playerFullName(p)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="gestion-field">
                <span>Tipo de cuota (opcional)</span>
                <select
                  className="gestion-input gestion-select"
                  value={paymentForm.feePlanId}
                  onChange={(e) => onFeePlanChange(e.target.value)}
                >
                  <option value="">Manual</option>
                  {feePlans.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nombre} — {formatEuro(f.importe)}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          <label className="gestion-field">
            <span>Importe (€)</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="gestion-input"
              value={paymentForm.importe}
              onChange={(e) => setPaymentForm({ ...paymentForm, importe: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Fecha</span>
            <input
              type="date"
              className="gestion-input"
              value={paymentForm.fechaPago}
              onChange={(e) => setPaymentForm({ ...paymentForm, fechaPago: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Estado</span>
            <select
              className="gestion-input gestion-select"
              value={paymentForm.estado}
              onChange={(e) => setPaymentForm({ ...paymentForm, estado: e.target.value })}
            >
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="devuelto">Devuelto</option>
            </select>
          </label>
          <label className="gestion-field">
            <span>Método</span>
            <select
              className="gestion-input gestion-select"
              value={paymentForm.metodo}
              onChange={(e) => setPaymentForm({ ...paymentForm, metodo: e.target.value })}
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="bizum">Bizum</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </label>
          <label className="gestion-field">
            <span>Notas</span>
            <textarea
              className="gestion-input gestion-textarea"
              rows={2}
              value={paymentForm.notas}
              onChange={(e) => setPaymentForm({ ...paymentForm, notas: e.target.value })}
            />
          </label>
          <div className="gestion-form__footer">
            <button type="button" className="gestion-btn gestion-btn--ghost" onClick={() => setPaymentModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="gestion-btn gestion-btn--primary" disabled={saving}>
              {saving ? "Guardando…" : editPayment ? "Guardar cambios" : "Registrar"}
            </button>
          </div>
        </form>
      </GestionModal>

      <GestionModal
        title={editFee ? "Editar cuota" : "Nueva cuota"}
        open={feeModal}
        onClose={() => {
          setFeeModal(false);
          setEditFee(null);
        }}
      >
        <form className="gestion-form" onSubmit={submitFeePlan}>
          <label className="gestion-field">
            <span>Nombre</span>
            <input
              className="gestion-input"
              value={feeForm.nombre}
              onChange={(e) => setFeeForm({ ...feeForm, nombre: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Importe (€)</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="gestion-input"
              value={feeForm.importe}
              onChange={(e) => setFeeForm({ ...feeForm, importe: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Temporada</span>
            <input
              className="gestion-input"
              value={feeForm.temporada}
              onChange={(e) => setFeeForm({ ...feeForm, temporada: e.target.value })}
              required
            />
          </label>
          <div className="gestion-form__footer">
            <button type="button" className="gestion-btn gestion-btn--ghost" onClick={() => setFeeModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="gestion-btn gestion-btn--primary" disabled={saving}>
              {saving ? "Guardando…" : editFee ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </GestionModal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirmDelete}
        message={confirm?.message}
        loading={deleting}
      />
    </div>
  );
}
