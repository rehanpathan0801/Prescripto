import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastContext } from "../../contexts/ToastContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Loader2,
  Upload,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function ManageTestBookings() {
  const { token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "all", test: "" });
  const [fileFor, setFileFor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/test-bookings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data);
    } catch {
      addToast("Failed to load bookings", "error");
    }
    setLoading(false);
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/test-bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Status updated", "success");
      fetchBookings();
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileFor) return;
    const formData = new FormData();
    formData.append("report", fileFor.file);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/test-bookings/${fileFor.id}/upload-report`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      addToast("Report uploaded", "success");
      setFileFor(null);
      fetchBookings();
    } catch {
      addToast("Upload failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/test-bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Booking deleted", "success");
      fetchBookings();
    } catch {
      addToast("Delete failed", "error");
    }
  };

  const filtered = bookings.filter((b) => {
    if (filters.status !== "all" && b.status !== filters.status) return false;
    if (
      filters.test &&
      b.testId?.name &&
      !b.testId.name.toLowerCase().includes(filters.test.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
        {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Test Bookings</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={filters.status}
          onValueChange={(val) => setFilters({ ...filters, status: val })}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className="w-full sm:w-[300px]"
          placeholder="Search by Test Name"
          value={filters.test}
          onChange={(e) => setFilters({ ...filters, test: e.target.value })}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-primary" />
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-center text-gray-500 shadow-sm">
          No bookings match the selected filters.
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm text-left rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Test</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Report</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.patientId?.name}</div>
                    <div className="text-xs text-gray-500">
                      {b.patientId?.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">{b.testId?.name}</td>
                  <td className="px-4 py-3">
                    {new Date(b.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        b.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "Canceled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.reportFile ? (
                      <a
                        href={`${import.meta.env.VITE_API_URL.replace(
                          "/api",
                          ""
                        )}${b.reportFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex flex-wrap justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                      onClick={() => handleStatus(b._id, "Completed")}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Complete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                      onClick={() => handleStatus(b._id, "Canceled")}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDelete(b._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                    <label className="cursor-pointer flex items-center border rounded-md px-3 py-1 text-blue-600 border-blue-300 hover:bg-blue-50 text-sm">
                      <Upload className="w-4 h-4 mr-1" /> Upload
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          setFileFor({ id: b._id, file: e.target.files[0] })
                        }
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fileFor && (
        <form
          onSubmit={handleUpload}
          className="mt-5 flex flex-wrap items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm"
        >
          <div className="text-gray-700 text-sm">
            Uploading for booking: <b>{fileFor.id}</b>
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Upload
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFileFor(null)}
            className="border-gray-300"
          >
            Cancel
          </Button>
        </form>
      )}
    </div>
  );
}
