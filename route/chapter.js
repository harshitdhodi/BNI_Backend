// routes/countryRoutes.js
const express = require('express');
const router = express.Router();
const { addchapter,
    getchapter,
    getchapterById,
    updatechapterById,
    deletechapterById,TotalChapter,
    getChapterByCity
    } = require('../controller/chapter');

router.post('/addchapter', addchapter);
router.get('/getchapter', getchapter);
router.get('/getchapterById', getchapterById);
router.put('/updatechapter', updatechapterById);
router.delete('/deletechapter', deletechapterById);
router.get('/totalchapter',TotalChapter)
router.get('/getChapterByCity',getChapterByCity)
module.exports = router;

