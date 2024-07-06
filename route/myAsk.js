const express = require('express');
const router = express.Router();

const {addMyAsk,getMyAsks, MyAllAsks , TotalMyAsk} = require('../controller/myAsk');
const { requireAuth } = require('../middeleware/requireAuth');

router.post('/addMyAsk',requireAuth,addMyAsk);
router.get('/getMyAsk',requireAuth,getMyAsks);
router.get('/getAllAsks',requireAuth,MyAllAsks);
router.get('/getTotalAsks',requireAuth,TotalMyAsk);
module.exports = router;