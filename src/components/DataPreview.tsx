import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Droplets, 
  Activity, 
  Heart, 
  Thermometer, 
  Weight, 
  FileText, 
  Download,
  ArrowLeft,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";

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

interface DataPreviewProps {
  data: PDData | null;
  onBack: () => void;
}

const DataPreview = ({ data, onBack }: DataPreviewProps) => {
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold">No Data Available</h2>
        <p className="text-muted-foreground">Please submit monitoring data first to view the preview.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const formatExchangeTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return format(date, "PPpp");
    } catch {
      return timeString;
    }
  };

  const getEffluentStatus = (appearance: string) => {
    switch (appearance) {
      case "clear":
        return { variant: "default" as const, icon: CheckCircle2, color: "text-success" };
      case "slightly-cloudy":
        return { variant: "secondary" as const, icon: AlertCircle, color: "text-warning" };
      case "cloudy":
      case "bloody":
      case "fibrinous":
        return { variant: "destructive" as const, icon: AlertCircle, color: "text-destructive" };
      default:
        return { variant: "outline" as const, icon: AlertCircle, color: "text-muted-foreground" };
    }
  };

  const effluentStatus = getEffluentStatus(data.effluentAppearance);
  const StatusIcon = effluentStatus.icon;

  const fluidBalance = data.fluidIntake - data.urineOutput - Math.abs(data.netUF);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">PD Data Summary</h2>
        <p className="text-muted-foreground">Review of submitted monitoring data</p>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Form
        </Button>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exchange Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Exchange Summary
            </CardTitle>
            <CardDescription>
              Recorded on {formatExchangeTime(data.timeOfExchange)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Dialysate Type</p>
                <p className="text-lg font-semibold">{data.dialysateType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Net Ultrafiltration</p>
                <p className={`text-lg font-semibold ${data.netUF > 0 ? 'text-success' : data.netUF < 0 ? 'text-warning' : ''}`}>
                  {data.netUF > 0 ? '+' : ''}{data.netUF} mL
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{data.inflowVolume}</p>
                <p className="text-sm text-muted-foreground">Inflow (mL)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{data.outflowVolume}</p>
                <p className="text-sm text-muted-foreground">Outflow (mL)</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${data.netUF > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                  {Math.abs(data.netUF)}
                </p>
                <p className="text-sm text-muted-foreground">Net UF (mL)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Status */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Effluent</span>
              <Badge variant={effluentStatus.variant} className="flex items-center gap-1">
                <StatusIcon className={`w-3 h-3 ${effluentStatus.color}`} />
                {data.effluentAppearance || 'Not specified'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exit Site</span>
              <Badge variant={data.exitSiteCondition.includes('normal') ? 'default' : 'secondary'}>
                {data.exitSiteCondition.length > 0 
                  ? data.exitSiteCondition.join(', ') 
                  : 'Not assessed'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Temperature</span>
              <span className={`font-semibold ${
                data.temperature > 38 ? 'text-destructive' : 
                data.temperature > 37.5 ? 'text-warning' : 'text-muted-foreground'
              }`}>
                {data.temperature}°C
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mb-2">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-semibold">{data.bloodPressure || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Blood Pressure</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mb-2">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-semibold">{data.pulse || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Pulse (bpm)</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mb-2">
                <Weight className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-semibold">{data.weight || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Weight (kg)</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mb-2">
                <Thermometer className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-semibold">{data.temperature || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Temperature (°C)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fluid Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            24-Hour Fluid Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{data.fluidIntake}</p>
              <p className="text-sm text-muted-foreground">Fluid Intake (mL)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{data.urineOutput}</p>
              <p className="text-sm text-muted-foreground">Urine Output (mL)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{Math.abs(data.netUF)}</p>
              <p className="text-sm text-muted-foreground">UF Removed (mL)</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                fluidBalance > 500 ? 'text-warning' : 
                fluidBalance > 1000 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {fluidBalance > 0 ? '+' : ''}{fluidBalance}
              </p>
              <p className="text-sm text-muted-foreground">Net Balance (mL)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blood Glucose (if applicable) */}
      {(data.preGlucose || data.postGlucose) && (
        <Card>
          <CardHeader>
            <CardTitle>Blood Glucose Monitoring</CardTitle>
            <CardDescription>Diabetic patient glucose readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {data.preGlucose && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{data.preGlucose}</p>
                  <p className="text-sm text-muted-foreground">Pre-PD (mg/dL)</p>
                </div>
              )}
              {data.postGlucose && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{data.postGlucose}</p>
                  <p className="text-sm text-muted-foreground">Post-PD (mg/dL)</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {(data.medications || data.symptoms) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.medications && (
              <div>
                <h4 className="font-medium mb-2">Medications Taken</h4>
                <p className="text-muted-foreground bg-muted p-3 rounded-md">{data.medications}</p>
              </div>
            )}
            {data.symptoms && (
              <div>
                <h4 className="font-medium mb-2">Symptoms / Notes</h4>
                <p className="text-muted-foreground bg-muted p-3 rounded-md">{data.symptoms}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-4 pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit Data
        </Button>
        <Button>
          Save Record
        </Button>
      </div>
    </div>
  );
};

export default DataPreview;