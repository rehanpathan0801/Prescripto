const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Appointment = require('../models/Appointment');
const Test = require('../models/Test');
const Feedback = require('../models/Feedback');

const router = express.Router();

// Add Doctor
router.post('/doctor', auth, role('admin'), async (req, res) => {
  try {
    const { name, email, password, speciality, fees } = req.body;
    if (!speciality) return res.status(400).json({ message: 'Speciality is required' });
    if (!fees || isNaN(Number(fees))) return res.status(400).json({ message: 'Fees must be a number' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const doctor = new User({
      name,
      email,
      password: hashed,
      speciality,
      fees: Number(fees),
      role: 'doctor'
    });
    await doctor.save();
    res.status(201).json({ message: 'Doctor created' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create doctor' });
  }
});

// Add Patient (by admin)
router.post('/patient', auth, role('admin'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: 'patient' });
    await user.save();
    res.status(201).json({ message: 'Patient added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete User
router.delete('/user/:id', auth, role('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Doctors
router.get('/doctors', auth, role('admin'), async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Patients
router.get('/patients', auth, role('admin'), async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Users
router.get('/users', auth, role('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// View all appointments
router.get('/appointments', auth, role('admin'), async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patient', 'name email').populate('doctor', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// View all tests
router.get('/tests', auth, role('admin'), async (req, res) => {
  try {
    const tests = await Test.find().populate('patient', 'name email').populate('doctor', 'name email');
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// View all feedback
router.get('/feedback', auth, role('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('patient', 'name email');
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 