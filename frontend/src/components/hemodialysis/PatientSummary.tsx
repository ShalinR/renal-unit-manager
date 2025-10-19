import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { formatDateDisplay } from '@/lib/dateUtils';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface RecordItem {
  date: string; // ISO date
  preWeight: number;
  postWeight: number;
  systolic: number;
  diastolic: number;
  bloodFlowRate: number;
}

const mockHistory: Record<string, RecordItem[]> = {
  'John Doe': [
    { date: '2025-09-01', preWeight: 72.1, postWeight: 70.5, systolic: 128, diastolic: 80, bloodFlowRate: 350 },
    { date: '2025-09-08', preWeight: 72.5, postWeight: 70.8, systolic: 130, diastolic: 82, bloodFlowRate: 350 },
    { date: '2025-09-15', preWeight: 71.8, postWeight: 70.0, systolic: 125, diastolic: 79, bloodFlowRate: 360 },
    { date: '2025-09-22', preWeight: 72.0, postWeight: 70.2, systolic: 127, diastolic: 80, bloodFlowRate: 355 },
    { date: '2025-09-29', preWeight: 71.6, postWeight: 69.9, systolic: 124, diastolic: 78, bloodFlowRate: 350 },
  ],
  'Kamal Perera': [
    { date: '2025-09-02', preWeight: 68.2, postWeight: 66.3, systolic: 120, diastolic: 76, bloodFlowRate: 340 },
    { date: '2025-09-09', preWeight: 68.5, postWeight: 66.6, systolic: 122, diastolic: 78, bloodFlowRate: 340 },
  ],
};

export const PatientSummary: React.FC = () => {
  // Hardcode to John Doe only
  const patient = 'John Doe';
  const history = useMemo(() => mockHistory[patient] ?? [], [patient]);

  const weightSeries = history.map(h => ({ date: formatDateDisplay(h.date), pre: h.preWeight, post: h.postWeight }));
  const systolicSeries = history.map(h => ({ date: formatDateDisplay(h.date), systolic: h.systolic }));
  const bloodFlowSeries = history.map(h => ({ date: formatDateDisplay(h.date), bfr: h.bloodFlowRate }));

  // KPIs
  const sessionsCount = history.length;
  const avgPreWeight = history.length ? +(history.reduce((s, r) => s + r.preWeight, 0) / history.length).toFixed(1) : 0;
  const avgSystolic = history.length ? Math.round(history.reduce((s, r) => s + r.systolic, 0) / history.length) : 0;

  const exportCSV = () => {
    const rows = [['date', 'preWeight', 'postWeight', 'systolic', 'diastolic', 'bloodFlowRate']];
    history.forEach(r => rows.push([r.date, String(r.preWeight), String(r.postWeight), String(r.systolic), String(r.diastolic), String(r.bloodFlowRate)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patient.replace(/\s+/g, '_')}_history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Patient Summary — {patient}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Sessions</div>
              <div className="text-xl font-bold">{sessionsCount}</div>
            </Card>
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Avg Pre-weight</div>
              <div className="text-xl font-bold">{avgPreWeight} kg</div>
            </Card>
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Avg Systolic</div>
              <div className="text-xl font-bold">{avgSystolic} mmHg</div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-sm font-medium mb-2">Recent Records</h3>
            {history.length ? (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-1">Date</th>
                    <th className="py-1">Pre</th>
                    <th className="py-1">Post</th>
                    <th className="py-1">BP</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r) => (
                    <tr key={r.date} className="border-t">
                      <td className="py-1">{formatDateDisplay(r.date)}</td>
                      <td className="py-1">{r.preWeight} kg</td>
                      <td className="py-1">{r.postWeight} kg</td>
                      <td className="py-1">{r.systolic}/{r.diastolic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">No historical records available</p>
            )}
            <div className="flex justify-end mt-3">
              <button onClick={exportCSV} className="px-3 py-1 bg-primary text-white rounded">Export CSV</button>
            </div>
          </Card>
        </div>

        <Card className="p-4 col-span-1 lg:col-span-2">
          <h3 className="text-sm font-medium mb-2">Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-1">
              <ChartContainer config={{ weight: { label: 'Weight (kg)', color: 'steelblue' } }}>
                <LineChart data={weightSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pre" stroke="var(--color-weight, #1f77b4)" strokeWidth={2} dot={{ r: 2 }} name="Pre-dialysis" />
                  <Line type="monotone" dataKey="post" stroke="#ff7f0e" strokeWidth={2} dot={{ r: 2 }} name="Post-dialysis" />
                </LineChart>
              </ChartContainer>
            </div>

            <div className="col-span-1 md:col-span-1">
              <ChartContainer config={{ bp: { label: 'Systolic BP', color: '#d62728' } }}>
                <LineChart data={systolicSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#d62728" strokeWidth={2} dot={{ r: 2 }} name="Systolic" />
                </LineChart>
              </ChartContainer>
            </div>

            <div className="col-span-1 md:col-span-1">
              <ChartContainer config={{ bfr: { label: 'Blood Flow Rate', color: '#2ca02c' } }}>
                <LineChart data={bloodFlowSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="bfr" stroke="#2ca02c" strokeWidth={2} dot={{ r: 2 }} name="BFR" />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Named export used by the Hemodialysis page
