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
  peritonitisHistory: any[];
  exitSiteInfections: any[];
  onUpdatePeritonitis: (history: any[]) => void;
  onUpdateExitSite: (infections: any[]) => void;
}

interface PeritonitisEpisode {
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

interface ExitSiteEpisode {
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

const InfectionTracking = ({
  peritonitisHistory,
  exitSiteInfections,
  onUpdatePeritonitis,
  onUpdateExitSite,
}: InfectionTrackingProps) => {
  // Initialize from props (fallback to [])
  const [peritonitisEpisodes, setPeritonitisEpisodes] = useState<PeritonitisEpisode[]>(
    (peritonitisHistory as PeritonitisEpisode[]) || []
  );
  const [exitSiteEpisodes, setExitSiteEpisodes] = useState<ExitSiteEpisode[]>(
    (exitSiteInfections as ExitSiteEpisode[]) || []
  );

  // Keep local state in sync if parent updates props
  useEffect(() => {
    setPeritonitisEpisodes((peritonitisHistory as PeritonitisEpisode[]) || []);
  }, [peritonitisHistory]);

  useEffect(() => {
    setExitSiteEpisodes((exitSiteInfections as ExitSiteEpisode[]) || []);
  }, [exitSiteInfections]);

  // Optionally start with one blank episode visible on load:
  // useEffect(() => {
  //   if (!peritonitisEpisodes.length) addPeritonitisEpisode();
  // }, []);
  // useEffect(() => {
  //   if (!exitSiteEpisodes.length) addExitSiteEpisode();
  // }, []);

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

    // update local first so UI re-renders, then notify parent
    setPeritonitisEpisodes((prev) => {
      const updated = [...prev, newEpisode];
      onUpdatePeritonitis(updated);
      return updated;
    });
  };

  const updatePeritonitisEpisode = (id: string, field: keyof PeritonitisEpisode, value: string) => {
    setPeritonitisEpisodes((prev) => {
      const updated = prev.map((ep) => (ep.id === id ? { ...ep, [field]: value } : ep));
      onUpdatePeritonitis(updated);
      return updated;
    });
  };

  const removePeritonitisEpisode = (id: string) => {
    setPeritonitisEpisodes((prev) => {
      const updated = prev.filter((ep) => ep.id !== id);
      onUpdatePeritonitis(updated);
      return updated;
    });
  };

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

    setExitSiteEpisodes((prev) => {
      const updated = [...prev, newEpisode];
      onUpdateExitSite(updated);
      return updated;
    });
  };

  const updateExitSiteEpisode = (id: string, field: keyof ExitSiteEpisode, value: string) => {
    setExitSiteEpisodes((prev) => {
      const updated = prev.map((ep) => (ep.id === id ? { ...ep, [field]: value } : ep));
      onUpdateExitSite(updated);
      return updated;
    });
  };

  const removeExitSiteEpisode = (id: string) => {
    setExitSiteEpisodes((prev) => {
      const updated = prev.filter((ep) => ep.id !== id);
      onUpdateExitSite(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="peritonitis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="peritonitis">Peritonitis History</TabsTrigger>
          <TabsTrigger value="exitsite">Exit Site Infections</TabsTrigger>
        </TabsList>

        {/* PERITONITIS TAB */}
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
                              updatePeritonitisEpisode(
                                episode.id,
                                "capdFullReports",
                                e.target.value
                              )
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
                              updatePeritonitisEpisode(
                                episode.id,
                                "antibioticSensitivity",
                                e.target.value
                              )
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
                              updatePeritonitisEpisode(
                                episode.id,
                                "managementAntibiotic",
                                e.target.value
                              )
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
                              updatePeritonitisEpisode(
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
                              updatePeritonitisEpisode(
                                episode.id,
                                "reasonForPeritonitis",
                                e.target.value
                              )
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

        {/* EXIT SITE TAB */}
        <TabsContent value="exitsite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* Tailwind doesn't include 'text-warning' by default; use amber tone if needed */}
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
                              updateExitSiteEpisode(
                                episode.id,
                                "numberOfEpisodes",
                                e.target.value
                              )
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
      </Tabs>
    </div>
  );
};

export default InfectionTracking;
