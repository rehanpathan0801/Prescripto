import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContext } from "../contexts/ToastContext";
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  CalendarCheck,
  Stethoscope,
  Users,
  ClipboardList,
  MessageSquare,
  Plus,
  Trash2,
  Hospital,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [tab, setTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addSpeciality, setAddSpeciality] = useState('');
  const [addFees, setAddFees] = useState('');
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const SPECIALITIES = [
  "General",
  "Cardiologist",
  "Pediatrician",
  "Neurologist",
  "Orthopedic",
  "Dermatologist"
];

  const [addRole, setAddRole] = useState("doctor");
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    switch (tab) {
      case "appointments": fetchAppointments(); break;
      case "doctors": fetchDoctors(); break;
      case "patients": fetchPatients(); break;
      case "tests": fetchTests(); break;
      case "feedback": fetchFeedback(); break;
      default: break;
    }
  }, [tab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch {
      addToast("Failed to load appointments", "error");
    }
    setLoading(false);
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch {}
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch {}
  };

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data);
    } catch {}
  };

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback(res.data);
    } catch {}
  };

  const handleDelete = async (id, type) => {
    if (!confirm(`Delete this ${type}?`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast(`${type} deleted successfully`, "success");
      type === "doctor" ? fetchDoctors() : fetchPatients();
    } catch {
      addToast(`Failed to delete ${type}`, "error");
    }
  };

const handleAddUser = async (e) => {
  e.preventDefault();
  setAddLoading(true);
  setAddError(null);
  setAddSuccess(null);
  try {
    if (addRole === 'doctor') {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/doctor`, {
        name: addName,
        email: addEmail,
        password: addPassword,
        speciality: addSpeciality,
        fees: addFees
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDoctors();
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/patient`, {
        name: addName,
        email: addEmail,
        password: addPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPatients();
    }
    setAddSuccess('User added successfully!');
    addToast('User added successfully!', 'success');
    setAddName('');
    setAddEmail('');
    setAddPassword('');
    setAddSpeciality('');
    setAddFees('');
  } catch (err) {
    setAddError(err.response?.data?.message || 'Failed to add user');
    addToast(err.response?.data?.message || 'Failed to add user', 'error');
  }
  setAddLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-6">
      <Card className="max-w-7xl mx-auto border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-xl">
            <Hospital className="w-6 h-6" />
            <span>Receptionist / Admin Dashboard</span>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex flex-wrap justify-center gap-6 bg-sky-50 dark:bg-gray-900 rounded-lg p-2">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4" /> Appointments
              </TabsTrigger>
              <TabsTrigger value="doctors" className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4" /> Doctors
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Patients
              </TabsTrigger>
              <TabsTrigger
      value="manage-tests"
      onClick={() => navigate("/admin/manage-tests")}
      className="flex items-center gap-2 cursor-pointer transition-colors data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
    >
      <ClipboardList className="w-4 h-4" />
      Manage Tests
    </TabsTrigger>

    <TabsTrigger
      value="manage-test-bookings"
      onClick={() => navigate("/admin/manage-test-bookings")}
      className="flex items-center gap-2 cursor-pointer transition-colors data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
    >
      <ClipboardList className="w-4 h-4" />
      Test Bookings
    </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Feedback         
    </TabsTrigger>
    
    <TabsTrigger value="adduser" className="flex items-center gap-2">
      <Plus className="w-4 h-4" /> Add User
    </TabsTrigger>
    

            </TabsList>

            {/* Appointments */}
            <TabsContent value="appointments" className="mt-6">
              <h3 className="text-lg font-semibold text-sky-700 mb-3">All Appointments</h3>
              {loading ? (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-gray-500">No appointments found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((a) => (
                      <TableRow key={a._id}>
                        <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                        <TableCell>{a.time}</TableCell>
                        <TableCell>{a.patient?.name}</TableCell>
                        <TableCell>{a.doctor?.name}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              a.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {a.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

        {/* Doctors */}
<TabsContent value="doctors" className="mt-6">
  <h3 className="text-lg font-semibold text-sky-700 mb-3">Doctors</h3>

  {doctors.length === 0 ? (
    <p className="text-gray-500">No doctors found.</p>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Speciality</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((d) => (
          <TableRow key={d._id}>
            <TableCell>{d.name}</TableCell>
            <TableCell>{d.email}</TableCell>
            <TableCell>{d.speciality || '-'}</TableCell>
            <TableCell className="text-center">
              <Button
               variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => handleDelete(d._id, "doctor")}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</TabsContent>


            {/* Patients */}
            <TabsContent value="patients" className="mt-6">
              <h3 className="text-lg font-semibold text-sky-700 mb-3">Patients</h3>
              {patients.length === 0 ? (
                <p className="text-gray-500">No patients found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleDelete(p._id, "patient")}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Tests */}
            <TabsContent value="tests" className="mt-6">
              <h3 className="text-lg font-semibold text-sky-700 mb-3">All Tests</h3>
              {tests.length === 0 ? (
                <p className="text-gray-500">No tests found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map((t) => (
                      <TableRow key={t._id}>
                        <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                        <TableCell>{t.patient?.name}</TableCell>
                        <TableCell>{t.doctor?.name}</TableCell>
                        <TableCell>{t.testType}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              t.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </TableCell>
                        <TableCell>{t.result || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Feedback */}
<TabsContent value="feedback" className="mt-6">
  <div className="max-w-5xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
    
    {/* Header */}
<div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 
  bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-400 
  text-white shadow-md">
  <h3 className="text-2xl font-bold tracking-wide flex items-center gap-2 drop-shadow-sm">
    <i className="bi bi-chat-dots"></i> User Feedback
  </h3>
  <p className="text-sm opacity-95 font-medium tracking-wide">
    Patient opinions and experiences at a glance.
  </p>
</div>


    {/* Content */}
    <div className="p-6">
      {feedback.length === 0 ? (
<div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 
  bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-400 
  dark:bg-gradient-to-r dark:from-sky-700 dark:via-indigo-600 dark:to-blue-700
  text-white shadow-md">
          <i className="bi bi-emoji-neutral text-5xl mb-3 text-gray-400 dark:text-gray-500"></i>
          <p className="text-lg font-medium">No feedback available yet.</p>
          <p className="text-sm text-gray-400">Once patients submit feedback, it will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800 shadow-inner">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-sky-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300">
                <TableHead className="font-semibold py-3 px-4">Date</TableHead>
                <TableHead className="font-semibold py-3 px-4">Patient</TableHead>
                <TableHead className="font-semibold py-3 px-4">Message</TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback.map((f) => (
                <TableRow
                  key={f._id}
                  className="hover:bg-sky-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                    {f.patient?.name || "—"}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {f.message}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm animate-fade-in ${
                        f.rating >= 4
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : f.rating === 3
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      ⭐ {f.rating}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  </div>
</TabsContent>


            {/* Add User */}
<TabsContent value="adduser" className="mt-8 animate-fade-in">
  <Card className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl transition-all duration-500 hover:shadow-blue-200 dark:hover:shadow-blue-900">
    
    {/* Header */}
    <CardHeader className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-400 dark:from-sky-800 dark:via-blue-800 dark:to-indigo-900 rounded-t-2xl text-white shadow-md">
      <CardTitle className="text-xl font-bold tracking-wide flex items-center gap-2">
        <i className="bi bi-person-plus-fill text-white text-xl"></i> Add Doctor or Patient
      </CardTitle>
      <p className="text-sm opacity-90 font-medium">Register new users easily below 👇</p>
    </CardHeader>

    {/* Form */}
    <CardContent className="p-8">
      <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Role */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <i className="bi bi-person-badge"></i> Role
          </label>
         <Select value={addRole} onValueChange={setAddRole}>
  <SelectTrigger
    className="mt-1 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
    border border-gray-300 dark:border-gray-700 rounded-lg 
    hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-300 
    shadow-[0_2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)] 
    transition-all duration-300"
  >
    <span className="capitalize text-gray-800 dark:text-gray-100">{addRole}</span>
  </SelectTrigger>

  <SelectContent
    className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 
    border border-gray-200 dark:border-gray-700 rounded-lg 
    shadow-lg animate-fade-in"
  >
    <SelectItem
      value="doctor"
      className="hover:bg-sky-100 dark:hover:bg-sky-900 cursor-pointer px-3 py-2 rounded-md transition"
    >
      Doctor
    </SelectItem>
    <SelectItem
      value="patient"
      className="hover:bg-sky-100 dark:hover:bg-sky-900 cursor-pointer px-3 py-2 rounded-md transition"
    >
      Patient
    </SelectItem>
  </SelectContent>
</Select>

        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <i className="bi bi-person-circle"></i> Name
          </label>
          <Input
            type="text"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            placeholder="Enter full name"
            className="mt-1 focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <i className="bi bi-envelope"></i> Email
          </label>
          <Input
            type="email"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            placeholder="Enter email"
            className="mt-1 focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <i className="bi bi-shield-lock"></i> Password
          </label>
          <Input
            type="password"
            value={addPassword}
            onChange={(e) => setAddPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-1 focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        {/* Doctor Fields */}
        {addRole === "doctor" && (
          <>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i className="bi bi-clipboard2-pulse"></i> Speciality
              </label>
              <Select value={addSpeciality} onValueChange={setAddSpeciality} required>
                <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-sky-500">
                  <span>{addSpeciality || "Select Speciality"}</span>
                </SelectTrigger>
                <SelectContent>
                  {SPECIALITIES.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i className="bi bi-currency-rupee"></i> Consultation Fees
              </label>
              <Input
                type="number"
                value={addFees}
                onChange={(e) => setAddFees(e.target.value)}
                min="0"
                placeholder="Enter fee"
                className="mt-1 focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </>
        )}

        {/* Alerts */}
        <div className="md:col-span-2">
          {addError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-3 animate-fade-in shadow-sm">
              {addError}
            </div>
          )}
          {addSuccess && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-3 py-2 rounded-md mb-3 animate-fade-in shadow-sm">
              {addSuccess}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              type="submit"
              className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-medium shadow-md"
              disabled={addLoading}
            >
              {addLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" /> Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" /> Add User
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAddName("");
                setAddEmail("");
                setAddPassword("");
                setAddRole("doctor");
                setAddSpeciality("");
                setAddFees("");
                setAddError(null);
                setAddSuccess(null);
              }}
              className="border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <i className="bi bi-arrow-repeat mr-2"></i> Reset
            </Button>
          </div>
        </div>
      </form>
    </CardContent>
  </Card>
</TabsContent>


          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
