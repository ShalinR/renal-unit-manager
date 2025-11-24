# Peritoneal Dialysis - Basic Information Registration
## Complete Workflow & Code Documentation

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Workflow Steps](#workflow-steps)
4. [Frontend Code](#frontend-code)
5. [Backend Code](#backend-code)
6. [Data Flow](#data-flow)
7. [API Endpoints](#api-endpoints)
8. [Validation Rules](#validation-rules)

---

## Overview

The **Basic Information Registration** is the initial step in the Peritoneal Dialysis patient management workflow. It captures:
- **Personal Information** (auto-populated from patient table)
- **PD Registration Details** (catheter insertion, dates, flushing procedures)

**Location:** `frontend/src/components/PatientRegistration.tsx`

---

## Architecture

### System Architecture
```
┌─────────────────┐
│   React Frontend │
│  PatientRegistration.tsx
└────────┬────────┘
         │ HTTP REST API
         ↓
┌─────────────────┐
│  Spring Boot    │
│  Controller     │
│  PatientRegistrationController
└────────┬────────┘
         ↓
┌─────────────────┐
│  Service Layer  │
│  PatientRegistrationService
└────────┬────────┘
         ↓
┌─────────────────┐
│  Repository     │
│  PatientRegistrationRepository
└────────┬────────┘
         ↓
┌─────────────────┐
│   Database      │
│   patient_registration table
└─────────────────┘
```

### Technology Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Spring Boot + Java
- **Database:** MySQL/PostgreSQL
- **API:** RESTful JSON

---

## Workflow Steps

### Step 1: Access Basic Information Form
1. Navigate to **Peritoneal Dialysis** page
2. Click **"Basic Information"** card
3. Form opens with two tabs:
   - **Personal Info** tab
   - **PD Registration Details** tab

### Step 2: Patient Selection & Data Loading
**Automatic Process:**
- System checks if patient is selected (via Patient Context)
- If patient PHN exists:
  - Fetches personal info from main patient table
  - Fetches existing PD registration (if any)
  - Auto-populates form fields

### Step 3: Fill Personal Information
- Review auto-populated data
- Edit if needed
- All fields optional (validation on submit)

### Step 4: Fill PD Registration Details
**Required Fields:**
- ✅ Initiation Date
- ✅ Insertion Done By
- ✅ Designation

**Optional Fields:**
- Counselling Date
- Catheter Insertion Date
- Insertion Place
- Technique
- Flushing Dates (1st, 2nd, 3rd)

### Step 5: Validation
- Required fields checked
- Date relationships validated
- Errors displayed inline

### Step 6: Submit & Save
- Data sent to backend API
- Saved to `patient_registration` table
- Success notification shown
- Return to dashboard

---

## Frontend Code

### Component Structure

**File:** `frontend/src/components/PatientRegistration.tsx`

#### 1. TypeScript Interfaces

```typescript
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
```

#### 2. State Management

```typescript
const PatientRegistration = ({ onComplete }: PatientRegistrationProps) => {
  const { toast } = useToast();
  const { patient } = usePatientContext();

  // Form data state
  const [formData, setFormData] = useState<FormData>({
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

  // Validation state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<keyof FormData>>(new Set());
  
  // ... rest of component
};
```

#### 3. Data Loading (useEffect)

```typescript
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
        
        // Format date of birth if it exists
        let formattedDateOfBirth = "";
        if (patientData.dateOfBirth) {
          formattedDateOfBirth = patientData.dateOfBirth;
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
    }
  };

  loadPatientData();
}, [patient?.phn]);
```

#### 4. Form Update Handler

```typescript
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
```

#### 5. Field Validation

```typescript
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
```

#### 6. Form Validation

```typescript
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
```

#### 7. Form Submission Handler

```typescript
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
```

#### 8. Form UI Structure

```typescript
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
              {/* Form fields for personal info */}
            </TabsContent>

            {/* PD Registration Details Tab */}
            <TabsContent value="pd-details" className="space-y-6 mt-4">
              {/* Form fields for PD registration */}
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
```

---

## Backend Code

### 1. Controller Layer

**File:** `backend/renal/src/main/java/com/peradeniya/renal/controller/PatientRegistrationController.java`

```java
package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.PatientRegistrationDto;
import com.peradeniya.renal.services.PatientRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient-registration")
@CrossOrigin(origins = "http://localhost:5173") // Match your React app's origin
public class PatientRegistrationController {

    private final PatientRegistrationService registrationService;

    @Autowired
    public PatientRegistrationController(PatientRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /**
     * GET endpoint to retrieve patient registration data
     * @param patientId Patient's PHN
     * @return PatientRegistrationDto or null if not found
     */
    @GetMapping("/{patientId}")
    public PatientRegistrationDto getPatientRegistration(@PathVariable String patientId) {
        System.out.println("GET request received for patient registration: " + patientId);
        return registrationService.getPatientRegistrationByPatientId(patientId);
    }

    /**
     * POST endpoint to save or update patient registration
     * @param patientId Patient's PHN
     * @param registrationData DTO containing registration data
     * @return Saved PatientRegistrationDto
     */
    @PostMapping("/{patientId}")
    public PatientRegistrationDto savePatientRegistration(
            @PathVariable String patientId, 
            @RequestBody PatientRegistrationDto registrationData) {
        System.out.println("POST request received for patient registration: " + patientId);
        return registrationService.savePatientRegistration(patientId, registrationData);
    }
}
```

### 2. Service Layer

**File:** `backend/renal/src/main/java/com/peradeniya/renal/services/PatientRegistrationService.java`

```java
package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.PatientRegistrationDto;
import com.peradeniya.renal.model.PeriPatientRegistrationEntity;
import com.peradeniya.renal.repository.PatientRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientRegistrationService {

    private final PatientRegistrationRepository repository;

    @Autowired
    public PatientRegistrationService(PatientRegistrationRepository repository) {
        this.repository = repository;
    }

    /**
     * Gets patient registration by patient ID.
     * @param patientId Patient's PHN
     * @return PatientRegistrationDto or null if not found
     */
    public PatientRegistrationDto getPatientRegistrationByPatientId(String patientId) {
        return repository.findByPatientId(patientId)
                .map(this::mapEntityToDto)
                .orElse(null);
    }

    /**
     * Saves or updates patient registration.
     * Uses upsert pattern: if record exists, update it; otherwise create new.
     * @param patientId Patient's PHN
     * @param dto Registration data from frontend
     * @return Saved PatientRegistrationDto
     */
    public PatientRegistrationDto savePatientRegistration(String patientId, PatientRegistrationDto dto) {
        // Find existing record or create a new one
        PeriPatientRegistrationEntity entity = repository.findByPatientId(patientId)
                .orElse(new PeriPatientRegistrationEntity());

        // Map DTO data to the entity
        mapDtoToEntity(dto, entity, patientId);

        // Save to database
        PeriPatientRegistrationEntity savedEntity = repository.save(entity);

        // Map the saved entity back to a DTO to return
        return mapEntityToDto(savedEntity);
    }

    // --- Helper Methods ---

    /**
     * Maps an Entity from the DB to a DTO for the API.
     * @param entity Database entity
     * @return DTO object
     */
    private PatientRegistrationDto mapEntityToDto(PeriPatientRegistrationEntity entity) {
        PatientRegistrationDto dto = new PatientRegistrationDto();
        dto.setCounsellingDate(entity.getCounsellingDate());
        dto.setInitiationDate(entity.getInitiationDate());
        dto.setCatheterInsertionDate(entity.getCatheterInsertionDate());
        dto.setInsertionDoneBy(entity.getInsertionDoneBy());
        dto.setDesignation(entity.getDesignation());
        dto.setTechnique(entity.getTechnique());
        dto.setInsertionPlace(entity.getInsertionPlace());
        dto.setFirstFlushing(entity.getFirstFlushing());
        dto.setSecondFlushing(entity.getSecondFlushing());
        dto.setThirdFlushing(entity.getThirdFlushing());
        return dto;
    }

    /**
     * Maps a DTO from the API to an Entity for the DB.
     * @param dto DTO from frontend
     * @param entity Entity to populate
     * @param patientId Patient's PHN
     */
    private void mapDtoToEntity(PatientRegistrationDto dto, PeriPatientRegistrationEntity entity, String patientId) {
        entity.setPatientId(patientId);
        entity.setCounsellingDate(dto.getCounsellingDate());
        entity.setInitiationDate(dto.getInitiationDate());
        entity.setCatheterInsertionDate(dto.getCatheterInsertionDate());
        entity.setInsertionDoneBy(dto.getInsertionDoneBy());
        entity.setDesignation(dto.getDesignation());
        entity.setTechnique(dto.getTechnique());
        entity.setInsertionPlace(dto.getInsertionPlace());
        entity.setFirstFlushing(dto.getFirstFlushing());
        entity.setSecondFlushing(dto.getSecondFlushing());
        entity.setThirdFlushing(dto.getThirdFlushing());
    }
}
```

### 3. Repository Layer

**File:** `backend/renal/src/main/java/com/peradeniya/renal/repository/PatientRegistrationRepository.java`

```java
package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.PeriPatientRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRegistrationRepository extends JpaRepository<PeriPatientRegistrationEntity, Long> {
    /**
     * Find patient registration by patient ID (PHN)
     * @param patientId Patient's PHN
     * @return Optional containing entity if found
     */
    Optional<PeriPatientRegistrationEntity> findByPatientId(String patientId);
}
```

### 4. Entity Model

**File:** `backend/renal/src/main/java/com/peradeniya/renal/model/PeriPatientRegistrationEntity.java`

```java
package com.peradeniya.renal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "patient_registration")
public class PeriPatientRegistrationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String patientId;

    // Basic Information
    private String counsellingDate;
    private String initiationDate;

    // Catheter Information
    private String catheterInsertionDate;
    private String insertionDoneBy;
    private String designation;
    private String technique;
    private String insertionPlace;

    // Flushing Dates
    private String firstFlushing;
    private String secondFlushing;
    private String thirdFlushing;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    
    public String getCounsellingDate() { return counsellingDate; }
    public void setCounsellingDate(String counsellingDate) { this.counsellingDate = counsellingDate; }
    
    public String getInitiationDate() { return initiationDate; }
    public void setInitiationDate(String initiationDate) { this.initiationDate = initiationDate; }
    
    public String getCatheterInsertionDate() { return catheterInsertionDate; }
    public void setCatheterInsertionDate(String catheterInsertionDate) { this.catheterInsertionDate = catheterInsertionDate; }
    
    public String getInsertionDoneBy() { return insertionDoneBy; }
    public void setInsertionDoneBy(String insertionDoneBy) { this.insertionDoneBy = insertionDoneBy; }
    
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    
    public String getTechnique() { return technique; }
    public void setTechnique(String technique) { this.technique = technique; }
    
    public String getInsertionPlace() { return insertionPlace; }
    public void setInsertionPlace(String insertionPlace) { this.insertionPlace = insertionPlace; }
    
    public String getFirstFlushing() { return firstFlushing; }
    public void setFirstFlushing(String firstFlushing) { this.firstFlushing = firstFlushing; }
    
    public String getSecondFlushing() { return secondFlushing; }
    public void setSecondFlushing(String secondFlushing) { this.secondFlushing = secondFlushing; }
    
    public String getThirdFlushing() { return thirdFlushing; }
    public void setThirdFlushing(String thirdFlushing) { this.thirdFlushing = thirdFlushing; }
}
```

### 5. DTO (Data Transfer Object)

**File:** `backend/renal/src/main/java/com/peradeniya/renal/dto/PatientRegistrationDto.java`

```java
package com.peradeniya.renal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PatientRegistrationDto {

    // Basic Information
    private String counsellingDate;
    private String initiationDate;

    // Catheter Information
    private String catheterInsertionDate;
    private String insertionDoneBy;
    private String designation;
    private String technique;
    private String insertionPlace;

    // Flushing Dates
    private String firstFlushing;
    private String secondFlushing;
    private String thirdFlushing;

    // Getters and Setters
    public String getCounsellingDate() { return counsellingDate; }
    public void setCounsellingDate(String counsellingDate) { this.counsellingDate = counsellingDate; }
    
    public String getInitiationDate() { return initiationDate; }
    public void setInitiationDate(String initiationDate) { this.initiationDate = initiationDate; }
    
    public String getCatheterInsertionDate() { return catheterInsertionDate; }
    public void setCatheterInsertionDate(String catheterInsertionDate) { this.catheterInsertionDate = catheterInsertionDate; }
    
    public String getInsertionDoneBy() { return insertionDoneBy; }
    public void setInsertionDoneBy(String insertionDoneBy) { this.insertionDoneBy = insertionDoneBy; }
    
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    
    public String getTechnique() { return technique; }
    public void setTechnique(String technique) { this.technique = technique; }
    
    public String getInsertionPlace() { return insertionPlace; }
    public void setInsertionPlace(String insertionPlace) { this.insertionPlace = insertionPlace; }
    
    public String getFirstFlushing() { return firstFlushing; }
    public void setFirstFlushing(String firstFlushing) { this.firstFlushing = firstFlushing; }
    
    public String getSecondFlushing() { return secondFlushing; }
    public void setSecondFlushing(String secondFlushing) { this.secondFlushing = secondFlushing; }
    
    public String getThirdFlushing() { return thirdFlushing; }
    public void setThirdFlushing(String thirdFlushing) { this.thirdFlushing = thirdFlushing; }
}
```

---

## Data Flow

### Complete Request-Response Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Action: Click "Register Patient"                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend: handleSubmit()                                 │
│    - Validate form                                          │
│    - Prepare registrationData object                        │
│    - Make POST request                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. HTTP Request                                             │
│    POST /api/patient-registration/{phn}                     │
│    Headers: Content-Type: application/json                  │
│    Body: { registrationData }                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Controller: PatientRegistrationController                │
│    - Receives request                                       │
│    - Extracts patientId from path                           │
│    - Extracts DTO from request body                         │
│    - Calls service layer                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Service: PatientRegistrationService                      │
│    - Find existing record by patientId                      │
│    - If exists: update entity                              │
│    - If not: create new entity                              │
│    - Map DTO → Entity                                       │
│    - Save to database via repository                        │
│    - Map Entity → DTO                                       │
│    - Return DTO                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Repository: PatientRegistrationRepository               │
│    - JPA save() operation                                   │
│    - Persists to database                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Database: patient_registration table                    │
│    - Insert or update record                                │
│    - patientId is unique constraint                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Response: HTTP 200 OK                                   │
│    Body: Saved PatientRegistrationDto                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend: Response Handling                              │
│    - Show success toast                                     │
│    - Call onComplete() callback                             │
│    - Return to dashboard                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### GET - Retrieve Patient Registration

**Endpoint:** `GET /api/patient-registration/{patientId}`

**Path Parameters:**
- `patientId` (String) - Patient's PHN

**Response:**
```json
{
  "counsellingDate": "2024-01-15",
  "initiationDate": "2024-02-01",
  "catheterInsertionDate": "2024-01-25",
  "insertionDoneBy": "Dr. Smith",
  "insertionPlace": "teaching-hospital",
  "technique": "percutaneous",
  "designation": "consultant",
  "firstFlushing": "2024-01-26",
  "secondFlushing": "2024-01-28",
  "thirdFlushing": "2024-01-30"
}
```

**Status Codes:**
- `200 OK` - Registration found
- Returns `null` if not found (handled by service)

### POST - Save/Update Patient Registration

**Endpoint:** `POST /api/patient-registration/{patientId}`

**Path Parameters:**
- `patientId` (String) - Patient's PHN

**Request Body:**
```json
{
  "fullName": "John Doe",
  "age": "45",
  "gender": "male",
  "dateOfBirth": "1978-05-15",
  "nicNumber": "781234567V",
  "phoneNumber": "+94771234567",
  "occupation": "Teacher",
  "counsellingDate": "2024-01-15",
  "catheterInsertionDate": "2024-01-25",
  "insertionDoneBy": "Dr. Smith",
  "insertionPlace": "teaching-hospital",
  "technique": "percutaneous",
  "designation": "consultant",
  "firstFlushing": "2024-01-26",
  "secondFlushing": "2024-01-28",
  "thirdFlushing": "2024-01-30",
  "initiationDate": "2024-02-01"
}
```

**Response:**
Same structure as request (saved data)

**Status Codes:**
- `200 OK` - Registration saved successfully

---

## Validation Rules

### Frontend Validation

#### Required Fields
1. ✅ **Initiation Date** - Must be selected
2. ✅ **Insertion Done By** - Must be filled
3. ✅ **Designation** - Must be selected from dropdown

#### Date Validation
1. Counselling Date ≤ Initiation Date
2. Catheter Insertion Date ≤ Initiation Date
3. All dates cannot be in the future

#### Validation Flow
```typescript
// On field blur
handleBlur(field) → validateField(field) → set error if invalid

// On form submit
validateForm() → check all rules → return true/false
```

### Backend Validation

**Current Implementation:**
- No explicit validation in backend
- Database constraints:
  - `patientId` is unique and not null
  - All other fields are nullable

**Recommended Enhancements:**
- Add `@NotNull` annotations for required fields
- Add date validation in service layer
- Add custom validators for date relationships

---

## Database Schema

### Table: `patient_registration`

```sql
CREATE TABLE patient_registration (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(255) UNIQUE NOT NULL,
    counselling_date VARCHAR(255),
    initiation_date VARCHAR(255),
    catheter_insertion_date VARCHAR(255),
    insertion_done_by VARCHAR(255),
    designation VARCHAR(255),
    technique VARCHAR(255),
    insertion_place VARCHAR(255),
    first_flushing VARCHAR(255),
    second_flushing VARCHAR(255),
    third_flushing VARCHAR(255)
);
```

**Key Points:**
- `patient_id` is unique (one record per patient)
- Uses upsert pattern (update if exists, insert if not)
- All date fields stored as VARCHAR (String)
- No foreign key constraints (patientId references patient table logically)

---

## Error Handling

### Frontend Error Handling

```typescript
// Validation errors
- Displayed inline below fields
- Red border on invalid fields
- Toast notification on submit if validation fails

// API errors
try {
  const response = await fetch(API_URL, {...});
  if (response.ok) {
    // Success handling
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
```

### Backend Error Handling

**Current Implementation:**
- No explicit error handling
- Spring Boot default error responses
- Console logging for debugging

**Recommended:**
- Add `@ExceptionHandler` in controller
- Return proper HTTP status codes
- Add error DTOs for structured error responses

---

## Testing

### Frontend Testing Points
1. Form validation
2. Data loading from API
3. Auto-population of personal info
4. Date validation
5. Submit flow
6. Error handling

### Backend Testing Points
1. GET endpoint returns correct data
2. POST endpoint saves data correctly
3. Upsert pattern works (update existing)
4. DTO ↔ Entity mapping
5. Repository queries

---

## Summary

### Key Features
- ✅ Two-tab form structure (Personal Info + PD Registration)
- ✅ Auto-population from patient table
- ✅ Upsert pattern (update if exists, create if not)
- ✅ Client-side validation
- ✅ Date relationship validation
- ✅ RESTful API design
- ✅ DTO pattern for data transfer

### File Locations
- **Frontend:** `frontend/src/components/PatientRegistration.tsx`
- **Controller:** `backend/renal/src/main/java/com/peradeniya/renal/controller/PatientRegistrationController.java`
- **Service:** `backend/renal/src/main/java/com/peradeniya/renal/services/PatientRegistrationService.java`
- **Repository:** `backend/renal/src/main/java/com/peradeniya/renal/repository/PatientRegistrationRepository.java`
- **Entity:** `backend/renal/src/main/java/com/peradeniya/renal/model/PeriPatientRegistrationEntity.java`
- **DTO:** `backend/renal/src/main/java/com/peradeniya/renal/dto/PatientRegistrationDto.java`

---

*Last Updated: Based on current codebase analysis*
*Version: 1.0*


