import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ArrowLeft, Download, Plus, FileText, BarChart3, ClipboardList, Stethoscope, Notebook, Loader2 } from "lucide-react";
import { formatDateToDDMMYYYY, isoStringToDate, toLocalISO, formatDateToInputValue } from "@/lib/dateUtils";
import { usePatientContext } from "@/context/PatientContext";
import { followupApi } from "@/services/followupApi";

interface FollowUpFormProps {
  setActiveView: React.Dispatch<
    React.SetStateAction<"dashboard" | "donor-assessment" | "recipient-assessment" | "kt" | "follow-up">
  >;
}

interface Investigation {
  id: string;
  date: string;
  type: "frequent" | "annual";
  tacrolimus: string;
  creatinine: string;
  eGFR: string;
  seNa: string;
  seK: string;
  seHb: string;
  sAlbumin: string;
  urinePCR: string;
  additionalNotes: string;
}

interface FollowUpNote {
  id: string;
  date: string;
  doctorNote: string;
}

const KTFollowUpForm: React.FC<FollowUpFormProps> = ({ setActiveView }) => {
  const navigate = useNavigate();
  const { patient, globalPatient } = usePatientContext();
  const [activeSection, setActiveSection] = useState<"options" | "investigations" | "followupNotes">("followupNotes");
  const [activeTab, setActiveTab] = useState<"frequent" | "annual">("frequent");
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpNote[]>([]);
  const [loadingFollowups, setLoadingFollowups] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState<{ date: string; doctorNote: string }>({ 
    date: toLocalISO(new Date()), 
    doctorNote: '' 
  });
  const [followupFilterDate, setFollowupFilterDate] = useState<string>('');
  const [followupSearch, setFollowupSearch] = useState<string>('');
  const [searchDate, setSearchDate] = useState("");
  const [filterType, setFilterType] = useState<"all" | "frequent" | "annual">("all");

  const [frequentForm, setFrequentForm] = useState<Omit<Investigation, "id" | "type">>({
    date: toLocalISO(new Date()),
    tacrolimus: "",
    creatinine: "",
    eGFR: "",
    seNa: "",
    seK: "",
    seHb: "",
    sAlbumin: "",
    urinePCR: "",
    additionalNotes: ""
  });

  const [annualForm, setAnnualForm] = useState<Omit<Investigation, "id" | "type">>({
    date: toLocalISO(new Date()),
    tacrolimus: "",
    creatinine: "",
    eGFR: "",
    seNa: "",
    seK: "",
    seHb: "",
    sAlbumin: "",
    urinePCR: "",
    additionalNotes: ""
  });

  // Auto-load followups when patient changes
  useEffect(() => {
    const currentPatient = globalPatient || patient;
    if (currentPatient?.phn && activeSection === "followupNotes") {
      loadFollowups(currentPatient.phn);
    }
  }, [globalPatient, patient, activeSection]);

  const loadFollowups = async (phn: string) => {
    setLoadingFollowups(true);
    try {
      const data = await followupApi.list(phn);
      setFollowUps((data as any[]).map((d: any) => ({ id: d.id, date: d.dateOfVisit, doctorNote: d.notes })));
    } catch (error) {
      console.error("Error loading followups:", error);
    } finally {
      setLoadingFollowups(false);
    }
  };

  const saveFollowUp = async () => {
    const currentPatient = globalPatient || patient;
    if (!currentPatient?.phn) {
      alert('Please search for a patient first');
      return;
    }
    if (!newFollowUp.doctorNote.trim()) {
      alert('Please enter a note');
      return;
    }
    try {
      await followupApi.create(currentPatient.phn, {
        dateOfVisit: newFollowUp.date,
        notes: newFollowUp.doctorNote,
      });
      setNewFollowUp({ date: toLocalISO(new Date()), doctorNote: '' });
      await loadFollowups(currentPatient.phn);
    } catch (error) {
      console.error("Error saving followup:", error);
      alert('Failed to save note');
    }
  };

  // Quick Action Buttons
  const QuickActions = () => (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button 
        onClick={() => setActiveSection("followupNotes")}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Notebook className="w-4 h-4" />
        Doctor's Notes
      </Button>
      <Button
        onClick={() => navigate('/investigation/kt')}
        variant="outline"
        className="flex items-center gap-2"
      >
        KT Investigation
      </Button>
    </div>
  );

  const handleFrequentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvestigation: Investigation = {
      id: `inv-${Date.now()}`,
      type: "frequent",
      ...frequentForm
    };
    setInvestigations(prev => [newInvestigation, ...prev]);
    setFrequentForm({
      date: toLocalISO(new Date()),
      tacrolimus: "",
      creatinine: "",
      eGFR: "",
      seNa: "",
      seK: "",
      seHb: "",
      sAlbumin: "",
      urinePCR: "",
      additionalNotes: ""
    });
  };

  const handleAnnualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvestigation: Investigation = {
      id: `inv-${Date.now()}`,
      type: "annual",
      ...annualForm
    };
    setInvestigations(prev => [newInvestigation, ...prev]);
    setAnnualForm({
      date: toLocalISO(new Date()),
      tacrolimus: "",
      creatinine: "",
      eGFR: "",
      seNa: "",
      seK: "",
      seHb: "",
      sAlbumin: "",
      urinePCR: "",
      additionalNotes: ""
    });
  };

  const filteredInvestigations = investigations.filter(inv => {
    const matchesDate = searchDate ? inv.date === searchDate : true;
    const matchesType = filterType === "all" || inv.type === filterType;
    return matchesDate && matchesType;
  });

  const getRecentInvestigations = (type: "frequent" | "annual", limit: number = 3) => {
    return investigations
      .filter(inv => inv.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const filteredFollowUps = followUps.filter(fu => {
    const matchesDate = followupFilterDate ? fu.date === followupFilterDate : true;
    const matchesSearch = followupSearch ? fu.doctorNote.toLowerCase().includes(followupSearch.toLowerCase()) : true;
    return matchesDate && matchesSearch;
  });

  // Options View - Simple and Clean
  if (activeSection === "options") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* intentionally left empty: title area could go here in future */}
          </div>
          <div>
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
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Follow-up Notes</p>
                  <p className="text-2xl font-bold text-slate-800">{followUps.length}</p>
                </div>
                <div className="p-2 rounded-full bg-green-100">
                  <Notebook className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Investigations</p>
                  <p className="text-2xl font-bold text-slate-800">{investigations.length}</p>
                </div>
                <div className="p-2 rounded-full bg-purple-100">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Choose what you'd like to work on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Investigations View
  if (activeSection === "investigations") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Lab Investigations</h1>
              <p className="text-slate-600">Manage frequent and annual investigation records</p>
            </div>
          </div>
          <div>
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
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investigation History Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Investigation History
              </CardTitle>
              <CardDescription>
                Quick access to recent test results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="searchDate">Search by Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchDate ? formatDateToDDMMYYYY(searchDate) : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={isoStringToDate(searchDate)}
                        onSelect={(date) => {
                          if (date) {
                            setSearchDate(toLocalISO(date));
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filterType">Filter by Type</Label>
                  <Select value={filterType} onValueChange={(value: "all" | "frequent" | "annual") => setFilterType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="frequent">Frequent Only</SelectItem>
                      <SelectItem value="annual">Annual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Recent Frequent Tests */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Recent Frequent Tests
                </h4>
                {getRecentInvestigations("frequent").map((inv) => (
                  <div key={inv.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{inv.date}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                        Frequent
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Cr: {inv.creatinine || "N/A"} • eGFR: {inv.eGFR || "N/A"}
                    </div>
                  </div>
                ))}
                {getRecentInvestigations("frequent").length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No frequent tests recorded</p>
                )}
              </div>

              {/* Recent Annual Tests */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Recent Annual Tests
                </h4>
                {getRecentInvestigations("annual").map((inv) => (
                  <div key={inv.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{inv.date}</span>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                        Annual
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Full comprehensive workup
                    </div>
                  </div>
                ))}
                {getRecentInvestigations("annual").length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No annual tests recorded</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Investigation
              </CardTitle>
              <CardDescription>
                Choose between frequent monitoring or annual comprehensive testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "frequent" | "annual")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="frequent" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Frequent Investigations
                  </TabsTrigger>
                  <TabsTrigger value="annual" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Annual Investigations
                  </TabsTrigger>
                </TabsList>

                {/* Frequent Investigations Form */}
                <TabsContent value="frequent" className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <BarChart3 className="w-4 h-4" />
                      <span className="font-semibold">Frequent Monitoring</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Essential tests for routine monitoring. Typically performed monthly or as needed.
                    </p>
                  </div>

                  <form onSubmit={handleFrequentSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="frequentDate">Test Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {frequentForm.date ? formatDateToDDMMYYYY(frequentForm.date) : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isoStringToDate(frequentForm.date)}
                            onSelect={(date) => {
                              if (date) {
                                setFrequentForm(prev => ({ ...prev, date: toLocalISO(date) }));
                              }
                            }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tacrolimus">Tacrolimus Level (ng/mL)</Label>
                        <Input
                          id="tacrolimus"
                          value={frequentForm.tacrolimus}
                          onChange={(e) => setFrequentForm(prev => ({ ...prev, tacrolimus: e.target.value }))}
                          placeholder="5.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                        <Input
                          id="creatinine"
                          value={frequentForm.creatinine}
                          onChange={(e) => setFrequentForm(prev => ({ ...prev, creatinine: e.target.value }))}
                          placeholder="1.2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="eGFR">eGFR (mL/min/1.73m²)</Label>
                        <Input
                          id="eGFR"
                          value={frequentForm.eGFR}
                          onChange={(e) => setFrequentForm(prev => ({ ...prev, eGFR: e.target.value }))}
                          placeholder="65"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seK">Potassium (mmol/L)</Label>
                        <Input
                          id="seK"
                          value={frequentForm.seK}
                          onChange={(e) => setFrequentForm(prev => ({ ...prev, seK: e.target.value }))}
                          placeholder="4.2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="seHb">Hemoglobin (g/dL)</Label>
                        <Input
                          id="seHb"
                          value={frequentForm.seHb}
                          onChange={(e) => setFrequentForm(prev => ({ ...prev, seHb: e.target.value }))}
                          placeholder="13.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="urinePCR">Urine PCR (mg/g)</Label>
                        <Input
                          id="urinePCR"
                          value={frequentForm.urinePCR}
                          onChange={(e) => setFrequentForm(prev => ({ ...prev, urinePCR: e.target.value }))}
                          placeholder="150"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frequentNotes">Additional Notes</Label>
                      <Textarea
                        id="frequentNotes"
                        value={frequentForm.additionalNotes}
                        onChange={(e) => setFrequentForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                        placeholder="Any additional observations or comments..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Save Frequent Investigation
                    </Button>
                  </form>
                </TabsContent>

                {/* Annual Investigations Form */}
                <TabsContent value="annual" className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">Annual Comprehensive Workup</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Complete annual assessment including all routine tests plus additional comprehensive screening.
                    </p>
                  </div>

                  <form onSubmit={handleAnnualSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="annualDate">Test Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {annualForm.date ? formatDateToDDMMYYYY(annualForm.date) : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isoStringToDate(annualForm.date)}
                            onSelect={(date) => {
                              if (date) {
                                setAnnualForm(prev => ({ ...prev, date: toLocalISO(date) }));
                              }
                            }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualTacrolimus">Tacrolimus Level (ng/mL)</Label>
                        <Input
                          id="annualTacrolimus"
                          value={annualForm.tacrolimus}
                          onChange={(e) => setAnnualForm(prev => ({ ...prev, tacrolimus: e.target.value }))}
                          placeholder="5.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualCreatinine">Creatinine (mg/dL)</Label>
                        <Input
                          id="annualCreatinine"
                          value={annualForm.creatinine}
                          onChange={(e) => setAnnualForm(prev => ({ ...prev, creatinine: e.target.value }))}
                          placeholder="1.2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualEGFR">eGFR (mL/min/1.73m²)</Label>
                        <Input
                          id="annualEGFR"
                          value={annualForm.eGFR}
                          onChange={(e) => setAnnualForm(prev => ({ ...prev, eGFR: e.target.value }))}
                          placeholder="65"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualSeNa">Sodium (mmol/L)</Label>
                        <Input
                          id="annualSeNa"
                          value={annualForm.seNa}
                          onChange={(e) => setAnnualForm(prev => ({ ...prev, seNa: e.target.value }))}
                          placeholder="140"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualSeK">Potassium (mmol/L)</Label>
                        <Input
                          id="annualSeK"
                          value={annualForm.seK}
                          onChange={(e) => setAnnualForm(prev => ({ ...prev, seK: e.target.value }))}
                          placeholder="4.2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualSeHb">Hemoglobin (g/dL)</Label>
                        <Input
                          id="annualSeHb"
                          value={annualForm.seHb}
                          onChange={(e) => setAnnualForm(prev => ({ ...prev, seHb: e.target.value }))}
                          placeholder="13.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualSAlbumin">Albumin (g/dL)</Label>
                        <Input
                          id="annualSAlbumin"
                          value={annualForm.sAlbumin}
                          onChange={(e) => setAnnualForm(prev => ({ ...prev, sAlbumin: e.target.value }))}
                          placeholder="4.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualUrinePCR">Urine PCR (mg/g)</Label>
                        <Input
                          id="annualUrinePCR"
                          value={annualForm.urinePCR}
                          onChange={(e) => setAnnualForm(prev => ({ ...prev, urinePCR: e.target.value }))}
                          placeholder="150"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annualNotes">Additional Notes</Label>
                      <Textarea
                        id="annualNotes"
                        value={annualForm.additionalNotes}
                        onChange={(e) => setAnnualForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                        placeholder="Any additional observations or comments..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Save Annual Investigation
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Recent Investigations Table */}
        {filteredInvestigations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Investigation Records
              </CardTitle>
              <CardDescription>
                {filteredInvestigations.length} records found
                {searchDate && ` for ${searchDate}`}
                {filterType !== "all" && ` (${filterType} only)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvestigations.map((inv) => (
                  <div key={inv.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{inv.date}</span>
                        <Badge variant="outline" className={
                          inv.type === "frequent" 
                            ? "bg-green-50 text-green-700" 
                            : "bg-blue-50 text-blue-700"
                        }>
                          {inv.type === "frequent" ? "Frequent" : "Annual"}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Tacrolimus:</span>
                        <span className="ml-2 font-medium">{inv.tacrolimus || "N/A"} ng/mL</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Creatinine:</span>
                        <span className="ml-2 font-medium">{inv.creatinine || "N/A"} mg/dL</span>
                      </div>
                      <div>
                        <span className="text-slate-500">eGFR:</span>
                        <span className="ml-2 font-medium">{inv.eGFR || "N/A"} mL/min</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Hb:</span>
                        <span className="ml-2 font-medium">{inv.seHb || "N/A"} g/dL</span>
                      </div>
                    </div>

                    {inv.additionalNotes && (
                      <div className="mt-3 p-3 bg-slate-50 rounded">
                        <p className="text-sm text-slate-700">{inv.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Follow-up Notes View
  if (activeSection === "followupNotes") {
    const currentPatient = globalPatient || patient;
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Doctor's Notes</h1>
              <p className="text-slate-600">Manage clinical notes and observations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentPatient?.phn && (
              <div className="text-sm text-blue-700 bg-blue-50 px-4 py-2 rounded border border-blue-200">
                <strong>Patient:</strong> {currentPatient.name} (PHN: {currentPatient.phn})
              </div>
            )}
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
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Note */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Note
              </CardTitle>
              <CardDescription>
                Create a new follow-up note for the patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="followupDate">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newFollowUp.date ? formatDateToDDMMYYYY(newFollowUp.date) : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={isoStringToDate(newFollowUp.date)}
                        onSelect={(date) => {
                          if (date) {
                            setNewFollowUp(prev => ({ ...prev, date: toLocalISO(date) }));
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followupNote">Doctor's Note</Label>
                  <Textarea
                    id="followupNote"
                    rows={6}
                    value={newFollowUp.doctorNote}
                    onChange={(e) => setNewFollowUp(prev => ({ ...prev, doctorNote: e.target.value }))}
                    placeholder="Enter clinical findings, assessment, and plan..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveFollowUp} className="flex-1" disabled={loadingFollowups}>
                    {loadingFollowups ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Note
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setNewFollowUp({ date: toLocalISO(new Date()), doctorNote: '' })} 
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Notebook className="w-5 h-5" />
                Saved Notes
              </CardTitle>
              <CardDescription>
                View and filter saved follow-up notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {followupFilterDate ? formatDateToDDMMYYYY(followupFilterDate) : 'Filter by date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={isoStringToDate(followupFilterDate)}
                        onSelect={(date) => {
                          if (date) {
                            setFollowupFilterDate(toLocalISO(date));
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input 
                    placeholder="Search notes..." 
                    value={followupSearch} 
                    onChange={(e) => setFollowupSearch(e.target.value)} 
                    className="h-10 md:col-span-2" 
                  />
                </div>

                {/* Notes List */}
                {filteredFollowUps.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    {followUps.length === 0 ? "No follow-up notes saved yet." : "No notes match your filters."}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredFollowUps.map(fu => (
                      <div key={fu.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-sm text-slate-600 font-medium">{fu.date}</div>
                            <div className="mt-2 text-slate-800 whitespace-pre-wrap">{fu.doctorNote}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500">ID: {fu.id}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default KTFollowUpForm;