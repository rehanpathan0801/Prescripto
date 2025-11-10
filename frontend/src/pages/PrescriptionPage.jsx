import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import PrescriptionTemplate from '../components/PrescriptionTemplate';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PrescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/prescriptions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrescription(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load prescription');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id, token]);

  const downloadPDF = async () => {
    if (!prescription) return;
    setDownloading(true);
    try {
      const input = document.getElementById('prescription-to-pdf');
      if (!input) throw new Error('Printable element not found');

      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const filename = `${prescription.patientName || 'prescription'}_${new Date(
        prescription.date
      ).toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error(err);
      alert('Could not generate PDF. See console for details.');
    } finally {
      setDownloading(false);
    }
  };

  const print = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading prescription...
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-50 text-red-600 rounded-xl shadow-sm text-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">🩺 Prescription Details</h1>
          <div className="flex gap-2 mt-3 md:mt-0">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              ← Back
            </button>
            <button
              onClick={print}
              className="px-4 py-2 bg-white border border-sky-400 text-sky-600 font-medium rounded-lg hover:bg-sky-50 transition"
            >
              🖨️ Print
            </button>
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className={`px-4 py-2 font-medium rounded-lg shadow-sm transition ${
                downloading
                  ? 'bg-sky-300 text-white cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {downloading ? 'Preparing...' : '⬇️ Download PDF'}
            </button>
          </div>
        </div>

        {/* Prescription Content */}
        <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-gray-100 shadow-inner">
          <PrescriptionTemplate prescription={prescription} />
        </div>
      </div>
    </div>
  );
}
