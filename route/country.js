const express = require('express');
const router = express.Router();
const {createCountry,getCountries,fetachAllCountries,getCountryById,updateCountry, deleteCountry,TotalCountry} = require('../controller/country');
const {uploadPhoto} = require('../middeleware/imageUpload');
// Routes for CRUD operations
router.post('/addCountry',uploadPhoto, createCountry);
router.get('/getCountry', getCountries);
router.get('/getCountryById', getCountryById);
router.put('/updateCountryById',uploadPhoto, updateCountry);
router.delete('/deleteCountry', deleteCountry);
router.get('/totalCountry',TotalCountry)
router.get('/AllCountries',fetachAllCountries)
module.exports = router;
