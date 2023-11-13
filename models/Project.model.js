const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    projectType: {
        type: String,
        required: [true, "Type of project is required."],
        enum: ["Project 2", "Final Project", "Mini Project",]
    },

    preferencesNumber: {
        type: Number,
        required: [true, "Number of preferences is required."],
        min: 5,
        max: 9,
    },

    blockedNumber: {
        type: Number,
        default: 3,
        max: 4,
    },

    partecipants: {
        type: [Schema.Types.ObjectId],
        ref: "Student",
    }
  },

  {
    timestamps: true,
  }

);

module.exports = model("Project", projectSchema);