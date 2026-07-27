const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
// const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
}).strict();

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


//     const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}
// `

const prompt = `
You are a Senior Software Engineer and Interviewer at Google.

Your task is to analyze the candidate's Resume, Self Description, and Job Description.

Return ONLY valid JSON.

IMPORTANT RULES:

- Do NOT return Markdown.
- Do NOT return explanations.
- Do NOT return text before or after the JSON.
- Do NOT wrap the response inside \`\`\`.
- Do NOT rename any field.
- Do NOT omit any field.
- Do NOT add extra fields.
- Follow the schema EXACTLY.

The JSON MUST contain these fields IN THIS ORDER:

1. title
2. matchScore
3. technicalQuestions
4. behavioralQuestions
5. skillGaps
6. preparationPlan

For technicalQuestions generate 10 interview questions.

Each question must contain:

{
  "question": "...",
  "intention": "...",
  "answer": "..."
}

For behavioralQuestions generate 8 interview questions.

Each question must contain:

{
  "question": "...",
  "intention": "...",
  "answer": "..."
}

For skillGaps generate at least 3 skills.

Each item must contain:

{
  "skill": "...",
  "severity": "low | medium | high"
}

For preparationPlan generate a detailed 7-day preparation roadmap.

Each day must contain:

{
  "day": 1,
  "focus": "...",
  "tasks": [
    "...",
    "...",
    "..."
  ]
}

The matchScore must be an integer between 0 and 100.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY JSON.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
            temperature:0
        }
    })

      return JSON.parse(response.text)

//console.log(response.text);
}




module.exports =  generateInterviewReport 

