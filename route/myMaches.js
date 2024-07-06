const express = require('express');
const router = express.Router();

const {myMatches} = require('../controller/myMatch2');
const {requireAuth} = require('../middeleware/requireAuth');
const {bearerAuth} = require('../middeleware/BearerAuth')
router.get('/myAllMatches',requireAuth,myMatches)
router.get('/bearerAuth',bearerAuth,myMatches)
module.exports = router;