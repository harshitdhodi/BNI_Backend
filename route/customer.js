const express = require("express");
const router = express.Router();
const mongoose =require('mongoose');
// import userRegistration  from "../controller/userController.js";
const fs = require('fs');
const path = require('path');

const {
    customerRegistration,
    customerLogin,
    sendcustomerPasswordResetEmail,
    customerPasswordReset,
    logoutcustomer,
    getcustomerById,getAllCustomer,
    TotalCustomer,
    updatecustomerById,
    deletecustomerById
} = require("../controller/customer.js");
 
const { requireAuth } = require("../middeleware/requireAuth.js");

//public Routes
router.post("/register", customerRegistration);
router.post("/login", customerLogin);
router.post("/forgot-password", sendcustomerPasswordResetEmail);
router.post("/reset-password", customerPasswordReset);
router.post("/logout", logoutcustomer);
router.get("/getUserById",requireAuth, getcustomerById);
router.get("/getAllCustomer", getAllCustomer);
router.get("/totalCustomer",TotalCustomer);
router.put("/updatecustomerById",updatecustomerById);
router.delete("/deletecustomerById", deletecustomerById);
// export default router;


// Define route to download all collections



module.exports = router;
