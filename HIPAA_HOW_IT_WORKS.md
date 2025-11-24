# How HIPAA Audit Logging Works

## Complete Workflow Explanation

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────────────┐
│                   1. USER ACTION                                │
│   Frontend: User creates/views/updates patient data            │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   2. API REQUEST                               │
│   POST /api/patient (or GET, PUT, DELETE)                      │
│   Headers: Authorization: Bearer <JWT_TOKEN>                   │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   3. AUTHENTICATION                             │
│   JwtAuthenticationFilter validates token                      │
│   Sets SecurityContext with authenticated user                 │
│   User: "doctor1", Role: "ROLE_DOCTOR"                         │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   4. CONTROLLER                                │
│   PatientController receives request                            │
│   Calls: patientService.save(patient)                          │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   5. PATIENT SERVICE                            │
│   PatientService.save(patient) {                               │
│     1. Save patient to database                                 │
│     2. Check if hipaaAuditService exists                        │
│     3. If yes, call audit logging                                │
│   }                                                              │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   6. HIPAA AUDIT SERVICE                        │
│   HipaaAuditService.logPatientAccess() {                        │
│     1. Get current user from SecurityContext                    │
│     2. Extract username and role                                │
│     3. Create PatientAuditLog object                           │
│     4. Save to database                                          │
│   }                                                              │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   7. DATABASE                                  │
│   patient_audit_logs table stores:                              │
│   - username: "doctor1"                                         │
│   - userRole: "ROLE_DOCTOR"                                     │
│   - action: "CREATE"                                            │
│   - patientPhn: "PHN-2024-001"                                  │
│   - timestamp: "2024-01-15T10:30:00"                            │
│   - description: "Created new patient"                          │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Code Flow

### Example: Creating a Patient

#### 1. Frontend Makes Request
```typescript
// Frontend code
const response = await fetch('http://localhost:8081/api/patient', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phn: 'PHN-2024-001',
    name: 'John Doe',
    age: 45,
    // ... other patient data
  })
});
```

#### 2. Controller Receives Request
```java
// PatientController.java
@PostMapping
public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
    Patient savedPatient = service.save(patient);  // ← Calls service
    return ResponseEntity.ok(savedPatient);
}
```

#### 3. Service Processes Request
```java
// PatientService.java
public Patient save(Patient patient) {
    // Step 1: Save patient to database
    Patient saved = repository.save(patient);
    
    // Step 2: HIPAA Audit Logging (automatic)
    if (hipaaAuditService != null && saved.getPhn() != null) {
        hipaaAuditService.logPatientAccess(
            "CREATE",                    // Action type
            saved.getPhn(),              // Patient PHN
            "Created new patient"        // Description
        );
    }
    
    return saved;
}
```

#### 4. Audit Service Logs the Access
```java
// HipaaAuditService.java
public void logPatientAccess(String action, String patientPhn, String description) {
    // Step 1: Get current authenticated user from Spring Security
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    
    // Step 2: Extract user information
    String username = auth.getName();  // "doctor1"
    String userRole = auth.getAuthorities().iterator().next().getAuthority();  // "ROLE_DOCTOR"
    
    // Step 3: Create audit log entry
    PatientAuditLog log = new PatientAuditLog();
    log.setUsername(username);           // "doctor1"
    log.setUserRole(userRole);           // "ROLE_DOCTOR"
    log.setAction(action);               // "CREATE"
    log.setPatientPhn(patientPhn);      // "PHN-2024-001"
    log.setDescription(description);      // "Created new patient"
    log.setTimestamp(LocalDateTime.now()); // Current timestamp
    
    // Step 4: Save to database
    repository.save(log);
}
```

#### 5. Database Stores the Log
```sql
-- Automatically executed by JPA
INSERT INTO patient_audit_logs 
  (username, user_role, action, patient_phn, timestamp, description)
VALUES 
  ('doctor1', 'ROLE_DOCTOR', 'CREATE', 'PHN-2024-001', '2024-01-15 10:30:00', 'Created new patient');
```

## How User Information is Captured

### Spring Security Context

The system uses Spring Security's `SecurityContextHolder` to get the current user:

```java
// HipaaAuditService.java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();

if (auth != null && auth.isAuthenticated()) {
    username = auth.getName();  // Gets username from JWT token
    userRole = auth.getAuthorities().iterator().next().getAuthority();  // Gets role
}
```

**How it works:**
1. User logs in → JWT token is created with username and role
2. Token is sent with every request in `Authorization` header
3. `JwtAuthenticationFilter` validates token and sets `SecurityContext`
4. `HipaaAuditService` reads from `SecurityContext` to get current user

## All Logged Operations

### CREATE Operation
```java
// When: Patient is created
// Logged in: save(), createPatient()
hipaaAuditService.logPatientAccess("CREATE", phn, "Created new patient");
```

### VIEW Operation
```java
// When: Patient data is viewed
// Logged in: getByPhn(), getBasicByPhn(), getPatientProfile(), getAll(), getPatientByPhn()
hipaaAuditService.logPatientAccess("VIEW", phn, "Viewed patient by PHN");
```

### UPDATE Operation
```java
// When: Patient information is updated
// Logged in: updatePatient()
hipaaAuditService.logPatientAccess("UPDATE", phn, "Updated patient information");
```

### DELETE Operation
```java
// When: Patient is deleted
// Logged in: deleteById()
hipaaAuditService.logPatientAccess("DELETE", phn, "Deleted patient");
```

## Safety Features

### 1. Non-Intrusive Design
```java
// Optional injection - won't break if service unavailable
@Autowired(required = false)
private HipaaAuditService hipaaAuditService;

// Safe check before logging
if (hipaaAuditService != null && saved.getPhn() != null) {
    hipaaAuditService.logPatientAccess(...);
}
```

**Why:** If the audit service fails to load, patient operations still work normally.

### 2. Error Handling
```java
try {
    // Log the access
    repository.save(log);
} catch (Exception e) {
    // Don't fail the operation if audit logging fails
    System.err.println("HIPAA Audit: Failed to log patient access: " + e.getMessage());
}
```

**Why:** If database write fails, the patient operation still succeeds. Audit logging never blocks business operations.

### 3. Automatic User Detection
```java
// Automatically gets user from Spring Security context
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
username = auth.getName();  // No manual passing needed
```

**Why:** No need to manually pass username - it's automatically captured from the authenticated session.

## Viewing Audit Logs

### Get Logs for a Patient
```bash
GET /api/hipaa-audit/patient/PHN-2024-001
Authorization: Bearer <admin_or_doctor_token>

Response:
[
  {
    "id": 1,
    "username": "doctor1",
    "userRole": "ROLE_DOCTOR",
    "action": "CREATE",
    "patientPhn": "PHN-2024-001",
    "timestamp": "2024-01-15T10:30:00",
    "description": "Created new patient"
  },
  {
    "id": 2,
    "username": "nurse1",
    "userRole": "ROLE_NURSE",
    "action": "VIEW",
    "patientPhn": "PHN-2024-001",
    "timestamp": "2024-01-15T11:00:00",
    "description": "Viewed patient by PHN"
  }
]
```

### Get Your Own Logs
```bash
GET /api/hipaa-audit/my-logs
Authorization: Bearer <your_token>

Response:
[
  {
    "id": 1,
    "username": "doctor1",
    "userRole": "ROLE_DOCTOR",
    "action": "CREATE",
    "patientPhn": "PHN-2024-001",
    ...
  }
]
```

## Key Points

1. **Automatic** - No code changes needed in controllers
2. **Transparent** - Works behind the scenes
3. **Safe** - Never blocks patient operations
4. **Complete** - Logs all patient data access
5. **HIPAA Compliant** - Tracks who, what, which patient, when

## Database Structure

```
patient_audit_logs
├── id (Primary Key)
├── username (Who accessed)
├── user_role (User's role)
├── action (CREATE/VIEW/UPDATE/DELETE)
├── patient_phn (Which patient)
├── timestamp (When)
└── description (What happened)
```

**Indexes for fast queries:**
- `idx_patient_phn` - Find all access to a patient
- `idx_username` - Find all access by a user
- `idx_timestamp` - Find access in date range

---

**Summary:** Every time patient data is accessed, the system automatically captures who did it, what they did, which patient, and when - all stored in an immutable audit log for HIPAA compliance.

