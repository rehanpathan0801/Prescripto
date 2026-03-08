require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const seedAdmin = require('./utils/seedAdmin');

const app = express();

// ✅ Updated CORS for deployment
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const sampleRoutes = require('./routes/sample');
const prescriptionRoutes = require('./routes/prescriptions');
const testRoutes = require('./routes/testRoutes');
const testBookingRoutes = require('./routes/testBookingRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/sample', sampleRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-bookings', testBookingRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Port
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // Seed admin user
    await seedAdmin();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));