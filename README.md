# 🌤️ Climate Analytics Dashboard

[![Vercel](https://img.shields.io/badge/deploy-via%20vercel-blue)](https://vercel.com/…)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Una plataforma full‑stack para consultar, almacenar y visualizar datos meteorológicos en tiempo real e histórico.

---

## 📝 Descripción

**Climate Analytics** es una aplicación web construida con Next.js (App Router), Tailwind CSS y Prisma que ofrece:

- 🔍 **Clima en tiempo real** por ciudad usando la API de OpenWeather.
- 💾 **Persistencia** de las lecturas (temperatura, humedad, viento) en una base de datos (SQLite local / PostgreSQL en producción).
- 📈 **Gráficos históricos** interactivos (Chart.js + react‑chartjs‑2).
- 🗃️ **Exportación** de reportes a CSV (papaparse) y PDF (jsPDF + autotable).
- 🔒 **Autenticación** con Clerk.
- 🕒 **Recolección automática** diaria de datos con Cron Jobs (node‑cron local / Vercel Cron Jobs).

Ideal para demostraciones de: React, Next.js App Router, TailwindCSS, Prisma, consumo de APIs, generación de archivos, cron jobs y despliegue en la nube.

---

## 🚀 Tecnologías

- **Frontend**: Next.js (App Router), React, TailwindCSS
- **Backend**: Next.js Route Handlers (Node.js runtime)
- **BD dev**: SQLite + Prisma
- **BD prod**: PostgreSQL + Prisma
- **Gráficos**: Chart.js + react‑chartjs‑2
- **Auth**: Clerk (`@clerk/nextjs`)
- **Exportación**: papaparse, jsPDF + autotable
- **Cron local**: node‑cron
- **Cron prod**: Vercel Cron Jobs (`vercel.json`)

---

## ⚙️ Instalación y arranque local

1. **Clona el repo**

   ```bash
   git clone https://github.com/h0kd/climate-analytics.git
   cd climate-analytics
   ```

2. **Instala dependencias**

   ```bash
   npm install
   ```

3. **Crea** un fichero `.env.local` con tus credenciales:

   ```env
   # OpenWeather
   WEATHER_API_KEY=TU_OPENWEATHER_KEY

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx

   # Base de datos local (SQLite)
   DATABASE_URL="file:./dev.db"

   # (Opcional si migras a Postgres)
   # DATABASE_URL=postgresql://USER:PASS@HOST:PORT/DB

   # Cron
   CRON_SECRET=S3cureCr0nT0ken!

   # URL pública de tu app (para rutas internas en cron)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Inicializa BD y Prisma**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **(Opcional) Si quieres poblar datos**

   ```bash
   npm run seed          # semillas de ciudades
   npm run seed-weather  # histórico sintético últimos 7 días
   ```

6. **Arranca en modo dev**

   ```bash
   npm run dev
   ```

   → Visita [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Scripts disponibles

| Script                 | Descripción                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo (Next.js + Turbopack)      |
| `npm run build`        | Genera build de producción                        |
| `npm run start`        | Inicia servidor en modo producción                |
| `npm run lint`         | Ejecuta ESLint                                    |
| `npm run seed`         | Poblar tabla **City**                             |
| `npm run seed-weather` | Poblar tabla **WeatherData** con datos sintéticos |

---

## 📄 Uso básico

1. Regístrate o inicia sesión con Clerk.
2. Selecciona una ciudad en el desplegable.
3. Consulta clima actual y descarga CSV / PDF.
4. Ajusta el rango de fechas para tu histórico en el gráfico.

---

## 🕒 Cron Jobs

### Local

En `scripts/fetchAndStore.ts` usamos `node-cron` para lanzar automáticamente la recolección diaria.
Para probarlo manualmente:

```bash
npm run fetch-and-store
```

### Producción (Vercel)

1. Crea un archivo **vercel.json** en la raíz:

   ```json
   {
     "crons": [
       {
         "path": "/api/cron",
         "schedule": "0 2 * * *"
       }
     ]
   }
   ```

2. Asegúrate en **Settings → Cron Jobs** de Vercel que esté **Enabled**.
3. Añade tu `CRON_SECRET` en **Environment Variables** del proyecto.
4. La ruta `/api/cron` validará `Authorization: Bearer $CRON_SECRET` y disparará la recolección.

---

## 📦 Despliegue en Vercel

1. Empuja tu rama `master` a GitHub.
2. Importa el repo en Vercel, selecciona **Next.js**.
3. Configura tus **Environment Variables** en el dashboard (mismas que `.env.local`).
4. Comprueba el **Activity → Functions** para ver invocaciones de:

   - `/api/weather/fetch-and-store` (manual o cron)
   - `/api/cron` (programado)

---

## 📄 Licencia

MIT © \[h0kd]
