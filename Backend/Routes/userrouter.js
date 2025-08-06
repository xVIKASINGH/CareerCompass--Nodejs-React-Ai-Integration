const express=require("express");

const router=express.Router();
const { register, login } = require('../Controllers/Authentication');

router.get("/",(req,res)=>{
    res.send("<h1>Welcome to the User Dashboard</h1>");
})

router.post("/register",register);
router.post("/login",login);

module.exports = router;