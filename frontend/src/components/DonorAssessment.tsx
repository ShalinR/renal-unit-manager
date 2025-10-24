import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DonorAssessmentForm, Donor } from "../types/donor";
import { Badge } from "@/components/ui/badge";
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
  Users,
  ClipboardList,
  User,
  FileText,
  Stethoscope,
  Shield,
  TestTube,
  CheckCircle,
  ChevronRight,
  Eye,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";
import { DonorDetailsModal } from "./DonorDetailsModal";
import { usePatientContext } from "@/context/PatientContext";
import { useDonorContext } from "@/context/DonorContext";
import { Patient, PatientBasicDTO } from "../types/patient";


const FORM_STEPS = [
  { title: "Personal Info", icon: User },
  { title: "Medical History", icon: Users },
  { title: "Systemic Inquiry", icon: ClipboardList },
  { title: "Drug & Allergy", icon: Pill },
  { title: "Family History", icon: Heart },
  { title: "Substance Use", icon: Activity },
  { title: "Social History", icon: UserCheck },
  { title: "Examination", icon: Stethoscope },
  { title: "Immunological", icon: TestTube },
  { title: "Confirmation", icon: CheckCircle },
];

interface DonorAssessmentProps {
  setActiveView?: (
    view:
      | "dashboard"
      | "donor-assessment"
      | "recipient-assessment"
      | "kt"
      | "follow-up"
      | "summary"
  ) => void;
}

const DonorAssessment: React.FC<DonorAssessmentProps> = ({ setActiveView }) => {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [currentStep, setCurrentStep] = useState(0);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [selectedDonor, setSelectedDonor] =
    useState<DonorAssessmentForm | null>(null);
  const [searchPhn, setSearchPhn] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
  const [donorType, setDonorType] = useState<"new" | "existing">("new");

  const { patient } = usePatientContext();
  const {
    donors,
    addDonor,
    setSelectedDonor: setContextSelectedDonor,
    isLoading,
    error,
    fetchDonors,
  } = useDonorContext();

  // Single source of truth for form data
  const [formData, setFormData] = useState<DonorAssessmentForm>({
    name: "",
    age: "",
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
        rr: false,
        spo2: false,
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
      pra: { pre: "", post: "" },
      dsa: "",
      immunologicalRisk: "",
    },
  });



  // Helper function to update nested form data
  const updateFormField = useCallback((path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split(".");

      // Base case: if it's a top-level field
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value };
      }

      // Recursive function to create the updated nested structure
      const updateNestedObject = (
        currentObj: any,
        keyPath: string[],
        currentIndex: number
      ): any => {
        if (currentIndex === keyPath.length - 1) {
          // We've reached the target field, update it
          return { ...currentObj, [keyPath[currentIndex]]: value };
        }

        const currentKey = keyPath[currentIndex];
        const nextObj = currentObj[currentKey] || {};

        // Recursively update the next level
        return {
          ...currentObj,
          [currentKey]: updateNestedObject(nextObj, keyPath, currentIndex + 1),
        };
      };

      return updateNestedObject(prev, keys, 0);
    });
  }, []);

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => {
      if (acc == null) return "";
      return acc[key] ?? "";
    }, obj);
  };

  // Unified input change handler
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      const finalValue = type === "checkbox" ? checked : value;

      updateFormField(name, finalValue);
    },
    [updateFormField]
  );

  // Direct checkbox handler
  const handleCheckboxChange = useCallback(
    (name: string, checked: boolean) => {
      updateFormField(name, checked);
    },
    [updateFormField]
  );

  // Search patient by PHN
  // Search patient by PHN using your Spring Boot API
// Search patient by PHN using your Spring Boot API
const searchPatientByPhn = useCallback(async () => {
  if (!searchPhn.trim()) {
    setSearchError("Please enter a PHN number");
    return;
  }

  setIsSearching(true);
  setSearchError("");
  setSearchedPatient(null);

  try {
    const response = await fetch(`/api/patient/${searchPhn}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Patient not found with this PHN");
      }
      throw new Error("Failed to fetch patient data");
    }

    const patientData: PatientBasicDTO = await response.json();
    
    // Convert PatientBasicDTO to Patient type for the form
    const patientForForm: Patient = {
      phn: patientData.phn,
      name: patientData.name || "",
      age: patientData.age || "",
      gender: patientData.gender || "",
      dateOfBirth: patientData.dateOfBirth || "",
      occupation: patientData.occupation || "",
      address: patientData.address || "",
      nicNo: patientData.nicNo || "",
      contactDetails: patientData.contactDetails || "",
      emailAddress: patientData.emailAddress || ""
    };

    setSearchedPatient(patientForForm);
    setDonorType("existing")
    // Auto-populate personal information fields
    updateFormField("name", patientForForm.name);
    updateFormField("age", patientForForm.age);
    updateFormField("gender", patientForForm.gender);
    updateFormField("dateOfBirth", patientForForm.dateOfBirth);
    updateFormField("occupation", patientForForm.occupation);
    updateFormField("address", patientForForm.address);
    updateFormField("nicNo", patientForForm.nicNo);
    updateFormField("contactDetails", patientForForm.contactDetails);
    updateFormField("emailAddress", patientForForm.emailAddress);

    if (currentStep !== 0) {
      setCurrentStep(0);
    }

  } catch (err) {
    console.error('API Error:', err);
    setSearchError("Cannot connect to server. Make sure the backend is running.");
  } finally {
    setIsSearching(false);
  }
}, [searchPhn, updateFormField, currentStep]);

const clearSearch = useCallback(() => {
  setSearchPhn("");
  setSearchedPatient(null);
  setSearchError("");
  setDonorType("new"); // Reset to new donor
  resetForm();
}, []);

  // Helper function to convert Donor to DonorAssessmentForm
  const convertDonorToFormData = useCallback(
    (donor: Donor): DonorAssessmentForm => {
      return {
        name: donor.name || "",
        age: donor.age || "",
        gender: donor.gender || "",
        dateOfBirth: donor.dateOfBirth || "",
        occupation: donor.occupation || "",
        address: donor.address || "",
        nicNo: donor.nicNo || "",
        contactDetails: donor.contactDetails || "",
        emailAddress: donor.emailAddress || "",
        relationToRecipient: donor.relationToRecipient || "",
        relationType: donor.relationType || "",
        comorbidities: donor.comorbidities || {
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
        examination: donor.examination || {
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
            rr: false,
            spo2: false,
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
        immunologicalDetails: donor.immunologicalDetails || {
          bloodGroup: {
            d: donor.bloodGroup?.charAt(0) || "",
            r: donor.bloodGroup?.charAt(1) || "",
          },
          crossMatch: { tCell: "", bCell: "" },
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
          pra: { pre: "", post: "" },
          dsa: "",
          immunologicalRisk: "",
        },
      };
    },
    []
  );

  useEffect(() => {
    if (patient?.phn) {
      fetchDonors(patient.phn);
    } else {
      fetchDonors();
    }
  }, [patient?.phn, fetchDonors]);

  // Calculate BMI function
  const calculateBMI = useCallback(() => {
    const height = parseFloat(formData.examination.height);
    const weight = parseFloat(formData.examination.weight);

    if (height && weight && height > 0 && weight > 0) {
      const bmi = (weight / (height / 100) ** 2).toFixed(2);
      updateFormField("examination.bmi", bmi);
    } else if (formData.examination.bmi && (!height || !weight)) {
      updateFormField("examination.bmi", "");
    }
  }, [
    formData.examination.height,
    formData.examination.weight,
    formData.examination.bmi,
    updateFormField,
  ]);

  const nextStep = useCallback(() => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      age: "",
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
          rr: false,
          spo2: false,
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
        pra: { pre: "", post: "" },
        dsa: "",
        immunologicalRisk: "",
      },
    });
  }, []);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Check if we have a donor (either from search or form data)
  if (!formData.name || !formData.nicNo) {
    alert("Please fill in at least the donor's name and NIC number, or search for an existing patient first.");
    return;
  }

  // Basic validation for required fields
  const requiredFields = [
    { field: formData.name, name: "Full Name" },
    { field: formData.age, name: "Age" },
    { field: formData.gender, name: "Gender" },
    { field: formData.nicNo, name: "NIC Number" },
    { field: formData.contactDetails, name: "Contact Details" },
  ];

  const missingFields = requiredFields.filter((item) => !item.field);
  if (missingFields.length > 0) {
    const fieldNames = missingFields.map((item) => item.name).join(", ");
    alert(`Please fill in the following required fields: ${fieldNames}`);
    return;
  }

  try {
    // Use the searched patient's PHN if available, otherwise you might need to generate one
    // or handle the case where this is a new donor without a PHN
    const patientPhn = searchedPatient?.phn || formData.nicNo; // Fallback to NIC if no PHN
    
    // The addDonor function now expects DonorAssessmentForm directly
    await addDonor(formData, patientPhn);

    alert(
      "Donor registration submitted successfully! The donor is now available for selection."
    );
    setCurrentStep(0);
    setCurrentView("list");
    clearSearch();
  } catch (err) {
    console.error("Failed to submit donor:", err);
    alert("Failed to submit donor. Please try again.");
  }
};

  const handleSelectDonor = useCallback(
    (donor: Donor) => {
      setContextSelectedDonor(donor);
      alert(
        `Donor ${donor.name} selected! You can now use this donor in recipient assessment.`
      );

      if (setActiveView) {
        setActiveView("recipient-assessment");
      }
    },
    [setContextSelectedDonor, setActiveView]
  );

  const CheckboxField = useCallback(
    ({
      name,
      label,
      checked,
    }: {
      name: string;
      label: string;
      checked: boolean;
    }) => (
      <label className="flex items-start gap-3 cursor-pointer group">
        <Checkbox
          name={name}
          checked={checked}
          onCheckedChange={(checked) => {
            handleCheckboxChange(name, checked === true);
          }}
          className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
      </label>
    ),
    [handleCheckboxChange]
  );

const InputField = ({
  name,
  label,
  type = "text",
  placeholder = "",
  required = false,
  value, // Add value prop
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string; // Add value to the type definition
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value} // Pass the value prop
      onChange={handleInputChange}
      placeholder={placeholder}
      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
    />
  </div>
);

  const SectionCard = useCallback(
    ({
      title,
      children,
      className = "",
    }: {
      title: string;
      children: React.ReactNode;
      className?: string;
    }) => (
      <div
        className={`bg-white border border-slate-200 rounded-lg p-6 ${className}`}
      >
        <h4 className="text-base font-medium text-slate-900 mb-4">{title}</h4>
        {children}
      </div>
    ),
    []
  );

  // Search Bar Component
  // Search Bar Component
const SearchBar = () => (
  <Card className="border border-slate-200 shadow-sm mb-6">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-900">Search Existing Patient</h3>
          <p className="text-sm text-slate-600">
            Search by PHN to auto-populate personal information
          </p>
        </div>
        {searchedPatient && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Patient Loaded
          </Badge>
        )}
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="phn-search" className="text-sm font-medium text-slate-700 mb-2 block">
            PHN Number
          </Label>
          <div className="flex gap-2">
            <Input
              id="phn-search"
              type="text"
              placeholder="Enter patient PHN number..."
              value={searchPhn}
              onChange={(e) => setSearchPhn(e.target.value)}
              className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchPatientByPhn();
                }
              }}
            />
            <Button
              onClick={searchPatientByPhn}
              disabled={isSearching || !searchPhn.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </Button>
            {searchedPatient && (
              <Button
                onClick={clearSearch}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Clear
              </Button>
            )}
          </div>
          {searchError && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {searchError}
            </p>
          )}
          {searchedPatient && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">{searchedPatient.name}</p>
                  <p className="text-sm text-blue-700">
                    PHN: {searchedPatient.phn} | Age: {searchedPatient.age} | Gender: {searchedPatient.gender}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Personal information has been auto-populated from your database.
              </p>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
  const renderAvailableDonors = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">
            Available Donors ({donors.length})
          </h2>
          <p className="text-slate-600">
            Review and select from registered donors
          </p>
        </div>
        <Button
          onClick={() => setCurrentView("form")}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          disabled={isLoading}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {isLoading ? "Loading..." : "Add New Donor"}
        </Button>
      </div>

      {error && (
        <Card className="border border-red-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>Error loading donors: {error}</span>
            </div>
            <Button
              onClick={() => fetchDonors(patient?.phn)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Loading Donors
            </h3>
            <p className="text-slate-600">Fetching donor data from server...</p>
          </CardContent>
        </Card>
      ) : donors.length === 0 ? (
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Donors Registered
            </h3>
            <p className="text-slate-600 mb-4">
              Get started by registering your first donor. Registered donors
              will appear here and be available for recipient matching.
            </p>
            <Button
              onClick={() => setCurrentView("form")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register First Donor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-medium text-slate-700">
                      Donor
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-slate-700">
                      Blood Type
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-slate-700">
                      Age
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-slate-700">
                      Relation
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor) => (
                    <tr
                      key={donor.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">
                          {donor.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {donor.gender}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <span className="font-medium">{donor.bloodGroup}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {donor.age} years
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {donor.relationToRecipient}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donor.status === "assigned"
                              ? "bg-blue-100 text-blue-800"
                              : donor.status === "evaluating"
                                ? "bg-yellow-100 text-yellow-800"
                                : donor.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {donor.status
                            ? donor.status.charAt(0).toUpperCase() +
                              donor.status.slice(1)
                            : "Available"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-slate-600 border-slate-300 hover:bg-slate-50"
                            onClick={() => {
                              setSelectedDonor(convertDonorToFormData(donor));
                              setShowDonorModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleSelectDonor(donor)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Select
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <SearchBar />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="name"
                label="Full Name"
                value={formData.name}
                placeholder="Enter full name"
                required
              />
              <InputField
                name="age"
                label="Age"
                value={formData.age}
                placeholder="Enter age"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Gender <span className="text-red-500 ml-1">*</span>
                </Label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <InputField
                name="dateOfBirth"
                label="Date of Birth"
                value={formData.dateOfBirth}
                type="date"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="occupation"
                label="Occupation"
                value={formData.occupation}
                placeholder="Enter occupation"
              />
              <InputField
                name="nicNo"
                label="NIC Number"
                value={formData.nicNo}
                placeholder="Enter NIC number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Address
              </Label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter full address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="contactDetails"
                label="Phone Number"
                value={formData.contactDetails}
                placeholder="Enter phone number"
                required
              />
              <InputField
                name="emailAddress"
                label="Email Address"
                value={formData.emailAddress}
                type="email"
                placeholder="Enter email address"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {/* Complains Section - Added at the top */}
            <SectionCard title="Chief Complaints">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Chief Complaints
                </Label>
                <Textarea
                  name="complains"
                  value={formData.complains}
                  onChange={handleInputChange}
                  rows={4}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter chief complaints and details about current symptoms, duration, severity, etc."
                />
              </div>
            </SectionCard>

            <SectionCard title="Comorbidities">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField
                  name="comorbidities.dm"
                  label="Diabetes Mellitus(DM)"
                  checked={formData.comorbidities.dm}
                />
                <CheckboxField
                  name="comorbidities.htn"
                  label="Hypertension(HTN)"
                  checked={formData.comorbidities.htn}
                />
                <CheckboxField
                  name="comorbidities.ihd"
                  label="Ischemic Heart Disease(IHD)"
                  checked={formData.comorbidities.ihd}
                />
                <CheckboxField
                  name="comorbidities.psychiatricIllness"
                  label="Psychiatric Illness"
                  checked={formData.comorbidities.psychiatricIllness}
                />
                <CheckboxField
                  name="comorbidities.dl"
                  label="Dyslipidemia (DL)"
                  checked={formData.comorbidities.dl}
                />
              </div>
            </SectionCard>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <SectionCard title="Constitutional Symptoms">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField
                  name="systemicInquiry.constitutional.loa"
                  label="Loss of Appetite"
                  checked={formData.systemicInquiry.constitutional.loa}
                />
                <CheckboxField
                  name="systemicInquiry.constitutional.low"
                  label="Loss of Weight"
                  checked={formData.systemicInquiry.constitutional.low}
                />
              </div>
            </SectionCard>
            <SectionCard title="Cardiovascular System(CVS)">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxField
                  name="systemicInquiry.cvs.chestPain"
                  label="Chest Pain"
                  checked={formData.systemicInquiry.cvs.chestPain}
                />
                <CheckboxField
                  name="systemicInquiry.cvs.odema"
                  label="Odem"
                  checked={formData.systemicInquiry.cvs.odema}
                />
                <CheckboxField
                  name="systemicInquiry.cvs.sob"
                  label="Shortness of Breath(SOB)"
                  checked={formData.systemicInquiry.cvs.sob}
                />
              </div>
            </SectionCard>
            <SectionCard title="Respiratory System">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxField
                  name="systemicInquiry.respiratory.cough"
                  label="Cough"
                  checked={formData.systemicInquiry.respiratory.cough}
                />
                <CheckboxField
                  name="systemicInquiry.respiratory.hemoptysis"
                  label="Hemoptysis"
                  checked={formData.systemicInquiry.respiratory.hemoptysis}
                />
                <CheckboxField
                  name="systemicInquiry.respiratory.wheezing"
                  label="Wheezing"
                  checked={formData.systemicInquiry.respiratory.wheezing}
                />
              </div>
            </SectionCard>
            <SectionCard title="Gastrointestinal System">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField
                  name="systemicInquiry.git.constipation"
                  label="Constipation"
                  checked={formData.systemicInquiry.git.constipation}
                />
                <CheckboxField
                  name="systemicInquiry.git.diarrhea"
                  label="Diarrhea"
                  checked={formData.systemicInquiry.git.diarrhea}
                />
                <CheckboxField
                  name="systemicInquiry.git.melena"
                  label="Melena"
                  checked={formData.systemicInquiry.git.melena}
                />
                <CheckboxField
                  name="systemicInquiry.git.prBleeding"
                  label="PR Bleeding"
                  checked={formData.systemicInquiry.git.prBleeding}
                />
              </div>
            </SectionCard>

            <SectionCard title="Renal System">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField
                  name="systemicInquiry.renal.hematuria"
                  label="Hematuria"
                  checked={formData.systemicInquiry.renal.hematuria}
                />
                <CheckboxField
                  name="systemicInquiry.renal.frothyUrine"
                  label="Frothy Urine"
                  checked={formData.systemicInquiry.renal.frothyUrine}
                />
              </div>
            </SectionCard>

            <SectionCard title="Neurological System">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField
                  name="systemicInquiry.neuro.seizures"
                  label="Seizures"
                  checked={formData.systemicInquiry.neuro.seizures}
                />
                <CheckboxField
                  name="systemicInquiry.neuro.visualDisturbance"
                  label="Visual Disturbance"
                  checked={formData.systemicInquiry.neuro.visualDisturbance}
                />
                <CheckboxField
                  name="systemicInquiry.neuro.headache"
                  label="Headache"
                  checked={formData.systemicInquiry.neuro.headache}
                />
                <CheckboxField
                  name="systemicInquiry.neuro.limbWeakness"
                  label="Limb Weakness"
                  checked={formData.systemicInquiry.neuro.limbWeakness}
                />
              </div>
            </SectionCard>

            <SectionCard title="Gynecological History">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField
                  name="systemicInquiry.gynecology.pvBleeding"
                  label="PV Bleeding"
                  checked={formData.systemicInquiry.gynecology.pvBleeding}
                />
                <CheckboxField
                  name="systemicInquiry.gynecology.menopause"
                  label="Menopause"
                  checked={formData.systemicInquiry.gynecology.menopause}
                />
                <CheckboxField
                  name="systemicInquiry.gynecology.menorrhagia"
                  label="Menorrhagia"
                  checked={formData.systemicInquiry.gynecology.menorrhagia}
                />
                <CheckboxField
                  name="systemicInquiry.gynecology.lrmp"
                  label="LRMP"
                  checked={formData.systemicInquiry.gynecology.lrmp}
                />
              </div>
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Sexual History
                </Label>
                <Textarea
                  name="systemicInquiry.sexualHistory"
                  value={formData.systemicInquiry.sexualHistory}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter sexual history details"
                />
              </div>
            </SectionCard>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Current Medications
              </Label>
              <Textarea
                name="drugHistory"
                value={formData.drugHistory}
                onChange={handleInputChange}
                rows={4}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="List current medications, dosages, and duration"
              />
            </div>
            <SectionCard title="Known Allergies">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxField
                  name="allergyHistory.foods"
                  label="Food Allergies"
                  checked={formData.allergyHistory.foods}
                />
                <CheckboxField
                  name="allergyHistory.drugs"
                  label="Drug Allergies"
                  checked={formData.allergyHistory.drugs}
                />
                <CheckboxField
                  name="allergyHistory.p"
                  label="Environmental Allergies"
                  checked={formData.allergyHistory.p}
                />
              </div>
            </SectionCard>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="familyHistory.dm"
                label="Diabetes Mellitus(DM)"
                value={formData.familyHistory.dm}
                placeholder="Family member relationship"
              />
              <InputField
                name="familyHistory.htn"
                label="Hypertension(HTN)"
                value={formData.familyHistory.htn}
                placeholder="Family member relationship"
              />
              <InputField
                name="familyHistory.ihd"
                label="Ischemic Heart Disease(IHD)"
                value={formData.familyHistory.ihd}
                placeholder="Family member relationship"
              />
              <InputField
                name="familyHistory.stroke"
                label="Stroke"
                value={formData.familyHistory.stroke}
                placeholder="Family member relationship"
              />
              <InputField
                name="familyHistory.renal"
                label="Renal Disease"
                value={formData.familyHistory.renal}
                placeholder="Family member relationship"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <SectionCard title="Substance Use History">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CheckboxField
                    name="substanceUse.smoking"
                    label="Smoking"
                    checked={formData.substanceUse.smoking}
                  />
                  <CheckboxField
                    name="substanceUse.alcohol"
                    label="Alcohol"
                    checked={formData.substanceUse.alcohol}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Other Substances
                  </Label>
                  <Textarea
                    name="substanceUse.other"
                    value={formData.substanceUse.other}
                    onChange={handleInputChange}
                    rows={3}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Describe any other substance use"
                  />
                </div>
              </div>
            </SectionCard>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Spouse Details
                </Label>
                <Textarea
                  name="socialHistory.spouseDetails"
                  value={formData.socialHistory.spouseDetails}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Spouse information"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Children Details
                </Label>
                <Textarea
                  name="socialHistory.childrenDetails"
                  value={formData.socialHistory.childrenDetails}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Children information"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="socialHistory.income"
                label="Monthly Income"
                value={formData.socialHistory.income}
                placeholder="Monthly income"
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Other Social Information
                </Label>
                <Textarea
                  name="socialHistory.other"
                  value={formData.socialHistory.other}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Other relevant social information"
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <SectionCard title="Anthropometric Measurements">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  name="examination.height"
                  label="Height (cm)"
                  value={formData.examination.height}
                  placeholder="Height in cm"
                />
                <InputField
                  name="examination.weight"
                  label="Weight (kg)"
                  value={formData.examination.weight}
                  placeholder="Weight in kg"
                />
                <div className="space-y-2">
                  <InputField
                    name="examination.bmi"
                    label="BMI"
                    value={formData.examination.bmi}
                    placeholder="Auto-calculated"
                  />
                  <Button
                    type="button"
                    onClick={calculateBMI}
                    size="sm"
                    variant="outline"
                    className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Calculate BMI
                  </Button>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="General Examination">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField
                  name="examination.pallor"
                  label="Pallor"
                  checked={formData.examination.pallor}
                />
                <CheckboxField
                  name="examination.icterus"
                  label="Icterus"
                  checked={formData.examination.icterus}
                />
                <CheckboxField
                  name="examination.clubbing"
                  label="Clubbing"
                  checked={formData.examination.clubbing}
                />
                <CheckboxField
                  name="examination.ankleOedema"
                  label="Ankle Edema"
                  checked={formData.examination.ankleOedema}
                />
              </div>
            </SectionCard>
            <SectionCard title="Oral Examination">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField
                  name="examination.oral.dentalCaries"
                  label="Dental Conics"
                  checked={formData.examination.oral.dentalCaries}
                />
                <CheckboxField
                  name="examination.oral.oralHygiene"
                  label="Oral Hygiene"
                  checked={formData.examination.oral.oralHygiene}
                />
                <CheckboxField
                  name="examination.oral.satisfactory"
                  label="Satisfactory"
                  checked={formData.examination.oral.satisfactory}
                />
                <CheckboxField
                  name="examination.oral.unsatisfactory"
                  label="Unsatisfactory"
                  checked={formData.examination.oral.unsatisfactory}
                />
              </div>
            </SectionCard>
            <SectionCard title="Lymph Nodes">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxField
                  name="examination.lymphNodes.cervical"
                  label="Cervical"
                  checked={formData.examination.lymphNodes.cervical}
                />
                <CheckboxField
                  name="examination.lymphNodes.axillary"
                  label="Axillary"
                  checked={formData.examination.lymphNodes.axillary}
                />
                <CheckboxField
                  name="examination.lymphNodes.inguinal"
                  label="Inguinal"
                  checked={formData.examination.lymphNodes.inguinal}
                />
              </div>
            </SectionCard>
            <SectionCard title="Cardiovascular System(CVS)">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  name="examination.cvs.bp"
                  label="Blood Pressure"
                  value={formData.examination.cvs.bp}
                  placeholder="e.g., 120/80"
                />
                <InputField
                  name="examination.cvs.pr"
                  label="Pulse Rate"
                  value={formData.examination.cvs.pr}
                  placeholder="e.g., 72 bpm"
                />
                <div className="flex items-end pb-2">
                  <CheckboxField
                    name="examination.cvs.murmurs"
                    label="Murmurs"
                    checked={formData.examination.cvs.murmurs}
                  />
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Respiratory System">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CheckboxField
                    name="examination.respiratory.rr"
                    label="Respiratory Rate (RR)"
                    checked={formData.examination.respiratory.rr}
                  />
                  <CheckboxField
                    name="examination.respiratory.spo2"
                    label="SpO2"
                    checked={formData.examination.respiratory.spo2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <CheckboxField
                    name="examination.respiratory.auscultation"
                    label="Abnormal Auscultation"
                    checked={formData.examination.respiratory.auscultation}
                  />
                  <CheckboxField
                    name="examination.respiratory.crepts"
                    label="Crepts"
                    checked={formData.examination.respiratory.crepts}
                  />
                  <CheckboxField
                    name="examination.respiratory.ranchi"
                    label="Ronchi"
                    checked={formData.examination.respiratory.ranchi}
                  />
                  <CheckboxField
                    name="examination.respiratory.effusion"
                    label="Effusion"
                    checked={formData.examination.respiratory.effusion}
                  />
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Abdominal Examination">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField
                  name="examination.abdomen.hepatomegaly"
                  label="Hepatomegaly"
                  checked={formData.examination.abdomen.hepatomegaly}
                />
                <CheckboxField
                  name="examination.abdomen.splenomegaly"
                  label="Splenomegaly"
                  checked={formData.examination.abdomen.splenomegaly}
                />
                <CheckboxField
                  name="examination.abdomen.renalMasses"
                  label="Renal Masses"
                  checked={formData.examination.abdomen.renalMasses}
                />
                <CheckboxField
                  name="examination.abdomen.freeFluid"
                  label="Free Fluid"
                  checked={formData.examination.abdomen.freeFluid}
                />
              </div>
            </SectionCard>
            <SectionCard title="Brcost Examination">
              <div className="space-y-2">
                <Textarea
                  name="examination.BrcostExamination"
                  value={formData.examination.BrcostExamination}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe examination findings"
                />
              </div>
            </SectionCard>
            <SectionCard title="Neurological Examination">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField
                  name="examination.neurologicalExam.cranialNerves"
                  label="Cranial Nerves Abnormal"
                  checked={formData.examination.neurologicalExam.cranialNerves}
                />
                <CheckboxField
                  name="examination.neurologicalExam.upperLimb"
                  label="Upper Limb Abnormal"
                  checked={formData.examination.neurologicalExam.upperLimb}
                />
                <CheckboxField
                  name="examination.neurologicalExam.lowerLimb"
                  label="Lower Limb Abnormal"
                  checked={formData.examination.neurologicalExam.lowerLimb}
                />
                <CheckboxField
                  name="examination.neurologicalExam.coordination"
                  label="Coordination Abnormal"
                  checked={formData.examination.neurologicalExam.coordination}
                />
              </div>
            </SectionCard>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <SectionCard title="Blood Group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="immunologicalDetails.bloodGroup.d"
                  label="D Group"
                  value={formData.immunologicalDetails.bloodGroup.d}
                  placeholder="Enter D value"
                />
                <InputField
                  name="immunologicalDetails.bloodGroup.r"
                  label="R Group"
                  value={formData.immunologicalDetails.bloodGroup.r}
                  placeholder="Enter R value"
                />
              </div>
            </SectionCard>
            <SectionCard title="Cross Match">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="immunologicalDetails.crossMatch.tCell"
                  label="T Cell"
                  value={formData.immunologicalDetails.crossMatch.tCell}
                  placeholder="Enter T cell value"
                />
                <InputField
                  name="immunologicalDetails.crossMatch.bCell"
                  label="B Cell"
                  value={formData.immunologicalDetails.crossMatch.bCell}
                  placeholder="Enter B cell value"
                />
              </div>
            </SectionCard>
            <SectionCard title="HLA Typing">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">
                        HLA-A
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">
                        HLA-B
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">
                        HLA-C
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">
                        HLA-DR
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">
                        HLA-DP
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">
                        HLA-DQ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {["donor", "recipient", "conclusion"].map((type) => (
                      <tr key={type} className="border-b border-slate-200">
                        <td className="py-3 px-4 font-medium text-slate-700 capitalize">
                          {type}
                        </td>
                        {[
                          "hlaA",
                          "hlaB",
                          "hlaC",
                          "hlaDR",
                          "hlaDP",
                          "hlaDQ",
                        ].map((hla) => (
                          <td key={hla} className="py-3 px-2">
                            <Input
                              name={`immunologicalDetails.hlaTyping.${type}.${hla}`}
                              value={
                                formData.immunologicalDetails.hlaTyping[
                                  type as keyof typeof formData.immunologicalDetails.hlaTyping
                                ][
                                  hla as keyof typeof formData.immunologicalDetails.hlaTyping.donor
                                ] || ""
                              }
                              onChange={handleInputChange}
                              className="h-9 text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder={hla.replace("hla", "")}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
            <SectionCard title="PRA (Panel Reactive Antibodies)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="immunologicalDetails.pra.pre"
                  label="Pre (%)"
                  value={formData.immunologicalDetails.pra.pre}
                  placeholder="Enter pre PRA percentage"
                />
                <InputField
                  name="immunologicalDetails.pra.post"
                  label="Post (%)"
                  value={formData.immunologicalDetails.pra.post}
                  placeholder="Enter post PRA percentage"
                />
              </div>
            </SectionCard>
            <SectionCard title="DSA & Risk Assessment">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    DSA (Donor Specific Antibodies)
                  </Label>
                  <Input
                    name="immunologicalDetails.dsa"
                    value={formData.immunologicalDetails.dsa}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter DSA details"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">
                    Immunological Risk
                  </Label>
                  <RadioGroup
                    value={formData.immunologicalDetails.immunologicalRisk}
                    onValueChange={(value) =>
                      updateFormField(
                        "immunologicalDetails.immunologicalRisk",
                        value
                      )
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label
                        htmlFor="low"
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Low
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="average" />
                      <Label
                        htmlFor="average"
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Average
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label
                        htmlFor="high"
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </SectionCard>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <SectionCard title="Registration Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Name:</span>
                    <span className="text-slate-900">
                      {formData.name || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Age:</span>
                    <span className="text-slate-900">
                      {formData.age || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Gender:</span>
                    <span className="text-slate-900">
                      {formData.gender || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">NIC:</span>
                    <span className="text-slate-900">
                      {formData.nicNo || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Contact:</span>
                    <span className="text-slate-900">
                      {formData.contactDetails || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Email:</span>
                    <span className="text-slate-900">
                      {formData.emailAddress || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">
                      Relation:
                    </span>
                    <span className="text-slate-900">
                      {formData.relationToRecipient || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">
                      Relation Type:
                    </span>
                    <span className="text-slate-900">
                      {formData.relationType || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-amber-800 mb-1">
                    Important Notice
                  </h5>
                  <p className="text-sm text-amber-700">
                    Please review all information carefully before submitting.
                    Once submitted, the donor will be entered into the
                    assessment process and contacted for further medical
                    evaluation and testing.
                  </p>
                </div>
              </div>
            </div>
            <SectionCard title="Consent and Confirmation">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    required
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    I confirm that all information provided is accurate to the
                    best of my knowledge and understand the importance of
                    providing truthful medical information.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    required
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    I consent to the processing of this information for donor
                    assessment purposes and understand that this data will be
                    used for medical evaluation and matching processes.
                  </span>
                </label>
              </div>
            </SectionCard>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {FORM_STEPS[currentStep].title}
              </h3>
              <p className="text-slate-600">
                This section is under development.
              </p>
            </div>
          </div>
        );
    }
  };

  const renderRegisterForm = () => (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => {
          setCurrentView("list");
          setCurrentStep(0);
          clearSearch();
        }}
        className="mb-4 flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Donor List
      </Button>

      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative mb-2">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200">
              <div
                className="h-0.5 bg-blue-600 transition-all duration-300"
                style={{
                  width: `${(currentStep / (FORM_STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>
            {FORM_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center relative"
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 bg-white relative z-10 ${
                      currentStep >= index
                        ? "border-blue-600 text-blue-600"
                        : "border-slate-300 text-slate-400"
                    }`}
                  >
                    {currentStep > index ? (
                      <CheckCircle className="w-6 h-6 text-blue-600 fill-current" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={`text-center mt-3 transition-colors duration-200 ${currentStep >= index ? "text-slate-900" : "text-slate-400"}`}
                  >
                    <div className="text-xs font-medium">{step.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              {React.createElement(FORM_STEPS[currentStep].icon, {
                className: "w-5 h-5 text-blue-600",
              })}
              {FORM_STEPS[currentStep].title}
            </CardTitle>
            <CardDescription className="text-slate-600">
              Step {currentStep + 1} of {FORM_STEPS.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">{renderFormStep()}</CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className={`${currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {currentStep < FORM_STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Complete Registration
            </Button>
          )}
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Donor Assessment
              </h1>
              <p className="text-blue-600">
                Comprehensive donor evaluation and management system
              </p>
            </div>
            {setActiveView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView("dashboard")}
                className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {currentView === "list" && renderAvailableDonors()}
          {currentView === "form" && renderRegisterForm()}
        </div>
      </div>

      <DonorDetailsModal
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        donorData={selectedDonor}
      />
    </div>
  );
};

export default DonorAssessment;
