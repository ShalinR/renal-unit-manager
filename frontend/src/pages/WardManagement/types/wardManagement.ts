export type Sex = "Male" | "Female" | "Other";
export type Status = "Admitted" | "Discharged";
export type AdmissionType = "Direct" | "Transfer from Other Ward" | "Hospital" | "HD" | "Other";
export type TabKey = 
  | "patient-details" 
  | "admitting-notes" 
  | "progress-notes" 
  | "medical-history" 
  | "allergic-history" 
  | "investigations" 
  | "discharge-summary";

export interface Patient {
  id: number;
  phn: string;
  name: string;
  dateOfBirth: string;
  gender: Sex | string;
  address?: string;
  contactDetails?: string;
  nicNo?: string;
  mohArea?: string;
  ethnicGroup?: string;
  religion?: string;
  occupation?: string;
  maritalStatus?: string;
  status: Status | string;
  ward: string;
  wardNumber?: string;
  bedId?: string;
  admissionDate?: string;
  admissionTime?: string;
  consultantName?: string;
  referredBy?: string;
  primaryDiagnosis?: string;
  admissionType?: AdmissionType | string;
  admittingOfficer?: string;
  presentingComplaints?: string;
  examTempC?: number;
  examHeightCm?: number;
  examWeightKg?: number;
  examBMI?: number;
  examBloodPressure?: string;
  examHeartRate?: number;
}

export interface Admission {
  id: number;
  bhtNumber: string;
  number: number;
  admittedOn: string;
  hasDischargeSummary: boolean;
  active: boolean;
  ward: string;
  wardNumber?: string;
  bedId?: string;
  admissionDate?: string;
  admissionTime?: string;
  consultantName?: string;
  referredBy?: string;
  primaryDiagnosis?: string;
  admissionType?: AdmissionType | string;
  admittingOfficer?: string;
  presentingComplaints?: string;
  examTempC?: number;
  examHeightCm?: number;
  examWeightKg?: number;
  examBMI?: number;
  examBloodPressure?: string;
  examHeartRate?: number;
}

export interface ProgressNote {
  id: number;
  createdAt: string;
  tempC?: number;
  weightKg?: number;
  bpHigh?: number;
  bpLow?: number;
  heartRate?: number;
  inputMl?: number;
  urineOutputMl?: number;
  pdBalance?: number;
  totalBalance?: number;
}

export interface ProgressForm {
  tempC: string;
  weightKg: string;
  bpHigh: string;
  bpLow: string;
  heartRate: string;
  inputMl: string;
  urineOutputMl: string;
  pdBalance: string;
  totalBalance: string;
}

export interface DischargeSummaryState {
  icd10: string;
  diagnosis: string;
  progress: string;
  management: string;
  dischargePlan: string;
  freeDrugs: string;
  dischargeDate: string;
}

export interface PatientCreatePayload {
  phn: string;
  name: string;
  dateOfBirth: string;
  gender: Sex;
  address?: string;
  contactDetails?: string;
  nicNo?: string;
  mohArea?: string;
  ethnicGroup?: string;
  religion?: string;
  occupation?: string;
  maritalStatus?: string;
  ward: string;
  wardNumber?: string;
  bedId?: string;
  admissionDate: string;
  admissionTime?: string;
  admissionType: string;
  consultantName?: string;
  referredBy?: string;
  primaryDiagnosis?: string;
  admittingOfficer?: string;
  presentingComplaints: string;
  tempC?: number;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  bloodPressure?: string;
  heartRate?: number;
  medicalProblems?: string[];
  allergyProblems?: string[];
}