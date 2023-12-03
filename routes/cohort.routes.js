const express = require("express");
const router = express.Router();
const Cohort = require("../models/Cohort.model");
const Student = require("../models/Student.model");
const Project = require("../models/Project.model");
const { isOwner } = require("../middleware/isOwner.middleware.js")
const cleanStudentsInput = require("../utils/cleanStudentsInput.js")


router.post("/", async (req, res, next) => {

    const userId = req.payload._id 
    const { teacherName, cohortName, studentsNames } = req.body;

    try {
        const createStudentsObj = cleanStudentsInput(studentsNames).map((studentName) => {
          return {studentName}
        })
        console.log('student cleaning',createStudentsObj)

        const createStudents = await Student.insertMany(createStudentsObj) 

        const students = createStudents.sort().map((student) => student._id)

        const newCohort = {
            teacherName,
            cohortName,
            students,
            userId
        };

        const createCohort = await Cohort.create(newCohort)
        
        return res.json(createCohort);
    }
      catch (err) {
        console.log("error creating new cohort", err);
        res.status(500).json({
          message: "error creating a new cohort",
          error: err,
        });
        next(err)
      };
})

router.get("/", async (req, res, next) => {

    const userId = req.payload._id

  try {
        const getMyCohorts = await Cohort.find({ userId }).sort({ createdAt: -1 })
        return res.json(getMyCohorts);
    }
      catch (err) {
        console.log("error getting your cohorts", err);
        res.status(500).json({
          message: "error getting your cohorts",
          error: err,
        });
        next(err)
      };
});

router.get("/:cohortId", isOwner, async (req, res, next) => {

    const { cohortId } = req.params

  try {
        const getCohort = await Cohort.findById(cohortId).populate('students').populate({path: 'projects',options: { sort: { createdAt: -1 } }})
        return res.json(getCohort);
    }
      catch (err) {
        console.log(`error getting cohort with ID: ${cohortId}`, err);
        res.status(500).json({
          message: `error getting cohort with ID: ${cohortId}`,
          error: err,
        });
        next(err)
      };
});

router.delete("/:cohortId", isOwner, async (req, res, next) => {
  const { cohortId } = req.params;
// should also delete all projects and students related
  try {
    const deleteCohort = await Cohort.findByIdAndDelete(cohortId);
    if (deleteCohort) {
      return res.json({ message: `Cohort ${deleteCohort.cohortName} succesfully deleted` });
    }
  } catch (err) {
    console.log("error deleting cohort", err);
    res.status(500).json({
      message: `error deleting cohort: ${cohortId}`,
      error: err,
    });
    next(err)
  }
});

module.exports = router;
