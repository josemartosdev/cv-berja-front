import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionAlert from "../../components/gestion/GestionAlert";
import ConfirmDialog from "../../components/gestion/ConfirmDialog";
import { postsApi } from "../../api/postsApi";
import { formatPostDate, resolvePostImageUrl } from "../../lib/posts";

export default function PostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [postsData, categoriesData] = await Promise.all([
        postsApi.listAdmin(),
        postsApi.categories.list(),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await postsApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === "published" && !post.published) return false;
    if (statusFilter === "draft" && post.published) return false;
    if (
      categoryFilter !== "all" &&
      String(post.categoryId || "") !== categoryFilter
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="gestion-page">
      <GestionPageHeader
        title="Posts"
        description="Gestiona noticias y publicaciones de la web publica."
        action={
          <div className="gestion-page__actions-group">
            <Link
              to="/gestion/post-categories"
              className="gestion-btn gestion-btn--ghost"
            >
              Categorías
            </Link>
            <Link
              to="/gestion/posts/nuevo"
              className="gestion-btn gestion-btn--primary"
            >
              <Plus size={18} />
              Nuevo post
            </Link>
          </div>
        }
      />

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-toolbar gestion-toolbar--posts">
        <label className="gestion-field gestion-field--inline gestion-toolbar__field">
          <span>Estado</span>
          <select
            className="gestion-input gestion-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
          </select>
        </label>

        <label className="gestion-field gestion-field--inline gestion-toolbar__field gestion-toolbar__field--category">
          <select
            className="gestion-input gestion-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Categoría"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="gestion-btn gestion-btn--ghost"
          onClick={() => {
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
        >
          Limpiar filtros
        </button>
      </div>

      <div className="gestion-panel">
        {loading ? (
          <p className="gestion-muted">Cargando posts…</p>
        ) : filteredPosts.length === 0 ? (
          <p className="gestion-muted">No hay posts publicados todavía.</p>
        ) : (
          <div className="gestion-table-wrap">
            <table className="gestion-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Categoria</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="gestion-table__person">
                        {post.imageUrl ? (
                          <img
                            src={resolvePostImageUrl(post.imageUrl)}
                            alt=""
                            className="gestion-avatar gestion-avatar--sm"
                          />
                        ) : (
                          <span className="gestion-avatar gestion-avatar--sm gestion-avatar--empty" />
                        )}
                        <div>
                          <strong>{post.title}</strong>
                          {post.excerpt && (
                            <span className="gestion-table__sub">
                              {post.excerpt}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{post.categoryName || "—"}</td>
                    <td>
                      <span
                        className={`gestion-badge${post.published ? "" : " gestion-badge--muted"}`}
                      >
                        {post.published ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td>{formatPostDate(post.publishedAt) || "—"}</td>
                    <td className="gestion-table__actions">
                      <button
                        type="button"
                        className="gestion-icon-btn"
                        aria-label="Editar"
                        onClick={() =>
                          navigate(`/gestion/posts/${post.id}/editar`)
                        }
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="gestion-icon-btn gestion-icon-btn--danger"
                        aria-label="Eliminar"
                        onClick={() =>
                          setDeleteTarget({
                            id: post.id,
                            message: `¿Eliminar el post \"${post.title}\"?`,
                          })
                        }
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar post"
        message={deleteTarget?.message}
        confirmLabel={deleting ? "Eliminando…" : "Eliminar"}
        cancelLabel="Cancelar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
