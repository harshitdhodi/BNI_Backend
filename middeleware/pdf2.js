const express = require('express');
const multer = require('multer');
const path = require('path');
// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`); // Create a unique filename
    }
  });
  
  // Set up file filter to accept only PDF files
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  };
  
  // Initialize multer with storage engine and file filter
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    }
  });

  const uploadPdf = upload.single('catalog'); 
  module.exports = {uploadPdf}