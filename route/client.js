const express = require('express')
const router = express.Router();

const {addClient} = require('../controller/Client')

router.post('/addClient',addClient)

module.exports = router;