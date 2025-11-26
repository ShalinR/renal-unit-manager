import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Patient, DischargeSummaryState } from '../../types/wardManagement';
import { ICD10_CODES } from '../../utils/constants';
import ReadField from '../ReadField';
import InputField from '../InputField';
import SectionTitle from '../SectionTitle';

interface DischargeSummaryTabProps {
  patient: Patient;
  medicalProblems: string[];
  allergyProblems: string[];
  dischargeSummaryState: DischargeSummaryState & {
    setIcd10: (value: string) => void;
    setDiagnosis: (value: string) => void;
    setProgress: (value: string) => void;
    setManagement: (value: string) => void;
    setDischargePlan: (value: string) => void;
    setFreeDrugs: (value: string) => void;
    setDischargeDate: (value: string) => void;
  };
  onCreate: () => void;
  creating: boolean;
  activeAdmission?: any;
}

const DischargeSummaryTab: React.FC<DischargeSummaryTabProps> = ({
  patient,
  medicalProblems,
  allergyProblems,
  dischargeSummaryState,
  onCreate,
  creating,
  activeAdmission
}) => {
  const medList = medicalProblems.filter((p) => p.trim().length > 0);
  const allergyList = allergyProblems.filter((p) => p.trim().length > 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Discharge Summary Builder
        </h3>

        {/* 1. Patient details */}
        <SectionTitle>1. Patient Details</SectionTitle>
        <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
          <ReadField label="Name" value={patient.name} />
          <ReadField label="Age" value={formatAge(patient.dateOfBirth)} />
          <ReadField label="Sex" value={patient.gender as string} />
          <ReadField label="PHN" value={patient.phn} />
          <ReadField label="BHT Number" value={activeAdmission?.bhtNumber || "–"} />
          <ReadField label="Admitting Hospital" value="Teaching Hospital Peradeniya" />
          <ReadField
            label="Date of Admission"
            value={activeAdmission?.admittedOn || "–"}
          />
          <InputField
            label="Date of Discharge *"
            type="date"
            value={dischargeSummaryState.dischargeDate}
            onChange={(e) => dischargeSummaryState.setDischargeDate(e.target.value)}
          />
        </div>

        {/* 2. Diagnosis */}
        <SectionTitle>2. Diagnosis *</SectionTitle>
        <TextAreaField
          value={dischargeSummaryState.diagnosis}
          onChange={(e) => dischargeSummaryState.setDiagnosis(e.target.value)}
          placeholder="Final diagnosis for this admission..."
        />

        {/* 3. ICD-10 code */}
        <SectionTitle>3. ICD-10 Code *</SectionTitle>
        <select
          className="mb-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
          value={dischargeSummaryState.icd10}
          onChange={(e) => dischargeSummaryState.setIcd10(e.target.value)}
        >
          <option value="">Select ICD-10 code</option>
          {ICD10_CODES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>

        {/* 4. Medical history */}
        <SectionTitle>4. Medical History</SectionTitle>
        {medList.length === 0 ? (
          <p className="mb-2 text-xs text-slate-500">
            No medical history recorded in the Medical History tab.
          </p>
        ) : (
          <ul className="mb-2 list-disc pl-5 text-xs text-slate-700">
            {medList.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}

        {/* 5. Allergies */}
        <SectionTitle>5. Allergies</SectionTitle>
        {allergyList.length === 0 ? (
          <p className="mb-2 text-xs text-slate-500">
            No allergies recorded in the Allergic History tab.
          </p>
        ) : (
          <ul className="mb-2 list-disc pl-5 text-xs text-slate-700">
            {allergyList.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}

        {/* 6. Admission details */}
        <SectionTitle>6. Admission Details</SectionTitle>
        <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
          <ReadField
            label="Type of Admission"
            value={activeAdmission?.admissionType || "–"}
          />
          <ReadField
            label="Admitting Officer"
            value={activeAdmission?.admittingOfficer || "–"}
          />
          <ReadField
            label="Ward / Bed"
            value={`${activeAdmission?.wardNumber || activeAdmission?.ward} / ${activeAdmission?.bedId || "-"}`}
          />
          <ReadField label="Referred From" value={activeAdmission?.referredBy || "–"} />
          <ReadField
            label="Presenting Complaints"
            value={activeAdmission?.presentingComplaints || "–"}
          />
          <ReadField
            label="Date of Admission"
            value={activeAdmission?.admittedOn || "–"}
          />
        </div>

        {/* 7. Examinations */}
        <SectionTitle>7. Examinations</SectionTitle>
        <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
          <ReadField
            label="Temperature (°C)"
            value={activeAdmission?.examTempC?.toString() || "–"}
          />
          <ReadField
            label="Height (cm)"
            value={activeAdmission?.examHeightCm?.toString() || "–"}
          />
          <ReadField
            label="Weight (kg)"
            value={activeAdmission?.examWeightKg?.toString() || "–"}
          />
          <ReadField
            label="BMI (kg/m²)"
            value={activeAdmission?.examBMI ? activeAdmission.examBMI.toFixed(1) : "–"}
          />
          <ReadField
            label="Blood Pressure"
            value={activeAdmission?.examBloodPressure || "–"}
          />
          <ReadField
            label="Heart Rate (bpm)"
            value={activeAdmission?.examHeartRate?.toString() || "–"}
          />
        </div>

        {/* 8. Progress summary */}
        <SectionTitle>8. Progress</SectionTitle>
        <TextAreaField
          value={dischargeSummaryState.progress}
          onChange={(e) => dischargeSummaryState.setProgress(e.target.value)}
          placeholder="Free-hand summary of ward progress, key events and complications..."
        />

        {/* 9. Drugs */}
        <SectionTitle>9. Drugs</SectionTitle>
        <p className="mb-1 text-[11px] text-slate-500">
          In future this will be auto-filled from the Medications module. For
          now, you can type the discharge drug list below.
        </p>
        <TextAreaField
          value={dischargeSummaryState.freeDrugs}
          onChange={(e) => dischargeSummaryState.setFreeDrugs(e.target.value)}
          placeholder="List of drugs on discharge (name, dose, frequency)..."
        />

        {/* 10. Management */}
        <SectionTitle>10. Management</SectionTitle>
        <TextAreaField
          value={dischargeSummaryState.management}
          onChange={(e) => dischargeSummaryState.setManagement(e.target.value)}
          placeholder="Important management decisions, procedures, dialysis plan..."
        />

        {/* 11. Discharge plan */}
        <SectionTitle>11. Discharge Plan</SectionTitle>
        <TextAreaField
          value={dischargeSummaryState.dischargePlan}
          onChange={(e) => dischargeSummaryState.setDischargePlan(e.target.value)}
          placeholder="Follow-up clinic, next dialysis date, lifestyle advice, red-flag symptoms..."
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-xs font-semibold text-blue-800 mb-2">Required Fields</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Date of Discharge</li>
            <li>• Diagnosis</li>
            <li>• ICD-10 Code</li>
          </ul>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onCreate}
            disabled={creating || !dischargeSummaryState.dischargeDate || !dischargeSummaryState.diagnosis || !dischargeSummaryState.icd10}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <FileText className="mr-2 h-3.5 w-3.5" />
                Create Discharge Summary
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const TextAreaField: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => (
  <textarea
    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
    rows={3}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

const formatAge = (dobISO?: string): string => {
  if (!dobISO) return "–";
  const dob = new Date(dobISO);
  if (Number.isNaN(dob.getTime())) return "–";
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return `${age}`;
};

export default DischargeSummaryTab;