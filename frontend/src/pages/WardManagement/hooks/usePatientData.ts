import { useState, useEffect } from 'react';
import { Patient, Admission } from '../types/wardManagement';
import { apiGetPatient, apiGetAdmissions } from '../services/api';

export const usePatientData = (phnQuery: string | null) => {
  const [patient, setPatient] = useState<Patient | null>(() => {
    // Initialize from localStorage if available
    const cached = localStorage.getItem('wardPatient');
    return cached ? JSON.parse(cached) : null;
  });
  
  const [admissions, setAdmissions] = useState<Admission[]>(() => {
    const cached = localStorage.getItem('wardAdmissions');
    return cached ? JSON.parse(cached) : [];
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [lastSearchedPhn, setLastSearchedPhn] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatient() {
      // If no new phnQuery and we already have a patient, keep it (persist)
      if (!phnQuery) {
        return;
      }

      const cleanPhn = phnQuery.replace(/[^0-9]/g, "");
      if (!cleanPhn) {
        setPatient(null);
        setAdmissions([]);
        localStorage.removeItem('wardPatient');
        localStorage.removeItem('wardAdmissions');
        setNotFound("Invalid PHN - must contain numbers");
        return;
      }

      // Only fetch if the PHN has changed (different search)
      if (lastSearchedPhn === cleanPhn) {
        return;
      }

      setLastSearchedPhn(cleanPhn);
      setLoading(true);
      setNotFound(null);

      try {
        const patientData = await apiGetPatient(cleanPhn);
        if (!patientData) {
          setPatient(null);
          setAdmissions([]);
          localStorage.removeItem('wardPatient');
          localStorage.removeItem('wardAdmissions');
          setNotFound(`No patient found for PHN ${cleanPhn}`);
          return;
        }

        setPatient(patientData);
        localStorage.setItem('wardPatient', JSON.stringify(patientData));
        
        const admissionsData = await apiGetAdmissions(cleanPhn);
        setAdmissions(admissionsData);
        localStorage.setItem('wardAdmissions', JSON.stringify(admissionsData));
      } catch (error) {
        console.error("Error loading patient:", error);
        setPatient(null);
        setAdmissions([]);
        localStorage.removeItem('wardPatient');
        localStorage.removeItem('wardAdmissions');
        setNotFound(`Failed to load patient: ${error.message}. Check if backend is running.`);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadPatient();
    }, 100);

    return () => clearTimeout(timer);
  }, [phnQuery, lastSearchedPhn]);

  return { patient, admissions, loading, notFound, setPatient, setAdmissions };
};