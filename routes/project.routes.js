const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const Cohort = require("../models/Cohort.model");
const Student = require("../models/Student.model");
const Project = require("../models/Project.model");


router.post("/",  async (req, res, next) => {

  try{
       const createProject = await Project.create(req.body)

       if(createProject){

        createProject.partecipants.forEach( async (studentId) =>  {
          const updateStudents = await Student.findByIdAndUpdate({ _id: studentId }, { $push: { projects: createProject._id } })
          return updateStudents
        })
        
        const updateCohort = await Cohort.findByIdAndUpdate({_id: req.body.cohortId}, { $push: { projects: createProject._id } })
        
        res.json(updateCohort)
       }
    }
    catch (err) {
        console.log("error creating new project", err);
        res.status(500).json({
          message: "error creating a new project",
          error: err,
        });
        next(err)
      };
})

router.get("/:projectId", async (req, res, next) => {
  try {
    const getProject = await Project.findById(req.params.projectId).populate({path: 'partecipants'}).populate({path: 'partecipantsPreference'})
    res.json(getProject)
  } catch (err) {
    console.log("error getting project", err);
    res.status(500).json({
      message: "error getting project",
      error: err,
    });
    next(err)
  }
})

router.put(`/:projectId`, async (req, res, next) => {
  console.log(req.body)
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, req.body, {new: true}).populate({path: 'partecipants'})
    res.json(updatedProject)
  } catch (err) {
    console.log("error updating project", err);
    res.status(500).json({
      message: "error getting project",
      error: err,
    });
    next(err)
  }
})

// router.delete(`/:projectId`) --> won't read cohortId from params

module.exports = router;