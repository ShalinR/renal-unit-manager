import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, AlertCircle, Stethoscope } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { useToast } from "@/hooks/use-toast";

interface InfectionTrackingProps {
  peritonitisHistory: PeritonitisEpisode[];
  exitSiteInfections: ExitSiteEpisode[];
  tunnelInfections: TunnelEpisode[]; // ⬅️ NEW

  onUpdatePeritonitis: (history: PeritonitisEpisode[]) => void;
  onUpdateExitSite: (infections: ExitSiteEpisode[]) => void;
  onUpdateTunnel: (infections: TunnelEpisode[]) => void; // ⬅️ NEW

  // Optional toggles if you ever want to hide a tab externally
  showPeritonitis?: boolean; // default true
  showExitSite?: boolean;    // default true
  showTunnel?: boolean;      // default true

  // Callback for tab changes
  onTabChange?: (tab: string) => void;
}

export interface PeritonitisEpisode {
  id: string;
  date: string;
  capdFullReports: string;
  capdCulture: string;
  antibioticSensitivity: string;
  managementAntibiotic: string;
  managementType: string;
  managementDuration: string;
  outcome: string;
  reasonForPeritonitis: string;
  assessmentByNO: string;
}

export interface ExitSiteEpisode {
  id: string;
  dateOnset: string;
  numberOfEpisodes: string;
  investigationCulture: string;
  investigationExitSite: string;
  investigationOther: string;
  managementAntibiotic: string;
  managementType: string;
  managementDuration: string;
  hospitalizationDuration: string;
  reasonForInfection: string;
  specialRemarks: string;
  assessmentByNO: string;
  assessmentByDoctor: string;
}

export interface TunnelEpisode {
  id: string;
  date: string;
  cultureReport: string;
  treatment: string;
  remarks?: string;
}

const InfectionTracking = ({
  peritonitisHistory,
  exitSiteInfections,
  tunnelInfections,             // ⬅️ NEW
  onUpdatePeritonitis,
  onUpdateExitSite,
  onUpdateTunnel,               // ⬅️ NEW
  showPeritonitis = true,
  showExitSite = true,
  showTunnel = true,            // ⬅️ NEW
  onTabChange,                  // ⬅️ NEW
}: InfectionTrackingProps) => {
  // Local mirrors for controlled editing
  // Start with empty array for peritonitis and exit site - don't load saved episodes
  const [peritonitisEpisodes, setPeritonitisEpisodes] = useState<PeritonitisEpisode[]>([]);
  const [exitSiteEpisodes, setExitSiteEpisodes] = useState<ExitSiteEpisode[]>([]);
  const [tunnelEpisodes, setTunnelEpisodes] = useState<TunnelEpisode[]>(
    tunnelInfections || []
  );
  
  // Get patient context and toast at component level
  const { patient } = usePatientContext();
  const { toast } = useToast();

  // Keep local state in sync with parent updates (except peritonitis and exit site - we don't load saved episodes)
  useEffect(() => setTunnelEpisodes(tunnelInfections || []), [tunnelInfections]);

  // ---------- Peritonitis handlers ----------
  const addPeritonitisEpisode = () => {
    const newEpisode: PeritonitisEpisode = {
      id: Date.now().toString(),
      date: "",
      capdFullReports: "",
      capdCulture: "",
      antibioticSensitivity: "",
      managementAntibiotic: "",
      managementType: "",
      managementDuration: "",
      outcome: "",
      reasonForPeritonitis: "",
      assessmentByNO: "",
    };
    setPeritonitisEpisodes(prev => {
      const updated = [...prev, newEpisode];
      onUpdatePeritonitis(updated);
      return updated;
    });
  };
  const updatePeritonitisEpisode = (id: string, field: keyof PeritonitisEpisode, value: string) => {
    setPeritonitisEpisodes(prev => {
      const updated = prev.map(ep => (ep.id === id ? { ...ep, [field]: value } : ep));
      onUpdatePeritonitis(updated);
      return updated;
    });
  };
  const removePeritonitisEpisode = (id: string) => {
    setPeritonitisEpisodes(prev => {
      const updated = prev.filter(ep => ep.id !== id);
      onUpdatePeritonitis(updated);
      return updated;
    });
  };

  const handleSavePeritonitis = async () => {
    if (peritonitisEpisodes.length === 0) {
      alert("No peritonitis episodes to save.");
      return;
    }

    const phn = patient?.phn;
    
    if (!phn) {
      toast({
        title: "Patient Not Selected",
        description: "Please search for a patient by PHN first before saving peritonitis data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const API_URL = `http://localhost:8081/api/infection-tracking/${phn}/peritonitis`;

      // Convert episodes to DTOs
      const dtos = peritonitisEpisodes.map(ep => ({
        infectionType: "PERITONITIS",
        episodeDate: ep.date || "",
        capdFullReports: ep.capdFullReports || "",
        capdCulture: ep.capdCulture || "",
        antibioticSensitivity: ep.antibioticSensitivity || "",
        managementAntibiotic: ep.managementAntibiotic || "",
        managementType: ep.managementType || "",
        managementDuration: ep.managementDuration || "",
        outcome: ep.outcome || "",
        reasonForPeritonitis: ep.reasonForPeritonitis || "",
        assessmentByNO: ep.assessmentByNO || "",
      }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dtos),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save: ${response.status} - ${errorText}`);
      }

      const savedData = await response.json();
      console.log("✅ Peritonitis episodes saved successfully:", savedData);
      alert(`✅ Peritonitis history saved successfully! ${savedData.length} episode(s) have been saved to the database.`);
    } catch (error) {
      console.error("❌ Error saving peritonitis history:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`❌ Failed to save peritonitis history: ${errorMessage}\n\nPlease check the console for more details and try again.`);
    }
  };

  const handleSaveExitSite = async () => {
    if (exitSiteEpisodes.length === 0) {
      alert("No exit site infection episodes to save.");
      return;
    }

    const phn = patient?.phn;
    
    if (!phn) {
      toast({
        title: "Patient Not Selected",
        description: "Please search for a patient by PHN first before saving exit site infection data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const API_URL = `http://localhost:8081/api/infection-tracking/${phn}/exit-site`;

      // Convert episodes to DTOs
      const dtos = exitSiteEpisodes.map(ep => ({
        infectionType: "EXIT_SITE",
        episodeDate: ep.dateOnset || "",
        dateOnset: ep.dateOnset || "",
        numberOfEpisodes: ep.numberOfEpisodes || "",
        investigationCulture: ep.investigationCulture || "",
        investigationExitSite: ep.investigationExitSite || "",
        investigationOther: ep.investigationOther || "",
        managementAntibiotic: ep.managementAntibiotic || "",
        managementType: ep.managementType || "",
        managementDuration: ep.managementDuration || "",
        hospitalizationDuration: ep.hospitalizationDuration || "",
        reasonForInfection: ep.reasonForInfection || "",
        specialRemarks: ep.specialRemarks || "",
        assessmentByNO: ep.assessmentByNO || "",
        assessmentByDoctor: ep.assessmentByDoctor || "",
      }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dtos),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save: ${response.status} - ${errorText}`);
      }

      const savedData = await response.json();
      console.log("✅ Exit site infection episodes saved successfully:", savedData);
      alert(`✅ Exit site infection episodes saved successfully! ${savedData.length} episode(s) have been saved to the database.`);
    } catch (error) {
      console.error("❌ Error saving exit site infection episodes:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`❌ Failed to save exit site infection episodes: ${errorMessage}\n\nPlease check the console for more details and try again.`);
    }
  };

  // ---------- Exit-site handlers ----------
  const addExitSiteEpisode = () => {
    const newEpisode: ExitSiteEpisode = {
      id: Date.now().toString(),
      dateOnset: "",
      numberOfEpisodes: "",
      investigationCulture: "",
      investigationExitSite: "",
      investigationOther: "",
      managementAntibiotic: "",
      managementType: "",
      managementDuration: "",
      hospitalizationDuration: "",
      reasonForInfection: "",
      specialRemarks: "",
      assessmentByNO: "",
      assessmentByDoctor: "",
    };
    setExitSiteEpisodes(prev => {
      const updated = [...prev, newEpisode];
      onUpdateExitSite(updated);
      return updated;
    });
  };
  const updateExitSiteEpisode = (id: string, field: keyof ExitSiteEpisode, value: string) => {
    setExitSiteEpisodes(prev => {
      const updated = prev.map(ep => (ep.id === id ? { ...ep, [field]: value } : ep));
      onUpdateExitSite(updated);
      return updated;
    });
  };
  const removeExitSiteEpisode = (id: string) => {
    setExitSiteEpisodes(prev => {
      const updated = prev.filter(ep => ep.id !== id);
      onUpdateExitSite(updated);
      return updated;
    });
  };

  // ---------- Tunnel handlers (NEW TAB) ----------
  const addTunnelEpisode = () => {
    const newEpisode: TunnelEpisode = {
      id: Date.now().toString(),
      date: "",
      cultureReport: "",
      treatment: "",
      remarks: "",
    };
    setTunnelEpisodes(prev => {
      const updated = [...prev, newEpisode];
      onUpdateTunnel(updated);
      return updated;
    });
  };
  const updateTunnelEpisode = <K extends keyof TunnelEpisode>(id: string, key: K, value: TunnelEpisode[K]) => {
    setTunnelEpisodes(prev => {
      const updated = prev.map(ep => (ep.id === id ? { ...ep, [key]: value } : ep));
      onUpdateTunnel(updated);
      return updated;
    });
  };
  const removeTunnelEpisode = (id: string) => {
    setTunnelEpisodes(prev => {
      const updated = prev.filter(ep => ep.id !== id);
      onUpdateTunnel(updated);
      return updated;
    });
  };

  const handleSaveTunnel = async () => {
    if (tunnelEpisodes.length === 0) {
      alert("No tunnel infection episodes to save.");
      return;
    }

    const phn = patient?.phn;
    
    if (!phn) {
      toast({
        title: "Patient Not Selected",
        description: "Please search for a patient by PHN first before saving tunnel infection data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const API_URL = `http://localhost:8081/api/infection-tracking/${phn}/tunnel`;

      // Convert episodes to DTOs
      const dtos = tunnelEpisodes.map(ep => ({
        infectionType: "TUNNEL",
        episodeDate: ep.date || "",
        cultureReport: ep.cultureReport || "",
        treatment: ep.treatment || "",
        remarks: ep.remarks || "",
      }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dtos),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save: ${response.status} - ${errorText}`);
      }

      const savedData = await response.json();
      console.log("✅ Tunnel infection episodes saved successfully:", savedData);
      alert(`✅ Tunnel infection episodes saved successfully! ${savedData.length} episode(s) have been saved to the database.`);
    } catch (error) {
      console.error("❌ Error saving tunnel infection episodes:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`❌ Failed to save tunnel infection episodes: ${errorMessage}\n\nPlease check the console for more details and try again.`);
    }
  };

  // Compute default tab based on visibility flags
  const defaultTab = showPeritonitis ? "peritonitis" : showExitSite ? "exitsite" : "tunnel";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList
          className={`grid w-full ${
            showPeritonitis && showExitSite && showTunnel
              ? "grid-cols-3"
              : showPeritonitis && showExitSite
              ? "grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {showPeritonitis && <TabsTrigger value="peritonitis">Peritonitis History</TabsTrigger>}
          {showExitSite && <TabsTrigger value="exitsite">Exit Site Infections</TabsTrigger>}
          {showTunnel && <TabsTrigger value="tunnel">Tunnel Infection History</TabsTrigger>}
        </TabsList>

        {/* PERITONITIS TAB */}
        {showPeritonitis && (
          <TabsContent value="peritonitis" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Peritonitis Episode History
                  </CardTitle>
                  <Button 
                    type="button" 
                    onClick={handleSavePeritonitis} 
                    variant="default"
                    disabled={peritonitisEpisodes.length === 0}
                  >
                    Save Peritonitis
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Button type="button" onClick={addPeritonitisEpisode} className="mb-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Peritonitis Episode
                </Button>

                <div className="space-y-4">
                  {peritonitisEpisodes.map((episode, index) => (
                    <Card key={episode.id} className="border-destructive/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Badge variant="destructive">Episode {index + 1}</Badge>
                          </CardTitle>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePeritonitisEpisode(episode.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={episode.date}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "date", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>PD Full Reports</Label>
                            <Input
                              value={episode.capdFullReports}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "capdFullReports", e.target.value)
                              }
                              placeholder="Enter report details"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>PD Culture</Label>
                            <Input
                              value={episode.capdCulture}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "capdCulture", e.target.value)
                              }
                              placeholder="Culture results"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Antibiotic sensitivity</Label>
                            <Input
                              value={episode.antibioticSensitivity}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "antibioticSensitivity", e.target.value)
                              }
                              placeholder="Sensitivity results"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Management - Antibiotic</Label>
                            <Input
                              value={episode.managementAntibiotic}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "managementAntibiotic", e.target.value)
                              }
                              placeholder="Antibiotic name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Input
                              value={episode.managementType}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "managementType", e.target.value)
                              }
                              placeholder="IV/Oral/etc"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                              value={episode.managementDuration}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "managementDuration", e.target.value)
                              }
                              placeholder="Treatment duration"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Outcome</Label>
                            <Input
                              value={episode.outcome}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "outcome", e.target.value)
                              }
                              placeholder="Treatment outcome"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Reason for Peritonitis</Label>
                            <Input
                              value={episode.reasonForPeritonitis}
                              onChange={(e) =>
                                updatePeritonitisEpisode(episode.id, "reasonForPeritonitis", e.target.value)
                              }
                              placeholder="Identified cause"
                            />
                          </div>
                        </div>

                        {/* <div className="space-y-2">
                          <Label>Assessment done by N/O</Label>
                          <Textarea
                            value={episode.assessmentByNO}
                            onChange={(e) =>
                              updatePeritonitisEpisode(episode.id, "assessmentByNO", e.target.value)
                            }
                            placeholder="Nursing officer assessment"
                            rows={3}
                          />
                        </div> */}
                      </CardContent>
                    </Card>
                  ))}

                  {peritonitisEpisodes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No peritonitis episodes recorded. Click "Add Peritonitis Episode" to start
                      tracking.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* EXIT SITE TAB */}
        {showExitSite && (
          <TabsContent value="exitsite" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-amber-600" />
                    Exit Site Infection Episodes
                  </CardTitle>
                  <Button 
                    type="button" 
                    onClick={handleSaveExitSite} 
                    variant="default"
                    disabled={exitSiteEpisodes.length === 0}
                  >
                    Save Exit Site Infections
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Button type="button" onClick={addExitSiteEpisode} className="mb-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exit Site Infection Episode
                </Button>

                <div className="space-y-4">
                  {exitSiteEpisodes.map((episode, index) => (
                    <Card key={episode.id} className="border-amber-300/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Badge variant="secondary">Episode {index + 1}</Badge>
                          </CardTitle>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeExitSiteEpisode(episode.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date / Onset of Symptoms</Label>
                            <Input
                              type="date"
                              value={episode.dateOnset}
                              onChange={(e) =>
                                updateExitSiteEpisode(episode.id, "dateOnset", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Number of Episodes</Label>
                            <Input
                              type="number"
                              value={episode.numberOfEpisodes}
                              onChange={(e) =>
                                updateExitSiteEpisode(episode.id, "numberOfEpisodes", e.target.value)
                              }
                              placeholder="Episode count"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Investigation</Label>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* <div className="space-y-2">
                              <Label className="text-sm">CAPD Culture</Label>
                              <Input
                                value={episode.investigationCulture}
                                onChange={(e) =>
                                  updateExitSiteEpisode(
                                    episode.id,
                                    "investigationCulture",
                                    e.target.value
                                  )
                                }
                                placeholder="Culture results"
                              />
                            </div> */}
                            <div className="space-y-2">
                              <Label className="text-sm">Exit Site Swab Culture</Label>
                              <Input
                                value={episode.investigationExitSite}
                                onChange={(e) =>
                                  updateExitSiteEpisode(
                                    episode.id,
                                    "investigationExitSite",
                                    e.target.value
                                  )
                                }
                                placeholder="Swab results"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Other</Label>
                              <Input
                                value={episode.investigationOther}
                                onChange={(e) =>
                                  updateExitSiteEpisode(
                                    episode.id,
                                    "investigationOther",
                                    e.target.value
                                  )
                                }
                                placeholder="Other investigations"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Management - Antibiotic</Label>
                            <Input
                              value={episode.managementAntibiotic}
                              onChange={(e) =>
                                updateExitSiteEpisode(
                                  episode.id,
                                  "managementAntibiotic",
                                  e.target.value
                                )
                              }
                              placeholder="Antibiotic"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Input
                              value={episode.managementType}
                              onChange={(e) =>
                                updateExitSiteEpisode(episode.id, "managementType", e.target.value)
                              }
                              placeholder="IV/Oral"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                              value={episode.managementDuration}
                              onChange={(e) =>
                                updateExitSiteEpisode(
                                  episode.id,
                                  "managementDuration",
                                  e.target.value
                                )
                              }
                              placeholder="Treatment duration"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* <div className="space-y-2">
                            <Label>Duration of Hospitalization</Label>
                            <Input
                              value={episode.hospitalizationDuration}
                              onChange={(e) =>
                                updateExitSiteEpisode(
                                  episode.id,
                                  "hospitalizationDuration",
                                  e.target.value
                                )
                              }
                              placeholder="Days hospitalized"
                            />
                          </div> */}
                          <div className="space-y-2">
                            <Label>Reason for Exit Site Infection</Label>
                            <Input
                              value={episode.reasonForInfection}
                              onChange={(e) =>
                                updateExitSiteEpisode(
                                  episode.id,
                                  "reasonForInfection",
                                  e.target.value
                                )
                              }
                              placeholder="Identified cause"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Special Remarks / Outcomes</Label>
                          <Textarea
                            value={episode.specialRemarks}
                            onChange={(e) =>
                              updateExitSiteEpisode(episode.id, "specialRemarks", e.target.value)
                            }
                            placeholder="Additional notes and outcomes"
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Assessment done by N/O</Label>
                            <Textarea
                              value={episode.assessmentByNO}
                              onChange={(e) =>
                                updateExitSiteEpisode(episode.id, "assessmentByNO", e.target.value)
                              }
                              placeholder="Nursing officer assessment"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Assessment by Doctor</Label>
                            <Textarea
                              value={episode.assessmentByDoctor}
                              onChange={(e) =>
                                updateExitSiteEpisode(
                                  episode.id,
                                  "assessmentByDoctor",
                                  e.target.value
                                )
                              }
                              placeholder="Doctor's assessment"
                              rows={2}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {exitSiteEpisodes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No exit site infection episodes recorded. Click "Add Exit Site Infection Episode"
                      to start tracking.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TUNNEL TAB (NEW) */}
        {showTunnel && (
          <TabsContent value="tunnel" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    Tunnel Infection History
                  </CardTitle>
                  <Button 
                    type="button" 
                    onClick={handleSaveTunnel} 
                    variant="default"
                    disabled={tunnelEpisodes.length === 0}
                  >
                    Save Tunnel Infections
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="default" className="mb-4" onClick={addTunnelEpisode}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tunnel Infection Record
                </Button>

                {tunnelEpisodes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No tunnel infections recorded. Click “Add Tunnel Infection Record” to start.
                  </div>
                )}

                <div className="space-y-4">
                  {tunnelEpisodes.map((ep, idx) => (
                    <Card key={ep.id} className="border-primary/20">
                      <CardHeader className="pb-3 flex items-center justify-between">
                        <CardTitle className="text-lg">Record {idx + 1}</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeTunnelEpisode(ep.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={ep.date}
                              onChange={(e) => updateTunnelEpisode(ep.id, "date", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Culture Report</Label>
                            <Input
                              placeholder="Culture results"
                              value={ep.cultureReport}
                              onChange={(e) => updateTunnelEpisode(ep.id, "cultureReport", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Treatment</Label>
                            <Input
                              placeholder="Treatment provided"
                              value={ep.treatment}
                              onChange={(e) => updateTunnelEpisode(ep.id, "treatment", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Remarks</Label>
                          <Textarea
                            rows={2}
                            placeholder="Additional notes / outcomes"
                            value={ep.remarks ?? ""}
                            onChange={(e) => updateTunnelEpisode(ep.id, "remarks", e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default InfectionTracking;
