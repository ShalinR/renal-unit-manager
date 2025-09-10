import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle, XCircle } from "lucide-react";

interface AdequacyTestProps {
  adequacyResults: {
    first: { date: string; data: any };
    second: { date: string; data: any };
    third: { date: string; data: any };
  };
  onUpdate: (results: any) => void;
}

interface AdequacyData {
  date: string;
  patientName: string;
  bodyWeight: string;
  dialysateUreaVolume: string;
  urineUreaVolume: string;
  bloodUrea: string;
  peritonealKtV: string;
  renalKtV: string;
  totalKtV: string;
  vValue: string;
  isAdequate: boolean | null;
}

const AdequacyTest = ({ adequacyResults, onUpdate }: AdequacyTestProps) => {
  const [activeTest, setActiveTest] = useState("first");
  const [testData, setTestData] = useState<Record<string, AdequacyData>>({
    first: {
      date: adequacyResults.first.date,
      patientName: "",
      bodyWeight: "",
      dialysateUreaVolume: "",
      urineUreaVolume: "",
      bloodUrea: "",
      peritonealKtV: "",
      renalKtV: "",
      totalKtV: "",
      vValue: "",
      isAdequate: null
    },
    second: {
      date: adequacyResults.second.date,
      patientName: "",
      bodyWeight: "",
      dialysateUreaVolume: "",
      urineUreaVolume: "",
      bloodUrea: "",
      peritonealKtV: "",
      renalKtV: "",
      totalKtV: "",
      vValue: "",
      isAdequate: null
    },
    third: {
      date: adequacyResults.third.date,
      patientName: "",
      bodyWeight: "",
      dialysateUreaVolume: "",
      urineUreaVolume: "",
      bloodUrea: "",
      peritonealKtV: "",
      renalKtV: "",
      totalKtV: "",
      vValue: "",
      isAdequate: null
    }
  });

  const updateTestData = (testKey: string, field: string, value: any) => {
    setTestData(prev => ({
      ...prev,
      [testKey]: { ...prev[testKey], [field]: value }
    }));
  };

  const calculateKtV = (testKey: string) => {
    const data = testData[testKey];
    const bodyWeight = parseFloat(data.bodyWeight);
    const dialysateUrea = parseFloat(data.dialysateUreaVolume);
    const urineUrea = parseFloat(data.urineUreaVolume);
    const bloodUrea = parseFloat(data.bloodUrea);
    const dialysateVolume = parseFloat(data.dialysateUreaVolume);
    const urineVolume = parseFloat(data.urineUreaVolume);

    if (bodyWeight) {
      const vValue = bodyWeight * 0.58;
      updateTestData(testKey, 'vValue', vValue.toFixed(2));

      if (dialysateUrea && bloodUrea && dialysateVolume) {
        const peritonealKtV = (dialysateUrea / bloodUrea) * dialysateVolume * 7 / vValue;
        updateTestData(testKey, 'peritonealKtV', peritonealKtV.toFixed(3));
      }

      if (urineUrea && bloodUrea && urineVolume) {
        const renalKtV = (urineUrea / bloodUrea) * urineVolume * 7 / vValue;
        updateTestData(testKey, 'renalKtV', renalKtV.toFixed(3));
      }

      const peritoneal = parseFloat(data.peritonealKtV) || 0;
      const renal = parseFloat(data.renalKtV) || 0;
      const total = peritoneal + renal;
      updateTestData(testKey, 'totalKtV', total.toFixed(3));
    }
  };

  const renderAdequacyForm = (testKey: string) => {
    const data = testData[testKey];
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              {testKey.charAt(0).toUpperCase() + testKey.slice(1)} Adequacy Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input
                  value={data.patientName}
                  onChange={(e) => updateTestData(testKey, 'patientName', e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label>Test Date</Label>
                <Input
                  type="date"
                  value={data.date}
                  onChange={(e) => updateTestData(testKey, 'date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Body Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.bodyWeight}
                  onChange={(e) => updateTestData(testKey, 'bodyWeight', e.target.value)}
                  placeholder="Enter weight"
                />
              </div>
              <div className="space-y-2">
                <Label>Dialysate Urea Volume (L)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.dialysateUreaVolume}
                  onChange={(e) => updateTestData(testKey, 'dialysateUreaVolume', e.target.value)}
                  placeholder="Enter volume"
                />
              </div>
              <div className="space-y-2">
                <Label>Urine Urea Volume (L)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.urineUreaVolume}
                  onChange={(e) => updateTestData(testKey, 'urineUreaVolume', e.target.value)}
                  placeholder="Enter volume"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Blood Urea (mg/dL)</Label>
              <Input
                type="number"
                step="0.1"
                value={data.bloodUrea}
                onChange={(e) => updateTestData(testKey, 'bloodUrea', e.target.value)}
                placeholder="Enter blood urea level"
              />
            </div>

            <Button
              type="button"
              onClick={() => calculateKtV(testKey)}
              className="w-full"
              variant="outline"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Kt/V Values
            </Button>

            <Card className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Calculations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-semibold">V Value</Label>
                      <p className="text-xs text-muted-foreground mb-1">V = Body weight (Kg) × 0.58</p>
                      <Badge variant="secondary" className="text-sm">
                        {data.vValue ? `${data.vValue} L` : "Not calculated"}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold">Peritoneal Kt/V</Label>
                      <p className="text-xs text-muted-foreground mb-1">
                        (Dialysate urea / Blood urea) × Dialysate volume × 7 / V
                      </p>
                      <Badge variant="secondary" className="text-sm">
                        {data.peritonealKtV || "Not calculated"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-semibold">Renal Kt/V</Label>
                      <p className="text-xs text-muted-foreground mb-1">
                        (Urine urea / Blood urea) × Urine volume × 7 / V
                      </p>
                      <Badge variant="secondary" className="text-sm">
                        {data.renalKtV || "Not calculated"}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-semibold">Total Kt/V</Label>
                      <p className="text-xs text-muted-foreground mb-1">
                        Renal Kt/V + Peritoneal Kt/V
                      </p>
                      <Badge 
                        variant={parseFloat(data.totalKtV) >= 1.7 ? "default" : "destructive"}
                        className="text-sm"
                      >
                        {data.totalKtV || "Not calculated"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm font-semibold">CAPD Adequacy Assessment</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      type="button"
                      variant={data.isAdequate === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTestData(testKey, 'isAdequate', true)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Adequate
                    </Button>
                    <Button
                      type="button"
                      variant={data.isAdequate === false ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => updateTestData(testKey, 'isAdequate', false)}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Not Adequate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Target Total Kt/V should be ≥ 1.7 for adequate dialysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adequacy Test Results (Usually done 3 times a year)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTest} onValueChange={setActiveTest}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="first">1st Adequacy Test</TabsTrigger>
              <TabsTrigger value="second">2nd Adequacy Test</TabsTrigger>
              <TabsTrigger value="third">3rd Adequacy Test</TabsTrigger>
            </TabsList>

            <TabsContent value="first">
              {renderAdequacyForm("first")}
            </TabsContent>

            <TabsContent value="second">
              {renderAdequacyForm("second")}
            </TabsContent>

            <TabsContent value="third">
              {renderAdequacyForm("third")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdequacyTest;