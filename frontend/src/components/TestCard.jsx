import React from 'react';

export default function TestCard({ test, onBook }) {
  // prevent crash if test is undefined
  if (!test) return null;

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
      style={{ borderRadius: 12 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h5 className="text-lg font-semibold mb-1">{test?.name || "Test Name N/A"}</h5>
          <p className="text-gray-600 text-sm mb-2">{test?.description || "No description available"}</p>
          <div className="mb-2 text-gray-800">
            <strong>Price:</strong> ₹{test?.price || "N/A"}
          </div>
          <div className="text-sm text-gray-500">
            <strong>Report Time:</strong> {test?.reportTime || "24-48 hrs"}
          </div>
        </div>
        <div>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            onClick={() => onBook(test)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
