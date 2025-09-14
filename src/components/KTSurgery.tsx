import React, { useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
  "Introduction",
  "Medical History",
  "Pre-KT Details",
  "KT Related Info",
  "Immunological",
  "Immunosuppression",
  "Prophylaxis",
  "Pre-op",
  "Immediate Post KT",
  "Surgery Complications",
  "Medication",
  "Recommendations"
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
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-2 mb-6"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
      
      {/* Stepper */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{FORM_STEPS[step]}</h2>
        <div className="flex items-center gap-1 mb-2">
          {FORM_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 flex-1 rounded-full ${step === idx ? "bg-blue-600" : idx < step ? "bg-blue-400" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center">
          Step {step + 1} of {FORM_STEPS.length}
        </p>
      </div>

      {/* Step 0: Introduction */}
      {step === 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Patient Information</CardTitle>
            <CardDescription>Enter the patient's basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  value={form.name} 
                  onChange={e => handleChange("name", e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input 
                  id="contact" 
                  value={form.contact} 
                  onChange={e => handleChange("contact", e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input 
                  id="dob" 
                  type="date" 
                  value={form.dob} 
                  onChange={e => handleChange("dob", e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age at Referral (years) *</Label>
                <Input 
                  id="age" 
                  type="number" 
                  min={0} 
                  value={form.age} 
                  onChange={e => handleChange("age", e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gender *</Label>
                <RadioGroup 
                  value={form.gender} 
                  onValueChange={val => handleChange("gender", val)} 
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={form.address} 
                onChange={e => handleChange("address", e.target.value)} 
                rows={3} 
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Medical History */}
      {step === 1 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Medical History</CardTitle>
            <CardDescription>Select all applicable conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id="diabetes"
                  checked={form.diabetes === "true"}
                  onCheckedChange={(checked) => handleChange("diabetes", checked ? "true" : "false")}
                />
                <Label htmlFor="diabetes" className="cursor-pointer flex-1">Diabetes</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id="hypertension"
                  checked={form.hypertension === "true"}
                  onCheckedChange={(checked) => handleChange("hypertension", checked ? "true" : "false")}
                />
                <Label htmlFor="hypertension" className="cursor-pointer flex-1">Hypertension</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id="ihd"
                  checked={form.ihd === "true"}
                  onCheckedChange={(checked) => handleChange("ihd", checked ? "true" : "false")}
                />
                <Label htmlFor="ihd" className="cursor-pointer flex-1">IHD</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id="dyslipidaemia"
                  checked={form.dyslipidaemia === "true"}
                  onCheckedChange={(checked) => handleChange("dyslipidaemia", checked ? "true" : "false")}
                />
                <Label htmlFor="dyslipidaemia" className="cursor-pointer flex-1">Dyslipidaemia</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id="other"
                  checked={form.other === "true"}
                  onCheckedChange={(checked) => handleChange("other", checked ? "true" : "false")}
                />
                <Label htmlFor="other" className="cursor-pointer flex-1">Other</Label>
              </div>
            </div>
            
            {form.other === "true" && (
              <div className="space-y-2">
                <Label htmlFor="otherSpecify">Please specify other conditions</Label>
                <Input
                  id="otherSpecify"
                  value={form.otherSpecify}
                  onChange={(e) => handleChange("otherSpecify", e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Pre-KT Details */}
      {step === 2 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Pre-Transplant Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primaryDiagnosis">Primary Renal Diagnosis</Label>
              <Input 
                id="primaryDiagnosis" 
                value={form.primaryDiagnosis} 
                onChange={e => handleChange("primaryDiagnosis", e.target.value)} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="modeOfRRT">Mode of RRT prior to KT</Label>
                <Select value={form.modeOfRRT} onValueChange={val => handleChange("modeOfRRT", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="PD">PD</SelectItem>
                    <SelectItem value="Pre-emptive">Pre-emptive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="durationRRT">Duration of RRT prior to KT</Label>
                <Input 
                  id="durationRRT" 
                  value={form.durationRRT} 
                  onChange={e => handleChange("durationRRT", e.target.value)} 
                  placeholder="e.g. 2 years" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: KT Related Info */}
      {step === 3 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Transplantation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ktDate">Date of Transplantation</Label>
                <Input 
                  id="ktDate" 
                  type="date" 
                  value={form.ktDate} 
                  onChange={e => handleChange("ktDate", e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfKT">Transplant Number</Label>
                <Select value={form.numberOfKT} onValueChange={val => handleChange("numberOfKT", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Transplant</SelectItem>
                    <SelectItem value="2">2nd Transplant</SelectItem>
                    <SelectItem value="3">3rd Transplant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ktUnit">Transplant Unit</Label>
                <Select value={form.ktUnit} onValueChange={val => handleChange("ktUnit", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NHK">NHK</SelectItem>
                    <SelectItem value="THP">THP</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.ktUnit === "Other" && (
                  <div className="mt-2 space-y-2">
                    <Label htmlFor="wardNumber">Ward Number</Label>
                    <Input 
                      id="wardNumber" 
                      value={form.wardNumber} 
                      onChange={e => handleChange("wardNumber", e.target.value)} 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ktSurgeon">Transplant Surgeon</Label>
                <Input 
                  id="ktSurgeon" 
                  value={form.ktSurgeon} 
                  onChange={e => handleChange("ktSurgeon", e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ktType">Type of Transplant</Label>
                <Select value={form.ktType} onValueChange={val => handleChange("ktType", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Live related">Live related</SelectItem>
                    <SelectItem value="Live unrelated">Live unrelated</SelectItem>
                    <SelectItem value="DDKT">Deceased Donor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="donorRelationship">Donor Relationship</Label>
                <Input 
                  id="donorRelationship" 
                  value={form.donorRelationship} 
                  onChange={e => handleChange("donorRelationship", e.target.value)} 
                  placeholder="e.g. Mother, Father, etc." 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="peritonealPosition">Peritoneal Position</Label>
                <Select value={form.peritonealPosition} onValueChange={val => handleChange("peritonealPosition", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Extraperitoneal">Extraperitoneal</SelectItem>
                    <SelectItem value="Intraperitoneal">Intraperitoneal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sideOfKT">Side of Transplant</Label>
                <Select value={form.sideOfKT} onValueChange={val => handleChange("sideOfKT", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Right">Right</SelectItem>
                    <SelectItem value="Left">Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Immunological */}
      {step === 4 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Immunological Details
            </CardTitle>
            <CardDescription>Blood group, cross match, HLA typing, and immunological risk assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Blood Group</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientBloodGroupD">Donor</Label>
                  <Input id="recipientBloodGroupD" placeholder="Enter donor blood group" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientBloodGroupR">Recipient</Label>
                  <Input id="recipientBloodGroupR" placeholder="Enter recipient blood group" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Cross Match</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientTCell">T Cell</Label>
                  <Input id="recipientTCell" placeholder="Enter T cell value" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientBCell">B Cell</Label>
                  <Input id="recipientBCell" placeholder="Enter B cell value" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg">HLA Typing</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-medium">Type</th>
                      <th className="border border-border p-3 text-left font-medium">HLA-A</th>
                      <th className="border border-border p-3 text-left font-medium">HLA-B</th>
                      <th className="border border-border p-3 text-left font-medium">HLA-C</th>
                      <th className="border border-border p-3 text-left font-medium">HLA-DR</th>
                      <th className="border border-border p-3 text-left font-medium">HLA-DP</th>
                      <th className="border border-border p-3 text-left font-medium">HLA-DQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">Donor</td>
                      {["A", "B", "C", "DR", "DP", "DQ"].map((type) => (
                        <td key={type} className="border border-border p-2">
                          <Input placeholder={type} className="w-full" />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">Recipient</td>
                      {["A", "B", "C", "DR", "DP", "DQ"].map((type) => (
                        <td key={type} className="border border-border p-2">
                          <Input placeholder={type} className="w-full" />
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
                <div className="space-y-2">
                  <Label htmlFor="recipientPraPre">Pre (%)</Label>
                  <Input id="recipientPraPre" placeholder="Enter pre PRA percentage" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientPraPost">Post (%)</Label>
                  <Input id="recipientPraPost" placeholder="Enter post PRA percentage" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg">DSA (Donor Specific Antibodies)</h4>
              <div className="space-y-2">
                <Label htmlFor="recipientDsa">DSA Details</Label>
                <Input id="recipientDsa" placeholder="Enter DSA details" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Immunological Risk</h4>
              <RadioGroup className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="recipientRiskLow" />
                  <Label htmlFor="recipientRiskLow" className="cursor-pointer">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="average" id="recipientRiskAverage" />
                  <Label htmlFor="recipientRiskAverage" className="cursor-pointer">Average</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="recipientRiskHigh" />
                  <Label htmlFor="recipientRiskHigh" className="cursor-pointer">High</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Immunosuppression */}
      {step === 5 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Immunosuppression Therapy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Pre-Transplant Treatment</Label>
              <Select value={form.preKT} onValueChange={val => handleChange("preKT", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select treatment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TPE">TPE</SelectItem>
                  <SelectItem value="IVIG">IVIG</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Induction Therapy</Label>
              <Select value={form.inductionTherapy} onValueChange={val => handleChange("inductionTherapy", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select therapy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basiliximab">Basiliximab</SelectItem>
                  <SelectItem value="ATG">ATG</SelectItem>
                  <SelectItem value="Methylprednisolone">Methylprednisolone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Maintenance Therapy</Label>
              <Select value={form.maintenance} onValueChange={val => handleChange("maintenance", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pred">Pred</SelectItem>
                  <SelectItem value="MMF">MMF</SelectItem>
                  <SelectItem value="Tac">Tac</SelectItem>
                  <SelectItem value="Everolimus">Everolimus</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-2 space-y-2">
                <Label htmlFor="maintenanceOther">Other (specify)</Label>
                <Input
                  id="maintenanceOther"
                  value={form.maintenanceOther}
                  onChange={e => handleChange("maintenanceOther", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Prophylaxis */}
      {step === 6 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Prophylaxis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Cotrimoxazole</h4>
                <RadioGroup value={form.cotrimoxazole} onValueChange={val => handleChange("cotrimoxazole", val)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="cotri-yes" />
                    <Label htmlFor="cotri-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="cotri-no" />
                    <Label htmlFor="cotri-no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
                
                {form.cotrimoxazole === "Yes" && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cotriDuration">Duration</Label>
                      <Input 
                        id="cotriDuration" 
                        value={form.cotriDuration} 
                        onChange={e => handleChange("cotriDuration", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cotriStopped">Date Stopped</Label>
                      <Input 
                        id="cotriStopped" 
                        type="date"
                        value={form.cotriStopped} 
                        onChange={e => handleChange("cotriStopped", e.target.value)} 
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Valganciclovir</h4>
                <RadioGroup value={form.valganciclovir} onValueChange={val => handleChange("valganciclovir", val)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="valgan-yes" />
                    <Label htmlFor="valgan-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="valgan-no" />
                    <Label htmlFor="valgan-no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
                
                {form.valganciclovir === "Yes" && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="valganDuration">Duration</Label>
                      <Input 
                        id="valganDuration" 
                        value={form.valganDuration} 
                        onChange={e => handleChange("valganDuration", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valganStopped">Date Stopped</Label>
                      <Input 
                        id="valganStopped" 
                        type="date"
                        value={form.valganStopped} 
                        onChange={e => handleChange("valganStopped", e.target.value)} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vaccination">Vaccination</Label>
              <Select value={form.vaccination} onValueChange={val => handleChange("vaccination", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vaccination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COVID">COVID</SelectItem>
                  <SelectItem value="Influenza">Influenza</SelectItem>
                  <SelectItem value="Pneumococcal">Pneumococcal</SelectItem>
                  <SelectItem value="Varicella">Varicella</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 7: Pre-op */}
      {step === 7 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Pre-Operative Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="preOpStatus">Pre-operative Status</Label>
              <Textarea 
                id="preOpStatus"
                value={form.preOpStatus} 
                onChange={e => handleChange("preOpStatus", e.target.value)} 
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preOpPreparation">Pre-operative Preparation</Label>
              <Textarea 
                id="preOpPreparation"
                value={form.preOpPreparation} 
                onChange={e => handleChange("preOpPreparation", e.target.value)} 
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="surgicalNotes">Surgical Notes</Label>
              <Textarea 
                id="surgicalNotes"
                value={form.surgicalNotes} 
                onChange={e => handleChange("surgicalNotes", e.target.value)} 
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 8: Immediate Post KT */}
      {step === 8 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Immediate Post-Transplant Details</CardTitle>
            <CardDescription>Within the first week after transplantation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preKTCreatinine">Pre-transplant Creatinine</Label>
                <Input 
                  id="preKTCreatinine"
                  value={form.preKTCreatinine} 
                  onChange={e => handleChange("preKTCreatinine", e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postKTCreatinine">Post-transplant Creatinine at Discharge</Label>
                <Input 
                  id="postKTCreatinine"
                  value={form.postKTCreatinine} 
                  onChange={e => handleChange("postKTCreatinine", e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Delayed Graft Function</Label>
              <RadioGroup value={form.delayedGraft} onValueChange={val => handleChange("delayedGraft", val)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="delayedGraft-yes" />
                  <Label htmlFor="delayedGraft-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="delayedGraft-no" />
                  <Label htmlFor="delayedGraft-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <Label>Post-transplant Dialysis Required</Label>
              <RadioGroup value={form.postKTDialysis} onValueChange={val => handleChange("postKTDialysis", val)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="postKTDialysis-yes" />
                  <Label htmlFor="postKTDialysis-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="postKTDialysis-no" />
                  <Label htmlFor="postKTDialysis-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <Label>Acute Rejection</Label>
              <RadioGroup value={form.acuteRejection} onValueChange={val => handleChange("acuteRejection", val)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="acuteRejection-yes" />
                  <Label htmlFor="acuteRejection-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="acuteRejection-no" />
                  <Label htmlFor="acuteRejection-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
              
              {form.acuteRejection === "Yes" && (
                <div className="mt-2 space-y-2">
                  <Label htmlFor="acuteRejectionDetails">Rejection Details</Label>
                  <Input 
                    id="acuteRejectionDetails"
                    value={form.acuteRejectionDetails} 
                    onChange={e => handleChange("acuteRejectionDetails", e.target.value)} 
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherComplications">Other Complications</Label>
              <Textarea 
                id="otherComplications"
                value={form.otherComplications} 
                onChange={e => handleChange("otherComplications", e.target.value)} 
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 9: Surgery Complications */}
      {step === 9 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Surgery Complications</CardTitle>
            <CardDescription>List any post-transplant surgical complications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="space-y-2">
                <Label htmlFor={`postKTComp${num}`}>Complication {num}</Label>
                <Input 
                  id={`postKTComp${num}`}
                  value={form[`postKTComp${num}` as keyof KTFormData]} 
                  onChange={e => handleChange(`postKTComp${num}` as keyof KTFormData, e.target.value)} 
                  placeholder={`Enter complication #${num}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 10: Medication */}
      {step === 10 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="currentMeds">Select Current Medications</Label>
              <Select value={form.currentMeds} onValueChange={val => handleChange("currentMeds", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tacrolimus">Tacrolimus</SelectItem>
                  <SelectItem value="MMF">MMF</SelectItem>
                  <SelectItem value="Prednisolone">Prednisolone</SelectItem>
                  <SelectItem value="Everolimus">Everolimus</SelectItem>
                  <SelectItem value="Cyclosporine">Cyclosporine</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 11: Recommendations */}
      {step === 11 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Management Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea 
                id="recommendations"
                value={form.recommendations} 
                onChange={e => handleChange("recommendations", e.target.value)} 
                rows={5}
                className="resize-none"
                placeholder="Enter recommendations for ongoing management..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep} 
          disabled={step === 0}
          className="min-w-[100px]"
        >
          Previous
        </Button>
        
        <div className="text-sm text-gray-500">
          Step {step + 1} of {FORM_STEPS.length}
        </div>
        
        {step < FORM_STEPS.length - 1 ? (
          <Button 
            type="button" 
            onClick={nextStep}
            className="min-w-[100px]"
          >
            Next
          </Button>
        ) : (
          <Button 
            type="submit" 
            className="min-w-[150px] bg-green-600 hover:bg-green-700"
          >
            Save All Details
          </Button>
        )}
      </div>
    </form>
  );
};

export default KTForm;