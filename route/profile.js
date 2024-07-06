const express = require('express');
const router = express.Router();
const { createProfile } = require('../controller/profile');
const { generatePdfMiddleware } = require('../middeleware/pdfUpload');

// POST route to create a new profile
router.post('/createProfile', generatePdfMiddleware, createProfile);

module.exports = router;
