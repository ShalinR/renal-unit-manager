# TODO List - Sorted by Unit and Priority

## Overview
This document lists all pending tasks and enhancements organized by unit and priority level.

---

## 🔴 HIGH PRIORITY - Critical Missing Features

### Hemodialysis Unit

#### 1. Session History Integration ⚠️ **URGENT**
**Task:** Integrate Session History system into HDSessionForm component
- [ ] Add `useSessionHistory` hook to HDSessionForm
- [ ] Implement auto-save draft functionality with debounce
- [ ] Add `SessionHistoryView` component to display saved sessions
- [ ] Connect draft restoration functionality
- [ ] Add backend sync for session history
- [ ] Test draft recovery and session persistence
- **Reference:** `EXAMPLE_SESSION_HISTORY_INTEGRATION.tsx`
- **Files:** `frontend/src/components/HDSessionForm.tsx`

#### 2. HD Records Frontend Completion ⚠️ **HIGH**
**Task:** Complete Hemodialysis Records frontend implementation
- [ ] Enhance HDSessionForm integration with backend
- [ ] Build comprehensive records list view
- [ ] Add session editing functionality
- [ ] Implement session deletion with confirmation
- [ ] Add session filtering and search
- [ ] Create session detail view modal
- **Files:** `frontend/src/pages/HaemoDialysis.tsx`, `frontend/src/components/HDSessionForm.tsx`

#### 3. HD Monthly Review Frontend ⚠️ **HIGH**
**Task:** Build frontend UI for Hemodialysis Monthly Review
- [ ] Create monthly review list view
- [ ] Build review creation/editing form
- [ ] Link investigations to monthly reviews
- [ ] Add review summary dashboard
- [ ] Implement review filtering by date range
- **Files:** Create new component or enhance existing HD pages

---

### Authentication & User Management

#### 4. User Management Frontend ⚠️ **HIGH**
**Task:** Complete User Management frontend (Backend is complete)
- [ ] Build admin user list page
- [ ] Create user creation form
- [ ] Add user editing functionality
- [ ] Implement user enable/disable toggle
- [ ] Add role assignment UI
- [ ] Create user search and filtering
- [ ] Add password reset functionality
- **Files:** Create `frontend/src/pages/UserManagement.tsx`

---

## 🟡 MEDIUM PRIORITY - Feature Enhancements

### Investigation Modules

#### 5. PD Investigation Update Endpoint
**Task:** Add UPDATE functionality for PD Investigation Summary
- [ ] Add PUT endpoint call in `pdInvestigationApi.ts`
- [ ] Implement edit mode in PDInvestigation.tsx
- [ ] Add "Edit" button to saved summaries list
- [ ] Handle form pre-population for editing
- [ ] Test update functionality
- **Files:** `frontend/src/services/pdInvestigationApi.ts`, `frontend/src/pages/PDInvestigation.tsx`

#### 6. HD Investigation Update Endpoint
**Task:** Add UPDATE functionality for HD Investigation Summary
- [ ] Verify backend PUT endpoint exists
- [ ] Add PUT endpoint call in `hdInvestigationApi.ts`
- [ ] Implement edit mode in HDInvestigation.tsx
- [ ] Add "Edit" button to saved summaries list
- [ ] Handle form pre-population for editing
- **Files:** `frontend/src/services/hdInvestigationApi.ts`, `frontend/src/pages/HDInvestigation.tsx`

---

### Data Management

#### 7. Export Data Validation
**Task:** Improve export functionality with better error handling
- [ ] Add validation before export
- [ ] Handle empty data gracefully
- [ ] Add user-friendly error messages
- [ ] Implement export progress indicators
- [ ] Test with various data scenarios
- **Files:** `frontend/src/lib/exportUtils.ts`

#### 8. Batch Export Functionality
**Task:** Allow exporting multiple records at once
- [ ] Add multi-select to investigation summary lists
- [ ] Implement batch export function
- [ ] Create combined Excel/CSV files
- [ ] Add export progress tracking
- **Files:** `frontend/src/lib/exportUtils.ts`, investigation pages

---

## 🟢 LOW PRIORITY - Quality of Life Improvements

### Authentication

#### 9. Token Refresh Mechanism
**Task:** Implement automatic JWT token refresh
- [ ] Add token expiration detection
- [ ] Implement refresh token endpoint
- [ ] Create automatic refresh before expiration
- [ ] Handle refresh failures gracefully
- [ ] Update AuthContext with refresh logic
- **Files:** `frontend/src/context/AuthContext.tsx`, `backend/.../AuthenticationController.java`

---

### User Experience

#### 10. Patient Context Enhancement
**Task:** Improve global patient search and context management
- [ ] Enhance patient search UI
- [ ] Add patient switching without data loss
- [ ] Implement patient history tracking
- [ ] Add quick patient switcher component
- [ ] Improve patient context persistence
- **Files:** `frontend/src/context/PatientContext.tsx`

#### 11. Form Validation Enhancement
**Task:** Add comprehensive real-time validation
- [ ] Add real-time validation feedback
- [ ] Implement field-level error messages
- [ ] Add form submission prevention for invalid data
- [ ] Create validation rules for all forms
- [ ] Add validation summary display
- **Files:** All form components

#### 12. Error Handling Improvement
**Task:** Standardize error handling across application
- [ ] Create consistent error message format
- [ ] Add retry mechanisms for failed API calls
- [ ] Implement better user feedback
- [ ] Add error logging and tracking
- [ ] Create error boundary components
- **Files:** All API service files, error handling utilities

---

### UI/UX Improvements

#### 13. Mobile Responsiveness
**Task:** Optimize for mobile devices
- [ ] Test all forms on mobile devices
- [ ] Optimize investigation summary tables for mobile
- [ ] Improve touch interactions
- [ ] Add mobile-specific navigation
- [ ] Test on various screen sizes
- **Files:** All page components, especially investigation pages

#### 14. Dashboard Analytics
**Task:** Create analytics and summary dashboard
- [ ] Design analytics dashboard layout
- [ ] Add patient statistics widgets
- [ ] Implement treatment trend charts
- [ ] Add key metrics display
- [ ] Create date range filters
- **Files:** Create `frontend/src/pages/Analytics.tsx`

---

## 📋 TASK SUMMARY BY UNIT

### Peritoneal Dialysis Unit
- ✅ All core features complete
- 🟡 Enhancement: Export improvements (shared with HD)

### Hemodialysis Unit
- 🔴 **URGENT:** Session History Integration
- 🔴 **HIGH:** Records Frontend Completion
- 🔴 **HIGH:** Monthly Review Frontend
- 🟡 **MEDIUM:** HD Investigation Update Endpoint
- 🟡 **MEDIUM:** Export enhancements

### Login & Authentication
- 🔴 **HIGH:** User Management Frontend
- 🟢 **LOW:** Token Refresh Mechanism

### Peritoneal Dialysis Investigation
- 🟡 **MEDIUM:** PD Investigation Update Endpoint
- 🟡 **MEDIUM:** Export enhancements

### Cross-Cutting Concerns
- 🟢 **LOW:** Patient Context Enhancement
- 🟢 **LOW:** Form Validation Enhancement
- 🟢 **LOW:** Error Handling Improvement
- 🟢 **LOW:** Mobile Responsiveness
- 🟢 **LOW:** Dashboard Analytics

---

## 🎯 RECOMMENDED WORK ORDER

### Phase 1: Critical Features (Week 1-2)
1. **Session History Integration** - Most urgent for HD workflow
2. **HD Records Frontend** - Complete core HD functionality
3. **User Management Frontend** - Complete admin capabilities

### Phase 2: Feature Completion (Week 3-4)
4. **HD Monthly Review Frontend** - Complete HD module
5. **PD/HD Investigation Update** - Add missing edit functionality
6. **Export Enhancements** - Improve data export capabilities

### Phase 3: Quality Improvements (Week 5-6)
7. **Token Refresh** - Improve authentication reliability
8. **Form Validation** - Enhance user experience
9. **Error Handling** - Improve system robustness
10. **Mobile Responsiveness** - Expand device support

### Phase 4: Advanced Features (Week 7+)
11. **Patient Context Enhancement** - Improve workflow
12. **Dashboard Analytics** - Add insights and reporting
13. **Batch Export** - Advanced data management

---

## 📊 COMPLETION STATUS

| Priority | Count | Status |
|----------|-------|--------|
| 🔴 High Priority | 4 | 0% Complete |
| 🟡 Medium Priority | 4 | 0% Complete |
| 🟢 Low Priority | 6 | 0% Complete |
| **Total** | **14** | **0% Complete** |

---

## 📝 NOTES

1. **Session History Integration** is marked as most urgent because:
   - Example implementation already exists
   - Critical for preventing data loss in HD sessions
   - Backend infrastructure may already support it

2. **User Management Frontend** is high priority because:
   - Backend is complete
   - Needed for production deployment
   - Admin functionality is essential

3. **Update Endpoints** are medium priority because:
   - Create/Read/Delete already work
   - Edit functionality is nice-to-have but not critical
   - Can be added incrementally

4. **Low priority items** focus on:
   - User experience improvements
   - System reliability
   - Future scalability

---

*Last Updated: Based on WORK_BREAKDOWN_CHART.md analysis*
*Next Review: After Phase 1 completion*


