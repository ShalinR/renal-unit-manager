import React, { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Patient, Admission } from '../types/wardManagement';
import { WARD_CONFIG } from '../utils/constants';
import HeaderField from './HeaderField';

interface PatientHeaderProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  loading: boolean;
  notFound: string | null;
  patient: Patient | null;
  activeAdmission?: Admission;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({
  setShowAddModal,
  loading,
  notFound,
  patient,
  activeAdmission,
}) => {
  const [admissionDetails, setAdmissionDetails] = useState<Admission | null>(null);

  // Effect to handle asynchronous loading of activeAdmission
  useEffect(() => {
    if (activeAdmission) {
      setAdmissionDetails(activeAdmission);
    }
  }, [activeAdmission]);

  return (
    <>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Ward Management</h1>
          <p className="text-xs text-slate-500">
            Renal Care Unit – search by PHN from the top bar to load the current admission.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          Add New Patient
        </button>
      </header>

      <h2 className="mb-3 text-center text-sm font-semibold text-slate-700">
        {WARD_CONFIG.hospitalName}
      </h2>

      {loading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading patient details…
        </div>
      )}

      {!loading && notFound && (
        <div className="mt-6 rounded-2xl border border-dashed border-red-200 bg-red-50 p-4 text-center text-xs text-red-700">
          {notFound}
        </div>
      )}

      {!loading && !patient && !notFound && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
          <p className="mb-1 font-semibold">No patient selected.</p>
          <p className="text-xs text-slate-500">
            Search by <span className="font-mono">PHN</span> at the top bar to load the current
            admission for that patient.
          </p>
        </div>
      )}

      {patient && (
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-6">
            <HeaderField label="Name" value={patient.name} />
            <HeaderField label="Date of Birth" value={patient.dob} />
            <HeaderField label="PHN" value={patient.phn} />
            <HeaderField label="BHT Number" value={admissionDetails?.bhtNumber || "–"} />
            <HeaderField label="Age" value={formatAge(patient.dob)} />
            <HeaderField label="Sex" value={patient.sex} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap gap-4">
              <HeaderField
                label="Ward"
                value={admissionDetails?.wardNumber || patient.ward || "–"}
              />
              <HeaderField label="Bed" value={admissionDetails?.bedId || "–"} />
              <HeaderField
                label="Date of Admission"
                value={
                  admissionDetails?.admissionTime
                    ? admissionDetails.admissionTime.split('T')[0]
                    : "–"
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">Current Status</span>
              <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                {patient.status}
              </span>
            </div>
          </div>
        </section>
      )}
    </>
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

export default PatientHeader;