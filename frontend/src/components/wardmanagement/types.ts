// types.ts - Type Definitions

export type Sex = "Male" | "Female" | "Other";
export type Status = "Admitted" | "Discharged";
export type AdmissionType =
  | "Direct"
  | "Transfer from Other Ward"
  | "Hospital"
  | "HD"
  | "Other";

export type Patient = {
  id: number;
  phn: string;
  name: string;
  dob: string;
  sex: Sex | string;
  address?: string;
  phone?: string;
  nic?: string;
  mohArea?: string;
  ethnicGroup?: string;
  religion?: string;
  occupation?: string;
  maritalStatus?: string;
  status: Status | string;
  bhtNumber?: string;
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
};

export type Admission = {
  id: number;
  bhtNumber: string;
  number: number;
  admittedOn: string;
  hasDischargeSummary: boolean;
  isActive: boolean;
};

export type ProgressNote = {
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
};

export type MedicalProblem = {
  id: number;
  problem: string;
};

export type Allergy = {
  id: number;
  allergy: string;
};

export type DischargeSummary = {
  id: number;
  dischargeDate: string | null;
  diagnosis: string;
  icd10: string;
  progressSummary: string;
  management: string;
  dischargePlan: string;
  drugsFreeHand: string;
};

export type TabKey =
  | "patient-details"
  | "admitting-notes"
  | "progress-notes"
  | "medical-history"
  | "allergic-history"
  | "investigations"
  | "discharge-summary";

export type PatientCreatePayload = {
  phn: string;
  name: string;
  dob: string;
  sex: Sex;
  address?: string;
  phone?: string;
  nic?: string;
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
};