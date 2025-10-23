import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, Calendar, Clock, Activity, Mail } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phonenumber?: string;
  address?: string;
  email: string;
  diagnosisDate: string;
  treatmentType: "Peritoneal Dialysis" | "Haemodialysis" | "Kidney Transplant";
  status: "admitted" | "inactive" | "discharged" | "under treatment" | "awaiting surgery";
  lastTreatmentDate: string;
  nextAppointment?: string;
}

const PatientOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const [patients] = useState<Patient[]>([
    {
      id: "1",
      name: "Sarath Wijesinghe",
      age: 45,
      gender: "Male",
      phonenumber: "0771234567",
      address: "No 123, Main St, Colombo",
      email: "sarath@gmail.com",
      diagnosisDate: "2024-01-15",
      treatmentType: "Haemodialysis",
      status: "admitted",
      lastTreatmentDate: "2025-09-10",
      nextAppointment: "2025-09-20"
    },
    {
      id: "2",
      name: "Ranil Rajapaksha",
      age: 38,
      gender: "Male",
      email: "my3pala@gmail.com",
      diagnosisDate: "2024-02-20",
      treatmentType: "Kidney Transplant",
      status: "discharged",
      lastTreatmentDate: "2025-08-30",
      nextAppointment: "2025-09-18"
    },
    {
      id: "3",
      name: "Nimali Perera",
      age: 42,
      gender: "Female",
      email: "nimali.perera@gmail.com",
      diagnosisDate: "2023-11-15",
      treatmentType: "Haemodialysis",
      status: "under treatment",
      lastTreatmentDate: "2025-09-05",
      nextAppointment: "2025-09-20"
    },
    {
      id: "4",
      name: "Suresh Fernando",
      age: 51,
      gender: "Male",
      email: "suresh.fernando@yahoo.com",
      diagnosisDate: "2022-07-28",
      treatmentType: "Peritoneal Dialysis",
      status: "under treatment",
      lastTreatmentDate: "2025-09-10",
      nextAppointment: "2025-09-24"
    },
    {
      id: "5",
      name: "Tharushi Wickramasinghe",
      age: 29,
      gender: "Female",
      email: "tharushi.wick@gmail.com",
      diagnosisDate: "2024-03-12",
      treatmentType: "Kidney Transplant",
      status: "awaiting surgery",
      lastTreatmentDate: "2025-08-25",
      nextAppointment: "2025-09-22"
    },
    {
      id: "6",
      name: "Kasun Jayawardena",
      age: 36,
      gender: "Male",
      email: "kasun.jaya@hotmail.com",
      diagnosisDate: "2021-09-04",
      treatmentType: "Haemodialysis",
      status: "under treatment",
      lastTreatmentDate: "2025-09-08",
      nextAppointment: "2025-09-19"
    },
    {
      id: "7",
      name: "Dilani Silva",
      age: 47,
      gender: "Female",
      email: "dilani.silva@gmail.com",
      diagnosisDate: "2020-05-19",
      treatmentType: "Kidney Transplant",
      status: "discharged",
      lastTreatmentDate: "2025-08-15",
      nextAppointment: "2025-09-25"
    }
  ]);

  const selectedPatient: Patient | undefined =
    (location.state as { patient?: Patient })?.patient || patients[0];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "admitted":
        return "bg-green-50 text-green-700 border-green-200";
      case "inactive":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "discharged":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "under treatment":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "awaiting surgery":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTreatmentColor = (treatment: string) => {
    switch (treatment) {
      case "Haemodialysis":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Peritoneal Dialysis":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Kidney Transplant":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const renderOverview = () => {
    if (!selectedPatient) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Selected</h3>
          <p className="text-gray-500 text-center max-w-sm">
            Select a patient from the directory to view their detailed information and treatment history.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-blue-700">
                {selectedPatient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {selectedPatient.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {selectedPatient.gender}
                </span>
                <span>â€¢</span>
                <span>{selectedPatient.age} years old</span>
                <span>â€¢</span>
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {selectedPatient.email}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className={`${getStatusColor(selectedPatient.status)} font-medium`}>
              {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
            </Badge>
            <Badge variant="outline" className={`${getTreatmentColor(selectedPatient.treatmentType)} font-medium`}>
              {selectedPatient.treatmentType}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Full Name</span>
                  <span className="text-gray-900">{selectedPatient.name}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Age</span>
                  <span className="text-gray-900">{selectedPatient.age} years</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Gender</span>
                  <span className="text-gray-900">{selectedPatient.gender}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Contact Number</span>
                  <span className="text-gray-900">{selectedPatient.phonenumber || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Address</span>
                  <span className="text-gray-900">{selectedPatient.address || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="text-gray-900 text-sm">{selectedPatient.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Patient ID</span>
                  <span className="text-gray-900 font-mono text-sm">#{selectedPatient.id.padStart(4, '0')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Treatment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Current Treatment</span>
                  <Badge className={`${getTreatmentColor(selectedPatient.treatmentType)} font-medium`}>
                    {selectedPatient.treatmentType}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Status</span>
                  <Badge className={`${getStatusColor(selectedPatient.status)} font-medium`}>
                    {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Diagnosis Date</span>
                  <span className="text-gray-900">{new Date(selectedPatient.diagnosisDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Last Treatment</span>
                  <span className="text-gray-900">{new Date(selectedPatient.lastTreatmentDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-800 font-medium">Next Appointment</span>
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-green-700 font-semibold text-lg">
                    {selectedPatient.nextAppointment 
                      ? new Date(selectedPatient.nextAppointment).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : "Not scheduled"
                    }
                  </p>
                </div>
                <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50">
                  <Activity className="h-4 w-4 mr-2" />
                  View Treatment History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Clinical Notes</CardTitle>
            <CardDescription className="text-gray-600">Latest observations and treatment notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                Patient is responding well to current {selectedPatient.treatmentType.toLowerCase()} treatment. 
                Regular monitoring shows stable kidney function parameters. Continue with scheduled treatments 
                and follow-up appointments as planned. No adverse reactions reported during last session.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPatientList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Patient Directory</h2>
          <p className="text-gray-600 mt-1">Search and manage all registered patients</p>
        </div>
        <Button onClick={() => navigate("/register-patient")} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Register New Patient
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate("/patient-overview", { state: { patient } })}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.gender}, {patient.age} years â€¢ {patient.email}</p>
                    <p className="text-sm text-gray-500">{patient.treatmentType}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(patient.status)} font-medium`}>{patient.status}</Badge>
              </div>
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                <p className="text-gray-600">No patients match your search criteria. Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">Patient Overview</TabsTrigger>
          <TabsTrigger value="directory" className="data-[state=active]:bg-white">Patient Directory</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">{renderOverview()}</TabsContent>
        <TabsContent value="directory">{renderPatientList()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientOverview;

