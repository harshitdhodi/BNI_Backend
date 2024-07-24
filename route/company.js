const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Addcompany,getFilteredGives ,TotalCompany, getAllCompany,getNonExistingCompanyNames, getFilteredCompanyNames , getCompanyById ,updateCompanyById ,deleteCompany} = require("../controller/company");
const { generatePdfMiddleware } = require('../middeleware/pdfUpload');
const { requireAuth } = require('../middeleware/requireAuth');

router.post('/createCompany',requireAuth ,generatePdfMiddleware, Addcompany);
router.get("/getAllCompany" ,requireAuth,getAllCompany )
router.get("/getCompanyById" ,requireAuth,getCompanyById )
router.put("/updateCompanyById" ,requireAuth,generatePdfMiddleware,updateCompanyById )
router.delete("/deleteCompany" ,requireAuth,deleteCompany )
router.get("/getNonExistingCompanyNames" ,requireAuth,getNonExistingCompanyNames )
router.get("/getFilteredCompanyNames" ,requireAuth,getFilteredCompanyNames )
router.get("/getFilteredGives" ,requireAuth,getFilteredGives )
router.get("/totalCompany" ,requireAuth,TotalCompany )
module.exports = router;
