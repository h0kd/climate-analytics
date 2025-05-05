/* eslint-disable */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const city = await prisma.city.findUnique({ where: { name: "Santiago" } });
  if (!city) throw new Error("Ciudad no encontrada");

  const now = new Date();
  // Borra datos previos en el rango para evitar duplicados
  const fromDate = new Date(now);
  fromDate.setDate(now.getDate() - 7);
  await prisma.weatherData.deleteMany({
    where: {
      cityId: city.id,
      timestamp: { gte: fromDate },
    },
  });

  // Inserta un punto por día en los últimos 7 días
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    const temp = 15 + Math.random() * 10;
    const humidity = 30 + Math.random() * 50;
    const wind = 0.5 + Math.random() * 4;

    await prisma.weatherData.create({
      data: {
        cityId: city.id,
        timestamp: date,
        temperature: temp,
        humidity,
        windSpeed: wind,
      },
    });
  }

  console.log("✅ Histórico sembrado para los últimos 7 días");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
