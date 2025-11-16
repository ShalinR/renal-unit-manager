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
    console.log(`🔍 patientProfileApi: Fetching complete profile for PHN: ${phn}`);
    const url = `${API_BASE_URL}/${phn}`;
    const response = await apiFetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.warn(`⚠️ patientProfileApi: Failed to fetch profile - Status ${response.status}`);
      return null;
    }

    const data: PatientProfile = await response.json();
    console.log(`✅ patientProfileApi: Successfully fetched profile for PHN: ${phn}`, data);
    return data;
  } catch (error) {
    console.error(`❌ patientProfileApi: Error fetching patient profile:`, error);
    throw error;
  }
};
