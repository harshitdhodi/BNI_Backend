const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Addcompany , getAllCompany,getNonExistingCompanyNames, getFilteredCompanyNames , getCompanyById ,updateCompanyById ,deleteCompany} = require("../controller/company");
const { generatePdfMiddleware } = require('../middeleware/pdfUpload');
const { requireAuth } = require('../middeleware/requireAuth');

router.post('/createCompany', generatePdfMiddleware, requireAuth, Addcompany);
router.get("/getAllCompany" ,requireAuth,getAllCompany )
router.get("/getCompanyById" ,requireAuth,getCompanyById )
router.put("/updateCompanyById" ,requireAuth,updateCompanyById )
router.delete("/deleteCompany" ,requireAuth,deleteCompany )
router.get("/getNonExistingCompanyNames" ,requireAuth,getNonExistingCompanyNames )
router.get("/getFilteredCompanyNames" ,requireAuth,getFilteredCompanyNames )
module.exports = router;
