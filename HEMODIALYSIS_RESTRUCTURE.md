# Hemodialysis Dashboard - Restructured Components

## Overview
The Hemodialysis dashboard has been completely restructured into separate, reusable components following the same styling pattern as the Recipient Assessment form in the Kidney Transplant module.

## New File Structure

### Component Directory (`frontend/src/components/`)

#### 1. **HDSessionForm.tsx** (Main Form Component)
- **Purpose**: 6-step stepper form for HD session data entry
- **Features**:
  - Personal information (auto-populated from patient context)
  - HD Prescription (13 fields)
  - Vascular Access (4 fields)
  - Dialysis Session (13 vital measurements)
  - Other Notes (free text)
  - Confirmation step
- **Styling**: Matches RecipientAssessment form exactly
  - Blue gradient headers
  - Consistent spacing and border styling
  - Professional card layouts
  - Clear step navigation with progress indicators
- **Auto-features**:
  - Auto-population of personal info when patient selected via GlobalSearch
  - Auto-computation of inter-dialytic weight gain from dry weight and pre-dialysis weight
  - Per-step validation with error messages

#### 2. **HDMonthlyReview.tsx**
- **Purpose**: Monthly review of hemodialysis sessions
- **Status**: Placeholder with "Coming Soon" message
- **Future Features**: Session analytics, trend charts, patient progress

#### 3. **HDScheduleAppointment.tsx**
- **Purpose**: Schedule and manage dialysis appointments
- **Status**: Placeholder with "Coming Soon" message
- **Future Features**: Calendar booking, time slot management

#### 4. **HDSummary.tsx**
- **Purpose**: Comprehensive treatment summary and statistics
- **Status**: Placeholder with "Coming Soon" message
- **Future Features**: Charts, statistics, treatment history

### Page (`frontend/src/pages/`)

#### **HaemoDialysis.tsx** (Refactored Main Page)
- **Purpose**: Dashboard controller and navigation hub
- **Changes from Previous**:
  - ✅ Removed duplicate GlobalSearch (only in dashboard header)
  - ✅ Simplified component imports (now using separate components)
  - ✅ Cleaner main logic (view switching only)
  - ✅ 4 clickable dashboard cards with actual navigation
- **Structure**:
  - Header with GlobalSearch (only when on dashboard)
  - Back button (only when not on dashboard)
  - Dashboard view with 4 cards
  - Conditional rendering of separate component views

## Key Improvements

### 1. **No GlobalSearch Duplication**
- GlobalSearch now only appears on the dashboard
- Automatically hidden when viewing sub-pages (session form, monthly review, etc.)
- Cleaner, more professional interface

### 2. **Exact Styling Match to RecipientAssessment**
```tsx
// Header Styling
<CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
  <CardTitle className="flex items-center gap-3 text-xl">
    <Icon className="w-6 h-6" />
    Section Title
  </CardTitle>
  <CardDescription className="text-blue-100">
    Description text
  </CardDescription>
</CardHeader>

// Input Styling
<Input
  className={`h-12 border-2 ${
    errors.fieldName ? 'border-red-500' : 'border-gray-200'
  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
/>

// Progress Indicator
<div className="flex items-center justify-center w-10 h-10 rounded-full z-10 transition-colors ${
  isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
}">
```

### 3. **Modular Component Architecture**
- Each feature (form, monthly review, schedule, summary) is a separate component
- Easier to maintain and test
- Can be developed independently
- Clear separation of concerns

### 4. **Auto-Population from Patient Context**
- Personal information auto-populates when patient selected via GlobalSearch
- Exact same pattern as RecipientAssessment form
- Smooth user experience with pre-filled data

### 5. **Clean Navigation Flow**
```
Dashboard
  ├── HD Session Form
  ├── Monthly Review
  ├── Schedule Appointment
  └── View Summary

Each can navigate back to Dashboard
```

## Component API

### HDSessionForm
```tsx
interface HDSessionFormProps {
  form: HemodialysisForm;
  setForm: React.Dispatch<React.SetStateAction<HemodialysisForm>>;
  onBack: () => void;
}
```

### Other Components
```tsx
interface HD[Feature]Props {
  onBack: () => void;
}
```

## Form Fields

### Personal Information (Step 1)
- Full Name (auto-populated)
- Personal Health Number (PHN) (auto-populated)
- Age (auto-populated)
- Gender (auto-populated)

### HD Prescription (Step 2)
- Access Type
- Duration (minutes)
- Dialysis Profile
- Sodium, Bicarbonate levels
- Blood Flow Rate
- Dialysate Flow Rate
- Temperature
- Dry Weight
- Ultrafiltration Volume
- Anticoagulation Type
- Erythropoietin Dose
- Other Treatments

### Vascular Access (Step 3)
- Access Type
- Date of Creation
- Created By
- Complications

### Dialysis Session (Step 4)
- Date
- Duration
- Pre/Post Dialysis Weight
- Inter-Dialytic Weight Gain (auto-calculated)
- Blood Pressure (Systolic/Diastolic)
- Pulse Rate
- O2 Saturation
- Blood Flow Rate
- Arterial/Venous/Transmembrane Pressures
- Ultrafiltration Volume

### Other Notes (Step 5)
- Free text field for additional observations

### Confirmation (Step 6)
- Summary review before submission

## Styling Classes Used

- **Gradient Headers**: `bg-gradient-to-r from-blue-600 to-blue-700`
- **Input Fields**: `h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`
- **Error States**: `border-red-500`
- **Cards**: `shadow-lg border-0 bg-white`
- **Buttons**: Standard shadcn/ui Button component with consistent styling
- **Progress Indicators**: Blue (active) and gray (inactive) backgrounds

## Future Implementation Notes

### To Add API Integration:
1. Create `hemodialysisApi.ts` service in `frontend/src/services/`
2. Update `HDSessionForm.submit()` to call API endpoint
3. Add toast notifications for success/error

### To Implement Monthly Review:
1. Fetch hemodialysis records from API filtered by patient PHN
2. Display in table or chart format
3. Add filters for date range

### To Implement Schedule Appointment:
1. Add calendar component (use existing calendar UI components)
2. Show available dialysis slots
3. Allow booking with confirmation

### To Implement View Summary:
1. Aggregate patient hemodialysis data
2. Create summary statistics and charts
3. Display treatment adequacy metrics
