import React, { useState } from "react";
import { ArrowLeft, Activity, Save, User, Heart, Pill, ClipboardList, Shield, FileText } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export interface KTFormData {
  name: string;
  dob: string;
  age: string;
  gender: string;
  address: string;
  contact: string;
  diabetes: string;
  hypertension: string;
  ihd: string;
  dyslipidaemia: string;
  other: string;
  otherSpecify: string;
  primaryDiagnosis: string;
  modeOfRRT: string;
  durationRRT: string;
  ktDate: string;
  numberOfKT: string;
  ktUnit: string;
  wardNumber: string;
  ktSurgeon: string;
  ktType: string;
  donorRelationship: string;
  peritonealPosition: string;
  sideOfKT: string;
  preKT: string;
  inductionTherapy: string;
  maintenance: string;
  maintenanceOther: string;
  cotrimoxazole: string;
  cotriDuration: string;
  cotriStopped: string;
  valganciclovir: string;
  valganDuration: string;
  valganStopped: string;
  vaccination: string;
  preOpStatus: string;
  preOpPreparation: string;
  surgicalNotes: string;
  preKTCreatinine: string;
  postKTCreatinine: string;
  delayedGraft: string;
  postKTDialysis: string;
  acuteRejection: string;
  acuteRejectionDetails: string;
  otherComplications: string;
  postKTComp1: string;
  postKTComp2: string;
  postKTComp3: string;
  postKTComp4: string;
  postKTComp5: string;
  postKTComp6: string;
  currentMeds: string;
  recommendations: string;
}

import type { ActiveView } from "../pages/KidneyTransplant";

interface KTFormProps {
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
}

const initialForm: KTFormData = {
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
  cotrimoxazole: "",
  cotriDuration: "",
  cotriStopped: "",
  valganciclovir: "",
  valganDuration: "",
  valganStopped: "",
  vaccination: "",
  preOpStatus: "",
  preOpPreparation: "",
  surgicalNotes: "",
  preKTCreatinine: "",
  postKTCreatinine: "",
  delayedGraft: "",
  postKTDialysis: "",
  acuteRejection: "",
  acuteRejectionDetails: "",
  otherComplications: "",
  postKTComp1: "",
  postKTComp2: "",
  postKTComp3: "",
  postKTComp4: "",
  postKTComp5: "",
  postKTComp6: "",
  currentMeds: "",
  recommendations: "",
};

const FORM_STEPS = [
  { label: "Patient Info", icon: User },
  { label: "Medical History", icon: Activity },
  { label: "Pre-KT Details", icon: Pill },
  { label: "KT Related Info", icon: ClipboardList },
  { label: "Immunological", icon: Shield },
  { label: "Immunosuppression", icon: Pill },
  { label: "Prophylaxis", icon: Pill },
  { label: "Pre-op", icon: Activity },
  { label: "Immediate Post KT", icon: FileText },
  { label: "Surgery Complications", icon: FileText },
  { label: "Medication", icon: Pill },
  { label: "Recommendations", icon: FileText },
];

const KTForm: React.FC<KTFormProps> = ({ setActiveView }) => {
  const [form, setForm] = useState<KTFormData>(initialForm);
  const [step, setStep] = useState(0);

  const handleChange = (field: keyof KTFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(FORM_STEPS.length - 1, s + 1));
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("KT form submitted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Kidney Transplant Surgery</h1>
              <p className="text-blue-600">Complete the KT surgery assessment form</p>
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
              </CardTitle>
              <CardDescription className="text-blue-100">
                Enter the patient's basic details
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
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center">
                    Gender <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup className="flex gap-8 pt-2" value={form.gender} onValueChange={value => handleChange("gender", value)}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Male" id="ktMale" className="border-2 border-blue-300" />
                      <Label htmlFor="ktMale" className="text-gray-700 font-medium">Male</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Female" id="ktFemale" className="border-2 border-blue-300" />
                      <Label htmlFor="ktFemale" className="text-gray-700 font-medium">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
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
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Medical History</h2>
            <p className="text-gray-600 mb-6">Select all applicable conditions</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="diabetes"
                    checked={form.diabetes === "true"}
                    onChange={(e) => handleChange("diabetes", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="diabetes" className="text-sm text-gray-700 cursor-pointer flex-1">Diabetes</label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="hypertension"
                    checked={form.hypertension === "true"}
                    onChange={(e) => handleChange("hypertension", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hypertension" className="text-sm text-gray-700 cursor-pointer flex-1">Hypertension</label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="ihd"
                    checked={form.ihd === "true"}
                    onChange={(e) => handleChange("ihd", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ihd" className="text-sm text-gray-700 cursor-pointer flex-1">IHD</label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="dyslipidaemia"
                    checked={form.dyslipidaemia === "true"}
                    onChange={(e) => handleChange("dyslipidaemia", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dyslipidaemia" className="text-sm text-gray-700 cursor-pointer flex-1">Dyslipidaemia</label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="other"
                    checked={form.other === "true"}
                    onChange={(e) => handleChange("other", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="other" className="text-sm text-gray-700 cursor-pointer flex-1">Other</label>
                </div>
              </div>
              
              {form.other === "true" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Please specify other conditions</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.otherSpecify}
                    onChange={(e) => handleChange("otherSpecify", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Pre-KT Details */}
        {step === 2 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pre-Transplant Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Renal Diagnosis</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.primaryDiagnosis} 
                  onChange={e => handleChange("primaryDiagnosis", e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode of RRT prior to KT</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.modeOfRRT} 
                    onChange={e => handleChange("modeOfRRT", e.target.value)}
                  >
                    <option value="">Select mode</option>
                    <option value="HD">HD</option>
                    <option value="PD">PD</option>
                    <option value="Pre-emptive">Pre-emptive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration of RRT prior to KT</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2 years"
                    value={form.durationRRT} 
                    onChange={e => handleChange("durationRRT", e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: KT Related Info */}
        {step === 3 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Transplantation Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Transplantation</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.ktDate} 
                    onChange={e => handleChange("ktDate", e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transplant Number</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transplant Unit</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.ktUnit} 
                    onChange={e => handleChange("ktUnit", e.target.value)}
                  >
                    <option value="">Select unit</option>
                    <option value="NHK">NHK</option>
                    <option value="THP">THP</option>
                    <option value="Other">Other</option>
                  </select>
                  {form.ktUnit === "Other" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.wardNumber} 
                        onChange={e => handleChange("wardNumber", e.target.value)} 
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transplant Surgeon</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.ktSurgeon} 
                    onChange={e => handleChange("ktSurgeon", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type of Transplant</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.ktType} 
                    onChange={e => handleChange("ktType", e.target.value)}
                  >
                    <option value="">Select type</option>
                    <option value="Live related">Live related</option>
                    <option value="Live unrelated">Live unrelated</option>
                    <option value="DDKT">Deceased Donor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donor Relationship</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Mother, Father, etc."
                    value={form.donorRelationship} 
                    onChange={e => handleChange("donorRelationship", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peritoneal Position</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.peritonealPosition} 
                    onChange={e => handleChange("peritonealPosition", e.target.value)}
                  >
                    <option value="">Select position</option>
                    <option value="Extraperitoneal">Extraperitoneal</option>
                    <option value="Intraperitoneal">Intraperitoneal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Side of Transplant</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.sideOfKT} 
                    onChange={e => handleChange("sideOfKT", e.target.value)}
                  >
                    <option value="">Select side</option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Immunological */}
        {step === 4 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Immunological Details
            </h2>
            <p className="text-gray-600 mb-6">Blood group, cross match, HLA typing, and immunological risk assessment</p>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Blood Group</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Donor</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter donor blood group"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter recipient blood group"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Cross Match</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">T Cell</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter T cell value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">B Cell</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter B cell value"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">HLA Typing</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">Type</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-A</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-B</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-C</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-DR</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-DP</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-DQ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Donor</td>
                        {["A", "B", "C", "DR", "DP", "DQ"].map((type) => (
                          <td key={type} className="border border-gray-300 p-2">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={type}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Recipient</td>
                        {["A", "B", "C", "DR", "DP", "DQ"].map((type) => (
                          <td key={type} className="border border-gray-300 p-2">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={type}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">PRA (Panel Reactive Antibodies)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pre (%)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter pre PRA percentage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Post (%)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter post PRA percentage"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">DSA (Donor Specific Antibodies)</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DSA Details</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter DSA details"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Immunological Risk</h4>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="recipientRiskLow"
                      name="immunologicalRisk"
                      value="low"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="recipientRiskLow" className="text-sm text-gray-700 cursor-pointer">Low</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="recipientRiskAverage"
                      name="immunologicalRisk"
                      value="average"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="recipientRiskAverage" className="text-sm text-gray-700 cursor-pointer">Average</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="recipientRiskHigh"
                      name="immunologicalRisk"
                      value="high"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="recipientRiskHigh" className="text-sm text-gray-700 cursor-pointer">High</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Immunosuppression */}
        {step === 5 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Immunosuppression Therapy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-Transplant Treatment</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.preKT} 
                  onChange={e => handleChange("preKT", e.target.value)}
                >
                  <option value="">Select treatment</option>
                  <option value="TPE">TPE</option>
                  <option value="IVIG">IVIG</option>
                  <option value="None">None</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Induction Therapy</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.inductionTherapy} 
                  onChange={e => handleChange("inductionTherapy", e.target.value)}
                >
                  <option value="">Select therapy</option>
                  <option value="Basiliximab">Basiliximab</option>
                  <option value="ATG">ATG</option>
                  <option value="Methylprednisolone">Methylprednisolone</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Therapy</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.maintenance} 
                  onChange={e => handleChange("maintenance", e.target.value)}
                >
                  <option value="">Select maintenance</option>
                  <option value="Pred">Pred</option>
                  <option value="MMF">MMF</option>
                  <option value="Tac">Tac</option>
                  <option value="Everolimus">Everolimus</option>
                </select>
                
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other (specify)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.maintenanceOther}
                    onChange={e => handleChange("maintenanceOther", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Prophylaxis */}
        {step === 6 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Prophylaxis</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Cotrimoxazole</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cotri-yes"
                        name="cotrimoxazole"
                        value="Yes"
                        checked={form.cotrimoxazole === "Yes"}
                        onChange={e => handleChange("cotrimoxazole", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="cotri-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cotri-no"
                        name="cotrimoxazole"
                        value="No"
                        checked={form.cotrimoxazole === "No"}
                        onChange={e => handleChange("cotrimoxazole", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="cotri-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                    </div>
                  </div>
                  
                  {form.cotrimoxazole === "Yes" && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.cotriDuration} 
                          onChange={e => handleChange("cotriDuration", e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Stopped</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.cotriStopped} 
                          onChange={e => handleChange("cotriStopped", e.target.value)} 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Valganciclovir</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="valgan-yes"
                        name="valganciclovir"
                        value="Yes"
                        checked={form.valganciclovir === "Yes"}
                        onChange={e => handleChange("valganciclovir", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="valgan-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="valgan-no"
                        name="valganciclovir"
                        value="No"
                        checked={form.valganciclovir === "No"}
                        onChange={e => handleChange("valganciclovir", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="valgan-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                    </div>
                  </div>
                  
                  {form.valganciclovir === "Yes" && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.valganDuration} 
                          onChange={e => handleChange("valganDuration", e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Stopped</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.valganStopped} 
                          onChange={e => handleChange("valganStopped", e.target.value)} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.vaccination} 
                  onChange={e => handleChange("vaccination", e.target.value)}
                >
                  <option value="">Select vaccination</option>
                  <option value="COVID">COVID</option>
                  <option value="Influenza">Influenza</option>
                  <option value="Pneumococcal">Pneumococcal</option>
                  <option value="Varicella">Varicella</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Pre-op */}
        {step === 7 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pre-Operative Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-operative Status</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={form.preOpStatus} 
                  onChange={e => handleChange("preOpStatus", e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-operative Preparation</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={form.preOpPreparation} 
                  onChange={e => handleChange("preOpPreparation", e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surgical Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={form.surgicalNotes} 
                  onChange={e => handleChange("surgicalNotes", e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Immediate Post KT */}
        {step === 8 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Immediate Post-Transplant Details</h2>
            <p className="text-gray-600 mb-6">Within the first week after transplantation</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pre-transplant Creatinine</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.preKTCreatinine} 
                    onChange={e => handleChange("preKTCreatinine", e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post-transplant Creatinine at Discharge</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.postKTCreatinine} 
                    onChange={e => handleChange("postKTCreatinine", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delayed Graft Function</label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="delayedGraft-yes"
                      name="delayedGraft"
                      value="Yes"
                      checked={form.delayedGraft === "Yes"}
                      onChange={e => handleChange("delayedGraft", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="delayedGraft-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="delayedGraft-no"
                      name="delayedGraft"
                      value="No"
                      checked={form.delayedGraft === "No"}
                      onChange={e => handleChange("delayedGraft", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="delayedGraft-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Post-transplant Dialysis Required</label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="postKTDialysis-yes"
                      name="postKTDialysis"
                      value="Yes"
                      checked={form.postKTDialysis === "Yes"}
                      onChange={e => handleChange("postKTDialysis", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="postKTDialysis-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="postKTDialysis-no"
                      name="postKTDialysis"
                      value="No"
                      checked={form.postKTDialysis === "No"}
                      onChange={e => handleChange("postKTDialysis", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="postKTDialysis-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Acute Rejection</label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="acuteRejection-yes"
                      name="acuteRejection"
                      value="Yes"
                      checked={form.acuteRejection === "Yes"}
                      onChange={e => handleChange("acuteRejection", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="acuteRejection-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="acuteRejection-no"
                      name="acuteRejection"
                      value="No"
                      checked={form.acuteRejection === "No"}
                      onChange={e => handleChange("acuteRejection", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="acuteRejection-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                  </div>
                </div>
                
                {form.acuteRejection === "Yes" && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Details</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.acuteRejectionDetails} 
                      onChange={e => handleChange("acuteRejectionDetails", e.target.value)} 
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Complications</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={form.otherComplications} 
                  onChange={e => handleChange("otherComplications", e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Surgery Complications */}
        {step === 9 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Surgery Complications</h2>
            <p className="text-gray-600 mb-6">List any post-transplant surgical complications</p>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complication {num}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form[`postKTComp${num}` as keyof KTFormData]} 
                    onChange={e => handleChange(`postKTComp${num}` as keyof KTFormData, e.target.value)} 
                    placeholder={`Enter complication #${num}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 10: Medication */}
        {step === 10 && (
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Pill className="w-6 h-6" />
                Current Medications
              </CardTitle>
              <CardDescription className="text-blue-100">
                Select and review current medications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentMeds" className="block text-sm font-medium text-gray-700 mb-1">Select Current Medications</Label>
                  <select 
                    id="currentMeds"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.currentMeds} 
                    onChange={e => handleChange("currentMeds", e.target.value)}
                  >
                    <option value="">Select medication</option>
                    <option value="Tacrolimus">Tacrolimus</option>
                    <option value="MMF">MMF</option>
                    <option value="Prednisolone">Prednisolone</option>
                    <option value="Everolimus">Everolimus</option>
                    <option value="Cyclosporine">Cyclosporine</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 11: Recommendations */}
        {step === 11 && (
          <Card className="shadow-lg border-0 bg-white mb-8">
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recommendations" className="block text-sm font-medium text-gray-700 mb-1">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    value={form.recommendations} 
                    onChange={e => handleChange("recommendations", e.target.value)} 
                    placeholder="Enter recommendations for ongoing management..."
                  />
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
                Save All Details
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