const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const pdf = require("pdf-parse");
const {pool} = require("../config/dbconnect");

const {parseResume} =require("../config/generatescore");
const verifytoken = require("../Middlewares/VerifyToken");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ dest: "uploads/" });

router.post("/upload",verifytoken, upload.single("resume"), async (req, res) => {
  console.log("Upload route hit!");
  console.log("User ID:", req.userId);
  if(!req.userId){
    return res.status(401).json({ error: "Not authenticated" });
  }
  // Debug logs - corrected
  console.log("File object:", req.file);
  console.log("Job Description:", req.body.jobDescription);
  
  try {
    const { jobDescription } = req.body;


    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }


    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ error: "Job description is required" });
    }


    console.log("File details:", {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // 1. Extract text from resume
    const pdfData = await pdf(fs.readFileSync(req.file.path));
    const resumeText = pdfData.text;
    console.log("Extracted text length:", resumeText.length);

    // 2. Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "resumes" // Optional: organize uploads in a folder
    });
    console.log("Cloudinary upload result:", result.secure_url);

    // 3. Cleanup local file
    fs.unlinkSync(req.file.path);

    // 4. Call parser to get score & feedback
    const response = await parseResume(resumeText, jobDescription);
    console.log("Parser response:", response);

    // 5. Save to database
    const dbResult = await pool.query(
      `INSERT INTO feedback (user_id, resume_url, score, comment, job_description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.userId || 1, result.secure_url, response.score, response.comment, jobDescription]
    );

    console.log("Database insert result:", dbResult.rows[0]);

    res.json({
      success: true,
      url: result.secure_url,
      score: response.score,
      comment: response.comment,
      feedback_id: dbResult.rows[0].id
    });

  } catch (err) {
    console.error("Upload error:", err);
    
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