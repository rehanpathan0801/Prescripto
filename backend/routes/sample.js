const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Create sample admin, doctors, and patients
router.post('/init', async (req, res) => {
  try {
    // 🔹 Ensure Admin user exists
    let admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      admin = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // 🔹 Doctors
    const doctorsData = [
      { name: 'Dr. Alice Smith', email: 'alice@medisphere.com' },
      { name: 'Dr. Bob Jones', email: 'bob@medisphere.com' }
    ];
    const doctors = [];
    for (const doc of doctorsData) {
      let doctor = await User.findOne({ email: doc.email });
      if (!doctor) {
        doctor = new User({
          name: doc.name,
          email: doc.email,
          password: await bcrypt.hash('doctor123', 10),
          role: 'doctor'
        });
        await doctor.save();
      }
      doctors.push(doctor);
    }

    // 🔹 Patients
    const patientsData = [
      { name: 'John Doe', email: 'john@medisphere.com' },
      { name: 'Jane Roe', email: 'jane@medisphere.com' }
    ];
    const patients = [];
    for (const pat of patientsData) {
      let patient = await User.findOne({ email: pat.email });
      if (!patient) {
        patient = new User({
          name: pat.name,
          email: pat.email,
          password: await bcrypt.hash('patient123', 10),
          role: 'patient'
        });
        await patient.save();
      }
      patients.push(patient);
    }

    // 🔹 Return credentials for testing
    res.json({
      message: 'Initialization complete',
      admin: { email: admin.email, password: 'admin123' },
      doctors: doctors.map(d => ({ email: d.email, password: 'doctor123' })),
      patients: patients.map(p => ({ email: p.email, password: 'patient123' }))
    });
  } catch (err) {
    console.error('❌ Error in /init:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
