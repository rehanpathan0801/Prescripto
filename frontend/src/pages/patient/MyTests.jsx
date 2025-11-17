import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastContext } from "../../contexts/ToastContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyTests() {
  const { token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/test-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      addToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/test-bookings/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Booking canceled", "success");
      fetchBookings();
    } catch (err) {
      addToast("Failed to cancel booking", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 mt-6 mb-10 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/patient")}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-full shadow-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        My Test Bookings
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-400 text-lg animate-pulse">
          Loading your tests...
        </div>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 text-lg">
          No bookings yet.
        </div>
      )}

      {/* Bookings List */}
      {!loading && bookings.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-5 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {b.testId?.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(b.date).toLocaleDateString()}
                    <br />
                    <span className="font-medium">Slot:</span> {b.timeSlot}
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-medium">Price:</span> ₹{b.testId?.price}
                  </p>

                  <div className="mb-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : b.status === "Completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {/* View Report */}
                  {b.reportFile ? (
                    <a
                      href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${b.reportFile}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200"
                    >
                      View Report
                    </a>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">
                      No report yet
                    </span>
                  )}

                  {/* Cancel Button */}
                  {b.status === "Pending" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
