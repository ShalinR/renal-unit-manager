# Peritoneal Dialysis Backend Architecture

## Overview
The peritoneal dialysis backend follows a **3-layer architecture** pattern:
- **Controller Layer** - Handles HTTP requests/responses
- **Service Layer** - Contains business logic
- **Repository Layer** - Handles database operations

## Architecture Pattern

```
Frontend (React) 
    ↓ HTTP Requests
Controller (REST API)
    ↓
Service (Business Logic)
    ↓
Repository (Database Access)
    ↓
Database (MySQL/PostgreSQL)
```

## Main Components

### 1. **Patient Registration** (`/api/patient-registration`)

**Controller:** `PatientRegistrationController.java`
- **GET** `/{patientId}` - Retrieve patient registration data
- **POST** `/{patientId}` - Save/update patient registration

**Service:** `PatientRegistrationService.java`
- Finds existing record by `patientId` or creates new one
- Maps DTO ↔ Entity
- Saves to database

**Entity:** `PatientRegistrationEntity.java`
- Table: `patient_registration`
- Stores: counselling date, catheter insertion info, flushing dates, etc.

**Repository:** `PatientRegistrationRepository.java`
- `findByPatientId(String patientId)` - Custom query method

---

### 2. **CAPD Summary** (`/api/capd-summary`)

**Controller:** `CapdSummaryController.java`
- **GET** `/{patientId}` - Get CAPD summary for a patient
- **POST** `/{patientId}` - Save CAPD summary (PET & Adequacy tests)

**Service:** `CapdSummaryService.java`
- Uses **Jackson ObjectMapper** to serialize/deserialize complex JSON data
- **PET Results** and **Adequacy Results** stored as JSON strings in database
- Maps between DTO (complex nested objects) ↔ Entity (JSON strings)

**Key Feature - JSON Storage:**
```java
// Complex nested objects (PetResultsDto, AdequacyResultsDto)
// are serialized to JSON strings and stored in TEXT columns
@Lob
@Column(columnDefinition = "TEXT")
private String petResultsJson;
private String adequacyResultsJson;
```

**Entity:** `CapdSummaryEntity.java`
- Table: `capd_summary`
- Stores: basic CAPD info + JSON strings for PET/Adequacy results

**Repository:** `CapdSummaryRepository.java`
- `findByPatientId(String patientId)` - One record per patient

---

### 3. **Infection Tracking** (`/api/infection-tracking`)

**Controller:** `InfectionTrackingController.java`
- **GET** `/{patientId}` - Get all infections (peritonitis, exit-site, tunnel)
- **GET** `/{patientId}/{infectionType}` - Get specific infection type
- **POST** `/{patientId}` - Save all infections (replaces existing)
- **POST** `/{patientId}/peritonitis` - Save peritonitis infections
- **POST** `/{patientId}/exit-site` - Save exit-site infections
- **POST** `/{patientId}/tunnel` - Save tunnel infections

**Service:** `InfectionTrackingService.java`
- Handles three types of infections separately
- Can delete all existing records before saving new ones
- Each infection type stored as separate records

**Entity:** `InfectionTrackingEntity.java`
- Table: `infection_tracking`
- Stores: infection type, dates, symptoms, treatment, etc.

---

### 4. **Monthly Assessment** (`/api/monthly-assessment`)

**Controller:** `MonthlyAssessmentController.java`
- **GET** `/{patientId}` - Get all monthly assessments
- **POST** `/{patientId}` - Create new assessment
- **PUT** `/{patientId}/{id}` - Update existing assessment
- **DELETE** `/{patientId}/{id}` - Delete assessment

**Service:** `MonthlyAssessmentService.java`
- Multiple assessments per patient (one per month)
- Full CRUD operations

**Entity:** `MonthlyAssessmentEntity.java`
- Table: `monthly_assessment`
- Stores: monthly patient progress, CAPD prescription, etc.

---

## Data Flow Example: Saving CAPD Summary

```
1. Frontend sends POST request:
   POST /api/capd-summary/{patientId}
   Body: CapdSummaryDto (with nested PetResultsDto, AdequacyResultsDto)

2. Controller receives request:
   CapdSummaryController.saveSummary(patientId, summaryData)

3. Service processes:
   - Finds existing record or creates new
   - Maps DTO → Entity
   - Serializes nested objects to JSON strings using ObjectMapper
   - Saves to database

4. Repository saves:
   CapdSummaryRepository.save(entity)

5. Response:
   Returns saved CapdSummaryDto (deserialized from JSON)
```

## Key Design Patterns

### 1. **DTO Pattern**
- **DTO (Data Transfer Object)** - Used for API communication
- **Entity** - Used for database persistence
- Service layer handles conversion between DTO ↔ Entity

### 2. **JSON Serialization for Complex Data**
- Complex nested objects (PET results, Adequacy results) stored as JSON strings
- Allows flexible schema without multiple tables
- Jackson ObjectMapper handles serialization/deserialization

### 3. **Upsert Pattern**
- Most endpoints use "find or create" pattern
- If record exists, update it; otherwise create new
- One record per patient for summary data

### 4. **Patient ID as Key**
- All endpoints use `patientId` (PHN) as identifier
- Stored as `String` in database
- Unique constraint ensures one record per patient

## Database Schema

### `patient_registration`
- One record per patient
- Basic CAPD registration info

### `capd_summary`
- One record per patient
- Stores JSON strings for complex test results

### `infection_tracking`
- Multiple records per patient
- One record per infection episode
- Type field distinguishes: peritonitis, exit-site, tunnel

### `monthly_assessment`
- Multiple records per patient
- One record per month
- Tracks monthly progress

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/patient-registration/{patientId}` | GET | Get registration |
| `/api/patient-registration/{patientId}` | POST | Save registration |
| `/api/capd-summary/{patientId}` | GET | Get CAPD summary |
| `/api/capd-summary/{patientId}` | POST | Save CAPD summary |
| `/api/infection-tracking/{patientId}` | GET | Get all infections |
| `/api/infection-tracking/{patientId}` | POST | Save all infections |
| `/api/monthly-assessment/{patientId}` | GET | Get all assessments |
| `/api/monthly-assessment/{patientId}` | POST | Create assessment |

## Error Handling

- Controllers use try-catch blocks
- Returns `ResponseEntity` with appropriate HTTP status codes
- Errors logged to console with `System.err.println()`
- Frontend receives error responses for handling

## CORS Configuration

All controllers include:
```java
@CrossOrigin(origins = "http://localhost:5173")
```
This allows the React frontend (Vite default port) to make requests.

## Security Note

Currently, endpoints are not secured with authentication. In production, you would add:
- JWT token validation
- Role-based access control
- Input validation and sanitization


