import React, { useState, useEffect,useCallback  } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Heart,
  UserCheck,
  Activity,
  Save,
  ArrowLeft,
  Pill,
  ClipboardList,
  User,
  Trash2,
  FileText,
  Shield,
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { useDonorContext } from "@/context/DonorContext";

interface RecipientAssessmentForm {
  id?: string; // ADD THIS FOR UPDATES
  phn?: string; // ADD THIS FOR PATIENT LOOKUP
  name: string;
  age: string;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  nicNo: string;
  contactDetails: string;
  emailAddress: string;
  donorId?: string;
  relationType: string;
  relationToRecipient: string;
  comorbidities: {
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
  };
  rrtDetails: {
    modalityHD: boolean;
    modalityCAPD: boolean;
    startingDate: string;
    accessFemoral: boolean;
    accessIJC: boolean;
    accessPermeath: boolean;
    accessCAPD: boolean;
    complications: string;
  };

  // Systemic Inquiry
  complains?: string;

  // Other sections
  systemicInquiry: {
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
  };
  drugHistory: string;
  allergyHistory: {
    foods: boolean;
    drugs: boolean;
    p: boolean;
  };
  familyHistory: {
    dm: string;
    htn: string;
    ihd: string;
    stroke: string;
    renal: string;
  };
  substanceUse: {
    smoking: boolean;
    alcohol: boolean;
    other: string;
  };
  socialHistory: {
    spouseDetails: string;
    childrenDetails: string;
    income: string;
    other: string;
  };
  examination: {
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
  };
  immunologicalDetails: {
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
  };
}

export interface RecipientAssessmentProps {
  recipientForm: RecipientAssessmentForm;
  setRecipientForm: React.Dispatch<
    React.SetStateAction<RecipientAssessmentForm>
  >;
  setActiveView: React.Dispatch<React.SetStateAction<string>>;
  handleRecipientFormChange: (field: string, value: any) => void;
  handleRecipientFormSubmit: (e: React.FormEvent) => void;
  donors: Array<{
    id: string;
    name: string;
    bloodGroup: string;
    relationType?: string;
    relationToRecipient?: string;
    age: string | number;
  }>;
}

const FORM_STEPS = [
  { label: "Personal Info", icon: User },
  //{ label: "Relationship", icon: Heart },
  { label: "Comorbidities", icon: Activity },
  { label: "RRT Details", icon: Pill },
  { label: "Transfusion History", icon: ClipboardList },
  { label: "Immunological", icon: Shield },
  { label: "Confirmation", icon: FileText },
];

const RecipientAssessment: React.FC<RecipientAssessmentProps> = ({
  recipientForm,
  setRecipientForm,
  setActiveView,
  handleRecipientFormChange,
  handleRecipientFormSubmit,
  donors,
}) => {
  const {
    donors: contextDonors = [],
    selectedDonor,
    setSelectedDonor,
  } = useDonorContext();
  const [step, setStep] = useState(0);
  const { patient } = usePatientContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donorSearch, setDonorSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Use donors from props or context
  // const donorList = donors && donors.length > 0 ? donors : contextDonors;
  // const filteredDonors = donorList.filter(
  //   (donor) =>
  //     donor.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
  //     donor.bloodGroup.toLowerCase().includes(donorSearch.toLowerCase()) ||
  //     donor.relationToRecipient
  //       ?.toLowerCase()
  //       .includes(donorSearch.toLowerCase())
  // );

  const [transfusions, setTransfusions] = useState<
    { date: string; indication: string; volume: string }[]
  >([{ date: "", indication: "", volume: "" }]);

  // Add this function to load patient assessment data
  // Add this function to load patient assessment data
// Add this function to load patient assessment data
const loadPatientAssessmentData = async (phn: string) => {
  try {
    setIsSubmitting(true);
    
    // Try to load existing assessment
    const response = await fetch(`/api/recipient-assessment/patient/${phn}/latest`);
    
    if (response.ok) {
      const existingAssessment = await response.json();
      
      if (existingAssessment && existingAssessment.id) {
        // Load existing assessment for editing
        setRecipientForm(existingAssessment);
        setIsEditing(true);
        console.log("Loaded existing assessment for editing:", existingAssessment);
      } else {
        // No existing assessment found - this is normal
        console.log("No existing assessment found, starting new one");
        setIsEditing(false);
        
        // Try to load basic patient data if available
        try {
          const patientResponse = await fetch(`/api/patients/${phn}`);
          if (patientResponse.ok) {
            const patientData = await patientResponse.json();
            setRecipientForm(prev => ({
              ...prev,
              ...patientData,
              phn: phn,
              id: undefined
            }));
            console.log("Loaded patient data for new assessment");
          }
        } catch (patientError) {
          console.log("No patient data available, starting blank form");
        }
      }
    } else if (response.status === 404) {
      // No existing assessment found - this is normal for new patients
      console.log("No existing assessment found (404), starting new one");
      setIsEditing(false);
    } else {
      throw new Error(`Server error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error loading patient assessment data:', error);
    // Don't show alert for 404 errors - they're normal for new patients
    if (error instanceof Error && !error.message.includes('404')) {
      console.log('Server error occurred, but continuing with blank form');
    }
    setIsEditing(false);
  } finally {
    setIsSubmitting(false);
  }
};
// Load patient assessment when patient is selected - ADD DEPENDENCY
// Load patient assessment when patient is selected
useEffect(() => {
  if (patient?.phn && patient.phn.trim() !== '') {
    console.log("Patient selected, loading assessment data for:", patient.phn);
    loadPatientAssessmentData(patient.phn);
  }
}, [patient?.phn]); // Only run when patient.phn changes
  // Auto-fill donor information when a donor is selected
// Auto-fill donor information when a donor is selected - FIXED INFINITE LOOP
// Auto-fill donor information when a donor is selected - FIXED
// useEffect(() => {
//   if (selectedDonor && selectedDonor.id !== recipientForm.donorId) {
//     console.log("Auto-populating donor information:", selectedDonor);
    
//     // Use a timeout to break the update cycle
//     const timeoutId = setTimeout(() => {
//       setRecipientForm((prev) => ({
//         ...prev,
//         donorId: selectedDonor.id,
//         relationType: selectedDonor.relationType || "",
//         relationToRecipient: selectedDonor.relationToRecipient || "",
//       }));
//     }, 0);
    
//     return () => clearTimeout(timeoutId);
//   }
// }, [selectedDonor, recipientForm.donorId]); // Remove setRecipientForm from dependencies
//   // Auto-save functionality
useEffect(() => {
  // Only auto-save if we have meaningful data and not too frequently
  const hasMeaningfulData = recipientForm.name || recipientForm.nicNo || recipientForm.contactDetails;
  
  if (!hasMeaningfulData) return;
  
  const autoSave = setTimeout(() => {
    const draftData = {
      form: recipientForm,
      transfusions,
      step,
    };
    localStorage.setItem(
      "recipient-assessment-draft",
      JSON.stringify(draftData)
    );
    console.log("Auto-saved draft data");
  }, 5000);

    return () => clearTimeout(autoSave);
  }, [recipientForm, transfusions, step]);

  // Load draft data
  useEffect(() => {
    const draft = localStorage.getItem("recipient-assessment-draft");
    if (draft) {
      try {
        const {
          form,
          transfusions: savedTransfusions,
          step: savedStep,
        } = JSON.parse(draft);
        setRecipientForm(form);
        if (savedTransfusions?.length > 0) {
          setTransfusions(savedTransfusions);
        }
        if (savedStep !== undefined) {
          setStep(savedStep);
        }
        console.log("Loaded draft data");
      } catch (error) {
        console.error("Error loading draft data:", error);
      }
    }
  }, [setRecipientForm]);

  // Update the donor selection in the Relationship step
  // const handleDonorSelection = (donorId: string) => {
  //   const selected = donorList.find((donor) => donor.id === donorId);
  //   if (selected) {
  //     setSelectedDonor(selected);
  //     handleNestedChange("donorId", donorId);
  //     handleNestedChange("relationType", selected.relationType || "");
  //     handleNestedChange(
  //       "relationToRecipient",
  //       selected.relationToRecipient || ""
  //     );
  //   }
  // };

  // Add the reset function inside your component
  const handleResetForm = () => {
    if (confirm("Are you sure you want to reset the entire form? All data will be lost.")) {
      // Reset the form to initial empty state
      setRecipientForm({
        name: "",
        age: "",
        gender: "",
        dateOfBirth: "",
        occupation: "",
        address: "",
        nicNo: "",
        contactDetails: "",
        emailAddress: "",
        donorId: "",
        relationType: "",
        relationToRecipient: "",
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
          psychiatricIllness: false
        },
        rrtDetails: {
          modalityHD: false,
          modalityCAPD: false,
          startingDate: "",
          accessFemoral: false,
          accessIJC: false,
          accessPermeath: false,
          accessCAPD: false,
          complications: ""
        },
        systemicInquiry: {
          constitutional: {
            loa: false,
            low: false,
          },
          cvs: {
            chestPain: false,
            odema: false,
            sob: false,
          },
          respiratory: {
            cough: false,
            hemoptysis: false,
            wheezing: false,
          },
          git: {
            constipation: false,
            diarrhea: false,
            melena: false,
            prBleeding: false,
          },
          renal: {
            hematuria: false,
            frothyUrine: false,
          },
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
        allergyHistory: {
          foods: false,
          drugs: false,
          p: false,
        },
        familyHistory: {
          dm: "",
          htn: "",
          ihd: "",
          stroke: "",
          renal: "",
        },
        substanceUse: {
          smoking: false,
          alcohol: false,
          other: "",
        },
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
          lymphNodes: {
            cervical: false,
            axillary: false,
            inguinal: false,
          },
          clubbing: false,
          ankleOedema: false,
          cvs: {
            bp: "",
            pr: "",
            murmurs: false,
          },
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
          bloodGroup: {
            d: "",
            r: "",
          },
          crossMatch: {
            tCell: "",
            bCell: "",
          },
          hlaTyping: {
            donor: {
              hlaA: "",
              hlaB: "",
              hlaC: "",
              hlaDR: "",
              hlaDP: "",
              hlaDQ: "",
            },
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
      });

      // Reset other states
      setStep(0);
      setIsEditing(false);
      setErrors({});
      setTransfusions([{ date: "", indication: "", volume: "" }]);
     // setSelectedDonor(null);
     // setDonorSearch("");
      
      // Clear draft data
      localStorage.removeItem("recipient-assessment-draft");
      
      console.log("Form reset successfully");
    }
  };

  // Clear donor selection
  // const handleClearDonorSelection = () => {
  //   setSelectedDonor(null);
  //   handleNestedChange("donorId", "");
  //   handleNestedChange("relationType", "");
  //   handleNestedChange("relationToRecipient", "");
  // };

  // Helper function to handle nested object changes
 // Helper function to handle nested object changes - IMPROVED
const handleNestedChange = useCallback((path: string, value: any) => {
  handleRecipientFormChange(path, value);
}, [handleRecipientFormChange]); // Only depend on handleRecipientFormChange

  // Helper function to get nested values safely
// Helper function to get nested values safely
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Personal Info
        if (!recipientForm.name.trim()) newErrors.name = "Name is required";
        if (!recipientForm.age) newErrors.age = "Age is required";
        if (!recipientForm.nicNo.trim()) newErrors.nicNo = "NIC is required";
        if (!recipientForm.gender) newErrors.gender = "Gender is required";
        if (!recipientForm.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!recipientForm.contactDetails.trim())
          newErrors.contactDetails = "Contact number is required";
        break;

     // case 1: // Relationship - FIXED
        // Only validate if a donor is actually selected
        if (recipientForm.donorId && recipientForm.donorId !== "") {
          if (!recipientForm.relationType || recipientForm.relationType === "") {
            newErrors.relationType = "Relationship type is required when donor is selected";
          }
          if (recipientForm.relationType === "related" && (!recipientForm.relationToRecipient || recipientForm.relationToRecipient.trim() === "")) {
            newErrors.relationToRecipient = "Specific relation is required for related donors";
          }
        }
        // If no donor selected, no validation needed - proceed freely
        break;

      case 6: // Confirmation
        if (!recipientForm.name.trim())
          newErrors.confirmation =
            "Please complete all required steps before submitting";
        break;
    }

    setErrors(newErrors);
    console.log("Validation for step", step, "errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Transfusion history handlers
  const addTransfusion = () => {
    const newTransfusions = [
      ...transfusions,
      { date: "", indication: "", volume: "" },
    ];
    setTransfusions(newTransfusions);
    handleNestedChange("transfusionHistory", newTransfusions);
  };

  const removeTransfusion = (index: number) => {
    const newTransfusions = transfusions.filter((_, i) => i !== index);
    const finalTransfusions = newTransfusions.length ? newTransfusions : [{ date: "", indication: "", volume: "" }];
    setTransfusions(finalTransfusions);
    handleNestedChange("transfusionHistory", finalTransfusions);
  };

  const handleTransfusionChange = (
    index: number,
    field: "date" | "indication" | "volume",
    value: string
  ) => {
    const newTransfusions = transfusions.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    setTransfusions(newTransfusions);
    handleNestedChange("transfusionHistory", newTransfusions);
  };

  // Navigation handlers
// Navigation handlers - ADD THESE BACK
// Navigation handlers - FIXED VERSION
const nextStep = () => {
  if (validateStep(step)) {
    // Map current step to actual step index (skipping step 1)
    const stepMap = {
      0: 0, // Personal Info -> Step 0
      1: 2, // Comorbidities -> Step 2  
      2: 3, // RRT Details -> Step 3
      3: 4, // Transfusion History -> Step 4
      4: 5, // Immunological -> Step 5
      5: 6  // Confirmation -> Step 6
    };
    
    const currentMappedStep = stepMap[step as keyof typeof stepMap] || step;
    const nextStepIndex = currentMappedStep + 1;
    
    // Find the next visible step
    let nextVisibleStep = step + 1;
    if (nextVisibleStep === 1) { // Skip the commented out Relationship step
      nextVisibleStep = 2;
    }
    
    setStep(Math.min(FORM_STEPS.length - 1, nextVisibleStep));
  }
};

const prevStep = () => {
  // Find the previous visible step
  let prevVisibleStep = step - 1;
  if (prevVisibleStep === 1) { // Skip the commented out Relationship step
    prevVisibleStep = 0;
  }
  
  setStep(Math.max(0, prevVisibleStep));
};
  // Enhanced submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateStep(step)) {
        const url = isEditing && recipientForm.id 
          ? `/api/recipient-assessment/${recipientForm.id}` 
          : '/api/recipient-assessment';
        
        const method = isEditing && recipientForm.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...recipientForm,
            phn: patient?.phn
          }),
        });

        if (response.ok) {
          const savedAssessment = await response.json();
          setRecipientForm(savedAssessment);
          setIsEditing(true);
          localStorage.removeItem("recipient-assessment-draft");
          alert(`Assessment ${isEditing ? 'updated' : 'created'} successfully!`);
          setActiveView("dashboard");
        } else {
          throw new Error('Failed to save assessment');
        }
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert('Error saving assessment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section with Unsaved Changes Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">
                  Recipient Assessment {isEditing && "(Editing)"}
                </h1>
                <p className="text-blue-600">
                  {patient && patient.name
                    ? `Patient: ${patient.name} (PHN: ${patient.phn})`
                    : "Complete medical evaluation for kidney transplant recipient"}
                </p>
                {isEditing && (
                  <p className="text-green-600 text-sm font-medium">
                    ✓ Editing existing assessment
                  </p>
                )}
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetForm}
              className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Reset Form
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView("dashboard")}
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Progress Stepper */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-900">
                Assessment Progress
              </h2>
              <span className="text-sm text-blue-600">
                Step {step + 1} of {FORM_STEPS.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {FORM_STEPS.map((formStep, idx) => {
                const Icon = formStep.icon;
                const isActive = step === idx;
                const isCompleted = step > idx;

                return (
                  <div key={formStep.label} className="flex-1">
                    <div
                      className={`
                      flex flex-col items-center p-3 rounded-lg transition-all duration-200 cursor-pointer
                      ${
                        isActive
                          ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                          : isCompleted
                            ? "bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100"
                            : "bg-gray-50 border border-gray-200 text-gray-400 hover:bg-gray-100"
                      }
                    `}
                      onClick={() => {
                        // Allow navigation to completed steps or current step
                        if (isCompleted || isActive) {
                          setStep(idx);
                        }
                      }}
                    >
                      <Icon
                        className={`w-5 h-5 mb-2 ${
                          isActive 
                            ? "text-blue-600" 
                            : isCompleted 
                              ? "text-blue-500" 
                              : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium text-center ${
                          isActive 
                            ? "text-blue-700" 
                            : isCompleted 
                              ? "text-blue-600" 
                              : "text-gray-400"
                        }`}
                      >
                        {formStep.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <User className="w-6 h-6" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {patient && patient.name
                    ? `Patient data loaded for: ${patient.name}`
                    : "Search for a patient using the search bar above to auto-fill this section"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700 flex items-center"
                    >
                      Full Name <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={recipientForm.name}
                      onChange={(e) =>
                        handleNestedChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                      className={`h-12 border-2 ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                      required
                    />
                    {errors.name && <ErrorMessage message={errors.name} />}
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="age"
                      className="text-sm font-semibold text-gray-700 flex items-center"
                    >
                      Age <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={recipientForm.age}
                      onChange={(e) =>
                        handleNestedChange("age", e.target.value)
                      }
                      placeholder="Enter age"
                      className={`h-12 border-2 ${errors.age ? 'border-red-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                      required
                    />
                    {errors.age && <ErrorMessage message={errors.age} />}
                  </div>
                </div>

                {/* NIC Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="nicNo"
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    NIC Number <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="nicNo"
                    value={recipientForm.nicNo}
                    onChange={(e) =>
                      handleNestedChange("nicNo", e.target.value)
                    }
                    placeholder="Enter NIC number"
                    className={`h-12 border-2 ${errors.nicNo ? 'border-red-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                    required
                  />
                  {errors.nicNo && <ErrorMessage message={errors.nicNo} />}
                </div>

                {/* Gender Field */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center">
                    Gender <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    value={recipientForm.gender}
                    onValueChange={(val) => handleNestedChange("gender", val)}
                    className="flex gap-8 pt-2"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="male"
                        id="recipientMale"
                        className="border-2 border-blue-300"
                      />
                      <Label
                        htmlFor="recipientMale"
                        className="text-gray-700 font-medium"
                      >
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="female"
                        id="recipientFemale"
                        className="border-2 border-blue-300"
                      />
                      <Label
                        htmlFor="recipientFemale"
                        className="text-gray-700 font-medium"
                      >
                        Female
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="other"
                        id="recipientOther"
                        className="border-2 border-blue-300"
                      />
                      <Label
                        htmlFor="recipientOther"
                        className="text-gray-700 font-medium"
                      >
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && <ErrorMessage message={errors.gender} />}
                </div>

                {/* Date of Birth and Occupation Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="recipientDOB"
                      className="text-sm font-semibold text-gray-700 flex items-center"
                    >
                      Date of Birth <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="recipientDOB"
                      type="date"
                      value={recipientForm.dateOfBirth}
                      onChange={(e) =>
                        handleNestedChange("dateOfBirth", e.target.value)
                      }
                      className={`h-12 border-2 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                      required
                    />
                    {errors.dateOfBirth && <ErrorMessage message={errors.dateOfBirth} />}
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="recipientOccupation"
                      className="text-sm font-semibold text-gray-700 flex items-center"
                    >
                      Occupation <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="recipientOccupation"
                      value={recipientForm.occupation}
                      onChange={(e) =>
                        handleNestedChange("occupation", e.target.value)
                      }
                      placeholder="Enter occupation"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <Label
                    htmlFor="recipientAddress"
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    Address <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="recipientAddress"
                    value={recipientForm.address}
                    onChange={(e) =>
                      handleNestedChange("address", e.target.value)
                    }
                    placeholder="Enter complete address"
                    rows={4}
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none"
                    required
                  />
                </div>

                {/* Contact Information Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="recipientContact"
                      className="text-sm font-semibold text-gray-700 flex items-center"
                    >
                      Contact Number{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="recipientContact"
                      value={recipientForm.contactDetails}
                      onChange={(e) =>
                        handleNestedChange("contactDetails", e.target.value)
                      }
                      placeholder="Enter phone number"
                      className={`h-12 border-2 ${errors.contactDetails ? 'border-red-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                      required
                    />
                    {errors.contactDetails && <ErrorMessage message={errors.contactDetails} />}
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="recipientEmail"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={recipientForm.emailAddress}
                      onChange={(e) =>
                        handleNestedChange("emailAddress", e.target.value)
                      }
                      placeholder="Enter email address"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

 {/* Step 1: Relationship - COMMENTED OUT */}
{/*
{step === 1 && (
  <Card className="shadow-lg border-0 bg-white">
    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
      <CardTitle className="flex items-center gap-3 text-xl">
        <Heart className="w-6 h-6" />
        Donor Information (Optional)
      </CardTitle>
      <CardDescription className="text-blue-100">
        {selectedDonor 
          ? `Selected: ${selectedDonor.name} (${selectedDonor.bloodGroup})`
          : "Select a registered donor if available, or proceed without one"
        }
      </CardDescription>
    </CardHeader>
    <CardContent className="p-8 space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-semibold text-gray-700">
            Select Registered Donor (Optional)
          </Label>
          {selectedDonor && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearDonorSelection}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Clear Selection
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search donors by name, blood group, or relationship..."
            value={donorSearch}
            onChange={(e) => setDonorSearch(e.target.value)}
            className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
          />
        </div>
        
        <select
          value={recipientForm.donorId || ""}
          onChange={(e) => handleDonorSelection(e.target.value)}
          className="w-full h-12 p-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white"
        >
          <option value="">No donor selected (proceed without donor)</option>
          {filteredDonors.map((donor) => (
            <option key={donor.id} value={donor.id}>
              {donor.name} (Blood Group: {donor.bloodGroup}) - {donor.relationToRecipient}
            </option>
          ))}
        </select>

        {!recipientForm.donorId && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">No Donor Selected</p>
                <p className="text-sm text-yellow-700">
                  Proceeding without a donor. You can add donor information later if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedDonor && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Donor Selected</p>
                <p className="text-sm text-green-700">
                  {selectedDonor.name} • {selectedDonor.bloodGroup} • {selectedDonor.age} years • {selectedDonor.relationToRecipient}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {recipientForm.donorId && (
        <div className="space-y-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700">
              Type of Relationship <span className="text-red-500 ml-1">*</span>
            </Label>
            <RadioGroup
              value={recipientForm.relationType || ""}
              onValueChange={(value) => handleNestedChange("relationType", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="related" id="recipientRelated" className="border-2 border-blue-300" />
                <Label htmlFor="recipientRelated" className="text-gray-700 font-medium">Related</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="unrelated" id="recipientUnrelated" className="border-2 border-blue-300" />
                <Label htmlFor="recipientUnrelated" className="text-gray-700 font-medium">Unrelated</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="altruistic" id="recipientAltruistic" className="border-2 border-blue-300" />
                <Label htmlFor="recipientAltruistic" className="text-gray-700 font-medium">Altruistic</Label>
              </div>
            </RadioGroup>
            {errors.relationType && <ErrorMessage message={errors.relationType} />}
          </div>

          {recipientForm.relationType === "related" && (
            <div className="space-y-3">
              <Label htmlFor="relationToRecipient" className="text-sm font-semibold text-gray-700">
                Specific Relation <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="relationToRecipient"
                value={recipientForm.relationToRecipient || ""}
                onChange={(e) => handleNestedChange("relationToRecipient", e.target.value)}
                placeholder="e.g., Brother, Sister, Parent, etc."
                className={`h-12 border-2 ${errors.relationToRecipient ? 'border-red-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
              />
              {errors.relationToRecipient && <ErrorMessage message={errors.relationToRecipient} />}
            </div>
          )}
        </div>
      )}

      {!recipientForm.donorId && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="text-center space-y-3">
            <p className="text-gray-700 font-medium">
              No donor information available at this time?
            </p>
            <p className="text-sm text-gray-600">
              You can proceed without selecting a donor. Donor information can be added later when available.
            </p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)}
*/}
          {/* Steps 2-6 remain the same as your original code */}
          {/* Step 2: Comorbidities */}
          {step === 2 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Activity className="w-6 h-6" />
                  Comorbidities
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Medical conditions and complications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Diabetes Mellitus Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Diabetes Mellitus
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="recipientDM"
                        checked={recipientForm.comorbidities.dm}
                        onCheckedChange={(checked) =>
                          handleNestedChange("comorbidities.dm", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label
                        htmlFor="recipientDM"
                        className="text-gray-700 font-medium"
                      >
                        Diabetes Mellitus (DM)
                      </Label>
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="recipientDMDuration"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Duration
                      </Label>
                      <Input
                        id="recipientDMDuration"
                        value={recipientForm.comorbidities.duration}
                        onChange={(e) =>
                          handleNestedChange(
                            "comorbidities.duration",
                            e.target.value
                          )
                        }
                        placeholder="Duration in years"
                        className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Microvascular Complications */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-blue-800 mb-3">Microvascular Complications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientRetinopathy"
                          checked={recipientForm.comorbidities.retinopathy}
                          onCheckedChange={(checked) =>
                            handleNestedChange("comorbidities.retinopathy", checked)
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label htmlFor="recipientRetinopathy" className="text-gray-700">
                          Retinopathy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientNephropathy"
                          checked={recipientForm.comorbidities.nephropathy}
                          onCheckedChange={(checked) =>
                            handleNestedChange("comorbidities.nephropathy", checked)
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label htmlFor="recipientNephropathy" className="text-gray-700">
                          Nephropathy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientNeuropathy"
                          checked={recipientForm.comorbidities.neuropathy}
                          onCheckedChange={(checked) =>
                            handleNestedChange("comorbidities.neuropathy", checked)
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label htmlFor="recipientNeuropathy" className="text-gray-700">
                          Neuropathy
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Macrovascular Complications */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-blue-800 mb-3">Macrovascular Complications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientIHD"
                          checked={recipientForm.comorbidities.ihd}
                          onCheckedChange={(checked) =>
                            handleNestedChange("comorbidities.ihd", checked)
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label htmlFor="recipientIHD" className="text-gray-700">
                          IHD
                        </Label>
                      </div>
                      {/* IHD Sub-investigations */}
                      {recipientForm.comorbidities.ihd && (
                        <div className="ml-6 space-y-3 bg-blue-100 p-4 rounded-lg">
                          <div className="space-y-2">
                            <Label htmlFor="recipient2DEcho" className="text-sm font-medium text-gray-700">
                              2D Echo
                            </Label>
                            <Input
                              id="recipient2DEcho"
                              value={recipientForm.comorbidities.twoDEcho || ""}
                              onChange={(e) =>
                                handleNestedChange("comorbidities.twoDEcho", e.target.value)
                              }
                              placeholder="2D Echo findings"
                              className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="recipientCoronaryAngiogram" className="text-sm font-medium text-gray-700">
                              Coronary Angiogram
                            </Label>
                            <Input
                              id="recipientCoronaryAngiogram"
                              value={recipientForm.comorbidities.coronaryAngiogram || ""}
                              onChange={(e) =>
                                handleNestedChange("comorbidities.coronaryAngiogram", e.target.value)
                              }
                              placeholder="Coronary angiogram findings"
                              className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientCVA"
                          checked={recipientForm.comorbidities.cva}
                          onCheckedChange={(checked) =>
                            handleNestedChange("comorbidities.cva", checked)
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label htmlFor="recipientCVA" className="text-gray-700">
                          CVA
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientPVD"
                          checked={recipientForm.comorbidities.pvd}
                          onCheckedChange={(checked) =>
                            handleNestedChange("comorbidities.pvd", checked)
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label htmlFor="recipientPVD" className="text-gray-700">
                          PVD
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Comorbidities */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Other Comorbidities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="recipientHTN"
                        checked={recipientForm.comorbidities.htn}
                        onCheckedChange={(checked) =>
                          handleNestedChange("comorbidities.htn", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label htmlFor="recipientHTN" className="text-gray-700">
                        Hypertension
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="recipientDL"
                        checked={recipientForm.comorbidities.dl}
                        onCheckedChange={(checked) =>
                          handleNestedChange("comorbidities.dl", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label htmlFor="recipientDL" className="text-gray-700">
                        Dyslipidemia (DL)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="recipientCLCD"
                        checked={recipientForm.comorbidities.clcd}
                        onCheckedChange={(checked) =>
                          handleNestedChange("comorbidities.clcd", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label htmlFor="recipientCLCD" className="text-gray-700">
                        Chronic Liver Disease (CLCD)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="recipientHF"
                        checked={recipientForm.comorbidities.hf}
                        onCheckedChange={(checked) =>
                          handleNestedChange("comorbidities.hf", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label htmlFor="recipientHF" className="text-gray-700">
                        Heart Failure (HF)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="recipientPsychiatric"
                        checked={recipientForm.comorbidities.psychiatricIllness}
                        onCheckedChange={(checked) =>
                          handleNestedChange(
                            "comorbidities.psychiatricIllness",
                            checked
                          )
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label
                        htmlFor="recipientPsychiatric"
                        className="text-gray-700"
                      >
                        Psychiatric Illness
                      </Label>
                    </div>
                  </div>

                  {/* CLCD Details */}
                  {recipientForm.comorbidities.clcd && (
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-md font-semibold text-blue-800 mb-3">Chronic Liver Disease Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="recipientChildClass" className="text-sm font-medium text-gray-700">
                            Child Class
                          </Label>
                          <Input
                            id="recipientChildClass"
                            value={recipientForm.comorbidities.childClass || ""}
                            onChange={(e) =>
                              handleNestedChange("comorbidities.childClass", e.target.value)
                            }
                            placeholder="Child Class (A, B, or C)"
                            className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recipientMELDScore" className="text-sm font-medium text-gray-700">
                            MELD Score
                          </Label>
                          <Input
                            id="recipientMELDScore"
                            value={recipientForm.comorbidities.meldScore || ""}
                            onChange={(e) =>
                              handleNestedChange("comorbidities.meldScore", e.target.value)
                            }
                            placeholder="MELD Score"
                            className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: RRT Details */}
          {step === 3 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Pill className="w-6 h-6" />
                  RRT Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Renal replacement therapy information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Modality Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-6">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Treatment Modality
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700 block">
                        RRT Modality
                      </Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="modalityHD"
                            checked={recipientForm.rrtDetails?.modalityHD || false}
                            onCheckedChange={(checked) =>
                              handleNestedChange("rrtDetails.modalityHD", checked)
                            }
                            className="border-2 border-blue-300"
                          />
                          <Label htmlFor="modalityHD" className="text-gray-700">
                            HD (Hemodialysis)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="modalityCAPD"
                            checked={recipientForm.rrtDetails?.modalityCAPD || false}
                            onCheckedChange={(checked) =>
                              handleNestedChange("rrtDetails.modalityCAPD", checked)
                            }
                            className="border-2 border-blue-300"
                          />
                          <Label htmlFor="modalityCAPD" className="text-gray-700">
                            CAPD
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Starting Date */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="rrtStartDate"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Starting Date
                      </Label>
                      <Input
                        id="rrtStartDate"
                        type="date"
                        value={recipientForm.rrtDetails?.startingDate || ""}
                        onChange={(e) =>
                          handleNestedChange("rrtDetails.startingDate", e.target.value)
                        }
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Access Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-6">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Access
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="accessFemoral"
                        checked={recipientForm.rrtDetails?.accessFemoral || false}
                        onCheckedChange={(checked) =>
                          handleNestedChange("rrtDetails.accessFemoral", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label htmlFor="accessFemoral" className="text-gray-700">
                        Femoral
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="accessIJC"
                        checked={recipientForm.rrtDetails?.accessIJC || false}
                        onCheckedChange={(checked) =>
                          handleNestedChange("rrtDetails.accessIJC", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label htmlFor="accessIJC" className="text-gray-700">
                        IJC
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="accessPermeath"
                        checked={recipientForm.rrtDetails?.accessPermeath || false}
                        onCheckedChange={(checked) =>
                          handleNestedChange("rrtDetails.accessPermeath", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label htmlFor="accessPermeath" className="text-gray-700">
                        Permeath
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="accessCAPD"
                        checked={recipientForm.rrtDetails?.accessCAPD || false}
                        onCheckedChange={(checked) =>
                          handleNestedChange("rrtDetails.accessCAPD", checked)
                        }
                        className="border-2 border-blue-300"
                      />
                      <Label htmlFor="accessCAPD" className="text-gray-700">
                        CAPD
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Complications */}
                <div className="space-y-3">
                  <Label
                    htmlFor="rrtComplications"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Complications
                  </Label>
                  <Textarea
                    id="rrtComplications"
                    value={recipientForm.rrtDetails?.complications || ""}
                    onChange={(e) =>
                      handleNestedChange("rrtDetails.complications", e.target.value)
                    }
                    placeholder="Describe any complications related to RRT..."
                    rows={4}
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Transfusion History */}
          {step === 4 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <ClipboardList className="w-6 h-6" />
                  Transfusion History
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Blood transfusion records and details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="border border-blue-300 p-4 text-left font-semibold">
                            #
                          </th>
                          <th className="border border-blue-300 p-4 text-left font-semibold">
                            Date
                          </th>
                          <th className="border border-blue-300 p-4 text-left font-semibold">
                            Indication
                          </th>
                          <th className="border border-blue-300 p-4 text-left font-semibold">
                            Volume
                          </th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfusions.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-200 p-3 text-sm font-medium text-gray-700">
                              {idx + 1}
                            </td>
                            <td className="border border-gray-200 p-2">
                              <Input
                                type="date"
                                value={row.date}
                                onChange={(e) =>
                                  handleTransfusionChange(
                                    idx,
                                    "date",
                                    e.target.value
                                  )
                                }
                                className="h-10 border-gray-300 focus:border-blue-500 rounded-md"
                              />
                            </td>
                            <td className="border border-gray-200 p-2">
                              <Input
                                placeholder="Indication"
                                value={row.indication}
                                onChange={(e) =>
                                  handleTransfusionChange(
                                    idx,
                                    "indication",
                                    e.target.value
                                  )
                                }
                                className="h-10 border-gray-300 focus:border-blue-500 rounded-md"
                              />
                            </td>
                            <td className="border border-gray-200 p-2">
                              <Input
                                placeholder="Volume (mL)"
                                value={row.volume}
                                onChange={(e) =>
                                  handleTransfusionChange(
                                    idx,
                                    "volume",
                                    e.target.value
                                  )
                                }
                                className="h-10 border-gray-300 focus:border-blue-500 rounded-md"
                              />
                            </td>
                            <td className="border border-gray-200 p-2 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeTransfusion(idx)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-start mt-4">
                    <Button
                      type="button"
                      onClick={addTransfusion}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add New Transfusion Record
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Immunological */}
          {step === 5 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Shield className="w-6 h-6" />
                  Immunological Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Blood group, cross match, HLA typing, and immunological risk
                  assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Blood Group Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Blood Group
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="recipientBloodGroupD"
                        className="text-sm font-semibold text-gray-700"
                      >
                        D Group
                      </Label>
                      <Input
                        id="recipientBloodGroupD"
                        value={recipientForm.immunologicalDetails.bloodGroup.d}
                        onChange={(e) =>
                          handleNestedChange(
                            "immunologicalDetails.bloodGroup.d",
                            e.target.value
                          )
                        }
                        placeholder="Enter D value"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="recipientBloodGroupR"
                        className="text-sm font-semibold text-gray-700"
                      >
                        R Group
                      </Label>
                      <Input
                        id="recipientBloodGroupR"
                        value={recipientForm.immunologicalDetails.bloodGroup.r}
                        onChange={(e) =>
                          handleNestedChange(
                            "immunologicalDetails.bloodGroup.r",
                            e.target.value
                          )
                        }
                        placeholder="Enter R value"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Cross Match Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cross Match
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="recipientTCell"
                        className="text-sm font-semibold text-gray-700"
                      >
                        T Cell
                      </Label>
                      <Input
                        id="recipientTCell"
                        value={
                          recipientForm.immunologicalDetails.crossMatch.tCell
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            "immunologicalDetails.crossMatch.tCell",
                            e.target.value
                          )
                        }
                        placeholder="Enter T cell value"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="recipientBCell"
                        className="text-sm font-semibold text-gray-700"
                      >
                        B Cell
                      </Label>
                      <Input
                        id="recipientBCell"
                        value={
                          recipientForm.immunologicalDetails.crossMatch.bCell
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            "immunologicalDetails.crossMatch.bCell",
                            e.target.value
                          )
                        }
                        placeholder="Enter B cell value"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* HLA Typing Section */}
                <div className="bg-white p-6 rounded-lg border-2 border-blue-200 space-y-6">
                  <h3 className="text-lg font-semibold text-blue-900">
                    HLA Typing
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="border border-blue-300 p-4 text-left font-semibold">
                            Type
                          </th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">
                            HLA-A
                          </th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">
                            HLA-B
                          </th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">
                            HLA-C
                          </th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">
                            HLA-DR
                          </th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">
                            HLA-DP
                          </th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">
                            HLA-DQ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Donor HLA */}
                        <tr className="bg-blue-50">
                          <td className="border border-gray-200 p-4 font-semibold text-blue-900">
                            Donor
                          </td>
                          {[
                            "hlaA",
                            "hlaB",
                            "hlaC",
                            "hlaDR",
                            "hlaDP",
                            "hlaDQ",
                          ].map((type) => (
                            <td
                              key={type}
                              className="border border-gray-200 p-2"
                            >
                              <Input
                                value={
                                  recipientForm.immunologicalDetails.hlaTyping
                                    .donor[
                                    type as keyof typeof recipientForm.immunologicalDetails.hlaTyping.donor
                                  ]
                                }
                                onChange={(e) =>
                                  handleNestedChange(
                                    `immunologicalDetails.hlaTyping.donor.${type}`,
                                    e.target.value
                                  )
                                }
                                placeholder={type.replace("hla", "")}
                                className="h-10 border-gray-300 focus:border-blue-500 text-center"
                              />
                            </td>
                          ))}
                        </tr>
                        {/* Recipient HLA */}
                        <tr className="bg-white">
                          <td className="border border-gray-200 p-4 font-semibold text-gray-900">
                            Recipient
                          </td>
                          {[
                            "hlaA",
                            "hlaB",
                            "hlaC",
                            "hlaDR",
                            "hlaDP",
                            "hlaDQ",
                          ].map((type) => (
                            <td
                              key={type}
                              className="border border-gray-200 p-2"
                            >
                              <Input
                                value={
                                  recipientForm.immunologicalDetails.hlaTyping
                                    .recipient[
                                    type as keyof typeof recipientForm.immunologicalDetails.hlaTyping.recipient
                                  ]
                                }
                                onChange={(e) =>
                                  handleNestedChange(
                                    `immunologicalDetails.hlaTyping.recipient.${type}`,
                                    e.target.value
                                  )
                                }
                                placeholder={type.replace("hla", "")}
                                className="h-10 border-gray-300 focus:border-blue-500 text-center"
                              />
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
{/* PRA Section */}
<div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4">
  <h3 className="text-lg font-semibold text-blue-900">
    PRA (Panel Reactive Antibodies)
  </h3>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="space-y-3">
      <Label
        htmlFor="recipientPraPre"
        className="text-sm font-semibold text-gray-700"
      >
        Pre (%)
      </Label>
      <Input
        id="recipientPraPre"
        value={recipientForm.immunologicalDetails.praPre}
        onChange={(e) =>
          handleNestedChange(
            "immunologicalDetails.praPre",
            e.target.value
          )
        }
        placeholder="Pre PRA percentage"
        type="number"
        min="0"
        max="100"
        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
      />
    </div>
    <div className="space-y-3">
      <Label
        htmlFor="recipientPraPost"
        className="text-sm font-semibold text-gray-700"
      >
        Post (%)
      </Label>
      <Input
        id="recipientPraPost"
        value={recipientForm.immunologicalDetails.praPost}
        onChange={(e) =>
          handleNestedChange(
            "immunologicalDetails.praPost",
            e.target.value
          )
        }
        placeholder="Post PRA percentage"
        type="number"
        min="0"
        max="100"
        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
      />
    </div>
  </div>
</div>


             {/* DSA and Immunological Risk */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="recipientDSA"
                      className="text-sm font-semibold text-gray-700"
                    >
                      DSA (Donor Specific Antibodies)
                    </Label>
                    <Input
                      id="recipientDSA"
                      value={recipientForm.immunologicalDetails.dsa}
                      onChange={(e) =>
                        handleNestedChange(
                          "immunologicalDetails.dsa",
                          e.target.value
                        )
                      }
                      placeholder="DSA details"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="recipientImmunologicalRisk"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Immunological Risk
                    </Label>
                    <Input
                      id="recipientImmunologicalRisk"
                      value={recipientForm.immunologicalDetails.immunologicalRisk}
                      onChange={(e) =>
                        handleNestedChange(
                          "immunologicalDetails.immunologicalRisk",
                          e.target.value
                        )
                      }
                      placeholder="Immunological risk assessment"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Confirmation */}
          {step === 6 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileText className="w-6 h-6" />
                  Confirmation & Submission
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Review all information before final submission
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info Summary */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {recipientForm.name || "Not provided"}</p>
                      <p><strong>Age:</strong> {recipientForm.age || "Not provided"}</p>
                      <p><strong>Gender:</strong> {recipientForm.gender || "Not provided"}</p>
                      <p><strong>NIC:</strong> {recipientForm.nicNo || "Not provided"}</p>
                      <p><strong>Contact:</strong> {recipientForm.contactDetails || "Not provided"}</p>
                    </div>
                  </div>

              {/* Donor Summary - COMMENTED OUT */}
{/*
<div className="bg-green-50 p-6 rounded-lg border border-green-200">
  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
    <Heart className="w-5 h-5" />
    Donor Information
  </h3>
  {selectedDonor ? (
    <div className="space-y-2 text-sm">
      <p><strong>Donor:</strong> {selectedDonor.name}</p>
      <p><strong>Blood Group:</strong> {selectedDonor.bloodGroup}</p>
      <p><strong>Relationship:</strong> {selectedDonor.relationToRecipient}</p>
      <p><strong>Type:</strong> {recipientForm.relationType}</p>
    </div>
  ) : (
    <p className="text-yellow-700 font-medium">No donor selected</p>
  )}
</div>
*/}

                  {/* Medical Summary */}
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Medical Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Diabetes:</strong> {recipientForm.comorbidities.dm ? "Yes" : "No"}</p>
                      <p><strong>Hypertension:</strong> {recipientForm.comorbidities.htn ? "Yes" : "No"}</p>
                      <p><strong>RRT Modality:</strong> 
                        {recipientForm.rrtDetails?.modalityHD ? " HD" : ""}
                        {recipientForm.rrtDetails?.modalityCAPD ? " CAPD" : ""}
                        {!recipientForm.rrtDetails?.modalityHD && !recipientForm.rrtDetails?.modalityCAPD ? " Not specified" : ""}
                      </p>
                      <p><strong>Transfusions:</strong> {transfusions.filter(t => t.date).length} records</p>
                    </div>
                  </div>

                  {/* Immunological Summary */}
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Immunological
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Blood Group:</strong> {recipientForm.immunologicalDetails.bloodGroup.d} {recipientForm.immunologicalDetails.bloodGroup.r}</p>
                      <p><strong>PRA Pre:</strong> {recipientForm.immunologicalDetails.praPre || "Not specified"}</p>
                      <p><strong>Immunological Risk:</strong> {recipientForm.immunologicalDetails.immunologicalRisk || "Not assessed"}</p>
                    </div>
                  </div>
                </div>

                {/* Completion Status */}
                <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Assessment Status
                      </h3>
                      <p className="text-gray-600">
                        {isEditing ? "Updating existing assessment" : "Creating new assessment"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">All Steps Completed</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Ready for submission
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Validation Errors */}
                {errors.confirmation && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">Cannot Submit</p>
                        <p className="text-sm text-red-700">{errors.confirmation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Status Indicator */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">Editing existing assessment</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-700 font-medium">Creating new assessment</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Auto-save: {recipientForm.name ? "Active" : "Waiting for data"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 0}
                className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {/* Reset Form Button - Only show on first step */}
              {step === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetForm}
                  className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Reset Form
                </Button>
              )}
            </div>

            <div className="flex gap-4">
              {/* Save as Draft Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const draftData = {
                    form: recipientForm,
                    transfusions,
                    step,
                  };
                  localStorage.setItem(
                    "recipient-assessment-draft",
                    JSON.stringify(draftData)
                  );
                  alert("Draft saved successfully!");
                }}
                className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>

              {/* Next/Submit Button */}
              {step < FORM_STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Next Step
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isEditing ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {isEditing ? "Update Assessment" : "Submit Assessment"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Step Progress Indicator */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">
                Step {step + 1} of {FORM_STEPS.length}
              </span>
              <div className="flex gap-1">
                {FORM_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === step
                        ? "bg-blue-600"
                        : idx < step
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">
                {Math.round(((step + 1) / FORM_STEPS.length) * 100)}% Complete
              </span>
            </div>
          </div>
        </form>

        {/* Unsaved Changes Warning */}
        <div className="fixed bottom-4 right-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800 text-sm">
                  Auto-save Active
                </p>
                <p className="text-yellow-700 text-xs">
                  Your progress is automatically saved as you work
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientAssessment;