const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@test.com',
      role: 'admin',
    },
    {
      email: 'user@test.com',
      role: 'user',
    },
    {
      email: 'user2@test.com',
      role: 'user',
    },
  ];

  for (const { email, role } of users) {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        role,
      },
    });

    console.log(`🧑 Seeded user: ${user.email} (${user.role})`);

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

    console.log(`⚙️  Configuration seeded for ${user.email}`);

    // Seed sample sales data only for admin
    if (user.email === 'admin@test.com') {
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
          {
            userId: user.id,
            sku: 'PROD001',
            date: new Date('2024-01-17'),
            quantity: 150,
            price: 29.99,
            promotion: true,
            category: 'electronica',
            fileName: 'seed.csv',
          },
          {
            userId: user.id,
            sku: 'PROD001',
            date: new Date('2024-01-18'),
            quantity: 130,
            price: 29.99,
            promotion: false,
            category: 'electronica',
            fileName: 'seed.csv',
          },
          {
            userId: user.id,
            sku: 'PROD001',
            date: new Date('2024-01-19'),
            quantity: 160,
            price: 29.99,
            promotion: true,
            category: 'electronica',
            fileName: 'seed.csv',
          },
          {
            userId: user.id,
            sku: 'PROD001',
            date: new Date('2024-01-20'),
            quantity: 170,
            price: 29.99,
            promotion: true,
            category: 'electronica',
            fileName: 'seed.csv',
          },
          {
            userId: user.id,
            sku: 'PROD001',
            date: new Date('2024-01-21'),
            quantity: 180,
            price: 29.99,
            promotion: false,
            category: 'electronica',
            fileName: 'seed.csv',
          },
          {
            userId: user.id,
            sku: 'PROD001',
            date: new Date('2024-01-22'),
            quantity: 190,
            price: 29.99,
            promotion: true,
            category: 'electronica',
            fileName: 'seed.csv',
          },
          {
            userId: user.id,
            sku: 'PROD001',
            date: new Date('2024-01-23'),
            quantity: 200,
            price: 29.99,
            promotion: true,
            category: 'electronica',
            fileName: 'seed.csv',
          },
        ],
      });

      console.log(`📊 Sales data seeded for ${user.email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
