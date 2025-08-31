import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MedicalButton } from "@/components/ui/button-variants";
import { Calendar } from "@/components/ui/calendar";
import { 
  UserPlus, 
  Smartphone, 
  Calendar as CalendarIcon, 
  BarChart3,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

const Peritoneal = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data
  const patients = [
    { 
      id: "PD001", 
      name: "Emma Thompson", 
      age: 54, 
      lastUpdate: "2 hours ago", 
      compliance: 95, 
      status: "Excellent",
      nextVisit: "2024-01-28"
    },
    { 
      id: "PD002", 
      name: "David Miller", 
      age: 61, 
      lastUpdate: "1 day ago", 
      compliance: 78, 
      status: "Good",
      nextVisit: "2024-01-30"
    },
    { 
      id: "PD003", 
      name: "Sarah Brown", 
      age: 48, 
      lastUpdate: "6 hours ago", 
      compliance: 65, 
      status: "Needs Attention",
      nextVisit: "2024-01-26"
    },
  ];

  const remoteUpdates = [
    { id: "RU001", patient: "Emma Thompson", type: "Fluid Balance", value: "1.2L removed", time: "10:30 AM", status: "Normal" },
    { id: "RU002", patient: "David Miller", type: "Blood Pressure", value: "145/90 mmHg", time: "09:15 AM", status: "High" },
    { id: "RU003", patient: "Sarah Brown", type: "Weight", value: "68.5 kg", time: "08:45 AM", status: "Stable" },
    { id: "RU004", patient: "Emma Thompson", type: "Dialysate Clarity", value: "Clear", time: "07:30 AM", status: "Normal" },
  ];

  const appointments = [
    { patient: "Sarah Brown", date: "2024-01-26", time: "14:00", type: "Follow-up", priority: "High" },
    { patient: "David Miller", date: "2024-01-30", time: "10:30", type: "Routine Check", priority: "Medium" },
    { patient: "Emma Thompson", date: "2024-01-28", time: "16:00", type: "Training Session", priority: "Low" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Peritoneal Dialysis Management</h1>
        <p className="text-muted-foreground">Remote monitoring, patient management, and appointment scheduling</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Patients</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Remote Updates</p>
                <p className="text-2xl font-bold">{remoteUpdates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-medical-success" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Compliance</p>
                <p className="text-2xl font-bold">79%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-medical-info" />
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Registration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Patient Registration
            </CardTitle>
            <CardDescription>Register new PD patient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input id="patientName" placeholder="Enter patient name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="Age" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdType">PD Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="capd">CAPD</SelectItem>
                    <SelectItem value="apd">APD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input id="mobileNumber" placeholder="For remote monitoring" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" placeholder="Emergency contact number" />
            </div>

            <MedicalButton variant="medical" className="w-full">
              <UserPlus className="w-4 h-4" />
              Register Patient
            </MedicalButton>
          </CardContent>
        </Card>

        {/* Remote Data Updates */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-secondary" />
              Remote Data Updates
            </CardTitle>
            <CardDescription>Latest patient-reported data via mobile app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {remoteUpdates.map((update) => (
                <div key={update.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{update.patient}</div>
                    <div className="text-sm text-muted-foreground">
                      {update.type}: {update.value} • {update.time}
                    </div>
                  </div>
                  <Badge 
                    variant={
                      update.status === "Normal" ? "secondary" :
                      update.status === "High" ? "destructive" :
                      "default"
                    }
                  >
                    {update.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Manual Data Entry
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientSelect">Patient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataType">Data Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fluid">Fluid Balance</SelectItem>
                      <SelectItem value="bp">Blood Pressure</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="clarity">Dialysate Clarity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dataValue">Value</Label>
                  <Input id="dataValue" placeholder="Enter measurement value" />
                </div>
              </div>
              <MedicalButton variant="info" size="sm" className="mt-3">
                Add Entry
              </MedicalButton>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-medical-info" />
              Appointment Scheduling
            </CardTitle>
            <CardDescription>Manage PD patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <div className="space-y-4">
                <h4 className="font-semibold">Upcoming Appointments</h4>
                {appointments.map((apt, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{apt.patient}</div>
                      <Badge 
                        variant={
                          apt.priority === "High" ? "destructive" :
                          apt.priority === "Medium" ? "default" :
                          "secondary"
                        }
                      >
                        {apt.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {apt.date} at {apt.time} • {apt.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <MedicalButton variant="secondary" className="w-full">
              <CalendarIcon className="w-4 h-4" />
              Schedule New Appointment
            </MedicalButton>
          </CardContent>
        </Card>

        {/* Patient Monitoring Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-medical-success" />
              Patient Monitoring
            </CardTitle>
            <CardDescription>Overall patient health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">{patient.name}</div>
                    <Badge 
                      variant={
                        patient.status === "Excellent" ? "secondary" :
                        patient.status === "Good" ? "default" :
                        "destructive"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Compliance Rate</p>
                      <p className="font-medium">{patient.compliance}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Update</p>
                      <p className="font-medium">{patient.lastUpdate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Next Visit</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {patient.nextVisit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <MedicalButton variant="info" className="w-full mt-4">
              <BarChart3 className="w-4 h-4" />
              View Detailed Analytics
            </MedicalButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Peritoneal;