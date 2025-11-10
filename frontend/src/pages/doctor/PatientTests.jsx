import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { ToastContext } from '../../contexts/ToastContext';
import { Loader2, FileText, Save } from 'lucide-react';

export default function PatientTests() {
  const { token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState({});

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
    } catch (err) {
      addToast('Failed to load bookings', 'error');
    }
    setLoading(false);
  };

  const saveNotes = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/test-bookings/${id}/notes`,
        { notes: editingNotes[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast('Notes saved', 'success');
      fetchBookings();
    } catch (err) {
      addToast('Failed to save notes', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold text-center mb-4 text-sky-700">
        🧪 Patient Test Bookings
      </h3>

      {loading ? (
        <div className="d-flex justify-content-center mt-5">
          <Loader2 className="animate-spin text-sky-600" size={32} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-muted mt-5">
          No test bookings found.
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => (
            <div className="col-md-6 col-lg-4" key={b._id}>
              <div
                className="card shadow-sm border-0 h-100"
                style={{ borderRadius: '16px' }}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title text-sky-700 fw-semibold mb-1">
                      {b.testId?.name}
                    </h5>
                    <p className="text-muted small mb-2">
                      <strong>Patient:</strong> {b.patientId?.name} (
                      {b.patientId?.email})
                    </p>
                    <p className="text-muted small mb-3">
                      <strong>Date:</strong>{' '}
                      {new Date(b.date).toLocaleDateString()} •{' '}
                      <strong>Slot:</strong> {b.timeSlot}
                    </p>
                    {b.reportFile ? (
                      <a
                        href={`${import.meta.env.VITE_API_URL.replace(
                          '/api',
                          ''
                        )}${b.reportFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-success d-flex align-items-center gap-2"
                      >
                        <FileText size={16} />
                        View Report
                      </a>
                    ) : (
                      <span className="badge bg-light text-secondary">
                        No Report Yet
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Doctor’s Notes
                    </label>
                    <textarea
                      className="form-control shadow-sm"
                      placeholder="Add comments / suggestions"
                      rows="3"
                      value={editingNotes[b._id] || b.notes || ''}
                      onChange={(e) =>
                        setEditingNotes({
                          ...editingNotes,
                          [b._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      className="btn btn-primary btn-sm mt-3 w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => saveNotes(b._id)}
                    >
                      <Save size={16} />
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
