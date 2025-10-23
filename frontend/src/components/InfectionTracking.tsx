import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, AlertCircle, Stethoscope } from "lucide-react";

interface InfectionTrackingProps {
  peritonitisHistory: PeritonitisEpisode[];
  exitSiteInfections: ExitSiteEpisode[];
  tunnelInfections: TunnelEpisode[]; // â¬…ï¸ NEW

  onUpdatePeritonitis: (history: PeritonitisEpisode[]) => void;
  onUpdateExitSite: (infections: ExitSiteEpisode[]) => void;
  onUpdateTunnel: (infections: TunnelEpisode[]) => void; // â¬…ï¸ NEW

  // Optional toggles if you ever want to hide a tab externally
  showPeritonitis?: boolean; // default true
  showExitSite?: boolean;    // default true
  showTunnel?: boolean;      // default true
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
  tunnelInfections,             // â¬…ï¸ NEW
  onUpdatePeritonitis,
  onUpdateExitSite,
  onUpdateTunnel,               // â¬…ï¸ NEW
  showPeritonitis = true,
  showExitSite = true,
  showTunnel = true,            // â¬…ï¸ NEW
}: InfectionTrackingProps) => {
  // Local mirrors for controlled editing
  const [peritonitisEpisodes, setPeritonitisEpisodes] = useState<PeritonitisEpisode[]>(
    peritonitisHistory || []
  );
  const [exitSiteEpisodes, setExitSiteEpisodes] = useState<ExitSiteEpisode[]>(
    exitSiteInfections || []
  );
  const [tunnelEpisodes, setTunnelEpisodes] = useState<TunnelEpisode[]>(   // â¬…ï¸ NEW
    tunnelInfections || []
  );

  // Keep local state in sync with parent updates
  useEffect(() => setPeritonitisEpisodes(peritonitisHistory || []), [peritonitisHistory]);
  useEffect(() => setExitSiteEpisodes(exitSiteInfections || []), [exitSiteInfections]);
  useEffect(() => setTunnelEpisodes(tunnelInfections || []), [tunnelInfections]); // â¬…ï¸ NEW

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

  // Compute default tab based on visibility flags
  const defaultTab = showPeritonitis ? "peritonitis" : showExitSite ? "exitsite" : "tunnel";

  return (
    <div className="space-y-6">
      <Tabs defaultValue={defaultTab} className="w-full">
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
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Peritonitis Episode History
                </CardTitle>
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
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-amber-600" />
                  Exit Site Infection Episodes
                </CardTitle>
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
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Tunnel Infection History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="default" className="mb-4" onClick={addTunnelEpisode}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tunnel Infection Record
                </Button>

                {tunnelEpisodes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No tunnel infections recorded. Click â€œAdd Tunnel Infection Recordâ€ to start.
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

