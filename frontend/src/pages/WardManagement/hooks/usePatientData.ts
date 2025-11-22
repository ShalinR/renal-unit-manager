import { useState, useEffect } from 'react';
import { Patient, Admission } from '../types/wardManagement';
import { apiGetPatient, apiGetAdmissions } from '../services/api';

export const usePatientData = (phnQuery: string | null) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatient() {
      if (!phnQuery) {
        setPatient(null);
        setAdmissions([]);
        setNotFound(null);
        return;
      }

      const cleanPhn = phnQuery.replace(/[^0-9]/g, "");
      if (!cleanPhn) {
        setPatient(null);
        setAdmissions([]);
        setNotFound("Invalid PHN - must contain numbers");
        return;
      }

      setLoading(true);
      setNotFound(null);
      setPatient(null);
      setAdmissions([]);

      try {
        const patientData = await apiGetPatient(cleanPhn);
        if (!patientData) {
          setPatient(null);
          setAdmissions([]);
          setNotFound(`No patient found for PHN ${cleanPhn}`);
          return;
        }

        setPatient(patientData);
        const admissionsData = await apiGetAdmissions(cleanPhn);
        setAdmissions(admissionsData);
      } catch (error) {
        console.error("Error loading patient:", error);
        setPatient(null);
        setAdmissions([]);
        setNotFound(`Failed to load patient: ${error.message}. Check if backend is running.`);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadPatient();
    }, 100);

    return () => clearTimeout(timer);
  }, [phnQuery]);

  return { patient, admissions, loading, notFound, setPatient, setAdmissions };
};