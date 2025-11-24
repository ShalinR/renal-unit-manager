import { Patient, Admission, ProgressNote, PatientCreatePayload } from '../types/wardManagement';
import { WARD_CONFIG } from '../utils/constants';

const API = WARD_CONFIG.apiBase;

export const apiGetPatient = async (phn: string): Promise<Patient | null> => {
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  const url = `${API}/api/patient?phn=${cleanPhn}`;
  
  console.debug("Ward API: searching for patient (PHI redacted)");
  
  try {
    const res = await fetch(url);
    console.debug("Ward API: patient fetch response status", res.status);
    
    if (res.status === 404) {
      console.debug("Ward API: patient not found (404)");
      return null;
    }
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("❌ [API] Patient API Error:", {
        status: res.status,
        statusText: res.statusText,
        responseText: errorText
      });
      throw new Error(`Failed to load patient: ${res.status} ${res.statusText}`);
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error("❌ [API] Patient response is not JSON:", text);
      throw new Error("Server returned non-JSON response");
    }
    
    const patientData = await res.json();
    console.debug("Ward API: patient data received (redacted)");
    
    // Map backend fields to frontend fields with fallbacks
    const mappedPatient: Patient = {
      id: patientData.id,
      phn: patientData.phn,
      name: patientData.name,
      dob: patientData.dob || patientData.dateOfBirth,
      sex: patientData.sex || patientData.gender,
      address: patientData.address,
      phone: patientData.phone || patientData.contactDetails,
      nic: patientData.nic || patientData.nicNo,
      mohArea: patientData.mohArea || patientData.moh_area,
      ethnicGroup: patientData.ethnicGroup || patientData.ethnic_group,
      religion: patientData.religion,
      occupation: patientData.occupation,
      maritalStatus: patientData.maritalStatus || patientData.marital_status,
      status: patientData.status,
      ward: patientData.ward,
      wardNumber: patientData.wardNumber || patientData.ward_number,
      bedId: patientData.bedId || patientData.bed_id,
      admissionDate: patientData.admissionDate || patientData.admitted_on?.split('T')[0] || patientData.admission_date,
      admissionTime: patientData.admissionTime || patientData.admission_time,
      consultantName: patientData.consultantName || patientData.consultant_name,
      referredBy: patientData.referredBy || patientData.referred_by,
      primaryDiagnosis: patientData.primaryDiagnosis || patientData.primary_diagnosis,
      admissionType: patientData.admissionType || patientData.admission_type,
      admittingOfficer: patientData.admittingOfficer || patientData.admitting_officer,
      presentingComplaints: patientData.presentingComplaints || patientData.presenting_complaints,
      examTempC: patientData.examTempC || patientData.exam_tempc || patientData.tempC,
      examHeightCm: patientData.examHeightCm || patientData.exam_height_cm || patientData.heightCm,
      examWeightKg: patientData.examWeightKg || patientData.exam_weight_kg || patientData.weightKg,
      examBMI: patientData.examBMI || patientData.exambmi || patientData.bmi,
      examBloodPressure: patientData.examBloodPressure || patientData.exam_blood_pressure || patientData.bloodPressure,
      examHeartRate: patientData.examHeartRate || patientData.exam_heart_rate || patientData.heartRate,
    };
    
    console.debug("Ward API: mapped patient data (redacted)");
    return mappedPatient;
    
  } catch (error) {
    console.error("❌ [API] Patient fetch error:", error);
    throw new Error(`Network error: ${error.message}`);
  }
};

export const apiGetAdmissions = async (phn: string): Promise<Admission[]> => {
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  const url = `${API}/api/patients/${cleanPhn}/admissions`;
  
  console.debug("Ward API: loading admissions (PHI redacted)");
  
  try {
    const res = await fetch(url);
    console.debug("Ward API: admissions response status", res.status);
    
    if (res.status === 404) {
      console.debug("Ward API: no admissions found (404)");
      return [];
    }
    
    if (!res.ok) {
      // For 400 errors, return empty array instead of throwing
      if (res.status === 400) {
        console.debug("Ward API: bad request for admissions (400)");
        return [];
      }
      
      const errorText = await res.text().catch(() => "");
      console.error("Ward API: admissions API error");
      throw new Error(`Failed to load admissions: ${res.status}`);
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error("❌ [API] Admissions response is not JSON:", text);
      return [];
    }
    
    const raw = await res.json();
    console.debug("Ward API: admissions data received (redacted)");
    
    // Handle case where backend might return empty array or null
    if (!raw || !Array.isArray(raw)) {
      console.debug("Ward API: no admissions data or invalid format");
      return [];
    }
    
    const admissions = raw.map((a: any) => ({
      id: a.id,
      bhtNumber: a.bhtNumber || a.bht_number || `BHT-${a.number || a.id}`,
      number: a.number,
      admittedOn: a.admittedOn || a.admitted_on,
      hasDischargeSummary: a.dischargeSummaryAvailable || a.discharge_summary_available || a.hasDischargeSummary || false,
      active: a.active || false,
      ward: a.ward,
      wardNumber: a.wardNumber || a.ward_number,
      bedId: a.bedId || a.bed_id,
      admissionDate: a.admissionDate || a.admission_date,
      admissionTime: a.admissionTime || a.admission_time,
      consultantName: a.consultantName || a.consultant_name,
      referredBy: a.referredBy || a.referred_by,
      primaryDiagnosis: a.primaryDiagnosis || a.primary_diagnosis,
      admissionType: a.admissionType || a.admission_type,
      admittingOfficer: a.admittingOfficer || a.admitting_officer,
      presentingComplaints: a.presentingComplaints || a.presenting_complaints,
      examTempC: a.examTempC || a.exam_tempc || a.tempC,
      examHeightCm: a.examHeightCm || a.exam_height_cm || a.heightCm,
      examWeightKg: a.examWeightKg || a.exam_weight_kg || a.weightKg,
      examBMI: a.examBMI || a.exambmi || a.bmi,
      examBloodPressure: a.examBloodPressure || a.exam_blood_pressure || a.bloodPressure,
      examHeartRate: a.examHeartRate || a.exam_heart_rate || a.heartRate,
    }));
    
    console.debug("Ward API: mapped admissions (redacted)");
    return admissions;
    
  } catch (error) {
    console.error("❌ [API] Admissions fetch error:", error);
    // Return empty array instead of throwing to prevent breaking the app
    return [];
  }
};

export const apiCreatePatient = async (payload: PatientCreatePayload): Promise<Patient> => {
  console.debug("Ward API: creating patient (PHI redacted)");
  
  // Clean the payload - remove any undefined values and format properly
  const cleanPayload = JSON.parse(JSON.stringify({
    ...payload,
    // Ensure PHN is clean numeric
    phn: payload.phn.replace(/[^0-9]/g, ""),
    // Handle optional fields
    address: payload.address || null,
    phone: payload.phone || null,
    nic: payload.nic || null,
    mohArea: payload.mohArea || null,
    ethnicGroup: payload.ethnicGroup || null,
    religion: payload.religion || null,
    occupation: payload.occupation || null,
    maritalStatus: payload.maritalStatus || null,
    wardNumber: payload.wardNumber || null,
    bedId: payload.bedId || null,
    consultantName: payload.consultantName || null,
    referredBy: payload.referredBy || null,
    primaryDiagnosis: payload.primaryDiagnosis || null,
    admittingOfficer: payload.admittingOfficer || null,
    tempC: payload.tempC || null,
    heightCm: payload.heightCm || null,
    weightKg: payload.weightKg || null,
    bmi: payload.bmi || null,
    bloodPressure: payload.bloodPressure || null,
    heartRate: payload.heartRate || null,
    medicalProblems: payload.medicalProblems || [],
    allergyProblems: payload.allergyProblems || []
  }));

  console.debug("Ward API: sending cleaned payload (redacted)");

  try {
    const res = await fetch(`${API}/api/patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanPayload),
    });

    console.debug("Ward API: create patient response status", res.status);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("❌ [API] Create patient failed:", text);
      throw new Error(`Failed to create patient. Status ${res.status}: ${text}`);
    }

    const newPatient = await res.json();
    console.debug("Ward API: patient created successfully (redacted)");
    return newPatient;
    
  } catch (error) {
    console.error("❌ [API] Create patient error:", error);
    throw error;
  }
};

export const apiAddProgressNote = async (
  phn: string,
  admId: number,
  payload: any
): Promise<ProgressNote> => {
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  const url = `${API}/api/patients/${cleanPhn}/admissions/${admId}/progress-notes`;
  
  console.debug("Ward API: adding progress note (PHI redacted)");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.debug("Ward API: progress note response status", res.status);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("❌ [API] Add progress note failed:", text);
      throw new Error(`Failed to add progress note. Status ${res.status}: ${text}`);
    }

    const newNote = await res.json();
    console.debug("Ward API: progress note added successfully (redacted)");
    return newNote;
    
  } catch (error) {
    console.error("❌ [API] Add progress note error:", error);
    throw error;
  }
};

export const apiGetProgressNote = async (
  phn: string,
  admId: number
): Promise<ProgressNote[]> => {
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  const url = `${API}/api/patients/${cleanPhn}/admissions/${admId}/progress-notes`;
  
  console.debug("Ward API: loading progress notes (PHI redacted)");

  try {
    const res = await fetch(url);
    console.debug("Ward API: progress notes response status", res.status);
    if (res.status === 404) {
      console.log("📄 [API] No progress notes found (404)");
      return [];
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("❌ [API] Load progress notes failed:", text);
      throw new Error(`Failed to load progress notes. Status ${res.status}: ${text}`);
    }
    const notes = await res.json();
    console.debug("Ward API: progress notes loaded (redacted)");
    return notes;
  } catch (error) {
    console.error("❌ [API] Load progress notes error:", error);
    throw error;
  }
};

export const apiCreateDischargeSummary = async (
  phn: string,
  admId: number,
  payload: {
    dischargeDate: string | null;
    diagnosis: string;
    icd10: string;
    progressSummary: string;
    management: string;
    dischargePlan: string;
    drugsFreeHand: string;
  }
): Promise<any> => {
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  const url = `${API}/patient/${cleanPhn}/admissions/${admId}/discharge-summary`;
  
  console.debug("Ward API: creating discharge summary (PHI redacted)");

  // Fix: Handle null dischargeDate properly
  const cleanPayload = {
    ...payload,
    dischargeDate: payload.dischargeDate || null
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanPayload),
    });

    console.debug("Ward API: discharge summary response status", res.status);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("❌ [API] Create discharge summary failed:", text);
      throw new Error(`Failed to create discharge summary. Status ${res.status}: ${text}`);
    }

    const result = await res.json();
    console.debug("Ward API: discharge summary created (redacted)");
    return result;
    
  } catch (error) {
    console.error("❌ [API] Create discharge summary error:", error);
    throw error;
  }
};

export const apiDownloadDischargeSummaryPDF = async (
  phn: string,
  admId: number
): Promise<Blob> => {
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  const url = `${API}/patient/${cleanPhn}/admissions/${admId}/discharge-summary/pdf`;
  
  console.debug("Ward API: downloading discharge summary PDF (PHI redacted)");

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });
    
    console.debug("Ward API: PDF download response status", response.status);

    if (response.ok) {
      const blob = await response.blob();
      console.debug("Ward API: PDF downloaded successfully (size redacted)");
      return blob;
    } else {
      const errorText = await response.text().catch(() => "");
      console.error("Ward API: PDF download failed");
      throw new Error(`Failed to download PDF. Status ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error("❌ [API] PDF download error:", error);
    throw error;
  }
};

export async function apiUpdateAdmissionStatus(admissionId: number, status: boolean) {
  const res = await fetch(`http://localhost:8080/admissions/${admissionId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) throw new Error("Failed to update admission status");

  return res.json();
}


// Helper function to check if discharge summary exists
export const apiCheckDischargeSummary = async (
  phn: string,
  admId: number
): Promise<boolean> => {
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  const url = `${API}/patient/${cleanPhn}/admissions/${admId}/discharge-summary`;
  
  console.debug("Ward API: checking discharge summary (PHI redacted)");

  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error("Ward API: check discharge summary error");
    return false;
  }
};