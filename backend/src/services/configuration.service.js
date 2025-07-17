const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserConfig = async (userId) => {
  if (!userId) {
    throw new Error('userId is required');
  }

  return prisma.configuration.findUnique({
    where: {
      userId: userId,
    },
  });
};


const upsertUserConfig = async (userId, configData) => {
  return prisma.configuration.upsert({
    where: { userId },
    update: configData,
    create: { ...configData, userId },
  });
};

module.exports = {
  getUserConfig,
  upsertUserConfig,
};
