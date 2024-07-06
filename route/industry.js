const express = require('express');
const router = express.Router();

const {createIndustry , getAllIndustries , getIndustryById ,updateIndustry ,deleteIndustry} = require('../controller/industry')
const { requireAuth } = require('../middeleware/requireAuth');
router.post('/addIndustry',requireAuth,createIndustry);
router.get('/getAllIndustry' , getAllIndustries);
router.get('/getIndustryById' , getIndustryById);
router.put('/updateIndustry', updateIndustry);
router.delete('/deleteIndustry', deleteIndustry);

module.exports = router;
