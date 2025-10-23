export type AccessType = 'AV Fistula' | 'AV Graft' | 'Permcath' | 'Temporary catheter' | 'Other';

export interface HDPrescription {
  access: AccessType;
  durationMinutes: number;
  dialysisProfile?: string;
  sodium?: number;
  bicarbonate?: number;
  bloodFlowRate: number;
  dialysateFlowRate?: number;
  temperature?: number;
  dryWeightKg: number;
  ultrafiltrationVolume?: number; // in mL
  anticoagulation?: string;
  erythropoetinDose?: string;
  otherTreatment?: string;
}

export interface VascularAccess {
  access: AccessType;
  dateOfCreation?: string; // ISO date
  createdBy?: string;
  complications?: string;
}

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface DialysisSession {
  date: string; // ISO date
  durationMinutes: number;
  preDialysisWeightKg: number;
  postDialysisWeightKg: number;
  interDialyticWeightGainKg?: number;
  bloodPressure: BloodPressure;
  pulseRate?: number;
  oxygenSaturationPercent?: number;
  bloodFlowRate: number;
  arterialPressure?: number;
  venousPressure?: number;
  transmembranePressure?: number;
  ultrafiltrationVolume?: number; // mL
}

export interface HemodialysisRecord {
  id?: string;
  prescription: HDPrescription;
  vascularAccess: VascularAccess;
  session: DialysisSession;
  otherNotes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

