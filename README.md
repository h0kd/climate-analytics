# Climate Analytics Dashboard

Una plataforma de análisis y visualización de datos meteorológicos en tiempo real y en histórico.

---

## 📝 Descripción

Este proyecto es una **aplicación web full‑stack** construida con Next.js, Tailwind CSS y Prisma (con SQLite o PostgreSQL) que permite:

- Consulta de clima en tiempo real por ciudad usando la API de OpenWeather.
- Persistencia de datos meteorológicos (temperatura, humedad, viento) en una base de datos.
- Visualización histórica con gráficos interactivos (Chart.js / react-chartjs-2).
- Exportación de reportes a CSV y PDF.
- Modo claro/oscuro y diseño responsive.

Ideal para demostrar habilidades en: React, Next.js App Router, TailwindCSS, Prisma, consumo de APIs, manejo de datos, generación de archivos y despliegue.

---

## 🚀 Tecnologías

- **Frontend**: Next.js (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes (Node.js runtime)
- **Base de datos**: SQLite (dev) / PostgreSQL (prod) con Prisma
- **Gráficos**: Chart.js + react-chartjs-2
- **Autenticación**: (Opcional) Clerk o Auth.js
- **Exportación**: papaparse (CSV), jsPDF + autotable (PDF)
- **Tareas programadas**: node-cron (local) / Vercel Cron Jobs (producción)

---

## ⚙️ Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/h0kd/climate-analytics.git
   cd climate-analytics
   ```

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Configura variables de entorno en `.env.local`:

   ```env
   # API de OpenWeather
   WEATHER_API_KEY=tu_api_key_aqui

   # (Si usas PostgreSQL)
   DATABASE_URL=postgresql://usuario:password@localhost:5432/climate
   ```

4. Inicializa la base de datos y genera el cliente Prisma:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. (Opcional) Si usas SQLite local, no necesitas DATABASE_URL.

---

## 🛠️ Scripts Útiles

- `npm run dev` — Inicia el servidor de desarrollo (Next.js + Turbopack)
- `npm run build` — Genera la versión de producción
- `npm run start` — Arranca el servidor en modo producción
- `npm run seed` — Seeder de ciudades iniciales
- `npm run seed-weather` — Seeder de datos históricos de clima (últimos 7 días)
- `npm run lint` — Ejecuta ESLint

---

## 📄 Uso

1. Accede a `http://localhost:3000`
2. Selecciona una ciudad del desplegable.
3. Verás el clima en tiempo real y podrás descargar el reporte en CSV/PDF.
4. Ajusta rangos de fecha para ver el histórico en el gráfico.

---

## 🧪 Tareas programadas

- **Local**: ejecutar `ts-node scripts/fetchAndStore.ts` o `npm run fetch-and-store` con `node-cron`.
- **Producción (Vercel)**: configurar Cron Job apuntando a `/api/weather/fetch-and-store`.

---

## 📦 Despliegue

1. Empaqueta tu app en Vercel, Netlify o tu servidor preferido.
2. Asegura variables de entorno en el dashboard de la plataforma.
3. Configura Cron Jobs si deseas recolección automática.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
