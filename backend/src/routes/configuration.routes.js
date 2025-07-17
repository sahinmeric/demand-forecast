const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configuration.controller');
const authMiddleware = require('../middleware/authMiddleware');

// GET current user's configuration
router.get('/', authMiddleware, configurationController.getUserConfiguration);

// POST or PUT to create/update configuration
router.post('/', authMiddleware, configurationController.upsertUserConfiguration);

module.exports = router;
