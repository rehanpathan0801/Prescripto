const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: String,
  frequency: String,
  duration: String,
  instructions: String
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }, // optional
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: String,
  doctorName: String,
  clinicName: String,
  clinicWebsite: String,
  date: { type: Date, default: Date.now },
  medicines: [medicineSchema],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
