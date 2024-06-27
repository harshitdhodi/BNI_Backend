const express = require('express');
const router = express.Router();

const {myMatches} = require('../controller/myMatch2');
const {requireAuth} = require('../middeleware/requireAuth');
router.get('/myAllMatches',requireAuth,myMatches)

module.exports = router;