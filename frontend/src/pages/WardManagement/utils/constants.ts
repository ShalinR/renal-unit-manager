import { TabKey } from '../types/wardManagement';

export const TAB_LABELS: Record<TabKey, string> = {
  "patient-details": "Patient Details",
  "admitting-notes": "Admitting Notes",
  "progress-notes": "Progress Notes",
  "medical-history": "Medical History",
  "allergic-history": "Allergic History",
  investigations: "Investigations",
  "discharge-summary": "Discharge Summary",
};

export const ADMISSION_TYPES = [
  "Direct",
  "Transfer from Other Ward",
  "Hospital",
  "HD",
  "Other",
] as const;

export const ICD10_CODES = [
  "N18.0 – End-stage renal disease",
  "N18.4 – Chronic kidney disease stage 4",
  "N18.5 – Chronic kidney disease stage 5",
  "I12.0 – Hypertensive CKD with renal failure",
  "E11.9 – Type 2 diabetes mellitus, without complications",
];

export const WARD_CONFIG = {
  hospitalName: "RENAL CARE UNIT - TEACHING HOSPITAL, PERADENIYA",
  defaultWard: "Renal Care Unit",
  apiBase: "http://localhost:8081"
} as const;