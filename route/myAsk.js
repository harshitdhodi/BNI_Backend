const express = require('express');
const router = express.Router();

const {addMyAsk,getMyAsks, MyAllAsks,AddGivesByEmail ,getFilteredAsks, TotalMyAsk, deleteMyAskById,updateMyAsk, getMyAskById} = require('../controller/myAsk');
const { requireAuth } = require('../middeleware/requireAuth');

router.post('/addMyAsk',requireAuth,addMyAsk);
router.get('/getMyAsk',requireAuth,getMyAsks);
router.get('/getAllAsks',requireAuth,MyAllAsks);
router.get('/getTotalAsks',requireAuth,TotalMyAsk);
router.put('/updateMyAsk',requireAuth,updateMyAsk);
router.get('/getMyAskById',requireAuth,getMyAskById);
router.delete('/deleteMyAskById',requireAuth,deleteMyAskById);
router.post('/addMyAskByEmail',requireAuth,AddGivesByEmail);
router.get('/getFilteredAsks',requireAuth,getFilteredAsks);
module.exports = router;