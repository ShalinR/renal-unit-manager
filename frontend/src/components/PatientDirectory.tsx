import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  contactNumber: string;  
  treatmentType: "Peritoneal Dialysis" | "Haemodialysis" | "Kidney Transplant";
  status: "admitted" | "inactive" | "discharged";
  lastTreatmentDate?: string;
  nextAppointment?: string;
}

interface PatientDirectoryProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
}

export const PatientDirectory = ({ patients, onSelect }: PatientDirectoryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "admitted":
        return "bg-green-50 text-green-700 border-green-200";
      case "inactive":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "discharged":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onSelect(patient)}
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{patient.name}</h3>
              <p className="text-sm text-gray-600">
                {patient.gender}, {patient.age} yrs • {patient.email} • {patient.contactNumber}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(patient.status)} font-medium`}>
            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  );
};
