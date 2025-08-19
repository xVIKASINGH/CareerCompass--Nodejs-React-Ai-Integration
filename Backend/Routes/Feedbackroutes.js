const express = require('express');

const router=express.Router();
const {fetchfeedback}=require("../Controllers/Feedback");
const verifyToken=require("../Middlewares/VerifyToken")
router.get("/feedback",verifyToken,fetchfeedback);


module.exports = router;