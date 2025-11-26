// Basic embedded objects
export interface Comorbidities {
  dm: boolean;
  duration: string;
  retinopathy: boolean;
  nephropathy: boolean;
  neuropathy: boolean;
  ihd: boolean;
  twoDEcho: string;
  coronaryAngiogram: string;
  cva: boolean;
  pvd: boolean;
  dl: boolean;
  htn: boolean;
  clcd: boolean;
  childClass: string;
  meldScore: string;
  hf: boolean;
  psychiatricIllness: boolean;
}

export interface RRTDetails {
  modalityHD: boolean;
  modalityCAPD: boolean;
  startingDate: string;
  accessFemoral: boolean;
  accessIJC: boolean;
  accessPermeath: boolean;
  accessCAPD: boolean;
  complications: string;
}

export interface SystemicInquiry {
  constitutional: {
    loa: boolean;
    low: boolean;
  };
  cvs: {
    chestPain: boolean;
    odema: boolean;
    sob: boolean;
  };
  respiratory: {
    cough: boolean;
    hemoptysis: boolean;
    wheezing: boolean;
  };
  git: {
    constipation: boolean;
    diarrhea: boolean;
    melena: boolean;
    prBleeding: boolean;
  };
  renal: {
    hematuria: boolean;
    frothyUrine: boolean;
  };
  neuro: {
    seizures: boolean;
    visualDisturbance: boolean;
    headache: boolean;
    limbWeakness: boolean;
  };
  gynecology: {
    pvBleeding: boolean;
    menopause: boolean;
    menorrhagia: boolean;
    lrmp: boolean;
  };
  sexualHistory: string;
}

export interface AllergyHistory {
  foods: boolean;
  drugs: boolean;
  p: boolean;
}

export interface FamilyHistory {
  dm: string;
  htn: string;
  ihd: string;
  stroke: string;
  renal: string;
}

export interface SubstanceUse {
  smoking: boolean;
  alcohol: boolean;
  other: string;
}

export interface SocialHistory {
  spouseDetails: string;
  childrenDetails: string;
  income: string;
  other: string;
}

export interface Examination {
  height: string;
  weight: string;
  bmi: string;
  pallor: boolean;
  icterus: boolean;
  oral: {
    dentalCaries: boolean;
    oralHygiene: boolean;
    satisfactory: boolean;
    unsatisfactory: boolean;
  };
  lymphNodes: {
    cervical: boolean;
    axillary: boolean;
    inguinal: boolean;
  };
  clubbing: boolean;
  ankleOedema: boolean;
  cvs: {
    bp: string;
    pr: string;
    murmurs: boolean;
  };
  respiratory: {
    rr: string;
    spo2: string;
    auscultation: boolean;
    crepts: boolean;
    ranchi: boolean;
    effusion: boolean;
  };
  abdomen: {
    hepatomegaly: boolean;
    splenomegaly: boolean;
    renalMasses: boolean;
    freeFluid: boolean;
  };
  BrcostExamination: string;
  neurologicalExam: {
    cranialNerves: boolean;
    upperLimb: boolean;
    lowerLimb: boolean;
    coordination: boolean;
  };
}

export interface ImmunologicalDetails {
  bloodGroup: {
    d: string;
    r: string;
  };
  crossMatch: {
    tCell: string;
    bCell: string;
  };
  hlaTyping: {
    donor: {
      hlaA: string;
      hlaB: string;
      hlaC: string;
      hlaDR: string;
      hlaDP: string;
      hlaDQ: string;
    };
    recipient: {
      hlaA: string;
      hlaB: string;
      hlaC: string;
      hlaDR: string;
      hlaDP: string;
      hlaDQ: string;
    };
    conclusion: {
      hlaA: string;
      hlaB: string;
      hlaC: string;
      hlaDR: string;
      hlaDP: string;
      hlaDQ: string;
    };
  };
  praPre: string;
  praPost: string;
  dsa: string;
  immunologicalRisk: string;
}

export interface TransfusionHistory {
  date: string;
  indication: string;
  volume: string;
}

// Medical Staff Interfaces
export interface CompletedBy {
  staffName: string;
  staffRole: string;
  staffId: string;
  department: string;
  signature: string;
  completionDate: string;
}

export interface ReviewedBy {
  consultantName: string;
  consultantId: string;
  reviewDate: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  notes: string;
}

// Main recipient assessment form
export interface RecipientAssessmentForm {
  id?: number;
  phn: string;
  name: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  nicNo: string;
  contactDetails: string;
  emailAddress: string;
  
  // Donor information
  donorId?: string;
  donorPhn?: string;
  donorName?: string;
  donorBloodGroup?: string;
  relationType?: string;
  relationToRecipient?: string;
  
  // Medical sections
  comorbidities: Comorbidities;
  rrtDetails: RRTDetails;
  systemicInquiry: SystemicInquiry;
  complains: string;
  drugHistory: string;
  allergyHistory: AllergyHistory;
  familyHistory: FamilyHistory;
  substanceUse: SubstanceUse;
  socialHistory: SocialHistory;
  examination: Examination;
  immunologicalDetails: ImmunologicalDetails;
  transfusionHistory?: TransfusionHistory[];
  
  // Medical Staff Information
  completedBy: CompletedBy;
  reviewedBy: ReviewedBy;
}

// DTOs for API communication
export interface RecipientAssessmentDTO {
  id?: number;
  phn: string;
  name: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  nicNo: string;
  contactDetails: string;
  emailAddress: string;
  donorId?: string;
  relationType?: string;
  relationToRecipient?: string;
  comorbidities: Comorbidities;
  rrtDetails: RRTDetails;
  systemicInquiry: SystemicInquiry;
  complains: string;
  drugHistory: string;
  allergyHistory: AllergyHistory;
  familyHistory: FamilyHistory;
  substanceUse: SubstanceUse;
  socialHistory: SocialHistory;
  examination: Examination;
  immunologicalDetails: ImmunologicalDetails;
  transfusionHistory?: TransfusionHistory[];
  
  // Medical Staff Information
  completedBy: CompletedBy;
  reviewedBy: ReviewedBy;
}

export interface RecipientAssessmentResponseDTO {
  id: number;
  phn: string;
  name: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  nicNo: string;
  contactDetails: string;
  emailAddress: string;
  donorId?: string;
  relationType?: string;
  relationToRecipient?: string;
  comorbidities: Comorbidities;
  rrtDetails: RRTDetails;
  systemicInquiry: SystemicInquiry;
  complains: string;
  drugHistory: string;
  allergyHistory: AllergyHistory;
  familyHistory: FamilyHistory;
  substanceUse: SubstanceUse;
  socialHistory: SocialHistory;
  examination: Examination;
  immunologicalDetails: ImmunologicalDetails;
  transfusionHistory?: TransfusionHistory[];
  patientPhn?: string;
  
  // Medical Staff Information
  completedBy: CompletedBy;
  reviewedBy: ReviewedBy;
}