import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CalendarDays, ClipboardList, Save } from 'lucide-react';
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [filledBy, setFilledBy] = useState('');
  const [activeTab, setActiveTab] = useState('form');
  const [showFloatingTimetable, setShowFloatingTimetable] = useState(false);

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
      newErrors['prescription.temperature'] = 'Temperature must be between 34 and 40Â°C';
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

  const handleSubmit = () => {
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

    if (validateForm()) {
      onSave?.(formData);
      setHasUnsavedChanges(false);
      toast({
        title: 'Success',
        description: 'Hemodialysis record submitted successfully',
      });
      setCurrentStep(0);
      setFilledBy('');
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive',
      });
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
              <p className="text-sm text-muted-foreground mt-1">
                Patient: John Doe â€¢ MRN: 123456 â€¢ Last Session: {formatDateDisplay('2025-09-28')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="form">
              <ClipboardList className="w-4 h-4 mr-2" />
              Session Form
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <CalendarDays className="w-4 h-4 mr-2" />
              Schedule Appointment
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarDays className="w-4 h-4 mr-2" />
              View Calendar
            </TabsTrigger>
            <TabsTrigger value="patient-summary">
              <ClipboardList className="w-4 h-4 mr-2" />
              Patient Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
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
                  disabled={!filledBy.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit Record
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

