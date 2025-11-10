const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  speciality: { type: String, required: true },         // NEW
  doctorName: { type: String, required: true },         // NEW
  consultationFee: { type: Number, required: true },    // NEW
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
  age: { type: Number, min: 0, max: 120, default: null },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', null],
    default: null
  },
  phone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema); 