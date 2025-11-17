export interface KTFormData  {
  id?: number;
  patientPhn: string;
  
  // Patient Information
  name: string;
  dob: string;
  age: string;
  gender: string;
  address: string;
  contact: string;
  // Anthropometrics
  height?: string; // in cm
  weight?: string; // in kg
  bmi?: string;
  
  // Medical History
  diabetes: string;
  hypertension: string;
  ihd: string;
  dyslipidaemia: string;
  other: string;
  otherSpecify: string;
  primaryDiagnosis: string;
  modeOfRRT: string;
  durationRRT: string;
  
  // Transplantation Details
  ktDate: string;
  numberOfKT: string;
  ktUnit: string;
  wardNumber: string;
  ktSurgeon: string;
  ktType: string;
  donorRelationship: string;
  peritonealPosition: string;
  sideOfKT: string;
  
  // Immunological Details
  preKT: string;
  inductionTherapy: string;
  maintenance: string;
  maintenanceOther: string;
  maintenancePred?: boolean;
  maintenanceMMF?: boolean;
  maintenanceTac?: boolean;
  maintenanceEverolimus?: boolean;
  maintenanceOtherText?: string;
  immunologicalDetails?: ImmunologicalDetails;

  // Infection Screen
  cmvDonor: string;
  cmvRecipient: string;
  ebvDonor: string;
  ebvRecipient: string;
  cmvRiskCategory: string;
  ebvRiskCategory: string;
  tbMantoux: string;
  hivAb: string;
  hepBsAg: string;
  hepCAb: string;
  infectionRiskCategory: string;
  
  // Prophylaxis
  cotrimoxazoleYes: boolean;
  cotriDuration: string;
  cotriStopped: string;
  valganciclovirYes: boolean;
  valganDuration: string;
  valganStopped: string;
  vaccinationCOVID: boolean;
  vaccinationInfluenza: boolean;
  vaccinationPneumococcal: boolean;
  vaccinationVaricella: boolean;
  
  // Pre-operative
  preOpStatus: string;
  preOpPreparation: string;
  surgicalNotes: string;
  
  // Immediate Post-Transplant
  preKTCreatinine: string;
  postKTCreatinine: string;
  delayedGraftYes: boolean;
  postKTDialysisYes: boolean;
  postKTPDYes: boolean;
  acuteRejectionYes: boolean;
  acuteRejectionDetails: string;
  otherComplications: string;
  
  // Surgery Complications
  postKTComp1: string;
  postKTComp2: string;
  postKTComp3: string;
  postKTComp4: string;
  postKTComp5: string;
  postKTComp6: string;
  
  // Current Management
  medications: { name: string; dosage: string }[];
  
  // Final
  recommendations: string;
  filledBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImmunologicalDetails {
  bloodGroupDonor: string;
  bloodGroupRecipient: string;
  crossMatchTcell: string;
  crossMatchBcell: string;
  hlaTypingDonor: HLA;
  hlaTypingRecipient: HLA;
  praPre: string;
  praPost: string;
  dsa: string;
  immunologicalRisk: string;
}

export interface HLA {
  hlaA: string;
  hlaB: string;
  hlaC: string;
  hlaDR: string;
  hlaDP: string;
  hlaDQ: string;
}