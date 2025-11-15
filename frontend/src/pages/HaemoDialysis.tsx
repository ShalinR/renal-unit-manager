import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFloatingTimetable, setShowFloatingTimetable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get patient ID from context (use PHN - required)
  const patientId = patient?.phn || globalPatient?.phn;
  const patientName = patient?.name || globalPatient?.name || '';

  // Form state
  const [formData, setFormData] = useState<HemodialysisRecord>(() => ({
    prescription: {
      access: initialData?.prescription.access ?? 'AV Fistula',
      durationMinutes: initialData?.prescription.durationMinutes ?? 240,
      bloodFlowRate: initialData?.prescription.bloodFlowRate ?? 350,
      dryWeightKg: initialData?.prescription.dryWeightKg ?? 70,
      dialysisProfile: initialData?.prescription.dialysisProfile,
      sodium: initialData?.prescription.sodium,
      bicarbonate: initialData?.prescription.bicarbonate,
      dialysateFlowRate: initialData?.prescription.dialysateFlowRate,
      temperature: initialData?.prescription.temperature,
      ultrafiltrationVolume: initialData?.prescription.ultrafiltrationVolume,
      anticoagulation: initialData?.prescription.anticoagulation,
      erythropoetinDose: initialData?.prescription.erythropoetinDose,
      otherTreatment: initialData?.prescription.otherTreatment,
    },
    vascularAccess: {
      access: initialData?.vascularAccess.access ?? 'AV Fistula',
      dateOfCreation: initialData?.vascularAccess.dateOfCreation,
      createdBy: initialData?.vascularAccess.createdBy,
      complications: initialData?.vascularAccess.complications,
    },
    session: {
      date: initialData?.session.date ?? new Date().toISOString().split('T')[0],
      durationMinutes: initialData?.session.durationMinutes ?? 240,
      preDialysisWeightKg: initialData?.session.preDialysisWeightKg ?? 71,
      postDialysisWeightKg: initialData?.session.postDialysisWeightKg ?? 70,
      bloodPressure: {
        systolic: initialData?.session.bloodPressure.systolic ?? 120,
        diastolic: initialData?.session.bloodPressure.diastolic ?? 80,
      },
      bloodFlowRate: initialData?.session.bloodFlowRate ?? 350,
      pulseRate: initialData?.session.pulseRate,
      oxygenSaturationPercent: initialData?.session.oxygenSaturationPercent,
      arterialPressure: initialData?.session.arterialPressure,
      venousPressure: initialData?.session.venousPressure,
      transmembranePressure: initialData?.session.transmembranePressure,
      ultrafiltrationVolume: initialData?.session.ultrafiltrationVolume,
      interDialyticWeightGainKg: initialData?.session.interDialyticWeightGainKg,
    },
    otherNotes: initialData?.otherNotes,
  }));

  // Compute inter-dialytic weight gain
  useEffect(() => {
    if (!formData.session.interDialyticWeightGainKg) {
      const computed =
        formData.session.preDialysisWeightKg - formData.prescription.dryWeightKg;
      setFormData((prev) => ({
        ...prev,
        session: {
          ...prev.session,
          interDialyticWeightGainKg: parseFloat(computed.toFixed(2)),
        },
      }));
    }
  }, [
    formData.session.preDialysisWeightKg,
    formData.prescription.dryWeightKg,
    formData.session.interDialyticWeightGainKg,
  ]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Prescription validation
    if (!formData.prescription.access) {
      newErrors['prescription.access'] = 'Access type is required';
    }
    if (!formData.prescription.durationMinutes || formData.prescription.durationMinutes <= 0) {
      newErrors['prescription.durationMinutes'] = 'Duration must be greater than 0';
    }
    if (formData.prescription.durationMinutes < 15 || formData.prescription.durationMinutes > 720) {
      newErrors['prescription.durationMinutes'] = 'Duration must be between 15 and 720 minutes';
    }
    if (!formData.prescription.bloodFlowRate || formData.prescription.bloodFlowRate <= 0) {
      newErrors['prescription.bloodFlowRate'] = 'Blood flow rate is required';
    }
    if (formData.prescription.bloodFlowRate < 50 || formData.prescription.bloodFlowRate > 600) {
      newErrors['prescription.bloodFlowRate'] = 'Blood flow rate must be between 50 and 600 mL/min';
    }
    if (!formData.prescription.dryWeightKg || formData.prescription.dryWeightKg <= 0) {
      newErrors['prescription.dryWeightKg'] = 'Dry weight is required';
    }
    if (formData.prescription.temperature && (formData.prescription.temperature < 34 || formData.prescription.temperature > 40)) {
      newErrors['prescription.temperature'] = 'Temperature must be between 34 and 40°C';
    }

    // Vascular access validation
    if (!formData.vascularAccess.access) {
      newErrors['vascularAccess.access'] = 'Access type is required';
    }

    // Session validation
    if (!formData.session.date) {
      newErrors['session.date'] = 'Session date is required';
    }
    if (!formData.session.durationMinutes || formData.session.durationMinutes <= 0) {
      newErrors['session.durationMinutes'] = 'Duration must be greater than 0';
    }
    if (formData.session.durationMinutes < 15 || formData.session.durationMinutes > 720) {
      newErrors['session.durationMinutes'] = 'Duration must be between 15 and 720 minutes';
    }
    if (!formData.session.preDialysisWeightKg || formData.session.preDialysisWeightKg <= 0) {
      newErrors['session.preDialysisWeightKg'] = 'Pre-dialysis weight is required';
    }
    if (!formData.session.postDialysisWeightKg || formData.session.postDialysisWeightKg <= 0) {
      newErrors['session.postDialysisWeightKg'] = 'Post-dialysis weight is required';
    }
    if (!formData.session.bloodPressure.systolic || formData.session.bloodPressure.systolic <= 0) {
      newErrors['session.bloodPressure.systolic'] = 'Systolic BP is required';
    }
    if (!formData.session.bloodPressure.diastolic || formData.session.bloodPressure.diastolic <= 0) {
      newErrors['session.bloodPressure.diastolic'] = 'Diastolic BP is required';
    }
    if (!formData.session.bloodFlowRate || formData.session.bloodFlowRate <= 0) {
      newErrors['session.bloodFlowRate'] = 'Blood flow rate is required';
    }
    if (formData.session.bloodFlowRate < 50 || formData.session.bloodFlowRate > 600) {
      newErrors['session.bloodFlowRate'] = 'Blood flow rate must be between 50 and 600 mL/min';
    }
    if (formData.session.oxygenSaturationPercent && (formData.session.oxygenSaturationPercent < 0 || formData.session.oxygenSaturationPercent > 100)) {
      newErrors['session.oxygenSaturationPercent'] = 'Oxygen saturation must be between 0 and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    const keys = field.split('.');
    setFormData((prev) => {
      const updated = { ...prev };
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    validateForm();
  };

  const handleSubmit = async () => {
    // Check if patient is selected
    if (!patientId) {
      toast({
        title: 'Patient Not Selected',
        description: 'Please search for a patient by PHN first before saving hemodialysis record.',
        variant: 'destructive',
      });
      return;
    }

    if (!filledBy.trim()) {
      setTouched(prev => new Set(prev).add('filledBy'));
      setErrors(prev => ({ ...prev, filledBy: 'Please enter who filled out this form' }));
      toast({
        title: 'Missing Information',
        description: 'Please confirm who filled out this form',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Prepare data for API - convert to the format expected by backend
      const recordToSave = {
        sessionDate: formData.session.date,
        prescription: formData.prescription,
        vascularAccess: formData.vascularAccess,
        session: formData.session,
        otherNotes: formData.otherNotes,
        filledBy: filledBy,
      };

      // Save to backend
      const savedRecord = await createHemodialysisRecord(patientId, recordToSave);
      
      // Also call the optional onSave callback if provided
      onSave?.(formData);
      
      setHasUnsavedChanges(false);
      toast({
        title: 'Success',
        description: 'Hemodialysis record saved successfully',
      });
      setCurrentStep(0);
      setFilledBy('');
    } catch (error: any) {
      console.error('Error saving hemodialysis record:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save hemodialysis record',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    onCancel?.();
  };

  // Autosave
  useEffect(() => {
    if (!enableAutosave || !hasUnsavedChanges) return;
    const timer = setTimeout(() => {
      if (validateForm()) {
        onSave?.(formData);
        setHasUnsavedChanges(false);
        toast({
          title: 'Autosaved',
          description: 'Your changes have been saved',
        });
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, [formData, hasUnsavedChanges, enableAutosave]);

  const getError = (field: string) => touched.has(field) ? errors[field] : undefined;

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
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hemodialysis Management</h1>
              {patientId ? (
                <div className="flex items-center gap-2 mt-1">
                  <div className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <span>Patient: {patientName} (PHN: {patientId})</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <div className="inline-flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    <span>⚠️ Please search for a patient by PHN to begin</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {activeTab !== 'dashboard' && (
                <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
                  Dashboard
                </Button>
              )}
              {activeTab === 'form' && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          <TabsContent value="dashboard" className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground dark:text-slate-200">Hemodialysis Management</h1>
              {patientId ? (
                <div className="inline-flex items-center justify-center gap-2 text-lg text-green-600 bg-green-50 px-4 py-2 rounded-full">
                  <span>Patient: {patientName} (PHN: {patientId})</span>
                </div>
              ) : (
                <div className="inline-flex items-center justify-center gap-2 text-lg text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
                  <span>⚠️ Please search for a patient by PHN to begin</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Session Form Card */}
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-slate-900 dark:border-slate-800" 
                onClick={() => setActiveTab('form')}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Session Form</CardTitle>
                  <CardDescription>Record hemodialysis session data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">Open Form</Button>
                </CardContent>
              </Card>

              {/* Schedule Appointment Card */}
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-slate-900 dark:border-slate-800" 
                onClick={() => setActiveTab('schedule')}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Schedule Appointment</CardTitle>
                  <CardDescription>Book dialysis appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">Schedule</Button>
                </CardContent>
              </Card>

              {/* View Calendar Card */}
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-slate-900 dark:border-slate-800" 
                onClick={() => setActiveTab('calendar')}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>View Calendar</CardTitle>
                  <CardDescription>View dialysis schedule calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500" variant="outline">View Calendar</Button>
                </CardContent>
              </Card>

              {/* Patient Summary Card */}
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-slate-900 dark:border-slate-800" 
                onClick={() => setActiveTab('patient-summary')}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Patient Summary</CardTitle>
                  <CardDescription>View patient dialysis history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-blue-500" 
                    variant="outline"
                    disabled={!patientId}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (patientId) {
                        setActiveTab('patient-summary');
                      }
                    }}
                  >
                    {patientId ? 'View Summary' : 'Search Patient First'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="form" className="space-y-6">
            {!patientId && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Patient Required:</strong> Please search for a patient by PHN number using the global search bar before entering hemodialysis data.
                </p>
              </div>
            )}

            {/* Progress Indicator */}
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

            {/* Step Content */}
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

            {/* Navigation Buttons */}
            <div className="flex justify-between bg-background rounded-lg p-4 shadow-sm sticky bottom-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
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
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleAppointment />
          </TabsContent>

          <TabsContent value="calendar">
            <DialysisCalendar />
          </TabsContent>

          <TabsContent value="patient-summary">
            <PatientSummary />
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Timetable Button (opens a floating modal timetable for all patients) */}
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
