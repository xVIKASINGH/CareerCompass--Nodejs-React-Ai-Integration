const mongoose=require("mongoose");

const dbconnect=async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to db successfully");
    } catch (error) {
        console.log("Failed to connect with DataBase",error);
        process.exit(1); 
    }
}
module.exports=dbconnect;