import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TestTube, Activity } from "lucide-react";
import PETTest from "./PETTest";
import AdequacyTest from "./AdequacyTest";
import InfectionTracking from "./InfectionTracking";

interface CAPDSummaryProps {
  onComplete: () => void;
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

const CAPDSummary = ({ onComplete }: CAPDSummaryProps) => {
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
      third: { date: "", data: null }
    },
    adequacyResults: {
      first: { date: "", data: null },
      second: { date: "", data: null },
      third: { date: "", data: null }
    },
    peritonitisHistory: [],
    exitSiteInfections: [],
    tunnelInfections: []
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("CAPD Summary Data:", formData);
    onComplete();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">CAPD Summary</h1>
        <p className="text-muted-foreground">Comprehensive patient dialysis summary and tracking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pet">PET Tests</TabsTrigger>
            <TabsTrigger value="adequacy">Adequacy Tests</TabsTrigger>
            <TabsTrigger value="infections">Infections</TabsTrigger>
            <TabsTrigger value="tunnel">Tunnel Infections</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="counsellingDate">Counselling Date</Label>
                    <Input
                      id="counsellingDate"
                      type="date"
                      value={formData.counsellingDate}
                      onChange={(e) => updateFormData('counsellingDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initiationDate">Initiation Date</Label>
                    <Input
                      id="initiationDate"
                      type="date"
                      value={formData.initiationDate}
                      onChange={(e) => updateFormData('initiationDate', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catheter Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="catheterInsertionDate">Insertion Date</Label>
                    <Input
                      id="catheterInsertionDate"
                      type="date"
                      value={formData.catheterInsertionDate}
                      onChange={(e) => updateFormData('catheterInsertionDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insertionDoneBy">Insertion Done By</Label>
                    <Input
                      id="insertionDoneBy"
                      value={formData.insertionDoneBy}
                      onChange={(e) => updateFormData('insertionDoneBy', e.target.value)}
                      placeholder="Doctor name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insertionPlace">Place</Label>
                    <Input
                      id="insertionPlace"
                      value={formData.insertionPlace}
                      onChange={(e) => updateFormData('insertionPlace', e.target.value)}
                      placeholder="Hospital/Clinic name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flushing Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstFlushing">1st Flushing</Label>
                    <Input
                      id="firstFlushing"
                      type="date"
                      value={formData.firstFlushing}
                      onChange={(e) => updateFormData('firstFlushing', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondFlushing">2nd Flushing</Label>
                    <Input
                      id="secondFlushing"
                      type="date"
                      value={formData.secondFlushing}
                      onChange={(e) => updateFormData('secondFlushing', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thirdFlushing">3rd Flushing</Label>
                    <Input
                      id="thirdFlushing"
                      type="date"
                      value={formData.thirdFlushing}
                      onChange={(e) => updateFormData('thirdFlushing', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pet">
            <PETTest 
              petResults={formData.petResults}
              onUpdate={(results) => updateFormData('petResults', results)}
            />
          </TabsContent>

          <TabsContent value="adequacy">
            <AdequacyTest
              adequacyResults={formData.adequacyResults}
              onUpdate={(results) => updateFormData('adequacyResults', results)}
            />
          </TabsContent>

          <TabsContent value="infections">
            <InfectionTracking
              peritonitisHistory={formData.peritonitisHistory}
              exitSiteInfections={formData.exitSiteInfections}
              onUpdatePeritonitis={(history) => updateFormData('peritonitisHistory', history)}
              onUpdateExitSite={(infections) => updateFormData('exitSiteInfections', infections)}
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
                    <Label>Date</Label>
                    <Input type="date" placeholder="Infection date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Culture Report</Label>
                    <Input placeholder="Culture results" />
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment</Label>
                    <Input placeholder="Treatment provided" />
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
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">
            Save CAPD Summary
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CAPDSummary;