const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
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
  dateApt: {
    type: Date,
    required: true,
  },
  timeApt: {
    type: String,
    required: true,
  },
  locationApt: {
    type: String,
  },
  reasonApt: {
    type: String,
    required: true,
  },
  statusApt: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
    required: true,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
