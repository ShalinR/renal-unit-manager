import React, { useState, useEffect, useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CalendarDays, ClipboardList, Save, Activity, Calendar, FileText } from 'lucide-react';
import { HemodialysisRecord, ValidationErrors } from '@/types/hemodialysis';
import { HDPrescriptionStep } from '@/components/hemodialysis/steps/HDPrescriptionStep';
import { VascularAccessStep } from '@/components/hemodialysis/steps/VascularAccessStep';
import { DialysisSessionStep } from '@/components/hemodialysis/steps/DialysisSessionStep';
import { OtherNotesStep } from '@/components/hemodialysis/steps/OtherNotesStep';
import { ConfirmationStep } from '@/components/hemodialysis/steps/ConfirmationStep';
import { DialysisCalendar } from '@/components/hemodialysis/DialysisCalendar';
import { ScheduleAppointment } from '@/components/hemodialysis/ScheduleAppointment';
import { PatientSummary } from '@/components/hemodialysis/PatientSummary';
import { WeeklyTimetable } from '@/components/hemodialysis/WeeklyTimetable';
import { formatDateDisplay } from '@/lib/dateUtils';
import { createHemodialysisRecord } from '@/services/hemodialysisApi';
import { usePatientContext } from '@/context/PatientContext';

interface HemodialysisPageProps {
  initialData?: HemodialysisRecord;
  onSave?: (record: HemodialysisRecord) => void;
  onCancel?: () => void;
  enableAutosave?: boolean;
}

export type ActiveView = 
  | "dashboard" 
  | "session-form" 
  | "schedule-appointment" 
  | "view-calendar" 
  | "patient-summary";

// Define initial form state
const initialFormState: HemodialysisRecord = {
  prescription: {
    access: 'AV Fistula',
    durationMinutes: 240,
    bloodFlowRate: 350,
    dryWeightKg: 70,
    dialysisProfile: '',
    sodium: undefined,
    bicarbonate: undefined,
    dialysateFlowRate: undefined,
    temperature: undefined,
    ultrafiltrationVolume: undefined,
    anticoagulation: undefined,
    erythropoetinDose: undefined,
    otherTreatment: undefined,
  },
  vascularAccess: {
    access: 'AV Fistula',
    dateOfCreation: '',
    createdBy: '',
    complications: '',
  },
  session: {
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 240,
    preDialysisWeightKg: 71,
    postDialysisWeightKg: 70,
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
    },
    bloodFlowRate: 350,
    pulseRate: undefined,
    oxygenSaturationPercent: undefined,
    arterialPressure: undefined,
    venousPressure: undefined,
    transmembranePressure: undefined,
    ultrafiltrationVolume: undefined,
    interDialyticWeightGainKg: undefined,
  },
  otherNotes: '',
};

// Form reducer for state management
const formReducer = (state: any, action: { type: string; payload: any }) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      const { form, field, value } = action.payload;

      if (!state[form]) {
        console.warn(`Form ${form} does not exist in state`);
        return state;
      }

      const path = field.split('.');
      const newState = { ...state };

      if (!newState[form]) {
        newState[form] = {};
      }

      let current = newState[form];

      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined || current[path[i]] === null) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newState;

    case "SET_FORM_DATA":
      return {
        ...state,
        [action.payload.form]: {
          ...state[action.payload.form],
          ...action.payload.data,
        },
      };
    case "RESET_FORM":
      return initialFormState;
    default:
      return state;
  }
};

const HemodialysisPage: React.FC<HemodialysisPageProps> = ({
  initialData,
  onSave,
  onCancel,
  enableAutosave = false,
}) => {
  const { toast } = useToast();
  const { patient, globalPatient } = usePatientContext();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [filledBy, setFilledBy] = useState('');
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [showFloatingTimetable, setShowFloatingTimetable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state with reducer
  const [state, dispatch] = useReducer(formReducer, {
    ...initialFormState,
    ...(initialData || {})
  });

  const formData = state;

  // Get patient ID from context (use PHN - required)
  const patientId = patient?.phn || globalPatient?.phn;
  const patientName = patient?.name || globalPatient?.name || '';

  // Compute inter-dialytic weight gain
  useEffect(() => {
    if (!formData.session.interDialyticWeightGainKg) {
      const computed = (formData.session.preDialysisWeightKg ?? 0) - (formData.prescription.dryWeightKg ?? 0);
      dispatch({
        type: "UPDATE_FIELD",
        payload: {
          form: "session",
          field: "interDialyticWeightGainKg",
          value: parseFloat(computed.toFixed(2))
        }
      });
    }
  }, [formData.session.preDialysisWeightKg, formData.prescription.dryWeightKg, formData.session.interDialyticWeightGainKg]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Prescription
    if (!formData.prescription.access) newErrors['prescription.access'] = 'Access type is required';
    if (!formData.prescription.durationMinutes || formData.prescription.durationMinutes <= 0) newErrors['prescription.durationMinutes'] = 'Duration must be greater than 0';
    if (formData.prescription.durationMinutes < 15 || formData.prescription.durationMinutes > 720) newErrors['prescription.durationMinutes'] = 'Duration must be between 15 and 720 minutes';
    if (!formData.prescription.bloodFlowRate || formData.prescription.bloodFlowRate <= 0) newErrors['prescription.bloodFlowRate'] = 'Blood flow rate is required';
    if (formData.prescription.bloodFlowRate < 50 || formData.prescription.bloodFlowRate > 600) newErrors['prescription.bloodFlowRate'] = 'Blood flow rate must be between 50 and 600 mL/min';
    if (!formData.prescription.dryWeightKg || formData.prescription.dryWeightKg <= 0) newErrors['prescription.dryWeightKg'] = 'Dry weight is required';

    // Vascular
    if (!formData.vascularAccess.access) newErrors['vascularAccess.access'] = 'Access type is required';

    // Session
    if (!formData.session.date) newErrors['session.date'] = 'Session date is required';
    if (!formData.session.durationMinutes || formData.session.durationMinutes <= 0) newErrors['session.durationMinutes'] = 'Duration must be greater than 0';
    if (formData.session.durationMinutes < 15 || formData.session.durationMinutes > 720) newErrors['session.durationMinutes'] = 'Duration must be between 15 and 720 minutes';
    if (!formData.session.preDialysisWeightKg || formData.session.preDialysisWeightKg <= 0) newErrors['session.preDialysisWeightKg'] = 'Pre-dialysis weight is required';
    if (!formData.session.postDialysisWeightKg || formData.session.postDialysisWeightKg <= 0) newErrors['session.postDialysisWeightKg'] = 'Post-dialysis weight is required';
    if (!formData.session.bloodPressure.systolic || formData.session.bloodPressure.systolic <= 0) newErrors['session.bloodPressure.systolic'] = 'Systolic BP is required';
    if (!formData.session.bloodPressure.diastolic || formData.session.bloodPressure.diastolic <= 0) newErrors['session.bloodPressure.diastolic'] = 'Diastolic BP is required';
    if (!formData.session.bloodFlowRate || formData.session.bloodFlowRate <= 0) newErrors['session.bloodFlowRate'] = 'Blood flow rate is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    const keys = field.split('.');
    const formSection = keys[0] as keyof HemodialysisRecord;
    
    dispatch({
      type: "UPDATE_FIELD",
      payload: {
        form: formSection,
        field: keys.slice(1).join('.'),
        value
      }
    });
    setHasUnsavedChanges(true);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    validateForm();
  };

  const handleSubmit = async () => {
    if (!patientId) {
      toast({ title: 'Patient Not Selected', description: 'Please search for a patient by PHN first before saving hemodialysis record.', variant: 'destructive' });
      return;
    }
    if (!filledBy.trim()) {
      setTouched(prev => new Set(prev).add('filledBy'));
      setErrors(prev => ({ ...prev, filledBy: 'Please enter who filled out this form' }));
      toast({ title: 'Missing Information', description: 'Please confirm who filled out this form', variant: 'destructive' });
      return;
    }
    if (!validateForm()) {
      toast({ title: 'Validation Error', description: 'Please fix the errors before submitting', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      const recordToSave = {
        sessionDate: formData.session.date,
        prescription: formData.prescription,
        vascularAccess: formData.vascularAccess,
        session: formData.session,
        otherNotes: formData.otherNotes,
        filledBy: filledBy,
      } as any;

      await createHemodialysisRecord(patientId as string, recordToSave);
      onSave?.(formData);
      setHasUnsavedChanges(false);
      toast({ title: 'Success', description: 'Hemodialysis record saved successfully' });
      setCurrentStep(0);
      setFilledBy('');
      setActiveView("dashboard");
    } catch (error: any) {
      console.error('Error saving hemodialysis record:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save hemodialysis record', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!enableAutosave || !hasUnsavedChanges) return;
    const timer = setTimeout(() => {
      if (validateForm()) {
        onSave?.(formData);
        setHasUnsavedChanges(false);
        toast({ title: 'Autosaved', description: 'Your changes have been saved' });
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, [formData, hasUnsavedChanges, enableAutosave]);

  const getError = (field: string) => touched.has(field) ? (errors as any)[field] : undefined;

  const steps = [
    { title: 'HD Prescription', component: HDPrescriptionStep },
    { title: 'Vascular Access', component: VascularAccessStep },
    { title: 'Dialysis Session', component: DialysisSessionStep },
    { title: 'Other Notes', component: OtherNotesStep },
    { title: 'Review & Confirm', component: ConfirmationStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-end gap-2">
            {activeView !== "dashboard" && (
              <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                Back to Dashboard
              </Button>
            )}
            {activeView === "session-form" && (
              <Button variant="outline" onClick={() => {
                if (hasUnsavedChanges) {
                  const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
                  if (!confirmed) return;
                }
                onCancel?.();
                setActiveView("dashboard");
              }}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {activeView === "session-form" && (
          <div className="space-y-6">
            <div className="bg-background rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} 
                />
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm">
              {currentStep === 0 && (
                <HDPrescriptionStep 
                  formData={formData} 
                  errors={errors} 
                  touched={touched} 
                  onFieldChange={handleFieldChange} 
                  onBlur={handleBlur} 
                />
              )}
              {currentStep === 1 && (
                <VascularAccessStep 
                  formData={formData} 
                  errors={errors} 
                  touched={touched} 
                  onFieldChange={handleFieldChange} 
                  onBlur={handleBlur} 
                />
              )}
              {currentStep === 2 && (
                <DialysisSessionStep 
                  formData={formData} 
                  errors={errors} 
                  touched={touched} 
                  onFieldChange={handleFieldChange} 
                  onBlur={handleBlur} 
                />
              )}
              {currentStep === 3 && (
                <OtherNotesStep 
                  formData={formData} 
                  onFieldChange={handleFieldChange} 
                />
              )}
              {currentStep === 4 && (
                <ConfirmationStep 
                  formData={formData} 
                  errors={errors} 
                  touched={touched} 
                  filledBy={filledBy} 
                  onFilledByChange={setFilledBy} 
                  onBlur={handleBlur} 
                />
              )}
            </div>

            <div className="flex justify-between bg-background rounded-lg p-4 shadow-sm sticky bottom-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))} 
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={() => setCurrentStep(prev => Math.min(prev + 1, 4))} 
                  className="bg-primary hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="bg-primary hover:bg-primary/90" 
                  disabled={!patientId || !filledBy.trim() || isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Submit Record'}
                </Button>
              )}
            </div>
          </div>
        )}

        {activeView === "schedule-appointment" && (
          <ScheduleAppointment />
        )}

        {activeView === "view-calendar" && (
          <DialysisCalendar />
        )}

        {activeView === "patient-summary" && (
          <PatientSummary />
        )}

        {activeView === "dashboard" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-2 mx-auto">
                <Activity className="w-9 h-9 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Hemodialysis Management</h1>
            </div>

            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: ClipboardList,
                    title: "Session Form",
                    view: "session-form" as ActiveView,
                  },
                  {
                    icon: CalendarDays,
                    title: "Schedule Appointment",
                    view: "schedule-appointment" as ActiveView,
                  },
                  {
                    icon: Calendar,
                    title: "View Calendar",
                    view: "view-calendar" as ActiveView,
                  },
                  {
                    icon: FileText,
                    title: "Patient Summary",
                    view: "patient-summary" as ActiveView,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.title}
                      className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full"
                    >
                      <div className="flex flex-col items-center text-center">
                        <Icon className="w-10 h-10 text-primary mb-2" />
                        <CardTitle className="text-xl font-medium mb-4">
                          {item.title}
                        </CardTitle>
                      </div>
                      <Button
                        onClick={() => setActiveView(item.view)}
                        className="px-6 py-2 text-base w-full"
                        disabled={item.view === "patient-summary" && !patientId}
                      >
                        Access
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={() => setShowFloatingTimetable(true)} 
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90" 
        size="icon"
      >
        <CalendarDays className="w-6 h-6" />
      </Button>

      {showFloatingTimetable && (
        <WeeklyTimetable onClose={() => setShowFloatingTimetable(false)} />
      )}
    </div>
  );
};

export default HemodialysisPage;