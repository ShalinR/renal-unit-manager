import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ArrowLeft, AlertCircle, Stethoscope, RefreshCw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { usePatientContext } from "@/context/PatientContext";

interface CAPDData {
  counsellingDate: string;
  catheterInsertionDate: string;
  insertionDoneBy: string;
  insertionPlace: string;
  technique: string;
  designation: string;
  firstFlushing: string;
  secondFlushing: string;
  thirdFlushing: string;
  initiationDate: string;
  petResults: {
    first: { date: string; data: any };
    second: { date: string; data: any };
    third: { date: string; data: any };
  };
  adequacyResults: {
    first: { date: string; data: any };
    second: { date: string; data: any };
    third: { date: string; data: any };
  };
  exitSiteInfections: any[];
  tunnelInfections: any[];
}

interface DataPreviewProps {
  capdData: CAPDData | null;
  onBack: () => void;
}

const DataPreview = ({ capdData: propCapdData, onBack }: DataPreviewProps) => {
  const { patient } = usePatientContext();
  const [capdData, setCapdData] = useState<CAPDData | null>(propCapdData);
  const [isLoading, setIsLoading] = useState(!propCapdData);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key to force re-render
  
  // Use PHN from patient context
  const phn = patient?.phn;
  const CAPD_API_URL = phn ? `http://localhost:8081/api/capd-summary/${phn}` : null;
  const REGISTRATION_API_URL = phn ? `http://localhost:8081/api/patient-registration/${phn}` : null;
  const INFECTION_API_URL = phn ? `http://localhost:8081/api/infection-tracking/${phn}` : null;

  // Fetch data from backend on mount to ensure we have the latest data
  useEffect(() => {
    const fetchData = async () => {
      if (!phn) {
        // If no PHN, use prop data or show empty
        if (propCapdData) {
          setCapdData(propCapdData);
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch patient registration, CAPD summary, and infection tracking
        const [registrationResponse, capdResponse, infectionResponse] = await Promise.all([
          REGISTRATION_API_URL ? fetch(REGISTRATION_API_URL) : Promise.resolve({ ok: false } as Response),
          CAPD_API_URL ? fetch(CAPD_API_URL) : Promise.resolve({ ok: false } as Response),
          INFECTION_API_URL ? fetch(INFECTION_API_URL) : Promise.resolve({ ok: false } as Response),
        ]);

        const registrationData = registrationResponse.ok ? await registrationResponse.json() : null;
        const capdSummaryData = capdResponse.ok ? await capdResponse.json() : null;
        const infectionData = infectionResponse.ok ? await infectionResponse.json() : null;

        // Combine all datasets - basic info from registration, test results from CAPD summary, infections from infection tracking
        if (registrationData || capdSummaryData || infectionData) {
          const combinedData: CAPDData = {
            counsellingDate: registrationData?.counsellingDate || capdSummaryData?.counsellingDate || "",
            catheterInsertionDate: registrationData?.catheterInsertionDate || capdSummaryData?.catheterInsertionDate || "",
            insertionDoneBy: registrationData?.insertionDoneBy || capdSummaryData?.insertionDoneBy || "",
            insertionPlace: registrationData?.insertionPlace || capdSummaryData?.insertionPlace || "",
            technique: registrationData?.technique || capdSummaryData?.technique || "",
            designation: registrationData?.designation || capdSummaryData?.designation || "",
            firstFlushing: registrationData?.firstFlushing || capdSummaryData?.firstFlushing || "",
            secondFlushing: registrationData?.secondFlushing || capdSummaryData?.secondFlushing || "",
            thirdFlushing: registrationData?.thirdFlushing || capdSummaryData?.thirdFlushing || "",
            initiationDate: registrationData?.initiationDate || capdSummaryData?.initiationDate || "",
            petResults: capdSummaryData?.petResults || {
              first: { date: "", data: null },
              second: { date: "", data: null },
              third: { date: "", data: null },
            },
            adequacyResults: capdSummaryData?.adequacyResults || {
              first: { date: "", data: null },
              second: { date: "", data: null },
              third: { date: "", data: null },
            },
            exitSiteInfections: infectionData?.exitSiteInfections || capdSummaryData?.exitSiteInfections || [],
            tunnelInfections: infectionData?.tunnelInfections || capdSummaryData?.tunnelInfections || [],
          };
          setCapdData(combinedData);
          console.log("DataPreview: Loaded data from backend for PHN:", phn, combinedData);
          // Force refresh of infection tracking section
          setRefreshKey(prev => prev + 1);
        } else if (propCapdData) {
          // Use prop data if backend has no data
          setCapdData(propCapdData);
          setRefreshKey(prev => prev + 1);
        }
      } catch (error) {
        console.error("Error fetching data in DataPreview:", error);
        // Fallback to prop data if fetch fails
        if (propCapdData) {
          setCapdData(propCapdData);
        }
        setRefreshKey(prev => prev + 1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [phn, propCapdData]);

  // Update local state when prop changes
  useEffect(() => {
    if (propCapdData) {
      setCapdData(propCapdData);
    }
  }, [propCapdData]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4 py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
          <FileText className="w-6 h-6 text-muted-foreground animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold">Loading CAPD Data...</h2>
        <p className="text-muted-foreground">Please wait while we fetch your data.</p>
      </div>
    );
  }

  if (!capdData) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold">No CAPD Data Available</h2>
        <p className="text-muted-foreground">
          Please fill in CAPD Summary to view the preview.
        </p>
        <Button onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  // Safe access helpers for optional nested metrics
  const get = (obj: any, path: string, fallback: any = "—") => {
    try {
      return path.split(".").reduce((o, k) => (o?.[k]), obj) ?? fallback;
    } catch {
      return fallback;
    }
  };

  // Scroll helper to jump to a specific PET test card
  const scrollToTest = (key: string) => {
    const el = document.getElementById(`pet-${key}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">CAPD Summary Preview</h2>
        <p className="text-muted-foreground">Comprehensive patient dialysis summary</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="default" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to CAPD Summary
        </Button>
        {/* <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button> */}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Key milestones & catheter information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Counselling Date</p>
            <p className="font-semibold">{capdData.counsellingDate || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Initiation Date</p>
            <p className="font-semibold">{capdData.initiationDate || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Catheter Insertion Date</p>
            <p className="font-semibold">{capdData.catheterInsertionDate || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Insertion Done By</p>
            <p className="font-semibold">{capdData.insertionDoneBy || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Designation</p>
            <p className="font-semibold">{capdData.designation || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Insertion Place</p>
            <p className="font-semibold">{capdData.insertionPlace || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Technique</p>
            <p className="font-semibold">{capdData.technique || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">1st Flushing</p>
            <p className="font-semibold">{capdData.firstFlushing || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">2nd Flushing</p>
            <p className="font-semibold">{capdData.secondFlushing || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">3rd Flushing</p>
            <p className="font-semibold">{capdData.thirdFlushing || "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick list of past PET tests for easy access */}
      <Card>
        <CardHeader>
          <CardTitle>Past PET Test Records</CardTitle>
          <CardDescription>Quick access to previously recorded PET tests</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 items-center">
          {(["first", "second", "third"] as const).map((key) => {
            const entry = get(capdData.petResults, `${key}`, null);
            // Show if entry exists and has either date or data
            if (!entry || (!entry.date && !entry.data)) return null;
            return (
              <button
                key={key}
                onClick={() => scrollToTest(key)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded hover:bg-muted transition"
                title={`Jump to ${key} PET Test`}
              >
                <span className="capitalize">{key}</span>
                <Badge>{entry.date || "No date"}</Badge>
              </button>
            );
          })}

          {(["first", "second", "third"] as const).every(key => {
            const entry = get(capdData.petResults, `${key}`, null);
            return !entry || (!entry.date && !entry.data);
          }) && <p className="text-sm text-muted-foreground w-full">No PET tests recorded yet.</p>}
        </CardContent>
      </Card>

      {/* PET Tests */}
      <Card>
        <CardHeader>
          <CardTitle>PET Tests</CardTitle>
          <CardDescription>Peritoneal Equilibration Test Results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(["first", "second", "third"] as const).map((key) => {
            const testEntry = get(capdData.petResults, key, null);
            // Show test if it has data, even if date is missing
            if (!testEntry || (!testEntry.date && !testEntry.data)) return null;
            
            const petData = testEntry.data;
            return (
              <div id={`pet-${key}`} key={key} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-primary capitalize mb-1">{key} PET Test</p>
                    <p className="text-xs text-muted-foreground">Date: {testEntry.date || "Not specified"}</p>
                  </div>
                 <div>
                   <Button variant="ghost" onClick={() => scrollToTest(key)} className="text-xs">Scroll to</Button>
                 </div>
                </div>
                
                {petData ? (
                  <div className="space-y-4">
                    {/* Time Point Measurements Table */}
                    {petData.measurements && (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border text-sm">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="border border-border p-2 text-left">Time</th>
                              <th className="border border-border p-2 text-left">Dialysate Cr (mg/dL)</th>
                              <th className="border border-border p-2 text-left">Dialysate Glu (mg/dL)</th>
                              <th className="border border-border p-2 text-left">Serum Cr (mg/dL)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {["t0", "t1", "t2", "t3", "t4"].map((time) => {
                              const measurement = petData.measurements[time];
                              if (!measurement) return null;
                              return (
                                <tr key={time}>
                                  <td className="border border-border p-2 font-medium">{time.toUpperCase()}</td>
                                  <td className="border border-border p-2">{measurement.dialysateCreatinine || "—"}</td>
                                  <td className="border border-border p-2">{measurement.dialysateGlucose || "—"}</td>
                                  <td className="border border-border p-2">{measurement.serumCreatinine || "—"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {/* Calculated Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 border rounded p-3">
                        <p className="text-sm font-semibold">Creatinine Analysis</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">D/P Creatinine:</span>
                            <Badge variant={petData.dpCreatinine ? "default" : "secondary"}>
                              {petData.dpCreatinine || "Not calculated"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Classification:</span>
                            <Badge variant={petData.creatinineClassification ? "default" : "secondary"}>
                              {petData.creatinineClassification || "—"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 border rounded p-3">
                        <p className="text-sm font-semibold">Glucose Analysis</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">D/D0 Glucose:</span>
                            <Badge variant={petData.dd0Glucose ? "default" : "secondary"}>
                              {petData.dd0Glucose || "Not calculated"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Classification:</span>
                            <Badge variant={petData.glucoseClassification ? "default" : "secondary"}>
                              {petData.glucoseClassification || "—"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No measurement data available for this test.
                  </p>
                )}
              </div>
            );
          })}
          
          {(["first", "second", "third"] as const).every(key => {
            const testEntry = get(capdData.petResults, key, null);
            return !testEntry || (!testEntry.date && !testEntry.data);
          }) && (
            <p className="text-center text-muted-foreground py-8">No PET test results recorded yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Adequacy Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Adequacy Tests (Kt/V)</CardTitle>
          <CardDescription>Dialysis Adequacy Test Results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(["first", "second", "third"] as const).map((key) => {
            const testEntry = get(capdData.adequacyResults, key, null);
            // Show test if it has data, even if date is missing
            if (!testEntry || (!testEntry.date && !testEntry.data)) return null;
            
            const adequacyData = testEntry.data;
            return (
              <div key={key} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-primary capitalize mb-1">{key} Adequacy Test</p>
                    <p className="text-xs text-muted-foreground">Date: {testEntry.date || "Not specified"}</p>
                  </div>
                </div>
                
                {adequacyData ? (
                  <div className="space-y-4">
                    {/* Input Parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 border rounded p-3">
                        <p className="text-sm font-semibold">Input Parameters</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Patient Name:</span>
                            <span className="font-medium">{adequacyData.patientName || "—"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Body Weight:</span>
                            <span className="font-medium">{adequacyData.bodyWeight || "—"} kg</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Dialysate Urea Volume:</span>
                            <span className="font-medium">{adequacyData.dialysateUreaVolume || "—"} L</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Urine Urea Volume:</span>
                            <span className="font-medium">{adequacyData.urineUreaVolume || "—"} L</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Blood Urea:</span>
                            <span className="font-medium">{adequacyData.bloodUrea || "—"} mg/dL</span>
                          </div>
                        </div>
                      </div>

                      {/* Calculated Results */}
                      <div className="space-y-2 border rounded p-3">
                        <p className="text-sm font-semibold">Calculated Results</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">V Value:</span>
                            <Badge variant="secondary">
                              {adequacyData.vValue ? `${adequacyData.vValue} L` : "—"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Peritoneal Kt/V:</span>
                            <Badge variant="secondary">
                              {adequacyData.peritonealKtV || "—"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Renal Kt/V:</span>
                            <Badge variant="secondary">
                              {adequacyData.renalKtV || "—"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Total Kt/V:</span>
                            <Badge variant={adequacyData.totalKtV && parseFloat(adequacyData.totalKtV) >= 1.7 ? "default" : "destructive"}>
                              {adequacyData.totalKtV || "—"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Adequacy Status:</span>
                            <Badge variant={adequacyData.isAdequate === true ? "default" : 
                                     adequacyData.isAdequate === false ? "destructive" : "secondary"}>
                              {adequacyData.isAdequate === true ? "✓ Adequate" :
                               adequacyData.isAdequate === false ? "✗ Not Adequate" : "Not assessed"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No adequacy data available for this test.
                  </p>
                )}
              </div>
            );
          })}
          
          {(["first", "second", "third"] as const).every(key => {
            const testEntry = get(capdData.adequacyResults, key, null);
            return !testEntry || (!testEntry.date && !testEntry.data);
          }) && (
            <p className="text-center text-muted-foreground py-8">No adequacy test results recorded yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Infection Tracking */}
      {phn && <InfectionTrackingSection key={refreshKey} patientId={phn} refreshKey={refreshKey} />}

      {/* Footer actions */}
      <div className="flex justify-center gap-4 pt-6">
        <Button variant="default" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit CAPD Summary
        </Button>
      </div>
    </div>
  );
};

// Infection Tracking Section Component
const InfectionTrackingSection = ({ patientId, refreshKey }: { patientId: string; refreshKey?: number }) => {
  const [infections, setInfections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const INFECTION_API_URL = `http://localhost:8081/api/infection-tracking/${patientId}`;

  const fetchInfections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Fetching infections from:", INFECTION_API_URL);
      console.log("🔑 Patient ID:", patientId);
      
      const response = await fetch(INFECTION_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache", // Ensure we get fresh data
      });
      
      console.log("📡 Response status:", response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Fetched infections data:", data);
        console.log("📊 Number of infections:", Array.isArray(data) ? data.length : 0);
        
        if (Array.isArray(data)) {
          console.log("📋 Infection types found:", data.map(inf => ({
            type: inf?.infectionType,
            id: inf?.id,
            date: inf?.episodeDate
          })));
          
          setInfections(data);
        } else {
          console.warn("⚠️ Response is not an array:", data);
          setInfections([]);
        }
      } else if (response.status === 404) {
        // 404 is okay - just means no data exists yet
        console.log("ℹ️ No infection data found (404) - this is normal if no data has been saved yet");
        setInfections([]);
        setError(null); // Don't show error for 404
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to fetch infections. Status:", response.status, "Error:", errorText);
        setError(`Failed to load infections: ${response.status}`);
        setInfections([]);
      }
    } catch (error) {
      console.error("💥 Error fetching infections:", error);
      setError("Failed to fetch infection data. Please check your connection.");
      setInfections([]);
    } finally {
      setLoading(false);
    }
  }, [INFECTION_API_URL, patientId]);

  useEffect(() => {
    // Always fetch when component mounts, refreshKey changes, or patientId changes
    console.log("🔄 InfectionTrackingSection: Fetching infections", {
      refreshKey,
      patientId,
      url: INFECTION_API_URL
    });
    fetchInfections();
  }, [fetchInfections, refreshKey, patientId]);

  // Filter episodes - handle case variations and null/undefined values
  const peritonitisEpisodes = infections.filter(inf => {
    const type = inf?.infectionType?.toUpperCase()?.trim();
    return type === "PERITONITIS";
  });
  
  const exitSiteEpisodes = infections.filter(inf => {
    const type = inf?.infectionType?.toUpperCase()?.trim();
    return type === "EXIT_SITE";
  });
  
  const tunnelEpisodes = infections.filter(inf => {
    const type = inf?.infectionType?.toUpperCase()?.trim();
    return type === "TUNNEL";
  });

  // Helper function to convert backend DTOs to frontend episodes
  const convertToPeritonitisEpisodes = (dtos: any[]): any[] => {
    return dtos
      .filter(dto => dto.infectionType === "PERITONITIS")
      .map(dto => ({
        id: dto.id?.toString() || Date.now().toString(),
        episodeDate: dto.episodeDate || "",
        capdFullReports: dto.capdFullReports || "",
        capdCulture: dto.capdCulture || "",
        antibioticSensitivity: dto.antibioticSensitivity || "",
        managementAntibiotic: dto.managementAntibiotic || "",
        managementType: dto.managementType || "",
        managementDuration: dto.managementDuration || "",
        outcome: dto.outcome || "",
        reasonForPeritonitis: dto.reasonForPeritonitis || "",
        assessmentByNO: dto.assessmentByNO || "",
      }));
  };

  const convertToExitSiteEpisodes = (dtos: any[]): any[] => {
    return dtos
      .filter(dto => dto.infectionType === "EXIT_SITE")
      .map(dto => ({
        id: dto.id?.toString() || Date.now().toString(),
        dateOnset: dto.dateOnset || dto.episodeDate || "",
        numberOfEpisodes: dto.numberOfEpisodes || "",
        investigationCulture: dto.investigationCulture || "",
        investigationExitSite: dto.investigationExitSite || "",
        investigationOther: dto.investigationOther || "",
        managementAntibiotic: dto.managementAntibiotic || "",
        managementType: dto.managementType || "",
        managementDuration: dto.managementDuration || "",
        hospitalizationDuration: dto.hospitalizationDuration || "",
        reasonForInfection: dto.reasonForInfection || "",
        specialRemarks: dto.specialRemarks || "",
        assessmentByNO: dto.assessmentByNO || "",
        assessmentByDoctor: dto.assessmentByDoctor || "",
      }));
  };

  const convertToTunnelEpisodes = (dtos: any[]): any[] => {
    return dtos
      .filter(dto => dto.infectionType === "TUNNEL")
      .map(dto => ({
        id: dto.id?.toString() || Date.now().toString(),
        date: dto.episodeDate || "",
        cultureReport: dto.cultureReport || "",
        treatment: dto.treatment || "",
        remarks: dto.remarks || "",
      }));
  };

  // Debug logging
  useEffect(() => {
    console.log("🔍 Infection Tracking Debug:", {
      totalInfections: infections.length,
      peritonitisCount: peritonitisEpisodes.length,
      exitSiteCount: exitSiteEpisodes.length,
      tunnelCount: tunnelEpisodes.length,
      infectionTypes: infections.map(inf => inf?.infectionType),
    });
  }, [infections, peritonitisEpisodes.length, exitSiteEpisodes.length, tunnelEpisodes.length]);

  if (loading && infections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Infection Tracking</CardTitle>
          <CardDescription>Loading infection records...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && infections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Infection Tracking</CardTitle>
          <CardDescription>Error loading infection records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
            <p className="text-sm text-destructive mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchInfections}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Infection Tracking</CardTitle>
            <CardDescription>Detailed records of infection episodes</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchInfections}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-destructive">{peritonitisEpisodes.length}</p>
            <p className="text-sm text-muted-foreground">Peritonitis Episodes</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-amber-600">{exitSiteEpisodes.length}</p>
            <p className="text-sm text-muted-foreground">Exit Site Infections</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-primary">{tunnelEpisodes.length}</p>
            <p className="text-sm text-muted-foreground">Tunnel Infections</p>
          </div>
        </div>

        {/* Peritonitis Episodes Section */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Peritonitis Episodes
            </h3>
            <Badge variant="outline" className="text-sm">
              {peritonitisEpisodes.length} {peritonitisEpisodes.length === 1 ? 'Episode' : 'Episodes'}
            </Badge>
          </div>
          
          {peritonitisEpisodes.length > 0 ? (
            <div className="space-y-4">
              {peritonitisEpisodes.map((episode, index) => (
                <Card key={episode.id || index} className="border-destructive/20 shadow-sm">
                  <CardHeader className="pb-3 bg-destructive/5">
                    <CardTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-sm">Episode {index + 1}</Badge>
                        {episode.episodeDate && (
                          <span className="text-sm text-muted-foreground font-normal">
                            Date: {episode.episodeDate}
                          </span>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {/* Investigation Details */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Investigation Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">PD Full Reports</p>
                          <p className="text-sm font-medium break-words whitespace-pre-wrap">
                            {episode.capdFullReports || "—"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">PD Culture</p>
                          <p className="text-sm font-medium">
                            {episode.capdCulture || "—"}
                          </p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-xs text-muted-foreground font-medium">Antibiotic Sensitivity</p>
                          <p className="text-sm font-medium">
                            {episode.antibioticSensitivity || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Management Details */}
                    <div className="space-y-3 border-t pt-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Management Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Antibiotic</p>
                          <p className="text-sm font-medium">
                            {episode.managementAntibiotic || "—"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Type</p>
                          <p className="text-sm font-medium">
                            {episode.managementType || "—"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Duration</p>
                          <p className="text-sm font-medium">
                            {episode.managementDuration || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Outcome & Assessment */}
                    <div className="space-y-3 border-t pt-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Outcome & Assessment</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Outcome</p>
                          <p className="text-sm font-medium">
                            {episode.outcome || "—"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Reason for Peritonitis</p>
                          <p className="text-sm font-medium">
                            {episode.reasonForPeritonitis || "—"}
                          </p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-xs text-muted-foreground font-medium">Assessment by N/O</p>
                          <p className="text-sm font-medium break-words whitespace-pre-wrap">
                            {episode.assessmentByNO || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No peritonitis episodes recorded yet.</p>
            </div>
          )}
        </div>

        {/* Exit Site Infections */}
        {exitSiteEpisodes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-amber-600" />
              Exit Site Infection Episodes
            </h3>
            {exitSiteEpisodes.map((episode, index) => (
              <Card key={episode.id || index} className="border-amber-300/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="secondary">Episode {index + 1}</Badge>
                    <span className="text-sm text-muted-foreground">Date: {episode.dateOnset || episode.episodeDate || "N/A"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-muted-foreground">Number of Episodes</p>
                      <p className="font-medium">{episode.numberOfEpisodes || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Exit Site Swab Culture</p>
                      <p className="font-medium">{episode.investigationExitSite || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Other Investigations</p>
                      <p className="font-medium">{episode.investigationOther || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Management - Antibiotic</p>
                      <p className="font-medium">{episode.managementAntibiotic || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{episode.managementType || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{episode.managementDuration || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reason for Infection</p>
                      <p className="font-medium">{episode.reasonForInfection || "—"}</p>
                    </div>
                    {episode.specialRemarks && (
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground">Special Remarks</p>
                        <p className="font-medium">{episode.specialRemarks}</p>
                      </div>
                    )}
                    {episode.assessmentByNO && (
                      <div>
                        <p className="text-muted-foreground">Assessment by N/O</p>
                        <p className="font-medium">{episode.assessmentByNO}</p>
                      </div>
                    )}
                    {episode.assessmentByDoctor && (
                      <div>
                        <p className="text-muted-foreground">Assessment by Doctor</p>
                        <p className="font-medium">{episode.assessmentByDoctor}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tunnel Infections */}
        {tunnelEpisodes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Tunnel Infection Records
            </h3>
            {tunnelEpisodes.map((episode, index) => (
              <Card key={episode.id || index} className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge>Record {index + 1}</Badge>
                    <span className="text-sm text-muted-foreground">Date: {episode.episodeDate || "N/A"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-muted-foreground">Culture Report</p>
                      <p className="font-medium">{episode.cultureReport || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Treatment</p>
                      <p className="font-medium">{episode.treatment || "—"}</p>
                    </div>
                    {episode.remarks && (
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground">Remarks</p>
                        <p className="font-medium">{episode.remarks}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {infections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No infection episodes recorded yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPreview;
