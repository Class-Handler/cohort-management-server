const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    projectType: {
      type: String,
      required: [true, "Type of project is required."],
      enum: [
        "Project 2",
        "Final Project",
        "Mini Project Mod 1",
        "Mini Project Mod 2",
        "Mini Project Mod 3",
      ],
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

    oneTimeId: {
      uuId: {
        type: String,
      },
      expirationDate: {
        type: Date,
      },
    },

    partecipants: {
      type: [Schema.Types.ObjectId],
      ref: "Student",
    },

    partecipantsPreference: {
      type: [Schema.Types.ObjectId],
      ref: "Student",
    }
  },

  {
    timestamps: true,
  }
);

module.exports = model("Project", projectSchema);
