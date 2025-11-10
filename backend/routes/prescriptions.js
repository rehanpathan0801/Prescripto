const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prescription = require('../models/Prescription');

// Create a prescription (doctor or admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const {
      appointment, patient, doctor,
      patientName, doctorName, clinicName,
      clinicWebsite, medicines, notes
    } = req.body;

    const pres = new Prescription({
      appointment,
      patient,
      doctor,
      patientName,
      doctorName,
      clinicName,
      clinicWebsite,
      medicines,
      notes
    });

    await pres.save();
    res.status(201).json(pres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescription by id (patient/doctor/admin with simple authorization)
// Get prescription by id (patient/doctor/admin with simple authorization)
router.get('/:id', auth, async (req, res) => {
  console.log("📥 GET /api/prescriptions/:id =", req.params.id);
  console.log("👤 Auth user:", req.user);

  try {
    const pres = await Prescription.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email');

    if (!pres) {
      console.log("⚠️ Prescription not found in DB for ID:", req.params.id);
      return res.status(404).json({ message: 'Prescription not found' });
    }

    console.log("🔍 Found prescription for patient:", pres.patient?._id?.toString(), "doctor:", pres.doctor?._id?.toString());

    // --- Authorization checks ---
    if (req.user.role === 'patient' && pres.patient?._id?.toString() !== req.user.id) {
      console.log("🚫 Patient forbidden. Token user:", req.user.id, "Prescription patient:", pres.patient?._id?.toString());
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.user.role === 'doctor' && pres.doctor?._id?.toString() !== req.user.id && req.user.role !== 'admin') {
      console.log("🚫 Doctor forbidden. Token user:", req.user.id, "Prescription doctor:", pres.doctor?._id?.toString());
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log("✅ Authorized. Sending prescription...");
    res.json(pres);

  } catch (err) {
    console.error("❌ Error fetching prescription:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

