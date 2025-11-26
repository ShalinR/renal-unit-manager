import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDateToDDMMYYYY, isoStringToDate, toLocalISO } from "@/lib/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { usePatientContext } from "@/context/PatientContext";

interface PatientRegistrationProps {
  onComplete: () => void;
}

type FormData = {
  // Personal Info
  fullName: string;
  age: string;
  gender: string;
  dateOfBirth: string;
  nicNumber: string;
  phoneNumber: string;
  occupation: string;
  
  // PD Registration Details
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
    // Personal Info
    fullName: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    nicNumber: "",
    phoneNumber: "",
    occupation: "",
    
    // PD Registration Details
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

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<keyof FormData>>(new Set());

  // Load existing patient registration data when patient is selected
  useEffect(() => {
    const loadPatientData = async () => {
      const phn = patient?.phn;
      if (!phn) {
        // Reset form if no patient selected
        setFormData({
          fullName: "",
          age: "",
          gender: "",
          dateOfBirth: "",
          nicNumber: "",
          phoneNumber: "",
          occupation: "",
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
        // Fetch patient data from the patient table
        const PATIENT_API_URL = `http://localhost:8081/api/patient/${encodeURIComponent(phn)}`;
        const REGISTRATION_API_URL = `http://localhost:8081/api/patient-registration/${phn}`;

        const [patientResponse, registrationResponse] = await Promise.all([
          fetch(PATIENT_API_URL),
          fetch(REGISTRATION_API_URL).catch(() => ({ ok: false } as Response)),
        ]);

        // Load patient data from patient table
        if (patientResponse.ok) {
          const patientData = await patientResponse.json();
          console.log("Patient data from backend:", patientData);
          
          // Format date of birth if it exists
          let formattedDateOfBirth = "";
          if (patientData.dateOfBirth) {
            try {
              // Handle LocalDate format from backend (YYYY-MM-DD)
              formattedDateOfBirth = patientData.dateOfBirth;
            } catch (error) {
              console.warn("Failed to format date of birth:", error);
            }
          }

          // Populate personal info from patient table
          setFormData(prev => ({
            ...prev,
            fullName: patientData.name || "",
            age: patientData.age?.toString() || "",
            gender: patientData.gender || "",
            dateOfBirth: formattedDateOfBirth,
            nicNumber: patientData.nicNo || "",
            phoneNumber: patientData.contactDetails || "",
            occupation: patientData.occupation || "",
          }));
        } else {
          // If patient not found, try to use patient context data
          setFormData(prev => ({
            ...prev,
            fullName: patient?.name || prev.fullName,
            age: patient?.age?.toString() || prev.age,
            gender: patient?.gender || prev.gender,
            dateOfBirth: patient?.dateOfBirth || patient?.dob || prev.dateOfBirth,
            nicNumber: patient?.nic || prev.nicNumber,
            phoneNumber: patient?.contact || prev.phoneNumber,
            occupation: patient?.occupation || prev.occupation,
          }));
        }

        // Load PD registration data if available
        if (registrationResponse.ok) {
          const registrationData = await registrationResponse.json();
          setFormData(prev => ({
            ...prev,
            Technique: registrationData.technique || "",
            Designation: registrationData.designation || "",
            counsellingDate: registrationData.counsellingDate || "",
            initiationDate: registrationData.initiationDate || "",
            catheterInsertionDate: registrationData.catheterInsertionDate || "",
            insertionDoneBy: registrationData.insertionDoneBy || "",
            insertionPlace: registrationData.insertionPlace || "",
            firstFlushing: registrationData.firstFlushing || "",
            secondFlushing: registrationData.secondFlushing || "",
            thirdFlushing: registrationData.thirdFlushing || "",
          }));
        }
      } catch (error) {
        console.error("Error loading patient data:", error);
        // Fallback to patient context data if fetch fails
        setFormData(prev => ({
          ...prev,
          fullName: patient?.name || prev.fullName,
          age: patient?.age?.toString() || prev.age,
          gender: patient?.gender || prev.gender,
          dateOfBirth: patient?.dateOfBirth || patient?.dob || prev.dateOfBirth,
          nicNumber: patient?.nic || prev.nicNumber,
          phoneNumber: patient?.contact || prev.phoneNumber,
          occupation: patient?.occupation || prev.occupation,
        }));
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
        // Personal Info
        fullName: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        nicNumber: formData.nicNumber,
        phoneNumber: formData.phoneNumber,
        occupation: formData.occupation,
        // PD Registration Details
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
        {/* BASIC INFO WITH TABS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>Patient personal information and PD registration details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal-info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                <TabsTrigger value="pd-details">PD Registration Details</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal-info" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dateOfBirth ? formatDateToDDMMYYYY(formData.dateOfBirth) : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={isoStringToDate(formData.dateOfBirth)}
                          onSelect={(date) => { if (date) updateFormData("dateOfBirth", toLocalISO(date)); }}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nicNumber">NIC Number</Label>
                    <Input
                      id="nicNumber"
                      placeholder="Enter NIC number"
                      value={formData.nicNumber}
                      onChange={(e) => updateFormData("nicNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      placeholder="Enter occupation"
                      value={formData.occupation}
                      onChange={(e) => updateFormData("occupation", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* PD Registration Details Tab */}
              <TabsContent value="pd-details" className="space-y-6 mt-4">
                {/* Basic Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Initial Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="counsellingDate">Counselling Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.counsellingDate ? formatDateToDDMMYYYY(formData.counsellingDate) : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isoStringToDate(formData.counsellingDate)}
                            onSelect={(date) => { if (date) updateFormData("counsellingDate", toLocalISO(date)); }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {getError("counsellingDate") && (
                        <p className="text-sm text-red-500">{getError("counsellingDate")}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initiationDate">Initiation Date <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.initiationDate ? formatDateToDDMMYYYY(formData.initiationDate) : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isoStringToDate(formData.initiationDate)}
                            onSelect={(date) => { if (date) updateFormData("initiationDate", toLocalISO(date)); }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {getError("initiationDate") && (
                        <p className="text-sm text-red-500">{getError("initiationDate")}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Catheter Information & Staff */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">Catheter Information & Staff</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="catheterInsertionDate">Insertion Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.catheterInsertionDate ? formatDateToDDMMYYYY(formData.catheterInsertionDate) : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isoStringToDate(formData.catheterInsertionDate)}
                            onSelect={(date) => { if (date) updateFormData("catheterInsertionDate", toLocalISO(date)); }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                </div>

                {/* Flushing Dates */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">Flushing Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstFlushing">1st Flushing</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.firstFlushing ? formatDateToDDMMYYYY(formData.firstFlushing) : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isoStringToDate(formData.firstFlushing)}
                            onSelect={(date) => { if (date) updateFormData("firstFlushing", toLocalISO(date)); }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondFlushing">2nd Flushing</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.secondFlushing ? formatDateToDDMMYYYY(formData.secondFlushing) : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isoStringToDate(formData.secondFlushing)}
                            onSelect={(date) => { if (date) updateFormData("secondFlushing", toLocalISO(date)); }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thirdFlushing">3rd Flushing</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.thirdFlushing ? formatDateToDDMMYYYY(formData.thirdFlushing) : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={isoStringToDate(formData.thirdFlushing)}
                            onSelect={(date) => { if (date) updateFormData("thirdFlushing", toLocalISO(date)); }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
