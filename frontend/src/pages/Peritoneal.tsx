import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, UserPlus, FileText, Clipboard, TrendingUp, AlertTriangle } from "lucide-react";
import PatientRegistration from "@/components/PatientRegistration";
import DataPreview from "@/components/DataPreview";
import CAPDSummary from "@/components/CAPDSummary";
import MonthlyAssessment from "@/components/MonthlyAssessment";
import InfectionTracking, { PeritonitisEpisode, ExitSiteEpisode, TunnelEpisode } from "@/components/InfectionTracking";
import { usePatientContext } from "@/context/PatientContext";
import { capdSummaryApi } from "@/services/capdSummaryApi";
import { infectionTrackingApi } from "@/services/infectionTrackingApi";

type ActiveView =
  | "dashboard"
  | "register"
  | "preview"
  | "capd-summary"
  | "monthly-assessment"
  | "complications";

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
  peritonitisHistory: PeritonitisEpisode[];
  exitSiteInfections: ExitSiteEpisode[];
  tunnelInfections: TunnelEpisode[]; // persisted here
}

const Peritoneal = () => {
  const { patient } = usePatientContext();
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [capdData, setCapdData] = useState<CAPDData | null>(null);

  // Load data based on PHN when patient is selected
  useEffect(() => {
    const loadPatientData = async () => {
      const phn = patient?.phn;
      if (!phn) {
        setCapdData(null);
        return;
      }

      try {
        // Fetch all data for this patient
        const [registrationResponse, capdData, infectionData] = await Promise.all([
          fetch(`http://localhost:8081/api/patient-registration/${phn}`),
          capdSummaryApi.getByPatientId(phn).catch(() => null),
          infectionTrackingApi.getByPatientId(phn).catch(() => null),
        ]);

        const registrationData = registrationResponse.ok ? await registrationResponse.json() : null;
        const capdSummaryData = capdData;

        // Combine all data
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
            peritonitisHistory: infectionData?.peritonitisHistory || [],
            exitSiteInfections: infectionData?.exitSiteInfections || [],
            tunnelInfections: infectionData?.tunnelInfections || [],
          };
          setCapdData(combinedData);
        } else {
          setCapdData(null);
        }
      } catch (error) {
        console.error("Failed to load patient data:", error);
        setCapdData(null);
      }
    };

    loadPatientData();
  }, [patient?.phn]);

  const persistCAPD = (data: CAPDData) => {
    // Data is now saved via API calls in individual components (CAPDSummary, InfectionTracking, etc.)
    // This function is kept for backward compatibility but data is persisted via backend
    setCapdData(data);
  };

  const handleCAPDSubmit = async (data: CAPDData) => {
    // Data is saved via API in CAPDSummary component
    // Refresh data from backend when going to preview
    const phn = patient?.phn;
    if (phn) {
      try {
        const [registrationResponse, capdData, infectionData] = await Promise.all([
          fetch(`http://localhost:8081/api/patient-registration/${phn}`),
          capdSummaryApi.getByPatientId(phn).catch(() => null),
          infectionTrackingApi.getByPatientId(phn).catch(() => null),
        ]);

        const registrationData = registrationResponse.ok ? await registrationResponse.json() : null;
        const capdSummaryData = capdData;

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
            peritonitisHistory: infectionData?.peritonitisHistory || [],
            exitSiteInfections: infectionData?.exitSiteInfections || [],
            tunnelInfections: infectionData?.tunnelInfections || [],
          };
          setCapdData(combinedData);
        }
      } catch (error) {
        console.error("Failed to refresh data:", error);
      }
    }
    setActiveView("preview");
  };

  // ---------- Complications View (Peritonitis + Exit-site + Tunnel all in tabs) ----------
  const ComplicationsView = () => {
    const [peritonitis, setPeritonitis] = useState<PeritonitisEpisode[]>(capdData?.peritonitisHistory ?? []);
    const [exitSite, setExitSite] = useState<ExitSiteEpisode[]>(capdData?.exitSiteInfections ?? []);
    const [tunnel, setTunnel] = useState<TunnelEpisode[]>(capdData?.tunnelInfections ?? []);
    const [activeTab, setActiveTab] = useState<string>("peritonitis");

    // Load infection data when patient changes
    useEffect(() => {
      const phn = patient?.phn;
      if (!phn) {
        setPeritonitis([]);
        setExitSite([]);
        setTunnel([]);
        return;
      }

      const loadInfectionData = async () => {
        try {
          const data = await infectionTrackingApi.getByPatientId(phn);
          setPeritonitis(data?.peritonitisHistory || []);
          setExitSite(data?.exitSiteInfections || []);
          setTunnel(data?.tunnelInfections || []);
        } catch (error) {
          console.error("Failed to load infection data:", error);
        }
      };

      loadInfectionData();
    }, [patient?.phn]);

    // Update local state when capdData changes
    useEffect(() => {
      if (capdData) {
        setPeritonitis(capdData.peritonitisHistory || []);
        setExitSite(capdData.exitSiteInfections || []);
        setTunnel(capdData.tunnelInfections || []);
      }
    }, [capdData]);

    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Complications</h2>
          <p className="text-muted-foreground">Peritonitis, Exit-site, and Tunnel infection tracking (synced with CAPD Summary)</p>
        </div>

        {/* All three tabs handled inside InfectionTracking */}
        <InfectionTracking
          peritonitisHistory={peritonitis}
          exitSiteInfections={exitSite}
          tunnelInfections={tunnel}                 // ⬅️ NEW
          onUpdatePeritonitis={setPeritonitis}
          onUpdateExitSite={setExitSite}
          onUpdateTunnel={setTunnel}               // ⬅️ NEW
          onTabChange={setActiveTab}                // ⬅️ NEW
        />

        <div className="flex justify-between items-center gap-3">
          <Button variant="default" onClick={() => setActiveView("dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "register":
        return <PatientRegistration onComplete={() => setActiveView("dashboard")} />;

      case "capd-summary":
        return <CAPDSummary onSubmit={handleCAPDSubmit} />;

      case "preview":
        return <DataPreview capdData={capdData} onBack={() => setActiveView("capd-summary")} />;

      case "monthly-assessment":
        return <MonthlyAssessment onComplete={() => setActiveView("dashboard")} />;

      case "complications":
        return <ComplicationsView />;

      default:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Activity className="w-8 h-8 text-primary " />
              </div>
              <h1 className="text-4xl font-bold text-foreground dark:text-slate-200">Peritoneal Dialysis</h1>
              {patient?.phn ? (
                <div className="inline-flex items-center justify-center gap-2 text-lg text-green-600 bg-green-50 px-4 py-2 rounded-full">
                  <span>Patient: {patient.name} (PHN: {patient.phn})</span>
                </div>
              ) : (
                <div className="inline-flex items-center justify-center gap-2 text-lg text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
                </div>
              )}
            </div>

            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Patient Registration */}
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <UserPlus className="w-10 h-10 text-primary mb-2" />
                  <CardTitle className="text-xl font-medium mb-4">Basic Information</CardTitle>
                </div>
                <Button 
                  className="w-full px-6 py-2 text-base" 
                  onClick={() => setActiveView("register")}
                >
                  Access
                </Button>
              </Card>

              {/* CAPD Summary */}
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <Clipboard className="w-10 h-10 text-primary mb-2" />
                  <CardTitle className="text-xl font-medium mb-4">PET / Adequacy Test</CardTitle>
                </div>
                <Button 
                  className="w-full px-6 py-2 text-base" 
                  onClick={() => setActiveView("capd-summary")}
                >
                  Access
                </Button>
              </Card>

              {/* View Results */}
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <FileText className="w-10 h-10 text-primary mb-2" />
                  <CardTitle className="text-xl font-medium mb-4">View Results</CardTitle>
                </div>
                <Button 
                  className="w-full px-6 py-2 text-base" 
                  onClick={() => setActiveView("preview")}
                  disabled={!patient?.phn}
                >
                  Access
                </Button>
              </Card>

              {/* Monthly Assessment */}
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="w-10 h-10 text-primary mb-2" />
                  <CardTitle className="text-xl font-medium mb-4">Monthly Assessment</CardTitle>
                </div>
                <Button 
                  className="w-full px-6 py-2 text-base" 
                  onClick={() => setActiveView("monthly-assessment")}
                >
                  Access
                </Button>
              </Card>

              {/* Complications */}
              <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <AlertTriangle className="w-10 h-10 text-primary mb-2" />
                  <CardTitle className="text-xl font-medium mb-4">Complications</CardTitle>
                </div>
                <Button 
                  className="w-full px-6 py-2 text-base" 
                  onClick={() => setActiveView("complications")}
                >
                  Access
                </Button>
              </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 dark:bg-slate-950/50 dark:border-slate-800">
        <div className="fixed top-4 right-4 z-50">
          {activeView !== "dashboard" && (
            <Button variant="default" onClick={() => setActiveView("dashboard")}>
                Back to Dashboard
              </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
};

export default Peritoneal;
