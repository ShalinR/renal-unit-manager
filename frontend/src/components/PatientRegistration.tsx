import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientRegistrationProps {
  onComplete: () => void;
}

type FormData = {
  
  Technique: string;
  Designation: string;

 
  counsellingDate: string;        
  initiationDate: string;         

  
  catheterInsertionDate: string;  
  insertionDoneBy: string;
  insertionPlace: string;

  
  firstFlushing: string;          
  secondFlushing: string;         
  thirdFlushing: string;          
};

const PatientRegistration = ({ onComplete }: PatientRegistrationProps) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    // existing
    Technique: "",
    Designation: "",

    // basic info
    counsellingDate: "",
    initiationDate: "",

    // catheter info
    catheterInsertionDate: "",
    insertionDoneBy: "",
    insertionPlace: "",

    // flushing
    firstFlushing: "",
    secondFlushing: "",
    thirdFlushing: "",
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Minimal validation focusing on required core fields
    if (!formData.insertionDoneBy || !formData.Designation || !formData.initiationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in Insertion Done By, Designation, and Initiation Date.",
        variant: "destructive",
      });
      return;
    }

    const patientId = "patient-123"; // Match the patientId from other components
    const API_URL = `http://localhost:8081/api/patient-registration/${patientId}`;

    try {
      // Prepare patient registration data
      const registrationData = {
        counsellingDate: formData.counsellingDate,
        catheterInsertionDate: formData.catheterInsertionDate,
        insertionDoneBy: formData.insertionDoneBy,
        insertionPlace: formData.insertionPlace,
        technique: formData.Technique,
        designation: formData.Designation,
        firstFlushing: formData.firstFlushing,
        secondFlushing: formData.secondFlushing,
        thirdFlushing: formData.thirdFlushing,
        initiationDate: formData.initiationDate,
      };

      // Save to backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Patient registration data saved successfully.",
        });
        onComplete();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving patient registration:", error);
      toast({
        title: "Error",
        description: "Failed to save patient registration data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">Patient Registration</h2>
        <p className="text-muted-foreground">Register a new patient in the PD monitoring system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>Initial counselling and PD initiation dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="counsellingDate">Counselling Date</Label>
                <Input
                  id="counsellingDate"
                  type="date"
                  value={formData.counsellingDate}
                  onChange={(e) => updateFormData("counsellingDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initiationDate">Initiation Date</Label>
                <Input
                  id="initiationDate"
                  type="date"
                  value={formData.initiationDate}
                  onChange={(e) => updateFormData("initiationDate", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catheter Information & Staff</CardTitle>
            <CardDescription>Who did the insertion, where, and the technique used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="catheterInsertionDate">Insertion Date</Label>
                <Input
                  id="catheterInsertionDate"
                  type="date"
                  value={formData.catheterInsertionDate}
                  onChange={(e) => updateFormData("catheterInsertionDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insertionDoneBy">Insertion Done By</Label>
                <Input
                          placeholder="Name of the person"
                          value={formData.insertionDoneBy}
                          onChange={(e) => updateFormData("insertionDoneBy", e.target.value)}
                        />
                 
              </div>

              <div className="space-y-2">
                <Label htmlFor="insertionPlace">Insertion Place</Label>
                <Select
                  value={formData.insertionPlace}
                  onValueChange={(value) => updateFormData("insertionPlace", value)}
                >
                  <SelectTrigger id="insertionPlace">
                    <SelectValue placeholder="Select insertionPlace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teaching-hospital">Teaching Hospital Peradeniya</SelectItem>
                    <SelectItem value="kandy">Kandy Hostpital</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Designation">Designation</Label>
                <Select
                  value={formData.Designation}
                  onValueChange={(value) => updateFormData("Designation", value)}
                >
                  <SelectTrigger id="Designation">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="senior-registrar">Senior Registrar</SelectItem>
                    <SelectItem value="registrar">Registrar</SelectItem>
                    <SelectItem value="medical-officer">Medical Officer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="Technique">Technique</Label>
                <Select
                  value={formData.Technique}
                  onValueChange={(value) => updateFormData("Technique", value)}
                >
                  <SelectTrigger id="Technique">
                    <SelectValue placeholder="Select technique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percutaneous">Percutaneous</SelectItem>
                    <SelectItem value="laparoscopic">Laparoscopic</SelectItem>
                    <SelectItem value="fluoroscopic">Fluoroscopic</SelectItem>
                    <SelectItem value="open-surgery">Open Surgery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FLUSHING DATES */}
        <Card>
          <CardHeader>
            <CardTitle>Flushing Dates</CardTitle>
            <CardDescription>Record the 1st, 2nd, and 3rd flushing dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstFlushing">1st Flushing</Label>
                <Input
                  id="firstFlushing"
                  type="date"
                  value={formData.firstFlushing}
                  onChange={(e) => updateFormData("firstFlushing", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondFlushing">2nd Flushing</Label>
                <Input
                  id="secondFlushing"
                  type="date"
                  value={formData.secondFlushing}
                  onChange={(e) => updateFormData("secondFlushing", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thirdFlushing">3rd Flushing</Label>
                <Input
                  id="thirdFlushing"
                  type="date"
                  value={formData.thirdFlushing}
                  onChange={(e) => updateFormData("thirdFlushing", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">Register Patient</Button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
