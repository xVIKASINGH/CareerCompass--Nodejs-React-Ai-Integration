
const User=require("../Models/UserSchema");
const bcrypt = require('bcrypt');

const dbconnect=require("../Helper/dbconnect");
const jwt = require('jsonwebtoken');



exports.register=async(req,res)=>{
     console.log("api hitttt")
    const {username,email,password}=req.body;
   
    if(!username || !email || !password){
        res.send("All fields are required");
    }
    try {
      await  dbconnect();
        const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
      const hash = bcrypt.hashSync(password, 10);
       const newUser=new User({
        username,email,password:hash
       })
      
      await newUser.save();
      return res.status(201).send({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Server error",error);
    }

}

exports.login =async (req, res) => {
    const { email, password } = req.body;
     if(!email || password){
        res.status(400).send("All fields are required");
     }
     try {
       await dbconnect();
         const user = await User.findOne({ email });
         if (!user) {
             return res.status(400).send("Invalid credentials");
         }
         const isMatch = bcrypt.compareSync(password, user.password);
         if (!isMatch) {
             return res.status(400).send("Invalid credentials");
         }
          const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
 expiresIn: '7d',
 });
          res.status(200).json({ token });
     } catch (error) {
        res.status(500).send("Server error");
     }
  

    res.send("Login successful");
}