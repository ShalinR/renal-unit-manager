import React, { useEffect, useState } from "react";
import {
  FileText,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/**
 * TYPES – aligned with backend
 */

type Sex = "Male" | "Female" | "Other";
type Status = "Admitted" | "Discharged";
type AdmissionType =
  | "Direct"
  | "Transfer from Other Ward"
  | "Hospital"
  | "HD"
  | "Other";

// This matches PatientResponse from backend
type Patient = {
  id: number;
  phn: string;
  name: string;

  dob: string;
  sex: Sex | string;

  // Patient demographics
  address?: string;
  phone?: string;
  nic?: string;
  mohArea?: string;
  ethnicGroup?: string;
  religion?: string;
  occupation?: string;
  maritalStatus?: string;

  status: Status | string;

  // Admission fields
  bhtNumber?: string; // Add this field
  ward: string;
  wardNumber?: string;
  bedId?: string;
  admissionDate?: string;
  admissionTime?: string;
  consultantName?: string;
  referredBy?: string;
  primaryDiagnosis?: string;
  admissionType?: AdmissionType | string;
  admittingOfficer?: string;
  presentingComplaints?: string;

  // Examination fields from Admission
  examTempC?: number;
  examHeightCm?: number;
  examWeightKg?: number;
  examBMI?: number;
  examBloodPressure?: string;
  examHeartRate?: number;
};

// Shape coming from backend for Admission
type AdmissionApi = {
  id: number;
  bhtNumber: string;
  number: number;
  active: boolean;
  dischargeSummaryAvailable: boolean;
  admittedOn: string;
};

// UI shape for Admission (mapped)
type Admission = {
  id: number;
  bhtNumber: string;
  number: number;
  admittedOn: string;
  hasDischargeSummary: boolean;
  isActive: boolean;
};

type ProgressNote = {
  id: number;
  createdAt: string;
  tempC?: number;
  weightKg?: number;
  bpHigh?: number;
  bpLow?: number;
  heartRate?: number;
  inputMl?: number;
  urineOutputMl?: number;
  pdBalance?: number;
  totalBalance?: number;
};

type TabKey =
  | "patient-details"
  | "admitting-notes"
  | "progress-notes"
  | "medical-history"
  | "allergic-history"
  | "investigations"
  | "discharge-summary";

const TAB_LABELS: Record<TabKey, string> = {
  "patient-details": "Patient Details",
  "admitting-notes": "Admitting Notes",
  "progress-notes": "Progress Notes",
  "medical-history": "Medical History",
  "allergic-history": "Allergic History",
  investigations: "Investigations",
  "discharge-summary": "Discharge Summary",
};

const HeaderField = ({ label, value }: { label: string; value?: any }) => {
  const safeValue =
    value === null || value === undefined || value === "" ? "–" : String(value);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-900">
        {safeValue}
      </span>
    </div>
  );
};

const ADMISSION_TYPES: AdmissionType[] = [
  "Direct",
  "Transfer from Other Ward",
  "Hospital",
  "HD",
  "Other",
];

const ICD10_CODES = [
  "N18.0 – End-stage renal disease",
  "N18.4 – Chronic kidney disease stage 4",
  "N18.5 – Chronic kidney disease stage 5",
  "I12.0 – Hypertensive CKD with renal failure",
  "E11.9 – Type 2 diabetes mellitus, without complications",
];

/**
 * SMALL HELPERS
 */

function calcAge(dobISO: string | undefined): number | null {
  if (!dobISO) return null;
  const dob = new Date(dobISO);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

function formatAge(dobISO?: string): string {
  const age = calcAge(dobISO);
  return age === null ? "–" : `${age}`;
}

/**
 * API BASE URL AND CALLS
 */
const API = "http://localhost:8080";

// 🔍 Search Patient by PHN (GET /patients?phn=...)
async function apiGetPatient(phn: string): Promise<Patient | null> {
  console.log("🔍 [Frontend] Searching for patient with PHN:", phn);
  
  // Clean PHN for search
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  console.log("🔍 [Frontend] Cleaned PHN:", cleanPhn);
  
  const url = `${API}/patients?phn=${cleanPhn}`;
  console.log("🔍 [Frontend] Calling URL:", url);
  
  try {
    const res = await fetch(url);
    console.log("🔍 [Frontend] Response status:", res.status, res.statusText);
    
    // Handle different status codes
    if (res.status === 404) {
      console.log("🔍 [Frontend] Patient not found (404)");
      return null;
    }
    
    if (res.status === 400) {
      const errorText = await res.text();
      console.error("❌ [Frontend] Bad request:", errorText);
      throw new Error(`Invalid request: ${errorText}`);
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ [Frontend] API Error:", {
        status: res.status,
        statusText: res.statusText,
        responseText: errorText
      });
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }
    
    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error("❌ [Frontend] Response is not JSON:", text);
      throw new Error("Server returned non-JSON response");
    }
    
    const patientData = await res.json();
    console.log("✅ [Frontend] Patient data received:", patientData);
    return patientData;
    
  } catch (error) {
    console.error("❌ [Frontend] Fetch error:", error);
    // Re-throw with more context
    throw new Error(`Network error: ${error.message}`);
  }
}

// 📥 Load admissions (GET /patients/{phn}/admissions)
async function apiGetAdmissions(phn: string): Promise<Admission[]> {
  console.log("📥 [Frontend] Loading admissions for PHN:", phn);
  
  const cleanPhn = phn.replace(/[^0-9]/g, "");
  const url = `${API}/patients/${cleanPhn}/admissions`;
  console.log("📥 [Frontend] Calling URL:", url);
  
  try {
    const res = await fetch(url);
    console.log("📥 [Frontend] Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ [Frontend] Admissions API Error:", {
        status: res.status,
        statusText: res.statusText,
        responseText: errorText
      });
      
      // If no admissions found, return empty array instead of throwing
      if (res.status === 404) {
        console.log("📥 [Frontend] No admissions found, returning empty array");
        return [];
      }
      
      throw new Error(`Failed to load admissions: ${res.status}`);
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error("❌ [Frontend] Admissions response is not JSON:", text);
      return [];
    }
    
    const raw: any[] = await res.json();
    console.log("✅ [Frontend] Admissions data received:", raw);
    
    const admissions = raw.map((a) => ({
      id: a.id,
      bhtNumber: a.bhtNumber,
      number: a.number,
      admittedOn: a.admittedOn,
      hasDischargeSummary: a.dischargeSummaryAvailable,
      isActive: a.active,
    }));
    
    console.log("✅ [Frontend] Mapped admissions:", admissions);
    return admissions;
    
  } catch (error) {
    console.error("❌ [Frontend] Admissions fetch error:", error);
    // Return empty array instead of throwing to prevent breaking the app
    return [];
  }
}

// DTO matching backend PatientCreateRequest
type PatientCreatePayload = {
  phn: string;
  name: string;
  dob: string; // ISO date yyyy-mm-dd
  sex: Sex;

  address?: string;
  phone?: string;
  nic?: string;
  mohArea?: string;
  ethnicGroup?: string;
  religion?: string;
  occupation?: string;
  maritalStatus?: string;

  ward: string;
  wardNumber?: string;
  bedId?: string;
  admissionDate: string; // ISO date
  admissionTime?: string; // ISO datetime string
  admissionType: string;
  consultantName?: string;
  referredBy?: string;
  primaryDiagnosis?: string;
  admittingOfficer?: string;
  presentingComplaints: string;

  tempC?: number;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  bloodPressure?: string;
  heartRate?: number;

  medicalProblems?: string[];
  allergyProblems?: string[];
};

// ➕ Create patient + admission (POST /patients)
async function apiCreatePatient(payload: PatientCreatePayload): Promise<Patient> {
  // Clean the payload - remove any undefined values and format properly
  const cleanPayload = JSON.parse(JSON.stringify({
    ...payload,
    // Ensure PHN is clean numeric
    phn: payload.phn.replace(/[^0-9]/g, ""),
    // Handle optional fields
    address: payload.address || null,
    phone: payload.phone || null,
    nic: payload.nic || null,
    mohArea: payload.mohArea || null,
    ethnicGroup: payload.ethnicGroup || null,
    religion: payload.religion || null,
    occupation: payload.occupation || null,
    maritalStatus: payload.maritalStatus || null,
    wardNumber: payload.wardNumber || null,
    bedId: payload.bedId || null,
    consultantName: payload.consultantName || null,
    referredBy: payload.referredBy || null,
    primaryDiagnosis: payload.primaryDiagnosis || null,
    admittingOfficer: payload.admittingOfficer || null,
    tempC: payload.tempC || null,
    heightCm: payload.heightCm || null,
    weightKg: payload.weightKg || null,
    bmi: payload.bmi || null,
    bloodPressure: payload.bloodPressure || null,
    heartRate: payload.heartRate || null,
    medicalProblems: payload.medicalProblems || [],
    allergyProblems: payload.allergyProblems || []
  }));

  console.log("Sending payload:", cleanPayload);

  const res = await fetch(`${API}/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanPayload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Create patient failed:", text);
    throw new Error(`Failed to create patient. Status ${res.status}: ${text}`);
  }
  return res.json();
}

// ➕ Add progress note (POST /patients/{phn}/admissions/{admId}/progress-notes)
async function apiAddProgressNote(
  phn: string,
  admId: number,
  payload: any
): Promise<ProgressNote> {
  const res = await fetch(
    `${API}/patients/${phn}/admissions/${admId}/progress-notes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Add progress note failed body:", text);
    throw new Error(`Failed to add progress note. Status ${res.status}`);
  }
  return res.json();
}

// ➕ Create discharge summary (POST /patients/{phn}/admissions/{admId}/discharge-summary)
async function apiCreateDischargeSummary(
  phn: string,
  admId: number,
  payload: {
    dischargeDate: string | null;
    diagnosis: string;
    icd10: string;
    progressSummary: string;
    management: string;
    dischargePlan: string;
    drugsFreeHand: string;
  }
): Promise<any> {
  // Fix: Handle null dischargeDate properly
  const cleanPayload = {
    ...payload,
    dischargeDate: payload.dischargeDate || null
  };

  const res = await fetch(
    `${API}/patients/${phn}/admissions/${admId}/discharge-summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanPayload),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Create DS failed:", text);
    throw new Error(`Failed to create discharge summary. Status ${res.status}`);
  }
  return res.json();
}

/**
 * MAIN COMPONENT
 */

const WardManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // PHN comes from top bar (?phn=...)
  const phnQuery = searchParams.get("phn");

  const [loading, setLoading] = useState<boolean>(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [tab, setTab] = useState<TabKey>("patient-details");
  const [notFound, setNotFound] = useState<string | null>(null);

  // Problem lists (per admission) – used in DS builder only (Frontend-side)
  const [medicalProblems, setMedicalProblems] = useState<string[]>([""]);
  const [allergyProblems, setAllergyProblems] = useState<string[]>([""]);

  // Progress notes (only newly created notes for now)
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([]);

  // Discharge summary working state
  const [icd10, setIcd10] = useState<string>("");
  const [dsDiagnosis, setDsDiagnosis] = useState<string>("");
  const [dsProgress, setDsProgress] = useState<string>("");
  const [dsManagement, setDsManagement] = useState<string>("");
  const [dsDischargePlan, setDsDischargePlan] = useState<string>("");
  const [dsFreeDrugs, setDsFreeDrugs] = useState<string>("");
  const [dsDischargeDate, setDsDischargeDate] = useState<string>("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [creatingSummary, setCreatingSummary] = useState(false);

  /**
   * Load patient when PHN changes (real backend calls).
   */
  useEffect(() => {
    async function loadPatient() {
      if (!phnQuery) {
        setPatient(null);
        setAdmissions([]);
        setNotFound(null);
        return;
      }

      // Clean PHN so both "24712" and "PHN-24712" work
      const cleanPhn = phnQuery.replace(/[^0-9]/g, "");
      console.log("🔍 [Main] Searching for patient with PHN:", phnQuery, "Cleaned:", cleanPhn);
      
      if (!cleanPhn) {
        setPatient(null);
        setAdmissions([]);
        setNotFound("Invalid PHN - must contain numbers");
        return;
      }

      setLoading(true);
      setNotFound(null);
      setPatient(null);
      setAdmissions([]);

      try {
        console.log("📞 [Main] Calling apiGetPatient with:", cleanPhn);
        const patientData = await apiGetPatient(cleanPhn);
        console.log("✅ [Main] Patient data received:", patientData);

        if (!patientData) {
          console.log("❌ [Main] No patient data returned");
          setPatient(null);
          setAdmissions([]);
          setNotFound(`No patient found for PHN ${cleanPhn}`);
          return;
        }

        setPatient(patientData);
        console.log("✅ [Main] Patient state updated");

        // Load admissions separately - don't block on this
        console.log("📞 [Main] Calling apiGetAdmissions with:", cleanPhn);
        const admissionsData = await apiGetAdmissions(cleanPhn);
        console.log("✅ [Main] Admissions data received:", admissionsData);
        setAdmissions(admissionsData);

        // Reset progress notes
        setProgressNotes([]);
        
        console.log("✅ [Main] All data loaded successfully");

      } catch (error) {
        console.error("❌ [Main] Error loading patient:", error);
        setPatient(null);
        setAdmissions([]);
        setNotFound(`Failed to load patient: ${error.message}. Check if backend is running.`);
      } finally {
        setLoading(false);
      }
    }

    // Add a small delay to avoid rapid calls
    const timer = setTimeout(() => {
      loadPatient();
    }, 100);

    return () => clearTimeout(timer);
  }, [phnQuery]);

  // When patient changes, reset tab-specific state
  useEffect(() => {
    if (patient) {
      setMedicalProblems([""]);
      setAllergyProblems([""]);
      setProgressNotes([]);
      setTab("patient-details");
      setIcd10("");
      setDsDiagnosis("");
      setDsProgress("");
      setDsManagement("");
      setDsDischargePlan("");
      setDsFreeDrugs("");
      setDsDischargeDate("");
    }
  }, [patient]);

  const activeAdmission = admissions.find((a) => a.isActive);

  /**
   * PROGRESS NOTE SUBMIT
   */
  const [progressForm, setProgressForm] = useState({
    tempC: "",
    weightKg: "",
    bpHigh: "",
    bpLow: "",
    heartRate: "",
    inputMl: "",
    urineOutputMl: "",
    pdBalance: "",
    totalBalance: "",
  });

  const handleProgressChange =
    (field: keyof typeof progressForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProgressForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !activeAdmission) return;

    const payload = {
      tempC: progressForm.tempC ? Number(progressForm.tempC) : undefined,
      weightKg: progressForm.weightKg ? Number(progressForm.weightKg) : undefined,
      bpHigh: progressForm.bpHigh ? Number(progressForm.bpHigh) : undefined,
      bpLow: progressForm.bpLow ? Number(progressForm.bpLow) : undefined,
      heartRate: progressForm.heartRate ? Number(progressForm.heartRate) : undefined,
      inputMl: progressForm.inputMl ? Number(progressForm.inputMl) : undefined,
      urineOutputMl: progressForm.urineOutputMl
        ? Number(progressForm.urineOutputMl)
        : undefined,
      pdBalance: progressForm.pdBalance ? Number(progressForm.pdBalance) : undefined,
      totalBalance: progressForm.totalBalance
        ? Number(progressForm.totalBalance)
        : undefined,
    };

    try {
      const newNote = await apiAddProgressNote(
        patient.phn,
        activeAdmission.id,
        payload
      );
      setProgressNotes((prev) => [newNote, ...prev]);

      setProgressForm({
        tempC: "",
        weightKg: "",
        bpHigh: "",
        bpLow: "",
        heartRate: "",
        inputMl: "",
        urineOutputMl: "",
        pdBalance: "",
        totalBalance: "",
      });
    } catch (error) {
      console.error("Error adding progress note:", error);
      alert("Failed to add progress note");
    }
  };

  /**
   * DISCHARGE SUMMARY CREATION
   */
  const handleCreateDischargeSummary = async () => {
    if (!patient || !activeAdmission) return;

    setCreatingSummary(true);

    const dsPayload = {
      dischargeDate: dsDischargeDate || null,
      diagnosis: dsDiagnosis,
      icd10,
      progressSummary: dsProgress,
      management: dsManagement,
      dischargePlan: dsDischargePlan,
      drugsFreeHand: dsFreeDrugs,
    };

    try {
      await apiCreateDischargeSummary(patient.phn, activeAdmission.id, dsPayload);

      setAdmissions((prev) =>
        prev.map((a) =>
          a.id === activeAdmission.id
            ? { ...a, hasDischargeSummary: true }
            : a
        )
      );

      alert("Discharge summary created successfully!");
    } catch (error) {
      console.error("Error creating discharge summary:", error);
      alert("Failed to create discharge summary");
    } finally {
      setCreatingSummary(false);
    }
  };

  /**
   * RENDER
   */

  return (
    <div className="flex w-full">
      <div className="flex-1 px-6 py-6">
        {/* PAGE TITLE */}
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Ward Management
            </h1>
            <p className="text-xs text-slate-500">
              Renal Care Unit – search by PHN from the top bar to load the current admission.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Add New Patient
          </button>
        </header>

        {/* UNIT TITLE */}
        <h2 className="mb-3 text-center text-sm font-semibold text-slate-700">
          RENAL CARE UNIT - TEACHING HOSPITAL, PERADENIYA
        </h2>

        {/* states with no patient / loading */}
        {loading && (
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading patient details…
          </div>
        )}

        {!loading && notFound && (
          <div className="mt-6 rounded-2xl border border-dashed border-red-200 bg-red-50 p-4 text-center text-xs text-red-700">
            {notFound}
          </div>
        )}

        {!loading && !patient && !notFound && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
            <p className="mb-1 font-semibold">No patient selected.</p>
            <p className="text-xs text-slate-500">
              Search by <span className="font-mono">PHN</span> at the top bar
              to load the current admission for that patient.
            </p>
          </div>
        )}

        {patient && (
          <>
            {/* HEADER STRIP */}
            <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-6">
                <HeaderField label="Name" value={patient.name} />
                <HeaderField label="Date of Birth" value={patient.dob} />
                <HeaderField label="PHN" value={patient.phn} />
                <HeaderField
                  label="BHT Number"
                  value={patient.bhtNumber || "–"}
                />
                <HeaderField label="Age" value={formatAge(patient.dob)} />
                <HeaderField label="Sex" value={patient.sex} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap gap-4">
                  <HeaderField label="Ward" value={patient.wardNumber || patient.ward} />
                  <HeaderField label="Bed" value={patient.bedId || "–"} />
                  <HeaderField
                    label="Date of Admission"
                    value={patient.admissionDate || "–"}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    Current Status
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                    {patient.status}
                  </span>
                </div>
              </div>
            </section>

            {/* TABS */}
            <section className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
              {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                    tab === key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {TAB_LABELS[key]}
                </button>
              ))}
            </section>

            {/* BODY GRID */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* LEFT 2/3 – tabs content */}
              <section className="space-y-4 lg:col-span-2">
                
                {tab === "patient-details" && (
                  <PatientDetailsTab patient={patient} />
                )}

                {tab === "admitting-notes" && (
                  <AdmittingNotesTab patient={patient} />
                )}

                {tab === "progress-notes" && (
                  <ProgressNotesTab
                    progressForm={progressForm}
                    onChange={handleProgressChange}
                    onSubmit={handleSubmitProgress}
                    notes={progressNotes}
                  />
                )}

                {tab === "medical-history" && (
                  <ProblemListTab
                    title="Medical History"
                    helpText="Add key long-term medical problems (e.g. Diabetes, Hypertension, IHD)."
                    problems={medicalProblems}
                    setProblems={setMedicalProblems}
                  />
                )}

                {tab === "allergic-history" && (
                  <ProblemListTab
                    title="Allergic History"
                    helpText="Record known drug / food / contrast allergies."
                    problems={allergyProblems}
                    setProblems={setAllergyProblems}
                  />
                )}

                {tab === "investigations" && <InvestigationsRedirectTab />}

                {tab === "discharge-summary" && (
                  <DischargeSummaryTab
                    patient={patient}
                    medicalProblems={medicalProblems}
                    allergyProblems={allergyProblems}
                    icd10={icd10}
                    setIcd10={setIcd10}
                    dsDiagnosis={dsDiagnosis}
                    setDsDiagnosis={setDsDiagnosis}
                    dsProgress={dsProgress}
                    setDsProgress={setDsProgress}
                    dsManagement={dsManagement}
                    setDsManagement={setDsManagement}
                    dsDischargePlan={dsDischargePlan}
                    setDsDischargePlan={setDsDischargePlan}
                    dsFreeDrugs={dsFreeDrugs}
                    setDsFreeDrugs={setDsFreeDrugs}
                    dsDischargeDate={dsDischargeDate}
                    setDsDischargeDate={setDsDischargeDate}
                    onCreate={handleCreateDischargeSummary}
                    creating={creatingSummary}
                  />
                )}
              </section>

              {/* RIGHT 1/3 – Admission list */}
              <section className="space-y-4 lg:col-span-1">
                <AdmissionsCard admissions={admissions} patientPhn={patient?.phn} />
              </section>
            </div>
          </>
        )}
      </div>

      {/* ADD PATIENT MODAL */}
      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onCreate={async (payload) => {
            try {
              const newPatient = await apiCreatePatient(payload);
              setShowAddModal(false);
              // Refresh the patient data after creation
              const cleanPhn = payload.phn.replace(/[^0-9]/g, "");
              navigate(`/ward-management?phn=${cleanPhn}`, { replace: true });
              
              // Reload patient data
              const patientData = await apiGetPatient(cleanPhn);
              if (patientData) {
                setPatient(patientData);
                const admissionsData = await apiGetAdmissions(cleanPhn);
                setAdmissions(admissionsData);
              }
            } catch (error) {
              console.error("Error creating patient:", error);
              alert("Failed to create patient: " + error.message);
            }
          }}
        />
      )}
    </div>
  );
};

/**
 * TABS
 */

const PatientDetailsTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="mb-4 text-sm font-semibold text-slate-800">
      Demographics
    </h3>
    <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
      <ReadField label="PHN" value={patient.phn} />
      <ReadField label="Patient Name" value={patient.name} />
      <ReadField label="BHT Number" value={patient.bhtNumber || "–"} />

      <ReadField label="Patient Address" value={patient.address || "–"} />
      <ReadField label="Telephone Number" value={patient.phone || "–"} />
      <ReadField label="NIC No" value={patient.nic || "–"} />

      <ReadField label="Date of Birth" value={patient.dob} />
      <ReadField label="Age" value={formatAge(patient.dob)} />
      <ReadField label="Sex" value={patient.sex as string} />

      <ReadField label="MOH Area" value={patient.mohArea || "–"} />
      <ReadField label="Ethnic Group" value={patient.ethnicGroup || "–"} />
      <ReadField label="Religion" value={patient.religion || "–"} />

      <ReadField label="Occupation" value={patient.occupation || "–"} />
      <ReadField label="Marital Status" value={patient.maritalStatus || "–"} />
      <ReadField label="Primary Diagnosis" value={patient.primaryDiagnosis || "–"} />
    </div>
  </div>
);

const AdmittingNotesTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="mb-4 text-sm font-semibold text-slate-800">
      Admitting Notes
    </h3>
    <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
      <ReadField
        label="Type of Admission"
        value={patient.admissionType || "–"}
      />
      <ReadField
        label="Admitting Officer"
        value={patient.admittingOfficer || "–"}
      />
      <ReadField
        label="Admitting Hospital"
        value={patient.referredBy || "Teaching Hospital Peradeniya"}
      />
      <ReadField
        label="Ward / Bed"
        value={`${patient.wardNumber || patient.ward} / ${
          patient.bedId || "-"
        }`}
      />
      <ReadField label="Date of Admission" value={patient.admissionDate} />
      <ReadField label="Time of Admission" value={patient.admissionTime} />
    </div>
    <div className="mt-4">
      <label className="mb-1 block text-[11px] font-medium text-slate-600">
        Presenting Complaints
      </label>
      <textarea
        readOnly
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
        value={patient.presentingComplaints || ""}
      />
    </div>

    {/* Examinations – Now showing actual data from Admission */}
    <div className="mt-4">
      <h4 className="mb-2 text-xs font-semibold text-slate-700">
        Examinations at Admission
      </h4>
      <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
        <ReadField
          label="Temperature (°C)"
          value={patient.examTempC?.toString() || "–"}
        />
        <ReadField
          label="Height (cm)"
          value={patient.examHeightCm?.toString() || "–"}
        />
        <ReadField
          label="Body Weight (kg)"
          value={patient.examWeightKg?.toString() || "–"}
        />
        <ReadField
          label="BMI (kg/m²)"
          value={patient.examBMI ? patient.examBMI.toFixed(1) : "–"}
        />
        <ReadField
          label="Blood Pressure (mmHg)"
          value={patient.examBloodPressure || "–"}
        />
        <ReadField
          label="Heart Rate (bpm)"
          value={patient.examHeartRate?.toString() || "–"}
        />
      </div>
    </div>
  </div>
);

const ProgressNotesTab: React.FC<{
  progressForm: {
    tempC: string;
    weightKg: string;
    bpHigh: string;
    bpLow: string;
    heartRate: string;
    inputMl: string;
    urineOutputMl: string;
    pdBalance: string;
    totalBalance: string;
  };
  onChange: (
    field:
      | "tempC"
      | "weightKg"
      | "bpHigh"
      | "bpLow"
      | "heartRate"
      | "inputMl"
      | "urineOutputMl"
      | "pdBalance"
      | "totalBalance"
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  notes: ProgressNote[];
}> = ({ progressForm, onChange, onSubmit, notes }) => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">
        New Progress Note
      </h3>
      <form onSubmit={onSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <InputField
            label="Temperature (°C)"
            value={progressForm.tempC}
            onChange={onChange("tempC")}
            type="number"
            min="25"
            max="45"
          />
          <InputField
            label="Body Weight (kg)"
            value={progressForm.weightKg}
            onChange={onChange("weightKg")}
            type="number"
            step="0.1"
          />
          <InputField
            label="BP High (mmHg)"
            value={progressForm.bpHigh}
            onChange={onChange("bpHigh")}
            type="number"
          />
          <InputField
            label="BP Low (mmHg)"
            value={progressForm.bpLow}
            onChange={onChange("bpLow")}
            type="number"
          />
          <InputField
            label="Heart Rate (bpm)"
            value={progressForm.heartRate}
            onChange={onChange("heartRate")}
            type="number"
          />
          <InputField
            label="Input (mL)"
            value={progressForm.inputMl}
            onChange={onChange("inputMl")}
            type="number"
          />
          <InputField
            label="Urine Output (mL)"
            value={progressForm.urineOutputMl}
            onChange={onChange("urineOutputMl")}
            type="number"
          />
          <InputField
            label="PD Balance (mL)"
            value={progressForm.pdBalance}
            onChange={onChange("pdBalance")}
            type="number"
          />
          <InputField
            label="Total Balance (mL)"
            value={progressForm.totalBalance}
            onChange={onChange("totalBalance")}
            type="number"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            Save Progress Note
          </button>
        </div>
      </form>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">
        Previous Progress Notes
      </h3>
      {notes.length === 0 ? (
        <p className="text-xs text-slate-500">No progress notes yet.</p>
      ) : (
        <div className="space-y-3 text-xs">
          {notes.map((n) => (
            <article
              key={n.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="font-semibold text-slate-800">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-1 md:grid-cols-4">
                <SmallMetric label="Temp" value={n.tempC} suffix="°C" />
                <SmallMetric label="Wt" value={n.weightKg} suffix="kg" />
                <SmallMetric
                  label="BP"
                  value={
                    n.bpHigh && n.bpLow
                      ? `${n.bpHigh}/${n.bpLow}`
                      : undefined
                  }
                  suffix="mmHg"
                />
                <SmallMetric label="HR" value={n.heartRate} suffix="bpm" />
                <SmallMetric label="Input" value={n.inputMl} suffix="mL" />
                <SmallMetric
                  label="Urine"
                  value={n.urineOutputMl}
                  suffix="mL"
                />
                <SmallMetric
                  label="PD Bal"
                  value={n.pdBalance}
                  suffix="mL"
                />
                <SmallMetric
                  label="Total Bal"
                  value={n.totalBalance}
                  suffix="mL"
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  </div>
);

const SmallMetric: React.FC<{
  label: string;
  value?: number | string;
  suffix?: string;
}> = ({ label, value, suffix }) => (
  <div className="text-[11px] text-slate-600">
    <span className="font-medium text-slate-500">{label}: </span>
    {value !== undefined ? (
      <span className="font-semibold text-slate-800">
        {value}
        {suffix ? ` ${suffix}` : ""}
      </span>
    ) : (
      <span className="text-slate-400">–</span>
    )}
  </div>
);

const ProblemListTab: React.FC<{
  title: string;
  helpText: string;
  problems: string[];
  setProblems: (p: string[]) => void;
}> = ({ title, helpText, problems, setProblems }) => {
  const handleChange =
    (index: number) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const copy = [...problems];
      copy[index] = e.target.value;
      setProblems(copy);
    };

  const handleAdd = () => {
    if (problems.length < 10) {
      setProblems([...problems, ""]);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            {title}
          </h3>
          <p className="text-[11px] text-slate-500">{helpText}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={problems.length >= 10}
          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Problem
        </button>
      </div>
      <div className="space-y-2 text-xs">
        {problems.map((p, idx) => (
          <div key={idx}>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
              Problem {idx + 1}
            </label>
            <textarea
              value={p}
              onChange={handleChange(idx)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const InvestigationsRedirectTab: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-800">
        Investigations
      </h3>
      <p className="mb-4 text-xs text-slate-600">
        Investigations are handled in a dedicated section. Click below to go
        to the Investigations module for this patient.
      </p>
      <button
        type="button"
        onClick={() => navigate("/investigation")}
        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
      >
        Go to Investigations
      </button>
    </div>
  );
};

const DischargeSummaryTab: React.FC<{
  patient: Patient;
  medicalProblems: string[];
  allergyProblems: string[];
  icd10: string;
  setIcd10: (s: string) => void;
  dsDiagnosis: string;
  setDsDiagnosis: (s: string) => void;
  dsProgress: string;
  setDsProgress: (s: string) => void;
  dsManagement: string;
  setDsManagement: (s: string) => void;
  dsDischargePlan: string;
  setDsDischargePlan: (s: string) => void;
  dsFreeDrugs: string;
  setDsFreeDrugs: (s: string) => void;
  dsDischargeDate: string;
  setDsDischargeDate: (s: string) => void;
  onCreate: () => void;
  creating: boolean;
}> = ({
  patient,
  medicalProblems,
  allergyProblems,
  icd10,
  setIcd10,
  dsDiagnosis,
  setDsDiagnosis,
  dsProgress,
  setDsProgress,
  dsManagement,
  setDsManagement,
  dsDischargePlan,
  setDsDischargePlan,
  dsFreeDrugs,
  setDsFreeDrugs,
  dsDischargeDate,
  setDsDischargeDate,
  onCreate,
  creating,
}) => {
  const medList = medicalProblems.filter((p) => p.trim().length > 0);
  const allergyList = allergyProblems.filter((p) => p.trim().length > 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Discharge Summary Builder
        </h3>

        {/* 1. Patient details */}
        <SectionTitle>1. Patient Details</SectionTitle>
        <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
          <ReadField label="Name" value={patient.name} />
          <ReadField label="Age" value={formatAge(patient.dob)} />
          <ReadField label="Sex" value={patient.sex as string} />
          <ReadField label="PHN" value={patient.phn} />
          <ReadField label="BHT Number" value={patient.bhtNumber || "–"} />
          <ReadField label="Admitting Hospital" value="Teaching Hospital Peradeniya" />
          <ReadField
            label="Date of Admission"
            value={patient.admissionDate || "–"}
          />
          <InputField
            label="Date of Discharge"
            type="date"
            value={dsDischargeDate}
            onChange={(e) => setDsDischargeDate(e.target.value)}
          />
        </div>

        {/* 2. Diagnosis */}
        <SectionTitle>2. Diagnosis</SectionTitle>
        <TextAreaField
          value={dsDiagnosis}
          onChange={(e) => setDsDiagnosis(e.target.value)}
          placeholder="Final diagnosis for this admission..."
        />

        {/* 3. ICD-10 code */}
        <SectionTitle>3. ICD-10 Code</SectionTitle>
        <select
          className="mb-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
          value={icd10}
          onChange={(e) => setIcd10(e.target.value)}
        >
          <option value="">Select ICD-10 code</option>
          {ICD10_CODES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>

        {/* 4. Medical history */}
        <SectionTitle>4. Medical History</SectionTitle>
        {medList.length === 0 ? (
          <p className="mb-2 text-xs text-slate-500">
            No medical history recorded in the Medical History tab.
          </p>
        ) : (
          <ul className="mb-2 list-disc pl-5 text-xs text-slate-700">
            {medList.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}

        {/* 5. Allergies */}
        <SectionTitle>5. Allergies</SectionTitle>
        {allergyList.length === 0 ? (
          <p className="mb-2 text-xs text-slate-500">
            No allergies recorded in the Allergic History tab.
          </p>
        ) : (
          <ul className="mb-2 list-disc pl-5 text-xs text-slate-700">
            {allergyList.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}

        {/* 6. Admission details */}
        <SectionTitle>6. Admission Details</SectionTitle>
        <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
          <ReadField
            label="Type of Admission"
            value={patient.admissionType || "–"}
          />
          <ReadField
            label="Admitting Officer"
            value={patient.admittingOfficer || "–"}
          />
          <ReadField
            label="Ward / Bed"
            value={`${patient.wardNumber || patient.ward} / ${
              patient.bedId || "-"
            }`}
          />
          <ReadField label="Referred From" value={patient.referredBy} />
          <ReadField
            label="Presenting Complaints"
            value={patient.presentingComplaints}
          />
        </div>

        {/* 7. Examinations */}
        <SectionTitle>7. Examinations at Admission</SectionTitle>
        <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
          <ReadField
            label="Temperature (°C)"
            value={patient.examTempC?.toString() || "–"}
          />
          <ReadField
            label="Height (cm)"
            value={patient.examHeightCm?.toString() || "–"}
          />
          <ReadField
            label="Weight (kg)"
            value={patient.examWeightKg?.toString() || "–"}
          />
          <ReadField
            label="BMI (kg/m²)"
            value={patient.examBMI ? patient.examBMI.toFixed(1) : "–"}
          />
          <ReadField
            label="Blood Pressure"
            value={patient.examBloodPressure || "–"}
          />
          <ReadField
            label="Heart Rate (bpm)"
            value={patient.examHeartRate?.toString() || "–"}
          />
        </div>

        {/* 8. Progress summary */}
        <SectionTitle>8. Progress</SectionTitle>
        <TextAreaField
          value={dsProgress}
          onChange={(e) => setDsProgress(e.target.value)}
          placeholder="Free-hand summary of ward progress, key events and complications..."
        />

        {/* 9. Drugs */}
        <SectionTitle>9. Drugs</SectionTitle>
        <p className="mb-1 text-[11px] text-slate-500">
          In future this will be auto-filled from the Medications module. For
          now, you can type the discharge drug list below.
        </p>
        <TextAreaField
          value={dsFreeDrugs}
          onChange={(e) => setDsFreeDrugs(e.target.value)}
          placeholder="List of drugs on discharge (name, dose, frequency)..."
        />

        {/* 10. Management */}
        <SectionTitle>10. Management</SectionTitle>
        <TextAreaField
          value={dsManagement}
          onChange={(e) => setDsManagement(e.target.value)}
          placeholder="Important management decisions, procedures, dialysis plan..."
        />

        {/* 11. Discharge plan */}
        <SectionTitle>11. Discharge Plan</SectionTitle>
        <TextAreaField
          value={dsDischargePlan}
          onChange={(e) => setDsDischargePlan(e.target.value)}
          placeholder="Follow-up clinic, next dialysis date, lifestyle advice, red-flag symptoms..."
        />

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onCreate}
            disabled={creating}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <FileText className="mr-2 h-3.5 w-3.5" />
                Create Discharge Summary
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * RIGHT-HAND ADMISSION CARD
 */

const AdmissionsCard: React.FC<{ admissions: Admission[]; patientPhn?: string }> = ({
  admissions,
  patientPhn
}) => {
  const handleDownloadPDF = async (adm: Admission) => {
    if (!patientPhn) return;
    
    try {
      const response = await fetch(
        `${API}/patients/${patientPhn}/admissions/${adm.id}/discharge-summary/pdf`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `discharge-summary-${adm.bhtNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('No discharge summary PDF available');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download discharge summary');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          Admission Summary
        </h3>
      </div>
      <div className="space-y-3 text-xs">
        {admissions.map((adm) => (
          <div
            key={adm.id}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
              adm.isActive
                ? "border-blue-200 bg-blue-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-slate-700 shadow-sm">
                {adm.number}
              </div>
              <div>
                <div className="font-semibold text-slate-800">Admission</div>
                <div className="text-[11px] text-slate-500">
                  {adm.admittedOn}
                </div>
                <div className="mt-1 text-[11px]">
                  {adm.hasDischargeSummary ? (
                    <span className="font-medium text-emerald-600">
                      Discharge Summary Available
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      No Discharge Summary
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDownloadPDF(adm)}
              disabled={!adm.hasDischargeSummary}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText className="mr-1 h-3 w-3" />
              PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * SHARED SMALL COMPONENTS
 */

const ReadField: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-medium text-slate-500">{label}</span>
    <input
      readOnly
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
      value={value || ""}
    />
  </div>
);

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string;
  max?: string;
}> = ({ label, value, onChange, type = "text", min, max }) => (
  <label className="flex flex-col gap-1 text-xs">
    <span className="text-[11px] font-medium text-slate-600">{label}</span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
    />
  </label>
);

const TextAreaField: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => (
  <textarea
    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
    rows={3}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="mt-4 mb-1 text-xs font-semibold text-slate-700">{children}</h4>
);

/**
 * ADD PATIENT MODAL WITH VALIDATION
 */

type AddPatientModalProps = {
  onClose: () => void;
  onCreate: (payload: PatientCreatePayload) => void;
};

type PatientForm = {
  phn: string;
  bht: string; // kept in UI but not sent
  name: string;
  dob: string;
  sex: Sex;
  phone: string;
  nic: string;
  address: string;
  mohArea: string;
  ethnicGroup: string;
  religion: string;
  occupation: string;
  maritalStatus: string;
  ward: string;
  wardNumber: string;
  bedId: string;
  admissionDate: string;
  admissionTime: string;
  consultantName: string;
  referredBy: string;
  primaryDiagnosis: string;
  admissionType: AdmissionType | "";
  admittingOfficer: string;
  presentingComplaints: string;
  examTempC: string;
  examHeightCm: string;
  examWeightKg: string;
  examBloodPressure: string;
  examHeartRate: string;
  problemList: string[];
};

type ValidationErrors = Partial<Record<keyof PatientForm, string>>;

const AddPatientModal: React.FC<AddPatientModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [form, setForm] = useState<PatientForm>({
    phn: "",
    bht: "",
    name: "",
    dob: "",
    sex: "Male",
    phone: "",
    nic: "",
    address: "",
    mohArea: "",
    ethnicGroup: "",
    religion: "",
    occupation: "",
    maritalStatus: "",
    ward: "",
    wardNumber: "",
    bedId: "",
    admissionDate: "",
    admissionTime: "",
    consultantName: "",
    referredBy: "",
    primaryDiagnosis: "",
    admissionType: "",
    admittingOfficer: "",
    presentingComplaints: "",
    examTempC: "",
    examHeightCm: "",
    examWeightKg: "",
    examBloodPressure: "",
    examHeartRate: "",
    problemList: [""],
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  // BMI derived
  const bmi =
    form.examHeightCm && form.examWeightKg
      ? (() => {
          const h = Number(form.examHeightCm);
          const w = Number(form.examWeightKg);
          if (!h || !w) return "";
          const m = h / 100;
          return (w / (m * m)).toFixed(1);
        })()
      : "";

  const handleChange =
    (field: keyof PatientForm) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleProblemChange =
    (index: number) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const copy = [...form.problemList];
      copy[index] = e.target.value;
      setForm((prev) => ({ ...prev, problemList: copy }));
    };

  const addProblemBox = () => {
    if (form.problemList.length < 10) {
      setForm((prev) => ({
        ...prev,
        problemList: [...prev.problemList, ""],
      }));
    }
  };

  const validate = (): boolean => {
    const errs: ValidationErrors = {};

    const requiredFields: (keyof PatientForm)[] = [
      "phn",
      "name",
      "dob",
      "sex",
      "ward",
      "admissionDate",
      "admissionType",
      "presentingComplaints",
    ];

    requiredFields.forEach((f) => {
      if (!form[f] || (typeof form[f] === "string" && !form[f].trim())) {
        errs[f] = "Required";
      }
    });

    // phone: 10 digits
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      errs.phone = "Phone must be exactly 10 digits";
    }

    // NIC: 10 characters (letters/digits)
    if (form.nic && form.nic.length !== 10) {
      errs.nic = "NIC must be exactly 10 characters";
    }

    // numeric checks for exam fields
    const numericFields: (keyof PatientForm)[] = [
      "examTempC",
      "examHeightCm",
      "examWeightKg",
      "examHeartRate",
    ];
    numericFields.forEach((f) => {
      const val = form[f];
      if (val && isNaN(Number(val))) {
        errs[f] = "Must be a number";
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Format admissionTime properly for LocalDateTime
    let admissionTime: string | undefined;
    if (form.admissionTime) {
      admissionTime = `${form.admissionDate}T${form.admissionTime}:00`;
    }

    const payload: PatientCreatePayload = {
      phn: form.phn.trim(),
      name: form.name.trim(),
      dob: form.dob,
      sex: form.sex,

      address: form.address || undefined,
      phone: form.phone || undefined,
      nic: form.nic || undefined,
      mohArea: form.mohArea || undefined,
      ethnicGroup: form.ethnicGroup || undefined,
      religion: form.religion || undefined,
      occupation: form.occupation || undefined,
      maritalStatus: form.maritalStatus || undefined,

      ward: form.ward,
      wardNumber: form.wardNumber || undefined,
      bedId: form.bedId || undefined,
      admissionDate: form.admissionDate,
      admissionTime: admissionTime,
      admissionType: form.admissionType || "Other",
      consultantName: form.consultantName || undefined,
      referredBy: form.referredBy || undefined,
      primaryDiagnosis: form.primaryDiagnosis || undefined,
      admittingOfficer: form.admittingOfficer || undefined,
      presentingComplaints: form.presentingComplaints,

      tempC: form.examTempC ? Number(form.examTempC) : undefined,
      heightCm: form.examHeightCm ? Number(form.examHeightCm) : undefined,
      weightKg: form.examWeightKg ? Number(form.examWeightKg) : undefined,
      bmi: bmi ? Number(bmi) : undefined,
      bloodPressure: form.examBloodPressure || undefined,
      heartRate: form.examHeartRate ? Number(form.examHeartRate) : undefined,

      medicalProblems: form.problemList
        .map((p) => p.trim())
        .filter((p) => p.length > 0),
      allergyProblems: [],
    };

    console.log("Submitting payload:", payload);
    onCreate(payload);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-lg">
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Add New Patient
            </h3>
            <p className="text-[11px] text-slate-500">
              This will create a new PHN/BHT admission. All fields go through
              basic validation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-40px)] overflow-y-auto px-4 py-3 text-xs"
        >
          {/* Core identity */}
          <SectionTitle>Identity</SectionTitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <ValidatedField
              label="PHN *"
              error={errors.phn}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.phn}
                  onChange={handleChange("phn")}
                />
              }
            />
            <ValidatedField
              label="BHT Number (optional)"
              error={errors.bht}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.bht}
                  onChange={handleChange("bht")}
                />
              }
            />
            <ValidatedField
              label="Patient Name *"
              error={errors.name}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.name}
                  onChange={handleChange("name")}
                />
              }
            />
            <ValidatedField
              label="Date of Birth *"
              error={errors.dob}
              children={
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.dob}
                  onChange={handleChange("dob")}
                />
              }
            />
            <ValidatedField
              label="Sex *"
              error={errors.sex}
              children={
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.sex}
                  onChange={handleChange("sex")}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              }
            />
          </div>

          {/* Contact / socio */}
          <SectionTitle>Contact & Socio-demographic</SectionTitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <ValidatedField
              label="Telephone (10 digits)"
              error={errors.phone}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  maxLength={10}
                />
              }
            />
            <ValidatedField
              label="NIC (10 characters)"
              error={errors.nic}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.nic}
                  onChange={handleChange("nic")}
                  maxLength={10}
                />
              }
            />
            <ValidatedField
              label="MOH Area"
              error={errors.mohArea}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.mohArea}
                  onChange={handleChange("mohArea")}
                />
              }
            />
            <ValidatedField
              label="Address"
              error={errors.address}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.address}
                  onChange={handleChange("address")}
                />
              }
            />
            <ValidatedField
              label="Ethnic Group"
              error={errors.ethnicGroup}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.ethnicGroup}
                  onChange={handleChange("ethnicGroup")}
                />
              }
            />
            <ValidatedField
              label="Religion"
              error={errors.religion}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.religion}
                  onChange={handleChange("religion")}
                />
              }
            />
            <ValidatedField
              label="Occupation"
              error={errors.occupation}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.occupation}
                  onChange={handleChange("occupation")}
                />
              }
            />
            <ValidatedField
              label="Marital Status"
              error={errors.maritalStatus}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.maritalStatus}
                  onChange={handleChange("maritalStatus")}
                />
              }
            />
          </div>

          {/* Admission details */}
          <SectionTitle>Admission Details</SectionTitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <ValidatedField
              label="Ward *"
              error={errors.ward}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.ward}
                  onChange={handleChange("ward")}
                />
              }
            />
            <ValidatedField
              label="Ward Number"
              error={errors.wardNumber}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.wardNumber}
                  onChange={handleChange("wardNumber")}
                />
              }
            />
            <ValidatedField
              label="Bed ID"
              error={errors.bedId}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.bedId}
                  onChange={handleChange("bedId")}
                />
              }
            />
            <ValidatedField
              label="Date of Admission *"
              error={errors.admissionDate}
              children={
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.admissionDate}
                  onChange={handleChange("admissionDate")}
                />
              }
            />
            <ValidatedField
              label="Time of Admission"
              error={errors.admissionTime}
              children={
                <input
                  type="time"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.admissionTime}
                  onChange={handleChange("admissionTime")}
                />
              }
            />
            <ValidatedField
              label="Type of Admission *"
              error={errors.admissionType}
              children={
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.admissionType}
                  onChange={handleChange("admissionType")}
                >
                  <option value="">Select</option>
                  {ADMISSION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              }
            />
            <ValidatedField
              label="Admitting Officer"
              error={errors.admittingOfficer}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.admittingOfficer}
                  onChange={handleChange("admittingOfficer")}
                />
              }
            />
            <ValidatedField
              label="Consultant Name"
              error={errors.consultantName}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.consultantName}
                  onChange={handleChange("consultantName")}
                />
              }
            />
            <ValidatedField
              label="Referring / Admitting Hospital"
              error={errors.referredBy}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.referredBy}
                  onChange={handleChange("referredBy")}
                />
              }
            />
          </div>

          <ValidatedField
            label="Presenting Complaints *"
            error={errors.presentingComplaints}
            children={
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                rows={3}
                value={form.presentingComplaints}
                onChange={handleChange("presentingComplaints")}
              />
            }
          />

          {/* Examinations */}
          <SectionTitle>Examinations</SectionTitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <ValidatedField
              label="Temperature (°C)"
              error={errors.examTempC}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.examTempC}
                  onChange={handleChange("examTempC")}
                />
              }
            />
            <ValidatedField
              label="Height (cm)"
              error={errors.examHeightCm}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.examHeightCm}
                  onChange={handleChange("examHeightCm")}
                />
              }
            />
            <ValidatedField
              label="Body Weight (kg)"
              error={errors.examWeightKg}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.examWeightKg}
                  onChange={handleChange("examWeightKg")}
                />
              }
            />
            <ValidatedField
              label="BMI (auto)"
              error={undefined}
              children={
                <input
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                  value={bmi}
                />
              }
            />
            <ValidatedField
              label="Blood Pressure (mmHg)"
              error={errors.examBloodPressure}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.examBloodPressure}
                  onChange={handleChange("examBloodPressure")}
                  placeholder="e.g. 140/90"
                />
              }
            />
            <ValidatedField
              label="Heart Rate (bpm)"
              error={errors.examHeartRate}
              children={
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  value={form.examHeartRate}
                  onChange={handleChange("examHeartRate")}
                />
              }
            />
          </div>

          {/* Problem list */}
          <SectionTitle>Problem List</SectionTitle>
          <p className="mb-1 text-[11px] text-slate-500">
            Start with one problem; click "+ Add Problem" to add up to 10.
          </p>
          <div className="space-y-2">
            {form.problemList.map((p, idx) => (
              <div key={idx}>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">
                  Problem {idx + 1}
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                  rows={2}
                  value={p}
                  onChange={handleProblemChange(idx)}
                />
              </div>
            ))}
          </div>
          {form.problemList.length < 10 && (
            <button
              type="button"
              onClick={addProblemBox}
              className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Problem
            </button>
          )}

          {/* Primary diagnosis */}
          <SectionTitle>Primary Diagnosis</SectionTitle>
          <textarea
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            rows={2}
            value={form.primaryDiagnosis}
            onChange={handleChange("primaryDiagnosis")}
          />

          {/* Footer buttons */}
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-blue-700"
            >
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ValidatedField: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-medium text-slate-600">{label}</span>
    {children}
    {error && (
      <span className="text-[10px] font-medium text-red-500">
        {error}
      </span>
    )}
  </div>
);

export default WardManagement;