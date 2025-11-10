import React from "react";
import presIcon from "../assets/pres.png";
import RxIcon from "../assets/Rx.png";

export default function PrescriptionTemplate({ prescription }) {
  if (!prescription) return null;

  const {
    patientName,
    doctorName,
    clinicName,
    clinicWebsite,
    date,
    medicines = [],
    notes,
    patient,
    doctor,
  } = prescription;


  const displayPatient = patientName || patient?.name || "Patient Name";
  const displayDoctor = doctorName || doctor?.name || "Dr. Name";
  const displayClinic = clinicName || "Prescripto ";
  

  return (
    <div
      id="prescription-to-pdf"
      style={{
      maxWidth: "650px",  
      width: "100%",
      margin: "auto",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: "30px",     
      fontFamily: "'Segoe UI', sans-serif",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    }}

    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #2a7de1",
          paddingBottom: 10,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#000000ff" }}>{displayClinic}</h2>
          {clinicWebsite && (
            <div style={{ fontSize: 13, color: "#666" }}>{clinicWebsite}</div>
          )}
        </div>
       
       <img 
            src={presIcon}
            alt="Clinic Logo" 
            style={{ width: 50, height: 50 }} 
          />
      </div>

      {/* Patient / Doctor Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          fontSize: 15,
        }}
      >
        <div>
          <div>
            <strong>Patient:</strong> {displayPatient}
          </div>
          <div>
            <strong>Doctor:</strong> Dr.{displayDoctor}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>
            <strong>Date:</strong>{" "}
            {date ? new Date(date).toLocaleDateString() : "-"}
          </div>
        </div>
      </div>

 
      <div>
        <div style={{ fontSize: 40, marginRight: 20 }}>
         <img 
            src={RxIcon}
            alt="Clinic Logo" 
            style={{ width: 50, height: 50 }} 
          /> 
        </div>
        <div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
              fontSize: 14,
              marginTop: 20,
            }}
          >
            <thead>
              <tr style={{ background: "#f4f8ff" }}>
                <th style={thStyle}>Medicine</th>
                <th style={thStyle}>Dosage</th>
      
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{m.name}</td>
                  <td style={tdStyle}>{m.dosage || "-"}</td>
                  <td style={tdStyle}>{m.instructions || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div style={{ marginTop: 20 }}>
          <h4
            style={{
              marginBottom: 8,
              color: "#2a7de1",
              borderBottom: "1px solid #ddd",
              paddingBottom: 6,
            }}
          >
            Notes
          </h4>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{notes}</p>
        </div>
      )}

       {/* Signature */}
      <div style={{ marginTop: 40, textAlign: "right" }}>
        <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
          {displayDoctor}
        </div>
        <div
          style={{
            marginTop: 20,
            borderTop: "1px dashed #333",
            width: 220,
            marginLeft: "auto",
            paddingTop: 4,
            textAlign: "center",
            fontSize: 14,
            color: "#555",
          }}
        >
          Signature
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "2px solid #2a7de1",
          marginTop: 40,
          paddingTop: 10,
          textAlign: "center",
          fontSize: 13,
          color: "#666",
        }}
      >
        <div>{displayClinic}</div>
        
      </div>
    </div>
  );
}

const thStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  textAlign: "center",
  fontWeight: 600,
  color: "#333",
};

const tdStyle = {
  padding: "6px",
  border: "1px solid #ddd",
  textAlign: "center",
};
