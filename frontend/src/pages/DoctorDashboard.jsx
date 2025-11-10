import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { ToastContext } from "../contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import {
  ClipboardList,
  FilePlus2,
  FlaskConical,
  Pill,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";


export default function DoctorDashboard() {
  const { token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [tab, setTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testPatient, setTestPatient] = useState("");
  const [testType, setTestType] = useState("");
  const [testDate, setTestDate] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultValue, setResultValue] = useState("");
  const [resultTestId, setResultTestId] = useState(null);

  // NEW STATES for prescription modal
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionAppId, setPrescriptionAppId] = useState(null);
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', instructions: '' }]);
  const [notes, setNotes] = useState('');
  const [prescLoading, setPrescLoading] = useState(false);
  const [prescError, setPrescError] = useState(null);
  const [prescSuccess, setPrescSuccess] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [existingPrescription, setExistingPrescription] = useState("");

  useEffect(() => {
    if (tab === "appointments") fetchAppointments();
    if (tab === "booktest") fetchPatients();
    if (tab === "results") fetchTests();
  }, [tab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/doctor/appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch {
      addToast("Failed to load appointments", "error");
    }
    setLoading(false);
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/doctor/patients`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatients(res.data);
    } catch {
      addToast("Failed to load patients", "error");
    }
  };

  const fetchTests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/doctor/tests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTests(res.data);
    } catch {
      addToast("Failed to load tests", "error");
    }
  };

  const handleBookTest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/doctor/tests`,
        { patient: testPatient, testType, date: testDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Test booked successfully!", "success");
      setTestPatient("");
      setTestType("");
      setTestDate("");
    } catch {
      addToast("Failed to book test", "error");
    }
  };

  const openResultModal = (test) => {
    setResultTestId(test._id);
    setResultValue(test.result || "");
    setShowResultModal(true);
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/doctor/tests/${resultTestId}/result`,
        { result: resultValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Result updated successfully!", "success");
      setShowResultModal(false);
      fetchTests();
    } catch {
      addToast("Failed to update result", "error");
    }
  };
const openPrescriptionModal = (appId) => {
    setPrescriptionAppId(appId);
    setMedicines([{ name: '', dosage: '', instructions: '' }]);
    setNotes('');
    setShowPrescriptionModal(true);
    setPrescError(null);
    setPrescSuccess(null);
  };

  const handleMedicineChange = (idx, field, value) => {
    setMedicines(meds => meds.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const addMedicine = () => {
    setMedicines(meds => [...meds, { name: '', dosage: '', instructions: '' }]);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setPrescLoading(true);
    setPrescError(null);
    setPrescSuccess(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/doctor/appointments/${prescriptionAppId}/prescription`, {
        medicines,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescSuccess('Prescription added!');
      addToast('Prescription added!', 'success');
      setShowViewPrescriptionModal(false);
      fetchAppointments(); // Ensure table refreshes
    } catch (err) {
      setPrescError(err.response?.data?.message || 'Failed to add prescription');
      addToast(err.response?.data?.message || 'Failed to add prescription', 'error');
    }
    setPrescLoading(false);
  };

  const handleCancelAppointment = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/doctor/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Appointment cancelled", "success");
      fetchAppointments();
    } catch {
      addToast("Failed to cancel appointment", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">
      <Card className="shadow-lg rounded-3xl border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-sky-600 flex items-center gap-2">
              <ClipboardList className="w-6 h-6" /> Doctor Dashboard
            </h2>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-1 mb-8 bg-sky-50 dark:bg-gray-800 rounded-xl">
              <TabsTrigger
                value="appointments"
                className="flex items-center gap-2 data-[state=active]:bg-sky-600 data-[state=active]:text-white"
              >
                <Pill className="w-4 h-4" /> Appointments
              </TabsTrigger>
              
            </TabsList>

            {/* APPOINTMENTS TAB */}
            <TabsContent value="appointments">
  {loading ? (
    <div className="text-center py-8 text-gray-500">Loading...</div>
  ) : appointments.length === 0 ? (
    <div className="text-gray-500 text-center py-10 text-sm">
      No appointments found.
    </div>
  ) : (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-sky-100 dark:bg-gray-800 text-sky-700 dark:text-gray-200">
            <th className="p-3 text-left font-semibold">Date</th>
            <th className="p-3 text-left font-semibold">Time</th>
            <th className="p-3 text-left font-semibold">Patient</th>
            <th className="p-3 text-left font-semibold">Phone</th>
            <th className="p-3 text-left font-semibold">Age</th>
            <th className="p-3 text-left font-semibold">Gender</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Prescription</th>
            <th className="p-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {appointments.map((app) => (
            <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <td className="p-3">{new Date(app.date).toLocaleDateString()}</td>
              <td className="p-3">{app.time}</td>
              <td className="p-3">{app.patient?.name}</td>
              <td className="p-3">{app.phone || "-"}</td>
              <td className="p-3">{app.age ?? "-"}</td>
              <td className="p-3 capitalize">{app.gender || "-"}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : app.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
              </td>

              {/* View prescription */}
              <td className="p-3">
                {app.prescription ? (
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      setSelectedPrescription(app.prescription);
                      setShowViewPrescriptionModal(true);
                    }}
                  >
                    View
                  </Button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>

              {/* Action buttons */}
              <td className="p-3 flex gap-2 flex-wrap">
                {app.status !== "cancelled" && app.status !== "completed" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => openPrescriptionModal(app._id)}
                    >
                      Add Prescription
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancelAppointment(app._id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</TabsContent>


            {/* BOOK TEST */}
            <TabsContent value="booktest">
              <div className="max-w-md bg-white dark:bg-gray-800 rounded-xl shadow p-5 mx-auto">
                <h4 className="text-lg font-semibold text-sky-600 mb-4">
                  Book Test for Patient
                </h4>
                <form onSubmit={handleBookTest} className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Select Patient</label>
                    <select
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
                      value={testPatient}
                      onChange={(e) => setTestPatient(e.target.value)}
                      required
                    >
                      <option value="">Choose Patient</option>
                      {patients.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Test Type</label>
                    <Input
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Date</label>
                    <Input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  >
                    Book Test
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* TEST RESULTS */}
            <TabsContent value="results">
              {tests.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No test results found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tests.map((test) => (
                    <Card
                      key={test._id}
                      className="p-4 rounded-xl shadow hover:shadow-md transition border border-gray-200 dark:border-gray-700"
                    >
                      <h5 className="text-sky-600 font-semibold mb-1">
                        {test.testType}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <b>Patient:</b> {test.patient?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <b>Date:</b> {new Date(test.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <b>Result:</b> {test.result || "-"}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openResultModal(test)}
                        className="mt-2"
                      >
                        Add / Edit Result
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* RESULT MODAL */}
      {showResultModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-md">
            <h4 className="text-lg font-semibold text-sky-600 mb-3">
              Add / Edit Test Result
            </h4>
            <form onSubmit={handleResultSubmit} className="space-y-4">
              <Input
                value={resultValue}
                onChange={(e) => setResultValue(e.target.value)}
                placeholder="Enter result"
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResultModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ View Prescription Modal */}
<Dialog open={showViewPrescriptionModal && selectedPrescription} onOpenChange={() => setShowViewPrescriptionModal(false)}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold">Prescription Details</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Medicines</h4>
        <ul className="space-y-1">
          {selectedPrescription?.medicines?.map((med, idx) => (
            <li key={idx} className="text-sm">
              <span className="font-semibold">{med.name}</span> — {med.dosage}
              {med.instructions && <span className="text-gray-500"> ({med.instructions})</span>}
            </li>
          ))}
        </ul>
      </div>

      {selectedPrescription?.notes && (
        <div className="text-sm bg-gray-50 p-2 rounded border border-gray-200">
          <span className="font-semibold">Notes:</span> {selectedPrescription.notes}
        </div>
      )}
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setShowViewPrescriptionModal(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


{/* ✅ Add Prescription Modal */}
<Dialog open={showPrescriptionModal} onOpenChange={() => setShowPrescriptionModal(false)}>
<DialogContent
  className="max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-6"
>
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold">Add Prescription</DialogTitle>
    </DialogHeader>

    <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
      
      {medicines.map((med, idx) => (
        <div key={idx} className="border rounded-lg p-3 bg-gray-50 space-y-2">
          <Input
            placeholder="Medicine Name"
            value={med.name}
            onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
            required
          />
          <Input
            placeholder="Dosage"
            value={med.dosage}
            onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
            required
          />
          <Input
            placeholder="Instructions"
            value={med.instructions}
            onChange={(e) => handleMedicineChange(idx, "instructions", e.target.value)}
          />
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addMedicine}>
        + Add Medicine
      </Button>

      <Input
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {prescError && <p className="text-red-500 text-sm">{prescError}</p>}
      {prescSuccess && <p className="text-green-600 text-sm">{prescSuccess}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => setShowPrescriptionModal(false)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={prescLoading}>
          {prescLoading ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>

    </form>
  </DialogContent>
</Dialog>

    </div>
  );
}
