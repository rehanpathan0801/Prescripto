/*const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testType: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  result: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema); 
*/
