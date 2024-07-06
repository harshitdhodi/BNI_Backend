const express = require('express');
const multer = require('multer');
const path = require('path');
const { createBusiness, getbusiness , getbusinessById, updateImages,updateContactLinks , updateBusinessDetails } = require('../controller/business'); // Adjust the path as needed
const { uploadPdf } = require('../middeleware/pdf2');
const { generatePdfMiddleware } = require('../middeleware/pdfUpload');
const { requireAuth } = require('../middeleware/requireAuth');
const router = express.Router();
const {bearerAuth} = require('../middeleware/BearerAuth')
// Set up storage engine for multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// Route to create business profile
router.post('/create',generatePdfMiddleware, requireAuth,createBusiness);

router.get("/getbusiness",getbusiness)
router.get("/getbusinessById",requireAuth  ,getbusinessById)
router.put("/updateImg",generatePdfMiddleware,bearerAuth,updateImages)
router.put("/updateContactLinks",bearerAuth,updateContactLinks)
router.put("/updateBusinessDetails",bearerAuth,updateBusinessDetails)
module.exports = router;
