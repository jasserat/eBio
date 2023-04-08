const mongoose = require("mongoose");

const privateMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // to check if the nutritionist is available to receive private messages or not
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "unavailable",
    },
  },
  { timestamps: true }
);

const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);

module.exports = PrivateMessage;
