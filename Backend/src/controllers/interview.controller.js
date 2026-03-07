const pdfParse= require('pdf-parse')
const {generateInterviewReport, generateResumePdf}= require('../services/ai.service')
const interviewReportModel= require('../models/intervierReport.model')



// function to generate interview report

async function generateInterViewReportController(req,res){
    //converting pdf to textual data
    const resumeContent= await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    
    const {selfDescription, jobDescription}= req.body

    const interviewReportByAI= await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport= await interviewReportModel.create({
        user:req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAI
    })

res.status(201).json({
    message:"Interview report generated sucessfully",
    interviewReport
})
}


//controller to get interview report by interviewId.

async function getInterviewReportByIdController(req,res){
    const {interviewId} = req.params;
    const interviewReport= await interviewReportModel.findOne({_id: interviewId, user: req.user.id});

    if(!interviewReport){
        return res.status(400).json({
            message: "Interview Report Not found."
        })
    }
    return res.status(200).json({
        message: "Interview Report fetched sucessfully",
        interviewReport
    })
}

//controller to getAll interviewReport of Logged in user

async function getAllInterviewReportsController(req,res){
    const interviewReports= await interviewReportModel.find({user:req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -__v -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    if(!interviewReports){
        return req.status(400).json({
            message:"No report found."
        })
    }
    return req.status(200).json({
        message:"Interview Reports fetched sucessfully.",
        interviewReports
    })
}


// controller to generate resume PDF based on the user self description, resume and job description.

async function generateResumePdfController(req,res){
    const {interviewReportId}= req.params
    const interviewReport= await interviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(400).json({
            message:"Interview report not found"
        })
    }

    const {resume, jobDescription, selfDescription}= interviewReport

    const pdfBuffer= await generateResumePdf({resume, jobDescription, selfDescription})
    res.set({
        "Content-Type" :"application/pdf",
        "Content-Disposition": `attachment; filename= requme_${req.user.username}_${interviewReportId}.pdf`
    })
    res.send(pdfBuffer)
}



module.exports= {generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}