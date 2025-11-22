import React from 'react';
import { Patient, Admission } from '../../types/wardManagement';
import ReadField from '../ReadField';

interface AdmittingNotesTabProps {
  patient: Patient;
  activeAdmission?: Admission;
}

const AdmittingNotesTab: React.FC<AdmittingNotesTabProps> = ({ patient, activeAdmission }) => {
  // Format admission time to display only time part
  const formatAdmissionTime = (dateTimeString?: string): string => {
    if (!dateTimeString) return "–";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return "–";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Admitting Notes
      </h3>
      <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
        <ReadField
          label="Type of Admission"
          value={activeAdmission.admissionType || "–"}
        />
        <ReadField
          label="Admitting Officer"
          value={activeAdmission.admittingOfficer || "–"}
        />
        <ReadField
          label="Admitting Hospital"
          value={activeAdmission.referredBy || "Teaching Hospital Peradeniya"}
        />
        <ReadField
          label="Ward / Bed"
          value={`${activeAdmission.wardNumber || activeAdmission.ward} / ${
            activeAdmission.bedId || "-"
          }`}
        />
        <ReadField label="Date of Admission" value={activeAdmission.admissionTime ? activeAdmission.admissionTime.split('T')[0] : "–"} />
        <ReadField label="Time of Admission" value={formatAdmissionTime(activeAdmission.admissionTime) || "–"} />
      </div>
      <div className="mt-4">
        <label className="mb-1 block text-[11px] font-medium text-slate-600">
          Presenting Complaints
        </label>
        <textarea
          readOnly
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
          value={activeAdmission.presentingComplaints || "No presenting complaints recorded"}
        />
      </div>

      {/* Examinations */}
      <div className="mt-4">
        <h4 className="mb-2 text-xs font-semibold text-slate-700">
          Examinations at Admission
        </h4>
        <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
          <ReadField
            label="Temperature (°C)"
            value={activeAdmission.examTempC?.toString() || "–"}
          />
          <ReadField
            label="Height (cm)"
            value={activeAdmission.examHeightCm?.toString() || "–"}
          />
          <ReadField
            label="Body Weight (kg)"
            value={activeAdmission.examWeightKg?.toString() || "–"}
          />
          <ReadField
            label="BMI (kg/m²)"
            value={activeAdmission.examBMI ? activeAdmission.examBMI.toFixed(1) : "–"}
          />
          <ReadField
            label="Blood Pressure (mmHg)"
            value={activeAdmission.examBloodPressure || "–"}
          />
          <ReadField
            label="Heart Rate (bpm)"
            value={activeAdmission.examHeartRate?.toString() || "–"}
          />
        </div>
      </div>
    </div>
  );
};

export default AdmittingNotesTab;