# Sistema de Galería - Instrucciones de Integración

## 📋 Resumen

Sistema completo de galería con Cloudflare R2 + opciones de visualización:

- **Web pública**: Visible en el sitio público
- **Solo aplicación**: Solo en apps móviles
- **Cabecera**: Foto destacada en cabeceras

---

## ✅ Componentes Creados

### 1. DropzoneUpload.jsx

Componente base con drag & drop, selección de archivo y preview.

```jsx
import DropzoneUpload from '../components/DropzoneUpload'

// Uso básico
<DropzoneUpload
  onFileSelect={(file) => setFile(file)}
  label="Arrastra una foto"
/>

// Con opciones de visualización
<DropzoneUpload
  onFileSelect={(file) => setFile(file)}
  showDisplayOptions
  displayType={displayType}
  onDisplayChange={setDisplayType}
/>
```

### 2. PhotoUploadForm.jsx

Formulario reutilizable que combina DropzoneUpload + título + opciones.

```jsx
import PhotoUploadForm from '../components/PhotoUploadForm'

const [error, setError] = useState("")
const [saving, setSaving] = useState(false)

<PhotoUploadForm
  onSubmit={async ({file, titulo, displayType}) => {
    setSaving(true)
    try {
      // Tu API aquí
      await tu_api.upload(file, titulo, displayType)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }}
  loading={saving}
  error={error}
  title="Subir foto del jugador"
  showTitle={true}
  showDisplay={true}
/>
```

---

## 📍 Páginas de Gestión a Actualizar

### PostEditorPage.jsx / PostsPage.jsx

```jsx
import PhotoUploadForm from "../components/PhotoUploadForm";

// En el formulario de edición
<PhotoUploadForm
  onSubmit={async ({ file, titulo, displayType }) => {
    await postsApi.upload(file, titulo, displayType);
  }}
  showDisplay={true}
/>;
```

### JugadorDetallePage.jsx

```jsx
<PhotoUploadForm
  onSubmit={async ({ file }) => {
    await jugadoresApi.uploadFoto(jugadorId, file);
  }}
  showTitle={false}
/>
```

### EntrenadorDetallePage.jsx

```jsx
<PhotoUploadForm
  onSubmit={async ({ file }) => {
    await entrenadoresApi.uploadFoto(entrenadorId, file);
  }}
  showTitle={false}
/>
```

---

## 🖼️ Páginas Públicas

### GaleriaPage.jsx ✅ Actualizado

- Solo muestra fotos con `displayType: "web"` o `displayType: "cabecera"`
- Filtrable por tipo (galería, jugador, post)
- Lightbox con preview

### CabecerasPage (si existe)

Mostrar solo fotos con `displayType: "cabecera"`

---

## 🔌 API Backend (Requerido)

El backend necesita soportar:

```javascript
// POST /gestion/galeria
{
  foto: File,
  titulo: string (opcional),
  tipo: "galeria|jugador|entrenador|post|noticia",
  displayType: "web|app|cabecera"
}

// PATCH /gestion/galeria/:id
{
  displayType: "web|app|cabecera"
}
```

Respuesta esperada:

```json
{
  id: string,
  url: string,
  titulo: string,
  tipo: string,
  displayType: string,
  createdAt: string
}
```

---

## 🎯 Flujo Completo

1. **Upload**: Usuario arrastra/selecciona foto + elige dónde mostrar
2. **Backend**: Sube a R2, guarda metadata (tipo, displayType)
3. **Admin**: Puede cambiar displayType en cualquier momento
4. **Web pública**: Filtra por displayType automáticamente
5. **Apps móviles**: Filtra por displayType (si está integrado)

---

## 🛠️ Helpers Útiles

En [lib/gestionHelpers.js](src/lib/gestionHelpers.js):

```javascript
// Filtrar fotos por display type
const fotosWeb = fotos.filter((f) => f.displayType !== "app");
const fotosApp = fotos.filter((f) => f.displayType === "web");
const fotosCabecera = fotos.filter((f) => f.displayType === "cabecera");
```

---

## 📱 Rutas públicas actualizadas

- ✅ `/galeria` - Página con filtros por tipo y displayType

---

## ❌ Errores Comunes

**"R2_ACCESS_KEY_ID not found"**
→ Backend: configurar variables de entorno en `.env`

**Foto no aparece en web**
→ Verificar que `displayType !== 'app'` en la BD

---

## 📝 Notas

- El componente DropzoneUpload automáticamente hace preview
- PhotoUploadForm limpian los campos después de submit exitoso
- El selector de displayType está incluido en DropzoneUpload cuando `showDisplayOptions={true}`
