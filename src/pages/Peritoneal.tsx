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

const STORAGE_KEY = "capdSummary";

const Peritoneal = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [capdData, setCapdData] = useState<CAPDData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCapdData(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load saved CAPD summary:", e);
    }
  }, []);

  const persistCAPD = (data: CAPDData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save CAPD summary:", e);
    }
    setCapdData(data);
  };

  const handleCAPDSubmit = (data: CAPDData) => {
    persistCAPD(data);
    setActiveView("preview");
  };

  // ---------- Complications View (Peritonitis + Exit-site + Tunnel all in tabs) ----------
  const ComplicationsView = () => {
    const [peritonitis, setPeritonitis] = useState<PeritonitisEpisode[]>(capdData?.peritonitisHistory ?? []);
    const [exitSite, setExitSite] = useState<ExitSiteEpisode[]>(capdData?.exitSiteInfections ?? []);
    const [tunnel, setTunnel] = useState<TunnelEpisode[]>(capdData?.tunnelInfections ?? []);

    const saveAll = () => {
      const base: CAPDData =
        capdData ?? {
          counsellingDate: "",
          catheterInsertionDate: "",
          insertionDoneBy: "",
          insertionPlace: "",
          firstFlushing: "",
          secondFlushing: "",
          thirdFlushing: "",
          initiationDate: "",
          petResults: { first: { date: "", data: null }, second: { date: "", data: null }, third: { date: "", data: null } },
          adequacyResults: { first: { date: "", data: null }, second: { date: "", data: null }, third: { date: "", data: null } },
          peritonitisHistory: [],
          exitSiteInfections: [],
          tunnelInfections: [],
        };

      const updated: CAPDData = {
        ...base,
        peritonitisHistory: peritonitis,
        exitSiteInfections: exitSite,
        tunnelInfections: tunnel,
      };
      persistCAPD(updated);
    };

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
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setActiveView("dashboard")}>Back</Button>
          <Button onClick={saveAll}>Save Complications</Button>
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
                  <Button className="w-full bg-blue-500" variant="default">Enter Details</Button>
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
                  <Button className="w-full bg-blue-500" variant="default">Enter Details</Button>
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
                  <Button className="w-full bg-blue-500" variant="default" disabled={!capdData}>
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
                  <Button className="w-full bg-blue-500" variant="default">Monthly Review</Button>
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
            <Button variant="outline" onClick={() => setActiveView("dashboard")}>
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
