import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MedicalButton } from "@/components/ui/button-variants";
import { 
  UserPlus, 
  FileText, 
  Stethoscope, 
  Download,
  Search,
  Calendar,
  Activity
} from "lucide-react";

const Ward = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  // Mock patient data
  const patients = [
    { id: "P001", name: "John Doe", age: 65, condition: "Chronic Kidney Disease", ward: "Ward A", status: "Stable", admitted: "2024-01-15" },
    { id: "P002", name: "Jane Smith", age: 58, condition: "Acute Kidney Injury", ward: "Ward B", status: "Critical", admitted: "2024-01-20" },
    { id: "P003", name: "Robert Johnson", age: 72, condition: "End-Stage Renal Disease", ward: "Ward A", status: "Stable", admitted: "2024-01-18" },
    { id: "P004", name: "Mary Williams", age: 45, condition: "Nephritis", ward: "Ward C", status: "Recovering", admitted: "2024-01-22" },
  ];

  const procedures = [
    { id: "PR001", name: "Blood Test - Creatinine", patient: "John Doe", scheduled: "2024-01-25", status: "Completed" },
    { id: "PR002", name: "Ultrasound - Kidneys", patient: "Jane Smith", scheduled: "2024-01-26", status: "Pending" },
    { id: "PR003", name: "Biopsy", patient: "Robert Johnson", scheduled: "2024-01-27", status: "Scheduled" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Ward Management</h1>
        <p className="text-muted-foreground">Manage inpatient admissions, records, and discharge procedures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Admission Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Patient Admission
            </CardTitle>
            <CardDescription>Register new patient admission</CardDescription>
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
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Medical Condition</Label>
              <Textarea id="condition" placeholder="Describe patient condition" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ward">Assign Ward</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ward-a">Ward A</SelectItem>
                  <SelectItem value="ward-b">Ward B</SelectItem>
                  <SelectItem value="ward-c">Ward C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <MedicalButton variant="medical" className="w-full">
              <UserPlus className="w-4 h-4" />
              Admit Patient
            </MedicalButton>
          </CardContent>
        </Card>

        {/* Patient Records Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              Patient Records
            </CardTitle>
            <CardDescription>Current inpatients in renal care unit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input placeholder="Search patients..." className="pl-9" />
                </div>
                <MedicalButton variant="outline">
                  <Calendar className="w-4 h-4" />
                  Filter
                </MedicalButton>
              </div>
            </div>
            
            <div className="responsive-table rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">Age: {patient.age}</div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>{patient.ward}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            patient.status === "Critical" ? "destructive" : 
                            patient.status === "Stable" ? "secondary" : 
                            "default"
                          }
                        >
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <MedicalButton variant="outline" size="sm">
                          View Details
                        </MedicalButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diagnostic Procedures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-medical-info" />
              Diagnostic Procedures
            </CardTitle>
            <CardDescription>Scheduled procedures and tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {procedures.map((procedure) => (
                <div key={procedure.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{procedure.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Patient: {procedure.patient} • {procedure.scheduled}
                    </div>
                  </div>
                  <Badge 
                    variant={
                      procedure.status === "Completed" ? "secondary" :
                      procedure.status === "Pending" ? "destructive" :
                      "default"
                    }
                  >
                    {procedure.status}
                  </Badge>
                </div>
              ))}
            </div>
            <MedicalButton variant="outline" className="w-full mt-4">
              <Activity className="w-4 h-4" />
              Schedule New Procedure
            </MedicalButton>
          </CardContent>
        </Card>

        {/* Discharge Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-medical-success" />
              Discharge Summary
            </CardTitle>
            <CardDescription>Generate patient discharge documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dischargePatient">Select Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient for discharge" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dischargeSummary">Discharge Notes</Label>
              <Textarea 
                id="dischargeSummary" 
                placeholder="Enter discharge summary and follow-up instructions"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dischargeDate">Discharge Date</Label>
                <Input id="dischargeDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUp">Follow-up Required</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <MedicalButton variant="success" className="w-full" disabled={!selectedPatient}>
              <Download className="w-4 h-4" />
              Generate Discharge Summary
            </MedicalButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ward;