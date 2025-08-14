const express = require('express');

const router=express.Router();

const {checkscore}=require("../Controllers/CheckScore");


router.post("/checkscore",checkscore);

module.exports = router;