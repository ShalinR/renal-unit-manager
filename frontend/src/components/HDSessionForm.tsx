import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TimePicker from '@/components/ui/TimePicker';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  User,
  Pill,
  Activity,
  ClipboardList,
  FileText,
  AlertCircle,
  CheckCircle,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateToDDMMYYYY, isoStringToDate, toLocalISO } from '@/lib/dateUtils';
import { usePatientContext } from '@/context/PatientContext';
import { createHemodialysisRecord, getHemodialysisRecordsByPatientId, deleteHemodialysisRecord, getHemodialysisRecordById } from '@/services/hemodialysisApi';
import { useToast } from '@/hooks/use-toast';

export interface PersonalInfo {
  name: string;
  phn: string;
  age?: string;
  gender?: string;
}

export interface HDPrescription {
  access: string;
  durationMinutes?: number;
  dialysisProfile?: string;
  sodium?: number;
  bicarbonate?: number;
  bloodFlowRate?: number;
  dialysateFlowRate?: number;
  temperature?: number;
  dryWeightKg?: number;
  ultrafiltrationVolume?: number;
  anticoagulation?: string;
  erythropoetinDose?: string;
  otherTreatment?: string;
}

export interface VascularAccess {
  access: string;
  dateOfCreation?: string;
  createdBy?: string;
  complications?: string;
}

export interface DialysisSession {
  date: string;
  durationMinutes?: number;
  preDialysisWeightKg?: number;
  postDialysisWeightKg?: number;
  interDialyticWeightGainKg?: number;
  bloodPressure?: { systolic?: number; diastolic?: number };
  pulseRate?: number;
  oxygenSaturationPercent?: number;
  bloodFlowRate?: number;
  arterialPressure?: number;
  venousPressure?: number;
  transmembranePressure?: number;
  ultrafiltrationVolume?: number;
  hourlyRecords?: HourlyRecord[];
}

export interface HourlyRecord {
  hourNumber: number; // 1..4
  time?: string; // e.g. ISO time or HH:MM
  durationMinutes?: number;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  oxygenSaturationPercent?: number;
  bloodFlowRate?: number;
  bloodFlowRateMlPerMin?: number;
  arterialPressure?: number;
  arterialPressureMmHg?: number;
  venousPressure?: number;
  venousPressureMmHg?: number;
  transmembranePressure?: number;
  transmembranePressureMmHg?: number;
  ultrafiltrationVolume?: number;
  ultrafiltrationVolumeMl?: number;
  preDialysisWeightKg?: number;
  postDialysisWeightKg?: number;
  interDialyticWeightGainKg?: number;
  notes?: string;
  completed?: boolean;
}

export interface HemodialysisForm {
  personal: PersonalInfo;
  prescription: HDPrescription;
  vascular: VascularAccess;
  session: DialysisSession;
  otherNotes?: string;
  completedBy?: {
    staffName?: string;
    staffRole?: string;
    completionDate?: string;
  };
}

const FORM_STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'HD Prescription', icon: Pill },
  { label: 'Vascular Access', icon: Activity },
  { label: 'Dialysis Session', icon: ClipboardList },
  { label: 'Other Notes', icon: FileText },
  { label: 'Confirmation', icon: CheckCircle },
];

interface HDSessionFormProps {
  form: HemodialysisForm;
  setForm: React.Dispatch<React.SetStateAction<HemodialysisForm>>;
  onBack: () => void;
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
    <AlertCircle className="w-4 h-4" />
    <span>{message}</span>
  </div>
);

const HDSessionForm: React.FC<HDSessionFormProps> = ({ form, setForm, onBack }) => {
  const [step, setStep] = useState(0);
  const [hourIndex, setHourIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [consentProcessing, setConsentProcessing] = useState(false);
  const [showSavedSessions, setShowSavedSessions] = useState(false);
  const [savedSessions, setSavedSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const { patient, globalPatient } = usePatientContext();
  const { toast } = useToast();
  const currentPhn = (patient || globalPatient)?.phn;
  const STORAGE_KEY = currentPhn ? `hemodialysis-draft-${currentPhn}` : 'hemodialysis-draft';
  const totalSteps = FORM_STEPS.length;

  const currentPatient = patient || globalPatient;

  // Auto-populate personal info when a patient is selected
  useEffect(() => {
    const p = patient || globalPatient;
    if (p) {
      setForm((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          name: p.name || '',
          phn: p.phn || '',
          age: p.age ? String(p.age) : prev.personal.age,
          gender: p.gender || prev.personal.gender,
        },
      }));
    }
  }, [patient, globalPatient, setForm]);

  // Load saved sessions when component mounts or patient changes
  useEffect(() => {
    if (currentPatient?.phn && showSavedSessions) {
      const loadSessions = async () => {
        setLoadingSessions(true);
        try {
          const records = await getHemodialysisRecordsByPatientId(currentPatient.phn);
          setSavedSessions(records || []);
        } catch (error) {
          console.error('Failed to load sessions:', error);
          toast({
            title: 'Error',
            description: 'Failed to load saved sessions.',
            variant: 'destructive',
          });
        } finally {
          setLoadingSessions(false);
        }
      };
      loadSessions();
    }
  }, [currentPatient?.phn, showSavedSessions, toast]);

  // Load local draft for this patient (if available)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // parsed may be a payload shape from previous save; attempt to map to form shape
        const loadedForm: HemodialysisForm = {
          personal: parsed.personal || form.personal,
          prescription: parsed.prescription || parsed.prescription || form.prescription,
          vascular: parsed.vascular || parsed.vascular || form.vascular,
          session: parsed.session || parsed.session || form.session,
          otherNotes: parsed.otherNotes || form.otherNotes,
          completedBy: parsed.completedBy || form.completedBy,
        } as HemodialysisForm;
        // Only apply draft if it contains some data (avoid overwriting a loaded backend session)
        const hasData = Object.keys(parsed || {}).length > 0;
        if (hasData) setForm(loadedForm);
      }
    } catch (e) {
      console.error('Failed to load hemodialysis draft', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY]);

  // Auto-save draft to localStorage whenever form changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch (e) {
      console.error('Failed to save hemodialysis draft', e);
    }
  }, [form, STORAGE_KEY]);

  // Auto-compute inter-dialytic weight gain at session level
  useEffect(() => {
    const dry = form.prescription.dryWeightKg ?? 0;
    const pre = form.session.preDialysisWeightKg ?? 0;
    if (pre && dry) {
      const gain = parseFloat((pre - dry).toFixed(2));
      setForm((prev) => ({
        ...prev,
        session: { ...prev.session, interDialyticWeightGainKg: gain },
      }));
    }
  }, [form.prescription.dryWeightKg, form.session.preDialysisWeightKg, setForm]);

  // Auto-compute inter-dialytic weight gain for hourly records
  useEffect(() => {
    const hourlyRecords = form.session?.hourlyRecords || [];
    let updated = false;
    const newRecords = hourlyRecords.map((record) => {
      const pre = record.preDialysisWeightKg ?? 0;
      const post = record.postDialysisWeightKg ?? 0;
      
      if (pre && post) {
        const calculatedGain = parseFloat((pre - post).toFixed(2));
        if (calculatedGain !== record.interDialyticWeightGainKg) {
          updated = true;
          return { ...record, interDialyticWeightGainKg: calculatedGain };
        }
      }
      return record;
    });

    if (updated) {
      setForm((prev) => ({
        ...prev,
        session: { ...prev.session, hourlyRecords: newRecords },
      }));
    }
  }, [form.session?.hourlyRecords?.map((r) => `${r.preDialysisWeightKg}-${r.postDialysisWeightKg}`).join('|'), setForm]);

  // Ensure hourlyRecords array exists when entering Dialysis Session step
  useEffect(() => {
    if (step === 3) {
      const existing = form.session.hourlyRecords;
      if (!existing || existing.length !== 4) {
        const hours: HourlyRecord[] = [1, 2, 3, 4].map((n) => ({
          hourNumber: n,
          time: '',
          durationMinutes: undefined,
          systolic: undefined,
          diastolic: undefined,
          pulse: undefined,
          oxygenSaturationPercent: undefined,
          bloodFlowRate: undefined,
          bloodFlowRateMlPerMin: undefined,
          arterialPressure: undefined,
          arterialPressureMmHg: undefined,
          venousPressure: undefined,
          venousPressureMmHg: undefined,
          transmembranePressure: undefined,
          transmembranePressureMmHg: undefined,
          ultrafiltrationVolume: undefined,
          ultrafiltrationVolumeMl: undefined,
          preDialysisWeightKg: undefined,
          postDialysisWeightKg: undefined,
          interDialyticWeightGainKg: undefined,
          notes: '',
          completed: false,
        }));
        setForm((prev) => ({ ...prev, session: { ...prev.session, hourlyRecords: hours } }));
        setHourIndex(0);
      }
    }
  }, [step, form.session.hourlyRecords, setForm]);

  const progress = useMemo(
    () => Math.round(((step + 1) / totalSteps) * 100),
    [step, totalSteps]
  );

  const handleChange = useCallback((path: string, value: any) => {
    setForm((prev) => {
      const clone: any = { ...prev };
      const parts = path.split('.');
      let cur = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = cur[parts[i]] ?? {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return clone as HemodialysisForm;
    });
  }, [setForm]);

  const validateStep = (s: number): string[] => {
    // Validation relaxed for early development stage: allow progressing without required fields.
    return [];
  };

  const next = () => {
    // Proceed without blocking validation (early development)
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  /**
   * Validate that hourly session times are in chronological order (24-hour format)
   */
  const validateHourlySessionTimes = (): { isValid: boolean; error?: string } => {
    const hourlyRecords = form.session?.hourlyRecords || [];
    
    // Check if all hourly records have times set
    const allTimesSet = hourlyRecords.every(record => record.time);
    if (hourlyRecords.length > 0 && !allTimesSet) {
      return { isValid: false, error: 'All hourly session times must be set' };
    }

    // Validate chronological order
    for (let i = 0; i < hourlyRecords.length - 1; i++) {
      const currentTime = hourlyRecords[i].time;
      const nextTime = hourlyRecords[i + 1].time;

      if (!currentTime || !nextTime) continue;

      // Convert time strings (HH:MM) to comparable format
      const currentMinutes = parseInt(currentTime.replace(':', ''));
      const nextMinutes = parseInt(nextTime.replace(':', ''));

      if (currentMinutes >= nextMinutes) {
        return {
          isValid: false,
          error: `Hour ${i + 1} time (${currentTime}) must be before Hour ${i + 2} time (${nextTime}). Times must be in chronological order.`
        };
      }
    }

    return { isValid: true };
  };

  // prev already declared above; avoid redeclaration here
  // const prev = () => setStep((s) => Math.max(s - 1, 0));

  const loadSession = async (sessionId: number) => {
    try {
      const record = await getHemodialysisRecordById(sessionId);
      console.log('Fetched record:', record); // DEBUG
      if (!record) {
        toast({ title: 'Error', description: 'Session not found.', variant: 'destructive' });
        return;
      }

      console.log('Vascular Access from API:', record.vascularAccess); // DEBUG

      // Parse saved data back into form shape
      const loadedForm: HemodialysisForm = {
        personal: form.personal, // Keep current patient info
        prescription: record.prescription || {},
        vascular: record.vascularAccess || {},
        session: {
          date: record.hemoDialysisSessionDate || '',
          hourlyRecords: record.session?.hourlyRecords || [],
        },
        otherNotes: record.otherNotes || '',
        completedBy: {
          staffName: record.filledBy || '',
          staffRole: record.completedBy?.staffRole || '',
          completionDate: record.completedBy?.completionDate || '',
        },
      };

      console.log('Loaded form:', loadedForm); // DEBUG
      setForm(loadedForm);
      setShowSavedSessions(false);
      setStep(0);
      toast({ title: 'Loaded', description: 'Session data loaded successfully.', variant: 'default' });
    } catch (error) {
      console.error('Failed to load session:', error);
      toast({ title: 'Error', description: 'Failed to load session.', variant: 'destructive' });
    }
  };

  const deleteSession = async (sessionId: number) => {
    if (!confirm('Delete this session? This action cannot be undone.')) return;

    try {
      await deleteHemodialysisRecord(sessionId);
      setSavedSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast({ title: 'Deleted', description: 'Session deleted successfully.', variant: 'default' });
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast({ title: 'Error', description: 'Failed to delete session.', variant: 'destructive' });
    }
  };

  const submit = async () => {
    // Validate hourly session times before submission
    const timeValidation = validateHourlySessionTimes();
    if (!timeValidation.isValid) {
      toast({
        title: 'Invalid Time Order',
        description: timeValidation.error || 'Please check your hourly session times',
        variant: 'destructive'
      });
      setStep(2); // Navigate to Dialysis Session step
      return;
    }

    // Submission no longer blocked by form validation or staff sign-off (early development)

    setIsSubmitting(true);
    try {
      // Prepare payload - map form fields to backend DTO field names
      // Derive blood pressure string from first hourly record if available (systolic/diastolic)
      const hourly = form.session?.hourlyRecords || [];
      const firstWithBP = hourly.find(r => r.systolic && r.diastolic);
      const bloodPressure = firstWithBP ? `${firstWithBP.systolic}/${firstWithBP.diastolic}` : undefined;

      const payload = {
        patientId: form.personal.phn,
        hemoDialysisSessionDate: form.session?.date,
        prescription: form.prescription,
        vascularAccess: form.vascular,
        bloodPressure, // root-level string expected by summary analytics
        session: hourly.length ? { hourlyRecords: hourly } : undefined,
        otherNotes: form.otherNotes,
        filledBy: form.completedBy?.staffName,
        completedBy: {
          staffName: form.completedBy?.staffName,
          staffRole: form.completedBy?.staffRole,
          completionDate: form.completedBy?.completionDate || new Date().toISOString().split('T')[0],
        },
      };

      // Try saving to backend API (fallback to localStorage if unavailable)
      let saved = null;
      try {
        const patientId = form.personal.phn || form.personal.phn === '' ? form.personal.phn : undefined;
        if (!patientId) throw new Error('Patient PHN is missing');
        saved = await createHemodialysisRecord(patientId!, payload);
        toast({ title: 'Saved', description: 'Hemodialysis record submitted successfully', variant: 'default' });
        // Clear draft if present
        localStorage.removeItem(STORAGE_KEY);
        // Dispatch custom event so analytics (HDSummary) can refresh
        window.dispatchEvent(new CustomEvent('hd-record-added'));
        onBack();
      } catch (e) {
        // backend not available or error — save draft locally
        console.warn('Backend save failed, saving draft locally', e);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        toast({ title: 'Saved locally', description: 'No backend available — draft saved locally', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({ title: 'Submission failed', description: 'Failed to submit form. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Saved Sessions Section */}
      <Card className="shadow-sm border border-green-50 bg-green-50/30">
        <div
          className="cursor-pointer p-4"
          onClick={() => setShowSavedSessions(!showSavedSessions)}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showSavedSessions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              <h3 className="font-semibold text-green-900">Session History</h3>
            </div>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
              {savedSessions.length} sessions
            </span>
          </div>
        </div>

        {showSavedSessions && (
          <CardContent className="pt-0 pb-4 border-t border-green-200">
            {loadingSessions ? (
              <p className="text-center text-sm text-gray-600 py-4">Loading sessions...</p>
            ) : savedSessions.length === 0 ? (
              <p className="text-center text-sm text-gray-600 py-4">No saved sessions yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedSessions.map((session) => (
                  <div key={session.id} className="p-3 bg-white rounded-lg border border-green-100 hover:border-green-300">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-green-900">
                          {session.hemoDialysisSessionDate || 'No date'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {session.filledBy ? `Staff: ${session.filledBy}` : 'No staff info'}
                        </p>
                        {session.session?.hourlyRecords && (
                          <p className="text-xs text-green-700 mt-1">
                            {session.session.hourlyRecords.length} hourly records
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => loadSession(session.id)}
                          title="Load this session"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteSession(session.id)}
                          title="Delete this session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
      <div className="bg-white rounded-xl shadow-sm border border-blue-50 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-blue-900">
            Assessment Progress
          </h2>
          <span className="text-sm text-blue-600">
            Step {step + 1} of {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-4">
          {FORM_STEPS.map((formStep, idx) => {
            const Icon = formStep.icon;
            const isActive = step === idx;
            const isCompleted = step > idx;

            return (
              <div key={formStep.label} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted || isActive) setStep(idx);
                  }}
                  className="flex flex-col items-center w-full"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full z-10 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`mt-2 text-xs ${
                      isActive
                        ? 'text-blue-700'
                        : isCompleted
                          ? 'text-blue-600'
                          : 'text-gray-400'
                    }`}
                  >
                    {formStep.label}
                  </span>
                </button>

                {idx < FORM_STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 ml-3 mr-3 ${
                      step > idx ? 'bg-blue-500' : 'bg-gray-200'
                    } rounded`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form steps */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-lg">
            {FORM_STEPS[step]?.icon &&
              React.createElement(FORM_STEPS[step].icon as any, {
                className: 'w-6 h-6',
              })}
            {FORM_STEPS[step]?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Use Global Search above to select a patient. Details will auto-populate.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.personal.name}
                    onChange={(e) =>
                      handleChange('personal.name', e.target.value)
                    }
                    placeholder="Enter full name"
                    className={`h-10 w-full border-2 ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md w-full`}
                  />
                  {errors.name && <ErrorMessage message={errors.name} />}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phn"
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    Personal Health Number (PHN){' '}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="phn"
                    value={form.personal.phn}
                    onChange={(e) =>
                      handleChange('personal.phn', e.target.value)
                    }
                    placeholder="Enter PHN number"
                    className={`h-10 w-full border-2 ${
                      errors.phn ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md w-full`}
                  />
                  {errors.phn && <ErrorMessage message={errors.phn} />}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="age"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Age
                  </Label>
                  <Input
                    id="age"
                    value={form.personal.age || ''}
                    onChange={(e) =>
                      handleChange('personal.age', e.target.value)
                    }
                    placeholder="Age"
                    className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Gender
                  </Label>
                  <Input
                    id="gender"
                    value={form.personal.gender || ''}
                    onChange={(e) =>
                      handleChange('personal.gender', e.target.value)
                    }
                    placeholder="Gender"
                    className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Access <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    value={form.prescription.access}
                    onChange={(e) =>
                      handleChange('prescription.access', e.target.value)
                    }
                    placeholder="e.g., Fistula, Graft, Catheter"
                    className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Duration (min) <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={form.prescription.durationMinutes ?? ''}
                    onChange={(e) =>
                      handleChange(
                        'prescription.durationMinutes',
                        Number(e.target.value)
                      )
                    }
                    className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Dialysis Profile
                  </Label>
                  <Input
                    value={form.prescription.dialysisProfile || ''}
                    onChange={(e) =>
                      handleChange('prescription.dialysisProfile', e.target.value)
                    }
                    placeholder="e.g., Standard, Low-flux, High-flux"
                    className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Sodium
                  </Label>
                  <Input
                    type="number"
                    value={form.prescription.sodium ?? ''}
                    onChange={(e) =>
                      handleChange('prescription.sodium', Number(e.target.value))
                    }
                    className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Bicarbonate
                  </Label>
                  <Input
                    type="number"
                    value={form.prescription.bicarbonate ?? ''}
                    onChange={(e) =>
                      handleChange(
                        'prescription.bicarbonate',
                        Number(e.target.value)
                      )
                    }
                    className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Blood Flow Rate (mL/min){' '}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={form.prescription.bloodFlowRate ?? ''}
                    onChange={(e) =>
                      handleChange(
                        'prescription.bloodFlowRate',
                        Number(e.target.value)
                      )
                    }
                    className="h-10 w-28 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Dialysate Flow Rate
                  </Label>
                  <Input
                    type="number"
                    value={form.prescription.dialysateFlowRate ?? ''}
                    onChange={(e) =>
                      handleChange(
                        'prescription.dialysateFlowRate',
                        Number(e.target.value)
                      )
                    }
                    className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Temperature (°C)
                  </Label>
                  <Input
                    type="number"
                    value={form.prescription.temperature ?? ''}
                    onChange={(e) =>
                      handleChange('prescription.temperature', Number(e.target.value))
                    }
                    className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Dry Weight (kg){' '}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={form.prescription.dryWeightKg ?? ''}
                    onChange={(e) =>
                      handleChange(
                        'prescription.dryWeightKg',
                        Number(e.target.value)
                      )
                    }
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Ultrafiltration Volume (mL)
                  </Label>
                  <Input
                    type="number"
                    value={form.prescription.ultrafiltrationVolume ?? ''}
                    onChange={(e) =>
                      handleChange(
                        'prescription.ultrafiltrationVolume',
                        Number(e.target.value)
                      )
                    }
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Anticoagulation
                  </Label>
                  <Input
                    value={form.prescription.anticoagulation || ''}
                    onChange={(e) =>
                      handleChange('prescription.anticoagulation', e.target.value)
                    }
                    placeholder="e.g., Heparin, Warfarin, None"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Erythropoietin Dose
                  </Label>
                  <Input
                    value={form.prescription.erythropoetinDose || ''}
                    onChange={(e) =>
                      handleChange('prescription.erythropoetinDose', e.target.value)
                    }
                    placeholder="e.g., 40 units/kg"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Other Treatment
                </Label>
                <Textarea
                  value={form.prescription.otherTreatment || ''}
                  onChange={(e) =>
                    handleChange('prescription.otherTreatment', e.target.value)
                  }
                  placeholder="Any other treatments or notes"
                  rows={4}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-lg resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Access <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    value={form.vascular.access}
                    onChange={(e) =>
                      handleChange('vascular.access', e.target.value)
                    }
                    placeholder="e.g., AVF, AVG, Temporary Catheter"
                    className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Date of Creation
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-10 justify-start text-left font-normal border-2 border-gray-200"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.vascular.dateOfCreation ? formatDateToDDMMYYYY(form.vascular.dateOfCreation) : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={isoStringToDate(form.vascular.dateOfCreation)}
                        onSelect={(date) => {
                          if (date) {
                            handleChange('vascular.dateOfCreation', toLocalISO(date));
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Created By
                  </Label>
                  <Input
                    value={form.vascular.createdBy || ''}
                    onChange={(e) =>
                      handleChange('vascular.createdBy', e.target.value)
                    }
                    placeholder="Name of surgeon/clinician"
                    className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Complications
                  </Label>
                  <Input
                    value={form.vascular.complications || ''}
                    onChange={(e) =>
                      handleChange('vascular.complications', e.target.value)
                    }
                    placeholder="e.g., Infection, Thrombosis, Steal syndrome"
                    className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Date <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-10 justify-start text-left font-normal border-2 border-gray-200"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.session.date ? formatDateToDDMMYYYY(form.session.date) : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={isoStringToDate(form.session.date)}
                        onSelect={(date) => {
                          if (date) {
                            handleChange('session.date', toLocalISO(date));
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

              </div>
              {/* Hourly records section */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Hourly Records (4 × 1-hour observations)</h4>
                <div className="flex gap-2 mb-3">
                  {(form.session.hourlyRecords || []).map((hr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setHourIndex(idx)}
                      className={`px-3 py-1 rounded ${hourIndex === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Hour {hr.hourNumber}
                    </button>
                  ))}
                </div>

                  {(form.session.hourlyRecords || [])[hourIndex] && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Time (24-hour format) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <TimePicker
                          value={form.session.hourlyRecords?.[hourIndex]?.time || ''}
                          onChange={(newTime) => {
                            const hours = form.session.hourlyRecords || [];

                            // Validate chronological order with new time
                            if (hourIndex > 0 && newTime) {
                              const prevTime = hours[hourIndex - 1]?.time;
                              if (prevTime && newTime <= prevTime) {
                                toast({
                                  title: 'Invalid Time',
                                  description: `Hour ${hourIndex + 1} time must be after Hour ${hourIndex} time (${prevTime})`,
                                  variant: 'destructive'
                                });
                                return;
                              }
                            }

                            if (hourIndex < hours.length - 1 && newTime) {
                              const nextTime = hours[hourIndex + 1]?.time;
                              if (nextTime && newTime >= nextTime) {
                                toast({
                                  title: 'Invalid Time',
                                  description: `Hour ${hourIndex + 1} time must be before Hour ${hourIndex + 2} time (${nextTime})`,
                                  variant: 'destructive'
                                });
                                return;
                              }
                            }

                            handleChange(`session.hourlyRecords.${hourIndex}.time`, newTime);
                          }}
                          placeholder="Select time"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">
                          {hourIndex === 0 && 'First session start time'}
                          {hourIndex === 1 && `Must be after Hour 1: ${form.session.hourlyRecords?.[0]?.time || 'Not set'}`}
                          {hourIndex === 2 && `Must be after Hour 2: ${form.session.hourlyRecords?.[1]?.time || 'Not set'}`}
                          {hourIndex === 3 && `Must be after Hour 3: ${form.session.hourlyRecords?.[2]?.time || 'Not set'}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Duration (min)</Label>
                      <Input
                        type="number"
                        value={form.session.hourlyRecords?.[hourIndex]?.durationMinutes ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.durationMinutes`, Number(e.target.value))}
                        className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>
                     <div className="space-y-2">        </div>       
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Pre-Dialysis Weight (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={form.session.hourlyRecords?.[hourIndex]?.preDialysisWeightKg ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.preDialysisWeightKg`, Number(e.target.value))}
                        className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Post-Dialysis Weight (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={form.session.hourlyRecords?.[hourIndex]?.postDialysisWeightKg ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.postDialysisWeightKg`, Number(e.target.value))}
                        className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Inter-Dialytic Weight Gain (kg)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          value={form.session.hourlyRecords?.[hourIndex]?.interDialyticWeightGainKg ?? ''}
                          disabled
                          className="h-10 w-full border-2 border-gray-300 bg-gray-100 focus:border-gray-300 rounded-md text-gray-700"
                        />
                        
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Pulse Rate (bpm)</Label>
                      <Input
                        type="number"
                        value={form.session.hourlyRecords?.[hourIndex]?.pulse ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.pulse`, Number(e.target.value))}
                        className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">O₂ Saturation (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={form.session.hourlyRecords?.[hourIndex]?.oxygenSaturationPercent ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.oxygenSaturationPercent`, Number(e.target.value))}
                        className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Blood Flow Rate (mL/min)</Label>
                      <Input
                        type="number"
                        value={form.session.hourlyRecords?.[hourIndex]?.bloodFlowRateMlPerMin ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.bloodFlowRateMlPerMin`, Number(e.target.value))}
                        className="h-10 w-full border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Arterial Pressure (mmHg)</Label>
                      <Input
                        type="number"
                        value={form.session.hourlyRecords?.[hourIndex]?.arterialPressureMmHg ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.arterialPressureMmHg`, Number(e.target.value))}
                        className="h-10 w-20 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Venous Pressure (mmHg)</Label>
                      <Input
                        type="number"
                        value={form.session.hourlyRecords?.[hourIndex]?.venousPressureMmHg ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.venousPressureMmHg`, Number(e.target.value))}
                        className="h-10 w-20 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Transmembrane Pressure (mmHg)</Label>
                      <Input
                        type="number"
                        value={form.session.hourlyRecords?.[hourIndex]?.transmembranePressureMmHg ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.transmembranePressureMmHg`, Number(e.target.value))}
                        className="h-10 w-20 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Ultrafiltration Volume (mL)</Label>
                      <Input
                        type="number"
                        value={form.session.hourlyRecords?.[hourIndex]?.ultrafiltrationVolumeMl ?? ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.ultrafiltrationVolumeMl`, Number(e.target.value))}
                        className="h-10 w-28 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-3">
                      <Label className="text-sm font-semibold text-gray-700">Notes</Label>
                      <Textarea
                        value={form.session.hourlyRecords?.[hourIndex]?.notes || ''}
                        onChange={(e) => handleChange(`session.hourlyRecords.${hourIndex}.notes`, e.target.value)}
                        rows={2}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-md resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Additional Notes
                </Label>
                <Textarea
                  value={form.otherNotes || ''}
                  onChange={(e) =>
                    handleChange('otherNotes', e.target.value)
                  }
                  placeholder="Enter any additional notes or observations"
                  rows={6}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-md resize-none"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                Please review the information below before submitting.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
                <h3 className="font-semibold text-blue-900">
                  Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Patient</p>
                    <p className="font-semibold text-gray-900">
                      {form.personal.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">PHN</p>
                    <p className="font-semibold text-gray-900">
                      {form.personal.phn}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Access</p>
                    <p className="font-semibold text-gray-900">
                      {form.prescription.access || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Session Date</p>
                    <p className="font-semibold text-gray-900">
                      {form.session.date || '-'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Confirmation / Staff sign-off */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-semibold text-gray-900">Confirmation</h3>
                <p className="text-sm text-gray-600">Enter staff details to complete and submit this record.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Completed By (Staff Name)</Label>
                    <Input
                      value={form.completedBy?.staffName || ''}
                      onChange={(e) => handleChange('completedBy.staffName', e.target.value)}
                      placeholder="Staff full name"
                      className={`h-12 border-2 ${errors.staffName ? 'border-red-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg`}
                    />
                    {errors.staffName && <ErrorMessage message={errors.staffName} />}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Staff Role</Label>
                    <Input
                      value={form.completedBy?.staffRole || ''}
                      onChange={(e) => handleChange('completedBy.staffRole', e.target.value)}
                      placeholder="e.g., Nurse, Nephrologist"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Consent checkboxes */}
                <div className="bg-white p-4 rounded-md mt-3">
                  <h4 className="font-semibold text-gray-800 mb-2">Consent and Confirmation</h4>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        id="hd-confirm-accurate"
                        checked={confirmAccurate}
                        onCheckedChange={(checked: boolean) => {
                          const v = !!checked;
                          setConfirmAccurate(v);
                          handleChange('completedBy.confirmAccurate', v);
                        }}
                        className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <span className="text-sm text-slate-700 leading-relaxed">
                        I confirm that all information provided is accurate to the best of my knowledge.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        id="hd-consent-processing"
                        checked={consentProcessing}
                        onCheckedChange={(checked: boolean) => {
                          const v = !!checked;
                          setConsentProcessing(v);
                          handleChange('completedBy.consentProcessing', v);
                        }}
                        className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <span className="text-sm text-slate-700 leading-relaxed">
                        I consent to the processing of this information for clinical care and quality improvement purposes.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between bg-white rounded-lg p-4 shadow-sm sticky bottom-4">
        <Button variant="outline" onClick={prev} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        {step < totalSteps - 1 ? (
          <Button onClick={next}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HDSessionForm;
