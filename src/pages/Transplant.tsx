import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MedicalButton } from "@/components/ui/button-variants";
import { Calendar } from "@/components/ui/calendar";
import { 
  UserPlus, 
  Calendar as CalendarIcon, 
  Users, 
  Heart,
  ListChecks,
  UserCheck,
  AlertTriangle,
  Clock,
  Search
} from "lucide-react";

const Transplant = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState<string>("patients");

  // Mock data
  const transplantPatients = [
    { 
      id: "TP001", 
      name: "Michael Chen", 
      age: 42, 
      transplantDate: "2023-08-15", 
      donorType: "Living Donor",
      status: "Stable",
      nextFollowUp: "2024-02-01",
      medication: "Tacrolimus, MMF"
    },
    { 
      id: "TP002", 
      name: "Lisa Rodriguez", 
      age: 38, 
      transplantDate: "2023-11-22", 
      donorType: "Deceased Donor",
      status: "Good",
      nextFollowUp: "2024-01-28",
      medication: "Cyclosporine, Prednisone"
    },
    { 
      id: "TP003", 
      name: "James Wilson", 
      age: 55, 
      transplantDate: "2023-06-10", 
      donorType: "Living Donor",
      status: "Rejection Risk",
      nextFollowUp: "2024-01-26",
      medication: "Belatacept, MMF"
    },
  ];

  const waitingList = [
    { 
      id: "WL001", 
      name: "Jennifer Lee", 
      age: 47, 
      bloodType: "O+",
      addedDate: "2023-12-10",
      priority: "High",
      status: "Active",
      waitTime: "45 days"
    },
    { 
      id: "WL002", 
      name: "Robert Taylor", 
      age: 52, 
      bloodType: "A-",
      addedDate: "2023-10-05",
      priority: "Medium",
      status: "Active",
      waitTime: "88 days"
    },
    { 
      id: "WL003", 
      name: "Amanda Davis", 
      age: 35, 
      bloodType: "B+",
      addedDate: "2023-09-20",
      priority: "Medium",
      status: "On Hold",
      waitTime: "103 days"
    },
  ];

  const donors = [
    { 
      id: "DN001", 
      name: "Sarah Johnson", 
      age: 28, 
      bloodType: "O+",
      relationship: "Sister",
      status: "Approved",
      compatibility: "100%",
      evaluationDate: "2024-01-10"
    },
    { 
      id: "DN002", 
      name: "Mark Brown", 
      age: 45, 
      bloodType: "A+",
      relationship: "Spouse",
      status: "Under Evaluation",
      compatibility: "85%",
      evaluationDate: "2024-01-15"
    },
  ];

  const followUps = [
    { patient: "Michael Chen", date: "2024-02-01", type: "Routine", lab: "Creatinine, Tacrolimus Level", priority: "Medium" },
    { patient: "Lisa Rodriguez", date: "2024-01-28", type: "Lab Review", lab: "Full Panel", priority: "Low" },
    { patient: "James Wilson", date: "2024-01-26", type: "Urgent", lab: "Biopsy Required", priority: "High" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Kidney Transplant Management</h1>
        <p className="text-muted-foreground">Comprehensive transplant patient care, waiting list, and donor registry</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Transplant Patients</p>
                <p className="text-2xl font-bold">{transplantPatients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Waiting List</p>
                <p className="text-2xl font-bold">{waitingList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-medical-success" />
              <div>
                <p className="text-sm text-muted-foreground">Active Donors</p>
                <p className="text-2xl font-bold">{donors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-medical-info" />
              <div>
                <p className="text-sm text-muted-foreground">Follow-ups</p>
                <p className="text-2xl font-bold">{followUps.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {[
          { id: "patients", label: "Transplant Patients", icon: Heart },
          { id: "waiting", label: "Waiting List", icon: ListChecks },
          { id: "donors", label: "Donor Registry", icon: UserCheck },
          { id: "followup", label: "Follow-ups", icon: CalendarIcon },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 medical-transition ${
                selectedTab === tab.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {selectedTab === "patients" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Transplant Patient Records
              </CardTitle>
              <CardDescription>Post-transplant patient monitoring and care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input placeholder="Search patients..." className="pl-9" />
                </div>
              </div>
              
              <div className="space-y-4">
                {transplantPatients.map((patient) => (
                  <div key={patient.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-lg">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {patient.id} • Age: {patient.age}</div>
                      </div>
                      <Badge 
                        variant={
                          patient.status === "Stable" ? "secondary" :
                          patient.status === "Good" ? "default" :
                          "destructive"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Transplant Date</p>
                        <p className="font-medium">{patient.transplantDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Donor Type</p>
                        <p className="font-medium">{patient.donorType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Follow-up</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {patient.nextFollowUp}
                        </p>
                      </div>
                      <div className="md:col-span-3">
                        <p className="text-muted-foreground">Current Medication</p>
                        <p className="font-medium">{patient.medication}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <MedicalButton variant="outline" size="sm">
                        View Details
                      </MedicalButton>
                      <MedicalButton variant="outline" size="sm">
                        Lab Results
                      </MedicalButton>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-secondary" />
                Add New Patient
              </CardTitle>
              <CardDescription>Register post-transplant patient</CardDescription>
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
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="o-pos">O+</SelectItem>
                      <SelectItem value="o-neg">O-</SelectItem>
                      <SelectItem value="a-pos">A+</SelectItem>
                      <SelectItem value="a-neg">A-</SelectItem>
                      <SelectItem value="b-pos">B+</SelectItem>
                      <SelectItem value="b-neg">B-</SelectItem>
                      <SelectItem value="ab-pos">AB+</SelectItem>
                      <SelectItem value="ab-neg">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transplantDate">Transplant Date</Label>
                <Input id="transplantDate" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorType">Donor Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select donor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="living">Living Donor</SelectItem>
                    <SelectItem value="deceased">Deceased Donor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <MedicalButton variant="medical" className="w-full">
                <UserPlus className="w-4 h-4" />
                Add Patient
              </MedicalButton>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "waiting" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-secondary" />
              Kidney Transplant Waiting List
            </CardTitle>
            <CardDescription>Patients awaiting kidney transplantation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingList.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">Age: {patient.age}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.bloodType}</Badge>
                      </TableCell>
                      <TableCell>{patient.waitTime}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            patient.priority === "High" ? "destructive" :
                            patient.priority === "Medium" ? "default" :
                            "secondary"
                          }
                        >
                          {patient.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={patient.status === "Active" ? "secondary" : "outline"}
                        >
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <MedicalButton variant="outline" size="sm">
                          Update Status
                        </MedicalButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === "donors" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-medical-success" />
                Donor Registry
              </CardTitle>
              <CardDescription>Living kidney donors and evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donors.map((donor) => (
                  <div key={donor.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-lg">{donor.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {donor.id} • Age: {donor.age}</div>
                      </div>
                      <Badge 
                        variant={
                          donor.status === "Approved" ? "secondary" :
                          donor.status === "Under Evaluation" ? "default" :
                          "outline"
                        }
                      >
                        {donor.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Blood Type</p>
                        <p className="font-medium">{donor.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Relationship</p>
                        <p className="font-medium">{donor.relationship}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Compatibility</p>
                        <p className="font-medium">{donor.compatibility}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Evaluation Date</p>
                        <p className="font-medium">{donor.evaluationDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Register New Donor
              </CardTitle>
              <CardDescription>Add potential living donor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Donor Name</Label>
                <Input id="donorName" placeholder="Enter donor name" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donorAge">Age</Label>
                  <Input id="donorAge" type="number" placeholder="Age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donorBloodType">Blood Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="o-pos">O+</SelectItem>
                      <SelectItem value="o-neg">O-</SelectItem>
                      <SelectItem value="a-pos">A+</SelectItem>
                      <SelectItem value="a-neg">A-</SelectItem>
                      <SelectItem value="b-pos">B+</SelectItem>
                      <SelectItem value="b-neg">B-</SelectItem>
                      <SelectItem value="ab-pos">AB+</SelectItem>
                      <SelectItem value="ab-neg">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship to Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="altruistic">Altruistic Donor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea 
                  id="medicalHistory" 
                  placeholder="Brief medical history and current health status"
                  rows={3}
                />
              </div>

              <MedicalButton variant="success" className="w-full">
                <UserCheck className="w-4 h-4" />
                Register Donor
              </MedicalButton>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "followup" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-medical-info" />
              Follow-up Schedule
            </CardTitle>
            <CardDescription>Post-transplant patient follow-up appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Upcoming Appointments</h4>
                {followUps.map((appointment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{appointment.patient}</div>
                      <Badge 
                        variant={
                          appointment.priority === "High" ? "destructive" :
                          appointment.priority === "Medium" ? "default" :
                          "secondary"
                        }
                      >
                        {appointment.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <CalendarIcon className="w-3 h-3" />
                        {appointment.date} • {appointment.type}
                      </div>
                      <div>Lab Tests: {appointment.lab}</div>
                    </div>
                  </div>
                ))}
                <MedicalButton variant="info" className="w-full">
                  <CalendarIcon className="w-4 h-4" />
                  Schedule New Follow-up
                </MedicalButton>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Transplant;