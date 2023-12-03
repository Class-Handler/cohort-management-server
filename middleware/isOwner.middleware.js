const mongoose = require("mongoose");
const Cohort = require("../models/Cohort.model");

const isOwner = async (req, res, next) => {
  try {
    const { cohortId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cohortId)) {
      res.status(400).json({ message: "Specified cohort id is not valid" });
      return;
    }

    const cohortFound = await Cohort.findById(cohortId);

    if (req.payload && req.payload._id == cohortFound.userId) {
      return next();
    } else {
      res.status(400).json({ message: "Not authorized to manage this cohort" });
    }
  } catch (err) {
    res.status(500).json({
      message: `error getting cohort in isOwner middleware`,
      error: err,
    });
  }
};

module.exports = { isOwner };
