# Work Breakdown Chart - Renal Unit Manager

## Overview
This document provides a comprehensive work breakdown for the major components of the Renal Unit Management System.

---

## 1. PERITONEAL DIALYSIS UNIT

### 1.1 Patient Registration Module
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `PeriPatientRegistrationEntity.java`
  - Table: `patient_registration`
  - Fields: counsellingDate, catheterInsertionDate, insertionDoneBy, insertionPlace, technique, designation, flushing dates, initiationDate
- **Repository:** `PatientRegistrationRepository.java`
  - Method: `findByPatientId(String patientId)`
- **Service:** `PatientRegistrationService.java`
  - Business logic for patient registration
  - DTO ↔ Entity mapping
- **Controller:** `PatientRegistrationController.java`
  - `GET /api/patient-registration/{patientId}` - Retrieve registration
  - `POST /api/patient-registration/{patientId}` - Save/update registration

#### Frontend Components
- **Component:** `PatientRegistration.tsx`
  - Form for entering patient basic information
  - Integration with patient context (PHN)
  - Auto-save functionality

**Tasks:**
- [x] Create backend entity and repository
- [x] Implement service layer with DTO mapping
- [x] Create REST API endpoints
- [x] Build frontend registration form
- [x] Integrate with patient context
- [x] Add form validation

---

### 1.2 CAPD Summary Module (PET & Adequacy Tests)
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `CapdSummaryEntity.java`
  - Table: `capd_summary`
  - JSON storage for PET and Adequacy results (`petResultsJson`, `adequacyResultsJson`)
- **Repository:** `CapdSummaryRepository.java`
  - Method: `findByPatientId(String patientId)`
- **Service:** `CapdSummaryService.java`
  - Uses Jackson ObjectMapper for JSON serialization/deserialization
  - Complex nested DTO handling
- **Controller:** `CapdSummaryController.java`
  - `GET /api/capd-summary/{patientId}` - Get CAPD summary
  - `POST /api/capd-summary/{patientId}` - Save CAPD summary

#### Frontend Components
- **Component:** `CAPDSummary.tsx`
  - PET test entry (3 time points)
  - Adequacy test entry (3 time points)
  - Form validation and submission

**Tasks:**
- [x] Design JSON storage schema for complex data
- [x] Implement Jackson serialization in service
- [x] Create DTOs for PET and Adequacy results
- [x] Build frontend form with dynamic time points
- [x] Add data validation
- [x] Implement save/load functionality

---

### 1.3 Infection Tracking Module
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `InfectionTrackingEntity.java`
  - Table: `infection_tracking`
  - JSON storage for peritonitis, exit-site, and tunnel infections
- **Repository:** `InfectionTrackingRepository.java`
- **Service:** `InfectionTrackingService.java`
- **Controller:** `InfectionTrackingController.java`
  - `GET /api/infection-tracking/{patientId}` - Get infection history
  - `POST /api/infection-tracking/{patientId}` - Save infection data

#### Frontend Components
- **Component:** `InfectionTracking.tsx`
  - Three tabs: Peritonitis, Exit-site, Tunnel
  - Episode tracking with dates, symptoms, treatment
  - Integration with CAPD Summary

**Tasks:**
- [x] Create infection tracking entity
- [x] Implement JSON storage for multiple infection types
- [x] Build tabbed UI for three infection types
- [x] Add episode management (add/edit/delete)
- [x] Integrate with patient context

---

### 1.4 Monthly Assessment Module
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `MonthlyAssessmentEntity.java`
- **Repository:** `MonthlyAssessmentRepository.java`
- **Service:** `MonthlyAssessmentService.java`
- **Controller:** `MonthlyAssessmentController.java`
  - `GET /api/monthly-assessment/{patientId}` - Get assessments
  - `POST /api/monthly-assessment/{patientId}` - Save assessment

#### Frontend Components
- **Component:** `MonthlyAssessment.tsx`
  - Monthly patient assessment form
  - Clinical parameters tracking

**Tasks:**
- [x] Design assessment data model
- [x] Create backend endpoints
- [x] Build assessment form UI
- [x] Add date-based filtering

---

### 1.5 Data Preview Module
**Status:** ✅ Complete

#### Frontend Components
- **Component:** `DataPreview.tsx`
  - Displays combined patient data
  - Shows registration, CAPD summary, and infection history
  - Read-only view

**Tasks:**
- [x] Create preview component
- [x] Aggregate data from multiple sources
- [x] Format display for readability

---

### 1.6 Main Dashboard
**Status:** ✅ Complete

#### Frontend Components
- **Page:** `Peritoneal.tsx`
  - Dashboard with 5 main cards:
    1. Basic Information (Patient Registration)
    2. PET / Adequacy Test (CAPD Summary)
    3. View Results (Data Preview)
    4. Monthly Assessment
    5. Complications (Infection Tracking)
  - View state management
  - Patient context integration

**Tasks:**
- [x] Design dashboard layout
- [x] Implement view routing
- [x] Add patient context awareness
- [x] Create navigation between modules

---

## 2. LOGIN & AUTHENTICATION

### 2.1 Backend Authentication System
**Status:** ✅ Complete

#### Components
- **Security Config:** `SecurityConfig.java`
  - Spring Security configuration
  - JWT filter setup
  - CORS configuration
  - Public endpoints: `/api/auth/**`
  - Protected endpoints: All other `/api/**`

- **JWT Token Service:** `JwtTokenService.java`
  - Token generation
  - Token validation
  - Secret key management
  - Expiration handling (7 days)

- **Authentication Service:** `AuthenticationService.java`
  - User credential validation
  - BCrypt password checking
  - User enabled status check
  - Token generation on success

- **User Details Service:** `UserDetailsServiceImpl.java`
  - Implements Spring Security `UserDetailsService`
  - Loads user from database
  - Maps to Spring Security UserDetails

- **JWT Authentication Filter:** `JwtAuthenticationFilter.java`
  - Intercepts HTTP requests
  - Extracts token from Authorization header or cookie
  - Validates token
  - Sets authentication context

- **Authentication Controller:** `AuthenticationController.java`
  - `POST /api/auth/login` - Login endpoint
  - `GET /api/auth/validate` - Token validation
  - Sets HttpOnly cookie with JWT token

**Tasks:**
- [x] Configure Spring Security
- [x] Implement JWT token generation
- [x] Create authentication filter
- [x] Set up password encryption (BCrypt)
- [x] Implement login endpoint
- [x] Add token validation endpoint
- [x] Configure CORS for frontend
- [x] Add cookie-based token storage

---

### 2.2 Frontend Authentication System
**Status:** ✅ Complete

#### Components
- **Auth Context:** `AuthContext.tsx`
  - Global authentication state management
  - Login function
  - Logout function
  - Token storage in localStorage
  - Auto-login on page load
  - Token validation on mount

- **Login Page:** `Login.tsx`
  - Login form (username/password)
  - Form validation
  - Error handling
  - Redirect after successful login
  - Loading states

- **Protected Route:** `ProtectedRoute.tsx`
  - Route guard component
  - Redirects to login if not authenticated
  - Checks token validity

- **API Utility:** `api.ts` or request interceptors
  - Adds Authorization header to API requests
  - Handles token refresh
  - Error handling for 401 responses

**Tasks:**
- [x] Create AuthContext for state management
- [x] Build login page UI
- [x] Implement login API call
- [x] Add token storage (localStorage)
- [x] Create ProtectedRoute component
- [x] Add API request interceptors
- [x] Implement auto-login on refresh
- [x] Add logout functionality
- [x] Handle token expiration

---

### 2.3 User Management
**Status:** ✅ Complete

#### Backend Components
- **User Entity:** `User.java`
  - Fields: username, password (BCrypt), role, enabled, fullName
- **User Repository:** `UserRepository.java`
- **User Service:** `UserService.java`
- **User Controller:** `UserController.java`
  - User CRUD operations (admin only)

**Tasks:**
- [x] Create User entity
- [x] Implement user repository
- [x] Add user service methods
- [x] Create user management endpoints
- [x] Add role-based access control

---

## 3. HEMODIALYSIS UNIT

### 3.1 Hemodialysis Investigation Module
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `HemodialysisInvestigation.java`
  - Table: `hemodialysis_investigation`
  - Individual investigation records
  - Linked to monthly reviews
- **Repository:** `HemodialysisInvestigationRepository.java`
  - `findByPatientIdOrderByInvestigationDateDesc`
  - `findByMonthlyReviewIdOrderByInvestigationDateDesc`
- **Service:** `HemodialysisInvestigationService.java`
  - CRUD operations for investigations
  - Entity ↔ DTO mapping
- **Controller:** `HemodialysisInvestigationController.java`
  - `GET /api/hemodialysis-investigation/{patientId}` - Get all investigations
  - `GET /api/hemodialysis-investigation/{patientId}/{id}` - Get single investigation
  - `POST /api/hemodialysis-investigation/{patientId}` - Create investigation
  - `PUT /api/hemodialysis-investigation/{patientId}/{id}` - Update investigation
  - `DELETE /api/hemodialysis-investigation/{patientId}/{id}` - Delete investigation
  - Monthly review endpoints: `/monthly-review/{monthlyReviewId}`

**Tasks:**
- [x] Create investigation entity
- [x] Implement repository with custom queries
- [x] Build service layer
- [x] Create REST API endpoints
- [x] Add monthly review integration

---

### 3.2 HD Investigation Summary Module
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `HDInvestigationSummary.java`
  - Table: `hd_investigation_summary`
  - JSON storage for investigation data (`investigationDataJson`)
  - Fields: patientId, patientName, dates array, values object, filledBy, doctorsNote
- **Repository:** `HDInvestigationSummaryRepository.java`
  - `findByPatientIdOrderByCreatedAtDesc`
- **Service:** `HDInvestigationSummaryService.java`
  - JSON serialization/deserialization using Jackson
  - CRUD operations
- **Controller:** `HemodialysisInvestigationController.java` (Summary endpoints)
  - `POST /api/hemodialysis-investigation/summary/{patientId}` - Create summary
  - `GET /api/hemodialysis-investigation/summary/{patientId}` - Get all summaries
  - `GET /api/hemodialysis-investigation/summary/record/{id}` - Get single summary
  - `DELETE /api/hemodialysis-investigation/summary/record/{id}` - Delete summary

#### Frontend Components
- **Page:** `HDInvestigation.tsx`
  - Three view modes: list, form, view
  - Dynamic date columns
  - 28 investigation parameters (hemoglobin, platelets, creatinine, etc.)
  - Export functionality (Excel/CSV)
  - Saved summaries management

**Tasks:**
- [x] Design summary entity with JSON storage
- [x] Implement service with JSON handling
- [x] Create REST endpoints
- [x] Build frontend form with dynamic columns
- [x] Add investigation parameters (28 parameters)
- [x] Implement save/load/delete functionality
- [x] Add export to Excel/CSV
- [x] Create view mode for saved summaries
- [x] Add form validation

---

### 3.3 Hemodialysis Monthly Review
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `HemodialysisMonthlyReview.java`
- **Repository:** `HemodialysisMonthlyReviewRepository.java`
- **Service:** `HemodialysisMonthlyReviewService.java`
- **Controller:** `HemodialysisMonthlyReviewController.java`

**Tasks:**
- [x] Create monthly review entity
- [x] Link investigations to monthly reviews
- [x] Implement review endpoints

---

### 3.4 Hemodialysis Records
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `HemodialysisRecord.java`
- **Repository:** `HemodialysisRecordRepository.java`
- **Service:** `HemodialysisRecordService.java`
- **Controller:** `HemodialysisRecordController.java`

**Tasks:**
- [x] Create record entity
- [x] Implement record tracking
- [x] Add schedule management

---

## 4. PERITONEAL DIALYSIS INVESTIGATION

### 4.1 PD Investigation Summary Module
**Status:** ✅ Complete

#### Backend Components
- **Entity:** `PDInvestigationSummary.java`
  - Table: `pd_investigation_summary`
  - JSON storage for investigation data (`investigationDataJson`)
  - Fields: patientId, patientName, dates array, values object, filledBy, doctorsNote
- **Repository:** `PDInvestigationSummaryRepository.java`
  - `findByPatientIdOrderByCreatedAtDesc`
- **Service:** `PDInvestigationSummaryService.java`
  - JSON serialization/deserialization using Jackson
  - CRUD operations
- **Controller:** `PDInvestigationSummaryController.java`
  - `POST /api/pd-investigation/{patientId}` - Create summary
  - `GET /api/pd-investigation/{patientId}` - Get all summaries
  - `GET /api/pd-investigation/record/{id}` - Get single summary
  - `PUT /api/pd-investigation/record/{id}` - Update summary
  - `DELETE /api/pd-investigation/record/{id}` - Delete summary

#### Frontend Components
- **Page:** `PDInvestigation.tsx`
  - Three view modes: list, form, view
  - Dynamic date columns
  - 22 investigation parameters (creatinine, BU, hemoglobin, sodium, etc.)
  - Export functionality (Excel/CSV)
  - Saved summaries management

**Tasks:**
- [x] Design summary entity with JSON storage
- [x] Implement service with JSON handling
- [x] Create REST endpoints
- [x] Build frontend form with dynamic columns
- [x] Add investigation parameters (22 parameters)
- [x] Implement save/load/delete functionality
- [x] Add export to Excel/CSV
- [x] Create view mode for saved summaries
- [x] Add form validation

---

## SUMMARY TABLE

| Module | Backend Status | Frontend Status | Integration Status |
|--------|---------------|-----------------|-------------------|
| **Peritoneal Dialysis** |
| Patient Registration | ✅ Complete | ✅ Complete | ✅ Complete |
| CAPD Summary | ✅ Complete | ✅ Complete | ✅ Complete |
| Infection Tracking | ✅ Complete | ✅ Complete | ✅ Complete |
| Monthly Assessment | ✅ Complete | ✅ Complete | ✅ Complete |
| Data Preview | N/A | ✅ Complete | ✅ Complete |
| Dashboard | N/A | ✅ Complete | ✅ Complete |
| **Login & Authentication** |
| Backend Auth | ✅ Complete | N/A | ✅ Complete |
| Frontend Auth | N/A | ✅ Complete | ✅ Complete |
| User Management | ✅ Complete | ⚠️ Partial | ✅ Complete |
| **Hemodialysis** |
| Investigation | ✅ Complete | ✅ Complete | ✅ Complete |
| Investigation Summary | ✅ Complete | ✅ Complete | ✅ Complete |
| Monthly Review | ✅ Complete | ⚠️ Partial | ✅ Complete |
| Records | ✅ Complete | ⚠️ Partial | ✅ Complete |
| **PD Investigation** |
| Investigation Summary | ✅ Complete | ✅ Complete | ✅ Complete |

---

## KEY TECHNOLOGIES & PATTERNS

### Backend
- **Framework:** Spring Boot
- **Security:** Spring Security + JWT
- **Database:** MySQL/PostgreSQL
- **ORM:** JPA/Hibernate
- **JSON Handling:** Jackson ObjectMapper
- **Architecture:** 3-layer (Controller → Service → Repository)

### Frontend
- **Framework:** React + TypeScript
- **UI Library:** shadcn/ui + TailwindCSS
- **State Management:** React Context API
- **Routing:** React Router
- **HTTP Client:** Fetch API
- **Export:** ExcelJS, CSV utilities

### Data Storage Patterns
- **Simple Data:** Direct column mapping
- **Complex Nested Data:** JSON serialization in TEXT columns
- **Relationships:** JPA relationships for linked entities

---

## DEPENDENCIES & INTEGRATIONS

### Cross-Module Dependencies
1. **Patient Context:** All modules depend on patient selection (PHN)
2. **Authentication:** All API calls require JWT token
3. **Export Utilities:** Shared export functions for investigation summaries
4. **Date Utilities:** Shared date formatting functions

### API Endpoints Summary
- **Authentication:** `/api/auth/**`
- **Patient Registration:** `/api/patient-registration/**`
- **CAPD Summary:** `/api/capd-summary/**`
- **Infection Tracking:** `/api/infection-tracking/**`
- **Monthly Assessment:** `/api/monthly-assessment/**`
- **HD Investigation:** `/api/hemodialysis-investigation/**`
- **PD Investigation:** `/api/pd-investigation/**`

---

## NOTES

1. **JSON Storage:** Both HD and PD investigation summaries use JSON storage for flexible data structure
2. **Patient Context:** All modules require patient selection via PHN search
3. **Export Functionality:** Investigation summaries can be exported to Excel or CSV
4. **View Modes:** Investigation modules support list, form, and view modes
5. **Authentication:** JWT tokens stored in both localStorage and HttpOnly cookies

---

*Last Updated: Based on current codebase analysis*
*Status Legend: ✅ Complete | ⚠️ Partial | ❌ Not Started*

