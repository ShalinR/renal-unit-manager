import React from "react";
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

const RecipientAssessment: React.FC<RecipientAssessmentProps> = ({
  recipientForm,
  setRecipientForm,
  setActiveView,
  handleRecipientFormChange,
  handleRecipientFormSubmit,
}) => {
  // Helper function to handle nested object changes
  const handleNestedChange = (path: string, value: any) => {
    handleRecipientFormChange(path, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Recipient Assessment</h2>
          <p className="text-muted-foreground">Complete recipient evaluation form</p>
        </div>
      </div>

      <form onSubmit={handleRecipientFormSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={recipientForm.name}
                  onChange={(e) => handleNestedChange("name", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={recipientForm.age}
                  onChange={(e) => handleNestedChange("age", e.target.value)}
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={recipientForm.gender}
                  onChange={(e) => handleNestedChange("gender", e.target.value)}
                  placeholder="Enter gender"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nicNo">NIC Number</Label>
                <Input
                  id="nicNo"
                  value={recipientForm.nicNo}
                  onChange={(e) => handleNestedChange("nicNo", e.target.value)}
                  placeholder="Enter NIC number"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Basic recipient information and contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Name *</Label>
                      <Input id="recipientName" placeholder="Enter full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientAge">Age *</Label>
                      <Input id="recipientAge" type="number" placeholder="Enter age" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientGender">Gender *</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="recipientDOB">Date of Birth *</Label>
                      <Input id="recipientDOB" placeholder="dd/mm/yyyy" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientOccupation">Occupation *</Label>
                    <Input id="recipientOccupation" placeholder="Enter occupation" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientAddress">Address *</Label>
                    <Textarea id="recipientAddress" placeholder="Enter complete address" rows={3} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientNIC">NIC No *</Label>
                      <Input id="recipientNIC" placeholder="Enter NIC number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientContact">Contact Details *</Label>
                      <Input id="recipientContact" placeholder="Enter phone number" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Email Address</Label>
                    <Input id="recipientEmail" type="email" placeholder="Enter email address" />
                  </div>
                </CardContent>
              </Card>

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
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recipientDM" />
                      <Label htmlFor="recipientDM">Diabetes Mellitus (DM)</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientDMDuration">Duration</Label>
                      <Input id="recipientDMDuration" placeholder="Duration" />
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    RRT Details
                  </CardTitle>
                  <CardDescription>Renal replacement therapy details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Modality</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input id="recipientHD" placeholder="HD" />
                      <Input id="recipientCAPD" placeholder="CAPD" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientRRTStart">Starting Date</Label>
                    <Input id="recipientRRTStart" placeholder="dd/mm/yyyy" />
                  </div>
                  <div className="space-y-2">
                    <Label>Access</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input id="recipientFemoral" placeholder="Femoral" />
                      <Input id="recipientIJC" placeholder="IJC" />
                      <Input id="recipientPermcath" placeholder="Permcath" />
                      <Input id="recipientCAPDAccess" placeholder="CAPD" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientRRTComplications">Complications</Label>
                    <Textarea id="recipientRRTComplications" placeholder="Describe complications..." rows={3} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Transfusion History
                  </CardTitle>
                  <CardDescription>History of blood transfusions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left font-medium">Date</th>
                        <th className="border border-border p-2 text-left font-medium">Indication for Transfusions</th>
                        <th className="border border-border p-2 text-left font-medium">Volume of Transfusion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-1"><Input placeholder="dd/mm/yyyy" /></td>
                        <td className="border border-border p-1"><Input placeholder="Indication" /></td>
                        <td className="border border-border p-1"><Input placeholder="Volume" /></td>
                      </tr>
                      {/* Add more rows as needed */}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Immunological Details Section for Recipient Assessment */}
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
              {/* Filled By and Confirmation for Recipient Assessment */}
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
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setActiveView('dashboard')}>Cancel</Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Assessment
                </Button>
              </div>
        
      </form>
    </div>
  );
};

export default RecipientAssessment;