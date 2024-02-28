const express = require("express");
const router = express.Router();
const Cohort = require("../models/Cohort.model");
const User = require("../models/User.model")
const Student = require("../models/Student.model");
const Project = require("../models/Project.model");
const { isOwner } = require("../middleware/isOwner.middleware.js")
const { haveAccess } = require("../middleware/haveAccess.middleware.js")
const cleanStudentsInput = require("../utils/cleanStudentsInput.js")


router.post("/", async (req, res, next) => {

    const userId = req.payload._id 
    const { teacherName, cohortName, studentsNames, emailsAccessTo } = req.body;

    try {
        const createStudentsObj = cleanStudentsInput(studentsNames).sort().map((studentName) => {
          return {studentName}
        })
        const createStudents = await Student.insertMany(createStudentsObj) 
        const students = createStudents.map((student) => student._id)
        const accessTo = await User.find({ email: { $all:  emailsAccessTo}}, {_id: 1} )
        const newCohort = {
            teacherName,
            cohortName,
            students,
            userId,
            accessTo
        };
        const createdCohort = await Cohort.create(newCohort)
        return res.json(createdCohort);
    }
      catch (error) {
        res.status(500).json(error.message);
        next(error)
      };
})

router.get("/", async (req, res, next) => {
    const userId = req.payload._id
  try {
        const getMyCohorts = await Cohort.find({$or: [{userId}, { accessTo: { $all: [userId]}} ]}).sort({ createdAt: -1 })
        const getCohort = await Cohort.find({userId})
        console.log("my ", getMyCohorts)
        console.log("my too", getCohort)
        return res.json(getMyCohorts);
    }
      catch (error) {
        console.log("error getting your cohorts", error);
        res.status(500).json({
          message: "error getting your cohorts",
          error
        });
        next(error)
      };
});

router.get("/:cohortId", haveAccess, async (req, res, next) => {
    const { cohortId } = req.params
  try {
        const getCohort = await Cohort.findById(cohortId).populate('students').populate({path: 'projects',options: { sort: { createdAt: -1 } }}).populate({ path: "userId", select:'email'}).populate({ path: "accessTo", select:'email'})
        return res.json(getCohort);
    }
      catch (error) {
        console.log(`error getting cohort with ID: ${cohortId}`, error);
        res.status(500).json({
          message: `error getting cohort with ID: ${cohortId}`,
          error
        });
        next(error)
      };
});


router.get("/:cohortId/:studentId", haveAccess, async (req, res, next) => {
  try {
     const student = await Student.findById(req.params.studentId).populate({path: "pairedWith", select: "studentName" }).populate({path: "projectsPreferences.projectId"})
     res.json(student);
  } catch (error) {
    console.log(`error getting student with ID: ${req.params.studentId}`, error);
        res.status(500).json({
          message: `error getting student with ID: ${req.params.studentId}`,
          error
        });
        next(error)
  }
})

router.put("/:cohortId/students", haveAccess, async (req, res, next) => {
  console.log(req.body) // --> arr of studentOBJ
try {
  const students = req.body
  students.forEach( async (student) => {
    await Student.findByIdAndUpdate(student._id, {pairedWith: student.pairedWith})
  })
  res.status(200).json({message: "Pairs successfully saved"})
} catch (error) {
  console.log(`error updating students`, error);
        res.status(500).json({
          message: `error saving pairs`,
          error,
        });
        next(error) 
}
})

router.delete("/:cohortId", isOwner, async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const cohort = await Cohort.findById(cohortId);
    cohort.projects.forEach( async (projectId) => {
      await Project.findByIdAndDelete(projectId)
    })
    cohort.students.forEach( async (studentId) => {
      await Student.findByIdAndDelete(studentId)
    })
    const deleteCohort = await Cohort.findByIdAndDelete(cohortId)
    return res.json({ message: `Cohort ${deleteCohort.cohortName} succesfully deleted` });

  } catch (error) {
    console.log("error deleting cohort", error);
    res.status(500).json({
      message: `error deleting cohort: ${cohortId}`,
      error
    });
    next(error)
  }
});

module.exports = router;
