import { useState, useEffect } from 'react';
import { Patient, Admission, ProgressForm } from '../types/wardManagement';
import { apiAddProgressNote, apiGetProgressNote } from '../services/api';

export const useProgressNotes = (patient: Patient | null, admissions: Admission[]) => {
  const [progressForm, setProgressForm] = useState<ProgressForm>({
    tempC: "",
    weightKg: "",
    bpHigh: "",
    bpLow: "",
    heartRate: "",
    inputMl: "",
    urineOutputMl: "",
    pdBalance: "",
    totalBalance: "",
  });

  const [progressNotes, setProgressNotes] = useState<any[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // 🔥 Load all progress notes from backend
  const loadProgressNotes = async () => {
    if (!patient) return;

    const activeAdmission = admissions.find(a => a.active);
    if (!activeAdmission) return;

    setIsLoadingNotes(true);
    try {
      console.log("📄 Fetching progress notes...");
      const notes = await apiGetProgressNote(patient.phn, activeAdmission.id);

      console.log("📄 Result:", notes);
      setProgressNotes(notes || []);
    } catch (error) {
      console.error("❌ Failed to load progress notes:", error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // 🔥 Load notes whenever patient or admission changes
  useEffect(() => {
    loadProgressNotes();
  }, [patient, admissions]);

  const handleProgressChange =
    (field: keyof ProgressForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProgressForm(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patient) {
      alert("No patient selected");
      return;
    }

    const activeAdmission = admissions.find(a => a.active);
    if (!activeAdmission) {
      alert("No active admission found");
      return;
    }

    const hasData = Object.values(progressForm).some(v => v.trim() !== "");
    if (!hasData) {
      alert("Please fill at least one field");
      return;
    }

    const payload = {
      tempC: progressForm.tempC ? Number(progressForm.tempC) : undefined,
      weightKg: progressForm.weightKg ? Number(progressForm.weightKg) : undefined,
      bpHigh: progressForm.bpHigh ? Number(progressForm.bpHigh) : undefined,
      bpLow: progressForm.bpLow ? Number(progressForm.bpLow) : undefined,
      heartRate: progressForm.heartRate ? Number(progressForm.heartRate) : undefined,
      inputMl: progressForm.inputMl ? Number(progressForm.inputMl) : undefined,
      urineOutputMl: progressForm.urineOutputMl ? Number(progressForm.urineOutputMl) : undefined,
      pdBalance: progressForm.pdBalance ? Number(progressForm.pdBalance) : undefined,
      totalBalance: progressForm.totalBalance ? Number(progressForm.totalBalance) : undefined,
    };

    try {
      // Save new note
      await apiAddProgressNote(patient.phn, activeAdmission.id, payload);

      // Instead of adding manually → reload fresh from backend
      await loadProgressNotes();

      // Reset form
      setProgressForm({
        tempC: "",
        weightKg: "",
        bpHigh: "",
        bpLow: "",
        heartRate: "",
        inputMl: "",
        urineOutputMl: "",
        pdBalance: "",
        totalBalance: "",
      });

      alert("Progress note saved successfully!");
    } catch (error: any) {
      console.error("Error adding progress note:", error);
      alert("Failed to add progress note: " + error.message);
    }
  };

  return {
    progressForm,
    progressNotes,
    isLoadingNotes,
    handleProgressChange,
    handleSubmitProgress,
    loadProgressNotes,
  };
};