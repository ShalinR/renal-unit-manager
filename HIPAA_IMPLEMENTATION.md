# HIPAA Patient Data Storage Implementation

## Overview

Simple, standard HIPAA-compliant audit logging for patient data storage. Tracks all patient data access according to HIPAA requirements.

## What Gets Logged

All patient data operations are automatically logged:
- ✅ **CREATE** - When a new patient is created
- ✅ **VIEW** - When patient data is viewed (by PHN, profile, list)
- ✅ **UPDATE** - When patient information is updated
- ✅ **DELETE** - When a patient is deleted

## HIPAA Compliance

Standard HIPAA audit requirements met:
- **Who** - Username and role of person accessing data
- **What** - Action performed (CREATE, VIEW, UPDATE, DELETE)
- **Which Patient** - Patient PHN (PHI identifier)
- **When** - Timestamp of access

## Implementation

### Files Created

1. **PatientAuditLog.java** - Audit log entity
2. **PatientAuditLogRepository.java** - Data access
3. **HipaaAuditService.java** - Logging service
4. **HipaaAuditController.java** - View logs endpoint

### Files Modified

1. **PatientService.java** - Added automatic audit logging to all patient operations

### How It Works

The `HipaaAuditService` is automatically injected into `PatientService`. All patient operations automatically log:

```java
// Example: When patient is created
Patient saved = repository.save(patient);
if (hipaaAuditService != null && saved.getPhn() != null) {
    hipaaAuditService.logPatientAccess("CREATE", saved.getPhn(), "Created new patient");
}
```

## Database Table

The `patient_audit_logs` table is automatically created by JPA:

```sql
CREATE TABLE patient_audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    patient_phn VARCHAR(255) NOT NULL,
    timestamp DATETIME NOT NULL,
    description VARCHAR(500),
    INDEX idx_patient_phn (patient_phn),
    INDEX idx_username (username),
    INDEX idx_timestamp (timestamp)
);
```

## API Endpoints

### View Audit Logs

**Get logs for a specific patient (Admin/Doctor only):**
```
GET /api/hipaa-audit/patient/{phn}
```

**Get your own logs:**
```
GET /api/hipaa-audit/my-logs
```

**Get all logs (Admin only):**
```
GET /api/hipaa-audit/all
```

**Get statistics (Admin only):**
```
GET /api/hipaa-audit/stats
```

## Example Audit Log Entries

### Patient Created
```json
{
  "id": 1,
  "username": "doctor1",
  "userRole": "ROLE_DOCTOR",
  "action": "CREATE",
  "patientPhn": "PHN-2024-001",
  "timestamp": "2024-01-15T10:30:00",
  "description": "Created new patient"
}
```

### Patient Viewed
```json
{
  "id": 2,
  "username": "nurse1",
  "userRole": "ROLE_NURSE",
  "action": "VIEW",
  "patientPhn": "PHN-2024-001",
  "timestamp": "2024-01-15T11:00:00",
  "description": "Viewed full patient profile"
}
```

### Patient Updated
```json
{
  "id": 3,
  "username": "doctor1",
  "userRole": "ROLE_DOCTOR",
  "action": "UPDATE",
  "patientPhn": "PHN-2024-001",
  "timestamp": "2024-01-15T12:00:00",
  "description": "Updated patient information"
}
```

## Features

- ✅ **Automatic Logging** - No code changes needed in controllers
- ✅ **Non-Intrusive** - Won't break if audit service unavailable
- ✅ **HIPAA Compliant** - Tracks who, what, which patient, when
- ✅ **Immutable Logs** - Audit logs cannot be modified
- ✅ **Indexed** - Fast queries by patient PHN, username, timestamp

## Usage

### Automatic

No code changes needed! All patient operations in `PatientService` are automatically logged.

### Viewing Logs

```bash
# Get logs for a patient
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/hipaa-audit/patient/PHN-2024-001

# Get your own logs
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/hipaa-audit/my-logs
```

## Compliance Checklist

- ✅ All patient data access logged
- ✅ User identification tracked
- ✅ Timestamps recorded
- ✅ Patient PHN tracked
- ✅ Action type logged
- ✅ Immutable audit trail
- ✅ Access restricted (Admin/Doctor for patient logs)

---

**Simple, standard HIPAA-compliant patient data storage audit logging.**

