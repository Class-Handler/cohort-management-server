const { Schema, model } = require("mongoose");

const cohortSchema = new Schema(
  {
    teacherName: {
      type: String,
      required: [true, "Name of techer is required."],
      trim: true,
    },

    cohortName: {
        type: String,
        required: [true, "Name of the cohort is required."],
        lowercase: true,
        trim: true,
        // unique: true
    },

    usedPairs: {
        type: [String]
    },

    projects: {
        type: [Schema.Types.ObjectId],
        ref: "Project",
    },

    students: {
        type: [Schema.Types.ObjectId],
        ref: "Student",
        required: [true, "Can't create a cohort without students!"],
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
  },

  {
    timestamps: true,
  }

);

module.exports = model("Cohort", cohortSchema);