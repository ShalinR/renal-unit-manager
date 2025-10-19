import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, UserCheck, Activity, Save, ArrowLeft, Pill, Users, Calendar, Stethoscope, ClipboardList, Syringe } from "lucide-react";

interface FollowUpFormProps {
  setActiveView: React.Dispatch<
    React.SetStateAction<"dashboard" | "donor-assessment" | "recipient-assessment" | "kt" | "follow-up">
  >;
}

interface FollowUpVisit {
  date: string;
  postKTDuration: string;
  examination: {
    bw: string;
    height: string;
    bmi: string;
    bp: string;
  };
  doctorsNotes: string;
  investigations: {
    tacrolimus: string;
    sCreatinine: string;
    eGFR: string;
    seNa: string;
    seK: string;
    seHb: string;
    sePCV: string;
    seWBC: string;
    sePlatelet: string;
    ufrProtein: string;
    ufrPusCells: string;
    ufrRBC: string;
    urinePCR: string;
    sCa: string;
    sPO4: string;
    fbs: string;
    ppbs: string;
    hba1c: string;
    tc: string;
    tg: string;
    hdl: string;
    ldl: string;
    sAlbumin: string;
    alp: string;
    uricAcid: string;
    alt: string;
    ast: string;
    sBilirubin: string;
    annualScreen: string;
  };
  treatment: {
    notes: string;
    prednisolone: string;
    tacrolimus: string;
    mmf: string;
    everolimus: string;
    cotrimoxazole: string;
    valganciclovir: string;
    caCo3: string;
    vitD: string;
    oneAlpha: string;
  };
}

const initialVisit: FollowUpVisit = {
  date: "",
  postKTDuration: "",
  examination: { bw: "", height: "", bmi: "", bp: "" },
  doctorsNotes: "",
  investigations: {
    tacrolimus: "",
    sCreatinine: "",
    eGFR: "",
    seNa: "",
    seK: "",
    seHb: "",
    sePCV: "",
    seWBC: "",
    sePlatelet: "",
    ufrProtein: "",
    ufrPusCells: "",
    ufrRBC: "",
    urinePCR: "",
    sCa: "",
    sPO4: "",
    fbs: "",
    ppbs: "",
    hba1c: "",
    tc: "",
    tg: "",
    hdl: "",
    ldl: "",
    sAlbumin: "",
    alp: "",
    uricAcid: "",
    alt: "",
    ast: "",
    sBilirubin: "",
    annualScreen: ""
  },
  treatment: {
    notes: "",
    prednisolone: "",
    tacrolimus: "",
    mmf: "",
    everolimus: "",
    cotrimoxazole: "",
    valganciclovir: "",
    caCo3: "",
    vitD: "",
    oneAlpha: ""
  }
};

const FollowUpForm: React.FC<FollowUpFormProps> = ({ setActiveView }) => {
  const [visits, setVisits] = useState<FollowUpVisit[]>([]);
  const [activeVisitIdx, setActiveVisitIdx] = useState<number | null>(null);
  const [visitForm, setVisitForm] = useState<FollowUpVisit>(initialVisit);
  const [viewIdx, setViewIdx] = useState<number | null>(null);

  const handleSaveVisit = () => {
    if (activeVisitIdx !== null) {
      const updated = [...visits];
      updated[activeVisitIdx] = visitForm;
      setVisits(updated);
    } else {
      setVisits([...visits, visitForm]);
    }
    setVisitForm(initialVisit);
    setActiveVisitIdx(null);
  };

  const handleEditVisit = (idx: number) => {
    setVisitForm(visits[idx]);
    setActiveVisitIdx(idx);
    setViewIdx(null);
  };

  const handleChange = (field: keyof FollowUpVisit, value: any) => {
    setVisitForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => { setVisitForm(initialVisit); setActiveVisitIdx(null); setViewIdx(null); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Calendar className="w-4 h-4" />
            New Visit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Visits list */}
        <Card className="lg:col-span-1">
          <CardHeader className="bg-slate-50 pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <ClipboardList className="w-5 h-5" />
              Visit History
            </CardTitle>
            <CardDescription>All recorded patient visits</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {visits.length === 0 ? (
              <div className="text-sm text-slate-500 text-center p-4 border border-dashed rounded-lg">
                No visits yet. Click "New Visit" to add.
              </div>
            ) : (
              <ul className="space-y-3">
                {visits.map((v, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">{v.date || "No date"}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Activity className="w-3 h-3" />
                        {v.postKTDuration || "No duration specified"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditVisit(idx)}>Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => setViewIdx(idx)}>View</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="lg:col-span-3">
          <CardHeader className="bg-slate-50">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              {activeVisitIdx !== null ? (
                <>
                  <Save className="w-5 h-5" />
                  Edit Visit
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  New Visit
                </>
              )}
            </CardTitle>
            <CardDescription>
              {activeVisitIdx !== null 
                ? "Update the details of this patient visit" 
                : "Record a new follow-up visit for the patient"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="examination" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Examination
                </TabsTrigger>
                <TabsTrigger value="investigations" className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Investigations
                </TabsTrigger>
                <TabsTrigger value="treatment" className="flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  Treatment
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <div className="space-y-6">
                  {/* Visit Information */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-blue-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                      Visit Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date of Visit
                        </Label>
                        <Input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          value={visitForm.date}
                          onChange={e => handleChange("date", e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Post-Transplant Duration
                        </Label>
                        <Input 
                          placeholder="e.g., 6 months, 2 years"
                          value={visitForm.postKTDuration} 
                          onChange={e => handleChange("postKTDuration", e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Doctor's Notes */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-slate-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-slate-500 rounded-full"></div>
                      Clinical Assessment & Doctor's Notes
                    </h4>
                    <Textarea 
                      className="resize-none" 
                      value={visitForm.doctorsNotes} 
                      onChange={e => handleChange("doctorsNotes", e.target.value)}
                      rows={8}
                      placeholder="Document patient's symptoms, clinical findings, assessment, plan, and any concerns or observations during this visit..."
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="examination">
                <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-emerald-50/50 to-white">
                  <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                    Physical Examination & Vital Signs
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-slate-700 text-sm font-medium">Body Weight</Label>
                      <div className="relative">
                        <Input 
                          value={visitForm.examination.bw} 
                          onChange={e => setVisitForm(f => ({ ...f, examination: { ...f.examination, bw: e.target.value } }))} 
                          placeholder="Enter weight"
                          className="mt-1.5 pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.75 text-sm text-slate-500">kg</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-700 text-sm font-medium">Height</Label>
                      <div className="relative">
                        <Input 
                          value={visitForm.examination.height} 
                          onChange={e => setVisitForm(f => ({ ...f, examination: { ...f.examination, height: e.target.value } }))} 
                          placeholder="Enter height"
                          className="mt-1.5 pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.75 text-sm text-slate-500">cm</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-700 text-sm font-medium">Body Mass Index</Label>
                      <div className="relative">
                        <Input 
                          value={visitForm.examination.bmi} 
                          onChange={e => setVisitForm(f => ({ ...f, examination: { ...f.examination, bmi: e.target.value } }))} 
                          placeholder="Calculate BMI"
                          className="mt-1.5 pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.75 text-sm text-slate-500">kg/m²</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-700 text-sm font-medium">Blood Pressure</Label>
                      <div className="relative">
                        <Input 
                          value={visitForm.examination.bp} 
                          onChange={e => setVisitForm(f => ({ ...f, examination: { ...f.examination, bp: e.target.value } }))} 
                          placeholder="e.g., 120/80"
                          className="mt-1.5 pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.75 text-sm text-slate-500">mmHg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="investigations">
                <div className="space-y-6">
                  {/* Renal Function Panel */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-blue-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                      Renal Function & Immunosuppression
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Tacrolimus Level</Label>
                        <Input 
                          placeholder="ng/mL"
                          value={visitForm.investigations.tacrolimus} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, tacrolimus: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">S. Creatinine</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.sCreatinine} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, sCreatinine: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">eGFR</Label>
                        <Input 
                          placeholder="mL/min/1.73m²"
                          value={visitForm.investigations.eGFR} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, eGFR: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Electrolytes Panel */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-purple-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                      Electrolytes & Minerals
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Na⁺</Label>
                        <Input 
                          placeholder="mmol/L"
                          value={visitForm.investigations.seNa} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, seNa: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">K⁺</Label>
                        <Input 
                          placeholder="mmol/L"
                          value={visitForm.investigations.seK} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, seK: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">S. Ca²⁺</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.sCa} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, sCa: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">S. PO₄</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.sPO4} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, sPO4: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hematology Panel */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-red-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-red-500 rounded-full"></div>
                      Complete Blood Count
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Hemoglobin</Label>
                        <Input 
                          placeholder="g/dL"
                          value={visitForm.investigations.seHb} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, seHb: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">PCV</Label>
                        <Input 
                          placeholder="%"
                          value={visitForm.investigations.sePCV} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, sePCV: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">WBC</Label>
                        <Input 
                          placeholder="×10³/μL"
                          value={visitForm.investigations.seWBC} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, seWBC: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Platelet</Label>
                        <Input 
                          placeholder="×10³/μL"
                          value={visitForm.investigations.sePlatelet} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, sePlatelet: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Urinalysis Panel */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-amber-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
                      Urinalysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-slate-700 text-sm font-medium">Protein</Label>
                          <Input 
                            placeholder="mg/dL"
                            value={visitForm.investigations.ufrProtein} 
                            onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, ufrProtein: e.target.value } }))} 
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 text-sm font-medium">Pus Cells</Label>
                          <Input 
                            placeholder="/HPF"
                            value={visitForm.investigations.ufrPusCells} 
                            onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, ufrPusCells: e.target.value } }))} 
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 text-sm font-medium">RBC</Label>
                          <Input 
                            placeholder="/HPF"
                            value={visitForm.investigations.ufrRBC} 
                            onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, ufrRBC: e.target.value } }))} 
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Urine PCR</Label>
                        <Input 
                          placeholder="mg/g"
                          value={visitForm.investigations.urinePCR} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, urinePCR: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Glucose & Lipid Panel */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-green-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                      Metabolic Panel
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">FBS</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.fbs} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, fbs: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">PPBS</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.ppbs} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, ppbs: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">HbA1c</Label>
                        <Input 
                          placeholder="%"
                          value={visitForm.investigations.hba1c} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, hba1c: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Total Cholesterol</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.tc} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, tc: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Triglycerides</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.tg} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, tg: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">HDL</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.hdl} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, hdl: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">LDL</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.ldl} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, ldl: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Liver Function & Other */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-orange-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                      Liver Function & Additional Tests
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">S. Albumin</Label>
                        <Input 
                          placeholder="g/dL"
                          value={visitForm.investigations.sAlbumin} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, sAlbumin: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">ALP</Label>
                        <Input 
                          placeholder="U/L"
                          value={visitForm.investigations.alp} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, alp: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">ALT</Label>
                        <Input 
                          placeholder="U/L"
                          value={visitForm.investigations.alt} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, alt: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">AST</Label>
                        <Input 
                          placeholder="U/L"
                          value={visitForm.investigations.ast} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, ast: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">S. Bilirubin</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.sBilirubin} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, sBilirubin: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Uric Acid</Label>
                        <Input 
                          placeholder="mg/dL"
                          value={visitForm.investigations.uricAcid} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, uricAcid: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-slate-700 text-sm font-medium">Annual Screening</Label>
                        <Input 
                          placeholder="Notes on annual screening"
                          value={visitForm.investigations.annualScreen} 
                          onChange={e => setVisitForm(f => ({ ...f, investigations: { ...f.investigations, annualScreen: e.target.value } }))} 
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="treatment">
                <div className="space-y-6">
                  {/* Immunosuppression */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-indigo-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
                      Immunosuppressive Therapy
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Prednisolone</Label>
                        <Input 
                          placeholder="e.g., 5mg OD"
                          value={visitForm.treatment.prednisolone} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, prednisolone: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Tacrolimus</Label>
                        <Input 
                          placeholder="e.g., 2mg BD"
                          value={visitForm.treatment.tacrolimus} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, tacrolimus: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">MMF (Mycophenolate)</Label>
                        <Input 
                          placeholder="e.g., 500mg BD"
                          value={visitForm.treatment.mmf} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, mmf: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Everolimus</Label>
                        <Input 
                          placeholder="e.g., 0.75mg BD"
                          value={visitForm.treatment.everolimus} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, everolimus: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prophylaxis */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-cyan-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-cyan-500 rounded-full"></div>
                      Infection Prophylaxis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Cotrimoxazole</Label>
                        <Input 
                          placeholder="e.g., 480mg OD"
                          value={visitForm.treatment.cotrimoxazole} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, cotrimoxazole: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Valganciclovir</Label>
                        <Input 
                          placeholder="e.g., 450mg OD"
                          value={visitForm.treatment.valganciclovir} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, valganciclovir: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bone & Mineral Support */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-teal-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-teal-500 rounded-full"></div>
                      Bone & Mineral Supplementation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Calcium Carbonate</Label>
                        <Input 
                          placeholder="e.g., 500mg TDS"
                          value={visitForm.treatment.caCo3} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, caCo3: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">Vitamin D</Label>
                        <Input 
                          placeholder="e.g., 1000 IU OD"
                          value={visitForm.treatment.vitD} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, vitD: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 text-sm font-medium">1α (Alfacalcidol)</Label>
                        <Input 
                          placeholder="e.g., 0.25μg OD"
                          value={visitForm.treatment.oneAlpha} 
                          onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, oneAlpha: e.target.value } }))}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Treatment Notes */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-slate-50/50 to-white">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-slate-500 rounded-full"></div>
                      Additional Treatment Notes
                    </h4>
                    <Textarea 
                      value={visitForm.treatment.notes} 
                      onChange={e => setVisitForm(f => ({ ...f, treatment: { ...f.treatment, notes: e.target.value } }))}
                      rows={6}
                      className="resize-none"
                      placeholder="Enter any additional notes regarding treatment modifications, patient compliance, adverse reactions, or special instructions..."
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => { setVisitForm(initialVisit); setActiveVisitIdx(null); }}>Reset Form</Button>
              <Button 
                onClick={handleSaveVisit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                {activeVisitIdx !== null ? "Update Visit" : "Save Visit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details view (read-only) */}
      {viewIdx !== null && visits[viewIdx] && (
        <Card className="mt-6">
          <CardHeader className="bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-700">
                <ClipboardList className="w-5 h-5" />
                Visit Details — {visits[viewIdx].date}
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                  {visits[viewIdx].postKTDuration}
                </Badge>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setViewIdx(null)}>Close</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="examination">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="examination" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Examination
                </TabsTrigger>
                <TabsTrigger value="investigations" className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Investigations
                </TabsTrigger>
                <TabsTrigger value="treatment" className="flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  Treatment
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Notes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="examination">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium text-slate-600">BW</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xl font-semibold text-slate-800">{visits[viewIdx].examination.bw || "-"} <span className="text-sm font-normal text-slate-500">kg</span></p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium text-slate-600">Height</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xl font-semibold text-slate-800">{visits[viewIdx].examination.height || "-"} <span className="text-sm font-normal text-slate-500">cm</span></p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium text-slate-600">BMI</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xl font-semibold text-slate-800">{visits[viewIdx].examination.bmi || "-"}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium text-slate-600">BP</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xl font-semibold text-slate-800">{visits[viewIdx].examination.bp || "-"} <span className="text-sm font-normal text-slate-500">mmHg</span></p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="investigations">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-700 border-b pb-2">Renal Function</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-600 text-sm">Tacrolimus level</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.tacrolimus || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">S. Creatinine</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.sCreatinine || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">eGFR</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.eGFR || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">Urine PCR</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.urinePCR || "-"}</p>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-slate-700 border-b pb-2 mt-6">Electrolytes</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-600 text-sm">Na⁺</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.seNa || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">K⁺</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.seK || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">S. Ca²⁺</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.sCa || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">S. PO₄</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.sPO4 || "-"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-700 border-b pb-2">Hematology</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-600 text-sm">Hb</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.seHb || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">PCV</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.sePCV || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">WBC</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.seWBC || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">Platelet</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.sePlatelet || "-"}</p>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-slate-700 border-b pb-2 mt-6">Urine Analysis</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-600 text-sm">Protein</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.ufrProtein || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">Pus Cells</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.ufrPusCells || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-slate-600 text-sm">RBC</Label>
                        <p className="text-slate-800 font-medium">{visits[viewIdx].investigations.ufrRBC || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="treatment">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-700 border-b pb-2 mb-4">Medication</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">Prednisolone</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.prednisolone || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">Tacrolimus</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.tacrolimus || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">MMF</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.mmf || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">Everolimus</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.everolimus || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">Cotrimoxazole</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.cotrimoxazole || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">Valganciclovir</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.valganciclovir || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">CaCO₃</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.caCo3 || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">Vit D</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.vitD || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-medium">1α</span>
                        <span className="text-slate-800 font-semibold">{visits[viewIdx].treatment.oneAlpha || "-"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-700 border-b pb-2 mb-4">Treatment Notes</h4>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 min-h-[200px]">
                      <p className="text-slate-700">{visits[viewIdx].treatment.notes || "No special notes recorded."}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h4 className="font-medium text-slate-700 mb-3">Doctor's Notes</h4>
                  <p className="text-slate-700 whitespace-pre-wrap">{visits[viewIdx].doctorsNotes || "No notes recorded for this visit."}</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FollowUpForm;