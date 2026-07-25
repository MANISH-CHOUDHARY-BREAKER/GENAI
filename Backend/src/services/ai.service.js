const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function invokeGeminiAi() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Hello Gemini! Explain what an interview is.",
    });

    console.log(response.text);
  } catch (err) {
    console.error("Gemini Error:", err);
  }
}

async function generateInterviewReport({resume, selfDescription, jobDescription }) {
  
}
module.exports = invokeGeminiAi;