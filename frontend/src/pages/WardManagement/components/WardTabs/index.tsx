import React from 'react';
import { TabKey, Patient, Admission, ProgressForm } from '../../types/wardManagement';
import { TAB_LABELS } from '../../utils/constants';
import PatientDetailsTab from './PatientDetailsTab';
import AdmittingNotesTab from './AdmittingNotesTab';
import ProgressNotesTab from './ProgressNotesTab';
import MedicalHistoryTab from './MedicalHistoryTab';
import AllergicHistoryTab from './AllergicHistoryTab';
import InvestigationsTab from './InvestigationsTab';
import DischargeSummaryTab from './DischargeSummaryTab';

interface WardTabsProps {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  patient: Patient;
  activeAdmission?: Admission;
  progressForm: ProgressForm;
  handleProgressChange: (
    field: keyof ProgressForm
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitProgress: (e: React.FormEvent) => void;
  progressNotes: any[];
  medicalProblems: string[];
  setMedicalProblems: (problems: string[]) => void;
  allergyProblems: string[];
  setAllergyProblems: (problems: string[]) => void;
  dischargeSummaryState: any;
  handleCreateDischargeSummary: () => void;
  creating: boolean;
}

const WardTabs: React.FC<WardTabsProps> = ({
  tab,
  setTab,
  patient,
  activeAdmission,
  progressForm,
  handleProgressChange,
  handleSubmitProgress,
  progressNotes,
  medicalProblems,
  setMedicalProblems,
  allergyProblems,
  setAllergyProblems,
  dischargeSummaryState,
  handleCreateDischargeSummary,
  creating
}) => {
  return (
    <>
      <section className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
              tab === key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {TAB_LABELS[key]}
          </button>
        ))}
      </section>

      <div className="space-y-4">
        {tab === "patient-details" && (
          <PatientDetailsTab patient={patient} activeAdmission={activeAdmission} />
        )}
        {tab === "admitting-notes" && (
          <AdmittingNotesTab patient={patient} activeAdmission={activeAdmission} />
        )}
        {tab === "progress-notes" && (
          <ProgressNotesTab
            progressForm={progressForm}
            onChange={handleProgressChange}
            onSubmit={handleSubmitProgress}
            notes={progressNotes}
          />
        )}
        {tab === "medical-history" && (
          <MedicalHistoryTab
            problems={medicalProblems}
            setProblems={setMedicalProblems}
          />
        )}
        {tab === "allergic-history" && (
          <AllergicHistoryTab
            problems={allergyProblems}
            setProblems={setAllergyProblems}
          />
        )}
        {tab === "investigations" && <InvestigationsTab />}
        {tab === "discharge-summary" && (
          <DischargeSummaryTab
            patient={patient}
            medicalProblems={medicalProblems}
            allergyProblems={allergyProblems}
            dischargeSummaryState={dischargeSummaryState}
            onCreate={handleCreateDischargeSummary}
            creating={creating}
            activeAdmission={activeAdmission}
          />
        )}
      </div>
    </>
  );
};

export default WardTabs;