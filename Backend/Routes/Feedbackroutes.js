const express = require('express');

const router=express.Router();
const {submitfeedback}=require("../Controllers/Feedback");
// const verifyToken=require("../Middlewares/VerifyToken")
router.post("/feedback",submitfeedback);

module.exports = router;