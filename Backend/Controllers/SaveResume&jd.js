const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const pdf = require("pdf-parse");
const {pool} = require("../config/dbconnect");

const {parseResume} =require("../config/generatescore");
const {getStrength,getSummary,getSkillGap,Suggestions} =require("../config/generatescore");
const verifytoken = require("../Middlewares/VerifyToken");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ dest: "uploads/" });

router.post("/upload",verifytoken, upload.single("resume"), async (req, res) => {


  if(!req.userId){
    return res.status(401).json({ error: "Not authenticated" });
  }

  
  try {
    const { jobDescription } = req.body;


    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }


    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ error: "Job description is required" });
    }


   
    // 1. Extract text from resume
    const pdfData = await pdf(fs.readFileSync(req.file.path));
    const resumeText = pdfData.text;


    // 2. Upload file to cloudinary
 

    // 4. Call parser to get score & feedback
    const score = await parseResume(resumeText, jobDescription);
    const summary=await getSummary(resumeText,jobDescription);
    const suggestions=await Suggestions(resumeText,jobDescription);
    const skill_gap=await getSkillGap(resumeText,jobDescription);
    const strength=await getStrength(resumeText,jobDescription);                                                      
   
     const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "resumes" // Optional: organize uploads in a folder
    });
   

    // 3. Cleanup local file                     
    fs.unlinkSync(req.file.path);

    // 5. Save to database
    const dbResult = await pool.query(
      `INSERT INTO feedback (user_id, resume_url, score, job_description,summary,suggestions,skill_gap,strength)
       VALUES ($1, $2, $3, $4, $5 , $6 , $7 , $8) RETURNING *`,
      [req.userId || 1, result.secure_url, score,  jobDescription,summary,suggestions,skill_gap,strength]
    );


    res.json({
      success: true,
      message:"Success"
    });

  } catch (err) {
   
    
    // Cleanup file if it exists and there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: "Upload failed", 
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;