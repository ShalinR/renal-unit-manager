import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Plus, Trash2, TestTube } from "lucide-react";

interface AdequacyTestProps {
  adequacyResults: {
    first: { date: string; data: any };
    second: { date: string; data: any };
    third: { date: string; data: any };
  };
  onUpdate: (results: any) => void;
}

interface AdequacyData {
  date: string;
  patientName: string;
  bodyWeight: string;            // kg
  dialysateUreaVolume: string;   // L
  urineUreaVolume: string;       // L
  bloodUrea: string;             // mg/dL
  peritonealKtV: string;
  renalKtV: string;
  totalKtV: string;
  vValue: string;                // L
  isAdequate: boolean | null;
}

type AdequacyEntry = {
  id: string;
  label: string;     // "Test 1", "Test 2", ...
  payload: AdequacyData;
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const emptyAdequacy = (): AdequacyData => ({
  date: "",
  patientName: "",
  bodyWeight: "",
  dialysateUreaVolume: "",
  urineUreaVolume: "",
  bloodUrea: "",
  peritonealKtV: "",
  renalKtV: "",
  totalKtV: "",
  vValue: "",
  isAdequate: null,
});

// seed from legacy props (first/second/third)
function fromPropsToEntries(seed: AdequacyTestProps["adequacyResults"]): AdequacyEntry[] {
  const seeds = [seed.first, seed.second, seed.third].filter(Boolean);
  const entries: AdequacyEntry[] = [];
  seeds.forEach((s, i) => {
    if (!s) return;
    const payload: AdequacyData =
      s.data && typeof s.data === "object"
        ? { ...emptyAdequacy(), ...s.data }
        : { ...emptyAdequacy(), date: s.date || "" };
    const hasAny =
      payload.patientName ||
      payload.date ||
      payload.bodyWeight ||
      payload.dialysateUreaVolume ||
      payload.urineUreaVolume ||
      payload.bloodUrea;
    if (hasAny) {
      entries.push({ id: `seed-${i}`, label: `Test ${entries.length + 1}`, payload });
    }
  });
  return entries;
}

// map back to legacy (first/second/third)
function toLegacyShape(entries: AdequacyEntry[]) {
  const a = entries || [];
  const pack = (idx: number) =>
    a[idx] ? { date: a[idx].payload.date, data: a[idx].payload } : { date: "", data: null };
  return { first: pack(0), second: pack(1), third: pack(2) };
}

// ---- pure calculator (no state writes) ----
function computeDerived(payload: AdequacyData): AdequacyData {
  const d = { ...payload };

  const bw = parseFloat(d.bodyWeight);
  const dialUrea = parseFloat(d.dialysateUreaVolume);
  const uriUrea = parseFloat(d.urineUreaVolume);
  const blood = parseFloat(d.bloodUrea);

  // V = BW * 0.58
  if (Number.isFinite(bw) && bw > 0) {
    const v = bw * 0.58;
    d.vValue = v.toFixed(2);

    let peritoneal = d.peritonealKtV ? parseFloat(d.peritonealKtV) : NaN;
    let renal = d.renalKtV ? parseFloat(d.renalKtV) : NaN;

    if (Number.isFinite(dialUrea) && Number.isFinite(blood) && blood > 0) {
      peritoneal = (dialUrea / blood) * dialUrea * 7 / v;
    }
    if (Number.isFinite(uriUrea) && Number.isFinite(blood) && blood > 0) {
      renal = (uriUrea / blood) * uriUrea * 7 / v;
    }

    d.peritonealKtV = Number.isFinite(peritoneal) ? peritoneal.toFixed(3) : "";
    d.renalKtV = Number.isFinite(renal) ? renal.toFixed(3) : "";
    const total =
      (Number.isFinite(peritoneal) ? peritoneal : 0) +
      (Number.isFinite(renal) ? renal : 0);
    d.totalKtV = total ? total.toFixed(3) : "";
  } else {
    // if BW invalid, clear deriveds
    d.vValue = "";
    d.peritonealKtV = d.peritonealKtV && !isNaN(parseFloat(d.peritonealKtV)) ? d.peritonealKtV : "";
    d.renalKtV = d.renalKtV && !isNaN(parseFloat(d.renalKtV)) ? d.renalKtV : "";
    d.totalKtV = "";
  }

  return d;
}

export default function AdequacyTest({ adequacyResults, onUpdate }: AdequacyTestProps) {
  const [tests, setTests] = useState<AdequacyEntry[]>(() => {
    const seeded = fromPropsToEntries(adequacyResults);
    // compute derived for any seeded payloads
    return seeded.map((e) => ({ ...e, payload: computeDerived(e.payload) }));
  });

  const [activeId, setActiveId] = useState<string | null>(() => tests[0]?.id ?? null);

  // keep parent synced
  useEffect(() => {
    onUpdate(toLegacyShape(tests));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests]);

  // ---------- Add/Remove/Select ----------
  const nextLabel = useMemo(() => `Test ${tests.length + 1}`, [tests.length]);

  const addTest = () => {
    const entry: AdequacyEntry = { id: uid(), label: nextLabel, payload: emptyAdequacy() };
    const next = [...tests, entry];
    next.forEach((e, i) => (e.label = `Test ${i + 1}`));
    setTests(next);
    setActiveId(entry.id);
  };

  const removeTest = (id: string) => {
    const next = tests.filter(t => t.id !== id);
    next.forEach((e, i) => (e.label = `Test ${i + 1}`));
    setTests(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null); // stay on this page
  };

  // update + auto-recalc in one shot (prevents extra rerenders/loops)
  const updatePayload = <K extends keyof AdequacyData>(id: string, key: K, value: AdequacyData[K]) => {
    setTests(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const nextPayload = computeDerived({ ...t.payload, [key]: value });
        return { ...t, payload: nextPayload };
      })
    );
  };

  const active = tests.find(t => t.id === activeId) || null;

  return (
    <div className="space-y-6">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Adequacy Test Results </h3>
        </div>
        <Button type="button" onClick={addTest}>
          <Plus className="w-4 h-4 mr-2" />
          Add Adequacy Test
        </Button>
      </div>

      {/* Selector chips */}
      {tests.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tests.map(t => (
            <Button
              key={t.id}
              type="button"
              size="sm"
              variant={t.id === activeId ? "default" : "default"}
              onClick={() => setActiveId(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No adequacy tests yet. Click <span className="font-medium">Add Adequacy Test</span> to begin.
          </CardContent>
        </Card>
      )}

      {/* Active form */}
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
            {/* Patient + Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Insertion Done by</Label>
                <Input
                  value={active.payload.patientName}
                  onChange={(e) => updatePayload(active.id, "patientName", e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label>Test Date</Label>
                <Input
                  type="date"
                  value={active.payload.date}
                  onChange={(e) => updatePayload(active.id, "date", e.target.value)}
                />
              </div>
            </div>

            {/* BW + Volumes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Body Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={active.payload.bodyWeight}
                  onChange={(e) => updatePayload(active.id, "bodyWeight", e.target.value)}
                  placeholder="Enter weight"
                />
              </div>
              <div className="space-y-2">
                <Label>Dialysate Urea Volume (L)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={active.payload.dialysateUreaVolume}
                  onChange={(e) => updatePayload(active.id, "dialysateUreaVolume", e.target.value)}
                  placeholder="Enter volume"
                />
              </div>
              <div className="space-y-2">
                <Label>Urine Urea Volume (L)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={active.payload.urineUreaVolume}
                  onChange={(e) => updatePayload(active.id, "urineUreaVolume", e.target.value)}
                  placeholder="Enter volume"
                />
              </div>
            </div>

            {/* Blood Urea */}
            <div className="space-y-2">
              <Label>Blood Urea (mg/dL)</Label>
              <Input
                type="number"
                step="0.1"
                value={active.payload.bloodUrea}
                onChange={(e) => updatePayload(active.id, "bloodUrea", e.target.value)}
                placeholder="Enter blood urea level"
              />
            </div>

            {/* Calculations (auto-updated) */}
            <Card className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Calculations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-semibold">V Value</Label>
                      <p className="text-xs text-muted-foreground mb-1">V = Body weight (Kg) Ã— 0.58</p>
                      <Badge variant="secondary" className="text-sm">
                        {active.payload.vValue ? `${active.payload.vValue} L` : "Not calculated"}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Peritoneal Kt/V</Label>
                      <p className="text-xs text-muted-foreground mb-1">
                        (Dialysate urea / Blood urea) Ã— Dialysate volume Ã— 7 / V
                      </p>
                      <Badge variant="secondary" className="text-sm">
                        {active.payload.peritonealKtV || "Not calculated"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-semibold">Renal Kt/V</Label>
                      <p className="text-xs text-muted-foreground mb-1">
                        (Urine urea / Blood urea) Ã— Urine volume Ã— 7 / V
                      </p>
                      <Badge variant="secondary" className="text-sm">
                        {active.payload.renalKtV || "Not calculated"}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Total Kt/V</Label>
                      <p className="text-xs text-muted-foreground mb-1">Renal Kt/V + Peritoneal Kt/V</p>
                      <Badge
                        variant={
                          active.payload.totalKtV && Number(active.payload.totalKtV) >= 1.7
                            ? "default"
                            : "destructive"
                        }
                        className="text-sm"
                      >
                        {active.payload.totalKtV || "Not calculated"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Adequacy toggle (manual, unchanged) */}
                <div className="pt-4 border-t">
                  <Label className="text-sm font-semibold">CAPD Adequacy Assessment</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      type="button"
                      variant={active.payload.isAdequate === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTests(prev => prev.map(
                        x => x.id === active.id ? { ...x, payload: { ...x.payload, isAdequate: true } } : x
                      ))}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Adequate
                    </Button>
                    <Button
                      type="button"
                      variant={active.payload.isAdequate === false ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setTests(prev => prev.map(
                        x => x.id === active.id ? { ...x, payload: { ...x.payload, isAdequate: false } } : x
                      ))}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Not Adequate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Target Total Kt/V should be â‰¥ 1.7 for adequate dialysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

