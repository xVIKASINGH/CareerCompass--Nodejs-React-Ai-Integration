const express=require("express");

const app=express();
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.use(express.json());

const userRouter=require("./Routes/userrouter");


app.use("/api",userRouter);


app.get("/",(req,res)=>{
    res.send(`<h1>Welcome to the Backend Server</h1>`);
})
app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})


