const {GoogleGenAI} = require("@google/genai")
const {z}= require('zod')
const {zodToJsonSchema}= require("zod-to-json-schema")

const ai= new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY

})

const interviewReportSchema= z.object({
    matchScore: z.number().describe("A score between 0 to 100 indicating how well the candidate's profile matches the job description "),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behaviouralQuestions: z.array(z.object({
        question: z.string().describe("The behavioural question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take.")
    })).describe("Behavioural questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low","medium","high"]).describe("The severity of the skill gap i.e how much it is impprtant from the job description")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan e.g data structures & mock interviews"),
        tasks: z.array(z.string()).describe("List of tasks that can be done in this day to follow the preparation plan e.g study a specific topic of data structures or system design etc")
    })).describe("A day-wise preparation plan for the candidate to follow the order to prepare for the interview effectively")
})

async function generateInterviewReport({resume,selfDescription,jobDescription}){

    const prompt=`Generate an interview report for a candidate with the following details:
                    Resume: ${resume}
                    Self description: ${selfDescription}
                    job Description: ${jobDescription}
                    `

    const response= await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents:prompt,
        config:{
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),

        }
    })

    return JSON.parse(response.text)
}


module.exports= generateInterviewReport
