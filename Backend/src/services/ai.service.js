const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function invokeGeminiAi() {
  const models = await ai.models.list();

  for await (const model of models) {
    console.log(model.name);
  }
}

invokeGeminiAi();

module.exports = { invokeGeminiAi };