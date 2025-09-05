import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, UserPlus, FileText, BarChart3, Clipboard, TrendingUp, TestTube } from "lucide-react";
import PatientRegistration from "@/components/PatientRegistration";
import PDMonitoring from "@/components/PDMonitoring";
import DataPreview from "@/components/DataPreview";
import CAPDSummary from "@/components/CAPDSummary";
import MonthlyAssessment from "@/components/MonthlyAssessment";

type ActiveView = 'dashboard' | 'register' | 'monitoring' | 'preview' | 'capd-summary' | 'monthly-assessment';

interface PDData {
  timeOfExchange: string;
  dialysateType: string;
  inflowVolume: number;
  outflowVolume: number;
  netUF: number;
  effluentAppearance: string;
  bloodPressure: string;
  pulse: number;
  weight: number;
  temperature: number;
  symptoms: string;
  urineOutput: number;
  fluidIntake: number;
  preGlucose?: number;
  postGlucose?: number;
  medications: string;
  exitSiteCondition: string[];
}

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [submittedData, setSubmittedData] = useState<PDData | null>(null);

  const handleDataSubmit = (data: PDData) => {
    setSubmittedData(data);
    setActiveView('preview');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'register':
        return <PatientRegistration onComplete={() => setActiveView('dashboard')} />;
      case 'monitoring':
        return <PDMonitoring onSubmit={handleDataSubmit} />;
      case 'preview':
        return <DataPreview data={submittedData} onBack={() => setActiveView('monitoring')} />;
      case 'capd-summary':
        return <CAPDSummary onComplete={() => setActiveView('dashboard')} />;
      case 'monthly-assessment':
        return <MonthlyAssessment onComplete={() => setActiveView('dashboard')} />;
      default:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Peritoneal Dialysis Monitor
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Professional healthcare monitoring system for peritoneal dialysis treatments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('register')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Patient Registration</CardTitle>
                  <CardDescription>
                    Register new patients in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Register Patient
                  </Button>
                </CardContent>
              </Card>

              {/* <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('monitoring')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>PD Monitoring</CardTitle>
                  <CardDescription>
                    Record dialysis treatment data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Enter Data
                  </Button>
                </CardContent>
              </Card> */}

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('preview')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>View Reports</CardTitle>
                  <CardDescription>
                    Review treatment history and data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    View Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('capd-summary')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Clipboard className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>CAPD Summary</CardTitle>
                  <CardDescription>
                    Complete patient dialysis summary with PET & adequacy tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    CAPD Summary
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('monthly-assessment')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Monthly Assessment</CardTitle>
                  <CardDescription>
                    Monthly patient progress and condition tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">PD Monitor</span>
            </div>
            {activeView !== 'dashboard' && (
              <Button variant="outline" onClick={() => setActiveView('dashboard')}>
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;