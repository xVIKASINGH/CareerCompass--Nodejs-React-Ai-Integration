import mongoose from "mongoose";

const FeedbackSchema=new mongoose.Schema({
    userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,

    },
    score:{
        type:"Number",
        min:1,
        max:100,
        required:true,
    },
    review:{
        type:"String",
        required:true,
        trim:true,
        minlength:10,
        maxlength:500,

    }
})

const Feedback=new mongoose.model("Feedback",FeedbackSchema);

export default Feedback;