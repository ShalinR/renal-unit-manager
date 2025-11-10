import React, { useMemo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateDisplay } from '@/lib/dateUtils';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { getHemodialysisRecordsByPatientId } from '@/services/hemodialysisApi';
import { usePatientContext } from '@/context/PatientContext';
import { HemodialysisDataPreview } from './HemodialysisDataPreview';
import { Eye } from 'lucide-react';

interface RecordItem {
  date: string; // ISO date
  preWeight: number;
  postWeight: number;
  systolic: number;
  diastolic: number;
  bloodFlowRate: number;
}

export const PatientSummary: React.FC = () => {
  const { patient, globalPatient } = usePatientContext();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Get patient ID from context
  const patientId = patient?.phn || globalPatient?.phn || '123456';
  const patientName = patient?.name || globalPatient?.name || 'John Doe';

  // Fetch records from backend
  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getHemodialysisRecordsByPatientId(patientId);
        setRecords(data || []);
      } catch (err: any) {
        console.error('Error fetching hemodialysis records:', err);
        setError(err.message || 'Failed to load records');
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [patientId]);

  // Transform backend records to RecordItem format
  const history: RecordItem[] = useMemo(() => {
    return records.map((record) => {
      const session = record.session || {};
      const bloodPressure = session.bloodPressure || {};
      return {
        date: record.sessionDate || session.date || '',
        preWeight: session.preDialysisWeightKg || 0,
        postWeight: session.postDialysisWeightKg || 0,
        systolic: bloodPressure.systolic || 0,
        diastolic: bloodPressure.diastolic || 0,
        bloodFlowRate: session.bloodFlowRate || 0,
      };
    }).filter((item) => item.date); // Filter out invalid records
  }, [records]);

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
    a.download = `${patientName.replace(/\s+/g, '_')}_history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Patient Summary — {patientName}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Patient Summary — {patientName}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Patient Summary — {patientName}</h2>
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
              <div className="space-y-2">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="py-1">Date</th>
                      <th className="py-1">Pre</th>
                      <th className="py-1">Post</th>
                      <th className="py-1">BP</th>
                      <th className="py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => {
                      const session = record.session || {};
                      const bloodPressure = session.bloodPressure || {};
                      return (
                        <tr key={record.id || index} className="border-t hover:bg-muted/50">
                          <td className="py-1">{formatDateDisplay(record.sessionDate || session.date || '')}</td>
                          <td className="py-1">{session.preDialysisWeightKg || '—'} kg</td>
                          <td className="py-1">{session.postDialysisWeightKg || '—'} kg</td>
                          <td className="py-1">
                            {bloodPressure.systolic || '—'}/{bloodPressure.diastolic || '—'}
                          </td>
                          <td className="py-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRecord(record);
                                setShowPreview(true);
                              }}
                              className="h-7 px-2"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No historical records available</p>
            )}
            <div className="flex justify-end mt-3">
              <Button onClick={exportCSV} variant="outline" size="sm">
                Export CSV
              </Button>
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

      {/* Data Preview Modal */}
      {showPreview && (
        <HemodialysisDataPreview
          record={selectedRecord}
          onClose={() => {
            setShowPreview(false);
            setSelectedRecord(null);
          }}
          patientName={patientName}
        />
      )}
    </div>
  );
};

// Named export used by the Hemodialysis page
