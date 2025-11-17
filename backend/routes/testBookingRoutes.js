const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const controller = require('../controllers/testBookingController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/reports exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'reports');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});

const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') return cb(new Error('Only PDF allowed'));
  cb(null, true);
}});

// Patient creates booking
router.post('/', auth, (req, res, next) => (req.user.role === 'patient' ? next() : res.status(403).json({ message: 'Only patients can book tests' })), controller.createBooking);

// Get bookings - admin all, patient own, doctor related
router.get('/', auth, controller.getBookings);
router.get('/:id', auth, controller.getBookingById);

// Admin updates status
router.put('/:id/status', auth, role(['admin', 'lab']), controller.updateStatus);

// Admin upload report (PDF)
router.post('/:id/upload-report', auth, role(['admin', 'lab']), upload.single('report'), controller.uploadReport);

// Patient cancel or admin delete
router.post('/:id/cancel', auth, controller.cancelBooking);
router.delete('/:id', auth, role(['admin', 'lab']), controller.deleteBooking);
// Doctor or admin can add notes
router.put('/:id/notes', auth, (req, res, next) => {
  const roleAllowed = ['doctor', 'admin', 'lab'];
  if (!roleAllowed.includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
  next();
}, controller.updateNotes);

module.exports = router;
