const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const forecastController = require('../controllers/forecast.controller');

router.post('/generate', authMiddleware, forecastController.generateForecasts);
router.get('/', authMiddleware, forecastController.getForecasts);
router.get('/:sku', authMiddleware, forecastController.getForecastsBySKU);

module.exports = router;
