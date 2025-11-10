import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, UserPlus, FileText, Clipboard, TrendingUp, AlertTriangle } from "lucide-react";
import PatientRegistration from "@/components/PatientRegistration";
import DataPreview from "@/components/DataPreview";
import CAPDSummary from "@/components/CAPDSummary";
import MonthlyAssessment from "@/components/MonthlyAssessment";
import InfectionTracking, { PeritonitisEpisode, ExitSiteEpisode, TunnelEpisode } from "@/components/InfectionTracking";

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
  exitSiteInfections: ExitSiteEpisode[];
  tunnelInfections: TunnelEpisode[];
}

const STORAGE_KEY = "capdSummary";

const Peritoneal = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [capdData, setCapdData] = useState<CAPDData | null>(null);
  const patientId = "patient-123"; // Match the patientId from CAPDSummary
  const CAPD_API_URL = `http://localhost:8081/api/capd-summary/${patientId}`;
  const REGISTRATION_API_URL = `http://localhost:8081/api/patient-registration/${patientId}`;

  // Fetch data from backend when viewing preview or loading component
  const fetchData = async () => {
    try {
      // Fetch both patient registration and CAPD summary
      const [registrationResponse, capdResponse] = await Promise.all([
        fetch(REGISTRATION_API_URL),
        fetch(CAPD_API_URL)
      ]);

      const registrationData = registrationResponse.ok ? await registrationResponse.json() : null;
      const capdSummaryData = capdResponse.ok ? await capdResponse.json() : null;

      // Combine both datasets
      if (registrationData || capdSummaryData) {
        const combinedData = {
          ...registrationData,
          ...capdSummaryData,
        };
        setCapdData(combinedData);
        // Also save to localStorage for backward compatibility
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedData));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
        return;
      }

      // Fallback to localStorage if no data from backend
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCapdData(JSON.parse(raw));
    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      // Fallback to localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setCapdData(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to load from localStorage:", e);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [CAPD_API_URL, REGISTRATION_API_URL]);

  // Refresh data when switching to preview view
  useEffect(() => {
    if (activeView === "preview") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);

  const persistCAPD = (data: CAPDData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save CAPD summary:", e);
    }
    setCapdData(data);
  };

  const handleCAPDSubmit = async (data: CAPDData) => {
    // Refresh data from backend when going to preview to get the latest saved data
    await fetchData();
    setActiveView("preview");
  };

  // ---------- Complications View (Exit-site + Tunnel all in tabs) ----------
  const ComplicationsView = () => {
    const [exitSite, setExitSite] = useState<ExitSiteEpisode[]>([]);
    const [tunnel, setTunnel] = useState<TunnelEpisode[]>([]);
    const [activeTab, setActiveTab] = useState<string>("exit-site");

    // Auto-save to localStorage when data changes
    useEffect(() => {
      const base: CAPDData =
        capdData ?? {
          counsellingDate: "",
          catheterInsertionDate: "",
          insertionDoneBy: "",
          insertionPlace: "",
          technique: "",
          designation: "",
          firstFlushing: "",
          secondFlushing: "",
          thirdFlushing: "",
          initiationDate: "",
          petResults: { first: { date: "", data: null }, second: { date: "", data: null }, third: { date: "", data: null } },
          adequacyResults: { first: { date: "", data: null }, second: { date: "", data: null }, third: { date: "", data: null } },
          exitSiteInfections: [],
          tunnelInfections: [],
        };

      const updated: CAPDData = {
        ...base,
        exitSiteInfections: exitSite,
        tunnelInfections: tunnel,
      };
      persistCAPD(updated);
    }, [exitSite, tunnel]);

    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Complications</h2>
          <p className="text-muted-foreground">Peritonitis, Exit-site and Tunnel infection tracking</p>
        </div>

        {/* All tabs handled inside InfectionTracking */}
        <InfectionTracking
          peritonitisHistory={[]}
          exitSiteInfections={exitSite}
          tunnelInfections={tunnel}
          onUpdatePeritonitis={() => {}}
          onUpdateExitSite={setExitSite}
          onUpdateTunnel={setTunnel}
          onTabChange={setActiveTab}
          showPeritonitis={true}
        />

        <div className="flex justify-between items-center gap-3">
          <Button variant="default" onClick={() => setActiveView("dashboard")}>Back</Button>
          <p className="text-sm text-muted-foreground">
            Data is automatically saved. Go to Preview page to save to database.
          </p>
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
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Peritoneal Dialysis</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Patient Registration */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("register")}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Register new patients in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">Register Patient</Button>
                </CardContent>
              </Card>

              {/* CAPD Summary */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("capd-summary")}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Clipboard className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>PET / Adequacy Test</CardTitle>
                  <CardDescription>Complete patient dialysis summary with PET &amp; adequacy tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">CAPD Summary</Button>
                </CardContent>
              </Card>

              {/* View Results */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("preview")}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>View Results</CardTitle>
                  <CardDescription>Open the latest saved CAPD summary &amp; reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline" disabled={!capdData}>
                    {capdData ? "Open Preview" : "No Saved Results"}
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Assessment */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("monthly-assessment")}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Monthly Assessment</CardTitle>
                  <CardDescription>Monthly patient progress and condition tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">Monthly Review</Button>
                </CardContent>
              </Card>

              {/* Complications */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("complications")}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Complications</CardTitle>
                  <CardDescription>Peritonitis, Exit-site & Tunnel infections</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="default">Add Complication</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="fixed top-4 right-4 z-50">
          {activeView !== "dashboard" && (
            <Button variant="default" onClick={() => setActiveView("dashboard")}>
              Dashboard
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
};

export default Peritoneal;
