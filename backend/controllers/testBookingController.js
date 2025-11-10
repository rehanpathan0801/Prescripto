const fs = require('fs');
const path = require('path');
const TestBooking = require('../models/TestBookingModel');
const Test = require('../models/TestModel');

// Create a booking (patient)
exports.createBooking = async (req, res) => {
  try {
    const { testId, doctorId, date, timeSlot, paymentMode } = req.body;
    const booking = new TestBooking({
      patientId: req.user.id,
      doctorId: doctorId || null,
      testId,
      date,
      timeSlot,
      paymentMode
    });
  await booking.save();
  await booking.populate('testId');
  res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get bookings (admin = all, patient = own, doctor = their patients)
exports.getBookings = async (req, res) => {
  try {
    const role = req.user.role;
    let query = {};
    if (role === 'patient') query.patientId = req.user.id;
    else if (role === 'doctor') query.doctorId = req.user.id;
    // admin gets all
    const bookings = await TestBooking.find(query).populate('patientId', 'name email').populate('doctorId', 'name email').populate('testId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single booking
exports.getBookingById = async (req, res) => {
  try {
    const booking = await TestBooking.findById(req.params.id).populate('patientId', 'name email').populate('doctorId', 'name email').populate('testId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Authorization: patients can access only their bookings, doctors only their patients, admin any
    if (req.user.role === 'patient' && booking.patientId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'doctor' && booking.doctorId && booking.doctorId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update status (admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await TestBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = status;
    await booking.save();
    const populated = await TestBooking.findById(booking._id).populate('patientId', 'name email').populate('doctorId', 'name email').populate('testId');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update notes (doctor/admin)
exports.updateNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const booking = await TestBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // allow doctor assigned or admin
    if (req.user.role === 'doctor' && booking.doctorId && booking.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    booking.notes = notes;
    await booking.save();
    const populated = await TestBooking.findById(booking._id).populate('patientId', 'name email').populate('doctorId', 'name email').populate('testId');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Upload report (admin)
exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const booking = await TestBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Ensure uploads dir exists is handled by multer destination
    booking.reportFile = `/uploads/reports/${req.file.filename}`;
    booking.status = 'Completed';
    await booking.save();
    const populated = await TestBooking.findById(booking._id).populate('patientId', 'name email').populate('doctorId', 'name email').populate('testId');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cancel booking (patient or admin)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await TestBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // only patient who owns it or admin can cancel
    if (req.user.role === 'patient' && booking.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    booking.status = 'Canceled';
    await booking.save();
    res.json({ message: 'Booking canceled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete booking (admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await TestBooking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
