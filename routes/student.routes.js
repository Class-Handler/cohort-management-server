const express = require("express");
const router = express.Router();
const Student = require("../models/Student.model");
const Project = require("../models/Project.model");
const validatePartecipant = require("../utils/validatePartecipant");
const validateCode = require("../utils/validateCode");
const isExpired = require("../utils/isExpired")
const jwt = require("jsonwebtoken");
const { isAuthenticatedStudent } = require("../middleware/jwt.student.middleware.js");


router.post("/validation", async (req, res, next) => {

  try {
    const validCode = validateCode(req.body.code)

    if(!validCode){
      res.status(401).json({
        message: "Invalid code",
      });
      return
    }

    const project = await Project.findOne({"oneTimeId.uuId": req.body.code})
    .select('-partecipantsPreference').populate({ path: "partecipants", select:'studentName'})

    // check if code expire
    if(!isExpired(project.oneTimeId.expirationDate)){
      res.status(401).json({
        message: "Deadline expired. It's no longer possible to submit preferences for this project.",
      });
      return
    }

  const partecipant =  await validatePartecipant(project.partecipants, req.body.studentName);

    if(!partecipant.length){
      res.status(401).json({
        message: "Your name is not in the list of this project's partecipants ",
      });
      return
    }

    if(partecipant.length > 1){
      res.status(401).json({
        message: "Add your initials",
      });
      return
    }

  const student = await Student.findById(partecipant[0]._id).select("-pairedWith")

  const payload = {
    validateStudent: student,
    project
  }

  const studentToken = jwt.sign(payload, process.env.TOKEN_STUDENT, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  res.status(200).json( studentToken );

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "error getting related project",
    });
    next(err);
  }
});

router.put(`/:studentId`, isAuthenticatedStudent, async (req, res, next) => {

try {

  const student = await Student.findById(req.params.studentId)

  const resetPreferences = student.projectsPreferences.filter((el) => {
    return el.projectId.toString() !== req.body.projectId
  })

  await Student.findByIdAndUpdate(req.params.studentId, {projectsPreferences: [...resetPreferences, req.body]}, {new: true})
  await Project.findByIdAndUpdate(req.body.projectId, {$addToSet: {partecipantsPreference: req.params.studentId}}, {new: true})

  res.status(200).json({
    message: "Your preferences has been successfully saved",
  });

}  catch (err) {
  console.log(err)
  res.status(500).json({
    message: "error submitting preferences",
  });
  next(err);
}
})

router.get("/verifyStudent", isAuthenticatedStudent, (req, res, next) => {
  res.status(200).json(req.payload);
})


module.exports = router;
