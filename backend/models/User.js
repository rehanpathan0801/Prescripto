const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
    // Speciality and fees are only required for doctors
  speciality: { type: String, required: function() { return this.role === 'doctor'; } },
  fees: { type: Number, required: function() { return this.role === 'doctor'; } }, 
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true }
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema); 