import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TestTube, Calculator } from "lucide-react";

interface PETTestProps {
  petResults: {
    first: { date: string; data: any };
    second: { date: string; data: any };
    third: { date: string; data: any };
  };
  onUpdate: (results: any) => void;
}

interface PETData {
  date: string;
  measurements: {
    t0: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
    t1: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
    t2: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
    t3: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
    t4: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
  };
  creatinineClassification: string;
  glucoseClassification: string;
  dpCreatinine: string;
  dd0Glucose: string;
}

const PETTest = ({ petResults, onUpdate }: PETTestProps) => {
  const [activeTest, setActiveTest] = useState("first");
  const [testData, setTestData] = useState<Record<string, PETData>>({
    first: {
      date: petResults.first.date,
      measurements: {
        t0: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t1: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t2: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t3: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t4: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" }
      },
      creatinineClassification: "",
      glucoseClassification: "",
      dpCreatinine: "",
      dd0Glucose: ""
    },
    second: {
      date: petResults.second.date,
      measurements: {
        t0: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t1: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t2: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t3: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t4: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" }
      },
      creatinineClassification: "",
      glucoseClassification: "",
      dpCreatinine: "",
      dd0Glucose: ""
    },
    third: {
      date: petResults.third.date,
      measurements: {
        t0: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t1: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t2: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t3: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
        t4: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" }
      },
      creatinineClassification: "",
      glucoseClassification: "",
      dpCreatinine: "",
      dd0Glucose: ""
    }
  });

  const timePoints = [
    { key: "t0", label: "8 AM (T0)", showSerum: true },
    { key: "t1", label: "10 AM (T1)", showSerum: true },
    { key: "t2", label: "12 Noon (T2)", showSerum: true },
    { key: "t3", label: "T3", showSerum: false },
    { key: "t4", label: "T4", showSerum: false }
  ];

  const classifications = ["High Transporter", "High Average Transporter", "Low Average Transporter", "Low Transporter"];

  const updateTestData = (testKey: string, field: string, value: any) => {
    setTestData(prev => ({
      ...prev,
      [testKey]: { ...prev[testKey], [field]: value }
    }));
  };

  const updateMeasurement = (testKey: string, timePoint: string, field: string, value: string) => {
    setTestData(prev => ({
      ...prev,
      [testKey]: {
        ...prev[testKey],
        measurements: {
          ...prev[testKey].measurements,
          [timePoint]: {
            ...(prev[testKey].measurements as any)[timePoint],
            [field]: value
          }
        }
      }
    }));
  };

  const calculateRatios = (testKey: string) => {
    const data = testData[testKey];
    const t0SerumCreatinine = parseFloat(data.measurements.t0.serumCreatinine);
    const t4DialysateCreatinine = parseFloat(data.measurements.t4.dialysateCreatinine);
    const t0DialysateGlucose = parseFloat(data.measurements.t0.dialysateGlucose);
    const t4DialysateGlucose = parseFloat(data.measurements.t4.dialysateGlucose);

    if (t0SerumCreatinine && t4DialysateCreatinine) {
      const dpCreatinine = t4DialysateCreatinine / t0SerumCreatinine;
      updateTestData(testKey, 'dpCreatinine', dpCreatinine.toFixed(3));
    }

    if (t0DialysateGlucose && t4DialysateGlucose) {
      const dd0Glucose = t4DialysateGlucose / t0DialysateGlucose;
      updateTestData(testKey, 'dd0Glucose', dd0Glucose.toFixed(3));
    }
  };

  const renderPETForm = (testKey: string) => {
    const data = testData[testKey];
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-primary" />
              {testKey.charAt(0).toUpperCase() + testKey.slice(1)} PET Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Test Date</Label>
              <Input
                type="date"
                value={data.date}
                onChange={(e) => updateTestData(testKey, 'date', e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left">Time</th>
                    <th className="border border-border p-2 text-left">Dialysate Creatinine</th>
                    <th className="border border-border p-2 text-left">Dialysate Glucose</th>
                    <th className="border border-border p-2 text-left">Serum Creatinine</th>
                  </tr>
                </thead>
                <tbody>
                  {timePoints.map((time) => (
                    <tr key={time.key}>
                      <td className="border border-border p-2 font-medium">{time.label}</td>
                      <td className="border border-border p-2">
                        <Input
                          placeholder="mg/dL"
                          value={(data.measurements as any)[time.key].dialysateCreatinine}
                          onChange={(e) => updateMeasurement(testKey, time.key, 'dialysateCreatinine', e.target.value)}
                        />
                      </td>
                      <td className="border border-border p-2">
                        <Input
                          placeholder="mg/dL"
                          value={(data.measurements as any)[time.key].dialysateGlucose}
                          onChange={(e) => updateMeasurement(testKey, time.key, 'dialysateGlucose', e.target.value)}
                        />
                      </td>
                      <td className="border border-border p-2">
                        {time.showSerum ? (
                          <Input
                            placeholder="mg/dL"
                            value={(data.measurements as any)[time.key].serumCreatinine}
                            onChange={(e) => updateMeasurement(testKey, time.key, 'serumCreatinine', e.target.value)}
                          />
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              type="button"
              onClick={() => calculateRatios(testKey)}
              className="w-full"
              variant="outline"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Ratios
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Creatinine Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>D/P Creatinine = Dialysate creatinine (T4) / Serum creatinine (T0)</Label>
                    <div className="mt-1">
                      <Badge variant="secondary">{data.dpCreatinine || "Not calculated"}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Classification</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {classifications.map((classification) => (
                        <Button
                          key={classification}
                          type="button"
                          variant={data.creatinineClassification === classification ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTestData(testKey, 'creatinineClassification', classification)}
                        >
                          {classification}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Glucose Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>D/D0 Glucose = Dialysate glucose (T4) / Dialysate glucose (T0)</Label>
                    <div className="mt-1">
                      <Badge variant="secondary">{data.dd0Glucose || "Not calculated"}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Classification</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {classifications.map((classification) => (
                        <Button
                          key={classification}
                          type="button"
                          variant={data.glucoseClassification === classification ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTestData(testKey, 'glucoseClassification', classification)}
                        >
                          {classification}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PET Test Results (Usually done once-twice a year)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTest} onValueChange={setActiveTest}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="first">1st PET Test</TabsTrigger>
              <TabsTrigger value="second">2nd PET Test</TabsTrigger>
              <TabsTrigger value="third">3rd PET Test</TabsTrigger>
            </TabsList>

            <TabsContent value="first">
              {renderPETForm("first")}
            </TabsContent>

            <TabsContent value="second">
              {renderPETForm("second")}
            </TabsContent>

            <TabsContent value="third">
              {renderPETForm("third")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PETTest;