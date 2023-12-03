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

    pairedWith: {
      type: [String],
      lowercase: true,
    },

    neverPairedWith: {
      type: [String],
      lowercase: true,
    },
     
    projects: [{
      type: Schema.Types.ObjectId,
      ref: "Project",
    }],
  },

  {
    timestamps: true,
  }
);

module.exports = model("Student", studentSchema);
