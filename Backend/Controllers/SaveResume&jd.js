const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const pdf = require("pdf-parse");
const pool = require("../config/dbconnect"); 
const resumeParse=require("../Controllers/CheckScore");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("resume"), async (req, res) => {
    console.log("upload routes hittttttt")
  try {
    const { jd } = req.body; 

    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    // 1. Extract text from resume
    const pdfData = await pdf(fs.readFileSync(req.file.path));
    const resumeText = pdfData.text;

    // 2. Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto"
    });

    // cleanup local file
    fs.unlinkSync(req.file.path);

    // 3. Call parser to get score & feedback
    const response = await resumeParse(resumeText, jd); 



    await pool.query(
      `INSERT INTO feedback (user_id, resume_url, score, comment, job_description)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.userId, result.secure_url, response,null, jd]
    );

    res.json({
      success: true,
      url: result.secure_url,
      score: response.score,
      comment: response.comment
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
