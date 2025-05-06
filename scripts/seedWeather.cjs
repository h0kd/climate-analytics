/* eslint-disable */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const city = await prisma.city.findUnique({ where: { name: "Santiago" } });
  if (!city) throw new Error("Ciudad no encontrada");

  // Asegúrate de que existe el usuario system-user
  await prisma.user.upsert({
    where: { id: "system-user" },
    update: {},
    create: { id: "system-user", email: "system@localhost" },
  });

  const now = new Date();
  const fromDate = new Date(now);
  fromDate.setDate(now.getDate() - 7);

  // Borra datos previos en el rango
  await prisma.weatherData.deleteMany({
    where: {
      cityId: city.id,
      timestamp: { gte: fromDate },
      userId: "system-user",
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
        // Conecta la ciudad por su ID
        city: { connect: { id: city.id } },
        // Conecta el usuario “system-user”
        user: { connect: { id: "system-user" } },
        timestamp: date,
        temperature: temp,
        humidity: humidity,
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
