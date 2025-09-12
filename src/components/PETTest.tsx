import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Calculator, Plus, Trash2 } from "lucide-react";

interface PETTestProps {
  petResults: {
    first: { date: string; data: any };
    second: { date: string; data: any };
    third: { date: string; data: any };
  };
  onUpdate: (results: any) => void; // legacy shape from CAPDSummary
}

interface PETData {
  date: string;
  measurements: {
    t0: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
    t1: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
    t2: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
    t3: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
    t4: { dialysateCreatinine: string; dialysateGlucose: string; serumCreatinine: string };
  };
  // auto-filled
  dpCreatinine: string;
  dd0Glucose: string;
  creatinineClassification: string;
  glucoseClassification: string;
}

type PETEntry = {
  id: string;
  label: string;   // "Test 1", "Test 2", ...
  payload: PETData;
};

const timePoints = [
  { key: "t0", label: "T0", showSerum: true },
  { key: "t1", label: "T1", showSerum: true },
  { key: "t2", label: "T2", showSerum: true },
  { key: "t3", label: "T3", showSerum: false },
  { key: "t4", label: "T4", showSerum: false }
] as const;

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const emptyPET = (): PETData => ({
  date: "",
  measurements: {
    t0: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
    t1: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
    t2: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
    t3: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
    t4: { dialysateCreatinine: "", dialysateGlucose: "", serumCreatinine: "" },
  },
  dpCreatinine: "",
  dd0Glucose: "",
  creatinineClassification: "",
  glucoseClassification: "",
});

// ---- Auto-classification per your ranges ----
const classifyCreatinine = (dp: number): string => {
  if (!Number.isFinite(dp)) return "";
  if (dp > 0.81) return "High Transporter";
  if (dp >= 0.65 && dp <= 0.81) return "High Average Transporter";
  if (dp >= 0.50 && dp <= 0.64) return "Low Average Transporter";
  if (dp < 0.50) return "Low Transporter";
  return "";
};

const classifyGlucose = (dd0: number): string => {
  if (!Number.isFinite(dd0)) return "";
  if (dd0 < 0.26) return "High Transporter";
  if (dd0 >= 0.26 && dd0 <= 0.38) return "High Average Transporter";
  if (dd0 >= 0.39 && dd0 <= 0.49) return "Low Average Transporter";
  if (dd0 > 0.49) return "Low Transporter";
  return "";
};

// Seed from legacy props (if prior data exists)
function fromPropsToEntries(petResults: PETTestProps["petResults"]): PETEntry[] {
  const seeds = [petResults.first, petResults.second, petResults.third].filter(Boolean);
  const entries: PETEntry[] = [];
  seeds.forEach((seed, i) => {
    if (!seed) return;
    const payload: PETData =
      seed.data && typeof seed.data === "object"
        ? { ...emptyPET(), ...seed.data } // keep old payload if present
        : { ...emptyPET(), date: seed.date || "" };
    const hasAny =
      payload.date ||
      Object.values(payload.measurements).some(
        (tp: any) =>
          tp.dialysateCreatinine || tp.dialysateGlucose || tp.serumCreatinine
      );
    if (hasAny) {
      entries.push({ id: `seed-${i}`, label: `Test ${entries.length + 1}`, payload });
    }
  });
  return entries;
}

// Map dynamic list -> legacy shape (first/second/third)
function toLegacyShape(entries: PETEntry[]) {
  const a = entries || [];
  const pack = (idx: number) =>
    a[idx]
      ? { date: a[idx].payload.date, data: a[idx].payload }
      : { date: "", data: null };
  return { first: pack(0), second: pack(1), third: pack(2) };
}

export default function PETTest({ petResults, onUpdate }: PETTestProps) {
  const [tests, setTests] = useState<PETEntry[]>(() => fromPropsToEntries(petResults));
  const [activeId, setActiveId] = useState<string | null>(tests[0]?.id ?? null);

  // keep parent in sync when list changes
  useEffect(() => {
    onUpdate(toLegacyShape(tests));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests]);

  // ---------- Add/Remove/Select ----------
  const nextLabel = useMemo(() => `Test ${tests.length + 1}`, [tests.length]);

  const addTest = () => {
    const entry: PETEntry = { id: uid(), label: nextLabel, payload: emptyPET() };
    const next = [...tests, entry];
    next.forEach((e, i) => (e.label = `Test ${i + 1}`));
    setTests(next);
    setActiveId(entry.id);
  };

  const removeTest = (id: string) => {
    const next = tests.filter(t => t.id !== id);
    next.forEach((e, i) => (e.label = `Test ${i + 1}`));
    setTests(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  };

  const updatePayload = <K extends keyof PETData>(id: string, key: K, value: PETData[K]) => {
    setTests(prev =>
      prev.map(t => (t.id === id ? { ...t, payload: { ...t.payload, [key]: value } } : t))
    );
  };

  const updateMeasurement = (
    id: string,
    timeKey: keyof PETData["measurements"],
    field: keyof PETData["measurements"]["t0"],
    value: string
  ) => {
    setTests(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              payload: {
                ...t.payload,
                measurements: {
                  ...t.payload.measurements,
                  [timeKey]: {
                    ...t.payload.measurements[timeKey],
                    [field]: value,
                  },
                },
              },
            }
          : t
      )
    );
  };

  // ---------- Calculate + Auto-classify ----------
  const calculateRatios = (id: string) => {
    const t = tests.find(x => x.id === id);
    if (!t) return;
    const m = t.payload.measurements;

    const t0Serum = parseFloat(m.t0.serumCreatinine);
    const t4DialC = parseFloat(m.t4.dialysateCreatinine);
    const t0DialG = parseFloat(m.t0.dialysateGlucose);
    const t4DialG = parseFloat(m.t4.dialysateGlucose);

    const dp = Number.isFinite(t0Serum) && t0Serum > 0 && Number.isFinite(t4DialC) ? t4DialC / t0Serum : NaN;
    const dd0 = Number.isFinite(t0DialG) && t0DialG > 0 && Number.isFinite(t4DialG) ? t4DialG / t0DialG : NaN;

    const dpStr = Number.isFinite(dp) ? dp.toFixed(3) : "";
    const dd0Str = Number.isFinite(dd0) ? dd0.toFixed(3) : "";

    const crClass = Number.isFinite(dp) ? classifyCreatinine(dp) : "";
    const glClass = Number.isFinite(dd0) ? classifyGlucose(dd0) : "";

    setTests(prev =>
      prev.map(x =>
        x.id === id
          ? {
              ...x,
              payload: {
                ...x.payload,
                dpCreatinine: dpStr,
                dd0Glucose: dd0Str,
                creatinineClassification: crClass,
                glucoseClassification: glClass,
              },
            }
          : x
      )
    );
  };

  const active = tests.find(t => t.id === activeId) || null;

  return (
    <div className="space-y-6">
      {/* Header + KEEP THIS BUTTON UNCHANGED */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Peritoneal Equilibration Tests</h3>
        </div>
        <Button type="button" onClick={addTest}>
          <Plus className="w-4 h-4 mr-2" />
          Add PET Test
        </Button>
      </div>

      {/* Test selector chips */}
      {tests.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tests.map((t) => (
            <Button
              key={t.id}
              type="button"
              size="sm"
              variant={t.id === activeId ? "default" : "outline"}
              onClick={() => setActiveId(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No PET tests yet. Click <span className="font-medium">Add PET Test</span> to begin.
          </CardContent>
        </Card>
      )}

      {/* Active test form */}
      {active && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-primary" />
              {active.label}
            </CardTitle>
            <Button type="button" variant="destructive" size="sm" onClick={() => removeTest(active.id)}>
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Test Date</Label>
              <Input
                type="date"
                value={active.payload.date}
                onChange={(e) => updatePayload(active.id, "date", e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left">Time</th>
                    <th className="border border-border p-2 text-left">Dialysate Creatinine</th>
                    <th className="border border-border p-2 text-left">Dialysate Glucose</th>
                    <th className="border border-border p-2 text-left">Serum Creatinine</th>
                  </tr>
                </thead>
                <tbody>
                  {timePoints.map((tp) => (
                    <tr key={tp.key}>
                      <td className="border border-border p-2 font-medium">{tp.label}</td>
                      <td className="border border-border p-2">
                        <Input
                          placeholder="mg/dL"
                          value={active.payload.measurements[tp.key].dialysateCreatinine}
                          onChange={(e) =>
                            updateMeasurement(active.id, tp.key, "dialysateCreatinine", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-border p-2">
                        <Input
                          placeholder="mg/dL"
                          value={active.payload.measurements[tp.key].dialysateGlucose}
                          onChange={(e) =>
                            updateMeasurement(active.id, tp.key, "dialysateGlucose", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-border p-2">
                        {tp.showSerum ? (
                          <Input
                            placeholder="mg/dL"
                            value={active.payload.measurements[tp.key].serumCreatinine}
                            onChange={(e) =>
                              updateMeasurement(active.id, tp.key, "serumCreatinine", e.target.value)
                            }
                          />
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button type="button" onClick={() => calculateRatios(active.id)} className="w-full" variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Ratios
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Creatinine Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>D/P Creatinine = Dialysate creatinine (T4) / Serum creatinine (T0)</Label>
                    <div className="mt-1">
                      <Badge variant={active.payload.dpCreatinine ? "default" : "secondary"}>
                        {active.payload.dpCreatinine || "Not calculated"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Classification</Label>
                    <div>
                      <Badge variant={active.payload.creatinineClassification ? "default" : "secondary"}>
                        {active.payload.creatinineClassification || "—"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Glucose Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>D/D0 Glucose = Dialysate glucose (T4) / Dialysate glucose (T0)</Label>
                    <div className="mt-1">
                      <Badge variant={active.payload.dd0Glucose ? "default" : "secondary"}>
                        {active.payload.dd0Glucose || "Not calculated"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Classification</Label>
                    <div>
                      <Badge variant={active.payload.glucoseClassification ? "default" : "secondary"}>
                        {active.payload.glucoseClassification || "—"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
