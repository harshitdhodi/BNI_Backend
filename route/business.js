const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { createBusiness, getbusiness,businessList,deletebusiness,Totalbusiness ,updateBusinessById, getbusinessByuserId,getbusinessbyId, updateImages,updateContactLinks , updateBusinessDetails } = require('../controller/business'); // Adjust the path as needed
const { uploadPdf } = require('../middeleware/pdf2');
const { generatePdfMiddleware } = require('../middeleware/pdfUpload');
const { requireAuth } = require('../middeleware/requireAuth');
const router = express.Router();
const {bearerAuth} = require('../middeleware/BearerAuth')
const Business = require('../model/business')
// const {base64ImageHandler} = require('../middeleware/pdf2')
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
router.get("/getbusinessByuserId",requireAuth  ,getbusinessByuserId)
// router.put("/updateImg",base64ImageHandler,uploadimages,bearerAuth,updateImages)
router.put("/updateContactLinks",bearerAuth,updateContactLinks)
router.put("/updateBusinessDetails",bearerAuth,updateBusinessDetails)
router.get("/businesssList",bearerAuth,businessList)
router.get("/getbusinessbyId",bearerAuth,getbusinessbyId)
router.put("/updateBusinessById",requireAuth,generatePdfMiddleware,updateBusinessById)
router.get("/getbusinessbymyId",requireAuth,getbusinessbyId)
router.get("/totalbusiness",requireAuth,Totalbusiness)
router.delete("/deletebusiness",requireAuth,deletebusiness)
// Updated route to accept user parameter
router.post('/createProfile', requireAuth, generatePdfMiddleware, async (req, res) => {
    try {
        console.log('Files:', req.files); // Log uploaded files

        const {
            industryName,
            whatsapp,
            facebook,
            linkedin,
            twitter,
            designation,
            aboutCompany,
            companyName,
            companyAddress
        } = req.body;

        // Extract user ID from req.query
        const userId = req.query.user; 

        // Extract filenames without path
        const bannerImg = req.files['bannerImg'] ? path.basename(req.files['bannerImg'][0].path) : null;
        const profileImg = req.files['profileImg'] ? path.basename(req.files['profileImg'][0].path) : null;
        const catalog = req.files['catalog'] ? path.basename(req.files['catalog'][0].path) : null;

        if (!bannerImg || !profileImg) {
            return res.status(400).json({
                message: 'Banner image and profile image are required.',
            });
        }

        const newProfile = new Business({
            bannerImg,
            profileImg,
            industryName,
            whatsapp,
            facebook,
            linkedin,
            twitter,
            designation,
            aboutCompany,
            companyAddress,
            companyName,
            user: new mongoose.Types.ObjectId(userId),// Ensure user ID is cast to ObjectId
            catalog
        });

        const savedProfile = await newProfile.save();

        res.status(201).json({
            message: 'Profile created successfully',
            profile: savedProfile
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while creating the profile',
            error: error.message
        });
    }
});
  
  
module.exports = router;
  