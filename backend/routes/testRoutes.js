const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const testController = require('../controllers/testController');

// All authenticated users can read available tests
router.get('/', auth, testController.getTests);

// Admin-only CRUD
router.post('/', auth, role('admin'), testController.createTest);
router.put('/:id', auth, role('admin'), testController.updateTest);
router.delete('/:id', auth, role('admin'), testController.deleteTest);

module.exports = router;
