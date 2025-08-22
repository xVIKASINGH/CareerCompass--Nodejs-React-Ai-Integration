
const pdf = require("pdf-parse");
const {parseResume} =require("../config/generatescore");
exports.summaryAnalyze = async (req, res) => {
    console.log("route hitssss")
  try {
    const { section } = req.params;  // <- comes from URL /analyze/summary

       console.log()
    
    if (!resume || !jobDescription) {
      return res.status(400).json({ error: "Resume and JD required" });
    }
   
    console.log("User:", req.userId);
    console.log("Analyzing section:", section);
     const pdfData = await pdf(fs.readFileSync(req.file.path));
        const resumeText = pdfData.text;

    let response;

    switch (section) {
      case "summary":
         const summary = parseResume(resumeText,jobDescription);
        response = { summary: "This is a short summary of your resume." };
        break;

      case "skillsGap":
        response = { skillsGap: ["React", "Node.js"] };
        break;

      case "suggestions":
        response = { suggestions: ["Add measurable achievements", "Use action verbs"] };
        break;

      case "strengths":
        response = { strengths: ["Strong projects", "Good internships"] };
        break;

      default:
        return res.status(400).json({ error: "Unknown section" });
    }

    res.json({
      success: true,
      section,
      data: response,
    });

  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

