const express = require('express');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Test = require('../models/Test');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// View appointment list
router.get('/appointments', auth, role('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id, status: { $ne: 'cancelled' } })
      .populate('patient', 'name email');
    // Populate prescription for each appointment
    const Prescription = require('../models/Prescription');
    const appointmentsWithPrescriptions = await Promise.all(
      appointments.map(async (app) => {
        const prescription = await Prescription.findOne({ appointment: app._id });
        return { ...app.toObject(), prescription };
      })
    );
    console.log('Doctor appointments with prescriptions:', appointmentsWithPrescriptions);
    res.json(appointmentsWithPrescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add prescription to appointment
router.post('/appointments/:id/prescription', auth, role('doctor'), async (req, res) => {
  try {
    const { medicines, notes } = req.body;
    const appointment = await Appointment.findOne({ _id: req.params.id, doctor: req.user.id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    const prescription = new Prescription({
      appointment: appointment._id,
      doctor: req.user.id,
      patient: appointment.patient,
      medicines,
      notes
    });
    await prescription.save();
    // Set status to completed
    appointment.status = 'completed';
    await appointment.save();
    res.status(201).json({ message: 'Prescription added', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment
router.patch('/appointments/:id/cancel', auth, role('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, doctor: req.user.id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Book test for patient
router.post('/tests', auth, role('doctor'), async (req, res) => {
  try {
    const { patient, testType, date } = req.body;
    if (!patient || !testType || !date) return res.status(400).json({ message: 'All fields required' });
    const test = new Test({ patient, doctor: req.user.id, testType, date });
    await test.save();
    res.status(201).json({ message: 'Test booked', test });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add test result
router.patch('/tests/:id/result', auth, role('doctor'), async (req, res) => {
  try {
    const { result } = req.body;
    const test = await Test.findOne({ _id: req.params.id, doctor: req.user.id });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    test.result = result;
    test.status = 'completed';
    await test.save();
    res.json({ message: 'Test result added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor's tests
router.get('/tests', auth, role('doctor'), async (req, res) => {
  try {
    const tests = await Test.find({ doctor: req.user.id }).populate('patient', 'name email');
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Doctor: Get all patients (for test booking)
router.get('/patients', auth, role('doctor'), async (req, res) => {
  try {
    const patients = await require('../models/User').find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 