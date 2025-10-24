// types/patient.ts - Make sure it looks like this
export interface PatientBasicDTO {
  phn: string;
  name: string;
  age: string;
  gender: string;
  dateOfBirth?: string;
  occupation?: string;
  address?: string;
  nicNo?: string;
  contactDetails?: string;
  emailAddress?: string;
}

export interface Patient {
  phn: string;
  name: string;
  age: string;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  nicNo: string;
  contactDetails: string;
  emailAddress: string;
}