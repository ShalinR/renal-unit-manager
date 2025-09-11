import React, { useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface FollowUpFormData {
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

interface FollowUpFormProps {
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
}

const initialForm: FollowUpFormData = {
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

const FollowUpForm: React.FC<FollowUpFormProps> = ({ setActiveView }) => {
  const [form, setForm] = useState<FollowUpFormData>(initialForm);

  const handleChange = (field: keyof FollowUpFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save or process form data here
    alert("Follow Up form submitted!");
    // Optionally reset form or navigate
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-2 mb-4"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      {/* 1. Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={e => handleChange("name", e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={form.dob} onChange={e => handleChange("dob", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="age">Age at referral (years)</Label>
              <Input id="age" type="number" min={0} value={form.age} onChange={e => handleChange("age", e.target.value)} required />
            </div>
            <div>
              <Label>Gender</Label>
              <RadioGroup value={form.gender} onValueChange={val => handleChange("gender", val)} className="flex gap-4">
                <RadioGroupItem value="Male" id="male" />
                <Label htmlFor="male">Male</Label>
                <RadioGroupItem value="Female" id="female" />
                <Label htmlFor="female">Female</Label>
              </RadioGroup>
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={form.address} onChange={e => handleChange("address", e.target.value)} rows={2} />
          </div>
          <div>
            <Label htmlFor="contact">Contact No</Label>
            <Input id="contact" value={form.contact} onChange={e => handleChange("contact", e.target.value)} />
          </div>
        </CardContent>
      </Card>
      {/* 2. Background medical history */}
      <Card>
        <CardHeader>
          <CardTitle>Background Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Diabetes</Label>
              <RadioGroup value={form.diabetes} onValueChange={val => handleChange("diabetes", val)} className="flex gap-2">
                <RadioGroupItem value="yes" id="diabetes-yes" />
                <Label htmlFor="diabetes-yes">Yes</Label>
                <RadioGroupItem value="no" id="diabetes-no" />
                <Label htmlFor="diabetes-no">No</Label>
              </RadioGroup>
            </div>
            <div>
              <Label>Hypertension</Label>
              <RadioGroup value={form.hypertension} onValueChange={val => handleChange("hypertension", val)} className="flex gap-2">
                <RadioGroupItem value="yes" id="htn-yes" />
                <Label htmlFor="htn-yes">Yes</Label>
                <RadioGroupItem value="no" id="htn-no" />
                <Label htmlFor="htn-no">No</Label>
              </RadioGroup>
            </div>
            <div>
              <Label>IHD</Label>
              <RadioGroup value={form.ihd} onValueChange={val => handleChange("ihd", val)} className="flex gap-2">
                <RadioGroupItem value="yes" id="ihd-yes" />
                <Label htmlFor="ihd-yes">Yes</Label>
                <RadioGroupItem value="no" id="ihd-no" />
                <Label htmlFor="ihd-no">No</Label>
              </RadioGroup>
            </div>
            <div>
              <Label>Dyslipidaemia</Label>
              <RadioGroup value={form.dyslipidaemia} onValueChange={val => handleChange("dyslipidaemia", val)} className="flex gap-2">
                <RadioGroupItem value="yes" id="dl-yes" />
                <Label htmlFor="dl-yes">Yes</Label>
                <RadioGroupItem value="no" id="dl-no" />
                <Label htmlFor="dl-no">No</Label>
              </RadioGroup>
            </div>
            <div>
              <Label>Other</Label>
              <RadioGroup value={form.other} onValueChange={val => handleChange("other", val)} className="flex gap-2">
                <RadioGroupItem value="yes" id="other-yes" />
                <Label htmlFor="other-yes">Yes</Label>
                <RadioGroupItem value="no" id="other-no" />
                <Label htmlFor="other-no">No</Label>
              </RadioGroup>
              <Input name="otherSpecify" placeholder="Specify if yes" className="mt-2" value={form.otherSpecify} onChange={e => handleChange("otherSpecify", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* 3. Pre-KT details */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-KT Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primaryDiagnosis">Primary Renal Diagnosis</Label>
            <Input id="primaryDiagnosis" value={form.primaryDiagnosis} onChange={e => handleChange("primaryDiagnosis", e.target.value)} />
          </div>
          <div>
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
          <div>
            <Label htmlFor="durationRRT">Duration of RRT prior to KT</Label>
            <Input id="durationRRT" value={form.durationRRT} onChange={e => handleChange("durationRRT", e.target.value)} placeholder="e.g. 2 years" />
          </div>
        </CardContent>
      </Card>
      {/* 4. KT related information */}
      <Card>
        <CardHeader>
          <CardTitle>KT Related Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="ktDate">Date of KT</Label>
                <Input id="ktDate" type="date" value={form.ktDate} onChange={e => handleChange("ktDate", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="ktUnit">KT Unit</Label>
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
                <Input name="wardNumber" placeholder="Ward number (if Other)" className="mt-2" value={form.wardNumber} onChange={e => handleChange("wardNumber", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="ktType">Type of KT</Label>
                <Select value={form.ktType} onValueChange={val => handleChange("ktType", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Live related">Live related</SelectItem>
                    <SelectItem value="Live unrelated">Live unrelated</SelectItem>
                    <SelectItem value="DDKT">DDKT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
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
            </div>
            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="numberOfKT">Number of KT</Label>
                <Select value={form.numberOfKT} onValueChange={val => handleChange("numberOfKT", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ktSurgeon">KT Surgeon</Label>
                <Input id="ktSurgeon" value={form.ktSurgeon} onChange={e => handleChange("ktSurgeon", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="donorRelationship">Donor Relationship</Label>
                <Input id="donorRelationship" value={form.donorRelationship} onChange={e => handleChange("donorRelationship", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sideOfKT">Side of KT</Label>
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
          </div>
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
      {/* Immunosuppression */}
<Card>
  <CardHeader>
    <CardTitle>Immunosuppression</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>Pre KT</Label>
      <Select value={form.preKT} onValueChange={val => handleChange("preKT", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TPE">TPE</SelectItem>
          <SelectItem value="IVIG">IVIG</SelectItem>
          <SelectItem value="None">None</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Induction Therapy</Label>
      <Select value={form.inductionTherapy} onValueChange={val => handleChange("inductionTherapy", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Basiliximab">Basiliximab</SelectItem>
          <SelectItem value="ATG">ATG</SelectItem>
          <SelectItem value="Methylprednisolone">Methylprednisolone</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Maintenance</Label>
      <Select value={form.maintenance} onValueChange={val => handleChange("maintenance", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pred">Pred</SelectItem>
          <SelectItem value="MMF">MMF</SelectItem>
          <SelectItem value="Tac">Tac</SelectItem>
          <SelectItem value="Everolimus">Everolimus</SelectItem>
        </SelectContent>
      </Select>
      <Input
        className="mt-2"
        placeholder="Other (specify)"
        value={form.maintenanceOther}
        onChange={e => handleChange("maintenanceOther", e.target.value)}
      />
    </div>
  </CardContent>
</Card>

{/* Prophylaxis */}
<Card>
  <CardHeader>
    <CardTitle>Prophylaxis</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Cotrimoxazole</Label>
        <RadioGroup value={form.cotrimoxazole} onValueChange={val => handleChange("cotrimoxazole", val)} className="flex gap-4">
          <RadioGroupItem value="Yes" id="cotri-yes" />
          <Label htmlFor="cotri-yes">Yes</Label>
          <RadioGroupItem value="No" id="cotri-no" />
          <Label htmlFor="cotri-no">No</Label>
        </RadioGroup>
        <Input className="mt-2" placeholder="Duration" value={form.cotriDuration} onChange={e => handleChange("cotriDuration", e.target.value)} />
        <Input className="mt-2" placeholder="Date Stopped" value={form.cotriStopped} onChange={e => handleChange("cotriStopped", e.target.value)} />
      </div>
      <div>
        <Label>Valganciclovir</Label>
        <RadioGroup value={form.valganciclovir} onValueChange={val => handleChange("valganciclovir", val)} className="flex gap-4">
          <RadioGroupItem value="Yes" id="valgan-yes" />
          <Label htmlFor="valgan-yes">Yes</Label>
          <RadioGroupItem value="No" id="valgan-no" />
          <Label htmlFor="valgan-no">No</Label>
        </RadioGroup>
        <Input className="mt-2" placeholder="Duration" value={form.valganDuration} onChange={e => handleChange("valganDuration", e.target.value)} />
        <Input className="mt-2" placeholder="Date Stopped" value={form.valganStopped} onChange={e => handleChange("valganStopped", e.target.value)} />
      </div>
    </div>
    <div>
      <Label>Vaccination</Label>
      <Select value={form.vaccination} onValueChange={val => handleChange("vaccination", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
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

{/* Pre-op Section */}
<Card>
  <CardHeader>
    <CardTitle>Pre-op</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>Pre-op Status</Label>
      <Textarea value={form.preOpStatus} onChange={e => handleChange("preOpStatus", e.target.value)} />
    </div>
    <div>
      <Label>Pre-op Preparation</Label>
      <Textarea value={form.preOpPreparation} onChange={e => handleChange("preOpPreparation", e.target.value)} />
    </div>
    <div>
      <Label>Surgical Notes</Label>
      <Textarea value={form.surgicalNotes} onChange={e => handleChange("surgicalNotes", e.target.value)} />
    </div>
  </CardContent>
</Card>

{/* Immediate Post KT details */}
<Card>
  <CardHeader>
    <CardTitle>Immediate Post KT Details (within 1st week)</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>Pre KT Creatinine</Label>
      <Input value={form.preKTCreatinine} onChange={e => handleChange("preKTCreatinine", e.target.value)} />
    </div>
    <div>
      <Label>Post KT Creatinine at Discharge</Label>
      <Input value={form.postKTCreatinine} onChange={e => handleChange("postKTCreatinine", e.target.value)} />
    </div>
    <div>
      <Label>Delayed Graft Function</Label>
      <RadioGroup value={form.delayedGraft} onValueChange={val => handleChange("delayedGraft", val)} className="flex gap-4">
        <RadioGroupItem value="Yes" id="delayedGraft-yes" />
        <Label htmlFor="delayedGraft-yes">Yes</Label>
        <RadioGroupItem value="No" id="delayedGraft-no" />
        <Label htmlFor="delayedGraft-no">No</Label>
      </RadioGroup>
    </div>
    <div>
      <Label>Post KT Dialysis | PD</Label>
      <RadioGroup value={form.postKTDialysis} onValueChange={val => handleChange("postKTDialysis", val)} className="flex gap-4">
        <RadioGroupItem value="Yes" id="postKTDialysis-yes" />
        <Label htmlFor="postKTDialysis-yes">Yes</Label>
        <RadioGroupItem value="No" id="postKTDialysis-no" />
        <Label htmlFor="postKTDialysis-no">No</Label>
      </RadioGroup>
    </div>
    <div>
      <Label>Acute Rejection</Label>
      <RadioGroup value={form.acuteRejection} onValueChange={val => handleChange("acuteRejection", val)} className="flex gap-4">
        <RadioGroupItem value="Yes" id="acuteRejection-yes" />
        <Label htmlFor="acuteRejection-yes">Yes</Label>
        <RadioGroupItem value="No" id="acuteRejection-no" />
        <Label htmlFor="acuteRejection-no">No</Label>
      </RadioGroup>
      {form.acuteRejection === "Yes" && (
        <Input className="mt-2" placeholder="If Yes, details" value={form.acuteRejectionDetails} onChange={e => handleChange("acuteRejectionDetails", e.target.value)} />
      )}
    </div>
    <div>
      <Label>Other Complications</Label>
      <Textarea value={form.otherComplications} onChange={e => handleChange("otherComplications", e.target.value)} />
    </div>
  </CardContent>
</Card>

{/* Post KT Surgery Complications */}
<Card>
  <CardHeader>
    <CardTitle>Post KT Surgery Complications</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    <Input placeholder="Complication 1" value={form.postKTComp1} onChange={e => handleChange("postKTComp1", e.target.value)} />
    <Input placeholder="Complication 2" value={form.postKTComp2} onChange={e => handleChange("postKTComp2", e.target.value)} />
    <Input placeholder="Complication 3" value={form.postKTComp3} onChange={e => handleChange("postKTComp3", e.target.value)} />
    <Input placeholder="Complication 4" value={form.postKTComp4} onChange={e => handleChange("postKTComp4", e.target.value)} />
    <Input placeholder="Complication 5" value={form.postKTComp5} onChange={e => handleChange("postKTComp5", e.target.value)} />
    <Input placeholder="Complication 6" value={form.postKTComp6} onChange={e => handleChange("postKTComp6", e.target.value)} />
  </CardContent>
</Card>

{/* Current Medication List */}
<Card>
  <CardHeader>
    <CardTitle>Current Medication List</CardTitle>
  </CardHeader>
  <CardContent>
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
  </CardContent>
</Card>

{/* Recommendations for Management */}
<Card>
  <CardHeader>
    <CardTitle>Recommendations for Management</CardTitle>
  </CardHeader>
  <CardContent>
    <Textarea value={form.recommendations} onChange={e => handleChange("recommendations", e.target.value)} />
  </CardContent>
</Card>
      <div className="flex justify-end">
        <Button type="submit">Save Follow Up</Button>
      </div>
    </form>
  );
};

export default FollowUpForm;