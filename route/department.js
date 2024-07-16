const express = require('express');
const router = express.Router();
const { addDepartment,
    getDepartment,
    getDepartmentById,
    updateDepartmentById,
    deleteDepartmentById,TotalDepartment ,getAllDepartment} = require('../controller/Department');
const {uploadPhoto} = require('../middeleware/imageUpload');
// Routes for CRUD operations
router.post('/addDepartment',addDepartment);
router.get('/getDepartment', getDepartment);
router.get('/getDepartmentById', getDepartmentById);
router.put('/updateDepartmentById', updateDepartmentById);
router.delete('/deleteDepartmentById', deleteDepartmentById);
router.get('/totalDepartment',TotalDepartment)
router.get('/getAllDepartment',getAllDepartment)
module.exports = router;
