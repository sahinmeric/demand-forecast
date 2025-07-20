const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/users', authMiddleware, getAllUsers);
router.delete('/users/:id', authMiddleware, isAdmin, deleteUser);

module.exports = router;
