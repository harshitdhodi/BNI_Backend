const express = require('express');
const router = express.Router();

const {myMatches ,myMatchesByCompanyName , getTotalMatches} = require('../controller/myMatch2');
const {requireAuth} = require('../middeleware/requireAuth');
const {bearerAuth} = require('../middeleware/BearerAuth')
router.get('/myAllMatches',requireAuth,myMatches)
router.get('/bearerAuth',bearerAuth,myMatches)
router.get('/myMatchesByCompanyAndDept',requireAuth,myMatchesByCompanyName)
router.get('/getTotalMatches',requireAuth,getTotalMatches)
module.exports = router;