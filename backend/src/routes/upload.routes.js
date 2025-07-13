const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/upload', upload.single('file'), uploadController.uploadFile);

module.exports = router;
