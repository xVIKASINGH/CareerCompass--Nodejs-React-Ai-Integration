const multer = require("multer");
const upload = multer(); 
const pdf = require("pdf-parse");
const {parseResume} =require("../config/generatescore");

exports.checkscore = [
  upload.single("resume"),
  async (req, res) => {
    try {
  
      const jobDescription = req.body.jobDescription;
      const resumeFile = req.file; 

      if (!resumeFile || !jobDescription) {
        return res
          .status(400)
          .json({ error: "Both resumeFile and jobDescription are required." });
      }

 
      const pdfData = await pdf(resumeFile.buffer);


      const response = await parseResume(pdfData.text, jobDescription);


      return res.status(200).json({ success: true, data: response });
    } catch (error) {
  
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
