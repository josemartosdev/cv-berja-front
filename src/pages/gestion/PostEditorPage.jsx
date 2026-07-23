import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionAlert from "../../components/gestion/GestionAlert";
import PhotoUploadForm from "../../components/PhotoUploadForm";
import { postsApi } from "../../api/postsApi";
import { galeriaApi } from "../../api/galeriaApi";
import { buildPostPayload } from "../../lib/posts";
import { uploadFile } from "../../api/upload";

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);

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
      if (isEditing) {
        await postsApi.update(id, body);
      } else {
        await postsApi.create(body);
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
              {isEditing ? (
                <PhotoUploadForm
                  title="Foto del post"
                  onSubmit={async ({ file, displayType }) => {
                    setUploading(true);
                    setUploadError("");
                    try {
                      const result = await postsApi.uploadImage(id, file);
                      setForm({
                        ...form,
                        imageUrl:
                          result.imagen_path || result.imageUrl || result.url,
                      });
                    } catch (err) {
                      setUploadError(err.message);
                      throw err;
                    } finally {
                      setUploading(false);
                    }
                  }}
                  loading={uploading}
                  error={uploadError}
                  showTitle={false}
                  showDisplay={false}
                  buttonText="Subir foto del post"
                />
              ) : (
                <p style={{ color: "#999", fontSize: "0.9rem" }}>
                  💡 Crea el post primero para poder subir una foto
                </p>
              )}
              {form.imageUrl && (
                <div style={{ marginBottom: "1rem" }}>
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
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "150px",
                      borderRadius: 6,
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>

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
