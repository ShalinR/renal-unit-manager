import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Download, FileText, Image as ImageIcon, Info, Loader2, Plus, Search, X } from "lucide-react";

/**
 * Ward Management Interface
 * - Patient Details tab is DISPLAY-ONLY.
 * - Adds "Add New Patient" button (opens modal with full admission form).
 * - New patient is stored locally (UI only), URL navigates to ?bht=<BHT>, then renders read-only details.
 */

type Sex = "Male" | "Female" | "Other";
type Status = "Admitted" | "Discharged";

type Patient = {
  id: string;        // BHT Number
  name: string;
  dob: string;       // ISO date
  sex: Sex;
  status: Status;
  phn?: string;
  address?: string;
  phone?: string;
  nic?: string;
  mohArea?: string;
  ethnicGroup?: string;
  religion?: string;
  occupation?: string;
  maritalStatus?: string;
  admissionDate?: string; // ISO yyyy-mm-dd
  admissionTime?: string; // HH:mm
  wardNumber?: string;
  consultantName?: string;
};

type Guardian = {
  name?: string;
  address?: string;
  phone?: string;
  nic?: string;
};

type AdmissionMedical = {
  admissionType?: "Direct admission" | "Referred from clinic" | "Referred from medical practitioner" | "Transfer from hospital";
  complaints?: string;
  examination?: string;
  allergies?: string;
  currentMedications?: string;
  problems?: string;
  management?: string;
  stamps?: string;
  notifiableDisease?: boolean;
  admittingOfficer?: string;
};

type Entry = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  category?: "Bio-Chemistry" | "Micro Biology" | "Histopathology" | "Procedure" | "Radiology";
  images?: { name: string; url: string }[];
};

type Admission = {
  id: string;
  number: number;
  admittedOn: string;
  hasDischargeSummary: boolean;
  isActive: boolean;
};

const categories: Entry["category"][] = ["Bio-Chemistry","Micro Biology","Histopathology","Procedure","Radiology"];

function calcAge(dobISO: string): number {
  if (!dobISO) return 0;
  const dob = new Date(dobISO);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

/** Hook: query by BHT via URL (?bht= / ?id=) against mock only (created patients handled in component) */
function useQueryPatientMock(): { loading: boolean; patient: Patient | null; bhtParam: string | null } {
  const [search] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const bht = search.get("bht") || search.get("id");

  const mock: Record<string, Patient> = useMemo(
    () => ({
      "BHT-1001": {
        id: "BHT-1001",
        name: "Nirmal Perera",
        dob: "1988-03-18",
        sex: "Male",
        status: "Admitted",
        phn: "PHN-443221",
        address: "23/4, Galaha Rd, Peradeniya",
        phone: "077-123-4567",
        nic: "882451234V",
        mohArea: "Gannoruwa",
        ethnicGroup: "Sinhalese",
        religion: "Buddhism",
        occupation: "Teacher",
        maritalStatus: "Married",
        admissionDate: "2025-02-02",
        admissionTime: "10:35",
        wardNumber: "RCU-3A",
        consultantName: "Dr. H. Abeywickrama",
      },
      "BHT-1002": {
        id: "BHT-1002",
        name: "Sajini Fernando",
        dob: "1979-11-02",
        sex: "Female",
        status: "Discharged",
        phn: "PHN-992210",
        address: "54, Park Ave, Colombo 5",
        phone: "071-555-9900",
        nic: "797654321V",
        mohArea: "Kirulapone",
        ethnicGroup: "Sinhalese",
        religion: "Christianity",
        occupation: "Accountant",
        maritalStatus: "Married",
        admissionDate: "2024-09-15",
        admissionTime: "14:10",
        wardNumber: "RCU-2B",
        consultantName: "Dr. I. Jayasekara",
      },
    }),
    []
  );

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!bht) { setPatient(null); return; }
    setLoading(true);
    const t = setTimeout(() => { setPatient(mock[bht] ?? null); setLoading(false); }, 200);
    return () => clearTimeout(t);
  }, [bht, mock]);

  return { loading, patient, bhtParam: bht };
}

const WardManagement: React.FC = () => {
  const navigate = useNavigate();
  const { loading, patient: mockPatient, bhtParam } = useQueryPatientMock();

  // Local store for CREATED patients (UI only)
  const [createdPatients, setCreatedPatients] = useState<Record<string, Patient>>({});

  // Guardian + Admission info store, seeded with examples
  const [detailStore, setDetailStore] = useState<Record<string, { guardian: Guardian; admission: AdmissionMedical }>>({
    "BHT-1001": {
      guardian: { name: "Chathura Perera", address: "23/4, Galaha Rd, Peradeniya", phone: "071-222-3344", nic: "721234567V" },
      admission: {
        admissionType: "Direct admission",
        complaints: "Shortness of breath, fatigue.",
        examination: "BP 140/90, edema ++.",
        allergies: "Penicillin.",
        currentMedications: "Furosemide 40mg, ACE inhibitor.",
        problems: "Fluid overload; electrolyte imbalance.",
        management: "Diuretics, fluid restriction, dialysis plan.",
        stamps: "—",
        notifiableDisease: false,
        admittingOfficer: "Dr. M. Ranasinghe",
      }
    },
    "BHT-1002": {
      guardian: { name: "Ravindu Fernando", address: "Colombo 5", phone: "077-888-1122", nic: "802345678V" },
      admission: {
        admissionType: "Referred from clinic",
        complaints: "Nausea, dizziness.",
        examination: "Pulse 88 bpm, mild pallor.",
        allergies: "None known.",
        currentMedications: "Metformin, Atorvastatin.",
        problems: "Type 2 DM; mild anemia.",
        management: "Medication adjustment; follow-up.",
        stamps: "—",
        notifiableDisease: false,
        admittingOfficer: "Dr. P. Fernando",
      }
    }
  });

  // Final patient to show = mock OR created (by current bht)
  const finalPatient: Patient | null = mockPatient ?? (bhtParam ? createdPatients[bhtParam] ?? null : null);
  const extras = finalPatient ? detailStore[finalPatient.id] : undefined;

  // Tabs
  type TabKey = "details" | "progress" | "history" | "allergy" | "investigations" | "discharge";
  const [activeTab, setActiveTab] = useState<TabKey>("details");

  // Notes & investigations (unchanged)
  const [progressNotes, setProgressNotes] = useState<Entry[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<Entry[]>([]);
  const [allergicHistory, setAllergicHistory] = useState<Entry[]>([]);
  const [investigations, setInvestigations] = useState<Entry[]>([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [invCategory, setInvCategory] = useState<Entry["category"]>("Bio-Chemistry");
  const [invImages, setInvImages] = useState<{ name: string; url: string }[]>([]);

  const [admissions] = useState<Admission[]>([
    { id: "1", number: 3, admittedOn: "2025-02-02", hasDischargeSummary: true, isActive: true },
    { id: "2", number: 2, admittedOn: "2024-09-15", hasDischargeSummary: true, isActive: false },
    { id: "3", number: 1, admittedOn: "2023-12-01", hasDischargeSummary: false, isActive: false },
  ]);

  // ===== Add New Patient Modal state =====
  const [showAdd, setShowAdd] = useState(false);

  // Form state for new patient
  const [f, setF] = useState<Patient>({
    id: "",
    name: "",
    dob: "",
    sex: "Male",
    status: "Admitted",
    phn: "",
    address: "",
    phone: "",
    nic: "",
    mohArea: "",
    ethnicGroup: "",
    religion: "",
    occupation: "",
    maritalStatus: "",
    admissionDate: "",
    admissionTime: "",
    wardNumber: "",
    consultantName: "",
  });
  const [g, setG] = useState<Guardian>({ name: "", address: "", phone: "", nic: "" });
  const [aMed, setAMed] = useState<AdmissionMedical>({
    admissionType: "Direct admission",
    complaints: "",
    examination: "",
    allergies: "",
    currentMedications: "",
    problems: "",
    management: "",
    stamps: "",
    notifiableDisease: false,
    admittingOfficer: "",
  });

  const resetForm = () => {
    setF({
      id: "",
      name: "",
      dob: "",
      sex: "Male",
      status: "Admitted",
      phn: "",
      address: "",
      phone: "",
      nic: "",
      mohArea: "",
      ethnicGroup: "",
      religion: "",
      occupation: "",
      maritalStatus: "",
      admissionDate: "",
      admissionTime: "",
      wardNumber: "",
      consultantName: "",
    });
    setG({ name: "", address: "", phone: "", nic: "" });
    setAMed({
      admissionType: "Direct admission",
      complaints: "",
      examination: "",
      allergies: "",
      currentMedications: "",
      problems: "",
      management: "",
      stamps: "",
      notifiableDisease: false,
      admittingOfficer: "",
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const required = [
      ["BHT Number", f.id],
      ["Patient Name", f.name],
      ["Date of birth", f.dob],
      ["Sex", f.sex],
    ];
    const missing = required.filter(([, v]) => !String(v || "").trim());
    if (missing.length) {
      alert("Please fill required fields: " + missing.map(([k]) => k).join(", "));
      return;
    }

    // Save to local stores
    setCreatedPatients((prev) => ({ ...prev, [f.id]: { ...f } }));
    setDetailStore((prev) => ({ ...prev, [f.id]: { guardian: { ...g }, admission: { ...aMed } } }));

    // Navigate to the new BHT
    navigate(`?bht=${encodeURIComponent(f.id)}`);
    setActiveTab("details");
    setShowAdd(false);
    // Optional UX: clear form
    resetForm();
  };

  // Helpers unchanged
  const addEntry = (target: "progress" | "history" | "allergy") => {
    if (!author.trim() || !text.trim()) return;
    const entry: Entry = { id: crypto.randomUUID(), author: author.trim(), text: text.trim(), createdAt: new Date().toISOString() };
    if (target === "progress") setProgressNotes((p) => [entry, ...p]);
    if (target === "history") setMedicalHistory((p) => [entry, ...p]);
    if (target === "allergy") setAllergicHistory((p) => [entry, ...p]);
    setText("");
  };

  const addInvestigation = () => {
    if (!author.trim() || !text.trim() || !invCategory) return;
    const entry: Entry = { id: crypto.randomUUID(), author: author.trim(), text: text.trim(), createdAt: new Date().toISOString(), category: invCategory, images: invImages };
    setInvestigations((p) => [entry, ...p]);
    setText(""); setInvImages([]);
  };

  const onUploadImages: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files; if (!files || files.length === 0) return;
    const next: { name: string; url: string }[] = [];
    Array.from(files).forEach((f) => { next.push({ name: f.name, url: URL.createObjectURL(f) }); });
    setInvImages((prev) => [...prev, ...next]); e.currentTarget.value = "";
  };

  const downloadDischargePDF = (admission: Admission) => {
    const filename = `${(finalPatient?.name || "Patient").replace(/\s+/g, "_")}_${finalPatient?.id || "BHT"}_${admission.admittedOn}_DischargeSummary.pdf`;
    const content = `Discharge Summary
Patient: ${finalPatient?.name} (${finalPatient?.id})
Admission Date: ${admission.admittedOn}
Status: ${admission.isActive ? "Active Admission" : "Past Admission"}

NOTE: Placeholder PDF.`;
    const blob = new Blob([content], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  // === RENDER ===
  return (
    <div className="flex w-full">
      {/* MAIN COLUMN */}
      <div className="flex-1 px-6 py-6">
        {/* Page header row with Add button (right) */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-center md:text-left w-full">
            RENAL CARE UNIT - TEACHING HOSPITAL, PERADENIYA
          </h2>
          <div className="hidden md:block">
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border bg-white hover:bg-slate-50"
              title="Add New Patient"
            >
              <Plus className="w-4 h-4" /> Add New Patient
            </button>
          </div>
        </div>

        {/* In small screens, show the button under header */}
        <div className="md:hidden mb-3">
          <button
            onClick={() => setShowAdd(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border bg-white hover:bg-slate-50"
            title="Add New Patient"
          >
            <Plus className="w-4 h-4" /> Add New Patient
          </button>
        </div>

        {!finalPatient && (
          <div className="border-2 border-dashed rounded-xl p-10 text-center text-slate-500 bg-white">
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin" />
                <span>Searching patient by BHT…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Search />
                <p className="font-medium">SEARCH PATIENTS USING BHT NUMBER</p>
                <p className="text-xs text-slate-400">
                  Use the search box in the page header to find a patient. (Example: BHT-1001)
                </p>
              </div>
            )}
          </div>
        )}

        {finalPatient && (
          <div className="mt-4 bg-white rounded-xl border p-5">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
              <div><p className="text-slate-500">Name</p><p className="font-medium">{finalPatient.name}</p></div>
              <div><p className="text-slate-500">Date of Birth</p><p className="font-medium">{finalPatient.dob}</p></div>
              <div><p className="text-slate-500">BHT Number</p><p className="font-medium">{finalPatient.id}</p></div>
              <div><p className="text-slate-500">Age</p><p className="font-medium">{calcAge(finalPatient.dob)}</p></div>
              <div><p className="text-slate-500">Sex</p><p className="font-medium">{finalPatient.sex}</p></div>
              <div>
                <p className="text-slate-500">Current Status</p>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${finalPatient.status === "Admitted" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{finalPatient.status}</span>
              </div>
            </div>
          </div>
        )}

        {finalPatient && (
          <div className="mt-4 flex gap-4">
            {/* Tabs + content */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 bg-white border rounded-xl p-2">
                {[
                  { key: "details", label: "Patient Details" },
                  { key: "progress", label: "Progress Notes" },
                  { key: "history", label: "Medical History" },
                  { key: "allergy", label: "Allergic History" },
                  { key: "investigations", label: "Investigations" },
                  { key: "discharge", label: "Discharge Summary" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border ${activeTab === t.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-3 bg-white border rounded-xl p-4">
                {activeTab === "details" && finalPatient && (
                  <div className="space-y-8">
                    {/* ===== Demographics (DISPLAY ONLY) ===== */}
                    <section>
                      <h3 className="font-semibold mb-3">Demographics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <ReadOnly label="BHT Number" value={finalPatient.id} />
                        <ReadOnly label="Personal Health No (PHN)" value={finalPatient.phn || "—"} />
                        <ReadOnly label="Patient Name" value={finalPatient.name} />
                        <ReadOnly label="Patient Address" value={finalPatient.address || "—"} />
                        <ReadOnly label="Telephone number" value={finalPatient.phone || "—"} />
                        <ReadOnly label="NIC No" value={finalPatient.nic || "—"} />
                        <ReadOnly label="MOH Area" value={finalPatient.mohArea || "—"} />
                        <ReadOnly label="Date of birth" value={finalPatient.dob} />
                        <ReadOnly label="Age" value={String(calcAge(finalPatient.dob))} />
                        <ReadOnly label="Sex" value={finalPatient.sex} />
                        <ReadOnly label="Ethnic group" value={finalPatient.ethnicGroup || "—"} />
                        <ReadOnly label="Religion" value={finalPatient.religion || "—"} />
                        <ReadOnly label="Occupation" value={finalPatient.occupation || "—"} />
                        <ReadOnly label="Marital Status" value={finalPatient.maritalStatus || "—"} />
                        <ReadOnly label="Date of admission" value={finalPatient.admissionDate || "—"} />
                        <ReadOnly label="Time of admission" value={finalPatient.admissionTime || "—"} />
                        <ReadOnly label="Ward number" value={finalPatient.wardNumber || "—"} />
                        <ReadOnly label="Consultant Name" value={finalPatient.consultantName || "—"} />
                      </div>
                    </section>

                    {/* ===== Guardian (DISPLAY ONLY) ===== */}
                    <section>
                      <h3 className="font-semibold mb-3">Information related to guardian</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <ReadOnly label="Name of guardian" value={extras?.guardian?.name || "—"} />
                        <ReadOnly label="Telephone number" value={extras?.guardian?.phone || "—"} />
                        <ReadOnly label="Address of Guardian" value={extras?.guardian?.address || "—"} />
                        <ReadOnly label="NIC No" value={extras?.guardian?.nic || "—"} />
                      </div>
                    </section>

                    {/* ===== Admission Medical Problem (DISPLAY ONLY) ===== */}
                    <section>
                      <h3 className="font-semibold mb-3">Admission medical problem related information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <ReadOnly label="Type of admission" value={extras?.admission?.admissionType || "—"} />
                        <ReadOnly label="Name of admitting officer" value={extras?.admission?.admittingOfficer || "—"} />
                        <ReadOnlyArea label="Complaints" value={extras?.admission?.complaints || "—"} />
                        <ReadOnlyArea label="Examination" value={extras?.admission?.examination || "—"} />
                        <ReadOnlyArea label="Allergies" value={extras?.admission?.allergies || "—"} />
                        <ReadOnlyArea label="Current medications" value={extras?.admission?.currentMedications || "—"} />
                        <ReadOnlyArea label="Problems" value={extras?.admission?.problems || "—"} />
                        <ReadOnlyArea label="Management" value={extras?.admission?.management || "—"} />
                        <ReadOnlyArea label="Stamps" value={extras?.admission?.stamps || "—"} />
                        <ReadOnly label="Is it a notifiable disease" value={(extras?.admission?.notifiableDisease ?? null) === null ? "—" : (extras?.admission?.notifiableDisease ? "YES" : "NO")} />
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "progress" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Doctor Name" value={author} onChange={(e) => setAuthor(e.target.value)} />
                      <div className="md:col-span-2">
                        <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Enter progress notes..." rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => addEntry("progress")} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">Add / Submit</button>
                    </div>
                    <div className="space-y-3">
                      {progressNotes.length === 0 && <p className="text-sm text-slate-500">No progress notes yet.</p>}
                      {progressNotes.map((n) => (
                        <div key={n.id} className="border rounded-lg p-3">
                          <div className="text-xs text-slate-500 flex gap-2"><span>Dr. {n.author}</span><span>•</span><span>{new Date(n.createdAt).toLocaleString()}</span></div>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Doctor Name" value={author} onChange={(e) => setAuthor(e.target.value)} />
                      <div className="md:col-span-2">
                        <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Enter medical history..." rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => addEntry("history")} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">Add / Submit</button>
                    </div>
                    <div className="space-y-3">
                      {medicalHistory.length === 0 && <p className="text-sm text-slate-500">No medical history entries yet.</p>}
                      {medicalHistory.map((n) => (
                        <div key={n.id} className="border rounded-lg p-3">
                          <div className="text-xs text-slate-500 flex gap-2"><span>Dr. {n.author}</span><span>•</span><span>{new Date(n.createdAt).toLocaleString()}</span></div>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "allergy" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Doctor Name" value={author} onChange={(e) => setAuthor(e.target.value)} />
                      <div className="md:col-span-2">
                        <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Enter allergic history..." rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => addEntry("allergy")} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">Add / Submit</button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
                        <Info className="w-4 h-4" />
                        <span className="text-sm">Allergy summary: <span className="opacity-70">— (to be auto-compiled)</span></span>
                      </div>
                      {allergicHistory.length === 0 && <p className="text-sm text-slate-500">No allergic history entries yet.</p>}
                      {allergicHistory.map((n) => (
                        <div key={n.id} className="border rounded-lg p-3">
                          <div className="text-xs text-slate-500 flex gap-2"><span>Dr. {n.author}</span><span>•</span><span>{new Date(n.createdAt).toLocaleString()}</span></div>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "investigations" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-3">
                      <select className="border rounded-lg px-3 py-2 text-sm" value={invCategory} onChange={(e) => setInvCategory(e.target.value as Entry["category"])}>
                        {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                      </select>
                      <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Doctor Name" value={author} onChange={(e) => setAuthor(e.target.value)} />
                      <div className="md:col-span-3">
                        <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Enter investigation details..." rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                      </div>
                      <div className="md:col-span-3 flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="file" multiple accept="image/*" className="hidden" onChange={onUploadImages} />
                          <span className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"><ImageIcon className="w-4 h-4" /> Upload Images</span>
                        </label>
                        {invImages.length > 0 && <span className="text-xs text-slate-500">{invImages.length} image(s) attached</span>}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={addInvestigation} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">Add / Submit</button>
                    </div>
                    <div className="space-y-3">
                      {investigations.filter(i => i.category === invCategory).length === 0 && (<p className="text-sm text-slate-500">No entries for {invCategory} yet.</p>)}
                      {investigations.filter(i => i.category === invCategory).map((n) => (
                        <div key={n.id} className="border rounded-lg p-3">
                          <div className="text-xs text-slate-500 flex gap-2"><span>{n.category}</span><span>•</span><span>Dr. {n.author}</span><span>•</span><span>{new Date(n.createdAt).toLocaleString()}</span></div>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{n.text}</p>
                          {n.images && n.images.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                              {n.images.map((img, i) => (
                                <a key={i} href={img.url} target="_blank" rel="noreferrer" className="block border rounded-lg overflow-hidden hover:opacity-90">
                                  <img src={img.url} alt={img.name} className="w-full h-28 object-cover" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "discharge" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><h3 className="font-semibold">Discharge Summary</h3></div>
                    <p className="text-sm text-slate-500">When the patient is being discharged, the summary will appear here.
                      You can also download past discharge summaries from the Admission Summary panel on the right.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: Admission Summary */}
            <aside className="w-full md:w-72 shrink-0">
              <div className="sticky top-24">
                <div className="bg-white border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Admission Summary</h3></div>
                  <div className="space-y-3">
                    {admissions.map((a) => (
                      <div key={a.id} className={`border rounded-lg p-3 ${a.isActive ? "border-blue-300 bg-blue-50" : ""}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-semibold">{a.number}</span>
                            <div><div className="text-sm font-medium">Admission</div><div className="text-xs text-slate-500">{a.admittedOn}</div></div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-xs ${a.hasDischargeSummary ? "text-green-600" : "text-slate-400"}`}>{a.hasDischargeSummary ? "Discharge Summary Available" : "No Discharge Summary"}</span>
                          {a.hasDischargeSummary && (
                            <button onClick={() => downloadDischargePDF(a)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border bg-white hover:bg-slate-50" title="Download PDF">
                              <Download className="w-3 h-3" /> PDF
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* ===== ADD NEW PATIENT MODAL ===== */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[95vw] max-w-5xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b bg-white rounded-t-2xl">
              <h3 className="text-base font-semibold">Add New Patient</h3>
              <button className="p-2 rounded-md hover:bg-slate-100" onClick={() => setShowAdd(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="p-5 space-y-8" onSubmit={handleCreate}>
              {/* ===== Admission data ===== */}
              <section>
                <h4 className="font-semibold mb-3">Admission data</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <Labeled label="BHT Number *" value={f.id} onChange={(v)=>setF({...f, id:v})} />
                  <Labeled label="Personal Health No (PHN)" value={f.phn} onChange={(v)=>setF({...f, phn:v})} />
                  <Labeled label="Patient Name *" value={f.name} onChange={(v)=>setF({...f, name:v})} />
                  <Labeled label="Patient Address" value={f.address} onChange={(v)=>setF({...f, address:v})} />
                  <Labeled label="Telephone number" value={f.phone} onChange={(v)=>setF({...f, phone:v})} />
                  <Labeled label="NIC No" value={f.nic} onChange={(v)=>setF({...f, nic:v})} />
                  <Labeled label="MOH Area" value={f.mohArea} onChange={(v)=>setF({...f, mohArea:v})} />
                  <Labeled label="Date of birth *" type="date" value={f.dob} onChange={(v)=>setF({...f, dob:v})} />
                  <Labeled label="Age (auto from DOB; editable)" value={String(f.dob ? calcAge(f.dob) : "")} onChange={() => { /* keep editable if needed */ }} />
                  <Select  label="Sex *" value={f.sex} onChange={(v)=>setF({...f, sex: v as Sex})} options={["Male","Female","Other"]} />
                  <Labeled label="Ethnic group" value={f.ethnicGroup} onChange={(v)=>setF({...f, ethnicGroup:v})} />
                  <Labeled label="Religion" value={f.religion} onChange={(v)=>setF({...f, religion:v})} />
                  <Labeled label="Occupation" value={f.occupation} onChange={(v)=>setF({...f, occupation:v})} />
                  <Labeled label="Marital Status" value={f.maritalStatus} onChange={(v)=>setF({...f, maritalStatus:v})} />
                  <Labeled label="Date of admission" type="date" value={f.admissionDate} onChange={(v)=>setF({...f, admissionDate:v})} />
                  <Labeled label="Time of admission" type="time" value={f.admissionTime} onChange={(v)=>setF({...f, admissionTime:v})} />
                  <Labeled label="Ward number" value={f.wardNumber} onChange={(v)=>setF({...f, wardNumber:v})} />
                  <Labeled label="Consultant Name" value={f.consultantName} onChange={(v)=>setF({...f, consultantName:v})} />
                </div>
              </section>

              {/* ===== Guardian ===== */}
              <section>
                <h4 className="font-semibold mb-3">Information related to guardian</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <Labeled label="Name of guardian" value={g.name} onChange={(v)=>setG({...g, name:v})} />
                  <Labeled label="Telephone number" value={g.phone} onChange={(v)=>setG({...g, phone:v})} />
                  <Labeled label="Address of Guardian" value={g.address} onChange={(v)=>setG({...g, address:v})} />
                  <Labeled label="NIC No" value={g.nic} onChange={(v)=>setG({...g, nic:v})} />
                </div>
              </section>

              {/* ===== Admission medical problem related information ===== */}
              <section>
                <h4 className="font-semibold mb-3">Admission medical problem related information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <Select
                    label="Type of admission"
                    value={aMed.admissionType || "Direct admission"}
                    onChange={(v)=>setAMed({...aMed, admissionType: v as AdmissionMedical["admissionType"]})}
                    options={["Direct admission","Referred from clinic","Referred from medical practitioner","Transfer from hospital"]}
                  />
                  <Labeled label="Name of admitting officer" value={aMed.admittingOfficer || ""} onChange={(v)=>setAMed({...aMed, admittingOfficer:v})} />
                  <Area label="Complaints" value={aMed.complaints} onChange={(v)=>setAMed({...aMed, complaints:v})} />
                  <Area label="Examination" value={aMed.examination} onChange={(v)=>setAMed({...aMed, examination:v})} />
                  <Area label="Allergies" value={aMed.allergies} onChange={(v)=>setAMed({...aMed, allergies:v})} />
                  <Area label="Current medications" value={aMed.currentMedications} onChange={(v)=>setAMed({...aMed, currentMedications:v})} />
                  <Area label="Problems" value={aMed.problems} onChange={(v)=>setAMed({...aMed, problems:v})} />
                  <Area label="Management" value={aMed.management} onChange={(v)=>setAMed({...aMed, management:v})} />
                  <Area label="Stamps" value={aMed.stamps} onChange={(v)=>setAMed({...aMed, stamps:v})} />
                </div>

                <div className="mt-2">
                  <p className="text-sm mb-2">Is it a notifiable disease:</p>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" name="notifiable" checked={aMed.notifiableDisease === true} onChange={()=>setAMed({...aMed, notifiableDisease:true})} />
                      <span>YES</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" name="notifiable" checked={aMed.notifiableDisease === false} onChange={()=>setAMed({...aMed, notifiableDisease:false})} />
                      <span>NO</span>
                    </label>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-50 text-sm" onClick={() => { setShowAdd(false); }}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
                  Create Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/** Small helpers */
const ReadOnly: React.FC<{label:string; value?: string;}> = ({label, value}) => (
  <div className="flex flex-col gap-1">
    <span className="text-slate-500">{label}</span>
    <div className="border rounded-lg px-3 py-2 text-sm bg-slate-50">{value ?? "—"}</div>
  </div>
);

const ReadOnlyArea: React.FC<{label:string; value?: string;}> = ({label, value}) => (
  <div className="md:col-span-1 flex flex-col gap-1">
    <span className="text-slate-500">{label}</span>
    <div className="border rounded-lg px-3 py-2 text-sm bg-slate-50 whitespace-pre-wrap min-h-12">{value ?? "—"}</div>
  </div>
);

const Labeled: React.FC<{label:string; value?: string; onChange:(v:string)=>void; type?: string;}> =
  ({label, value, onChange, type}) => (
  <label className="flex flex-col gap-1">
    <span className="text-slate-500">{label}</span>
    <input
      className="border rounded-lg px-3 py-2 text-sm"
      value={value ?? ""}
      onChange={(e)=>onChange(e.target.value)}
      type={type || "text"}
    />
  </label>
);

const Select: React.FC<{label:string; value:string; onChange:(v:string)=>void; options:string[];}> =
  ({label, value, onChange, options}) => (
  <label className="flex flex-col gap-1">
    <span className="text-slate-500">{label}</span>
    <select
      className="border rounded-lg px-3 py-2 text-sm bg-white"
      value={value}
      onChange={(e)=>onChange(e.target.value)}
    >
      {options.map((o)=> <option key={o} value={o}>{o}</option>)}
    </select>
  </label>
);

const Area: React.FC<{label:string; value?: string; onChange:(v:string)=>void;}> =
  ({label, value, onChange}) => (
  <label className="flex flex-col gap-1">
    <span className="text-slate-500">{label}</span>
    <textarea
      className="border rounded-lg px-3 py-2 text-sm min-h-24"
      value={value ?? ""}
      onChange={(e)=>onChange(e.target.value)}
      rows={3}
    />
  </label>
);

export default WardManagement;
