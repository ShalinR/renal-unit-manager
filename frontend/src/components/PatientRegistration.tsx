import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePatientContext } from "@/context/PatientContext";

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

type ValidationErrors = {
  [key in keyof FormData]?: string;
};

const PatientRegistration = ({ onComplete }: PatientRegistrationProps) => {
  const { toast } = useToast();
  const { patient } = usePatientContext();

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

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<keyof FormData>>(new Set());

  // Load existing patient registration data when patient is selected
  useEffect(() => {
    const loadPatientData = async () => {
      const phn = patient?.phn;
      if (!phn) {
        // Reset form if no patient selected
        setFormData({
          Technique: "",
          Designation: "",
          counsellingDate: "",
          initiationDate: "",
          catheterInsertionDate: "",
          insertionDoneBy: "",
          insertionPlace: "",
          firstFlushing: "",
          secondFlushing: "",
          thirdFlushing: "",
        });
        return;
      }

      try {
        const API_URL = `http://localhost:8081/api/patient-registration/${phn}`;
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            Technique: data.technique || "",
            Designation: data.designation || "",
            counsellingDate: data.counsellingDate || "",
            initiationDate: data.initiationDate || "",
            catheterInsertionDate: data.catheterInsertionDate || "",
            insertionDoneBy: data.insertionDoneBy || "",
            insertionPlace: data.insertionPlace || "",
            firstFlushing: data.firstFlushing || "",
            secondFlushing: data.secondFlushing || "",
            thirdFlushing: data.thirdFlushing || "",
          });
        }
      } catch (error) {
        console.error("Error loading patient registration data:", error);
      }
    };

    loadPatientData();
  }, [patient?.phn]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateField = (field: keyof FormData, value: any): string | undefined => {
    switch (field) {
      case "initiationDate":
        if (!value || value.trim() === "") {
          return "Initiation date is required";
        }
        break;
      case "insertionDoneBy":
        if (!value || value.trim() === "") {
          return "Insertion done by is required";
        }
        break;
      case "Designation":
        if (!value || value.trim() === "") {
          return "Designation is required";
        }
        break;
      case "counsellingDate":
        if (value && formData.initiationDate) {
          const counselling = new Date(value);
          const initiation = new Date(formData.initiationDate);
          if (counselling > initiation) {
            return "Counselling date cannot be after initiation date";
          }
        }
        break;
      case "catheterInsertionDate":
        if (value && formData.initiationDate) {
          const insertion = new Date(value);
          const initiation = new Date(formData.initiationDate);
          if (insertion > initiation) {
            return "Catheter insertion date cannot be after initiation date";
          }
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Required fields
    if (!formData.initiationDate) {
      newErrors.initiationDate = "Initiation date is required";
    }
    if (!formData.insertionDoneBy) {
      newErrors.insertionDoneBy = "Insertion done by is required";
    }
    if (!formData.Designation) {
      newErrors.Designation = "Designation is required";
    }

    // Date validation
    if (formData.counsellingDate && formData.initiationDate) {
      const counselling = new Date(formData.counsellingDate);
      const initiation = new Date(formData.initiationDate);
      if (counselling > initiation) {
        newErrors.counsellingDate = "Counselling date cannot be after initiation date";
      }
    }

    if (formData.catheterInsertionDate && formData.initiationDate) {
      const insertion = new Date(formData.catheterInsertionDate);
      const initiation = new Date(formData.initiationDate);
      if (insertion > initiation) {
        newErrors.catheterInsertionDate = "Catheter insertion date cannot be after initiation date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const getError = (field: keyof FormData): string | undefined => {
    return touched.has(field) ? errors[field] : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields: (keyof FormData)[] = [
      "initiationDate",
      "insertionDoneBy",
      "Designation",
      "counsellingDate",
      "catheterInsertionDate",
    ];
    allFields.forEach((field) => setTouched((prev) => new Set(prev).add(field)));

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Get PHN from patient context
    const phn = patient?.phn;
    if (!phn) {
      toast({
        title: "Patient Not Selected",
        description: "Please search for a patient by PHN first before registering.",
        variant: "destructive",
      });
      return;
    }

    const API_URL = `http://localhost:8081/api/patient-registration/${phn}`;

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
                  onBlur={() => handleBlur("counsellingDate")}
                  className={getError("counsellingDate") ? "border-red-500" : ""}
                />
                {getError("counsellingDate") && (
                  <p className="text-sm text-red-500">{getError("counsellingDate")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="initiationDate">Initiation Date <span className="text-red-500">*</span></Label>
                <Input
                  id="initiationDate"
                  type="date"
                  value={formData.initiationDate}
                  onChange={(e) => updateFormData("initiationDate", e.target.value)}
                  onBlur={() => handleBlur("initiationDate")}
                  className={getError("initiationDate") ? "border-red-500" : ""}
                  required
                />
                {getError("initiationDate") && (
                  <p className="text-sm text-red-500">{getError("initiationDate")}</p>
                )}
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
                  onBlur={() => handleBlur("catheterInsertionDate")}
                  className={getError("catheterInsertionDate") ? "border-red-500" : ""}
                />
                {getError("catheterInsertionDate") && (
                  <p className="text-sm text-red-500">{getError("catheterInsertionDate")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="insertionDoneBy">Insertion Done By <span className="text-red-500">*</span></Label>
                <Input
                  id="insertionDoneBy"
                  placeholder="Name of the person"
                  value={formData.insertionDoneBy}
                  onChange={(e) => updateFormData("insertionDoneBy", e.target.value)}
                  onBlur={() => handleBlur("insertionDoneBy")}
                  className={getError("insertionDoneBy") ? "border-red-500" : ""}
                />
                {getError("insertionDoneBy") && (
                  <p className="text-sm text-red-500">{getError("insertionDoneBy")}</p>
                )}
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
                <Label htmlFor="Designation">Designation <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.Designation}
                  onValueChange={(value) => updateFormData("Designation", value)}
                >
                  <SelectTrigger 
                    id="Designation"
                    className={getError("Designation") ? "border-red-500" : ""}
                  >
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
                {getError("Designation") && (
                  <p className="text-sm text-red-500">{getError("Designation")}</p>
                )}
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
