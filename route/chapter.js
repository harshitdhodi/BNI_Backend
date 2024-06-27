// routes/countryRoutes.js
const express = require('express');
const router = express.Router();
const { addchapter,
    getchapter,
    getchapterById,
    updatechapterById,
    deletechapterById,TotalChapter,
    } = require('../controller/chapter');

router.post('/addchapter', addchapter);
router.get('/getchapter', getchapter);
router.get('/getchapterById', getchapterById);
router.put('/updatechapter', updatechapterById);
router.delete('/deletechapter', deletechapterById);
router.get('/totalchapter',TotalChapter)

module.exports = router;

