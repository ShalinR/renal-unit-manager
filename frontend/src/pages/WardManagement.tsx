import React, { useState }  from 'react';
import { useWardManagement } from './WardManagement/hooks/useWardManagement';
import PatientHeader from './WardManagement/components/PatientHeader';
import WardTabs from './WardManagement/components/WardTabs';
import AdmissionsCard from './WardManagement/components/AdmissionsCard';
import AddPatientModal from './WardManagement/components/AddPatientModal';

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
                dischargeSummaryState={dischargeSummaryState}
                handleCreateDischargeSummary={handleCreateDischargeSummary}
                creating={creatingSummary}
                handleSaveMedicalProblems={handleSaveMedicalProblems}
                handleSaveAllergies={handleSaveAllergies}

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

// OLD CODE
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Building2, Users, Bed, Clock } from "lucide-react";

// const WardManagement = () => {
//   return (
//     <div className="space-y-6">
//       <div className="text-center space-y-4">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
//           <Building2 className="w-8 h-8 text-primary" />
//         </div>
//         <h1 className="text-4xl font-bold text-foreground">
//           Ward Management
//         </h1>
//         <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//           Efficient ward operations and bed management system
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
//             <Bed className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">120</div>
//             <p className="text-xs text-muted-foreground">
//               Across 8 wards
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Occupied Beds</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">98</div>
//             <p className="text-xs text-muted-foreground">
//               82% occupancy rate
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
//             <Bed className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">22</div>
//             <p className="text-xs text-muted-foreground">
//               Ready for admission
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Avg. Stay Duration</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">4.2</div>
//             <p className="text-xs text-muted-foreground">
//               days
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Ward Status</CardTitle>
//             <CardDescription>
//               Current status of all wards
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center p-3 border rounded-lg">
//                 <div>
//                   <p className="font-medium">Ward A - General Renal</p>
//                   <p className="text-sm text-muted-foreground">15/20 beds occupied</p>
//                 </div>
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               </div>
//               <div className="flex justify-between items-center p-3 border rounded-lg">
//                 <div>
//                   <p className="font-medium">Ward B - Dialysis Unit</p>
//                   <p className="text-sm text-muted-foreground">18/20 beds occupied</p>
//                 </div>
//                 <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//               </div>
//               <div className="flex justify-between items-center p-3 border rounded-lg">
//                 <div>
//                   <p className="font-medium">Ward C - Transplant Recovery</p>
//                   <p className="text-sm text-muted-foreground">12/15 beds occupied</p>
//                 </div>
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               </div>
//               <div className="flex justify-between items-center p-3 border rounded-lg">
//                 <div>
//                   <p className="font-medium">Ward D - ICU Renal</p>
//                   <p className="text-sm text-muted-foreground">8/10 beds occupied</p>
//                 </div>
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Admissions</CardTitle>
//             <CardDescription>
//               Latest patient admissions and transfers
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center space-x-4">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Sarah Wilson - Ward A</p>
//                   <p className="text-xs text-muted-foreground">Admitted 30 minutes ago</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Robert Brown - Ward B</p>
//                   <p className="text-xs text-muted-foreground">Transferred from Ward A</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Lisa Davis - Ward C</p>
//                   <p className="text-xs text-muted-foreground">Discharge scheduled</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default WardManagement;
