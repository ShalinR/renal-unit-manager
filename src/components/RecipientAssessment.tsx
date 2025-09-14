import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, UserCheck, Activity, Save, ArrowLeft, Pill, Users, ClipboardList } from "lucide-react";
import { ActiveView } from '../pages/KidneyTransplant'; // or from your types file

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
  relationToRecipient: string;
  relationType: string;
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

// Add the missing props interface
export interface RecipientAssessmentProps {
  recipientForm: RecipientAssessmentForm;
  setRecipientForm: React.Dispatch<React.SetStateAction<RecipientAssessmentForm>>;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
  handleRecipientFormChange: (field: string, value: any) => void;
  handleRecipientFormSubmit: (e: React.FormEvent) => void;
}

const FORM_STEPS = [
  "Personal Info",
  "Relationship",
  "Comorbidities",
  "RRT Details",
  "Transfusion History",
  "Immunological",
  "Confirmation"
];

const RecipientAssessment: React.FC<RecipientAssessmentProps> = ({
  recipientForm,
  setRecipientForm,
  setActiveView,
  handleRecipientFormChange,
  handleRecipientFormSubmit,
}) => {
  const [step, setStep] = useState(0);

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
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setActiveView("dashboard")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      {/* Stepper Progress Bar */}
      <div className="flex items-center gap-2 mb-4">
        {FORM_STEPS.map((label, idx) => (
          <div key={label} className={`flex-1 text-center py-2 rounded ${step === idx ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
            {label}
          </div>
        ))}
      </div>

      <form onSubmit={handleRecipientFormSubmit} className="space-y-6">
        {/* Step 0: Personal Info */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
  {/* First Row: Name and Age */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col space-y-1 md:space-y-2 w-full">
      <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
      <Input
        id="name"
        value={recipientForm.name}
        onChange={(e) => handleNestedChange("name", e.target.value)}
        placeholder="Enter full name"
        className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
        required
      />
    </div>

    <div className="flex flex-col space-y-1 md:space-y-2 w-full">
      <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
      <Input
        id="age"
        type="number"
        value={recipientForm.age}
        onChange={(e) => handleNestedChange("age", e.target.value)}
        placeholder="Enter age"
        className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
        required
      />
    </div>
  </div>

  {/* Second Row: NIC and Gender */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col space-y-1 md:space-y-2 w-full">
      <Label htmlFor="nicNo" className="text-sm font-medium">NIC Number *</Label>
      <Input
        id="nicNo"
        value={recipientForm.nicNo}
        onChange={(e) => handleNestedChange("nicNo", e.target.value)}
        placeholder="Enter NIC number"
        className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
        required
      />
    </div>

    <div className="flex flex-col space-y-1 md:space-y-2 w-full">
      <Label htmlFor="recipientGender" className="text-sm font-medium">Gender *</Label>
      <RadioGroup className="flex gap-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="recipientMale" />
          <Label htmlFor="recipientMale">Male</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="recipientFemale" />
          <Label htmlFor="recipientFemale">Female</Label>
        </div>
      </RadioGroup>
    </div>
  </div>

  {/* Third Row: Date of Birth and Occupation */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col space-y-1 md:space-y-2 w-full">
      <Label htmlFor="recipientDOB" className="text-sm font-medium">Date of Birth *</Label>
      <Input
        id="recipientDOB"
        placeholder="dd/mm/yyyy"
        required
        className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
      />
    </div>

    <div className="flex flex-col space-y-1 md:space-y-2 w-full">
      <Label htmlFor="recipientOccupation" className="text-sm font-medium">Occupation *</Label>
      <Input
        id="recipientOccupation"
        placeholder="Enter occupation"
        required
        className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
      />
    </div>
  </div>

  {/* Address */}
  <div className="flex flex-col space-y-1 md:space-y-2 w-full">
    <Label htmlFor="recipientAddress" className="text-sm font-medium">Address *</Label>
    <Textarea
      id="recipientAddress"
      placeholder="Enter complete address"
      rows={3}
      required
      className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
    />
  </div>

  {/* Contact Info */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col space-y-1 md:space-y-2 w-full">
      <Label htmlFor="recipientContact" className="text-sm font-medium">Contact Number *</Label>
      <Input
        id="recipientContact"
        placeholder="Enter phone number"
        required
        className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
      />
    </div>

    <div className="flex flex-col space-y-1 md:space-y-2 w-full">
      <Label htmlFor="recipientEmail" className="text-sm font-medium">Email Address</Label>
      <Input
        id="recipientEmail"
        type="email"
        placeholder="Enter email address"
        className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
      />
    </div>
  </div>
</CardContent>
          </Card>
        )}
        {/* Step 1: Relationship */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Relationship Information
              </CardTitle>
              <CardDescription>Recipient's relationship to the donor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Relation Type *</Label>
                <RadioGroup className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="related" id="recipientRelated" />
                    <Label htmlFor="recipientRelated">Related</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unrelated" id="recipientUnrelated" />
                    <Label htmlFor="recipientUnrelated">Unrelated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="altruistic" id="recipientAltruistic" />
                    <Label htmlFor="recipientAltruistic">Altruistic</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientRelation">Relation</Label>
                <Input id="recipientRelation" placeholder="e.g., Brother, Sister, Friend, etc." />
              </div>
            </CardContent>
          </Card>
        )}
        {/* Step 2: Comorbidities */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Comorbidities
              </CardTitle>
              <CardDescription>Comorbidities and medical conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientDMDuration">Duration</Label>
                  <Input id="recipientDMDuration" placeholder="Duration" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="recipientDM" />
                  <Label htmlFor="recipientDM">Diabetes Mellitus (DM)</Label>
                </div>
                
              </div>
              <div className="space-y-2">
                <Label>Microvascular</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recipientRetinopathy" />
                    <Label htmlFor="recipientRetinopathy">Retinopathy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recipientNephropathy" />
                    <Label htmlFor="recipientNephropathy">Nephropathy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recipientNeuropathy" />
                    <Label htmlFor="recipientNeuropathy">Neuropathy</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Macrovascular</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recipientIHD" />
                    <Label htmlFor="recipientIHD">IHD</Label>
                    <Input id="recipient2DEcho" placeholder="2D-Echo" />
                    <Input id="recipientCoronary" placeholder="Coronary Organogram" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recipientCVA" />
                    <Label htmlFor="recipientCVA">CVA</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recipientPVD" />
                    <Label htmlFor="recipientPVD">PVD</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="recipientDL" />
                  <Label htmlFor="recipientDL">DL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="recipientHTN" />
                  <Label htmlFor="recipientHTN">HTN</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="recipientCLCD" />
                  <Label htmlFor="recipientCLCD">CLCD</Label>
                  <Input id="recipientChildClass" placeholder="Child Class" />
                  <Input id="recipientMELD" placeholder="MELD Score" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="recipientCVA2" />
                  <Label htmlFor="recipientCVA2">CVA</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="recipientHF" />
                  <Label htmlFor="recipientHF">HF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="recipientPsychiatric" />
                  <Label htmlFor="recipientPsychiatric">Psychiatric Illness</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Step 3: RRT Details */}
        {step === 3 && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="w-5 h-5" />
        RRT Details
      </CardTitle>
      <CardDescription>Renal replacement therapy details</CardDescription>
    </CardHeader>

    <CardContent className="space-y-6">
      {/* Modality */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Modality</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="recipientHD"
            placeholder="HD"
            className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
          />
          <Input
            id="recipientCAPD"
            placeholder="CAPD"
            className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Starting Date */}
      <div className="space-y-2">
        <Label htmlFor="recipientRRTStart" className="text-sm font-medium">Starting Date</Label>
        <Input
          id="recipientRRTStart"
          placeholder="dd/mm/yyyy"
          className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
        />
      </div>

      {/* Access */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Access</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="recipientFemoral"
            placeholder="Femoral"
            className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
          />
          <Input
            id="recipientIJC"
            placeholder="IJC"
            className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
          />
          <Input
            id="recipientPermcath"
            placeholder="Permcath"
            className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
          />
          <Input
            id="recipientCAPDAccess"
            placeholder="CAPD"
            className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Complications */}
      <div className="space-y-2">
        <Label htmlFor="recipientRRTComplications" className="text-sm font-medium">Complications</Label>
        <Textarea
          id="recipientRRTComplications"
          placeholder="Describe complications..."
          rows={3}
          className="px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
        />
      </div>
    </CardContent>
  </Card>
)}

        {/* Step 4: Transfusion History */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Transfusion History
              </CardTitle>
              <CardDescription>History of blood transfusions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left font-medium">#</th>
                      <th className="border border-border p-2 text-left font-medium">Date</th>
                      <th className="border border-border p-2 text-left font-medium">Indication</th>
                      <th className="border border-border p-2 text-left font-medium">Volume</th>
                      <th className="border border-border p-2 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfusions.map((row, idx) => (
                      <tr key={idx}>
                        <td className="border border-border p-1 text-sm">{idx + 1}</td>
                        <td className="border border-border p-1">
                          <Input
                            placeholder="dd/mm/yyyy"
                            value={row.date}
                            onChange={(e) => handleTransfusionChange(idx, "date", e.target.value)}
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            placeholder="Indication"
                            value={row.indication}
                            onChange={(e) => handleTransfusionChange(idx, "indication", e.target.value)}
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            placeholder="Volume"
                            value={row.volume}
                            onChange={(e) => handleTransfusionChange(idx, "volume", e.target.value)}
                          />
                        </td>
                        <td className="border border-border p-1 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => removeTransfusion(idx)}>Remove</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-2">
                <Button type="button" onClick={addTransfusion}>Add Row</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Step 5: Immunological */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Immunological Details
              </CardTitle>
              <CardDescription>Blood group, cross match, HLA typing, and immunological risk assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Blood Group</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientBloodGroupD">D</Label>
                    <Input id="recipientBloodGroupD" placeholder="Enter D value" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientBloodGroupR">R</Label>
                    <Input id="recipientBloodGroupR" placeholder="Enter R value" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Cross Match</h4>
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
                <h4 className="font-medium">HLA Typing</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left font-medium">Type</th>
                        <th className="border border-border p-2 text-left font-medium">HLA-A</th>
                        <th className="border border-border p-2 text-left font-medium">HLA-B</th>
                        <th className="border border-border p-2 text-left font-medium">HLA-C</th>
                        <th className="border border-border p-2 text-left font-medium">HLA-DR</th>
                        <th className="border border-border p-2 text-left font-medium">HLA-DP</th>
                        <th className="border border-border p-2 text-left font-medium">HLA-DQ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-2 font-medium">Donor</td>
                        <td className="border border-border p-1"><Input placeholder="A" /></td>
                        <td className="border border-border p-1"><Input placeholder="B" /></td>
                        <td className="border border-border p-1"><Input placeholder="C" /></td>
                        <td className="border border-border p-1"><Input placeholder="DR" /></td>
                        <td className="border border-border p-1"><Input placeholder="DP" /></td>
                        <td className="border border-border p-1"><Input placeholder="DQ" /></td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-medium">Recipient</td>
                        <td className="border border-border p-1"><Input placeholder="A" /></td>
                        <td className="border border-border p-1"><Input placeholder="B" /></td>
                        <td className="border border-border p-1"><Input placeholder="C" /></td>
                        <td className="border border-border p-1"><Input placeholder="DR" /></td>
                        <td className="border border-border p-1"><Input placeholder="DP" /></td>
                        <td className="border border-border p-1"><Input placeholder="DQ" /></td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-medium">Conclusion</td>
                        <td className="border border-border p-1"><Input placeholder="A" /></td>
                        <td className="border border-border p-1"><Input placeholder="B" /></td>
                        <td className="border border-border p-1"><Input placeholder="C" /></td>
                        <td className="border border-border p-1"><Input placeholder="DR" /></td>
                        <td className="border border-border p-1"><Input placeholder="DP" /></td>
                        <td className="border border-border p-1"><Input placeholder="DQ" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">PRA (Panel Reactive Antibodies)</h4>
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
                <h4 className="font-medium">DSA (Donor Specific Antibodies)</h4>
                <div className="space-y-2">
                  <Label htmlFor="recipientDsa">DSA</Label>
                  <Input id="recipientDsa" placeholder="Enter DSA details" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Immunological Risk</h4>
                <RadioGroup className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="recipientRiskLow" />
                    <Label htmlFor="recipientRiskLow">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="recipientRiskAverage" />
                    <Label htmlFor="recipientRiskAverage">Average</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="recipientRiskHigh" />
                    <Label htmlFor="recipientRiskHigh">High</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Step 6: Confirmation */}
        {step === 6 && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="recipientFilledBy">Filled By</Label>
              <Input id="recipientFilledBy" placeholder="Enter your name or staff ID" required />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="recipientFinalCheck" />
              <Label htmlFor="recipientFinalCheck">I confirm all information provided is accurate</Label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
            Previous
          </Button>
          {step < FORM_STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Assessment
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecipientAssessment;