const mongoose = require('mongoose');

const UserSchema=new mongoose.Schema({
    username:{
        type:"String",
        required:true,
        unique:true,
        trim:true,
        minlength:3,
        maxlength:20,

    }
    ,
    email:{
        type:"String",
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:"String",
        required:true,
        minlength:6,
        maxlength:1024,
    }
})

const User=mongoose.model("User",UserSchema);

module.exports = User;