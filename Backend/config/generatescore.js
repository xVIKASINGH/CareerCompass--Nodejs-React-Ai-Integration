const { GoogleGenerativeAI } =require( "@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function parseResume(resumeText,jdtext) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `
    Analyze the following resume :
    ${resumeText}
    and job description ${jdtext}
    as per jd and resume skills give it a score from 0-100 .
    Only a score from 0-100 is acceptable.
    Don't answer anything else.
    if the jd is not valid or the resume is not relevant, return a score of 0
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}


module.exports ={parseResume};