import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Patient, Admission, ProgressForm, DischargeSummaryState, TabKey, PatientCreatePayload } from '../types/wardManagement';
import { usePatientData } from './usePatientData';
import { useProgressNotes } from './useProgressNotes';
import { useDischargeSummary } from './useDischargeSummary';
import { apiCreatePatient, apiGetMedicalProblems, apiUpdateMedicalProblems, apiGetAllergies, apiUpdateAllergies } from '../services/api';

export const useWardManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const phnQuery = searchParams.get("phn");

  const [tab, setTab] = useState<TabKey>("patient-details");
  const [showAddModal, setShowAddModal] = useState(false);

  const { patient, admissions, loading, notFound, setPatient, setAdmissions } = usePatientData(phnQuery);
  const { progressForm, progressNotes, handleProgressChange, handleSubmitProgress } = useProgressNotes(patient, admissions);
  const { medicalProblems, setMedicalProblems, allergyProblems, setAllergyProblems, dischargeSummaryState, handleCreateDischargeSummary, creatingSummary } = useDischargeSummary(patient, admissions, setAdmissions);

  // Load medical problems and allergies when patient changes
  useEffect(() => {
    if (patient) {
      const med = (patient as any).medicalProblems || [];
      const all = (patient as any).allergies || [];
      setMedicalProblems(med.length > 0 ? med : [""]);
      setAllergyProblems(all.length > 0 ? all : [""]);
    }
  }, [patient, setMedicalProblems, setAllergyProblems]);

  const handleCreatePatient = async (payload: PatientCreatePayload) => {
    try {
      const newPatient = await apiCreatePatient(payload);
      setShowAddModal(false);
      const cleanPhn = payload.phn.replace(/[^0-9]/g, "");
      navigate(`/ward-management?phn=${cleanPhn}`, { replace: true });
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  };

  const handleSaveMedicalProblems = async (problems: string[]) => {
    if (!patient?.phn) return;
    try {
      await apiUpdateMedicalProblems(patient.phn, problems.filter(p => p.trim()));
      setMedicalProblems(problems);
    } catch (error) {
      console.error("Error saving medical problems:", error);
      throw error;
    }
  };

  const handleSaveAllergies = async (allergies: string[]) => {
    if (!patient?.phn) return;
    try {
      await apiUpdateAllergies(patient.phn, allergies.filter(a => a.trim()));
      setAllergyProblems(allergies);
    } catch (error) {
      console.error("Error saving allergies:", error);
      throw error;
    }
  };

  // useEffect(() => {
  //   if (patient) {
  //     setMedicalProblems([""]);
  //     setAllergyProblems([""]);
  //     setTab("patient-details");
  //   }
  // }, [patient, setMedicalProblems, setAllergyProblems]);

  return {
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
  };
};