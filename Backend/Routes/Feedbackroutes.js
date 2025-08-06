const express = require('express');

const router=express.Router();
const { submitfeedback } = require('../Controllers/Feedback');


router.post('/feedback',submitfeedback);

module.exports = router;