// src/pages/patient/PatientDashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { ToastContext } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { CalendarCheck, PlusCircle,  Hospital } from 'lucide-react';


export default function PatientDashboard() {
  const { user, token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [tab, setTab] = useState('appointments');

  // core states (kept from original)
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // booking states (preserved)
  const [doctors, setDoctors] = useState([]);
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [bookDoctor, setBookDoctor] = useState('');
  const [bookAge, setBookAge] = useState('');
  const [bookGender, setBookGender] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState(null);
  const [bookSuccess, setBookSuccess] = useState(null);

  // feedback
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(null);

  // prescriptions modal (kept)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const navigate = useNavigate();

  // speciality, fee, etc (kept)
  const SPECIALITIES = [
    'General',
    'Cardiologist',
    'Pediatrician',
    'Neurologist',
    'Orthopedic',
    'Dermatologist',
  ];
  const [bookSpeciality, setBookSpeciality] = useState('');
  const [selectedDoctorFee, setSelectedDoctorFee] = useState('');

  // ---------- Effects (logic unchanged) ----------
  useEffect(() => {
    if (tab === 'appointments') {
      fetchAppointments();
    }
    if (tab === 'book') {
      fetchDoctors();
    }
    // eslint-disable-next-line
  }, [tab]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/patient/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to load appointments');
    }
    setLoading(false);
  };

  const fetchDoctors = async (speciality) => {
    setBookLoading(true);
    setBookError(null);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/patient/doctors?speciality=${encodeURIComponent(speciality)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoctors(res.data);
    } catch (err) {
      setBookError('Failed to load doctors');
    }
    setBookLoading(false);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookLoading(true);
    setBookError(null);
    setBookSuccess(null);

    // Client-side validation for age (optional)
    if (bookAge !== '') {
      const ageNum = Number(bookAge);
      if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120) {
        setBookError('Please enter a valid age (0-120).');
        setBookLoading(false);
        return;
      }
    }

    // Phone validation
    if (!/^\d{10}$/.test(bookPhone)) {
      setBookError('Please enter a valid 10-digit phone number.');
      setBookLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/patient/appointments`,
        {
          doctor: bookDoctor,
          date: bookDate,
          time: bookTime,
          age: bookAge === '' ? null : Number(bookAge),
          gender: bookGender || null,
          phone: bookPhone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookSuccess('Appointment booked successfully!');
      addToast('Appointment booked successfully!', 'success');
      setBookDate('');
      setBookTime('');
      setBookDoctor('');
      setBookAge('');
      setBookGender('');
      setBookPhone('');
      fetchAppointments();
    } catch (err) {
      setBookError(err.response?.data?.message || 'Booking failed');
      addToast(err.response?.data?.message || 'Booking failed', 'error');
    }
    setBookLoading(false);
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackError(null);
    setFeedbackSuccess(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/patient/feedback`,
        {
          message: feedbackMessage,
          rating: feedbackRating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbackSuccess('Feedback submitted!');
      addToast('Feedback submitted!', 'success');
      setFeedbackMessage('');
      setFeedbackRating('');
    } catch (err) {
      setFeedbackError(err.response?.data?.message || 'Submission failed');
      addToast(err.response?.data?.message || 'Submission failed', 'error');
    }
    setFeedbackLoading(false);
  };

  const handleSpecialityChange = (e) => {
    const spec = e.target.value;
    setBookSpeciality(spec);
    setBookDoctor('');
    setSelectedDoctorFee('');
    if (spec) fetchDoctors(spec);
    else setDoctors([]);
  };

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    setBookDoctor(docId);
    const doc = doctors.find((d) => d._id === docId);
    setSelectedDoctorFee(doc ? doc.fees : '');
  };

  // ---------- Render ----------
  return (
<div className="max-w-6xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 shadow-sm">

          <Hospital className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <p className="text-sm text-gray-500">Manage appointments, book tests & submit feedback</p>
        </div>
      </div>

      <Card className="overflow-visible border border-gray-200 dark:border-gray-800 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all">

        <CardHeader className="px-6 pt-6 pb-0">
          <CardTitle className="flex items-center gap-3">
            <span className="text-lg font-semibold">Dashboard</span>
            <span className="ml-2 text-sm text-gray-500">Welcome, {user?.name}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 py-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="mb-4">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-sky-50 dark:bg-gray-800 rounded-xl p-1 h-14 shadow-sm">

                <TabsTrigger
                  value="appointments"
                  className="data-[state=active]:bg-sky-600 data-[state=active]:text-white rounded-lg flex items-center justify-center gap-2 py-2.5 font-medium transition-all hover:bg-sky-100 dark:hover:bg-gray-700"
                >
                 Appointments
                </TabsTrigger>

                <TabsTrigger
                  value="book"
                  className="data-[state=active]:bg-sky-600 data-[state=active]:text-white rounded-lg flex items-center justify-center gap-2 py-2.5 font-medium transition-all hover:bg-sky-100 dark:hover:bg-gray-700"
                >
                   Book Appointment
                </TabsTrigger>

               

                <TabsTrigger
                  value="book-test"
                  onClick={() => navigate("/book-test")}
                  className="data-[state=active]:bg-sky-600 data-[state=active]:text-white rounded-lg flex items-center justify-center gap-2 py-2.5 font-medium transition-all hover:bg-sky-100  dark:hover:bg-gray-700"
                >
                 Book Test
                </TabsTrigger>

                <TabsTrigger
                  value="my-tests"
                  onClick={() => navigate("/my-tests")}
                  className="data-[state=active]:bg-sky-600 data-[state=active]:text-white rounded-lg flex items-center justify-center gap-2 py-2.5 font-medium transition-all hover:bg-sky-100 dark:hover:bg-gray-700"
                >
                   My Tests
                </TabsTrigger>
                 <TabsTrigger
                 
                  value="feedback"
                  className="data-[state=active]:bg-sky-600 data-[state=active]:text-white rounded-lg flex items-center justify-center gap-2 py-2.5 font-medium transition-all hover:bg-sky-100 dark:hover:bg-gray-700"
                >
                  Feedback
                  
                </TabsTrigger>
              </TabsList>
            </div>


            {/* ---------- Appointments Tab ---------- */}
            <TabsContent value="appointments">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No upcoming appointments.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-gray-100 dark:bg-gray-800">

                        <tr>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-left">Time</th>
                          <th className="p-3 text-left">Doctor</th>
                          <th className="p-3 text-left">Age</th>
                          <th className="p-3 text-left">Gender</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Prescription</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((app) => (
                          <tr key={app._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-3">{new Date(app.date).toLocaleDateString()}</td>
                            <td className="p-3">{app.time}</td>
                            <td className="p-3">
                              {app.doctor?.name ? `Dr. ${app.doctor.name}${app.speciality ? ` (${app.speciality})` : ''}` : '-'}
                            </td>
                            <td className="p-3">{app.age ?? '-'}</td>
                            <td className="p-3">
                              {app.gender ? String(app.gender).charAt(0).toUpperCase() + String(app.gender).slice(1) : '-'}
                            </td>
                            <td className="p-3">
                              <Badge
  variant="outline"
  className={`capitalize ${
    app.status === 'completed'
      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
      : app.status === 'cancelled'
      ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
      : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
  }`}
>
  {app.status}
</Badge>

                            </td>
                            <td className="p-3">
                             {app.prescription ? (
                              <Button
  size="sm"
  className="bg-green-600 hover:bg-green-700 text-white"
  onClick={() => {
    console.log("Navigating to prescription:", app.prescription?._id, app._id);
    navigate(`/prescription/${app.prescription._id}`);
  }}
>
  View Report
</Button>

                            ) : (
                              <span className="text-gray-400">-</span>
                            )}

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ---------- Book Appointment Tab ---------- */}
            <TabsContent value="book">
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-lg font-semibold">Book Appointment</h3>

                <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Speciality (native select for robust behavior) */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Speciality</label>
                    <select
                      value={bookSpeciality}
                      onChange={handleSpecialityChange}
                      className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
                      required
                    >
                      <option value="">Select Speciality</option>
                      {SPECIALITIES.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Doctor</label>
                    <select
                      value={bookDoctor}
                      onChange={handleDoctorChange}
                      className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
                      required
                      disabled={!bookSpeciality || bookLoading}
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          Dr. {doc.name} {doc.speciality ? `(${doc.speciality})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fee */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Consultation Fee</label>
                    <Input value={selectedDoctorFee || ''} disabled />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} required />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <select
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
                      required
                    >
                      <option value="">Select Time Slot</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      type="tel"
                      value={bookPhone}
                      onChange={(e) => setBookPhone(e.target.value.replace(/\D/, ''))}
                      placeholder="10-digit number"
                      maxLength={10}
                      required
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <Input
                      type="number"
                      min="0"
                      max="120"
                      value={bookAge}
                      onChange={(e) => setBookAge(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      value={bookGender}
                      onChange={(e) => setBookGender(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Errors / Success */}
                  <div className="md:col-span-2">
                    {bookError && <div className="text-red-600 mb-2">{bookError}</div>}
                    {bookSuccess && <div className="text-green-600 mb-2">{bookSuccess}</div>}
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white" disabled={bookLoading}>
                        {bookLoading ? 'Booking...' : 'Book Appointment'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setBookDate('');
                        setBookTime('');
                        setBookDoctor('');
                        setBookAge('');
                        setBookGender('');
                        setBookPhone('');
                        setBookSpeciality('');
                        setSelectedDoctorFee('');
                        setBookError(null);
                        setBookSuccess(null);
                      }}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* ---------- Feedback Tab ---------- */}
            <TabsContent value="feedback">
  <div className="max-w-xl mx-auto mt-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 space-y-6 transition-all duration-300">
    <h3 className="text-2xl font-extrabold text-center bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent tracking-wide">
      Share Your Feedback 💬
    </h3>

    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
      We value your thoughts — help us improve your experience at <b>Prescripto</b>.
    </p>

    <form onSubmit={handleFeedback} className="space-y-5">
      {/* Feedback Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Your Message
        </label>
        <Textarea
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          placeholder="Write your feedback..."
          required
          className="w-full min-h-[120px] resize-none rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600 focus:border-transparent bg-white dark:bg-gray-800 transition-all duration-300 shadow-sm"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Rating
        </label>
        <select
          value={feedbackRating}
          onChange={(e) => setFeedbackRating(e.target.value)}
          required
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gradient-to-r from-white to-sky-50 dark:from-gray-800 dark:to-gray-900 px-3 py-2 focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600 shadow-sm text-gray-700 dark:text-gray-200 transition-all duration-300"
        >
          <option value="">Select Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              ⭐ {r}
            </option>
          ))}
        </select>
      </div>

      {/* Alerts */}
      {feedbackError && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg shadow-sm text-sm text-center animate-fade-in">
          {feedbackError}
        </div>
      )}
      {feedbackSuccess && (
        <div className="bg-green-50 dark:bg-emerald-900/30 border border-green-200 dark:border-emerald-800 text-green-600 dark:text-emerald-400 px-4 py-2 rounded-lg shadow-sm text-sm text-center animate-fade-in">
          {feedbackSuccess}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          type="submit"
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          disabled={feedbackLoading}
        >
          {feedbackLoading ? (
            <span className="flex items-center gap-2">
              <i className="bi bi-arrow-repeat animate-spin"></i> Submitting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <i className="bi bi-send-fill"></i> Submit Feedback
            </span>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFeedbackMessage("");
            setFeedbackRating("");
          }}
          className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg shadow-sm transition-all"
        >
          <i className="bi bi-x-circle me-1"></i> Clear
        </Button>
      </div>
    </form>
  </div>
</TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
