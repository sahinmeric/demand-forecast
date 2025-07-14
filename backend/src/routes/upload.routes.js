const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/upload', upload.single('file'), uploadController.uploadFile);
router.post('/save', authMiddleware, uploadController.saveData);
router.get('/sales-data', authMiddleware, uploadController.getSalesData);

module.exports = router;
