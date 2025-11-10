const mongoose = require('mongoose');

const TestBookingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, enum: ['Morning', 'Afternoon', 'Evening'], required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Canceled'], default: 'Pending' },
  reportFile: { type: String, default: '' },
  paymentMode: { type: String, enum: ['Online', 'Cash'], default: 'Cash' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('TestBooking', TestBookingSchema);
