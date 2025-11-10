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
    try {
      const url =
        addRole === "doctor"
          ? `${import.meta.env.VITE_API_URL}/admin/doctor`
          : `${import.meta.env.VITE_API_URL}/admin/patient`;
      await axios.post(
        url,
        { name: addName, email: addEmail, password: addPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast(`${addRole} added successfully!`, "success");
      setAddName("");
      setAddEmail("");
      setAddPassword("");
      addRole === "doctor" ? fetchDoctors() : fetchPatients();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to add user", "error");
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
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map((d) => (
                      <TableRow key={d._id}>
                        <TableCell>{d.name}</TableCell>
                        <TableCell>{d.email}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="destructive"
                            size="sm"
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
                            variant="destructive"
                            size="sm"
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
              <h3 className="text-lg font-semibold text-sky-700 mb-3">Feedback</h3>
              {feedback.length === 0 ? (
                <p className="text-gray-500">No feedback found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.map((f) => (
                      <TableRow key={f._id}>
                        <TableCell>{new Date(f.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{f.patient?.name}</TableCell>
                        <TableCell>{f.message}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700">
                            {f.rating}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Add User */}
            <TabsContent value="adduser" className="mt-6">
              <Card className="max-w-md mx-auto shadow-md border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-sky-600 text-lg">Add Doctor or Patient</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Role
                      </label>
                      <Select value={addRole} onValueChange={setAddRole}>
                        <SelectTrigger>
                          <span className="capitalize">{addRole}</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="patient">Patient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <Input
                        value={addName}
                        onChange={(e) => setAddName(e.target.value)}
                        placeholder="Enter name"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={addEmail}
                        onChange={(e) => setAddEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <Input
                        type="password"
                        value={addPassword}
                        onChange={(e) => setAddPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                      disabled={addLoading}
                    >
                      {addLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <Plus className="w-4 h-4 mr-1" />
                      )}
                      {addLoading ? "Adding..." : "Add User"}
                    </Button>
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
