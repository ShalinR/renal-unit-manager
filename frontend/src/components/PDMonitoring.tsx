import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Clock, Droplets, Activity, Thermometer, Weight, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface PDMonitoringProps {
  onSubmit: (data: PDData) => void;
}

const PDMonitoring = ({ onSubmit }: PDMonitoringProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PDData>({
    timeOfExchange: "",
    dialysateType: "",
    inflowVolume: 0,
    outflowVolume: 0,
    netUF: 0,
    effluentAppearance: "",
    bloodPressure: "",
    pulse: 0,
    weight: 0,
    temperature: 0,
    symptoms: "",
    urineOutput: 0,
    fluidIntake: 0,
    preGlucose: undefined,
    postGlucose: undefined,
    medications: "",
    exitSiteCondition: []
  });

  const [isDiabetic, setIsDiabetic] = useState(false);

  const exitSiteOptions = [
    { id: "normal", label: "Normal" },
    { id: "redness", label: "Redness" },
    { id: "discharge", label: "Discharge" },
    { id: "pain", label: "Pain" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate net UF automatically
    const calculatedNetUF = formData.outflowVolume - formData.inflowVolume;
    const updatedData = {
      ...formData,
      netUF: calculatedNetUF
    };

    if (!formData.timeOfExchange || !formData.dialysateType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Data Recorded",
      description: "PD monitoring data has been successfully recorded.",
    });
    
    onSubmit(updatedData);
  };

  const updateFormData = (field: keyof PDData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExitSiteChange = (conditionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      exitSiteCondition: checked 
        ? [...prev.exitSiteCondition, conditionId]
        : prev.exitSiteCondition.filter(id => id !== conditionId)
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">PD Monitoring</h2>
        <p className="text-muted-foreground">Record peritoneal dialysis treatment data</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Exchange Information
            </CardTitle>
            <CardDescription>Basic exchange and dialysate details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeOfExchange">Time of Exchange *</Label>
                <Input
                  id="timeOfExchange"
                  type="datetime-local"
                  value={formData.timeOfExchange}
                  onChange={(e) => updateFormData("timeOfExchange", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dialysateType">Dialysate Type *</Label>
                <Select value={formData.dialysateType} onValueChange={(value) => updateFormData("dialysateType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dialysate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5%-2L">1.5% - 2L</SelectItem>
                    <SelectItem value="2.5%-2L">2.5% - 2L</SelectItem>
                    <SelectItem value="4.25%-2L">4.25% - 2L</SelectItem>
                    <SelectItem value="1.5%-2.5L">1.5% - 2.5L</SelectItem>
                    <SelectItem value="2.5%-2.5L">2.5% - 2.5L</SelectItem>
                    <SelectItem value="4.25%-2.5L">4.25% - 2.5L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Volume and Fluid Data
            </CardTitle>
            <CardDescription>Fluid volumes and ultrafiltration measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inflowVolume">Inflow Volume (mL)</Label>
                <Input
                  id="inflowVolume"
                  type="number"
                  value={formData.inflowVolume || ""}
                  onChange={(e) => updateFormData("inflowVolume", parseInt(e.target.value) || 0)}
                  placeholder="Enter inflow volume"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outflowVolume">Outflow Volume (mL)</Label>
                <Input
                  id="outflowVolume"
                  type="number"
                  value={formData.outflowVolume || ""}
                  onChange={(e) => updateFormData("outflowVolume", parseInt(e.target.value) || 0)}
                  placeholder="Enter outflow volume"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="netUF">Net UF (mL)</Label>
                <Input
                  id="netUF"
                  type="number"
                  value={formData.outflowVolume - formData.inflowVolume || ""}
                  disabled
                  className="bg-muted"
                />
                <span className="text-xs text-muted-foreground">Calculated automatically</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urineOutput">Urine Output (24h) (mL)</Label>
                <Input
                  id="urineOutput"
                  type="number"
                  value={formData.urineOutput || ""}
                  onChange={(e) => updateFormData("urineOutput", parseInt(e.target.value) || 0)}
                  placeholder="Enter 24h urine output"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fluidIntake">Fluid Intake (24h) (mL)</Label>
                <Input
                  id="fluidIntake"
                  type="number"
                  value={formData.fluidIntake || ""}
                  onChange={(e) => updateFormData("fluidIntake", parseInt(e.target.value) || 0)}
                  placeholder="Enter 24h fluid intake"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effluentAppearance">Effluent Appearance</Label>
              <Select value={formData.effluentAppearance} onValueChange={(value) => updateFormData("effluentAppearance", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select effluent appearance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Clear</SelectItem>
                  <SelectItem value="slightly-cloudy">Slightly Cloudy</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="bloody">Bloody</SelectItem>
                  <SelectItem value="fibrinous">Fibrinous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Vital Signs
            </CardTitle>
            <CardDescription>Patient vital signs and measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                <Input
                  id="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={(e) => updateFormData("bloodPressure", e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  value={formData.pulse || ""}
                  onChange={(e) => updateFormData("pulse", parseInt(e.target.value) || 0)}
                  placeholder="Enter pulse rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight || ""}
                  onChange={(e) => updateFormData("weight", parseFloat(e.target.value) || 0)}
                  placeholder="Enter weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (Â°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature || ""}
                  onChange={(e) => updateFormData("temperature", parseFloat(e.target.value) || 0)}
                  placeholder="Enter temperature"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blood Glucose (If Diabetic)</CardTitle>
            <CardDescription>Blood glucose readings for diabetic patients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diabetic"
                checked={isDiabetic}
                onCheckedChange={(checked) => setIsDiabetic(checked as boolean)}
              />
              <Label htmlFor="diabetic">Patient is diabetic</Label>
            </div>
            
            {isDiabetic && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preGlucose">Pre-PD Glucose (mg/dL)</Label>
                  <Input
                    id="preGlucose"
                    type="number"
                    value={formData.preGlucose || ""}
                    onChange={(e) => updateFormData("preGlucose", parseInt(e.target.value) || undefined)}
                    placeholder="Enter pre-PD glucose"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postGlucose">Post-PD Glucose (mg/dL)</Label>
                  <Input
                    id="postGlucose"
                    type="number"
                    value={formData.postGlucose || ""}
                    onChange={(e) => updateFormData("postGlucose", parseInt(e.target.value) || undefined)}
                    placeholder="Enter post-PD glucose"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exit Site Assessment</CardTitle>
            <CardDescription>Catheter exit site condition assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {exitSiteOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={formData.exitSiteCondition.includes(option.id)}
                    onCheckedChange={(checked) => handleExitSiteChange(option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Medications and symptoms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medications">Medications Taken</Label>
              <Textarea
                id="medications"
                value={formData.medications}
                onChange={(e) => updateFormData("medications", e.target.value)}
                placeholder="List medications taken during this period"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms / Notes</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => updateFormData("symptoms", e.target.value)}
                placeholder="Enter any symptoms, side effects, or additional notes"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">
            Submit Data
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PDMonitoring;
