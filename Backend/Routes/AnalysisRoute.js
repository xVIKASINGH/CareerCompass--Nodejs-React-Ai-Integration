
const express = require('express');

const router=express.Router();

const {summaryAnalyze} =require("../Controllers/SectionAnalysis");



router.post("/analyze/:section", summaryAnalyze);

module.exports=router;