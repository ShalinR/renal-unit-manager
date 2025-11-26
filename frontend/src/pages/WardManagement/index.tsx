import React from 'react';
import { useWardManagement } from './hooks/useWardManagement';
import PatientHeader from './components/PatientHeader';
import WardTabs from './components/WardTabs';
import AdmissionsCard from './components/AdmissionsCard';
import AddPatientModal from './components/AddPatientModal';

const WardManagement: React.FC = () => {
  const {
    patient,
    admissions,
    loading,
    notFound,
    tab,
    setTab,
    showAddModal,
    setShowAddModal,
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
    creatingSummary,
    handleCreatePatient,
    handleSaveMedicalProblems,
    handleSaveAllergies
  } = useWardManagement();

  const activeAdmission = admissions.find(a => a.active);

  return (
    <div className="flex w-full">
      <div className="flex-1 px-6 py-6">
        <PatientHeader 
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          loading={loading}
          notFound={notFound}
          patient={patient}
          activeAdmission={activeAdmission}
        />

        {patient && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* LEFT 3/4 – tabs content */}
            <section className="space-y-4 lg:col-span-3">
              <WardTabs
                tab={tab}
                setTab={setTab}
                patient={patient}
                activeAdmission={activeAdmission}
                progressForm={progressForm}
                handleProgressChange={handleProgressChange}
                handleSubmitProgress={handleSubmitProgress}
                progressNotes={progressNotes}
                medicalProblems={medicalProblems}
                setMedicalProblems={setMedicalProblems}
                allergyProblems={allergyProblems}
                setAllergyProblems={setAllergyProblems}
                handleSaveMedicalProblems={handleSaveMedicalProblems}
                handleSaveAllergies={handleSaveAllergies}
                dischargeSummaryState={dischargeSummaryState}
                handleCreateDischargeSummary={handleCreateDischargeSummary}
                creating={creatingSummary}
              />
            </section>

            {/* RIGHT 1/4 – Admission list */}
            <section className="space-y-4 lg:col-span-1">
              <AdmissionsCard admissions={admissions} patientPhn={patient?.phn} />
            </section>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreatePatient}
        />
      )}
    </div>
  );
};

export default WardManagement;