import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContext } from '../contexts/ToastContext';

export default function TestBookingModal({ test, onClose, onBooked }) {
  const { token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [loading, setLoading] = useState(false);

  if (!test) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/test-bookings`,
        {
          testId: test._id,
          date,
          timeSlot,
          paymentMode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast('Test booked successfully!', 'success');
      onBooked(res.data);
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Book Test: {test.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200"
            >
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200"
            >
              <option>Cash</option>
              <option>Online</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
