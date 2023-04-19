const express = require("express");
const router = express.Router();
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDate,
  getAppointmentsByLocation,
  getAppointmentsByNutritionist,
  getAppointmentsByClient,
  getAppointmentsByStatus,
  acceptOrDeclineAppointment,
  getAppointmentsByNutritionistCalendar
} = require("../services/appointmentS");

// Get appointment by date
router.get("/date", getAppointmentsByDate);

// Get appointment by nutritionist
router.get("/nutritionist", getAppointmentsByNutritionist);
router.get("/nutritionistCalendar", getAppointmentsByNutritionistCalendar);
// Get appointment by client
router.get("/client", getAppointmentsByClient);

// Get appointment by location
router.get("/location", getAppointmentsByLocation);

// Get appointment by status
router.get("/status", getAppointmentsByStatus);

// Get all appointments
router.get("/", getAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

// Create appointment
router.post("/", createAppointment);

// Update appointment
router.put("/:id", updateAppointment);

// Delete appointment
router.delete("/:id", deleteAppointment);

// Accept appointment
router.put("/acceptOrDecline/:appointmentId", acceptOrDeclineAppointment);

module.exports = router;
