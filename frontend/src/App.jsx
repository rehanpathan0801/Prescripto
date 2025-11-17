
import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import PrescriptionPage from './pages/PrescriptionPage';
import BookTest from './pages/patient/BookTest';
import MyTests from './pages/patient/MyTests';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientTests from './pages/doctor/PatientTests';
import AdminDashboard from './pages/AdminDashboard';
import LabDashboard from './pages/lab/LabDashboard';
import ManageTests from './pages/admin/ManageTests';
import ManageTestBookings from './pages/admin/ManageTestBookings';
import Navbar from './components/Navbar';
import { ToastProvider } from './contexts/ToastContext';
import Toast from './components/Toast';
import Landing from './pages/Landing';
import { ThemeProvider } from './contexts/ThemeContext';

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/'].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
        <Route path="/prescription/:id" element={<PrescriptionPage />} />

        <Route path="/book-test" element={<ProtectedRoute role="patient"><BookTest /></ProtectedRoute>} />
        <Route path="/my-tests" element={<ProtectedRoute role="patient"><MyTests /></ProtectedRoute>} />
        <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/patient-tests" element={<ProtectedRoute role="doctor"><PatientTests /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/manage-tests" element={<ProtectedRoute role="admin"><ManageTests /></ProtectedRoute>} />
        <Route path="/admin/manage-test-bookings" element={<ProtectedRoute role="admin"><ManageTestBookings /></ProtectedRoute>} />
        {/* Lab Dashboard Routes */}
        <Route path="/lab" element={<ProtectedRoute role="lab"><LabDashboard /></ProtectedRoute>} />
        <Route path="/lab/manage-tests" element={<ProtectedRoute role="lab"><ManageTests /></ProtectedRoute>} />
        <Route path="/lab/manage-test-bookings" element={<ProtectedRoute role="lab"><ManageTestBookings /></ProtectedRoute>} />

        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toast />
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App; 

