import React, { useState, useEffect } from "react";
import { ArrowLeft, Activity, Save, User, Heart, Pill, ClipboardList, Shield, FileText, UserCheck } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { transplantApi, handleApiError } from "../services/transplantApi";

import type { KTFormData, ImmunologicalDetails } from "../types/transplant";
import type { ActiveView } from "../pages/KidneyTransplant";
import { usePatientContext } from "../context/PatientContext";

interface KTFormProps {
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
  patientPhn?: string;
}

const initialForm: KTFormData = {
  patientPhn: "",
  name: "",
  dob: "",
  age: "",
  gender: "",
  address: "",
  contact: "",
  diabetes: "",
  hypertension: "",
  ihd: "",
  dyslipidaemia: "",
  other: "",
  otherSpecify: "",
  primaryDiagnosis: "",
  modeOfRRT: "",
  durationRRT: "",
  ktDate: "",
  numberOfKT: "",
  ktUnit: "",
  wardNumber: "",
  ktSurgeon: "",
  ktType: "",
  donorRelationship: "",
  peritonealPosition: "",
  sideOfKT: "",
  preKT: "",
  inductionTherapy: "",
  maintenance: "",
  maintenanceOther: "",
  maintenancePred: false,
  maintenanceMMF: false,
  maintenanceTac: false,
  maintenanceEverolimus: false,
  maintenanceOtherText: "",
  immunologicalDetails: {
    bloodGroupDonor: "",
    bloodGroupRecipient: "",
    crossMatchTcell: "",
    crossMatchBcell: "",
    hlaTypingDonor: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
    hlaTypingRecipient: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
    praPre: "",
    praPost: "",
    dsa: "",
    immunologicalRisk: "",
  },
  // Infection Screen
  cmvDonor: "",
  cmvRecipient: "",
  ebvDonor: "",
  ebvRecipient: "",
  cmvRiskCategory: "",
  ebvRiskCategory: "",
  tbMantoux: "",
  hivAb: "",
  hepBsAg: "",
  hepCAb: "",
  infectionRiskCategory: "",
  cotrimoxazoleYes: false,
  cotriDuration: "",
  cotriStopped: "",
  valganciclovirYes: false,
  valganDuration: "",
  valganStopped: "",
  vaccinationCOVID: false,
  vaccinationInfluenza: false,
  vaccinationPneumococcal: false,
  vaccinationVaricella: false,
  preOpStatus: "",
  preOpPreparation: "",
  surgicalNotes: "",
  preKTCreatinine: "",
  postKTCreatinine: "",
  delayedGraftYes: false,
  postKTDialysisYes: false,
  postKTPDYes: false,
  acuteRejectionYes: false,
  acuteRejectionDetails: "",
  otherComplications: "",
  postKTComp1: "",
  postKTComp2: "",
  postKTComp3: "",
  postKTComp4: "",
  postKTComp5: "",
  postKTComp6: "",
  medications: [ { name: "", dosage: "" } ],
  recommendations: "",
  filledBy: "",
};

const FORM_STEPS = [
  { label: "Patient Info", icon: User },
  { label: "Medical History", icon: Activity },
  { label: "Pre-KT Details", icon: Pill },
  { label: "KT Related Info", icon: ClipboardList },
  { label: "Infection Screen", icon: Shield },
  { label: "Immunological", icon: Shield },
  { label: "Immunosuppression", icon: Pill },
  { label: "Prophylaxis", icon: Pill },
  { label: "Pre-op", icon: Activity },
  { label: "Immediate Post KT", icon: FileText },
  { label: "Surgery Complications", icon: FileText },
  { label: "Medication", icon: Pill },
  { label: "Confirmation", icon: UserCheck },
  { label: "Recommendations", icon: FileText }
];

const KTForm: React.FC<KTFormProps> = ({ setActiveView }) => {
  const [form, setForm] = useState<KTFormData>(initialForm);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { patient } = usePatientContext();

  const emptyHLA: ImmunologicalDetails["hlaTypingDonor"] = { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" };
  const emptyImmuno: ImmunologicalDetails = {
    bloodGroupDonor: "",
    bloodGroupRecipient: "",
    crossMatchTcell: "",
    crossMatchBcell: "",
    hlaTypingDonor: { ...emptyHLA },
    hlaTypingRecipient: { ...emptyHLA },
    praPre: "",
    praPost: "",
    dsa: "",
    immunologicalRisk: "",
  };

  const updateImmuno = (updates: Partial<ImmunologicalDetails>) => {
    setForm(prev => ({
      ...prev,
      immunologicalDetails: {
        ...emptyImmuno,
        ...(prev.immunologicalDetails || {}),
        ...updates,
      }
    }));
  };

  const handleHlaChange = (side: 'donor' | 'recipient', key: keyof import('../types/transplant').HLA, value: string) => {
    setForm(prev => {
      const prevImmuno = prev.immunologicalDetails || emptyImmuno;
      const donor = { ...prevImmuno.hlaTypingDonor };
      const recipient = { ...prevImmuno.hlaTypingRecipient };
      if (side === 'donor') donor[key] = value;
      else recipient[key] = value;
      return {
        ...prev,
        immunologicalDetails: {
          ...prevImmuno,
          hlaTypingDonor: donor,
          hlaTypingRecipient: recipient,
        }
      };
    });
  };

  const handleImmunoField = (field: keyof ImmunologicalDetails, value: string) => {
    setForm(prev => ({
      ...prev,
      immunologicalDetails: {
        ...(prev.immunologicalDetails || emptyImmuno),
        [field]: value,
      } as ImmunologicalDetails
    }));
  };

  // Auto-populate patient information when patient data is loaded from search
  useEffect(() => {
    if (patient && patient.name) {
      console.log("Auto-populating KT form with patient data:", patient);
      setForm((prevForm) => ({
        ...prevForm,
        patientPhn: patient.phn || "",
        name: patient.name || "",
        age: patient.age?.toString() || "",
        gender: patient.gender || "",
        dob: patient.dateOfBirth || "",
        address: patient.address || "",
        contact: patient.contact || "",
      }));
    }
  }, [patient]);

  const handleChange = (field: keyof KTFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(FORM_STEPS.length - 1, s + 1));
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  const { setPatientData } = usePatientContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.filledBy) {
      alert("Please enter who filled out the form in the Confirmation step.");
      setStep(FORM_STEPS.findIndex(s => s.label === "Confirmation"));
      return;
    }

    setIsSubmitting(true);

    try {
      if (!patient?.phn) {
        alert("Missing patient identifier (PHN). Please search for a patient first.");
        return;
      }

      // Use the API service instead of direct fetch
      const saved = await transplantApi.createKTSurgery(patient.phn, form);

      // Update patient context (ktSurgery summary fields)
      setPatientData(prev => ({
        ...prev,
        ktSurgery: {
          dateOfKT: saved.ktDate || form.ktDate || "",
          ktType: saved.ktType || form.ktType || "",
          donorRelationship: saved.donorRelationship || form.donorRelationship || "",
        }
      }));

      alert("KT form submitted successfully!");
      setActiveView("dashboard");
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = handleApiError(err);
      alert(`Error saving KT surgery: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Kidney Transplant Surgery</h1>
              <p className="text-blue-600">
                {patient && patient.name 
                  ? `Patient: ${patient.name} (PHN: ${patient.phn})`
                  : "Complete the KT surgery assessment form"
                }
              </p>
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
            <div className="w-full max-w-full overflow-x-auto pb-2">
              <div className="flex items-center gap-3 min-w-[700px] md:min-w-0">
                {FORM_STEPS.map((formStep, idx) => {
                  const Icon = formStep.icon;
                  const isActive = step === idx;
                  const isCompleted = step > idx;
                  return (
                    <div key={formStep.label} className="flex-1 min-w-[120px]">
                      <div className={
                        `flex flex-col items-center p-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? "bg-blue-100 border-2 border-blue-500 text-blue-700" 
                          : isCompleted
                          ? "bg-blue-50 border border-blue-200 text-blue-600"
                          : "bg-gray-50 border border-gray-200 text-gray-400"
                        }`
                      }>
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 0: Patient Info */}
          {step === 0 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <User className="w-6 h-6" />
                  Patient Information
                  {patient && patient.name && (
                    <span className="text-blue-200 text-sm ml-auto">
                      Loaded from search
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {patient && patient.name 
                    ? `Patient data loaded for: ${patient.name}`
                    : "Search for a patient using the search bar above to auto-fill this section"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                      Full Name <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={e => handleChange("name", e.target.value)}
                      placeholder="Enter full name"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="contact" className="text-sm font-semibold text-gray-700 flex items-center">
                      Contact Number
                    </Label>
                    <Input
                      id="contact"
                      value={form.contact}
                      onChange={e => handleChange("contact", e.target.value)}
                      placeholder="Enter phone number"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="dob" className="text-sm font-semibold text-gray-700 flex items-center">
                      Date of Birth <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={form.dob}
                      onChange={e => handleChange("dob", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-sm font-semibold text-gray-700 flex items-center">
                      Age at Referral (years) <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min={0}
                      value={form.age}
                      onChange={e => handleChange("age", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center">
                    Gender <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup className="flex gap-8 pt-2" value={form.gender} onValueChange={value => handleChange("gender", value)}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="male" id="ktMale" className="border-2 border-blue-300" />
                      <Label htmlFor="ktMale" className="text-gray-700 font-medium">Male</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="female" id="ktFemale" className="border-2 border-blue-300" />
                      <Label htmlFor="ktFemale" className="text-gray-700 font-medium">Female</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="other" id="ktOther" className="border-2 border-blue-300" />
                      <Label htmlFor="ktOther" className="text-gray-700 font-medium">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    onChange={e => handleChange("address", e.target.value)}
                    placeholder="Enter complete address"
                    rows={4}
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Medical History */}
          {step === 1 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Activity className="w-6 h-6" />
                  Medical History
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Select all applicable conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id="diabetes"
                      checked={form.diabetes === "true"}
                      onCheckedChange={(checked) => handleChange("diabetes", checked ? "true" : "false")}
                      className="border-2 border-blue-300"
                    />
                    <Label htmlFor="diabetes" className="text-gray-700 cursor-pointer flex-1">Diabetes</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id="hypertension"
                      checked={form.hypertension === "true"}
                      onCheckedChange={(checked) => handleChange("hypertension", checked ? "true" : "false")}
                      className="border-2 border-blue-300"
                    />
                    <Label htmlFor="hypertension" className="text-gray-700 cursor-pointer flex-1">Hypertension</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id="ihd"
                      checked={form.ihd === "true"}
                      onCheckedChange={(checked) => handleChange("ihd", checked ? "true" : "false")}
                      className="border-2 border-blue-300"
                    />
                    <Label htmlFor="ihd" className="text-gray-700 cursor-pointer flex-1">IHD</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id="dyslipidaemia"
                      checked={form.dyslipidaemia === "true"}
                      onCheckedChange={(checked) => handleChange("dyslipidaemia", checked ? "true" : "false")}
                      className="border-2 border-blue-300"
                    />
                    <Label htmlFor="dyslipidaemia" className="text-gray-700 cursor-pointer flex-1">Dyslipidaemia</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id="other"
                      checked={form.other === "true"}
                      onCheckedChange={(checked) => handleChange("other", checked ? "true" : "false")}
                      className="border-2 border-blue-300"
                    />
                    <Label htmlFor="other" className="text-gray-700 cursor-pointer flex-1">Other</Label>
                  </div>
                </div>
                
                {form.other === "true" && (
                  <div className="space-y-3">
                    <Label htmlFor="otherSpecify" className="text-sm font-semibold text-gray-700">
                      Please specify other conditions
                    </Label>
                    <Input
                      id="otherSpecify"
                      value={form.otherSpecify}
                      onChange={(e) => handleChange("otherSpecify", e.target.value)}
                      placeholder="Specify other medical conditions"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Pre-KT Details */}
          {step === 2 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Pill className="w-6 h-6" />
                  Pre-Transplant Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Renal replacement therapy information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="primaryDiagnosis" className="text-sm font-semibold text-gray-700">
                    Primary Renal Diagnosis
                  </Label>
                  <Input
                    id="primaryDiagnosis"
                    value={form.primaryDiagnosis}
                    onChange={e => handleChange("primaryDiagnosis", e.target.value)}
                    placeholder="Enter primary diagnosis"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="modeOfRRT" className="text-sm font-semibold text-gray-700">
                      Mode of RRT prior to KT
                    </Label>
                    <select 
                      id="modeOfRRT"
                      className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      value={form.modeOfRRT} 
                      onChange={e => handleChange("modeOfRRT", e.target.value)}
                    >
                      <option value="">Select mode</option>
                      <option value="HD">HD</option>
                      <option value="PD">PD</option>
                      <option value="Pre-emptive">Pre-emptive</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="durationRRT" className="text-sm font-semibold text-gray-700">
                      Duration of RRT prior to KT
                    </Label>
                    <Input
                      id="durationRRT"
                      value={form.durationRRT}
                      onChange={e => handleChange("durationRRT", e.target.value)}
                      placeholder="e.g. 2 years"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: KT Related Info */}
          {step === 3 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <ClipboardList className="w-6 h-6" />
                  Transplantation Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Transplant surgery information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="ktDate" className="text-sm font-semibold text-gray-700">
                      Date of Transplantation
                    </Label>
                    <Input
                      id="ktDate"
                      type="date"
                      value={form.ktDate}
                      onChange={e => handleChange("ktDate", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="numberOfKT" className="text-sm font-semibold text-gray-700">
                      Transplant Number
                    </Label>
                    <select 
                      id="numberOfKT"
                      className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      value={form.numberOfKT} 
                      onChange={e => handleChange("numberOfKT", e.target.value)}
                    >
                      <option value="">Select number</option>
                      <option value="1">1st Transplant</option>
                      <option value="2">2nd Transplant</option>
                      <option value="3">3rd Transplant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="ktUnit" className="text-sm font-semibold text-gray-700">
                      Transplant Unit
                    </Label>
                    <select 
                      id="ktUnit"
                      className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      value={form.ktUnit} 
                      onChange={e => handleChange("ktUnit", e.target.value)}
                    >
                      <option value="">Select unit</option>
                      <option value="NHK">NHK</option>
                      <option value="THP">THP</option>
                      <option value="Other">Other</option>
                    </select>
                    {form.ktUnit === "Other" && (
                      <div className="mt-3">
                        <Label htmlFor="wardNumber" className="text-sm font-semibold text-gray-700">
                          Ward Number
                        </Label>
                        <Input
                          id="wardNumber"
                          value={form.wardNumber}
                          onChange={e => handleChange("wardNumber", e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="ktSurgeon" className="text-sm font-semibold text-gray-700">
                      Transplant Surgeon
                    </Label>
                    <Input
                      id="ktSurgeon"
                      value={form.ktSurgeon}
                      onChange={e => handleChange("ktSurgeon", e.target.value)}
                      placeholder="Enter surgeon name"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="ktType" className="text-sm font-semibold text-gray-700">
                      Type of Transplant
                    </Label>
                    <select 
                      id="ktType"
                      className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      value={form.ktType} 
                      onChange={e => handleChange("ktType", e.target.value)}
                    >
                      <option value="">Select type</option>
                      <option value="Live related">Live related</option>
                      <option value="Live unrelated">Live unrelated</option>
                      <option value="DDKT">Deceased Donor</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="donorRelationship" className="text-sm font-semibold text-gray-700">
                      Donor Relationship
                    </Label>
                    <Input
                      id="donorRelationship"
                      value={form.donorRelationship}
                      onChange={e => handleChange("donorRelationship", e.target.value)}
                      placeholder="e.g. Mother, Father, etc."
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="peritonealPosition" className="text-sm font-semibold text-gray-700">
                      Peritoneal Position
                    </Label>
                    <select 
                      id="peritonealPosition"
                      className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      value={form.peritonealPosition} 
                      onChange={e => handleChange("peritonealPosition", e.target.value)}
                    >
                      <option value="">Select position</option>
                      <option value="Extraperitoneal">Extraperitoneal</option>
                      <option value="Intraperitoneal">Intraperitoneal</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="sideOfKT" className="text-sm font-semibold text-gray-700">
                      Side of Transplant
                    </Label>
                    <select 
                      id="sideOfKT"
                      className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      value={form.sideOfKT} 
                      onChange={e => handleChange("sideOfKT", e.target.value)}
                    >
                      <option value="">Select side</option>
                      <option value="Right">Right</option>
                      <option value="Left">Left</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Infection Screen */}
          {step === 4 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Shield className="w-6 h-6" />
                  Infection Screen
                </CardTitle>
                <CardDescription className="text-blue-100">
                  CMV / EBV / TB / Viral serology and overall infection risk
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">CMV Status</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Donor</span>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" onClick={() => handleChange("cmvDonor", "+ve") } className={form.cmvDonor === "+ve" ? "bg-blue-600 text-white" : ""}>+ve</Button>
                          <Button variant="outline" size="sm" onClick={() => handleChange("cmvDonor", "-ve") } className={form.cmvDonor === "-ve" ? "bg-blue-600 text-white" : ""}>-ve</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Recipient</span>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" onClick={() => handleChange("cmvRecipient", "+ve") } className={form.cmvRecipient === "+ve" ? "bg-blue-600 text-white" : ""}>+ve</Button>
                          <Button variant="outline" size="sm" onClick={() => handleChange("cmvRecipient", "-ve") } className={form.cmvRecipient === "-ve" ? "bg-blue-600 text-white" : ""}>-ve</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Risk Category</Label>
                        <select value={form.cmvRiskCategory} onChange={e => handleChange("cmvRiskCategory", e.target.value)} className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg">
                          <option value="">Select risk</option>
                          <option value="Low">Low</option>
                          <option value="Average">Average</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">EBV Status</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Donor</span>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" onClick={() => handleChange("ebvDonor", "+ve") } className={form.ebvDonor === "+ve" ? "bg-blue-600 text-white" : ""}>+ve</Button>
                          <Button variant="outline" size="sm" onClick={() => handleChange("ebvDonor", "-ve") } className={form.ebvDonor === "-ve" ? "bg-blue-600 text-white" : ""}>-ve</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Recipient</span>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" onClick={() => handleChange("ebvRecipient", "+ve") } className={form.ebvRecipient === "+ve" ? "bg-blue-600 text-white" : ""}>+ve</Button>
                          <Button variant="outline" size="sm" onClick={() => handleChange("ebvRecipient", "-ve") } className={form.ebvRecipient === "-ve" ? "bg-blue-600 text-white" : ""}>-ve</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Risk Category</Label>
                        <select value={form.ebvRiskCategory} onChange={e => handleChange("ebvRiskCategory", e.target.value)} className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg">
                          <option value="">Select risk</option>
                          <option value="Low">Low</option>
                          <option value="Average">Average</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Other Infection Screen</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">TB - Mantoux</Label>
                        <select value={form.tbMantoux} onChange={e => handleChange("tbMantoux", e.target.value)} className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg">
                          <option value="">Select</option>
                          <option value="positive">Positive</option>
                          <option value="negative">Negative</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">HIV Ab</Label>
                        <Input id="hivAb" value={form.hivAb} onChange={e => handleChange("hivAb", e.target.value)} className="h-10 border-2 border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <Label className="text-sm">HepBsAg</Label>
                        <Input id="hepBsAg" value={form.hepBsAg} onChange={e => handleChange("hepBsAg", e.target.value)} className="h-10 border-2 border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <Label className="text-sm">Hep C Ab</Label>
                        <Input id="hepCAb" value={form.hepCAb} onChange={e => handleChange("hepCAb", e.target.value)} className="h-10 border-2 border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Infection Risk Category</Label>
                        <select value={form.infectionRiskCategory} onChange={e => handleChange("infectionRiskCategory", e.target.value)} className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg">
                          <option value="">Select overall risk</option>
                          <option value="Low">Low</option>
                          <option value="Average">Average</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                            <h3 className="text-lg font-semibold text-blue-900">Blood Group</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <Label htmlFor="bloodGroupDonor" className="text-sm font-semibold text-gray-700">Donor Blood Group</Label>
                                <Input
                                  id="bloodGroupDonor"
                                  value={form.immunologicalDetails?.bloodGroupDonor || ""}
                                  onChange={e => handleImmunoField('bloodGroupDonor', e.target.value)}
                                  placeholder="e.g. A+, O-"
                                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label htmlFor="bloodGroupRecipient" className="text-sm font-semibold text-gray-700">Recipient Blood Group</Label>
                                <Input
                                  id="bloodGroupRecipient"
                                  value={form.immunologicalDetails?.bloodGroupRecipient || ""}
                                  onChange={e => handleImmunoField('bloodGroupRecipient', e.target.value)}
                                  placeholder="e.g. B+, AB-"
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
                                    {(['hlaA','hlaB','hlaC','hlaDR','hlaDP','hlaDQ'] as (keyof import('../types/transplant').HLA)[]).map((key) => (
                                      <td key={key} className="border border-gray-200 p-2">
                                        <Input
                                          value={form.immunologicalDetails?.hlaTypingDonor?.[key] || ""}
                                          onChange={(e) => handleHlaChange('donor', key, e.target.value)}
                                          placeholder={String(key).replace('hla','')}
                                          className="h-10 border-gray-300 focus:border-blue-500 text-center"
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  <tr className="bg-white">
                                    <td className="border border-gray-200 p-4 font-semibold text-gray-900">Recipient</td>
                                    {(['hlaA','hlaB','hlaC','hlaDR','hlaDP','hlaDQ'] as (keyof import('../types/transplant').HLA)[]).map((key) => (
                                      <td key={key} className="border border-gray-200 p-2">
                                        <Input
                                          value={form.immunologicalDetails?.hlaTypingRecipient?.[key] || ""}
                                          onChange={(e) => handleHlaChange('recipient', key, e.target.value)}
                                          placeholder={String(key).replace('hla','')}
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
                            <h3 className="text-lg font-semibold text-blue-900">PRA (Panel Reactive Antibodies)</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <Label htmlFor="praPre" className="text-sm font-semibold text-gray-700">Pre (%)</Label>
                                <Input
                                  id="praPre"
                                  value={form.immunologicalDetails?.praPre || ""}
                                  onChange={e => handleImmunoField('praPre', e.target.value)}
                                  placeholder="Pre PRA percentage"
                                  type="number"
                                  min={0}
                                  max={100}
                                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label htmlFor="praPost" className="text-sm font-semibold text-gray-700">Post (%)</Label>
                                <Input
                                  id="praPost"
                                  value={form.immunologicalDetails?.praPost || ""}
                                  onChange={e => handleImmunoField('praPost', e.target.value)}
                                  placeholder="Post PRA percentage"
                                  type="number"
                                  min={0}
                                  max={100}
                                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                />
                              </div>
                            </div>
                          </div>

                          {/* DSA and Immunological Risk */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label htmlFor="dsa" className="text-sm font-semibold text-gray-700">DSA (Donor Specific Antibodies)</Label>
                              <Input id="dsa" value={form.immunologicalDetails?.dsa || ""} onChange={e => handleImmunoField('dsa', e.target.value)} placeholder="DSA details" className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="immunologicalRisk" className="text-sm font-semibold text-gray-700">Immunological Risk</Label>
                              <Input id="immunologicalRisk" value={form.immunologicalDetails?.immunologicalRisk || ""} onChange={e => handleImmunoField('immunologicalRisk', e.target.value)} placeholder="Immunological risk assessment" className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      )}

          {/* Step 6: Immunosuppression */}
          {step === 6 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Pill className="w-6 h-6" />
                  Immunosuppression Therapy
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Immunosuppressive therapy details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Pre KT</Label>
                    <select value={form.preKT} onChange={e => handleChange("preKT", e.target.value)} className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg">
                      <option value="">Select</option>
                      <option value="TPE">TPE</option>
                      <option value="IVIG">IVIG</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Induction Therapy</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <input type="radio" id="indBasilix" name="induction" value="Basiliximab" checked={form.inductionTherapy === "Basiliximab"} onChange={e => handleChange("inductionTherapy", e.target.value)} />
                        <Label htmlFor="indBasil" className="text-gray-700">Basiliximab</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="radio" id="indATG" name="induction" value="ATG" checked={form.inductionTherapy === "ATG"} onChange={e => handleChange("inductionTherapy", e.target.value)} />
                        <Label htmlFor="indATG" className="text-gray-700">ATG</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="radio" id="indMethyl" name="induction" value="Methylprednisolone" checked={form.inductionTherapy === "Methylprednisolone"} onChange={e => handleChange("inductionTherapy", e.target.value)} />
                        <Label htmlFor="indMethyl" className="text-gray-700">Methylprednisolone</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Label className="text-sm font-semibold text-gray-700">Maintenance</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="flex items-center space-x-3">
                      <input id="maintPred" type="checkbox" checked={!!form.maintenancePred} onChange={e => setForm(prev => ({...prev, maintenancePred: e.target.checked}))} />
                      <Label htmlFor="maintPred" className="text-gray-700">Pred</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input id="maintMMF" type="checkbox" checked={!!form.maintenanceMMF} onChange={e => setForm(prev => ({...prev, maintenanceMMF: e.target.checked}))} />
                      <Label htmlFor="maintMMF" className="text-gray-700">MMF</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input id="maintTac" type="checkbox" checked={!!form.maintenanceTac} onChange={e => setForm(prev => ({...prev, maintenanceTac: e.target.checked}))} />
                      <Label htmlFor="maintTac" className="text-gray-700">Tac</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input id="maintEve" type="checkbox" checked={!!form.maintenanceEverolimus} onChange={e => setForm(prev => ({...prev, maintenanceEverolimus: e.target.checked}))} />
                      <Label htmlFor="maintEve" className="text-gray-700">Everolimus</Label>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-sm font-semibold text-gray-700">Other (specify)</Label>
                    <Input value={form.maintenanceOtherText || form.maintenanceOther} onChange={e => setForm(prev => ({...prev, maintenanceOtherText: e.target.value, maintenanceOther: e.target.value}))} placeholder="Other maintenance therapy" className="h-12 border-2 border-gray-200 rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Prophylaxis */}
          {step === 7 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Pill className="w-6 h-6" />
                  Prophylaxis
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Preventive medication and treatment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="cotrimoxazole" checked={!!form.cotrimoxazoleYes} onCheckedChange={(checked) => setForm(prev => ({ ...prev, cotrimoxazoleYes: !!checked }))} className="border-2 border-blue-300" />
                        <Label htmlFor="cotrimoxazole" className="text-gray-700 font-medium">Cotrimoxazole</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input id="cotriDuration" value={form.cotriDuration} onChange={e => handleChange("cotriDuration", e.target.value)} placeholder="Duration (e.g., 6 months)" className="h-10 border-2 border-gray-200 rounded-lg" />
                        <Input id="cotriStopped" type="date" value={form.cotriStopped} onChange={e => handleChange("cotriStopped", e.target.value)} className="h-10 border-2 border-gray-200 rounded-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="valganciclovir" checked={!!form.valganciclovirYes} onCheckedChange={(checked) => setForm(prev => ({ ...prev, valganciclovirYes: !!checked }))} className="border-2 border-blue-300" />
                        <Label htmlFor="valganciclovir" className="text-gray-700 font-medium">Valganciclovir</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input id="valganDuration" value={form.valganDuration} onChange={e => handleChange("valganDuration", e.target.value)} placeholder="Duration" className="h-10 border-2 border-gray-200 rounded-lg" />
                        <Input id="valganStopped" type="date" value={form.valganStopped} onChange={e => handleChange("valganStopped", e.target.value)} className="h-10 border-2 border-gray-200 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Vaccination</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3">
                      <input id="vCOVID" type="checkbox" checked={!!form.vaccinationCOVID} onChange={e => setForm(prev => ({...prev, vaccinationCOVID: e.target.checked}))} />
                      <Label htmlFor="vCOVID" className="text-gray-700">COVID</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input id="vInfluenza" type="checkbox" checked={!!form.vaccinationInfluenza} onChange={e => setForm(prev => ({...prev, vaccinationInfluenza: e.target.checked}))} />
                      <Label htmlFor="vInfluenza" className="text-gray-700">Influenza</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input id="vPneumo" type="checkbox" checked={!!form.vaccinationPneumococcal} onChange={e => setForm(prev => ({...prev, vaccinationPneumococcal: e.target.checked}))} />
                      <Label htmlFor="vPneumo" className="text-gray-700">Pneumococcal</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input id="vVaricella" type="checkbox" checked={!!form.vaccinationVaricella} onChange={e => setForm(prev => ({...prev, vaccinationVaricella: e.target.checked}))} />
                      <Label htmlFor="vVaricella" className="text-gray-700">Varicella</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 8: Pre-op */}
          {step === 8 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Activity className="w-6 h-6" />
                  Pre-Operative Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Pre-surgical assessment and preparation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="preOpStatus" className="text-sm font-semibold text-gray-700">
                    Pre-operative Status
                  </Label>
                  <Textarea
                    id="preOpStatus"
                    value={form.preOpStatus}
                    onChange={e => handleChange("preOpStatus", e.target.value)}
                    placeholder="Pre-operative status"
                    rows={3}
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="preOpPreparation" className="text-sm font-semibold text-gray-700">
                    Pre-operative Preparation
                  </Label>
                  <Textarea
                    id="preOpPreparation"
                    value={form.preOpPreparation}
                    onChange={e => handleChange("preOpPreparation", e.target.value)}
                    placeholder="Pre-operative preparation"
                    rows={3}
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="surgicalNotes" className="text-sm font-semibold text-gray-700">
                    Surgical Notes
                  </Label>
                  <Textarea
                    id="surgicalNotes"
                    value={form.surgicalNotes}
                    onChange={e => handleChange("surgicalNotes", e.target.value)}
                    placeholder="Surgical notes"
                    rows={4}
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 9: Immediate Post KT */}
          {step === 9 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileText className="w-6 h-6" />
                  Immediate Post-Transplant Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Within the first week after transplantation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="preKTCreatinine" className="text-sm font-semibold text-gray-700">
                      Pre-transplant Creatinine
                    </Label>
                    <Input
                      id="preKTCreatinine"
                      value={form.preKTCreatinine}
                      onChange={e => handleChange("preKTCreatinine", e.target.value)}
                      placeholder="Pre-transplant creatinine"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="postKTCreatinine" className="text-sm font-semibold text-gray-700">
                      Post-transplant Creatinine at Discharge
                    </Label>
                    <Input
                      id="postKTCreatinine"
                      value={form.postKTCreatinine}
                      onChange={e => handleChange("postKTCreatinine", e.target.value)}
                      placeholder="Post-transplant creatinine"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="delayedGraft" checked={!!form.delayedGraftYes} onCheckedChange={(checked) => setForm(prev => ({ ...prev, delayedGraftYes: !!checked }))} className="border-2 border-blue-300" />
                      <Label htmlFor="delayedGraft" className="text-sm font-semibold text-gray-700">Delayed Graft Function</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="postKTDialysis" checked={!!form.postKTDialysisYes} onCheckedChange={(checked) => setForm(prev => ({ ...prev, postKTDialysisYes: !!checked }))} className="border-2 border-blue-300" />
                      <Label htmlFor="postKTDialysis" className="text-sm font-semibold text-gray-700">Post-transplant Dialysis Required</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="acuteRejection" checked={!!form.acuteRejectionYes} onCheckedChange={(checked) => setForm(prev => ({ ...prev, acuteRejectionYes: !!checked }))} className="border-2 border-blue-300" />
                      <Label htmlFor="acuteRejection" className="text-sm font-semibold text-gray-700">Acute Rejection</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="acuteRejectionDetails" className="text-sm font-semibold text-gray-700">
                      Acute Rejection Details
                    </Label>
                    <Input
                      id="acuteRejectionDetails"
                      value={form.acuteRejectionDetails}
                      onChange={e => handleChange("acuteRejectionDetails", e.target.value)}
                      placeholder="Acute rejection details"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="otherComplications" className="text-sm font-semibold text-gray-700">
                    Other Complications
                  </Label>
                  <Textarea
                    id="otherComplications"
                    value={form.otherComplications}
                    onChange={e => handleChange("otherComplications", e.target.value)}
                    placeholder="Other complications"
                    rows={3}
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 10: Surgery Complications */}
          {step === 10 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileText className="w-6 h-6" />
                  Surgery Complications
                </CardTitle>
                <CardDescription className="text-blue-100">
                  List any post-transplant surgical complications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="postKTComp1" className="text-sm font-semibold text-gray-700">
                      Complication 1
                    </Label>
                    <Input
                      id="postKTComp1"
                      value={form.postKTComp1}
                      onChange={e => handleChange("postKTComp1", e.target.value)}
                      placeholder="First complication"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="postKTComp2" className="text-sm font-semibold text-gray-700">
                      Complication 2
                    </Label>
                    <Input
                      id="postKTComp2"
                      value={form.postKTComp2}
                      onChange={e => handleChange("postKTComp2", e.target.value)}
                      placeholder="Second complication"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="postKTComp3" className="text-sm font-semibold text-gray-700">
                      Complication 3
                    </Label>
                    <Input
                      id="postKTComp3"
                      value={form.postKTComp3}
                      onChange={e => handleChange("postKTComp3", e.target.value)}
                      placeholder="Third complication"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="postKTComp4" className="text-sm font-semibold text-gray-700">
                      Complication 4
                    </Label>
                    <Input
                      id="postKTComp4"
                      value={form.postKTComp4}
                      onChange={e => handleChange("postKTComp4", e.target.value)}
                      placeholder="Fourth complication"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="postKTComp5" className="text-sm font-semibold text-gray-700">
                      Complication 5
                    </Label>
                    <Input
                      id="postKTComp5"
                      value={form.postKTComp5}
                      onChange={e => handleChange("postKTComp5", e.target.value)}
                      placeholder="Fifth complication"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="postKTComp6" className="text-sm font-semibold text-gray-700">
                      Complication 6
                    </Label>
                    <Input
                      id="postKTComp6"
                      value={form.postKTComp6}
                      onChange={e => handleChange("postKTComp6", e.target.value)}
                      placeholder="Sixth complication"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 11: Medication */}
          {step === 11 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Pill className="w-6 h-6" />
                  Current Medications
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Current medication regimen
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Current Medications</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="text-left">
                          <th className="p-2 border-b">Medication</th>
                          <th className="p-2 border-b">Dosage / Strength</th>
                          <th className="p-2 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.medications && form.medications.map((med, idx) => (
                          <tr key={idx} className="align-top">
                            <td className="p-2 border-b">
                              <Input value={med.name} onChange={e => setForm(prev => {
                                const meds = [...(prev.medications || [])];
                                meds[idx] = { ...meds[idx], name: e.target.value };
                                return { ...prev, medications: meds };
                              })} placeholder="Medication name" className="h-10" />
                            </td>
                            <td className="p-2 border-b">
                              <Input value={med.dosage} onChange={e => setForm(prev => {
                                const meds = [...(prev.medications || [])];
                                meds[idx] = { ...meds[idx], dosage: e.target.value };
                                return { ...prev, medications: meds };
                              })} placeholder="Dosage / e.g. 5 mg twice daily" className="h-10" />
                            </td>
                            <td className="p-2 border-b">
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setForm(prev => ({
                                  ...prev,
                                  medications: [...(prev.medications || []), { name: "", dosage: "" }]
                                }))}>Add</Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setForm(prev => {
                                  const meds = [...(prev.medications || [])];
                                  meds.splice(idx, 1);
                                  return { ...prev, medications: meds };
                                })}>Remove</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <Button type="button" onClick={() => setForm(prev => ({ ...prev, medications: [...(prev.medications || []), { name: "", dosage: "" }] }))} className="mt-3">Add Medication</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 12: Confirmation */}
          {step === 12 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <UserCheck className="w-6 h-6" />
                  Final Confirmation
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Review and confirm all assessment details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="filledBy" className="text-sm font-semibold text-gray-700 flex items-center">
                    Assessment Completed By <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="filledBy"
                    value={form.filledBy}
                    onChange={e => handleChange("filledBy", e.target.value)}
                    placeholder="Enter your name or staff ID"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    required
                  />
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-blue-200">
                  <Checkbox id="ktFinalCheck" className="border-2 border-blue-300 mt-1" required />
                  <div className="space-y-2">
                    <Label htmlFor="ktFinalCheck" className="text-gray-700 font-medium leading-relaxed">
                      I confirm that all information provided in this surgery assessment is accurate and complete to the best of my knowledge.
                    </Label>
                    <p className="text-sm text-gray-600">
                      By checking this box, I acknowledge that this assessment will be used for medical decision-making and transplant evaluation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 13: Recommendations */}
          {step === 13 && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileText className="w-6 h-6" />
                  Management Recommendations
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter recommendations for ongoing management
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="recommendations" className="text-sm font-semibold text-gray-700">
                    Recommendations
                  </Label>
                  <Textarea
                    id="recommendations"
                    value={form.recommendations}
                    onChange={e => handleChange("recommendations", e.target.value)}
                    placeholder="Enter recommendations for ongoing management..."
                    rows={6}
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
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
                  disabled={!form.filledBy || isSubmitting}
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save All Details"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KTForm;