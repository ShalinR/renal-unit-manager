import React, { createContext, useState, useContext } from "react";

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
  patient: {
    phn?: string;
    name?: string;
    age?: number | string;
    nic?: string;
    gender?: string;
    dateOfBirth?: string;
    occupation?: string;
    address?: string;
    contact?: string;
    email?: string;
  };
  setPatient: React.Dispatch<React.SetStateAction<any>>;
  searchPatientByPhn: (phn: string) => Promise<any>;
  globalPatient: any;
  setGlobalPatient: React.Dispatch<React.SetStateAction<any>>;
  isSearching: boolean;
}

const PatientContext = createContext<PatientContextProps>({
  patientData: {
    recipientAssessment: {
      name: "",
      age: "",
      gender: "",
      bloodGroup: "",
    },
    ktSurgery: {
      dateOfKT: "",
      ktType: "",
      donorRelationship: "",
    },
    followUp: {
      dateOfVisit: "",
      sCreatinine: "",
      eGFR: "",
    },
  },
  setPatientData: () => {},
  patient: {},
  setPatient: () => {},
  searchPatientByPhn: async () => {},
  globalPatient: null,
  setGlobalPatient: () => {},
  isSearching: false,
});

export const PatientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [patientData, setPatientData] = useState<PatientData>({
    recipientAssessment: {
      name: "",
      age: "",
      gender: "",
      bloodGroup: "",
    },
    ktSurgery: {
      dateOfKT: "",
      ktType: "",
      donorRelationship: "",
    },
    followUp: {
      dateOfVisit: "",
      sCreatinine: "",
      eGFR: "",
    },
  });

  const [patient, setPatient] = useState<any>({});
  const [globalPatient, setGlobalPatient] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchPatientByPhn = async (phn: string) => {
    console.log("🔍 Searching for patient with PHN:", phn);
    setIsSearching(true);

    try {
      const res = await fetch(`/api/patient/${encodeURIComponent(phn)}`);
      console.log("📊 Response status:", res.status, res.statusText);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Patient not found");
        } else if (res.status === 500) {
          throw new Error("Server error - please try again later");
        } else {
          throw new Error(`Failed to fetch patient (${res.status})`);
        }
      }

      const patientData = await res.json();
      console.log("✅ API response data:", patientData);

      // Map the patient data from the new DTO structure
      const mappedPatient = {
        phn: patientData.phn || phn,
        name: patientData.name || "",
        age: patientData.age || "",
        contact: patientData.contactDetails || "",
        gender: normalizeGender(patientData.gender),
        nic: patientData.nicNo || "",
        dateOfBirth: formatDate(patientData.dateOfBirth),
        occupation: patientData.occupation || "",
        address: patientData.address || "",
        email: patientData.emailAddress || "",
      };

      console.log("👤 Mapped patient data:", mappedPatient);

      setPatient(mappedPatient);
      setGlobalPatient(mappedPatient);

      return mappedPatient;
    } catch (err: any) {
      console.error("💥 Error in searchPatientByPhn:", err);

      // Show user-friendly error messages
      const errorMessage = err.message || "Patient not found or server error";
      alert(errorMessage);

      setPatient({});
      setGlobalPatient(null);
      throw err;
    } finally {
      setIsSearching(false);
    }
  };

  // Helper function to normalize gender values
  const normalizeGender = (gender: string): string => {
    if (!gender) return "";

    const lowerGender = gender.toLowerCase().trim();

    if (
      lowerGender === "m" ||
      lowerGender === "male" ||
      lowerGender === "masculine"
    ) {
      return "male";
    }
    if (
      lowerGender === "f" ||
      lowerGender === "female" ||
      lowerGender === "feminine"
    ) {
      return "female";
    }
    if (lowerGender === "o" || lowerGender === "other") {
      return "other";
    }

    return gender;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    try {
      // Handle different date formats from backend
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Return YYYY-MM-DD format
    } catch (error) {
      console.warn("Failed to parse date:", dateString);
      return dateString;
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patientData,
        setPatientData,
        patient,
        setPatient,
        searchPatientByPhn,
        globalPatient,
        setGlobalPatient,
        isSearching,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);
