import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDateDisplay } from '@/lib/dateUtils';
import { 
  FileText, 
  Download, 
  X, 
  Stethoscope, 
  Heart, 
  Droplets, 
  Activity, 
  Thermometer,
  Weight,
  Clock,
  Syringe,
  AlertCircle
} from 'lucide-react';

interface HemodialysisRecord {
  id?: number;
  patientId?: string;
  sessionDate: string;
  prescription: {
    access?: string;
    durationMinutes?: number;
    dialysisProfile?: string;
    sodium?: number;
    bicarbonate?: number;
    bloodFlowRate?: number;
    dialysateFlowRate?: number;
    temperature?: number;
    dryWeightKg?: number;
    ultrafiltrationVolume?: number;
    anticoagulation?: string;
    erythropoetinDose?: string;
    otherTreatment?: string;
  };
  vascularAccess: {
    access?: string;
    dateOfCreation?: string;
    createdBy?: string;
    complications?: string;
  };
  session: {
    date?: string;
    durationMinutes?: number;
    preDialysisWeightKg?: number;
    postDialysisWeightKg?: number;
    interDialyticWeightGainKg?: number;
    bloodPressure?: {
      systolic?: number;
      diastolic?: number;
    };
    pulseRate?: number;
    oxygenSaturationPercent?: number;
    bloodFlowRate?: number;
    arterialPressure?: number;
    venousPressure?: number;
    transmembranePressure?: number;
    ultrafiltrationVolume?: number;
  };
  otherNotes?: string;
  filledBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HemodialysisDataPreviewProps {
  record: HemodialysisRecord | null;
  onClose: () => void;
  patientName?: string;
}

export const HemodialysisDataPreview: React.FC<HemodialysisDataPreviewProps> = ({
  record,
  onClose,
  patientName = 'Patient',
}) => {
  if (!record) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-4xl mx-4">
          <CardHeader>
            <CardTitle>No Record Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please select a record to view details.</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const prescription = record.prescription || {};
  const vascularAccess = record.vascularAccess || {};
  const session = record.session || {};
  const bloodPressure = session.bloodPressure || {};

  const exportToPDF = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hemodialysis Record - ${formatDateDisplay(record.sessionDate)}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              h2 { color: #666; margin-top: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Hemodialysis Record</h1>
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Session Date:</strong> ${formatDateDisplay(record.sessionDate)}</p>
            <p><strong>Filled By:</strong> ${record.filledBy || 'N/A'}</p>
            
            <h2>Prescription</h2>
            <table>
              <tr><th>Access Type</th><td>${prescription.access || 'N/A'}</td></tr>
              <tr><th>Duration (minutes)</th><td>${prescription.durationMinutes || 'N/A'}</td></tr>
              <tr><th>Blood Flow Rate (mL/min)</th><td>${prescription.bloodFlowRate || 'N/A'}</td></tr>
              <tr><th>Dry Weight (kg)</th><td>${prescription.dryWeightKg || 'N/A'}</td></tr>
              <tr><th>Dialysis Profile</th><td>${prescription.dialysisProfile || 'N/A'}</td></tr>
              <tr><th>Sodium (mmol/L)</th><td>${prescription.sodium || 'N/A'}</td></tr>
              <tr><th>Bicarbonate (mmol/L)</th><td>${prescription.bicarbonate || 'N/A'}</td></tr>
              <tr><th>Dialysate Flow Rate (mL/min)</th><td>${prescription.dialysateFlowRate || 'N/A'}</td></tr>
              <tr><th>Temperature (°C)</th><td>${prescription.temperature || 'N/A'}</td></tr>
              <tr><th>Ultrafiltration Volume (mL)</th><td>${prescription.ultrafiltrationVolume || 'N/A'}</td></tr>
              <tr><th>Anticoagulation</th><td>${prescription.anticoagulation || 'N/A'}</td></tr>
              <tr><th>Erythropoetin Dose</th><td>${prescription.erythropoetinDose || 'N/A'}</td></tr>
              <tr><th>Other Treatment</th><td>${prescription.otherTreatment || 'N/A'}</td></tr>
            </table>
            
            <h2>Vascular Access</h2>
            <table>
              <tr><th>Access Type</th><td>${vascularAccess.access || 'N/A'}</td></tr>
              <tr><th>Date of Creation</th><td>${vascularAccess.dateOfCreation ? formatDateDisplay(vascularAccess.dateOfCreation) : 'N/A'}</td></tr>
              <tr><th>Created By</th><td>${vascularAccess.createdBy || 'N/A'}</td></tr>
              <tr><th>Complications</th><td>${vascularAccess.complications || 'N/A'}</td></tr>
            </table>
            
            <h2>Dialysis Session</h2>
            <table>
              <tr><th>Date</th><td>${session.date ? formatDateDisplay(session.date) : 'N/A'}</td></tr>
              <tr><th>Duration (minutes)</th><td>${session.durationMinutes || 'N/A'}</td></tr>
              <tr><th>Pre-dialysis Weight (kg)</th><td>${session.preDialysisWeightKg || 'N/A'}</td></tr>
              <tr><th>Post-dialysis Weight (kg)</th><td>${session.postDialysisWeightKg || 'N/A'}</td></tr>
              <tr><th>Inter-dialytic Weight Gain (kg)</th><td>${session.interDialyticWeightGainKg || 'N/A'}</td></tr>
              <tr><th>Blood Pressure</th><td>${bloodPressure.systolic || 'N/A'}/${bloodPressure.diastolic || 'N/A'} mmHg</td></tr>
              <tr><th>Pulse Rate (bpm)</th><td>${session.pulseRate || 'N/A'}</td></tr>
              <tr><th>Oxygen Saturation (%)</th><td>${session.oxygenSaturationPercent || 'N/A'}</td></tr>
              <tr><th>Blood Flow Rate (mL/min)</th><td>${session.bloodFlowRate || 'N/A'}</td></tr>
              <tr><th>Arterial Pressure (mmHg)</th><td>${session.arterialPressure || 'N/A'}</td></tr>
              <tr><th>Venous Pressure (mmHg)</th><td>${session.venousPressure || 'N/A'}</td></tr>
              <tr><th>Transmembrane Pressure (mmHg)</th><td>${session.transmembranePressure || 'N/A'}</td></tr>
              <tr><th>Ultrafiltration Volume (mL)</th><td>${session.ultrafiltrationVolume || 'N/A'}</td></tr>
            </table>
            
            ${record.otherNotes ? `<h2>Other Notes</h2><p>${record.otherNotes}</p>` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Hemodialysis Record Details</CardTitle>
                <CardDescription className="mt-2">
                  {patientName} • Session Date: {formatDateDisplay(record.sessionDate)}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={onClose}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
            {record.filledBy && (
              <div className="mt-4">
                <Badge variant="secondary">
                  <FileText className="w-3 h-3 mr-1" />
                  Filled by: {record.filledBy}
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Prescription Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  HD Prescription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Access Type</p>
                    <p className="text-sm font-medium">{prescription.access || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Duration (minutes)
                    </p>
                    <p className="text-sm font-medium">{prescription.durationMinutes || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Blood Flow Rate (mL/min)
                    </p>
                    <p className="text-sm font-medium">{prescription.bloodFlowRate || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Weight className="w-3 h-3" />
                      Dry Weight (kg)
                    </p>
                    <p className="text-sm font-medium">{prescription.dryWeightKg || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Dialysis Profile</p>
                    <p className="text-sm font-medium">{prescription.dialysisProfile || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Sodium (mmol/L)</p>
                    <p className="text-sm font-medium">{prescription.sodium || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Bicarbonate (mmol/L)</p>
                    <p className="text-sm font-medium">{prescription.bicarbonate || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Dialysate Flow Rate (mL/min)</p>
                    <p className="text-sm font-medium">{prescription.dialysateFlowRate || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      Temperature (°C)
                    </p>
                    <p className="text-sm font-medium">{prescription.temperature || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      Ultrafiltration Volume (mL)
                    </p>
                    <p className="text-sm font-medium">{prescription.ultrafiltrationVolume || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Anticoagulation</p>
                    <p className="text-sm font-medium">{prescription.anticoagulation || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Syringe className="w-3 h-3" />
                      Erythropoetin Dose
                    </p>
                    <p className="text-sm font-medium">{prescription.erythropoetinDose || '—'}</p>
                  </div>
                  {prescription.otherTreatment && (
                    <div className="space-y-1 md:col-span-2 lg:col-span-3">
                      <p className="text-xs text-muted-foreground font-medium">Other Treatment</p>
                      <p className="text-sm font-medium whitespace-pre-wrap">{prescription.otherTreatment}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vascular Access Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Vascular Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Access Type</p>
                    <p className="text-sm font-medium">{vascularAccess.access || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Date of Creation</p>
                    <p className="text-sm font-medium">
                      {vascularAccess.dateOfCreation ? formatDateDisplay(vascularAccess.dateOfCreation) : '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Created By</p>
                    <p className="text-sm font-medium">{vascularAccess.createdBy || '—'}</p>
                  </div>
                  {vascularAccess.complications && (
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Complications
                      </p>
                      <p className="text-sm font-medium whitespace-pre-wrap">{vascularAccess.complications}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dialysis Session Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Dialysis Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Session Date</p>
                    <p className="text-sm font-medium">
                      {session.date ? formatDateDisplay(session.date) : formatDateDisplay(record.sessionDate)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Duration (minutes)
                    </p>
                    <p className="text-sm font-medium">{session.durationMinutes || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Weight className="w-3 h-3" />
                      Pre-dialysis Weight (kg)
                    </p>
                    <p className="text-sm font-medium">{session.preDialysisWeightKg || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Weight className="w-3 h-3" />
                      Post-dialysis Weight (kg)
                    </p>
                    <p className="text-sm font-medium">{session.postDialysisWeightKg || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Inter-dialytic Weight Gain (kg)</p>
                    <p className="text-sm font-medium">{session.interDialyticWeightGainKg || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Blood Pressure (mmHg)
                    </p>
                    <p className="text-sm font-medium">
                      {bloodPressure.systolic || '—'}/{bloodPressure.diastolic || '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Pulse Rate (bpm)</p>
                    <p className="text-sm font-medium">{session.pulseRate || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Oxygen Saturation (%)</p>
                    <p className="text-sm font-medium">{session.oxygenSaturationPercent || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Blood Flow Rate (mL/min)
                    </p>
                    <p className="text-sm font-medium">{session.bloodFlowRate || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Arterial Pressure (mmHg)</p>
                    <p className="text-sm font-medium">{session.arterialPressure || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Venous Pressure (mmHg)</p>
                    <p className="text-sm font-medium">{session.venousPressure || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Transmembrane Pressure (mmHg)</p>
                    <p className="text-sm font-medium">{session.transmembranePressure || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      Ultrafiltration Volume (mL)
                    </p>
                    <p className="text-sm font-medium">{session.ultrafiltrationVolume || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Notes Section */}
            {record.otherNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Other Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{record.otherNotes}</p>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            {(record.createdAt || record.updatedAt) && (
              <>
                <Separator />
                <div className="text-xs text-muted-foreground space-y-1">
                  {record.createdAt && (
                    <p>Created: {new Date(record.createdAt).toLocaleString()}</p>
                  )}
                  {record.updatedAt && (
                    <p>Last Updated: {new Date(record.updatedAt).toLocaleString()}</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

