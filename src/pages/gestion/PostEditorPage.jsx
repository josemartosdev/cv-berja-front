import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionAlert from "../../components/gestion/GestionAlert";
import PhotoUploadForm from "../../components/PhotoUploadForm";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [pendingImagePreview, setPendingImagePreview] = useState(null);

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
            const imageResult = await postsApi.uploadImage(id, pendingImageFile);
            setForm({
              ...form,
              imageUrl: imageResult.imagen_path || imageResult.url,
            });
            setPendingImageFile(null);
            setPendingImagePreview(null);
          } catch (imgErr) {
            console.warn("Error al subir imagen:", imgErr);
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
              <PhotoUploadForm
                title="Foto del post"
                onSubmit={async ({ file }) => {
                  setUploadError("");
                  try {
                    setPendingImageFile(file);
                    // Crear preview local
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setPendingImagePreview(e.target.result);
                    };
                    reader.readAsDataURL(file);
                  } catch (err) {
                    setUploadError(err.message);
                    throw err;
                  }
                }}
                loading={uploading}
                error={uploadError}
                showTitle={false}
                showDisplay={false}
                buttonText={isEditing ? "Cambiar foto del post" : "Seleccionar foto del post"}
              />

              {/* Mostrar preview de nueva imagen pendiente */}
              {pendingImagePreview && (
                <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Nueva foto (se subirá al {isEditing ? "actualizar" : "crear"}):
                  </p>
                  <img
                    src={pendingImagePreview}
                    alt="New Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "150px",
                      borderRadius: 6,
                      objectFit: "cover",
                      border: "2px solid #4f46e5",
                    }}
                  />
                </div>
              )}

              {/* Mostrar foto actual (si está editando) */}
              {form.imageUrl && !pendingImagePreview && (
                <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
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
