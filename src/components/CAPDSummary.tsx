import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "lucide-react"; // ⬅️ removed TestTube here
import PETTest from "./PETTest";
import AdequacyTest from "./AdequacyTest";
import InfectionTracking from "./InfectionTracking";

interface CAPDSummaryProps {
  onSubmit: (data: CAPDData) => void;
}

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

const CAPDSummary = ({ onSubmit }: CAPDSummaryProps) => {
  const [formData, setFormData] = useState<CAPDData>({
    counsellingDate: "",
    catheterInsertionDate: "",
    insertionDoneBy: "",
    insertionPlace: "",
    firstFlushing: "",
    secondFlushing: "",
    thirdFlushing: "",
    initiationDate: "",
    petResults: {
      first: { date: "", data: null },
      second: { date: "", data: null },
      third: { date: "", data: null },
    },
    adequacyResults: {
      first: { date: "", data: null },
      second: { date: "", data: null },
      third: { date: "", data: null },
    },
    peritonitisHistory: [],
    exitSiteInfections: [],
    tunnelInfections: [],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("capdSummary", JSON.stringify(formData));
    console.log("CAPD Summary Data:", formData);
    onSubmit(formData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">CAPD Summary</h1>
        <p className="text-muted-foreground">
          Comprehensive patient dialysis summary and tracking
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="pet" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pet">PET Tests</TabsTrigger>
            <TabsTrigger value="adequacy">Adequacy Tests</TabsTrigger>
            <TabsTrigger value="infections">Infections</TabsTrigger>
            <TabsTrigger value="tunnel">Tunnel Infections</TabsTrigger>
          </TabsList>

          {/* Always render PETTest; it has its own Add button */}
          <TabsContent value="pet">
            <PETTest
              petResults={formData.petResults}
              onUpdate={(results) => updateFormData("petResults", results)}
            />
          </TabsContent>

          <TabsContent value="adequacy">
            <AdequacyTest
              adequacyResults={formData.adequacyResults}
              onUpdate={(results) => updateFormData("adequacyResults", results)}
            />
          </TabsContent>

          <TabsContent value="infections">
            <InfectionTracking
              peritonitisHistory={formData.peritonitisHistory}
              exitSiteInfections={formData.exitSiteInfections}
              onUpdatePeritonitis={(history) =>
                updateFormData("peritonitisHistory", history)
              }
              onUpdateExitSite={(infections) =>
                updateFormData("exitSiteInfections", infections)
              }
            />
          </TabsContent>

          <TabsContent value="tunnel">
            <Card>
              <CardHeader>
                <CardTitle>Tunnel Infection History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label>Date</label>
                    <input type="date" placeholder="Infection date" />
                  </div>
                  <div className="space-y-2">
                    <label>Culture Report</label>
                    <input placeholder="Culture results" />
                  </div>
                  <div className="space-y-2">
                    <label>Treatment</label>
                    <input placeholder="Treatment provided" />
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-full">
                  Add Tunnel Infection Record
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onSubmit(formData);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save CAPD Summary</Button>
        </div>
      </form>
    </div>
  );
};

export default CAPDSummary;
