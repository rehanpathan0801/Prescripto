require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedAdmin = require('./utils/seedAdmin'); // ✅ import

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend running on Vite
    credentials: true, // allow cookies/auth headers if used
  })
);
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const patientRoutes = require('./routes/patient');
app.use('/api/patient', patientRoutes);

const doctorRoutes = require('./routes/doctor');
app.use('/api/doctor', doctorRoutes);

const sampleRoutes = require('./routes/sample');
app.use('/api/sample', sampleRoutes);

const prescriptionRoutes = require('./routes/prescriptions');
app.use('/api/prescriptions', prescriptionRoutes);


//Add routes here
const path = require('path');
const testRoutes = require('./routes/testRoutes');
const testBookingRoutes = require('./routes/testBookingRoutes');
// serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/tests', testRoutes);
app.use('/api/test-bookings', testBookingRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
   
    await seedAdmin();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
