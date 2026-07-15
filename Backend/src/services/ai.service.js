const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({

  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question can be asked in the interview"),
      intention: z.string().describe("The intention of imterview behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })
  ).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("The behavioral question can be asked in the interview"),  
    intention: z.string().describe("The intention of imterview behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })
  ).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill that the candidate is lacking"),
      severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap"),
    })
  ).describe("Skill gaps that the candidate has along with their severity"),

  preparationPlan: z.array(
    z.object({
      day: z.string().describe("The day of the preparation plan"),
      task: z.string().describe("The task to be done on that day"),
      focus: z.string().describe("The focus of the task to be done on that day"),
    })
  ).describe("Preparation plan for the candidate to improve their skills and prepare for the interview"),
});


async  function generateInterviewReport({ resume, selfDescription, jobDescription }) {


       const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.agents.generate({
        model: "gemini-2.5-pro",
        contents:prompt,
        config: {
          responseMineType:"application/json",
          responseJsonSchema: zodToJsonSchema(interviewReportSchema)
        }
})

    console.log(JSON.parse(response.text));
}


module.exports = { invokeGeminiAi, generateInterviewReport};