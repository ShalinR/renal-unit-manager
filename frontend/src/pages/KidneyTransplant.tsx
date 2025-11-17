import {
  Dispatch,
  SetStateAction,
  useState,
  useReducer,
  useEffect,
} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, UserPlus, Users, Scissors, ClipboardList, FileText } from "lucide-react";
import DonorAssessment from "../components/DonorAssessment";
import RecipientAssessment from "../components/RecipientAssessment";
import FollowUpForm from "../components/FollowUp";
import KTFormData from "../components/KTSurgery";
import { usePatientContext } from "../context/PatientContext";
import React from "react";
import { useLocation } from "react-router-dom";

// Import types from your interfaces
import { RecipientAssessmentForm } from "@/types/recipient";

import { DonorAssessmentForm } from "@/types/donor";
export type ActiveView =
  | "dashboard"
  | "donor-assessment"
  | "recipient-assessment"
  | "kt"
  | "follow-up"
  | "summary"
  | "summary-recipient"
  | "summary-donor";

// Define complete initial states with all nested structures
const initialDonorFormState: DonorAssessmentForm = {
  name: "",
  age: 0, // Changed from string to number to match your interface
  gender: "",
  dateOfBirth: "",
  occupation: "",
  address: "",
  nicNo: "",
  contactDetails: "",
  emailAddress: "",
  relationToRecipient: "",
  relationType: "",
  comorbidities: {
    dl: false,
    dm: false,
    psychiatricIllness: false,
    htn: false,
    ihd: false,
  },
  complains: "",
  systemicInquiry: {
    constitutional: { loa: false, low: false },
    cvs: { chestPain: false, odema: false, sob: false },
    respiratory: { cough: false, hemoptysis: false, wheezing: false },
    git: {
      constipation: false,
      diarrhea: false,
      melena: false,
      prBleeding: false,
    },
    renal: { hematuria: false, frothyUrine: false },
    neuro: {
      seizures: false,
      visualDisturbance: false,
      headache: false,
      limbWeakness: false,
    },
    gynecology: {
      pvBleeding: false,
      menopause: false,
      menorrhagia: false,
      lrmp: false,
    },
    sexualHistory: "",
  },
  drugHistory: "",
  allergyHistory: { foods: false, drugs: false, p: false },
  familyHistory: { dm: "", htn: "", ihd: "", stroke: "", renal: "" },
  substanceUse: { smoking: false, alcohol: false, other: "" },
  socialHistory: {
    spouseDetails: "",
    childrenDetails: "",
    income: "",
    other: "",
  },
  examination: {
    height: "",
    weight: "",
    bmi: "",
    pallor: false,
    icterus: false,
    oral: {
      dentalCaries: false,
      oralHygiene: false,
      satisfactory: false,
      unsatisfactory: false,
    },
    lymphNodes: { cervical: false, axillary: false, inguinal: false },
    clubbing: false,
    ankleOedema: false,
    cvs: { bp: "", pr: "", murmurs: false },
    respiratory: {
      rr: false, // Changed from string to boolean to match your interface
      spo2: false, // Changed from string to boolean to match your interface
      auscultation: false,
      crepts: false,
      ranchi: false,
      effusion: false,
    },
    abdomen: {
      hepatomegaly: false,
      splenomegaly: false,
      renalMasses: false,
      freeFluid: false,
    },
    BrcostExamination: "",
    neurologicalExam: {
      cranialNerves: false,
      upperLimb: false,
      lowerLimb: false,
      coordination: false,
    },
  },
  immunologicalDetails: {
    bloodGroup: { d: "", r: "" },
    crossMatch: { tCell: "", bCell: "" },
    hlaTyping: {
      donor: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
      recipient: {
        hlaA: "",
        hlaB: "",
        hlaC: "",
        hlaDR: "",
        hlaDP: "",
        hlaDQ: "",
      },
      conclusion: {
        hlaA: "",
        hlaB: "",
        hlaC: "",
        hlaDR: "",
        hlaDP: "",
        hlaDQ: "",
      },
    },
    pra: { pre: "", post: "" },
    dsa: "",
    immunologicalRisk: "",
  },
};

const initialRecipientFormState: RecipientAssessmentForm = {
  id: undefined,
  phn: "",
  name: "",
  age: 0, // Changed from string to number to match your interface
  gender: "",
  dateOfBirth: "",
  occupation: "",
  address: "",
  nicNo: "",
  contactDetails: "",
  emailAddress: "",
  donorId: "",
  donorPhn: "",
  donorName: "",
  donorBloodGroup: "",
  relationToRecipient: "",
  relationType: "",
  comorbidities: {
    dm: false,
    duration: "",
    retinopathy: false,
    nephropathy: false,
    neuropathy: false,
    ihd: false,
    twoDEcho: "",
    coronaryAngiogram: "",
    cva: false,
    pvd: false,
    dl: false,
    htn: false,
    clcd: false,
    childClass: "",
    meldScore: "",
    hf: false,
    psychiatricIllness: false,
  },
  rrtDetails: {
    modalityHD: false,
    modalityCAPD: false,
    startingDate: "",
    accessFemoral: false,
    accessIJC: false,
    accessPermeath: false,
    accessCAPD: false,
    complications: "",
  },
  systemicInquiry: {
    constitutional: { loa: false, low: false },
    cvs: { chestPain: false, odema: false, sob: false },
    respiratory: { cough: false, hemoptysis: false, wheezing: false },
    git: {
      constipation: false,
      diarrhea: false,
      melena: false,
      prBleeding: false,
    },
    renal: { hematuria: false, frothyUrine: false },
    neuro: {
      seizures: false,
      visualDisturbance: false,
      headache: false,
      limbWeakness: false,
    },
    gynecology: {
      pvBleeding: false,
      menopause: false,
      menorrhagia: false,
      lrmp: false,
    },
    sexualHistory: "",
  },
  complains: "",
  drugHistory: "",
  allergyHistory: { foods: false, drugs: false, p: false },
  familyHistory: { dm: "", htn: "", ihd: "", stroke: "", renal: "" },
  substanceUse: { smoking: false, alcohol: false, other: "" },
  socialHistory: {
    spouseDetails: "",
    childrenDetails: "",
    income: "",
    other: "",
  },
  examination: {
    height: "",
    weight: "",
    bmi: "",
    pallor: false,
    icterus: false,
    oral: {
      dentalCaries: false,
      oralHygiene: false,
      satisfactory: false,
      unsatisfactory: false,
    },
    lymphNodes: { cervical: false, axillary: false, inguinal: false },
    clubbing: false,
    ankleOedema: false,
    cvs: { bp: "", pr: "", murmurs: false },
    respiratory: {
      rr: "",
      spo2: "",
      auscultation: false,
      crepts: false,
      ranchi: false,
      effusion: false,
    },
    abdomen: {
      hepatomegaly: false,
      splenomegaly: false,
      renalMasses: false,
      freeFluid: false,
    },
    BrcostExamination: "",
    neurologicalExam: {
      cranialNerves: false,
      upperLimb: false,
      lowerLimb: false,
      coordination: false,
    },
  },
  immunologicalDetails: {
    bloodGroup: { d: "", r: "" },
    crossMatch: { tCell: "", bCell: "" },
    hlaTyping: {
      donor: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
      recipient: {
        hlaA: "",
        hlaB: "",
        hlaC: "",
        hlaDR: "",
        hlaDP: "",
        hlaDQ: "",
      },
      conclusion: {
        hlaA: "",
        hlaB: "",
        hlaC: "",
        hlaDR: "",
        hlaDP: "",
        hlaDQ: "",
      },
    },
    praPre: "",
    praPost: "",
    dsa: "",
    immunologicalRisk: "",
  },
  transfusionHistory: [],
  completedBy: {
    staffName: "",
    staffRole: "",
    staffId: "",
    department: "",
    signature: "",
    completionDate: new Date().toISOString().split("T")[0],
  },
  reviewedBy: {
    consultantName: "",
    consultantId: "",
    reviewDate: "",
    approvalStatus: "pending",
    notes: "",
  },
};

// FIXED Reducer function with safe navigation
const formReducer = (state: any, action: { type: string; payload: any }) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      const { form, field, value } = action.payload;

      // Safety check
      if (!state[form]) {
        console.warn(`Form ${form} does not exist in state`);
        return state;
      }

      const path = field.split(".");
      const newState = { ...state };

      // Ensure the form exists
      if (!newState[form]) {
        newState[form] = {};
      }

      let current = newState[form];

      // Navigate through the path, creating objects if they don't exist
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined || current[path[i]] === null) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }

      // Set the final value
      current[path[path.length - 1]] = value;
      return newState;

    case "SET_FORM_DATA":
      return {
        ...state,
        [action.payload.form]: {
          ...state[action.payload.form],
          ...action.payload.data,
        },
      };
    default:
      return state;
  }
};

const KidneyTransplant = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [state, dispatch] = useReducer(formReducer, {
    donorForm: initialDonorFormState,
    recipientForm: initialRecipientFormState,
  });

  const { donorForm, recipientForm } = state;

  // This state will hold all data for the summary page
  const [patientProfile, setPatientProfile] = useState(null);

  // Access the setPatientData function from the context
  const { patient, setPatientData, setPatient } = usePatientContext();

  // react-router location for reading navigate state
  const location = useLocation();

  // Fetch patient data when the component mounts or patient context changes
  useEffect(() => {
    let isMounted = true;

    // If navigation requested a specific open view, honor it
    // Prefer react-router location.state (navigate(..., { state }))
    const locState: any = (location && (location.state as any)) || null;
    const legacyNav: any = (window as any)?.history?.state?.usr || null;
    const openFromLoc = locState?.open || (locState?.usr && locState?.usr.open);
    const open = openFromLoc || legacyNav?.open;
    if (open) {
      setActiveView(open);
    }

    const fetchPatientProfile = async (phn: string) => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/transplant/profile/${phn}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            // This is normal for new patients - no profile exists yet
            console.log(
              "No transplant profile found (this is normal for new patients)"
            );
            return null;
          }
          throw new Error("Patient profile not found");
        }
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch patient profile:", error);
        return null;
      }
    };

    const loadPatientData = async () => {
      if (!patient?.phn) return;

      try {
        // Populate recipient form with patient data from context
        const recipientData = {
          phn: patient.phn || "",
          name: patient.name || "",
          age: patient.age ? Number(patient.age) : 0, // Convert to number
          gender: patient.gender || "",
          dateOfBirth: patient.dateOfBirth || "",
          occupation: patient.occupation || "",
          address: patient.address || "",
          nicNo: patient.nic || "",
          contactDetails: patient.contact || "",
          emailAddress: patient.email || "",
        };

        if (isMounted) {
          dispatch({
            type: "SET_FORM_DATA",
            payload: {
              form: "recipientForm",
              data: { ...initialRecipientFormState, ...recipientData },
            },
          });
        }

        // Try to fetch existing profile
        const profile = await fetchPatientProfile(patient.phn);
        if (isMounted && profile) {
          setPatientProfile(profile);
        }
      } catch (error) {
        console.error("Error loading patient data:", error);
      }
    };

    loadPatientData();

    return () => {
      isMounted = false;
    };
  }, [patient?.phn]); // Only depend on patient.phn

  // Donor form handlers
  const handleDonorFormChange = (field: string, value: any) => {
    dispatch({
      type: "UPDATE_FIELD",
      payload: { form: "donorForm", field, value },
    });
  };

  const handleDonorFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (
        !donorForm.name ||
        !donorForm.age ||
        !donorForm.gender ||
        !donorForm.nicNo
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const assessmentPayload = {
        phn: patient?.phn || "", // Safe access to patient.phn
        data: donorForm,
      };

      // API call to submit donor data
      const response = await fetch(
        "http://localhost:8081/api/donor-assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(assessmentPayload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Donor form submitted successfully:", result);

        // Update PatientContext with Donor Assessment data
        if (setPatientData) {
          setPatientData((prev: any) => ({
            ...prev,
            donorAssessment: {
              name: donorForm.name,
              age: donorForm.age,
              gender: donorForm.gender,
              bloodGroup:
                donorForm.immunologicalDetails?.bloodGroup?.d +
                donorForm.immunologicalDetails?.bloodGroup?.r,
            },
          }));
        }

        // Reset form or navigate to next step
        setActiveView("dashboard");
        alert("Donor assessment submitted successfully!");
      } else {
        throw new Error("Failed to submit donor form");
      }
    } catch (error) {
      console.error("Error submitting donor form:", error);
      alert("Error submitting donor assessment. Please try again.");
    }
  };

  // Recipient form handlers
  const handleRecipientFormChange = (field: string, value: any) => {
    dispatch({
      type: "UPDATE_FIELD",
      payload: { form: "recipientForm", field, value },
    });
  };

  const handleRecipientFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (
        !recipientForm.name ||
        !recipientForm.age ||
        !recipientForm.gender ||
        !recipientForm.nicNo
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const assessmentPayload = {
        phn: patient?.phn || "", // Safe access to patient.phn
        data: recipientForm,
      };

      // API call to submit recipient data
      const response = await fetch(
        "http://localhost:8081/api/recipient-assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(assessmentPayload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Recipient form submitted successfully:", result);

        // Update PatientContext with Recipient Assessment data
        if (setPatientData) {
          setPatientData((prev: any) => ({
            ...prev,
            recipientAssessment: {
              name: recipientForm.name,
              age: recipientForm.age,
              gender: recipientForm.gender,
              bloodGroup:
                recipientForm.immunologicalDetails?.bloodGroup?.d +
                recipientForm.immunologicalDetails?.bloodGroup?.r,
            },
          }));
        }

        // Reset form or navigate to next step
        setActiveView("dashboard");
        alert("Recipient assessment submitted successfully!");
      } else {
        throw new Error("Failed to submit recipient form");
      }
    } catch (error) {
      console.error("Error submitting recipient form:", error);
      alert("Error submitting recipient assessment. Please try again.");
    }
  };

  return (
    <div>
      {activeView === "donor-assessment" && (
        <>
          <DonorAssessment
            donorForm={donorForm}
            setDonorForm={(data) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: { form: "donorForm", data },
              })
            }
            setActiveView={setActiveView}
            handleDonorFormChange={handleDonorFormChange}
            handleDonorFormSubmit={handleDonorFormSubmit}
          />
        </>
      )}
      {activeView === "recipient-assessment" && (
        <>
          <RecipientAssessment
            recipientForm={recipientForm}
            setRecipientForm={(data) =>
              dispatch({
                type: "SET_FORM_DATA",
                payload: { form: "recipientForm", data },
              })
            }
            setActiveView={setActiveView}
            handleRecipientFormChange={handleRecipientFormChange}
            handleRecipientFormSubmit={handleRecipientFormSubmit}
          />
        </>
      )}
      {activeView === "follow-up" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Follow Up Management
          </h2>

          
          <FollowUpForm setActiveView={setActiveView} />
        </div>
      )}
      {activeView === "kt" && (
        <div className="space-y-6">
          <KTFormData setActiveView={setActiveView} patientPhn={patient?.phn} />
        </div>
      )}
      {/* Summary views removed — Kidney Transplant Summary disabled in app */}
      {activeView === "dashboard" && (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-2">
              <Stethoscope className="w-9 h-9 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Kidney Transplant Management
            </h1>
          </div>

          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                  {
                    icon: UserPlus,
                    title: "Donor Assessment",
                    view: "donor-assessment",
                  },
                  {
                    icon: Users,
                    title: "Recipient Assessment",
                    view: "recipient-assessment",
                  },
                  { icon: Scissors, title: "Kidney Transplant Surgery", view: "kt" },
                  { icon: ClipboardList, title: "Follow Up", view: "follow-up" },
                ].map((item) => (
                <Card
                  key={item.title}
                  className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full"
                >
                  <div className="flex flex-col items-center text-center">
                    <item.icon className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-xl font-medium mb-4">
                      {item.title}
                    </CardTitle>
                  </div>
                  <Button
                    onClick={() => setActiveView(item.view as ActiveView)}
                    className="px-6 py-2 text-base w-full"
                  >
                    Access
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidneyTransplant;
