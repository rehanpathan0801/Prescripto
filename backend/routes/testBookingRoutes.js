const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const controller = require('../controllers/testBookingController');

// ✅ NEW: Cloudinary setup
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "prescripto-reports",
    resource_type: "auto",
    type: "upload", // ✅ VERY IMPORTANT (makes it public)
    public_id: (req, file) => {
      const name = file.originalname.replace(/\.[^/.]+$/, "");
      return Date.now() + "-" + name;
    },
  },
});

// ✅ Multer config
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF allowed"));
    }
    cb(null, true);
  },
});

// Patient creates booking
router.post(
  '/',
  auth,
  (req, res, next) =>
    req.user.role === 'patient'
      ? next()
      : res.status(403).json({ message: 'Only patients can book tests' }),
  controller.createBooking
);

// Get bookings
router.get('/', auth, controller.getBookings);
router.get('/:id', auth, controller.getBookingById);

// Update status
router.put('/:id/status', auth, role(['admin', 'lab']), controller.updateStatus);

// ✅ Upload report (Cloudinary)
router.post(
  '/:id/upload-report',
  auth,
  role(['admin', 'lab']),
  upload.single('report'),
  controller.uploadReport
);

// Cancel / delete
router.post('/:id/cancel', auth, controller.cancelBooking);
router.delete('/:id', auth, role(['admin', 'lab']), controller.deleteBooking);

// Notes
router.put(
  '/:id/notes',
  auth,
  (req, res, next) => {
    const roleAllowed = ['doctor', 'admin', 'lab'];
    if (!roleAllowed.includes(req.user.role))
      return res.status(403).json({ message: 'Access denied' });
    next();
  },
  controller.updateNotes
);

module.exports = router;