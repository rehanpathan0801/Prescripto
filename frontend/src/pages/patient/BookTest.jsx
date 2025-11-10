import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TestCard from '../../components/TestCard';
import TestBookingModal from '../../components/TestBookingModal';
import { AuthContext } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, FlaskConical, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookTest() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedTests = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setTests(fetchedTests);
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError('Failed to load tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooked = () => {
    // optional: show toast or refresh list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/patient')}
          className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          🧪 Available Medical Tests
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Browse available diagnostic tests and book instantly.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-300">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          Loading available tests...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center text-red-600 bg-red-50 border border-red-300 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 mr-2" /> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tests.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <FlaskConical className="w-10 h-10 mb-2" />
          <p>No tests found at the moment.</p>
        </div>
      )}

      {/* Test Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
      >
        {tests.map((t, i) => (
          <motion.div
            key={t._id || i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TestCard
              test={t}
              onBook={(test) => setSelectedTest(test)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Booking Modal */}
      {selectedTest && (
        <TestBookingModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onBooked={handleBooked}
        />
      )}
    </div>
  );
}
