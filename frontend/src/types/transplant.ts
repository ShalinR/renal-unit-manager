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
  
  // Prophylaxis
  cotrimoxazole: string;
  cotriDuration: string;
  cotriStopped: string;
  valganciclovir: string;
  valganDuration: string;
  valganStopped: string;
  vaccination: string;
  
  // Pre-operative
  preOpStatus: string;
  preOpPreparation: string;
  surgicalNotes: string;
  
  // Immediate Post-Transplant
  preKTCreatinine: string;
  postKTCreatinine: string;
  delayedGraft: string;
  postKTDialysis: string;
  acuteRejection: string;
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
  currentMeds: string;
  
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