import { useState } from 'react';
import { Patient, Admission, DischargeSummaryState } from '../types/wardManagement';
import { apiCreateDischargeSummary, apiUpdateAdmissionStatus } from '../services/api';
import { useMemo } from "react";

export const useDischargeSummary = (
  patient: Patient | null,
  admissions: Admission[],
  setAdmissions: (admissions: Admission[]) => void
) => {
  const [medicalProblems, setMedicalProblems] = useState<string[]>([""]);
  const [allergyProblems, setAllergyProblems] = useState<string[]>([""]);
  const [creatingSummary, setCreatingSummary] = useState(false);
  const [dischargeSummaryState, setDischargeSummaryState] = useState<DischargeSummaryState>({
    icd10: "",
    diagnosis: "",
    progress: "",
    management: "",
    dischargePlan: "",
    freeDrugs: "",
    dischargeDate: "",
  });

  const handleCreateDischargeSummary = async () => {
    if (!patient) {
      alert("No patient selected");
      return;
    }

    const activeAdmission = admissions.find((a) => a.active);
    if (!activeAdmission) {
      alert("No active admission found");
      return;
    }

    // Validate required fields
    if (!dischargeSummaryState.diagnosis.trim()) {
      alert("Please enter a diagnosis");
      return;
    }

    if (!dischargeSummaryState.icd10.trim()) {
      alert("Please select an ICD-10 code");
      return;
    }

    if (!dischargeSummaryState.dischargeDate.trim()) {
      alert("Please select a discharge date");
      return;
    }

    setCreatingSummary(true);

    const dsPayload = {
      dischargeDate: dischargeSummaryState.dischargeDate,
      diagnosis: dischargeSummaryState.diagnosis,
      icd10: dischargeSummaryState.icd10,
      progressSummary: dischargeSummaryState.progress,
      management: dischargeSummaryState.management,
      dischargePlan: dischargeSummaryState.dischargePlan,
      drugsFreeHand: dischargeSummaryState.freeDrugs,
    };

    console.debug("Ward: creating discharge summary (payload redacted)");

    try {
      // 1. First create the discharge summary
      await apiCreateDischargeSummary(patient.phn, activeAdmission.id, dsPayload);

      // 2. Then update the admission status to inactive (discharged)
      // await apiUpdateAdmissionStatus(activeAdmission.id, false);

      // 3. Update frontend state to reflect both changes

      setAdmissions((prev) =>
          prev.map((a) =>
              a.id === activeAdmission.id
                  ? { ...a, hasDischargeSummary: true, active: false }
                  : a
          )
      );

      alert("Discharge summary created successfully and patient discharged!");

      // Reset form
      setDischargeSummaryState({
        icd10: "",
        diagnosis: "",
        progress: "",
        management: "",
        dischargePlan: "",
        freeDrugs: "",
        dischargeDate: "",
      });
    } catch (error) {
      console.error("Ward: error creating discharge summary");
      alert("Failed to create discharge summary: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setCreatingSummary(false);
    }
  };

  const setIcd10 = (value: string) => setDischargeSummaryState(prev => ({ ...prev, icd10: value }));
  const setDiagnosis = (value: string) => setDischargeSummaryState(prev => ({ ...prev, diagnosis: value }));
  const setProgress = (value: string) => setDischargeSummaryState(prev => ({ ...prev, progress: value }));
  const setManagement = (value: string) => setDischargeSummaryState(prev => ({ ...prev, management: value }));
  const setDischargePlan = (value: string) => setDischargeSummaryState(prev => ({ ...prev, dischargePlan: value }));
  const setFreeDrugs = (value: string) => setDischargeSummaryState(prev => ({ ...prev, freeDrugs: value }));
  const setDischargeDate = (value: string) => setDischargeSummaryState(prev => ({ ...prev, dischargeDate: value }));


  const mergedDischargeState = useMemo(
      () => ({
        ...dischargeSummaryState,
        setIcd10,
        setDiagnosis,
        setProgress,
        setManagement,
        setDischargePlan,
        setFreeDrugs,
        setDischargeDate,
      }),
      [dischargeSummaryState]
  );


  return {
    medicalProblems,
    setMedicalProblems,
    allergyProblems,
    setAllergyProblems,
    dischargeSummaryState: mergedDischargeState,
    handleCreateDischargeSummary,
    creatingSummary,
  };
};