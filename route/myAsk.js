const express = require('express');
const router = express.Router();

const {addMyAsk,getMyAsks} = require('../controller/myAsk');
const { requireAuth } = require('../middeleware/requireAuth');

router.post('/addMyAsk',requireAuth,addMyAsk);
router.get('/getMyAsk',requireAuth,getMyAsks);
module.exports = router;