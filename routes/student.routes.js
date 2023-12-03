const express = require("express");
const router = express.Router();
const Student = require("../models/Student.model");
const Project = require("../models/Project.model");
const validatePartecipant = require("../utils/validatePartecipant");
const validateCode = require("../utils/validateCode");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {

  try {
    const validCode = validateCode(req.query.code)
    if(!validCode){
      res.status(401).json({
        message: "Invalid code",
      });
      return
    }

    const project = await Project.findOne({
      "oneTimeId.uuId": req.query.code,
    }).select('-partecipantsPreference').populate({ path: "partecipants", select:'studentName'})

    // here check if code expire!!! --> project.oneTimeId.expirationDate

  const partecipant = validatePartecipant(project.partecipants, req.query.studentName);
    if(!partecipant){
      res.status(401).json({
        message: "Your name is not in the list of this project partecipants ",
      });
      return
    }
  const student = await Student.findOne({"studentName": req.query.studentName, "projects": project._id}).select("studentName")

  const payload = {
    validateStudent: student,
    project
  }
  const studentToken = jwt.sign(payload, process.env.TOKEN_STUDENT, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  res.status(200).json({ studentToken });

  } catch (err) {
    res.status(500).json({
      message: "error getting related project",
    });
    next(err);
  }
});



module.exports = router;
