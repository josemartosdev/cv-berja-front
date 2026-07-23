import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionAlert from "../../components/gestion/GestionAlert";
import { postsApi } from "../../api/postsApi";
import { buildPostPayload } from "../../lib/posts";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  imageLayout: "normal",
  publishedAt: "",
  published: true,
  categoryId: "",
};

export default function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [pendingImageFile, setPendingImageFile] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const categoriesData = await postsApi.categories.list();
      setCategories(categoriesData);

      if (isEditing) {
        const post = await postsApi.get(id);
        setForm({
          title: post.title || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          imageUrl: post.imageUrl || "",
          imageLayout: post.imageLayout || "normal",
          publishedAt: post.publishedAt
            ? String(post.publishedAt).slice(0, 16)
            : "",
          published: !!post.published,
          categoryId: post.categoryId ? String(post.categoryId) : "",
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, isEditing]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = buildPostPayload(form);
      let result;

      if (isEditing) {
        // Actualizar post
        await postsApi.update(id, body);

        // Si hay archivo de imagen pendiente, subirlo
        if (pendingImageFile) {
          try {
            const imageResult = await postsApi.uploadImage(
              id,
              pendingImageFile,
            );
            setForm({
              ...form,
              imageUrl: imageResult.imagen_path || imageResult.url,
            });
            setPendingImageFile(null);
          } catch (imgErr) {
            console.warn("⚠️ Error al subir imagen:", imgErr.message);
            setError(`Error al subir imagen: ${imgErr.message}`);
            // No es error fatal, continuamos
          }
        }
      } else {
        // Crear post (con imagen si existe)
        result = await postsApi.createWithImage(body, pendingImageFile);
        if (result?.imageUrl) {
          setForm({
            ...form,
            imageUrl: result.imageUrl,
          });
        }
      }

      navigate("/gestion/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gestion-page">
      <Link to="/gestion/posts" className="gestion-back-link">
        <ArrowLeft size={16} />
        Volver a posts
      </Link>

      <GestionPageHeader
        title={isEditing ? "Editar post" : "Nuevo post"}
        description={
          isEditing
            ? "Edita una publicación completa en pantalla completa."
            : "Crea una nueva publicación para la portada y la sección de noticias."
        }
      />

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-panel gestion-panel--section">
        {loading ? (
          <p className="gestion-muted">Cargando formulario…</p>
        ) : (
          <form className="gestion-form gestion-form--grid" onSubmit={submit}>
            <label className="gestion-field gestion-field--full">
              <span>Titulo</span>
              <input
                className="gestion-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>

            <label className="gestion-field">
              <span>Categoria</span>
              <select
                className="gestion-input gestion-select"
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
              >
                <option value="">Sin categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="gestion-field">
              <span>Fecha de publicacion</span>
              <input
                type="datetime-local"
                className="gestion-input"
                value={form.publishedAt}
                onChange={(e) =>
                  setForm({ ...form, publishedAt: e.target.value })
                }
              />
            </label>

            <label className="gestion-field gestion-field--full">
              <span>Resumen</span>
              <textarea
                className="gestion-input gestion-textarea"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </label>

            <label className="gestion-field gestion-field--full">
              <span>Contenido</span>
              <textarea
                className="gestion-input gestion-textarea"
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </label>

            <div className="gestion-field gestion-field--full">
              <label
                className="gestion-label"
                style={{ display: "block", marginBottom: "0.75rem" }}
              >
                Foto del post
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPendingImageFile(file);
                  }
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Mostrar preview de imagen nueva seleccionada */}
            {pendingImageFile && (
              <div className="gestion-field gestion-field--full">
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#4f46e5",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  ✓ Nueva foto seleccionada: {pendingImageFile.name}
                </p>
                <img
                  src={URL.createObjectURL(pendingImageFile)}
                  alt="Preview"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "200px",
                    borderRadius: 6,
                    objectFit: "cover",
                    border: "2px solid #4f46e5",
                  }}
                />
              </div>
            )}

            {/* Mostrar foto actual si existe y no hay nueva seleccionada */}
            {form.imageUrl && !pendingImageFile && (
              <div className="gestion-field gestion-field--full">
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                  }}
                >
                  Foto actual:
                </p>
                <img
                  src={form.imageUrl}
                  alt="Current"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "200px",
                    borderRadius: 6,
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <label className="gestion-field">
              <span>Tamaño de imagen</span>
              <select
                className="gestion-input gestion-select"
                value={form.imageLayout}
                onChange={(e) =>
                  setForm({ ...form, imageLayout: e.target.value })
                }
              >
                <option value="compacta">Compacta</option>
                <option value="normal">Normal</option>
                <option value="ancha">Ancha</option>
              </select>
            </label>

            <label className="gestion-field gestion-field--check gestion-field--full">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              <span>Publicar en la web</span>
            </label>

            <div className="gestion-form__footer gestion-field--full">
              <button
                type="submit"
                className="gestion-btn gestion-btn--primary"
                disabled={saving}
              >
                {saving
                  ? "Guardando…"
                  : isEditing
                    ? "Guardar cambios"
                    : "Crear post"}
              </button>
              <Link
                to="/gestion/posts"
                className="gestion-btn gestion-btn--ghost"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
