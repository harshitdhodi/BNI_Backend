const express = require("express");
const router = express.Router();
const mongoose =require('mongoose');
// import userRegistration  from "../controller/userController.js";
const fs = require('fs');
const path = require('path');

const {
    memberRegistration,
    memberLogin,
    sendmemberPasswordResetEmail,
    memberPasswordReset,
    logoutmember,
    getmemberById,getAllmember,
    Totalmember,
    updatememberById,
    deletememberById
} = require("../controller/member.js");
 
const { requireAuth } = require("../middeleware/requireAuth.js");

//public Routes
router.post("/register", memberRegistration);
router.post("/login", memberLogin);
router.post("/forgot-password", sendmemberPasswordResetEmail);
router.post("/reset-password", memberPasswordReset);
router.post("/logout", logoutmember);
router.get("/getUserById", getmemberById);
router.get("/getAllmember", getAllmember);
router.get("/totalmember",Totalmember);
router.put("/updatememberById",requireAuth,updatememberById);
router.delete("/deletememberById",requireAuth, deletememberById);
// export default router;


// Define route to download all collections



module.exports = router;
