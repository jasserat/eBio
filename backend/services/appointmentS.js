const Appointment = require("../models/appointment");

// Get all appointments
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

// Create appointment
exports.createAppointment = async (req, res, next) => {
  try {
    console.log(req.body);
   // console.log(new Date(Date.UTC(req.body.dateApt)));

    const appointment = new Appointment({
      dateApt: req.body.dateApt,
      timeApt: req.body.timeApt,
      locationApt: req.body.locationApt,
      reasonApt: req.body.reasonApt,
      client: req.body.user,
      nutritionist: req.body.nutritionist,
      statusApt: req.body.statusApt
    });
    const savedAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
    .populate("nutritionist")
    .populate("client");
    res.status(201).json(populatedAppointment);
  } catch (error) {
    next(error);
  }
};

// Update appointment
exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.dateApt = req.body.dateApt;
    appointment.timeApt = req.body.timeApt;
    appointment.locationApt = req.body.locationApt;
    appointment.reasonApt = req.body.reasonApt;
    appointment.nutritionist = req.body.nutritionist;
    const savedAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
    .populate("nutritionist")
    .populate("client");
    res.status(201).json(populatedAppointment);
  } catch (error) {
    next(error);
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(204).json("successfully removed");
  } catch (error) {
    next(error);
  }
};

// Get appointment by date
exports.getAppointmentsByDate = async (req, res) => {
  const { dateApt } = req.query;
  const appointments = await Appointment.find({ dateApt })
    .populate("nutritionist")
    .populate("client");
  res.json(appointments);
};

// Get appointment by location
exports.getAppointmentsByLocation = async (req, res) => {
  const { locationApt } = req.query;
  const appointments = await Appointment.find({
    locationApt,
  })
    .populate("nutritionist")
    .populate("client");
  res.json(appointments);
};

// Get appointment by nutritionist
exports.getAppointmentsByNutritionist = async (req, res) => {
  const { nutritionist } = req.query;
  const appointments = await Appointment.find({
    nutritionist,
    statusApt:'pending'
  })
    .populate("client")
    .populate("nutritionist");
  res.json(appointments);
};
exports.getAppointmentsByNutritionistCalendar = async (req, res) => {
  const { nutritionist } = req.query;
  const appointments = await Appointment.find({
    nutritionist,
  })
    .populate("client")
    .populate("nutritionist");
  res.json(appointments);
};
exports.getAppointmentsByClient = async (req, res) => {
  try {
    const { client } = req.query;
    const appointments = await Appointment.find({
      client,
    })
      .populate("nutritionist")
      .populate("client");
    res.status(201).json(appointments);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Get appointment by status
exports.getAppointmentsByStatus = async (req, res) => {
  const { statusApt } = req.query;
  const appointments = await Appointment.find({ statusApt }).populate(
    "nutritionist"
  );
  res.json(appointments);
};

// Accept appointment
exports.acceptOrDeclineAppointment = async (req, res) => {
  const { action } = req.query;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      {
        statusApt: action,
      },
      { new: true }
    ).populate("client");
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
