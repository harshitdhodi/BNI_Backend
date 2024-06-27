const express = require('express');
const router = express.Router();

const {addMyGives,getMyGivesByUserId,getMyGivesByCompanyAndDepartment} = require('../controller/myGives');
const { requireAuth } = require('../middeleware/requireAuth');
const {getMyGivesBasedOnMyAsks} = require('../controller/myMatch')
router.post('/addMyGives',requireAuth,addMyGives);
router.get('/getMyGives',requireAuth,getMyGivesByUserId);
router.get('/getMyMatches',requireAuth,getMyGivesByCompanyAndDepartment);
router.get('/getAllMyMatchs',requireAuth,getMyGivesBasedOnMyAsks);
router.get('/getMyGivesBasedOnMyAsks',getMyGivesBasedOnMyAsks)
module.exports = router;