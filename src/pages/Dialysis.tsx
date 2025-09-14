import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MedicalButton } from "@/components/ui/button-variants";
import { Calendar } from "@/components/ui/calendar";
import { 
  UserPlus, 
  Calendar as CalendarIcon, 
  Activity, 
  Clock,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const Dialysis = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data
  const patients = [
    { id: "HD001", name: "Alice Johnson", age: 62, type: "Hemodialysis", nextSession: "2024-01-25", status: "Active", sessions: 156 },
    { id: "HD002", name: "Bob Wilson", age: 55, type: "Hemodialysis", nextSession: "2024-01-26", status: "Active", sessions: 89 },
    { id: "HD003", name: "Carol Davis", age: 68, type: "Hemodialysis", nextSession: "2024-01-25", status: "Missed", sessions: 203 },
  ];

  const sessions = [
    { id: "S001", patient: "Alice Johnson", date: "2024-01-25", time: "08:00", duration: "4 hours", status: "Scheduled", machine: "HD-1" },
    { id: "S002", patient: "Bob Wilson", date: "2024-01-25", time: "13:00", duration: "4 hours", status: "In Progress", machine: "HD-2" },
    { id: "S003", patient: "Carol Davis", date: "2024-01-25", time: "17:00", duration: "4 hours", status: "Completed", machine: "HD-3" },
  ];

  const appointments = [
    { date: "2024-01-25", count: 8, available: 2 },
    { date: "2024-01-26", count: 6, available: 4 },
    { date: "2024-01-27", count: 7, available: 3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Dialysis Unit Management</h1>
        <p className="text-muted-foreground">Manage hemodialysis scheduling, sessions, and patient monitoring</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
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
              <Activity className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-medical-info" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === "In Progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-medical-success" />
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">96%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Registration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Patient Registration
            </CardTitle>
            <CardDescription>Register new dialysis patient</CardDescription>
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
                <Label htmlFor="dialysisType">Dialysis Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hemodialysis">Hemodialysis</SelectItem>
                    <SelectItem value="peritoneal">Peritoneal Dialysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Session Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-weekly">3 times per week</SelectItem>
                  <SelectItem value="2-weekly">2 times per week</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" />
            </div>

            <MedicalButton variant="medical" className="w-full">
              <UserPlus className="w-4 h-4" />
              Register Patient
            </MedicalButton>
          </CardContent>
        </Card>

        {/* Appointment Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-secondary" />
              Appointment Scheduling
            </CardTitle>
            <CardDescription>Schedule and manage dialysis appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Available Slots</h4>
                {appointments.map((apt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {apt.count} scheduled • {apt.available} available
                      </div>
                    </div>
                    <MedicalButton variant="outline" size="sm">
                      Schedule
                    </MedicalButton>
                  </div>
                ))}
                <MedicalButton variant="secondary" className="w-full">
                  <CalendarIcon className="w-4 h-4" />
                  New Appointment
                </MedicalButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-medical-info" />
              Today's Sessions
            </CardTitle>
            <CardDescription>Monitor current dialysis sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{session.patient}</div>
                    <div className="text-sm text-muted-foreground">
                      Machine {session.machine} • {session.time} ({session.duration})
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        session.status === "Completed" ? "secondary" :
                        session.status === "In Progress" ? "default" :
                        "outline"
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <MedicalButton variant="outline" className="w-full mt-4">
              <Activity className="w-4 h-4" />
              Start New Session
            </MedicalButton>
          </CardContent>
        </Card>

        {/* Patient Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-medical-warning" />
              Patient Status
            </CardTitle>
            <CardDescription>Monitor patient health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {patient.sessions} total sessions • Next: {patient.nextSession}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge 
                      variant={
                        patient.status === "Active" ? "secondary" :
                        patient.status === "Missed" ? "destructive" :
                        "outline"
                      }
                    >
                      {patient.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">ID: {patient.id}</div>
                  </div>
                </div>
              ))}
            </div>
            <MedicalButton variant="info" className="w-full mt-4">
              <TrendingUp className="w-4 h-4" />
              View Analytics
            </MedicalButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dialysis;