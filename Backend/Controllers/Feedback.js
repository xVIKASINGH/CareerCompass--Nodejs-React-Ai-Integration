const dbconnect = require("../Helper/dbconnect")

const Feedback=require("../Models/FeedBackSchema");


exports.submitfeedback=async(req,res)=>{
    console.log("Feedback API hit");
    const {userid,score,review}=req.body;
    if(!userid || !score || !review){
        return res.status(400).send("All fields are required");
    }
    try {
        await dbconnect();
        const feedback=new Feedback({
            userid,
            score,
            review
        })
        await feedback.save();
        return res.status(201).send("feedback submitted successfully");
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return res.status(500).send("Server error");
    }
}

