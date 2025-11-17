# Testing Guide - Kidney Transplant Summary

## Quick Start Testing

### Prerequisites
- Backend running on port 8081
- Frontend running on port 5173
- Patient data already in system

### Test Scenario

#### Step 1: Data Setup
```
1. Navigate to Patient Directory (Dashboard)
2. Search for an existing patient or create a new one
3. Fill out the following forms (or verify they exist):
   - Recipient Assessment Form
   - Donor Assessment Form
   - KT Surgery Form
   - Follow-up Form (with doctor notes)
```

#### Step 2: Navigate to Summary View
```
1. Go to Kidney Transplant page
2. Patient should be selected from context
3. Click "Summary" button on the main dashboard
4. Component should load automatically
```

#### Step 3: Verify Data Display
Check the following sections are populated:

**Patient Information Card:**
- ✓ Full name
- ✓ Age
- ✓ Gender
- ✓ Date of birth
- ✓ NIC number
- ✓ Contact details
- ✓ Email address

**Medical Background Card:**
- ✓ Primary complaint
- ✓ Comorbidities list
- ✓ Occupation
- ✓ Drug history
- ✓ Allergies

**Transplantation Overview:**
- ✓ Date of KT
- ✓ Type of transplant
- ✓ Surgeon name
- ✓ Unit
- ✓ Side (Left/Right)
- ✓ Primary diagnosis
- ✓ RRT mode and duration
- ✓ Pre-KT creatinine
- ✓ Post-KT creatinine
- ✓ Delayed graft function
- ✓ Post-KT dialysis
- ✓ Acute rejection status

**Immunosuppression Protocol:**
- ✓ Pre-KT preparation (TPE/IVIG/None)
- ✓ Induction therapy type
- ✓ Maintenance medications

**Prophylaxis & Vaccination:**
- ✓ Cotrimoxazole details
- ✓ Valganciclovir details
- ✓ Vaccination status

**Latest Follow-up Assessment:**
- ✓ Date of visit
- ✓ Post-KT duration
- ✓ **Doctor's Notes** (KEY - should display doctor notes from FollowUp form)
- ✓ Weight, BMI, Blood pressure
- ✓ Creatinine, eGFR, Electrolytes
- ✓ Current treatment medications

**Donor Information:**
- ✓ Name
- ✓ Age
- ✓ Relation to recipient
- ✓ Contact details
- ✓ Blood group

**Immunological Compatibility:**
- ✓ Blood groups (donor & recipient)
- ✓ PRA values
- ✓ Cross-match results
- ✓ DSA
- ✓ Risk level

#### Step 4: Test Export Functionality
```
1. Click "Export" button
2. A Word document should download named:
   Kidney-Transplant-Summary-{PatientName}-{Date}.doc
3. Open the document
4. Verify all data sections are present
5. Check formatting is correct
```

#### Step 5: Test Print Functionality
```
1. Click "Print" button
2. Browser print dialog should open
3. Print preview should show formatted summary
4. All sections should be visible
5. Download as PDF if needed
```

#### Step 6: Check Console Logs
**Browser Console (F12 → Console tab):**
```
Should see logs like:
🔵 [PatientProfileController] Fetching complete profile for PHN: PHN100001
✅ [PatientProfileController] Successfully retrieved profile for PHN: PHN100001
📋 KidneyTransplantSummary: Loading complete profile for PHN: PHN100001
✅ KidneyTransplantSummary: Profile loaded successfully
```

**Backend Console:**
```
Should see logs like:
🔵 [PatientProfileController] Fetching complete profile for PHN: PHN100001
✅ [PatientProfileController] Successfully retrieved profile for PHN: PHN100001
```

---

## Specific Feature Testing

### Doctor's Notes Display
1. Navigate to Follow-up form
2. Add a new follow-up entry
3. Fill in date and add detailed doctor's notes
4. Save the follow-up
5. Go to Summary view
6. In "Latest Follow-up Assessment" card, verify doctor's notes appear in the "Clinical Notes" section

### KT Surgery Data Integration
1. Go to KT Surgery form
2. Fill in all sections (medical history, pre-KT details, transplant details, etc.)
3. Submit the form
4. Navigate to Summary view
5. Verify all KT Surgery data appears in "Transplantation Overview" section

### Donor Information Integration
1. Go to Donor Assessment form
2. Fill in donor details and immunological information
3. Submit the form
4. Navigate to Summary view
5. Verify donor information appears in "Donor Information" card
6. Verify immunological details appear in "Immunological Compatibility" card

### Error Handling
1. **Test missing patient:** Try accessing summary without selecting a patient
   - Should show error message: "No patient selected" or "Patient profile not found"

2. **Test network error:** Temporarily disable backend
   - Should show error message: "Failed to load patient profile"

3. **Test missing data:** Submit partial forms
   - Should handle gracefully with "N/A" values where data is missing

---

## Expected Results

### Successful Load
```
Loading state: "Loading Patient Summary..."
         ↓
Data loads (1-2 seconds)
         ↓
Complete summary displays with all patient data
```

### Doctor's Notes Display
```
In "Latest Follow-up Assessment" card:
├── Physical Examination
│   ├── Date: [follow-up date]
│   └── Post-KT Duration: [calculated duration]
├── Laboratory Results
│   └── [All lab values]
└── Clinical Notes  ← DOCTOR'S NOTES DISPLAY HERE
    └── [Complete doctor's note text]
```

---

## Common Issues & Solutions

### Issue 1: Doctor's Notes Not Showing
**Symptoms:** "Clinical Notes" section shows "No notes available."
**Solution:**
1. Verify follow-up was saved with doctor notes
2. Check FollowUpDTO in backend has `doctorNote` field
3. Verify PatientService correctly fetches follow-ups

### Issue 2: Profile Loading Stuck on "Loading..."
**Symptoms:** Component stays on loading screen indefinitely
**Solution:**
1. Check browser console for API errors
2. Verify backend is running on port 8081
3. Check patient PHN is correctly passed
4. Verify PatientProfileController is deployed

### Issue 3: Some Data Missing
**Symptoms:** Some fields show "N/A" or are blank
**Solution:**
1. Verify all forms (Recipient, Donor, KT, FollowUp) are filled and saved
2. Check that patient PHN is consistent across all forms
3. Review backend console for any service failures

### Issue 4: CORS Error
**Symptoms:** Console shows "Access to XMLHttpRequest blocked by CORS policy"
**Solution:**
1. Ensure PatientProfileController has `@CrossOrigin` annotation
2. Verify frontend URL (http://localhost:5173) is in CORS whitelist
3. Restart backend

---

## Sample Data for Testing

If you don't have existing patient data, here's a sample to create:

```
Patient: John Doe
PHN: TEST001
NIC: 123456789V
Age: 45
DOB: 1979-01-15
Gender: Male
Contact: 0771234567
Email: john@test.local

Recipient Assessment:
- Complains: Chronic kidney disease
- Comorbidities: Diabetes, Hypertension
- Drug History: Metformin, Lisinopril

Donor Assessment:
- Name: Jane Doe
- Age: 42
- Relation: Sister
- Blood Group: O+
- T-cell Match: Negative
- B-cell Match: Negative

KT Surgery:
- Date: 2024-11-01
- Type: Live related
- Surgeon: Dr. Smith
- Unit: NHK
- Side: Left

Follow-up:
- Date: 2024-11-15
- Doctor Notes: "Patient recovering well. Graft functioning. Continue current immunosuppression."
- Creatinine: 1.2 mg/dL
- eGFR: 58 mL/min
```

---

## Performance Considerations

**Expected Load Times:**
- Profile API call: 100-200ms
- Component render: 50-100ms
- **Total:** ~150-300ms

**If loading takes longer:**
1. Check backend performance
2. Review database query logs
3. Consider adding caching for frequently accessed profiles

---

## Success Criteria

✅ All sections render without errors
✅ Doctor's notes display correctly
✅ Export/Print functionality works
✅ All related data (KT, Recipient, Donor, FollowUp) integrated
✅ No console errors
✅ Loading states handled properly
✅ Error handling works for edge cases

---

## Rollback Instructions (if needed)

If issues arise, revert to previous state:

```bash
# Revert KidneyTransplantSummary to use prop-based loading
# - Remove useEffect and patientProfileApi import
# - Add patientProfile prop back to interface
# - Restore original component rendering

# Revert KidneyTransplant.tsx
# - Pass patientProfile prop to KidneyTransplantSummary again
```

---

For issues or questions, check logs in:
- Browser Console (Ctrl+Shift+I)
- Backend logs (terminal/IDE)
