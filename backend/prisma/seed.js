const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('🧑 Seeded user:', user.email);

  await prisma.configuration.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      confidenceLevel: 0.9,
      forecastHorizon: 3,
      alertThresholds: {
        low: 50,
        high: 200,
      },
      notificationSettings: {
        sms: false,
        email: true,
      },
    },
  });

  console.log('⚙️  Configuration seeded');

  await prisma.salesData.createMany({
    data: [
      {
        userId: user.id,
        sku: 'PROD001',
        date: new Date('2024-01-15'),
        quantity: 125,
        price: 29.99,
        promotion: false,
        category: 'electronica',
        fileName: 'seed.csv',
      },
      {
        userId: user.id,
        sku: 'PROD001',
        date: new Date('2024-01-16'),
        quantity: 143,
        price: 29.99,
        promotion: true,
        category: 'electronica',
        fileName: 'seed.csv',
      },
    ],
  });

  console.log('📊 Sales data seeded');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
