const express = require("express");
const cors = require("cors");
const pdf=require("pdf-parse")
const cookieParser = require("cookie-parser");
require("dotenv").config();
const fs=require("fs")
const app = express();
const resumeRoutes=require("./Controllers/SaveResume&jd")
const verifytoken=require("./Middlewares/VerifyToken")
const analysis=require("./Routes/AnalysisRoute");
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
const userrouter = require("./Routes/userrouter");
const submitfeedback=require("./Routes/Feedbackroutes");
app.use("/api", userrouter);
app.use("/api", submitfeedback);
app.use("/api", resumeRoutes);
app.use("/api",analysis);
app.use("/api", require("./Routes/checkScore"));
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});





