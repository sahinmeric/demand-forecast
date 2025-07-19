const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users', authMiddleware, getAllUsers);

module.exports = router;
