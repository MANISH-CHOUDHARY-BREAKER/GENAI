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
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
            temperature:0
        }
    })

console.log("========== RAW RESPONSE ==========");
console.log(response.text);
console.log("==================================");

}



module.exports =  generateInterviewReport 


// const { GoogleGenAI } = require("@google/genai");
// const { z } = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_GENAI_API_KEY,
// });

// const interviewReportSchema = z.object({
//   title: z.string(),

//   matchScore: z.number().min(0).max(100),

//   strengths: z.array(z.string()).min(3),

//   weaknesses: z.array(z.string()).min(2),

//   technicalQuestions: z.array(
//     z.object({
//       question: z.string(),
//       intention: z.string(),
//       answer: z.string(),
//     })
//   ).min(8),

//   behavioralQuestions: z.array(
//     z.object({
//       question: z.string(),
//       intention: z.string(),
//       answer: z.string(),
//     })
//   ).min(5),

//   codingQuestions: z.array(
//     z.object({
//       topic: z.string(),
//       difficulty: z.enum(["Easy", "Medium", "Hard"]),
//       question: z.string(),
//       expectedApproach: z.string(),
//     })
//   ).min(5),

//   projectQuestions: z.array(
//     z.object({
//       project: z.string(),
//       question: z.string(),
//       answer: z.string(),
//     })
//   ).min(3),

//   skillGaps: z.array(
//     z.object({
//       skill: z.string(),
//       severity: z.enum(["low", "medium", "high"]),
//       recommendation: z.string(),
//     })
//   ).min(3),

//   preparationPlan: z.array(
//     z.object({
//       day: z.number(),
//       focus: z.string(),
//       tasks: z.array(z.string()).min(2),
//     })
//   ).min(7),

//   finalVerdict: z.object({
//     recommendation: z.string(),
//     confidence: z.number().min(0).max(100),
//     summary: z.string(),
//   }),
// }).strict();

// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   const prompt = `
// You are a Senior Software Engineering Interviewer at Google.

// Analyze the candidate.

// Return ONLY ONE valid JSON object.

// Do NOT return markdown.

// Do NOT wrap inside \`\`\`.

// Do NOT explain anything.

// Do NOT rename fields.

// Do NOT add extra fields.

// Do NOT remove any fields.

// Every field is required.

// The JSON MUST exactly match this structure:

// {
// "title":string,
// "matchScore":number,
// "strengths":[string],
// "weaknesses":[string],

// "technicalQuestions":[
// {
// "question":string,
// "intention":string,
// "answer":string
// }
// ],

// "behavioralQuestions":[
// {
// "question":string,
// "intention":string,
// "answer":string
// }
// ],

// "codingQuestions":[
// {
// "topic":string,
// "difficulty":"Easy|Medium|Hard",
// "question":string,
// "expectedApproach":string
// }
// ],

// "projectQuestions":[
// {
// "project":string,
// "question":string,
// "answer":string
// }
// ],

// "skillGaps":[
// {
// "skill":string,
// "severity":"low|medium|high",
// "recommendation":string
// }
// ],

// "preparationPlan":[
// {
// "day":number,
// "focus":string,
// "tasks":[string]
// }
// ],

// "finalVerdict":{
// "recommendation":string,
// "confidence":number,
// "summary":string
// }
// }

// Resume:
// ${resume}

// Self Description:
// ${selfDescription}

// Job Description:
// ${jobDescription}
// `;

//   let attempts = 3;

//   while (attempts > 0) {
//     try {
//       const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//           responseMimeType: "application/json",
//           responseSchema: zodToJsonSchema(interviewReportSchema),
//           temperature: 0,
//         },
//       });

//       console.log("\n========== RAW RESPONSE ==========\n");
//       console.log(response.text);
//       console.log("\n==================================\n");

//       const json = JSON.parse(response.text);

//       const validation = interviewReportSchema.safeParse(json);

//       if (!validation.success) {
//         console.log("\n❌ Validation Failed\n");
//         console.dir(validation.error.format(), { depth: null });

//         attempts--;

//         if (attempts === 0) {
//           throw new Error("Gemini returned invalid JSON after 3 attempts.");
//         }

//         console.log(`Retrying... (${attempts} attempts left)\n`);
//         continue;
//       }

//       console.log("\n✅ JSON Validated Successfully\n");

//       console.log(JSON.stringify(validation.data, null, 2));

//       return validation.data;
//     } catch (err) {
//       attempts--;

//       if (attempts === 0) {
//         console.error("\n❌ Failed to Generate Report\n");
//         throw err;
//       }

//       console.log(`Retrying... (${attempts} attempts left)\n`);
//     }
//   }
// }

// module.exports = {
//   generateInterviewReport,
// };
