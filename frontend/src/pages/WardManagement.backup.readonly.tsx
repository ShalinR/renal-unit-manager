import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Download, FileText, Image as ImageIcon, Info, Loader2, Search } from "lucide-react";

/**
 * Ward Management Interface
 * - UI only (no backend yet). Patient search via ?bht=... (e.g., BHT-1001) in the URL or header search.
 * - Expanded "Patient Details" tab to include:
 *   • Demographics (BHT, PHN, Address, NIC, MOH area, etc.)
 *   • Guardian info
 *   • Admission medical problem info (incl. Notifiable Disease YES/NO, Admitting Officer)
 */

type Sex = "Male" | "Female" | "Other";
type Status = "Admitted" | "Discharged";

type Patient = {
  id: string;        // BHT Number
  name: string;
  dob: string;       // ISO date
  sex: Sex;
  status: Status;
  // Extended demographics
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
  notifiableDisease?: boolean; // YES | NO
  admittingOfficer?: string;   // Name of admitting officer
};

type Entry = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  // Investigations only
  category?: "Bio-Chemistry" | "Micro Biology" | "Histopathology" | "Procedure" | "Radiology";
  images?: { name: string; url: string }[];
};

type Admission = {
  id: string;
  number: number;
  admittedOn: string; // ISO
  hasDischargeSummary: boolean;
  isActive: boolean;
};

const categories: Entry["category"][] = [
  "Bio-Chemistry",
  "Micro Biology",
  "Histopathology",
  "Procedure",
  "Radiology",
];

function calcAge(dobISO: string): number {
  const dob = new Date(dobISO);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

function useQueryPatient(): { loading: boolean; patient: Patient | null } {
  const [search] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const bht = search.get("bht") || search.get("id");

  // Mock data until backend is wired
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
    if (!bht) {
      setPatient(null);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setPatient(mock[bht] ?? null);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [bht, mock]);

  return { loading, patient };
}

const WardManagement: React.FC = () => {
  const location = useLocation();
  const { loading, patient } = useQueryPatient();

  // Tabs
  type TabKey = "details" | "progress" | "history" | "allergy" | "investigations" | "discharge";
  const [activeTab, setActiveTab] = useState<TabKey>("details");

  // Entries by tab
  const [progressNotes, setProgressNotes] = useState<Entry[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<Entry[]>([]);
  const [allergicHistory, setAllergicHistory] = useState<Entry[]>([]);
  const [investigations, setInvestigations] = useState<Entry[]>([]);

  // Shared form state per tab
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  // Investigations extras
  const [invCategory, setInvCategory] = useState<Entry["category"]>("Bio-Chemistry");
  const [invImages, setInvImages] = useState<{ name: string; url: string }[]>([]);

  // RIGHT: Admissions panel
  const [admissions] = useState<Admission[]>([
    { id: "1", number: 3, admittedOn: "2025-02-02", hasDischargeSummary: true, isActive: true },
    { id: "2", number: 2, admittedOn: "2024-09-15", hasDischargeSummary: true, isActive: false },
    { id: "3", number: 1, admittedOn: "2023-12-01", hasDischargeSummary: false, isActive: false },
  ]);

  // =========================
  // Patient Details (UI state)
  // =========================
  const [demographics, setDemographics] = useState<Patient | null>(null);
  const [guardian, setGuardian] = useState<Guardian>({
    name: undefined,
    address: undefined,
    phone: undefined,
    nic: undefined,
  });
  const [admissionMed, setAdmissionMed] = useState<AdmissionMedical>({
    admissionType: undefined,
    complaints: "",
    examination: "",
    allergies: "",
    currentMedications: "",
    problems: "",
    management: "",
    stamps: "",
    notifiableDisease: undefined,
    admittingOfficer: "",
  });

  // Initialize / reset when patient changes
  useEffect(() => {
    if (!patient) {
      setDemographics(null);
      setGuardian({ name: undefined, address: undefined, phone: undefined, nic: undefined });
      setAdmissionMed({
        admissionType: undefined,
        complaints: "",
        examination: "",
        allergies: "",
        currentMedications: "",
        problems: "",
        management: "",
        stamps: "",
        notifiableDisease: undefined,
        admittingOfficer: "",
      });
      return;
    }
    setDemographics({ ...patient });
    // guardian + admissionMed left blank for now (no backend yet)
  }, [patient]);

  // Helpers
  const addEntry = (target: "progress" | "history" | "allergy") => {
    if (!author.trim() || !text.trim()) return;
    const entry: Entry = {
      id: crypto.randomUUID(),
      author: author.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    if (target === "progress") setProgressNotes((prev) => [entry, ...prev]);
    if (target === "history") setMedicalHistory((prev) => [entry, ...prev]);
    if (target === "allergy") setAllergicHistory((prev) => [entry, ...prev]);
    setText("");
  };

  const addInvestigation = () => {
    if (!author.trim() || !text.trim() || !invCategory) return;
    const entry: Entry = {
      id: crypto.randomUUID(),
      author: author.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      category: invCategory,
      images: invImages,
    };
    setInvestigations((prev) => [entry, ...prev]);
    setText("");
    setInvImages([]);
  };

  const onUploadImages: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const next: { name: string; url: string }[] = [];
    Array.from(files).forEach((f) => {
      const url = URL.createObjectURL(f);
      next.push({ name: f.name, url });
    });
    setInvImages((prev) => [...prev, ...next]);
    e.currentTarget.value = "";
  };

  const downloadDischargePDF = (admission: Admission) => {
    const filename = `${(patient?.name || "Patient").replace(/\s+/g, "_")}_${patient?.id || "BHT"}_${admission.admittedOn}_DischargeSummary.pdf`;
    const content = `Discharge Summary
Patient: ${patient?.name} (${patient?.id})
Admission Date: ${admission.admittedOn}
Status: ${admission.isActive ? "Active Admission" : "Past Admission"}

NOTE: Placeholder PDF. Backend PDF generation will replace this.`;
    const blob = new Blob([content], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // === RENDER ===
  return (
    <div className="flex w-full">
      {/* MAIN COLUMN */}
      <div className="flex-1 px-6 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-center">
            RENAL CARE UNIT - TEACHING HOSPITAL, PERADENIYA
          </h2>
        </div>

        {!patient && (
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

        {patient && (
          <div className="mt-4 bg-white rounded-xl border p-5">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Date of Birth</p>
                <p className="font-medium">{patient.dob}</p>
              </div>
              <div>
                <p className="text-slate-500">BHT Number</p>
                <p className="font-medium">{patient.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Age</p>
                <p className="font-medium">{calcAge(patient.dob)}</p>
              </div>
              <div>
                <p className="text-slate-500">Sex</p>
                <p className="font-medium">{patient.sex}</p>
              </div>
              <div>
                <p className="text-slate-500">Current Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    patient.status === "Admitted"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {patient.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {patient && (
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                      activeTab === t.key
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-3 bg-white border rounded-xl p-4">
                {activeTab === "details" && (
                  <div className="space-y-8">
                    {/* ===== Demographics ===== */}
                    <section>
                      <h3 className="font-semibold mb-3">Demographics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <Labeled value={demographics?.id} label="BHT Number" onChange={(v)=>setDemographics((d)=>d?{...d,id:v}:d)} />
                        <Labeled value={demographics?.phn} label="Personal Health No (PHN)" onChange={(v)=>setDemographics((d)=>d?{...d,phn:v}:d)} />
                        <Labeled value={demographics?.name} label="Patient Name" onChange={(v)=>setDemographics((d)=>d?{...d,name:v}:d)} />
                        <Labeled value={demographics?.address} label="Patient Address" onChange={(v)=>setDemographics((d)=>d?{...d,address:v}:d)} />
                        <Labeled value={demographics?.phone} label="Telephone number" onChange={(v)=>setDemographics((d)=>d?{...d,phone:v}:d)} />
                        <Labeled value={demographics?.nic} label="NIC No" onChange={(v)=>setDemographics((d)=>d?{...d,nic:v}:d)} />
                        <Labeled value={demographics?.mohArea} label="MOH Area" onChange={(v)=>setDemographics((d)=>d?{...d,mohArea:v}:d)} />
                        <Labeled value={demographics?.dob} label="Date of birth" onChange={(v)=>setDemographics((d)=>d?{...d,dob:v}:d)} type="date" />
                        <ReadOnly label="Age" value={demographics?.dob ? String(calcAge(demographics.dob)) : "—"} />
                        <Select
                          label="Sex"
                          value={demographics?.sex || ""}
                          onChange={(v)=>setDemographics((d)=>d?{...d,sex: v as Sex}:d)}
                          options={["Male","Female","Other"]}
                        />
                        <Labeled value={demographics?.ethnicGroup} label="Ethnic group" onChange={(v)=>setDemographics((d)=>d?{...d,ethnicGroup:v}:d)} />
                        <Labeled value={demographics?.religion} label="Religion" onChange={(v)=>setDemographics((d)=>d?{...d,religion:v}:d)} />
                        <Labeled value={demographics?.occupation} label="Occupation" onChange={(v)=>setDemographics((d)=>d?{...d,occupation:v}:d)} />
                        <Labeled value={demographics?.maritalStatus} label="Marital Status" onChange={(v)=>setDemographics((d)=>d?{...d,maritalStatus:v}:d)} />
                        <Labeled value={demographics?.admissionDate} label="Date of admission" onChange={(v)=>setDemographics((d)=>d?{...d,admissionDate:v}:d)} type="date" />
                        <Labeled value={demographics?.admissionTime} label="Time of admission" onChange={(v)=>setDemographics((d)=>d?{...d,admissionTime:v}:d)} type="time" />
                        <Labeled value={demographics?.wardNumber} label="Ward number" onChange={(v)=>setDemographics((d)=>d?{...d,wardNumber:v}:d)} />
                        <Labeled value={demographics?.consultantName} label="Consultant Name" onChange={(v)=>setDemographics((d)=>d?{...d,consultantName:v}:d)} />
                      </div>
                    </section>

                    {/* ===== Guardian Information ===== */}
                    <section>
                      <h3 className="font-semibold mb-3">Information related to guardian</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <Labeled value={guardian.name} label="Name of guardian" onChange={(v)=>setGuardian((g)=>({...g, name:v}))} />
                        <Labeled value={guardian.phone} label="Telephone number" onChange={(v)=>setGuardian((g)=>({...g, phone:v}))} />
                        <Labeled value={guardian.address} label="Address of Guardian" onChange={(v)=>setGuardian((g)=>({...g, address:v}))} />
                        <Labeled value={guardian.nic} label="NIC No" onChange={(v)=>setGuardian((g)=>({...g, nic:v}))} />
                      </div>
                    </section>

                    {/* ===== Admission Medical Problem Info ===== */}
                    <section>
                      <h3 className="font-semibold mb-3">Admission medical problem related information</h3>

                      {/* Admission type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <Select
                          label="Type of admission"
                          value={admissionMed.admissionType || ""}
                          onChange={(v)=>setAdmissionMed((a)=>({...a, admissionType: v as AdmissionMedical["admissionType"]}))}
                          options={[
                            "Direct admission",
                            "Referred from clinic",
                            "Referred from medical practitioner",
                            "Transfer from hospital",
                          ]}
                        />
                        <Labeled
                          value={admissionMed.admittingOfficer}
                          label="Name of admitting officer"
                          onChange={(v)=>setAdmissionMed((a)=>({...a, admittingOfficer:v}))}
                        />
                      </div>

                      {/* Text areas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <Area label="Complaints" value={admissionMed.complaints} onChange={(v)=>setAdmissionMed((a)=>({...a, complaints:v}))} />
                        <Area label="Examination" value={admissionMed.examination} onChange={(v)=>setAdmissionMed((a)=>({...a, examination:v}))} />
                        <Area label="Allergies" value={admissionMed.allergies} onChange={(v)=>setAdmissionMed((a)=>({...a, allergies:v}))} />
                        <Area label="Current medications" value={admissionMed.currentMedications} onChange={(v)=>setAdmissionMed((a)=>({...a, currentMedications:v}))} />
                        <Area label="Problems" value={admissionMed.problems} onChange={(v)=>setAdmissionMed((a)=>({...a, problems:v}))} />
                        <Area label="Management" value={admissionMed.management} onChange={(v)=>setAdmissionMed((a)=>({...a, management:v}))} />
                        <Area label="Stamps" value={admissionMed.stamps} onChange={(v)=>setAdmissionMed((a)=>({...a, stamps:v}))} />
                      </div>

                      {/* Notifiable disease toggle */}
                      <div className="mt-3">
                        <p className="text-sm mb-2">Is it a notifiable disease:</p>
                        <div className="flex items-center gap-4">
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="notifiable"
                              checked={admissionMed.notifiableDisease === true}
                              onChange={()=>setAdmissionMed((a)=>({...a, notifiableDisease:true}))}
                            />
                            <span>YES</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="notifiable"
                              checked={admissionMed.notifiableDisease === false}
                              onChange={()=>setAdmissionMed((a)=>({...a, notifiableDisease:false}))}
                            />
                            <span>NO</span>
                          </label>
                        </div>
                      </div>

                      {/* Local-only save */}
                      <div className="mt-4 flex justify-end">
                        <button
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                          onClick={()=>alert("Saved locally (UI only). Backend wiring will persist this later.")}
                        >
                          Save (Local)
                        </button>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "progress" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        placeholder="Doctor Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                      <div className="md:col-span-2">
                        <textarea
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Enter progress notes..."
                          rows={3}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => addEntry("progress")}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                      >
                        Add / Submit
                      </button>
                    </div>

                    <div className="space-y-3">
                      {progressNotes.length === 0 && (
                        <p className="text-sm text-slate-500">No progress notes yet.</p>
                      )}
                      {progressNotes.map((n) => (
                        <div key={n.id} className="border rounded-lg p-3">
                          <div className="text-xs text-slate-500 flex gap-2">
                            <span>Dr. {n.author}</span>
                            <span>•</span>
                            <span>{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        placeholder="Doctor Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                      <div className="md:col-span-2">
                        <textarea
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Enter medical history..."
                          rows={3}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => addEntry("history")}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                      >
                        Add / Submit
                      </button>
                    </div>

                    <div className="space-y-3">
                      {medicalHistory.length === 0 && (
                        <p className="text-sm text-slate-500">No medical history entries yet.</p>
                      )}
                      {medicalHistory.map((n) => (
                        <div key={n.id} className="border rounded-lg p-3">
                          <div className="text-xs text-slate-500 flex gap-2">
                            <span>Dr. {n.author}</span>
                            <span>•</span>
                            <span>{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "allergy" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        placeholder="Doctor Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                      <div className="md:col-span-2">
                        <textarea
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Enter allergic history..."
                          rows={3}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => addEntry("allergy")}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                      >
                        Add / Submit
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
                        <Info className="w-4 h-4" />
                        <span className="text-sm">
                          Allergy summary: <span className="opacity-70">— (to be auto-compiled)</span>
                        </span>
                      </div>

                      {allergicHistory.length === 0 && (
                        <p className="text-sm text-slate-500">No allergic history entries yet.</p>
                      )}
                      {allergicHistory.map((n) => (
                        <div key={n.id} className="border rounded-lg p-3">
                          <div className="text-xs text-slate-500 flex gap-2">
                            <span>Dr. {n.author}</span>
                            <span>•</span>
                            <span>{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "investigations" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-3">
                      <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={invCategory}
                        onChange={(e) => setInvCategory(e.target.value as Entry["category"])}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        placeholder="Doctor Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                      <div className="md:col-span-3">
                        <textarea
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Enter investigation details..."
                          rows={3}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-3 flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="file" multiple accept="image/*" className="hidden" onChange={onUploadImages} />
                          <span className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm">
                            <ImageIcon className="w-4 h-4" /> Upload Images
                          </span>
                        </label>
                        {invImages.length > 0 && (
                          <span className="text-xs text-slate-500">
                            {invImages.length} image(s) attached
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={addInvestigation}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                      >
                        Add / Submit
                      </button>
                    </div>

                    <div className="space-y-3">
                      {investigations.filter(i => i.category === invCategory).length === 0 && (
                        <p className="text-sm text-slate-500">No entries for {invCategory} yet.</p>
                      )}
                      {investigations
                        .filter(i => i.category === invCategory)
                        .map((n) => (
                          <div key={n.id} className="border rounded-lg p-3">
                            <div className="text-xs text-slate-500 flex gap-2">
                              <span>{n.category}</span>
                              <span>•</span>
                              <span>Dr. {n.author}</span>
                              <span>•</span>
                              <span>{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="mt-1 text-sm whitespace-pre-wrap">{n.text}</p>

                            {n.images && n.images.length > 0 && (
                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                                {n.images.map((img, idx) => (
                                  <a key={idx} href={img.url} target="_blank" rel="noreferrer"
                                     className="block border rounded-lg overflow-hidden hover:opacity-90">
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
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <h3 className="font-semibold">Discharge Summary</h3>
                    </div>
                    <p className="text-sm text-slate-500">
                      When the patient is being discharged, the summary will appear here.
                      You can also download past discharge summaries from the Admission Summary panel on the right.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: Admission Summary */}
            <aside className="w-full md:w-72 shrink-0">
              <div className="sticky top-24">
                <div className="bg-white border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Admission Summary</h3>
                  </div>

                  <div className="space-y-3">
                    {admissions.map((a) => (
                      <div key={a.id} className={`border rounded-lg p-3 ${a.isActive ? "border-blue-300 bg-blue-50" : ""}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-semibold">
                              {a.number}
                            </span>
                            <div>
                              <div className="text-sm font-medium">Admission</div>
                              <div className="text-xs text-slate-500">{a.admittedOn}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-xs ${a.hasDischargeSummary ? "text-green-600" : "text-slate-400"}`}>
                            {a.hasDischargeSummary ? "Discharge Summary Available" : "No Discharge Summary"}
                          </span>
                          {a.hasDischargeSummary && (
                            <button
                              onClick={() => downloadDischargePDF(a)}
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border bg-white hover:bg-slate-50"
                              title="Download PDF"
                            >
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
    </div>
  );
};

/** Small UI helpers (kept inline to avoid new files) */
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

const ReadOnly: React.FC<{label:string; value?: string;}> = ({label, value}) => (
  <div className="flex flex-col gap-1">
    <span className="text-slate-500">{label}</span>
    <div className="border rounded-lg px-3 py-2 text-sm bg-slate-50">{value ?? "—"}</div>
  </div>
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
      <option value="" disabled>— Select —</option>
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
