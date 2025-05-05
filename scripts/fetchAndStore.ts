import cron from "node-cron";
import prisma from "../src/lib/prisma";
import { fetchCurrentWeather } from "../src/lib/weather";

// Programa: cada media hora (en el minuto 0 y 30)
cron.schedule("0,30 * * * *", async () => {
  const cities = await prisma.city.findMany();
  for (const city of cities) {
    try {
      const w = await fetchCurrentWeather(city.name);
      await prisma.weatherData.create({
        data: {
          cityId: city.id,
          userId: "system-user", // ← obligatorio ahora
          timestamp: new Date(w.timestamp),
          temperature: w.temperature,
          humidity: w.humidity,
          windSpeed: w.windSpeed,
        },
      });
    } catch (e) {
      console.error(`Error al obtener clima de ${city.name}:`, e);
    }
  }
  console.log("✅ Datos de clima actualizados", new Date().toISOString());
});

// Para mantener vivo el proceso si lo arrancas con `node`
console.log("Cron job iniciado (0 y 30 minutos cada hora)");
