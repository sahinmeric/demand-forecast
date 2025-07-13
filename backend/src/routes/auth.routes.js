const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/register
router.post('/register', authController.register);
// POST /api/auth/login
router.post('/login', authController.login);

const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, (req, res) => {
  const user = req.user;
  res.json({
    message: 'Authenticated user info',
    user: {
      id: user.userId,
      email: user.email,
      role: user.role,
    },
  });
});


module.exports = router;
