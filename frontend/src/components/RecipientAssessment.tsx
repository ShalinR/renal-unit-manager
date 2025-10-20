import React, { useState, useEffect } from "react";
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
  Trash2 ,
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
    psychiatricIllness: boolean;
    htn: boolean;
    ihd: boolean;
  };
  rrtModality?: string;
  rrtStartDate?: string;
  rrtComplications?: string;

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
    pra: {
      pre: string;
      post: string;
    };
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
  { label: "Relationship", icon: Heart },
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
  
  // Use donors from props or context
  const donorList = donors && donors.length > 0 ? donors : contextDonors;
  const filteredDonors = donorList.filter(
    (donor) =>
      donor.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
      donor.bloodGroup.toLowerCase().includes(donorSearch.toLowerCase()) ||
      donor.relationToRecipient
        ?.toLowerCase()
        .includes(donorSearch.toLowerCase())
  );

  const [transfusions, setTransfusions] = useState<
    { date: string; indication: string; volume: string }[]
  >([{ date: "", indication: "", volume: "" }]);

 
useEffect(() => {
  if (patient?.name) {
    console.log("Auto-populating form with patient data...");

    setRecipientForm((prevForm) => {
      // Check if any patient data is actually different from current form data
      const hasChanges =
        prevForm.name !== patient.name ||
        prevForm.age !== (patient.age?.toString() || "") ||
        prevForm.gender !== (patient.gender || "") ||
        prevForm.dateOfBirth !== (patient.dateOfBirth || "") ||
        prevForm.occupation !== (patient.occupation || "") ||
        prevForm.address !== (patient.address || "") ||
        prevForm.nicNo !== (patient.nic || "") ||
        prevForm.contactDetails !== (patient.contact || "") ||
        prevForm.emailAddress !== (patient.email || "");

      if (!hasChanges) {
        console.log("No changes detected, skipping update");
        return prevForm;
      }

      console.log("Updating form with patient data");
      return {
        ...prevForm,
        name: patient.name || "",
        age: patient.age?.toString() || "",
        gender: patient.gender || "",
        dateOfBirth: patient.dateOfBirth || "",
        occupation: patient.occupation || "",
        address: patient.address || "",
        nicNo: patient.nic || "",
        contactDetails: patient.contact || "",
        emailAddress: patient.email || "",
      };
    });
  }
}, [
  patient?.name,
  patient?.age,
  patient?.gender,
  patient?.dateOfBirth,
  patient?.occupation,
  patient?.address,
  patient?.nic,
  patient?.contact,
  patient?.email,
  setRecipientForm,
]);

// Auto-fill donor information when a donor is selected - FIXED
useEffect(() => {
  if (selectedDonor) {
    console.log("Auto-populating donor information:", selectedDonor);
    setRecipientForm((prev) => ({
      ...prev,
      donorId: selectedDonor.id,
      relationType: selectedDonor.relationType || "",
      relationToRecipient: selectedDonor.relationToRecipient || "",
    }));
  }
}, [selectedDonor, setRecipientForm]);


  // Auto-save functionality
useEffect(() => {
  const autoSave = setTimeout(() => {
    // Only save if there are actual changes (not just auto-populated data)
    if (recipientForm.name || recipientForm.donorId) {
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
    }
  }, 2000);

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
  const handleDonorSelection = (donorId: string) => {
    const selected = donorList.find((donor) => donor.id === donorId);
    if (selected) {
      setSelectedDonor(selected);
      handleNestedChange("donorId", donorId);
      handleNestedChange("relationType", selected.relationType || "");
      handleNestedChange(
        "relationToRecipient",
        selected.relationToRecipient || ""
      );
    }
  };

  // Add this to your imports if not already there

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
        psychiatricIllness: false,
        htn: false,
        ihd: false,
      },
      rrtModality: "",
      rrtStartDate: "",
      rrtComplications: "",
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
        pra: {
          pre: "",
          post: "",
        },
        dsa: "",
        immunologicalRisk: "",
      },
    });

    // Reset other states
    setStep(0);
    setErrors({});
    setTransfusions([{ date: "", indication: "", volume: "" }]);
    setSelectedDonor(null);
    setDonorSearch("");
    
    // Clear draft data
    localStorage.removeItem("recipient-assessment-draft");
    
    console.log("Form reset successfully");
  }
};
  // Clear donor selection
  const handleClearDonorSelection = () => {
    setSelectedDonor(null);
    handleNestedChange("donorId", "");
    handleNestedChange("relationType", "");
    handleNestedChange("relationToRecipient", "");
  };

  // Helper function to handle nested object changes
 const handleNestedChange = (path: string, value: any) => {
  // Add a check to prevent unnecessary updates
  const currentValue = getNestedValue(recipientForm, path);
  if (currentValue !== value) {
    handleRecipientFormChange(path, value);
  }
};

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

    case 1: // Relationship - FIXED
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
// Remove this entire useEffect:
// useEffect(() => {
//   handleNestedChange("transfusionHistory", transfusions);
// }, [transfusions]);

// And update the transfusion handlers to manually update the form:
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
  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(FORM_STEPS.length - 1, s + 1));
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  // Enhanced submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateStep(step)) {
        await handleRecipientFormSubmit(e);
        
        // Clear draft data after successful submission
        localStorage.removeItem("recipient-assessment-draft");

        console.log("Assessment submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
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
                  Recipient Assessment
                </h1>
                <p className="text-blue-600">
                  {patient && patient.name
                    ? `Patient: ${patient.name} (PHN: ${patient.phn})`
                    : "Complete medical evaluation for kidney transplant recipient"}
                </p>
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

          {/* Progress Stepper - FIXED: Added click handlers */}
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
          {/* Step 0: Personal Info - FIXED: Added proper error handling */}
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

          {/* Step 1: Relationship - Enhanced with Search */}
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
                  
                  {/* Search Input */}
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

                  {/* No donor selected message */}
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

                {/* Only show relationship details if donor is selected */}
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

                {/* Option to skip donor selection entirely */}
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

          {/* Steps 2-5 remain the same as your original code */}
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
                </div>
              </CardContent>
            </Card>
          )}

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
                  <div className="space-y-3">
                    <Label
                      htmlFor="rrtModality"
                      className="text-sm font-semibold text-gray-700"
                    >
                      RRT Modality
                    </Label>
                    <Input
                      id="rrtModality"
                      value={recipientForm.rrtModality || ""}
                      onChange={(e) =>
                        handleNestedChange("rrtModality", e.target.value)
                      }
                      placeholder="e.g., Hemodialysis, CAPD, etc."
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Starting Date */}
                <div className="space-y-3">
                  <Label
                    htmlFor="rrtStartDate"
                    className="text-sm font-semibold text-gray-700"
                  >
                    RRT Starting Date
                  </Label>
                  <Input
                    id="rrtStartDate"
                    type="date"
                    value={recipientForm.rrtStartDate || ""}
                    onChange={(e) =>
                      handleNestedChange("rrtStartDate", e.target.value)
                    }
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg max-w-md"
                  />
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
                    value={recipientForm.rrtComplications || ""}
                    onChange={(e) =>
                      handleNestedChange("rrtComplications", e.target.value)
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
                        value={recipientForm.immunologicalDetails.pra.pre}
                        onChange={(e) =>
                          handleNestedChange(
                            "immunologicalDetails.pra.pre",
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
                        value={recipientForm.immunologicalDetails.pra.post}
                        onChange={(e) =>
                          handleNestedChange(
                            "immunologicalDetails.pra.post",
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

                {/* DSA Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    DSA (Donor Specific Antibodies)
                  </h3>
                  <div className="space-y-3">
                    <Label
                      htmlFor="recipientDsa"
                      className="text-sm font-semibold text-gray-700"
                    >
                      DSA Details
                    </Label>
                    <Textarea
                      id="recipientDsa"
                      value={recipientForm.immunologicalDetails.dsa}
                      onChange={(e) =>
                        handleNestedChange(
                          "immunologicalDetails.dsa",
                          e.target.value
                        )
                      }
                      placeholder="Enter DSA test results and details..."
                      rows={3}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-lg resize-none"
                    />
                  </div>
                </div>

                {/* Immunological Risk */}
                <div className="bg-white p-6 rounded-lg border-2 border-blue-200 space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Immunological Risk Assessment
                  </h3>
                  <RadioGroup
                    value={recipientForm.immunologicalDetails.immunologicalRisk}
                    onValueChange={(value) =>
                      handleNestedChange(
                        "immunologicalDetails.immunologicalRisk",
                        value
                      )
                    }
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <RadioGroupItem
                        value="low"
                        id="recipientRiskLow"
                        className="border-2 border-green-400"
                      />
                      <Label
                        htmlFor="recipientRiskLow"
                        className="text-green-800 font-semibold"
                      >
                        Low Risk
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <RadioGroupItem
                        value="average"
                        id="recipientRiskAverage"
                        className="border-2 border-yellow-400"
                      />
                      <Label
                        htmlFor="recipientRiskAverage"
                        className="text-yellow-800 font-semibold"
                      >
                        Average Risk
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <RadioGroupItem
                        value="high"
                        id="recipientRiskHigh"
                        className="border-2 border-red-400"
                      />
                      <Label
                        htmlFor="recipientRiskHigh"
                        className="text-red-800 font-semibold"
                      >
                        High Risk
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Confirmation - Enhanced */}
          {step === 6 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileText className="w-6 h-6" />
                  Final Confirmation
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Review and confirm all assessment details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {errors.confirmation && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-700 font-medium">{errors.confirmation}</p>
                    </div>
                  </div>
                )}

                {/* Donor Summary */}
                <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                  <p><span className="font-medium text-gray-700">Selected Donor:</span> 
                    {recipientForm.donorId 
                      ? donorList.find(d => d.id === recipientForm.donorId)?.name 
                      : "No donor selected"
                    }
                  </p>
                  {recipientForm.donorId && (
                    <>
                      <p><span className="font-medium text-gray-700">Relationship Type:</span> {recipientForm.relationType || "Not specified"}</p>
                      <p><span className="font-medium text-gray-700">Specific Relation:</span> {recipientForm.relationToRecipient || "Not specified"}</p>
                    </>
                  )}
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="recipientFilledBy" className="text-sm font-semibold text-gray-700 flex items-center">
                      Assessment Completed By <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="recipientFilledBy"
                      placeholder="Enter your name or staff ID"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-blue-200">
                    <Checkbox
                      id="recipientFinalCheck"
                      className="border-2 border-blue-300 mt-1"
                      required
                    />
                    <div className="space-y-2">
                      <Label htmlFor="recipientFinalCheck" className="text-gray-700 font-medium leading-relaxed">
                        I confirm that all information provided in this recipient assessment is accurate and complete to the best of my knowledge.
                      </Label>
                      <p className="text-sm text-gray-600">
                        By checking this box, I acknowledge that this assessment will be used for medical decision-making and transplant evaluation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Summary Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Assessment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <p><span className="font-medium text-gray-700">Patient Name:</span> {recipientForm.name || "Not provided"}</p>
                      <p><span className="font-medium text-gray-700">Age:</span> {recipientForm.age || "Not provided"}</p>
                      <p><span className="font-medium text-gray-700">NIC Number:</span> {recipientForm.nicNo || "Not provided"}</p>
                      <p><span className="font-medium text-gray-700">Gender:</span> {recipientForm.gender || "Not provided"}</p>
                    </div>
                    <div className="space-y-3">
                      <p><span className="font-medium text-gray-700">Selected Donor:</span> {recipientForm.donorId ? donorList.find(d => d.id === recipientForm.donorId)?.name : "Not selected"}</p>
                      <p><span className="font-medium text-gray-700">Relationship Type:</span> {recipientForm.relationType || "Not specified"}</p>
                      <p><span className="font-medium text-gray-700">Blood Transfusions:</span> {transfusions.filter(t => t.date).length} recorded</p>
                      <p><span className="font-medium text-gray-700">Assessment Date:</span> {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons - FIXED: Added loading state */}
          <div className="flex justify-between items-center pt-8 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-4">
              {step < FORM_STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Next Step
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Assessment
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipientAssessment;