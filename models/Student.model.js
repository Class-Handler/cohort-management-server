const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    studentName: {
      type: String,
      required: [true, "Name is required."],
      lowercase: true,
      trim: true,
      // unique: true,
    },

    projects: [{
      projectType: {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },

      preferences: {
        type: [String],
        lowercase: true,
        required: [true, "Preferences are required."],
      },

      blocked: {
        type: [String],
        lowercase: true,
        default: ["NO PREFERENCES"],
      },
    }],

    pairedWith: {
      type: [String],
      lowercase: true,
    },

    neverPairedWith: {
      type: [String],
      lowercase: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = model("Student", studentSchema);
