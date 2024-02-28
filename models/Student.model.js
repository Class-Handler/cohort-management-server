const { Schema, model } = require("mongoose");

const preferenceSchema = new Schema(
{
    projectId: {
     type: Schema.Types.ObjectId,
     ref: "Project"
   },

    preferences: {
     type: [],
   },

    blocked: {
     type: [],
   },
  }
)

const studentSchema = new Schema(
  {
    studentName: {
      type: String,
      required: [true, "Name is required."],
      lowercase: true,
      trim: true,
      // unique: true,
    },

    pairedWith: {
      type: [Schema.Types.ObjectId],
      ref: "Student"
    },
     
    projectsPreferences: [ preferenceSchema ] ,
  },

  {
    timestamps: true,
  }
);

module.exports = model("Student", studentSchema);
