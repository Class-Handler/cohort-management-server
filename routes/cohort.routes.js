const express = require("express");
const router = express.Router();
const Cohort = require("../models/Cohort.model");
const Student = require("../models/Student.model");
const Project = require("../models/Project.model");
const { isOwner } = require("../middleware/isOwner.middleware.js")
const cleanStudentsInput = require("../utils/cleanStudentsInput.js")


router.post("/", async (req, res, next) => {

    const userId = req.payload._id 
    const {
      teacherName,
      cohortName,
      studentsNames,
      projectSettings, // {projectType, preferencesNumber, blockedNumber}
    } = req.body;

    try {
        const createStudentsObj = cleanStudentsInput(studentsNames).map((studentName) => {
          return {studentName}
        })
        console.log(createStudentsObj)

        const createStudents = await Student.insertMany(createStudentsObj) 

        const students = createStudents.sort().map((student) => student._id)

        const projects = []

        if (projectSettings) {
          const createProject = await Project.create({ ...projectSettings, partecipants: students });
          projects.push(createProject._id);
          // should also push project._id into each students
        }

        const newCohort = {
            teacherName,
            cohortName,
            students,
            projects,
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
      };
})

router.get("/", async (req, res, next) => {

    const userId = req.payload._id

  try {
        const getMyCohorts = await Cohort.find({userId})
        return res.json(getMyCohorts);
    }
      catch (err) {
        console.log("error getting your cohorts", err);
        res.status(500).json({
          message: "error getting your cohorts",
          error: err,
        });
      };
});

router.get("/:cohortId", isOwner, async (req, res, next) => {

    const { cohortId } = req.params

  try {
        const getCohort = await Cohort.findById(cohortId).populate('students').populate('projects')
        return res.json(getCohort);
    }
      catch (err) {
        console.log(`error getting cohort with ID: ${cohortId}`, err);
        res.status(500).json({
          message: `error getting cohort with ID: ${cohortId}`,
          error: err,
        });
      };
});

router.delete("/:cohortId", isOwner, async (req, res, next) => {
  const { cohortId } = req.params;

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
  }
});

module.exports = router;
