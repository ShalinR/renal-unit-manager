import React from 'react';
import { Patient, Admission } from '../../types/wardManagement';
import ReadField from '../ReadField';

interface PatientDetailsTabProps {
  patient: Patient;
  activeAdmission?: Admission;
}

const PatientDetailsTab: React.FC<PatientDetailsTabProps> = ({ patient, activeAdmission }) => {

  console.log("PatientDetailsTab → patient:", patient);
  console.log("PatientDetailsTab → patient phone:", patient.phone);
  console.log("PatientDetailsTab → patient:", patient.phone);
  console.log("PatientDetailsTab → activeAdmission:", activeAdmission);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Demographics
      </h3>
      <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
        <ReadField label="PHN" value={patient.phn} />
        <ReadField label="Patient Name" value={patient.name} />
        <ReadField
          label="BHT Number"
          value={activeAdmission?.bhtNumber || "–"}
        />

        <ReadField label="Patient Address" value={patient.address} />
        <ReadField label="Telephone Number" value={patient.phone} />
        <ReadField label="NIC No" value={patient.nic} />

        <ReadField label="Date of Birth" value={patient.dob} />
        <ReadField label="Age" value={formatAge(patient.dob)} />
        <ReadField label="Sex" value={patient.sex as string} />

        <ReadField label="MOH Area" value={patient.mohArea} />
        <ReadField label="Ethnic Group" value={patient.ethnicGroup} />
        <ReadField label="Religion" value={patient.religion} />

        <ReadField label="Occupation" value={patient.occupation} />
        <ReadField label="Marital Status" value={patient.maritalStatus} />
        <ReadField label="Primary Diagnosis" value={activeAdmission?.primaryDiagnosis} />
      </div>
    </div>
  );
};


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

export default PatientDetailsTab;