const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  const user = req.user;
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true },
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: `User ${userId} deleted.` });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

module.exports = { getAllUsers, deleteUser };
