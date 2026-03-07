const express= require('express')
const authMiddleware= require('../middlewares/auth.middleware')
const interviewController= require("../controllers/interview.controller")
const upload= require("../middlewares/file.middleware")


const interviewRouter= express.Router()

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description resume and job description
 * @access private
 */
interviewRouter.post("/",authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by InterviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description Get all interview reports of LoggedIn user
 * @access private
 */
interviewRouter.get("/",authMiddleware.authUser,interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @description Generate resume (pdf) on the basis of user self description, job description & resume.
 * @access private
 */
interviewRouter.get("/resume/pdf/:interviewReportId",authMiddleware.authUser,interviewController.generateResumePdfController)


module.exports= interviewRouter