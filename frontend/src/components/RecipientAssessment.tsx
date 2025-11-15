import React, { useState, useEffect, useCallback } from "react";
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
import { Donor } from "@/types/donor";
// Import interfaces from types
import {
  RecipientAssessmentForm,
  RecipientAssessmentDTO,
  RecipientAssessmentResponseDTO,
} from "@/types/recipient";

// Import API services
import {
  recipientApiService,
  fetchLatestRecipientAssessment,
} from "@/services/recipientApi";

interface RecipientAssessmentProps {
  recipientForm: RecipientAssessmentForm;
  setRecipientForm: React.Dispatch<
    React.SetStateAction<RecipientAssessmentForm>
  >;
  setActiveView: React.Dispatch<React.SetStateAction<string>>;
  handleRecipientFormChange: (field: string, value: any) => void;
  handleRecipientFormSubmit: (e: React.FormEvent) => void;
}
const FORM_STEPS = [
  { label: "Personal Info", icon: User },
  { label: "Donor Relationship", icon: Heart },
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
}) => {
  const { patient } = usePatientContext();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [donorSearchPhn, setDonorSearchPhn] = useState("");
  const [donorSearchResults, setDonorSearchResults] = useState<any>(null);
  const [searchingDonor, setSearchingDonor] = useState(false);
  const [viewMode, setViewMode] = useState<boolean>(false); // NEW: View mode state
  const [assignedDonor, setAssignedDonor] = useState<Donor | null>(null);
  const {
    donors,
    fetchDonors,
    fetchAllDonors,
    getAvailableDonors,
    setSelectedDonor: setContextSelectedDonor,
  } = useDonorContext();

  const [transfusions, setTransfusions] = useState<
    { date: string; indication: string; volume: string }[]
  >([{ date: "", indication: "", volume: "" }]);
  const handleSelectDonor = (donor: Donor) => {
    console.log("🔗 Selecting donor:", {
      id: donor.id,
      patientPhn: donor.patientPhn,
      name: donor.name,
      bloodGroup: donor.bloodGroup,
    });

    handleRecipientFormChange("donorId", donor.id);
    handleRecipientFormChange("donorPhn", donor.patientPhn || ""); // ✅ FIXED
    handleRecipientFormChange("donorName", donor.name || "Unknown Donor"); // ✅ FIXED
    handleRecipientFormChange("donorBloodGroup", donor.bloodGroup || "");
    setDonorSearchResults(donor);

    console.log("✅ Updated form with donor:", {
      donorId: recipientForm.donorId,
      donorPhn: recipientForm.donorPhn,
      donorName: recipientForm.donorName,
      donorBloodGroup: recipientForm.donorBloodGroup,
    });
  };
  // ✅ NEW API service using the proper service
  const apiService = {
    // Search donor by PHN - This should use your donor assessment endpoint
    searchDonorByPhn: async (phn: string) => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/donor-assessment/patient/${phn}`
        );
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error("Failed to search donor");
        }
        const assessments = await response.json();
        // Return the first assessment if available
        return assessments.length > 0 ? assessments[0] : null;
      } catch (error) {
        console.error("Error searching donor:", error);
        return null;
      }
    },

    // Load recipient assessment - Make sure this endpoint exists
    loadRecipientAssessment: async (phn: string) => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/recipient-assessment/patient/${phn}`
        );
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error("Failed to load recipient assessment");
        }
        const assessments = await response.json();
        return assessments.length > 0 ? assessments[0] : null;
      } catch (error) {
        console.error("Error loading recipient assessment:", error);
        return null;
      }
    },

    // Load patient data
    loadPatientData: async (phn: string) => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/patient/${encodeURIComponent(phn)}`
        );
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error("Failed to load patient data");
        }
        return response.json();
      } catch (error) {
        console.error("Error loading patient data:", error);
        return null;
      }
    },

    // Save recipient assessment
    saveRecipientAssessment: async (
      data: RecipientAssessmentForm,
      isEditing: boolean,
      id?: number
    ) => {
      try {
        const url =
          isEditing && id
            ? `http://localhost:8081/api/recipient-assessment/${id}`
            : "http://localhost:8081/api/recipient-assessment";

        const method = isEditing ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to ${isEditing ? "update" : "create"} assessment`
          );
        }

        return response.json();
      } catch (error) {
        console.error("Error saving recipient assessment:", error);
        throw error;
      }
    },
  };
  const toggleViewMode = () => {
    setViewMode(!viewMode);
  };

  // NEW: Function to handle step navigation in view mode
  const handleViewModeStepChange = (newStep: number) => {
    if (viewMode) {
      setStep(newStep);
    }
  };

  useEffect(() => {
    const loadAssignedDonor = async () => {
      if (patient?.phn) {
        try {
          // Fetch donors for this specific recipient
          await fetchDonors(patient.phn);

          // Find the assigned donor for this recipient
          const assigned = donors.find(
            (donor) =>
              donor.assignedRecipientPhn === patient.phn &&
              donor.status === "assigned"
          );

          if (assigned) {
            setAssignedDonor(assigned);
            setContextSelectedDonor(assigned);
          }
        } catch (error) {
          console.error("Failed to fetch assigned donor:", error);
        }
      }
    };

    loadAssignedDonor();
  }, [patient?.phn, fetchDonors, setContextSelectedDonor]);
  // In RecipientAssessment component, replace the current useEffect with this:

  useEffect(() => {
    let isMounted = true;
    let hasLoaded = false;

    const loadData = async () => {
      if (!patient?.phn || patient.phn.trim() === "" || hasLoaded) {
        return;
      }

      console.log("🔄 Loading assessment for PHN:", patient.phn);
      hasLoaded = true;

      try {
        setIsSubmitting(true);

        // Set basic patient info
        if (isMounted) {
          setRecipientForm((prev) => ({
            ...prev,
            phn: patient.phn || "",
            name: patient.name || prev.name,
            age: Number(patient.age) || prev.age,
            gender: patient.gender || prev.gender,
            dateOfBirth: patient.dateOfBirth || prev.dateOfBirth,
            contactDetails: patient.contact || prev.contactDetails,
            emailAddress: patient.email || prev.emailAddress,
          }));
        }

        // ✅ NEW: Automatically fetch available donors when patient is loaded
        await fetchAllDonors();
        console.log("✅ Available donors loaded automatically");

        // Load existing assessment
        const existingAssessment = await fetchLatestRecipientAssessment(
          patient.phn
        );

        if (isMounted) {
          if (existingAssessment) {
            console.log("✅ Found existing assessment:", existingAssessment);

            // IMPORTANT: Set the entire form with the existing assessment data
            setRecipientForm(existingAssessment);
            setIsEditing(true);
            setViewMode(true);

            // Set donor search results if donor is assigned
            if (existingAssessment.donorId) {
              console.log("🔗 Found assigned donor:", {
                donorId: existingAssessment.donorId,
                donorName: existingAssessment.donorName,
                donorPhn: existingAssessment.donorPhn,
              });

              // Set donor search results to show the selected donor
              setDonorSearchResults({
                id: existingAssessment.donorId,
                name: existingAssessment.donorName,
                patientPhn: existingAssessment.donorPhn,
                bloodGroup: existingAssessment.donorBloodGroup,
              });
            }

            if (existingAssessment.transfusionHistory?.length > 0) {
              setTransfusions(existingAssessment.transfusionHistory);
            } else {
              setTransfusions([{ date: "", indication: "", volume: "" }]);
            }
          } else {
            setIsEditing(false);
            setViewMode(false);
            console.log("📝 No existing assessment found, creating new one");
          }
        }
      } catch (error) {
        console.error("❌ Error loading patient assessment data:", error);
        if (isMounted) {
          setIsEditing(false);
          setViewMode(false);
        }
      } finally {
        if (isMounted) {
          setIsSubmitting(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [patient?.phn, fetchAllDonors]);

  useEffect(() => {
    if (recipientForm.phn?.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phn;
        return newErrors;
      });
    }
  }, [recipientForm.phn]);


const searchDonorByPhn = async () => {
  if (!donorSearchPhn.trim()) {
    alert("Please enter a donor's PHN to search");
    return;
  }

  setSearchingDonor(true);
  setErrors((prev) => ({ ...prev, donorSearch: "" }));

  try {
    console.log("🔍 Searching for donor with PHN:", donorSearchPhn);

    // ✅ CORRECT: Search for donor by THEIR OWN PHN
    const response = await fetch(
      `http://localhost:8081/api/donor-assessment/patient/${donorSearchPhn}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        setErrors((prev) => ({
          ...prev,
          donorSearch: "No donor found with this PHN. Please check the PHN and try again.",
        }));
        setDonorSearchResults(null);
        return;
      }
      throw new Error('Failed to search donor');
    }

    const donorAssessments = await response.json();
    console.log("📋 Donor search results:", donorAssessments);

    if (donorAssessments && donorAssessments.length > 0) {
      const donorData = donorAssessments[0];
      
      // ✅ Transform to match your Donor type
       const donor: Donor = {
        id: donorData.id?.toString(),
        name: donorData.name,
        patientPhn: donorData.patientPhn, // Donor's PHN
        bloodGroup: `${donorData.immunologicalDetails?.bloodGroup?.d || ''}${donorData.immunologicalDetails?.bloodGroup?.r || ''}`,
        age: donorData.age,
        gender: donorData.gender,
        dateOfBirth: donorData.dateOfBirth,
        occupation: donorData.occupation,
        address: donorData.address,
        nicNo: donorData.nicNo,
        contactDetails: donorData.contactDetails,
        emailAddress: donorData.emailAddress,
        relationType: donorData.relationType,
        relationToRecipient: donorData.relationToRecipient,
        status: donorData.status || 'available',
        assignedRecipientPhn: donorData.assignedRecipientPhn,
        assignedRecipientName: donorData.assignedRecipientName,
        comorbidities: donorData.comorbidities,
        examination: donorData.examination,
        immunologicalDetails: donorData.immunologicalDetails,
      };

      setDonorSearchResults(donor);

      // Auto-populate donor information
      handleRecipientFormChange("donorId", donor.id);
      handleRecipientFormChange("donorPhn", donor.patientPhn); // Donor's PHN
      handleRecipientFormChange("donorName", donor.name);
      handleRecipientFormChange("donorBloodGroup", donor.bloodGroup);

      setDonorSearchPhn("");
    } else {
      setErrors((prev) => ({
        ...prev,
        donorSearch: "No donor assessment found with this PHN.",
      }));
      setDonorSearchResults(null);
    }
  } catch (error) {
    console.error("❌ Error searching donor:", error);
    setErrors((prev) => ({
      ...prev,
      donorSearch: "Failed to search for donor. Please try again.",
    }));
    setDonorSearchResults(null);
  } finally {
    setSearchingDonor(false);
  }
};
  // Clear donor selection
  const clearDonorSelection = () => {
    setDonorSearchPhn("");
    setDonorSearchResults(null);
    handleRecipientFormChange("donorId", "");
    handleRecipientFormChange("donorPhn", "");
    handleRecipientFormChange("donorName", "");
    handleRecipientFormChange("donorBloodGroup", "");
    handleRecipientFormChange("relationType", "");
    handleRecipientFormChange("relationToRecipient", "");
  };

  // Helper function to handle nested object changes
  const handleNestedChange = useCallback(
    (path: string, value: any) => {
      handleRecipientFormChange(path, value);
    },
    [handleRecipientFormChange]
  );

  // Form validation
  // Form validation
  const validateStep = (step: number, form?: typeof recipientForm): boolean => {
    const formToValidate = form || recipientForm;
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Personal Info
        if (!formToValidate.phn?.trim()) newErrors.phn = "PHN is required";
        if (!formToValidate.name.trim()) newErrors.name = "Name is required";
        if (!formToValidate.age) newErrors.age = "Age is required";
        if (!formToValidate.nicNo.trim()) newErrors.nicNo = "NIC is required";
        if (!formToValidate.gender) newErrors.gender = "Gender is required";
        if (!formToValidate.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!formToValidate.contactDetails.trim())
          newErrors.contactDetails = "Contact number is required";
        break;

      case 1: // Donor Relationship - FIXED: Make donor relationship optional
        // Only validate relationship fields IF a donor is actually selected
        if (formToValidate.donorId) {
          if (!formToValidate.relationType) {
            newErrors.relationType =
              "Relationship type is required when donor is selected";
          }
          if (
            formToValidate.relationType === "related" &&
            !formToValidate.relationToRecipient?.trim()
          ) {
            newErrors.relationToRecipient =
              "Specific relation is required for related donors";
          }
        }
        // If no donor is selected, that's fine - user can proceed
        break;

      case 6: // Confirmation
        if (!formToValidate.name.trim()) {
          newErrors.confirmation =
            "Please complete all required steps before submitting";
        }
        // Add validation for medical staff fields
        if (!formToValidate.completedBy?.staffName?.trim()) {
          newErrors.staffName = "Staff name is required";
        }
        if (!formToValidate.completedBy?.staffRole?.trim()) {
          newErrors.staffRole = "Staff role is required";
        }
        if (!formToValidate.completedBy?.department?.trim()) {
          newErrors.department = "Department is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Navigation handlers
  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(FORM_STEPS.length - 1, prev + 1));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  // Enhanced submit handler
  // Enhanced submit handler with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (viewMode) {
      setViewMode(false);
      return;
    }

    // Validate current step synchronously using the form parameter
    const newErrors: Record<string, string> = {};
    const currentForm = recipientForm;
    
    // Validate step 6 (confirmation step for submission)
    if (!currentForm.name.trim()) {
      newErrors.confirmation =
        "Please complete all required steps before submitting";
    }
    if (!currentForm.completedBy?.staffName?.trim()) {
      newErrors.staffName = "Staff name is required";
    }
    if (!currentForm.completedBy?.staffRole?.trim()) {
      newErrors.staffRole = "Staff role is required";
    }
    if (!currentForm.completedBy?.department?.trim()) {
      newErrors.department = "Department is required";
    }

    // If validation fails, update errors and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Validation passed, clear any previous errors and submit
    setErrors({});
    setIsSubmitting(true);

    try {
      const assessmentData: RecipientAssessmentForm = {
        ...recipientForm,
        transfusionHistory: transfusions.filter(
          (t) => t.date || t.indication || t.volume
        ),
        // Ensure donor data is included
        donorId: recipientForm.donorId,
        donorPhn: recipientForm.donorPhn,
        donorName: recipientForm.donorName,
        donorBloodGroup: recipientForm.donorBloodGroup,
        relationType: recipientForm.relationType,
        relationToRecipient: recipientForm.relationToRecipient,
      };

      if (!assessmentData.phn) {
        throw new Error("PHN is required");
      }

      console.log("💾 Saving assessment with donor data:", {
        donorId: assessmentData.donorId,
        donorName: assessmentData.donorName,
        donorPhn: assessmentData.donorPhn,
      });

      const savedAssessment = await recipientApiService.saveRecipientAssessment(
        assessmentData,
        isEditing,
        recipientForm.id
      );

      if (savedAssessment) {
        console.log("✅ Assessment saved successfully:", savedAssessment);
        setRecipientForm(savedAssessment);

        // Update donor search results after save
        if (savedAssessment.donorId) {
          setDonorSearchResults({
            id: savedAssessment.donorId,
            name: savedAssessment.donorName,
            patientPhn: savedAssessment.donorPhn,
            bloodGroup: savedAssessment.donorBloodGroup,
          });
        }

        if (savedAssessment.transfusionHistory) {
          setTransfusions(savedAssessment.transfusionHistory);
        }
        setIsEditing(true);
        setViewMode(true);
        localStorage.removeItem("recipient-assessment-draft");

        alert(`Assessment ${isEditing ? "updated" : "created"} successfully!`);
        setActiveView("dashboard");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save assessment. Please try again.";
      setErrors({ submission: errorMessage });
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
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
    const finalTransfusions = newTransfusions.length
      ? newTransfusions
      : [{ date: "", indication: "", volume: "" }];
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

  // Reset form function
  // Reset form function - now using the imported type
  const handleResetForm = () => {
    if (
      confirm(
        "Are you sure you want to reset the entire form? All data will be lost."
      )
    ) {
      // Reset the form to initial empty state using the proper type structure
      const emptyForm: RecipientAssessmentForm = {
        phn: "",
        name: "",
        age: 0,
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
        relationType: "",
        relationToRecipient: "",
        transfusionHistory: [],
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
        complains: "",
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
        completedBy: {
          staffName: "",
          staffRole: "",
          staffId: "",
          department: "",
          signature: "",
          completionDate: new Date().toISOString().split("T")[0], // Default to today
        },

        reviewedBy: {
          consultantName: "",
          consultantId: "",
          reviewDate: "",
          approvalStatus: "pending",
          notes: "",
        },
      };

      setRecipientForm(emptyForm);

      // Reset other states
      setStep(0);
      setIsEditing(false);
      setErrors({});
      setTransfusions([{ date: "", indication: "", volume: "" }]);
      setDonorSearchPhn("");
      setDonorSearchResults(null);

      // Clear draft data
      localStorage.removeItem("recipient-assessment-draft");

      console.log("Form reset successfully");
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
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">
                  Recipient Assessment {isEditing && "(Editing)"}
                  {viewMode && " - View Mode"}
                </h1>
                <p className="text-blue-600">
                  {patient && patient.name
                    ? `Patient: ${patient.name} (PHN: ${patient.phn})`
                    : "Complete medical evaluation for kidney transplant recipient"}
                </p>
                <div className="flex gap-2 mt-1">
                  {isEditing && (
                    <p className="text-green-600 text-sm font-medium">
                      ✓ Editing existing assessment
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
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
                      className={`h-12 border-2 ${errors.name ? "border-red-500" : "border-gray-200"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                      required
                    />
                    {errors.name && <ErrorMessage message={errors.name} />}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="phn"
                      className="text-sm font-semibold text-gray-700 flex items-center"
                    >
                      Personal Health Number (PHN){" "}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="phn"
                      value={recipientForm.phn || ""} // ✅ Use only form state
                      onChange={(e) =>
                        handleNestedChange("phn", e.target.value)
                      }
                      placeholder="Enter PHN number"
                      className={`h-12 border-2 ${errors.phn ? "border-red-500" : "border-gray-200"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                      required
                    />
                    {errors.phn && <ErrorMessage message={errors.phn} />}
                    {patient?.phn && recipientForm.phn === patient.phn && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Auto-filled from patient search
                      </p>
                    )}
                    {patient?.phn &&
                      recipientForm.phn &&
                      recipientForm.phn !== patient.phn && (
                        <p className="text-sm text-yellow-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          PHN differs from patient search. Patient:{" "}
                          {patient.phn}
                        </p>
                      )}
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
                        handleNestedChange("age", parseInt(e.target.value) || 0)
                      }
                      placeholder="Enter age"
                      className={`h-12 border-2 ${errors.age ? "border-red-500" : "border-gray-200"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
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
                    className={`h-12 border-2 ${errors.nicNo ? "border-red-500" : "border-gray-200"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
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
                      className={`h-12 border-2 ${errors.dateOfBirth ? "border-red-500" : "border-gray-200"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                      required
                    />
                    {errors.dateOfBirth && (
                      <ErrorMessage message={errors.dateOfBirth} />
                    )}
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
                      className={`h-12 border-2 ${errors.contactDetails ? "border-red-500" : "border-gray-200"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                      required
                    />
                    {errors.contactDetails && (
                      <ErrorMessage message={errors.contactDetails} />
                    )}
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

          {step === 1 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Heart className="w-6 h-6" />
                  Donor Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Available donors are automatically loaded for this patient
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Available Donors Summary */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Available Donors
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {getAvailableDonors().length} donor(s) available for
                      selection
                    </p>
                  </div>

                  {/* Donor Selection - Auto-assign if only one available */}
                  {getAvailableDonors().length === 1 && (
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-green-900 mb-2">
                            Auto-Assigned Donor
                          </h3>
                          <p className="text-green-700">
                            One available donor found. This donor has been
                            automatically selected.
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>

                      {/* Auto-assign the single available donor */}
                      {(() => {
                        const singleDonor = getAvailableDonors()[0];
                        // Auto-assign if not already assigned
                        if (recipientForm.donorId !== singleDonor.id) {
                          handleSelectDonor(singleDonor);
                        }
                        return (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Name
                              </Label>
                              <p className="text-gray-900 font-semibold">
                                {singleDonor.name}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Blood Group
                              </Label>
                              <p className="text-gray-900 font-semibold">
                                {singleDonor.bloodGroup}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                PHN
                              </Label>
                              <p className="text-gray-900 font-semibold">
                                {singleDonor.patientPhn}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Multiple donors available - show selection */}
                  {getAvailableDonors().length > 1 && (
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        Select a Donor
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Multiple donors available. Please select one:
                      </p>

                      <div className="space-y-3">
                        {getAvailableDonors().map((donor) => (
                          <div
                            key={donor.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              recipientForm.donorId === donor.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                            }`}
                            onClick={() => handleSelectDonor(donor)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {donor.name}
                                </h4>
                                <div className="text-sm text-gray-600 mt-1">
                                  Blood Group: {donor.bloodGroup} • Age:{" "}
                                  {donor.age} • PHN: {donor.patientPhn}
                                </div>
                              </div>
                              {recipientForm.donorId === donor.id && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No donors available */}
                  {getAvailableDonors().length === 0 && (
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                      <div className="text-center">
                        <User className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                        <p className="font-medium text-yellow-800">
                          No available donors found
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          You can proceed without a donor, or check back later
                          when donors become available.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Donor Information */}
                {recipientForm.donorId && (
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-900">
                        Selected Donor
                      </h3>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Ready for Assignment
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Name
                        </Label>
                        <p className="text-gray-900 font-semibold">
                          {recipientForm.donorName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Blood Group
                        </Label>
                        <p className="text-gray-900 font-semibold">
                          {recipientForm.donorBloodGroup}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          PHN
                        </Label>
                        <p className="text-gray-900 font-semibold">
                          {recipientForm.donorPhn}
                        </p>
                      </div>
                    </div>

                    {/* Relationship Information */}
                    <div className="bg-white p-4 rounded-lg border border-green-200 space-y-4">
                      <h4 className="text-md font-semibold text-gray-900">
                        Donor Relationship
                      </h4>

                      {/* Relationship Type */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="relationType"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Relationship Type <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="relationType"
                          value={recipientForm.relationType || ""}
                          onChange={(e) =>
                            handleRecipientFormChange("relationType", e.target.value)
                          }
                          className={`w-full h-10 px-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.relationType
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                        >
                          <option value="">Select relationship type</option>
                          <option value="related">Related</option>
                          <option value="unrelated">Unrelated</option>
                          <option value="altruistic">Altruistic</option>
                        </select>
                        {errors.relationType && (
                          <p className="text-red-500 text-sm">{errors.relationType}</p>
                        )}
                      </div>

                      {/* Relation to Recipient (if related) */}
                      {recipientForm.relationType === "related" && (
                        <div className="space-y-3">
                          <Label
                            htmlFor="relationToRecipient"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Specific Relation <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="relationToRecipient"
                            value={recipientForm.relationToRecipient || ""}
                            onChange={(e) =>
                              handleRecipientFormChange(
                                "relationToRecipient",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Father, Mother, Sibling, Spouse"
                            className={`h-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.relationToRecipient
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {errors.relationToRecipient && (
                            <p className="text-red-500 text-sm">
                              {errors.relationToRecipient}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                    <h4 className="text-md font-semibold text-blue-800 mb-3">
                      Microvascular Complications
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientRetinopathy"
                          checked={recipientForm.comorbidities.retinopathy}
                          onCheckedChange={(checked) =>
                            handleNestedChange(
                              "comorbidities.retinopathy",
                              checked
                            )
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label
                          htmlFor="recipientRetinopathy"
                          className="text-gray-700"
                        >
                          Retinopathy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientNephropathy"
                          checked={recipientForm.comorbidities.nephropathy}
                          onCheckedChange={(checked) =>
                            handleNestedChange(
                              "comorbidities.nephropathy",
                              checked
                            )
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label
                          htmlFor="recipientNephropathy"
                          className="text-gray-700"
                        >
                          Nephropathy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="recipientNeuropathy"
                          checked={recipientForm.comorbidities.neuropathy}
                          onCheckedChange={(checked) =>
                            handleNestedChange(
                              "comorbidities.neuropathy",
                              checked
                            )
                          }
                          className="border-2 border-blue-300"
                        />
                        <Label
                          htmlFor="recipientNeuropathy"
                          className="text-gray-700"
                        >
                          Neuropathy
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Macrovascular Complications */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-blue-800 mb-3">
                      Macrovascular Complications
                    </h4>
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
                            <Label
                              htmlFor="recipient2DEcho"
                              className="text-sm font-medium text-gray-700"
                            >
                              2D Echo
                            </Label>
                            <Input
                              id="recipient2DEcho"
                              value={recipientForm.comorbidities.twoDEcho || ""}
                              onChange={(e) =>
                                handleNestedChange(
                                  "comorbidities.twoDEcho",
                                  e.target.value
                                )
                              }
                              placeholder="2D Echo findings"
                              className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="recipientCoronaryAngiogram"
                              className="text-sm font-medium text-gray-700"
                            >
                              Coronary Angiogram
                            </Label>
                            <Input
                              id="recipientCoronaryAngiogram"
                              value={
                                recipientForm.comorbidities.coronaryAngiogram ||
                                ""
                              }
                              onChange={(e) =>
                                handleNestedChange(
                                  "comorbidities.coronaryAngiogram",
                                  e.target.value
                                )
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
                      <h4 className="text-md font-semibold text-blue-800 mb-3">
                        Chronic Liver Disease Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="recipientChildClass"
                            className="text-sm font-medium text-gray-700"
                          >
                            Child Class
                          </Label>
                          <Input
                            id="recipientChildClass"
                            value={recipientForm.comorbidities.childClass || ""}
                            onChange={(e) =>
                              handleNestedChange(
                                "comorbidities.childClass",
                                e.target.value
                              )
                            }
                            placeholder="Child Class (A, B, or C)"
                            className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="recipientMELDScore"
                            className="text-sm font-medium text-gray-700"
                          >
                            MELD Score
                          </Label>
                          <Input
                            id="recipientMELDScore"
                            value={recipientForm.comorbidities.meldScore || ""}
                            onChange={(e) =>
                              handleNestedChange(
                                "comorbidities.meldScore",
                                e.target.value
                              )
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
                            checked={
                              recipientForm.rrtDetails?.modalityHD || false
                            }
                            onCheckedChange={(checked) =>
                              handleNestedChange(
                                "rrtDetails.modalityHD",
                                checked
                              )
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
                            checked={
                              recipientForm.rrtDetails?.modalityCAPD || false
                            }
                            onCheckedChange={(checked) =>
                              handleNestedChange(
                                "rrtDetails.modalityCAPD",
                                checked
                              )
                            }
                            className="border-2 border-blue-300"
                          />
                          <Label htmlFor="modalityHD" className="text-gray-700">
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
                          handleNestedChange(
                            "rrtDetails.startingDate",
                            e.target.value
                          )
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
                        checked={
                          recipientForm.rrtDetails?.accessFemoral || false
                        }
                        onCheckedChange={(checked) =>
                          handleNestedChange(
                            "rrtDetails.accessFemoral",
                            checked
                          )
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
                        checked={
                          recipientForm.rrtDetails?.accessPermeath || false
                        }
                        onCheckedChange={(checked) =>
                          handleNestedChange(
                            "rrtDetails.accessPermeath",
                            checked
                          )
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
                      handleNestedChange(
                        "rrtDetails.complications",
                        e.target.value
                      )
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
                        value={
                          recipientForm.immunologicalDetails?.bloodGroup?.d ||
                          ""
                        }
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
                        value={
                          recipientForm.immunologicalDetails?.bloodGroup?.r ||
                          ""
                        }
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
                                  recipientForm.immunologicalDetails?.hlaTyping
                                    ?.donor?.[
                                    type as keyof typeof recipientForm.immunologicalDetails.hlaTyping.donor
                                  ] || ""
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
                                  recipientForm.immunologicalDetails?.hlaTyping
                                    ?.recipient?.[
                                    type as keyof typeof recipientForm.immunologicalDetails.hlaTyping.recipient
                                  ] || ""
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

                        {/* Conclusion HLA */}
                        <tr className="bg-gray-50">
                          <td className="border border-gray-200 p-4 font-semibold text-gray-900">
                            Conclusion
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
                                  recipientForm.immunologicalDetails?.hlaTyping
                                    ?.conclusion?.[
                                    type as keyof typeof recipientForm.immunologicalDetails.hlaTyping.conclusion
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleNestedChange(
                                    `immunologicalDetails.hlaTyping.conclusion.${type}`,
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
                        value={recipientForm.immunologicalDetails?.praPre || ""}
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
                        value={
                          recipientForm.immunologicalDetails?.praPost || ""
                        }
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
                      value={recipientForm.immunologicalDetails?.dsa || ""}
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
                      value={
                        recipientForm.immunologicalDetails?.immunologicalRisk ||
                        ""
                      }
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
                      <p>
                        <strong>Name:</strong>{" "}
                        {recipientForm.name || "Not provided"}
                      </p>
                      <p>
                        <strong>Age:</strong>{" "}
                        {recipientForm.age || "Not provided"}
                      </p>
                      <p>
                        <strong>Gender:</strong>{" "}
                        {recipientForm.gender || "Not provided"}
                      </p>
                      <p>
                        <strong>NIC:</strong>{" "}
                        {recipientForm.nicNo || "Not provided"}
                      </p>
                      <p>
                        <strong>Contact:</strong>{" "}
                        {recipientForm.contactDetails || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Donor Summary */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Donor Information
                    </h3>
                    {recipientForm.donorId ? (
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Donor:</strong> {recipientForm.donorName}
                        </p>
                        <p>
                          <strong>Blood Group:</strong>{" "}
                          {recipientForm.donorBloodGroup}
                        </p>
                        <p>
                          <strong>PHN:</strong> {recipientForm.donorPhn}
                        </p>
                        <p>
                          <strong>Relationship:</strong>{" "}
                          {recipientForm.relationToRecipient || "Not specified"}
                        </p>
                        <p>
                          <strong>Type:</strong> {recipientForm.relationType}
                        </p>
                      </div>
                    ) : (
                      <p className="text-yellow-700 font-medium">
                        No donor selected
                      </p>
                    )}
                  </div>

                  {/* Medical Summary */}
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Medical Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Diabetes:</strong>{" "}
                        {recipientForm.comorbidities.dm ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Hypertension:</strong>{" "}
                        {recipientForm.comorbidities.htn ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>RRT Modality:</strong>
                        {recipientForm.rrtDetails.modalityHD ? " HD" : ""}
                        {recipientForm.rrtDetails.modalityCAPD ? " CAPD" : ""}
                        {!recipientForm.rrtDetails.modalityHD &&
                        !recipientForm.rrtDetails.modalityCAPD
                          ? " Not specified"
                          : ""}
                      </p>
                      <p>
                        <strong>Transfusions:</strong>{" "}
                        {transfusions.filter((t) => t.date).length} records
                      </p>
                    </div>
                  </div>

                  {/* Immunological Summary */}
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Immunological
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Blood Group:</strong>{" "}
                        {recipientForm.immunologicalDetails?.bloodGroup?.d ||
                          ""}{" "}
                        {recipientForm.immunologicalDetails?.bloodGroup?.r ||
                          ""}
                      </p>
                      <p>
                        <strong>PRA Pre:</strong>{" "}
                        {recipientForm.immunologicalDetails?.praPre ||
                          "Not specified"}
                      </p>
                      <p>
                        <strong>Immunological Risk:</strong>{" "}
                        {recipientForm.immunologicalDetails
                          ?.immunologicalRisk || "Not assessed"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical Staff Information */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Medical Staff Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Completed By{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        value={recipientForm.completedBy?.staffName || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "completedBy.staffName",
                            e.target.value
                          )
                        }
                        placeholder="Enter staff name"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Staff Role <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        value={recipientForm.completedBy?.staffRole || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "completedBy.staffRole",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Transplant Coordinator, Nurse, Doctor"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Staff ID
                      </Label>
                      <Input
                        value={recipientForm.completedBy?.staffId || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "completedBy.staffId",
                            e.target.value
                          )
                        }
                        placeholder="Enter staff ID"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Department <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        value={recipientForm.completedBy?.department || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "completedBy.department",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Nephrology, Transplant Unit"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Completion Date
                      </Label>
                      <Input
                        type="date"
                        value={
                          recipientForm.completedBy?.completionDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          handleNestedChange(
                            "completedBy.completionDate",
                            e.target.value
                          )
                        }
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Signature
                      </Label>
                      <Input
                        value={recipientForm.completedBy?.signature || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "completedBy.signature",
                            e.target.value
                          )
                        }
                        placeholder="Staff signature"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Review and Approval Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Review & Approval
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Consultant Review
                      </Label>
                      <Input
                        value={recipientForm.reviewedBy?.consultantName || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "reviewedBy.consultantName",
                            e.target.value
                          )
                        }
                        placeholder="Consultant name"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Consultant ID
                      </Label>
                      <Input
                        value={recipientForm.reviewedBy?.consultantId || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "reviewedBy.consultantId",
                            e.target.value
                          )
                        }
                        placeholder="Consultant ID"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Review Date
                      </Label>
                      <Input
                        type="date"
                        value={recipientForm.reviewedBy?.reviewDate || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "reviewedBy.reviewDate",
                            e.target.value
                          )
                        }
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Approval Status
                      </Label>
                      <RadioGroup
                        value={
                          recipientForm.reviewedBy?.approvalStatus || "pending"
                        }
                        onValueChange={(value) =>
                          handleNestedChange("reviewedBy.approvalStatus", value)
                        }
                        className="flex gap-4 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pending" id="statusPending" />
                          <Label
                            htmlFor="statusPending"
                            className="text-gray-700"
                          >
                            Pending
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="approved"
                            id="statusApproved"
                          />
                          <Label
                            htmlFor="statusApproved"
                            className="text-gray-700"
                          >
                            Approved
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="rejected"
                            id="statusRejected"
                          />
                          <Label
                            htmlFor="statusRejected"
                            className="text-gray-700"
                          >
                            Rejected
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      Additional Notes
                    </Label>
                    <Textarea
                      value={recipientForm.reviewedBy?.notes || ""}
                      onChange={(e) =>
                        handleNestedChange("reviewedBy.notes", e.target.value)
                      }
                      placeholder="Any additional comments or notes from the consultant..."
                      rows={3}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
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
                        {isEditing
                          ? "Updating existing assessment"
                          : "Creating new assessment"}
                      </p>
                      {recipientForm.completedBy?.staffName && (
                        <p className="text-sm text-gray-500 mt-1">
                          Completed by: {recipientForm.completedBy.staffName} (
                          {recipientForm.completedBy.department})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">
                          All Steps Completed
                        </span>
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
                        <p className="font-medium text-red-800">
                          Cannot Submit
                        </p>
                        <p className="text-sm text-red-700">
                          {errors.confirmation}
                        </p>
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
                        <span className="text-green-700 font-medium">
                          Editing existing assessment
                        </span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-700 font-medium">
                          Creating new assessment
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Auto-save:{" "}
                    {recipientForm.name ? "Active" : "Waiting for data"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
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
