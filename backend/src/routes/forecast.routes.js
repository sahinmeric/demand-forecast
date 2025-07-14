const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const forecastController = require('../controllers/forecast.controller');

router.post('/generate', authMiddleware, forecastController.generateForecasts);

module.exports = router;
