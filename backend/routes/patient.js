const { sendEmail } = require('../utils/sendEmail');
const express = require('express');
const Appointment = require('../models/Appointment');
const Feedback = require('../models/Feedback');
const User = require('../models/User'); 
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// Book appointment
router.post('/appointments', auth, role('patient'), async (req, res) => {
  try {
    const { doctor, date, time, age, gender, phone } = req.body;

    if (!doctor || !date || !time || !phone) {
      return res.status(400).json({ message: 'All fields required' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be 10 digits' });
    }



     // Fetch doctor details by ID
    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    //Fetch logged-in patient details
    const patient = await User.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const patientEmail = patient.email;
    const patientName = patient.name;
    const doctorName = doctorUser.name;

    //Create appointment
    const appointment = new Appointment({
      patient: req.user.id,
      patientEmail,
      doctor: doctorUser._id,
      doctorName: doctorUser.name,
      speciality: doctorUser.speciality,
      consultationFee: doctorUser.fees,
      date,
      time,
      age: age || patient.age || null,
      gender: gender || patient.gender || null,
      phone
    });

    await appointment.save();
    console.log('patientEmail:', patientEmail);
    console.log('patientName:', patientName);
    console.log('doctorName:', doctorName);
    console.log('date:', date);
    console.log('time:', time);
    await sendEmail(patientEmail, patientName, doctorName, date, time);
    res.status(201).json({ message: 'Appointment booked and SMS sent!', appointment });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Cancel appointment
router.patch('/appointments/:id/cancel', auth, role('patient'), async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, patient: req.user.id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//View upcoming appointments
router.get('/appointments', auth, role('patient'), async (req, res) => {
  try {
    const now = new Date();
    const appointments = await Appointment.find({
      patient: req.user.id,
      date: { $gte: now },
      status: { $ne: 'cancelled' },
    })
      .populate('doctor', 'name email')
      .populate('patient', 'name age gender');

    const Prescription = require('../models/Prescription');
    const appointmentsWithPrescriptions = await Promise.all(
      appointments.map(async (app) => {
        const prescription = await Prescription.findOne({ appointment: app._id });
        return { ...app.toObject(), prescription };
      })
    );

    res.json(appointmentsWithPrescriptions);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


//Submit feedback
router.post('/feedback', auth, role('patient'), async (req, res) => {
  try {
    const { message, rating } = req.body;
    if (!message || !rating)
      return res.status(400).json({ message: 'All fields required' });

    const feedback = new Feedback({ patient: req.user.id, message, rating });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//Get all doctors (public)
router.get('/doctors', auth, async (req, res) => {
  try {
    const { speciality } = req.query;
    let query = { role: 'doctor' };
    if (speciality) query.speciality = speciality;
    const doctors = await User.find(query).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
