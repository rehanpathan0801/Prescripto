const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  reportTime: { type: String, default: '' } // e.g. '24-48 hours'
}, { timestamps: true });

// ✅ Fix OverwriteModelError by checking if already defined
module.exports = mongoose.models.Test || mongoose.model('Test', TestSchema);
