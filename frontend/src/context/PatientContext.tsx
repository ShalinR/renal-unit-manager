import React, { createContext, useState, useContext } from 'react';

interface PatientData {
  recipientAssessment: {
    name: string;
    age: string;
    gender: string;
    bloodGroup: string;
  };
  ktSurgery: {
    dateOfKT: string;
    ktType: string;
    donorRelationship: string;
  };
  followUp: {
    dateOfVisit: string;
    sCreatinine: string;
    eGFR: string;
  };
}

interface PatientContextProps {
  patientData: PatientData;
  setPatientData: React.Dispatch<React.SetStateAction<PatientData>>;
}

const PatientContext = createContext<PatientContextProps>({
  patientData: {
    recipientAssessment: {
      name: '',
      age: '',
      gender: '',
      bloodGroup: '',
    },
    ktSurgery: {
      dateOfKT: '',
      ktType: '',
      donorRelationship: '',
    },
    followUp: {
      dateOfVisit: '',
      sCreatinine: '',
      eGFR: '',
    },
  },
  setPatientData: () => {},
});

export const PatientProvider = ({ children }: { children: React.ReactNode }) => {
  const [patientData, setPatientData] = useState<PatientData>({
    recipientAssessment: {
      name: '',
      age: '',
      gender: '',
      bloodGroup: '',
    },
    ktSurgery: {
      dateOfKT: '',
      ktType: '',
      donorRelationship: '',
    },
    followUp: {
      dateOfVisit: '',
      sCreatinine: '',
      eGFR: '',
    },
  });

  return (
    <PatientContext.Provider value={{ patientData, setPatientData }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);
