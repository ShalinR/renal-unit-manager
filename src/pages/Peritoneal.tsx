import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, UserPlus, FileText, Clipboard, TrendingUp } from "lucide-react";
import PatientRegistration from "@/components/PatientRegistration";
import DataPreview from "@/components/DataPreview";
import CAPDSummary from "@/components/CAPDSummary";
import MonthlyAssessment from "@/components/MonthlyAssessment";

type ActiveView =
  | "dashboard"
  | "register"
  | "preview"
  | "capd-summary"
  | "monthly-assessment";

// === CAPDData type (mirrors your CAPDSummary form) ===
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
  peritonitisHistory: any[];
  exitSiteInfections: any[];
  tunnelInfections: any[];
}

const STORAGE_KEY = "capdSummary";

const Peritoneal = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [capdData, setCapdData] = useState<CAPDData | null>(null);

  // Load any previously-saved CAPD summary on app load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setCapdData(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load saved CAPD summary:", e);
    }
  }, []);

  // When CAPD Summary form is submitted:
  //  - persist to localStorage
  //  - keep it in state
  //  - navigate to Preview
  const handleCAPDSubmit = (data: CAPDData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save CAPD summary:", e);
    }
    setCapdData(data);
    setActiveView("preview");
  };

  const renderContent = () => {
    switch (activeView) {
      case "register":
        return <PatientRegistration onComplete={() => setActiveView("dashboard")} />;

      case "capd-summary":
        return <CAPDSummary onSubmit={handleCAPDSubmit} />;

      case "preview":
        return (
          <DataPreview
            capdData={capdData}
            onBack={() => setActiveView("capd-summary")}
          />
        );

      case "monthly-assessment":
        return <MonthlyAssessment onComplete={() => setActiveView("dashboard")} />;

      default:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Peritoneal Dialysis 
              </h1>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Patient Registration */}
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveView("register")}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Register new patients in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">
                    Register Patient
                  </Button>
                </CardContent>
              </Card>

              {/* CAPD Summary */}
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveView("capd-summary")}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Clipboard className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>PET / Adequacy Test</CardTitle>
                  <CardDescription>
                    Complete patient dialysis summary with PET &amp; adequacy tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">
                    CAPD Summary
                  </Button>
                </CardContent>
              </Card>

              {/* View Results (Preview) */}
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveView("preview")}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>View Results</CardTitle>
                  <CardDescription>
                    Open the latest saved CAPD summary &amp; reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline" disabled={!capdData}>
                    {capdData ? "Open Preview" : "No Saved Results"}
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Assessment */}
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveView("monthly-assessment")}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Monthly Assessment</CardTitle>
                  <CardDescription>Monthly patient progress and condition tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">
                    Monthly Review
                  </Button>
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
        {/* <div className="container mx-auto px-4 py-4"> */}
          <div className="fixed top-4 right-4 z-50">
           
            {activeView !== "dashboard" && (
              <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                Dashboard
              </Button>
            )}
          </div>
        {/* </div> */}
      </header>

      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
};

export default Peritoneal;
