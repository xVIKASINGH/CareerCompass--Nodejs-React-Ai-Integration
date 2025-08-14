const { GoogleGenerativeAI } =require( "@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function parseResume(resumeText,jdtext) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `
    Extract key information from this resume and return JSON with:
    name, skills[], experience[], education[].
    Resume:
    ${resumeText}
    and job description ${jdtext};
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}


module.exports =parseResume;