const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Parse Resume Score
async function parseResume(resumeText, jdtext) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Analyze the following resume :
${resumeText}
and job description ${jdtext}
As per JD and resume skills give it a score from 0-100.

Output ONLY valid JSON:
{ "score": <number from 0-100> }

Rules:
- Only a score from 0-100 is acceptable.
- If the JD is not valid or the resume is not relevant, return { "score": 0 }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Parse error (parseResume):", e, text);
    return { score: 0 };
  }
}

// 2. Get Summary
async function getSummary(resumeText, jdtext) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Analyze the resume below against the job description. 
Give a 3-line overall summary in an informal but honest HR tone, highlighting alignment, strengths, and gaps. 
Only provide your opinion, nothing else.
If the resume and JD are completely different, return:
{ "summary": "JD and resume didn't match." }

Output ONLY valid JSON:
{ "summary": "<3 line informal HR style summary>" }

Resume: ${resumeText}
Job Description: ${jdtext}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Parse error (getSummary):", e, text);
    return { summary: "JD and resume didn't match." };
  }
}

// 3. Skill Gap
async function getSkillGap(resumeText, jdtext) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Compare the following resume and job description. 
Return output ONLY in valid JSON with this key:

{ "skill_gap": [ "list of missing skills" ] }

If no skills are missing, return:
{ "skill_gap": [] }

Resume: ${resumeText}
Job Description: ${jdtext}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Parse error (getSkillGap):", e, text);
    return { skill_gap: [] };
  }
}

// 4. Suggestions
async function Suggestions(resumeText, jdtext) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an expert career coach and resume analyst who understands current job market trends and recruiter expectations. 
Your job is to analyze the user’s resume against a given job description (JD) and provide actionable, bullet-pointed suggestions to improve the resume.

Guidelines for Suggestions:

Action Verbs → Check each bullet/line in the resume. If it doesn’t start with a strong action verb (e.g., Developed, Led, Designed, Implemented), suggest rewriting it.

JD Alignment → Identify missing skills, keywords, or technologies from the JD that are not present in the resume. Suggest ways to naturally include them.

ATS Optimization → Ensure the resume wording matches how recruiters/ATS (Applicant Tracking Systems) scan keywords. Suggest replacements if needed.

Quantifiable Impact → Suggest rewriting vague lines into measurable achievements (e.g., “Worked on projects” → “Developed and deployed 3 full-stack projects, improving performance by 20%”).

Grammar & Correctness → Highlight any sentences that are grammatically incorrect or awkwardly phrased, and suggest corrected versions.

Market Trends → Suggest trending skills in today’s job market (e.g., AI tools, cloud platforms, frontend/backend frameworks) that could make the resume stronger.

Conciseness → Point out sections that are wordy and can be shortened without losing impact.

Tone & Clarity → Ensure the language is professional, confident, and free from filler words.

Output Format:
Return ONLY valid JSON grouped under these categories:
{
  "Action Verbs": ["..."],
  "Missing Skills": ["..."],
  "Grammar Fixes": [
    { "original": "❌ ...", "suggestion": "✅ ..." }
  ],
  "ATS Optimization": ["..."],
  "Market Trends": ["..."],
  "Conciseness": ["..."],
  "Tone & Clarity": ["..."]
}

Resume: ${resumeText}
Job Description: ${jdtext}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Parse error (Suggestions):", e, text);
    return {
      "Action Verbs": [],
      "Missing Skills": [],
      "Grammar Fixes": [],
      "ATS Optimization": [],
      "Market Trends": [],
      "Conciseness": [],
      "Tone & Clarity": []
    };
  }
}

// 5. Strengths
async function getStrength(resumeText, jdtext) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Analyze the resume against the job description. 
List 3 key strengths where the resume aligns well with the JD. 
Keep it short, clear, and in an informal HR tone. 

Return ONLY valid JSON:
{ "strength": ["point1", "point2", "point3"] }

Resume: ${resumeText}
Job Description: ${jdtext}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Parse error (getStrength):", e, text);
    return { strength: [] };
  }
}

module.exports = { parseResume, getSkillGap, getSummary, getStrength, Suggestions };
