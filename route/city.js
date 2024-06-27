// routes/countryRoutes.js
const express = require('express');
const router = express.Router();
const {addCity,
    getCity,
    getCityById,
    updateCityById,
    deleteCityById,TotalCity} = require('../controller/city');
const { route } = require('./chapter');

router.post('/addCity', addCity);
router.get('/getCity', getCity);
router.get('/getCityById', getCityById);
router.put('/updateCity', updateCityById);
router.delete('/deleteCity', deleteCityById);
router.get('/totalCity',TotalCity)
module.exports = router;
