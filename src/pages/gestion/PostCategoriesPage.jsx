import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionAlert from "../../components/gestion/GestionAlert";
import ConfirmDialog from "../../components/gestion/ConfirmDialog";
import { postsApi } from "../../api/postsApi";

const emptyForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activo: true,
};

export default function PostCategoriesPage() {
  const formCardRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCategories(await postsApi.categories.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      nombre: category.nombre || "",
      slug: category.slug || "",
      descripcion: category.descripcion || "",
      activo: !!category.activo,
    });
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        nombre: form.nombre,
        slug: form.slug || undefined,
        descripcion: form.descripcion || null,
        activo: form.activo,
      };
      if (editing) {
        await postsApi.categories.update(editing.id, body);
      } else {
        await postsApi.categories.create(body);
      }
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await postsApi.categories.remove(deleteTarget.id);
      setDeleteTarget(null);
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
        title="Categorías de posts"
        description="Gestiona las categorías para organizar noticias y publicaciones."
        action={
          <div className="gestion-page__actions-group">
            <Link
              to="/gestion/posts"
              className="gestion-btn gestion-btn--ghost"
            >
              Volver a posts
            </Link>
            <button
              type="button"
              className="gestion-btn gestion-btn--primary"
              onClick={openCreate}
            >
              <Plus size={18} />
              Nueva categoría
            </button>
          </div>
        }
      />

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-panel gestion-panel--section">
        {loading ? (
          <p className="gestion-muted">Cargando categorías…</p>
        ) : categories.length === 0 ? (
          <p className="gestion-muted">Todavía no hay categorías.</p>
        ) : (
          <div className="gestion-table-wrap">
            <table className="gestion-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Slug</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <strong>{category.nombre}</strong>
                      {category.descripcion && (
                        <span className="gestion-table__sub">
                          {category.descripcion}
                        </span>
                      )}
                    </td>
                    <td>{category.slug}</td>
                    <td>
                      <span
                        className={`gestion-badge${category.activo ? "" : " gestion-badge--muted"}`}
                      >
                        {category.activo ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="gestion-table__actions">
                      <button
                        type="button"
                        className="gestion-icon-btn"
                        onClick={() => openEdit(category)}
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="gestion-icon-btn gestion-icon-btn--danger"
                        onClick={() => setDeleteTarget(category)}
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        ref={formCardRef}
        className="gestion-panel gestion-panel--section gestion-panel--card"
      >
        <h2 className="gestion-subtitle">
          {editing ? "Editar categoría" : "Nueva categoría"}
        </h2>
        <p className="gestion-muted">
          {editing
            ? "Ajusta el nombre, slug, descripción y estado de la categoría."
            : "Crea una nueva categoría para organizar los posts de la web."}
        </p>
        <form className="gestion-form gestion-form--grid" onSubmit={submit}>
          <label className="gestion-field">
            <span>Nombre</span>
            <input
              className="gestion-input"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Slug</span>
            <input
              className="gestion-input"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="actualidad"
            />
          </label>
          <label className="gestion-field gestion-field--full">
            <span>Descripción</span>
            <textarea
              className="gestion-input gestion-textarea"
              rows={4}
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </label>
          <label className="gestion-field gestion-field--check gestion-field--full">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
            />
            <span>Categoría activa</span>
          </label>
          <div className="gestion-form__footer gestion-field--full">
            <button
              type="submit"
              className="gestion-btn gestion-btn--primary"
              disabled={saving}
            >
              {saving
                ? "Guardando…"
                : editing
                  ? "Guardar categoría"
                  : "Crear categoría"}
            </button>
            {editing && (
              <button
                type="button"
                className="gestion-btn gestion-btn--ghost"
                onClick={openCreate}
              >
                Limpiar
              </button>
            )}
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar categoría"
        message={
          deleteTarget ? `¿Eliminar la categoría ${deleteTarget.nombre}?` : ""
        }
        confirmLabel={deleting ? "Eliminando…" : "Eliminar"}
        cancelLabel="Cancelar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
