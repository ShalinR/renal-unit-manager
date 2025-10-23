import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, UserCheck, Activity, Save, ArrowLeft, Pill, Users, ClipboardList, User, FileText, Shield } from "lucide-react";

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
  donorId: string;
  relationType: string;
  relationToRecipient: string;
  comorbidities: {
    dm: boolean;
    duration: string;
    psychiatricIllness: boolean;
    htn: boolean;
    ihd: boolean;
  };
  complains: string;
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
  setRecipientForm: React.Dispatch<React.SetStateAction<RecipientAssessmentForm>>;
  setActiveView: React.Dispatch<React.SetStateAction<string>>;
  handleRecipientFormChange: (field: string, value: any) => void;
  handleRecipientFormSubmit: (e: React.FormEvent) => void;
  donors: Array<{ id: string; name: string; bloodGroup: string }>;
}

const FORM_STEPS = [
  { label: "Personal Info", icon: User },
  { label: "Relationship", icon: Heart },
  { label: "Comorbidities", icon: Activity },
  { label: "RRT Details", icon: Pill },
  { label: "Transfusion History", icon: ClipboardList },
  { label: "Immunological", icon: Shield },
  { label: "Confirmation", icon: FileText }
];

const RecipientAssessment: React.FC<RecipientAssessmentProps> = ({
  recipientForm,
  setRecipientForm,
  setActiveView,
  handleRecipientFormChange,
  handleRecipientFormSubmit,
  donors,
}) => {
  const [step, setStep] = useState(0);

  // Mock donor data for demonstration
  const mockDonors = [
    { id: "1", name: "John Doe", bloodGroup: "A+" },
    { id: "2", name: "Jane Smith", bloodGroup: "B+" },
    { id: "3", name: "Robert Johnson", bloodGroup: "O-" },
    { id: "4", name: "Sarah Williams", bloodGroup: "AB+" },
    { id: "5", name: "Michael Brown", bloodGroup: "O+" },
  ];

  // Use either the passed donors prop or the mock data
  const donorList = donors && donors.length > 0 ? donors : mockDonors;

  // Transfusion history rows (dynamic)
  const [transfusions, setTransfusions] = useState<{ date: string; indication: string; volume: string }[]>(
    (recipientForm as any)?.transfusions ?? [{ date: "", indication: "", volume: "" }]
  );

  const syncTransfusions = (next: typeof transfusions) => {
    setTransfusions(next);
    // push up to parent form if handler exists
    handleNestedChange("transfusions", next);
  };

  const addTransfusion = () => {
    syncTransfusions([...transfusions, { date: "", indication: "", volume: "" }]);
  };

  const removeTransfusion = (index: number) => {
    const next = transfusions.filter((_, i) => i !== index);
    syncTransfusions(next.length ? next : [{ date: "", indication: "", volume: "" }]); // keep at least one row
  };

  const handleTransfusionChange = (index: number, field: "date" | "indication" | "volume", value: string) => {
    const next = transfusions.map((r, i) => (i === index ? { ...r, [field]: value } : r));
    syncTransfusions(next);
  };

  const nextStep = () => setStep((s) => Math.min(FORM_STEPS.length - 1, s + 1));
  const prevStep = () => setStep((s) => Math.max(0, s - 1));
  
  // Helper function to handle nested object changes
  const handleNestedChange = (path: string, value: any) => {
    handleRecipientFormChange(path, value);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Recipient Assessment</h1>
              <p className="text-blue-600">Complete medical evaluation for kidney transplant recipient</p>
            </div>
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
              <h2 className="text-lg font-semibold text-blue-900">Assessment Progress</h2>
              <span className="text-sm text-blue-600">Step {step + 1} of {FORM_STEPS.length}</span>
            </div>
            <div className="flex items-center gap-2">
              {FORM_STEPS.map((formStep, idx) => {
                const Icon = formStep.icon;
                const isActive = step === idx;
                const isCompleted = step > idx;
                
                return (
                  <div key={formStep.label} className="flex-1">
                    <div className={`
                      flex flex-col items-center p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? "bg-blue-100 border-2 border-blue-500 text-blue-700" 
                        : isCompleted
                        ? "bg-blue-50 border border-blue-200 text-blue-600"
                        : "bg-gray-50 border border-gray-200 text-gray-400"
                      }
                    `}>
                      <Icon className={`w-5 h-5 mb-2 ${isActive ? "text-blue-600" : isCompleted ? "text-blue-500" : "text-gray-400"}`} />
                      <span className={`text-xs font-medium text-center ${isActive ? "text-blue-700" : isCompleted ? "text-blue-600" : "text-gray-400"}`}>
                        {formStep.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <form onSubmit={handleRecipientFormSubmit} className="space-y-8">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <User className="w-6 h-6" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Basic demographic and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Name and Age Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                      Full Name <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={recipientForm.name}
                      onChange={(e) => handleNestedChange("name", e.target.value)}
                      placeholder="Enter full name"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-sm font-semibold text-gray-700 flex items-center">
                      Age <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={recipientForm.age}
                      onChange={(e) => handleNestedChange("age", e.target.value)}
                      placeholder="Enter age"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* NIC and Gender Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="nicNo" className="text-sm font-semibold text-gray-700 flex items-center">
                      NIC Number <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="nicNo"
                      value={recipientForm.nicNo}
                      onChange={(e) => handleNestedChange("nicNo", e.target.value)}
                      placeholder="Enter NIC number"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center">
                      Gender <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <RadioGroup className="flex gap-8 pt-2">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="male" id="recipientMale" className="border-2 border-blue-300" />
                        <Label htmlFor="recipientMale" className="text-gray-700 font-medium">Male</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="female" id="recipientFemale" className="border-2 border-blue-300" />
                        <Label htmlFor="recipientFemale" className="text-gray-700 font-medium">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Date of Birth and Occupation Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="recipientDOB" className="text-sm font-semibold text-gray-700 flex items-center">
                      Date of Birth <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="recipientDOB"
                      type="date"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="recipientOccupation" className="text-sm font-semibold text-gray-700 flex items-center">
                      Occupation <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="recipientOccupation"
                      placeholder="Enter occupation"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <Label htmlFor="recipientAddress" className="text-sm font-semibold text-gray-700 flex items-center">
                    Address <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="recipientAddress"
                    placeholder="Enter complete address"
                    rows={4}
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none"
                    required
                  />
                </div>

                {/* Contact Information Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="recipientContact" className="text-sm font-semibold text-gray-700 flex items-center">
                      Contact Number <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="recipientContact"
                      placeholder="Enter phone number"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="recipientEmail" className="text-sm font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="Enter email address"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Relationship */}
          {step === 1 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Heart className="w-6 h-6" />
                  Relationship Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Select a registered donor and specify relationship
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center">
                    Select Registered Donor <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <select
                    value={recipientForm.donorId || ""}
                    onChange={(e) => handleNestedChange("donorId", e.target.value)}
                    className="w-full h-12 p-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white"
                    required
                  >
                    <option value="">Select a donor</option>
                    {donorList.map((donor) => (
                      <option key={donor.id} value={donor.id}>
                        {donor.name} (Blood Group: {donor.bloodGroup})
                      </option>
                    ))}
                  </select>
                </div>

                {recipientForm.donorId && (
                  <div className="space-y-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700">
                        Type of Relationship
                      </Label>
                      <RadioGroup 
                        value={recipientForm.relationType} 
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
                    </div>
                    
                    {recipientForm.relationType === "related" && (
                      <div className="space-y-3">
                        <Label htmlFor="relationToRecipient" className="text-sm font-semibold text-gray-700">
                          Specific Relation
                        </Label>
                        <Input 
                          id="relationToRecipient"
                          value={recipientForm.relationToRecipient}
                          onChange={(e) => handleNestedChange("relationToRecipient", e.target.value)}
                          placeholder="e.g., Brother, Sister, Parent, etc."
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                        />
                      </div>
                    )}
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
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Diabetes Mellitus</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="recipientDM" className="border-2 border-blue-300" />
                      <Label htmlFor="recipientDM" className="text-gray-700 font-medium">Diabetes Mellitus (DM)</Label>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recipientDMDuration" className="text-sm font-semibold text-gray-700">Duration</Label>
                      <Input
                        id="recipientDMDuration"
                        placeholder="Duration in years"
                        className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Microvascular Complications */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Microvascular Complications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="recipientRetinopathy" className="border-2 border-blue-300" />
                        <Label htmlFor="recipientRetinopathy" className="text-gray-700">Retinopathy</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="recipientNephropathy" className="border-2 border-blue-300" />
                        <Label htmlFor="recipientNephropathy" className="text-gray-700">Nephropathy</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="recipientNeuropathy" className="border-2 border-blue-300" />
                        <Label htmlFor="recipientNeuropathy" className="text-gray-700">Neuropathy</Label>
                      </div>
                    </div>
                  </div>

                  {/* Macrovascular Complications */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Macrovascular Complications</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                        <div className="flex items-center space-x-3">
                          <Checkbox id="recipientIHD" className="border-2 border-blue-300" />
                          <Label htmlFor="recipientIHD" className="text-gray-700">IHD</Label>
                        </div>
                        <Input placeholder="2D-Echo results" className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                        <Input placeholder="Coronary Angiogram" className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Checkbox id="recipientCVA" className="border-2 border-blue-300" />
                          <Label htmlFor="recipientCVA" className="text-gray-700">CVA</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox id="recipientPVD" className="border-2 border-blue-300" />
                          <Label htmlFor="recipientPVD" className="text-gray-700">PVD</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Comorbidities */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Other Comorbidities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="recipientHTN" className="border-2 border-blue-300" />
                      <Label htmlFor="recipientHTN" className="text-gray-700">Hypertension</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="recipientDL" className="border-2 border-blue-300" />
                      <Label htmlFor="recipientDL" className="text-gray-700">Dyslipidemia</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="recipientHF" className="border-2 border-blue-300" />
                      <Label htmlFor="recipientHF" className="text-gray-700">Heart Failure</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="recipientPsychiatric" className="border-2 border-blue-300" />
                      <Label htmlFor="recipientPsychiatric" className="text-gray-700">Psychiatric Illness</Label>
                    </div>
                  </div>

                  {/* CLCD with additional fields */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="recipientCLCD" className="border-2 border-blue-300" />
                      <Label htmlFor="recipientCLCD" className="text-gray-700 font-medium">Chronic Liver Disease</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                      <div className="space-y-2">
                        <Label htmlFor="recipientMELD" className="text-sm font-medium text-gray-600">MELD Score</Label>
                        <Input
                          id="recipientMELD"
                          placeholder="MELD Score"
                          className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
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
                  <h3 className="text-lg font-semibold text-blue-900">Treatment Modality</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="recipientHD" className="text-sm font-semibold text-gray-700">Hemodialysis (HD)</Label>
                      <Input
                        id="recipientHD"
                        placeholder="HD details"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recipientCAPD" className="text-sm font-semibold text-gray-700">CAPD</Label>
                      <Input
                        id="recipientCAPD"
                        placeholder="CAPD details"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Starting Date */}
                <div className="space-y-3">
                  <Label htmlFor="recipientRRTStart" className="text-sm font-semibold text-gray-700">
                    RRT Starting Date
                  </Label>
                  <Input
                    id="recipientRRTStart"
                    type="date"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg max-w-md"
                  />
                </div>

                {/* Access Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Vascular Access</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="recipientFemoral" className="text-sm font-semibold text-gray-700">Femoral</Label>
                      <Input
                        id="recipientFemoral"
                        placeholder="Femoral access details"
                        className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recipientIJC" className="text-sm font-semibold text-gray-700">Internal Jugular Catheter</Label>
                      <Input
                        id="recipientIJC"
                        placeholder="IJC details"
                        className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recipientPermcath" className="text-sm font-semibold text-gray-700">Permanent Catheter</Label>
                      <Input
                        id="recipientPermcath"
                        placeholder="Permcath details"
                        className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recipientCAPDAccess" className="text-sm font-semibold text-gray-700">CAPD Access</Label>
                      <Input
                        id="recipientCAPDAccess"
                        placeholder="CAPD access details"
                        className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Complications */}
                <div className="space-y-3">
                  <Label htmlFor="recipientRRTComplications" className="text-sm font-semibold text-gray-700">
                    Complications
                  </Label>
                  <Textarea
                    id="recipientRRTComplications"
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
                          <th className="border border-blue-300 p-4 text-left font-semibold">#</th>
                          <th className="border border-blue-300 p-4 text-left font-semibold">Date</th>
                          <th className="border border-blue-300 p-4 text-left font-semibold">Indication</th>
                          <th className="border border-blue-300 p-4 text-left font-semibold">Volume</th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfusions.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-200 p-3 text-sm font-medium text-gray-700">{idx + 1}</td>
                            <td className="border border-gray-200 p-2">
                              <Input
                                type="date"
                                value={row.date}
                                onChange={(e) => handleTransfusionChange(idx, "date", e.target.value)}
                                className="h-10 border-gray-300 focus:border-blue-500 rounded-md"
                              />
                            </td>
                            <td className="border border-gray-200 p-2">
                              <Input
                                placeholder="Indication"
                                value={row.indication}
                                onChange={(e) => handleTransfusionChange(idx, "indication", e.target.value)}
                                className="h-10 border-gray-300 focus:border-blue-500 rounded-md"
                              />
                            </td>
                            <td className="border border-gray-200 p-2">
                              <Input
                                placeholder="Volume (mL)"
                                value={row.volume}
                                onChange={(e) => handleTransfusionChange(idx, "volume", e.target.value)}
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
                  Blood group, cross match, HLA typing, and immunological risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Blood Group Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">Blood Group</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="recipientBloodGroupD" className="text-sm font-semibold text-gray-700">D Group</Label>
                      <Input
                        id="recipientBloodGroupD"
                        placeholder="Enter D value"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recipientBloodGroupR" className="text-sm font-semibold text-gray-700">R Group</Label>
                      <Input
                        id="recipientBloodGroupR"
                        placeholder="Enter R value"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Cross Match Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cross Match</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="recipientTCell" className="text-sm font-semibold text-gray-700">T Cell</Label>
                      <Input
                        id="recipientTCell"
                        placeholder="Enter T cell value"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recipientBCell" className="text-sm font-semibold text-gray-700">B Cell</Label>
                      <Input
                        id="recipientBCell"
                        placeholder="Enter B cell value"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* HLA Typing Section */}
                <div className="bg-white p-6 rounded-lg border-2 border-blue-200 space-y-6">
                  <h3 className="text-lg font-semibold text-blue-900">HLA Typing</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="border border-blue-300 p-4 text-left font-semibold">Type</th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">HLA-A</th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">HLA-B</th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">HLA-C</th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">HLA-DR</th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">HLA-DP</th>
                          <th className="border border-blue-300 p-4 text-center font-semibold">HLA-DQ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-blue-50">
                          <td className="border border-gray-200 p-4 font-semibold text-blue-900">Donor</td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="A" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="B" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="C" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="DR" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="DP" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="DQ" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-gray-200 p-4 font-semibold text-gray-900">Recipient</td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="A" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="B" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="C" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="DR" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="DP" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="DQ" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                        </tr>
                        <tr className="bg-green-50">
                          <td className="border border-gray-200 p-4 font-semibold text-green-900">Conclusion</td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="Match" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="Match" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="Match" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="Match" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="Match" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input placeholder="Match" className="h-10 border-gray-300 focus:border-blue-500 text-center" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* PRA Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">PRA (Panel Reactive Antibodies)</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="recipientPraPre" className="text-sm font-semibold text-gray-700">Pre (%)</Label>
                      <Input
                        id="recipientPraPre"
                        placeholder="Pre PRA percentage"
                        type="number"
                        min="0"
                        max="100"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="recipientPraPost" className="text-sm font-semibold text-gray-700">Post (%)</Label>
                      <Input
                        id="recipientPraPost"
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
                  <h3 className="text-lg font-semibold text-gray-900">DSA (Donor Specific Antibodies)</h3>
                  <div className="space-y-3">
                    <Label htmlFor="recipientDsa" className="text-sm font-semibold text-gray-700">DSA Details</Label>
                    <Textarea
                      id="recipientDsa"
                      placeholder="Enter DSA test results and details..."
                      rows={3}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-lg resize-none"
                    />
                  </div>
                </div>

                {/* Immunological Risk */}
                <div className="bg-white p-6 rounded-lg border-2 border-blue-200 space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">Immunological Risk Assessment</h3>
                  <RadioGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <RadioGroupItem value="low" id="recipientRiskLow" className="border-2 border-green-400" />
                      <Label htmlFor="recipientRiskLow" className="text-green-800 font-semibold">Low Risk</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <RadioGroupItem value="average" id="recipientRiskAverage" className="border-2 border-yellow-400" />
                      <Label htmlFor="recipientRiskAverage" className="text-yellow-800 font-semibold">Average Risk</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <RadioGroupItem value="high" id="recipientRiskHigh" className="border-2 border-red-400" />
                      <Label htmlFor="recipientRiskHigh" className="text-red-800 font-semibold">High Risk</Label>
                    </div>
                  </RadioGroup>
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
                  Final Confirmation
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Review and confirm all assessment details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
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
                    <Checkbox id="recipientFinalCheck" className="border-2 border-blue-300 mt-1" required />
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

                {/* Summary Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Assessment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-700">Patient Name:</span> {recipientForm.name || 'Not provided'}</p>
                      <p><span className="font-medium text-gray-700">Age:</span> {recipientForm.age || 'Not provided'}</p>
                      <p><span className="font-medium text-gray-700">NIC Number:</span> {recipientForm.nicNo || 'Not provided'}</p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-700">Selected Donor:</span> {recipientForm.donorId ? donorList.find(d => d.id === recipientForm.donorId)?.name : 'Not selected'}</p>
                      <p><span className="font-medium text-gray-700">Relationship Type:</span> {recipientForm.relationType || 'Not specified'}</p>
                      <p><span className="font-medium text-gray-700">Assessment Date:</span> {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
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
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Assessment
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
