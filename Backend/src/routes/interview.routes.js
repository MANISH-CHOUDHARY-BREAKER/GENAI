const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")
const interviewRouter = express.Router()


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description , resume pdf and job description.
 * @access private
 */

console.log("authUser:", authMiddleware.authUser);
console.log("upload:", upload);
console.log("controller:", interviewController.generateInterViewReportController);
interviewRouter.post("/", authMiddleware,upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report on the basis of interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware, interviewController.getInterViewReportController)
 


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware, interviewController.getAllInterViewReportsController)
 
module.exports = interviewRouter;