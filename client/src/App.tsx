import { useEffect, useMemo, useState } from "react";
import "./index.css";

// -------- Types (mirrors your backend DTOs) --------
type Sex = "MALE" | "FEMALE" | "OTHER" | string;

interface PatientDTO {
  phn: string;
  fullName: string;
  address: string;
  telephone: string;
  nic: string;
  mohArea: string;
  dateOfBirth: string;
  age: number | null;
  sex: Sex;
  ethnicGroup: string;
  religion: string;
  occupation: string;
  maritalStatus: string;
}

interface GuardianDTO {
  name: string;
  address: string;
  telephone: string;
  nic: string;
}

interface AdmissionClinicalDTO {
  typeOfAdmission: string;
  complaints: string;
  examination: string;
  allergies: string;
  currentMedications: string;
  problems: string;
  management: string;
  stamps: string;
  notifiableDisease: boolean;
  admittingOfficer: string;
}

interface AdmissionDTO {
  bht: string;
  dateOfAdmission: string;
  timeOfAdmission: string;
  wardNumber: string;
  consultantName: string;
  patient: PatientDTO;
  guardian: GuardianDTO;
  clinical: AdmissionClinicalDTO;
}

interface DoctorNoteDTO {
  id: number;
  authorName: string | null;
  text: string;
  createdAt: string; // ISO instant
}

// If you set VITE_API_BASE, we use it. Otherwise we rely on Vite proxy: "/api"
const API_BASE = (import.meta as any)?.env?.VITE_API_BASE ?? "";

// -------- UI helpers --------
function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
      <span className="text-slate-500">{icon}</span>
      {children}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>{children}</div>;
}

export default function App() {
  const [bht, setBht] = useState("RCU-0002");
  const [admission, setAdmission] = useState<AdmissionDTO | null>(null);
  const [notes, setNotes] = useState<DoctorNoteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // create-note form
  const [author, setAuthor] = useState("Dr. QA");
  const [text, setText] = useState("");

  const headers = useMemo(() => ({ "Content-Type": "application/json" }), []);

  async function loadAdmission(targetBht: string) {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ward/admissions/${encodeURIComponent(targetBht)}`);
      if (!res.ok) throw new Error(`Admission ${targetBht} not found`);
      const data: AdmissionDTO = await res.json();
      setAdmission(data);
    } catch (e: any) {
      setAdmission(null);
      setErr(e?.message ?? "Failed to load admission");
    } finally {
      setLoading(false);
    }
  }

  async function loadNotes(targetBht: string, page = 0, size = 5) {
    try {
      const res = await fetch(
        `${API_BASE}/api/ward/admissions/${encodeURIComponent(targetBht)}/notes?page=${page}&size=${size}`
      );
      if (!res.ok) throw new Error("Failed to load notes");
      const json = await res.json();
      const arr: DoctorNoteDTO[] = Array.isArray(json) ? json : json.value ?? [];
      setNotes(arr);
    } catch {
      // ignore for now; admission panel already shows main errors
    }
  }

  async function submitNote() {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/ward/admissions/${encodeURIComponent(bht)}/notes`, {
        method: "POST",
        headers,
        body: JSON.stringify({ authorName: author || null, text }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      setText("");
      await loadNotes(bht, 0, 5);
    } catch (e: any) {
      alert(e?.message ?? "Failed to save note");
    }
  }

  function search() {
    const t = bht.trim();
    if (!t) return;
    loadAdmission(t);
    loadNotes(t, 0, 5);
  }

  useEffect(() => {
    // initial quick demo load
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col bg-slate-900 text-white">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span aria-hidden>🩺</span>
            <span>Renal Unit</span>
          </div>
          <div className="text-xs text-white/60 mt-1">Ward Console</div>
        </div>

        <nav className="p-3 space-y-1 text-sm">
          <div className="px-3 py-2 rounded-lg bg-white/10">Ward</div>
          <div className="px-3 py-2 rounded-lg hover:bg-white/10 cursor-default">Transplant</div>
          <div className="px-3 py-2 rounded-lg hover:bg-white/10 cursor-default">Dialysis</div>
        </nav>

        <div className="mt-auto p-3 text-xs text-white/60">
          <div>v0.1 • dev</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-base sm:text-lg font-semibold text-slate-800">
              Ward — <span className="text-slate-500">{bht || "Search by BHT"}</span>
            </div>
            <div className="flex gap-2">
              <input
                value={bht}
                onChange={(e) => setBht(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Enter BHT (e.g., RCU-0001)"
                className="px-3 py-2 border border-slate-300 rounded-xl w-56 focus:outline-none focus:ring focus:ring-slate-200"
              />
              <button
                onClick={search}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 disabled:opacity-50"
              >
                Search
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {loading && <div className="text-sm text-slate-500">Loading…</div>}
          {err && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">{err}</div>
          )}

          {admission && (
            <section className="grid lg:grid-cols-3 gap-4">
              {/* Left: patient + clinical */}
              <div className="lg:col-span-2 space-y-4">
                {/* Patient card */}
                <Card>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <SectionTitle icon={<span>🆔</span>}>BHT</SectionTitle>
                        <div className="text-2xl font-bold mt-1">{admission.bht}</div>
                      </div>
                      <div className="text-right">
                        <SectionTitle icon={<span>🏥</span>}>Ward</SectionTitle>
                        <div className="text-xl font-semibold mt-1">{admission.wardNumber}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {admission.dateOfAdmission} · {admission.timeOfAdmission}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-slate-500">Consultant</div>
                        <div className="font-medium">{admission.consultantName}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">PHN</div>
                        <div className="font-medium">{admission.patient?.phn}</div>
                      </div>
                    </div>

                    <div className="mt-5 grid sm:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-1">
                        <SectionTitle icon={<span>👤</span>}>Patient</SectionTitle>
                        <div className="font-medium">{admission.patient?.fullName}</div>
                        <div className="text-slate-600">
                          {admission.patient?.sex} · {admission.patient?.age ?? "—"} yrs
                        </div>
                        <div className="text-slate-600">{admission.patient?.telephone}</div>
                        <div className="text-slate-600">{admission.patient?.address}</div>
                      </div>
                      <div className="space-y-1">
                        <SectionTitle icon={<span>👥</span>}>Guardian</SectionTitle>
                        <div className="font-medium">{admission.guardian?.name}</div>
                        <div className="text-slate-600">{admission.guardian?.telephone}</div>
                        <div className="text-slate-600">{admission.guardian?.address}</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Clinical summary */}
                <Card>
                  <div className="p-5 text-sm">
                    <SectionTitle icon={<span>🧾</span>}>Clinical Summary</SectionTitle>
                    <div className="mt-3 grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-500">Type of Admission</div>
                        <div className="font-medium">{admission.clinical?.typeOfAdmission}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Admitting Officer</div>
                        <div className="font-medium">{admission.clinical?.admittingOfficer}</div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-slate-500">Allergies</div>
                        <div>{admission.clinical?.allergies}</div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-slate-500">Complaints</div>
                        <div>{admission.clinical?.complaints}</div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-slate-500">Examination</div>
                        <div>{admission.clinical?.examination}</div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-slate-500">Problems</div>
                        <div>{admission.clinical?.problems}</div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-slate-500">Management</div>
                        <div>{admission.clinical?.management}</div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-slate-500">Current Medications</div>
                        <div>{admission.clinical?.currentMedications}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Notes column */}
              <div className="space-y-4">
                <Card>
                  <div className="p-5">
                    <div className="font-semibold mb-3">Add Doctor Note</div>
                    <div className="flex flex-col gap-2">
                      <input
                        className="px-3 py-2 border border-slate-300 rounded-xl"
                        placeholder="Author (optional)"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                      <textarea
                        className="px-3 py-2 border border-slate-300 rounded-xl min-h-[120px]"
                        placeholder="Write note…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                      <button
                        onClick={submitNote}
                        className="self-start px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 disabled:opacity-50"
                        disabled={!text.trim()}
                      >
                        Save note
                      </button>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-5">
                    <div className="font-semibold mb-3">Latest Notes</div>
                    <div className="space-y-3">
                      {notes.length === 0 && (
                        <div className="text-sm text-slate-500">No notes yet.</div>
                      )}
                      {notes.map((n) => (
                        <div key={n.id} className="p-3 border border-slate-200 rounded-xl">
                          <div className="text-xs text-slate-500">
                            {new Date(n.createdAt).toLocaleString()} — {n.authorName || "Unknown"}
                          </div>
                          <div className="mt-1 whitespace-pre-wrap">{n.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
