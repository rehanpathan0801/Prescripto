const Test = require('../models/TestModel');

// Create a new test (admin only)
exports.createTest = async (req, res) => {
  try {
    const { name, description, price, reportTime } = req.body;
    const test = new Test({ name, description, price, reportTime });
    await test.save();
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all tests (for patients and admin)
exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update test (admin only)
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Test.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Test not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete test (admin only)
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Test.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Test not found' });
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
