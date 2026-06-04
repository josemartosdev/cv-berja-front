# CV Berja — Frontend

React + Vite. Panel de gestión en `/gestion`, web pública en el resto de rutas.

## Guía de conexión (local + producción)

Lee la guía del monorepo: **[`../../GUIA-COMPLETA.md`](../../GUIA-COMPLETA.md)**  
Ahí está explicado cómo enlazar **Vercel**, **Railway (API + MySQL)**, variables `VITE_API_URL`, CORS, DBeaver, etc.

## Desarrollo rápido

```powershell
npm install
npm run dev
```

`.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

(Necesitas el backend Symfony en `http://localhost:8000`.)

## Producción (Vercel)

Variable en el proyecto Vercel → **Redeploy obligatorio**:

```env
VITE_API_URL=https://cv-berja-back-production.up.railway.app/api
```

Plantilla: `.env.vercel.example`
