const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    nutritionist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "answered"],
      default: "pending",
    },
  },
  { timestamps: true } //automatically generate createdAt and updatedAt fields
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
