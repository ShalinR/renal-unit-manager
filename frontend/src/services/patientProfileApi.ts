import { apiFetch } from "../lib/api";

const API_BASE_URL = "http://localhost:8081/api/patient-profile";

export interface PatientProfile {
  patientId: number;
  phn: string;
  name: string;
  age: number;
  gender: string;
  dateOfBirth?: string;
  occupation?: string;
  address?: string;
  nicNo?: string;
  contactDetails?: string;
  emailAddress?: string;

  // Assessment data
  recipientAssessment?: any;
  donorAssessment?: any;
  ktSurgery?: any;
  followUps?: any[];
}

/**
 * Fetch complete patient profile by PHN
 * Includes patient info, recipient assessment, donor assessment, KT surgery, and follow-ups
 */
export const getPatientProfile = async (phn: string): Promise<PatientProfile | null> => {
  try {
    console.debug('patientProfileApi: fetching patient profile (PHI redacted)');
    const url = `${API_BASE_URL}/${phn}`;
    const response = await apiFetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.warn("patientProfileApi: Failed to fetch profile (status redacted)");
      return null;
    }

    const data: PatientProfile = await response.json();
    console.debug('patientProfileApi: fetched patient profile (result redacted)');
    return data;
  } catch (error) {
    console.error('patientProfileApi: error fetching patient profile');
    throw error;
  }
};
