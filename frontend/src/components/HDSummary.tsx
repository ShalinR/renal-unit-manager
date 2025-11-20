import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, TrendingUp, X, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePatientContext } from '@/context/PatientContext';
import { useToast } from '@/hooks/use-toast';
import { getHemodialysisRecordsByPatientId } from '@/services/hemodialysisApi';

interface HDSummaryProps {
  onBack: () => void;
}

const HDSummary: React.FC<HDSummaryProps> = ({ onBack }) => {
  const { patient } = usePatientContext();
  const { toast } = useToast();
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [chartsExpanded, setChartsExpanded] = useState(false);

  // Load HD records for patient
  useEffect(() => {
    if (!patient?.phn) return;
    loadRecords();
  }, [patient?.phn]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getHemodialysisRecordsByPatientId(patient!.phn);
      setRecords(data || []);
      if (data?.length > 0) {
        const latest = new Date(data[data.length - 1].hemoDialysisSessionDate);
        setEndDate(latest.toISOString().split('T')[0]);
        const thirtyDaysAgo = new Date(latest);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        setSelectedRecord(data[0]);
        prepareChartData(data);
      }
    } catch (err) {
      console.error('Failed to load records', err);
      toast({ title: 'Error', description: 'Failed to load treatment records', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Filter records by date range
  const filteredRecords = useMemo(() => {
    if (!startDate || !endDate) return records;
    return records.filter(r => {
      const recordDate = r.hemoDialysisSessionDate;
      return recordDate >= startDate && recordDate <= endDate;
    });
  }, [records, startDate, endDate]);

  const prepareChartData = (data: any[]) => {
    // Sort by date and prepare chart data
    const sorted = [...data].sort((a, b) => new Date(a.hemoDialysisSessionDate || 0).getTime() - new Date(b.hemoDialysisSessionDate || 0).getTime());
    const chartData = sorted.map((record, idx) => ({
      date: record.hemoDialysisSessionDate ? new Date(record.hemoDialysisSessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Session ${idx + 1}`,
      bloodPressure: record.bloodPressure ? parseFloat(record.bloodPressure.split('/')[0]) : 0,
      arterialPressure: record.arterialPressure ? parseFloat(record.arterialPressure) : 0,
      venousPressure: record.venousPressure ? parseFloat(record.venousPressure) : 0,
      ufRate: record.ufRate ? parseFloat(record.ufRate) : 0,
      sessionTime: record.sessionTime ? parseFloat(record.sessionTime) : 0,
    }));
    setChartData(chartData);
  };

  const calculateStatistics = (data: any[]) => {
    if (data.length === 0) return {};
    
    const bloodPressures = data.map(r => r.bloodPressure ? parseFloat(r.bloodPressure.split('/')[0]) : 0).filter(v => v > 0);
    const arterialPressures = data.map(r => r.arterialPressure ? parseFloat(r.arterialPressure) : 0).filter(v => v > 0);
    const venousPressures = data.map(r => r.venousPressure ? parseFloat(r.venousPressure) : 0).filter(v => v > 0);

    const avg = (arr: number[]) => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 'N/A';

    return {
      totalSessions: data.length,
      avgBloodPressure: avg(bloodPressures),
      avgArterialPressure: avg(arterialPressures),
      avgVenousPressure: avg(venousPressures),
    };
  };

  const generateFullReport = () => {
    if (filteredRecords.length === 0) {
      toast({ title: 'No data', description: 'No sessions in selected date range', variant: 'destructive' });
      return;
    }
    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) return;
    
    const stats = calculateStatistics(filteredRecords);
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hemodialysis Session Report</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #333; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 900px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 25px; }
          .header h1 { margin: 0 0 5px 0; color: #0066cc; font-size: 28px; }
          .header p { margin: 5px 0; color: #666; font-size: 14px; }
          .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
          .patient-info div { }
          .patient-info label { font-weight: bold; color: #0066cc; display: block; font-size: 12px; margin-bottom: 3px; }
          .patient-info span { display: block; color: #333; font-size: 14px; }
          .section { margin: 25px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; }
          .section h2 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 16px; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 15px 0; }
          .stat-box { padding: 12px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-left: 4px solid #0066cc; border-radius: 4px; }
          .stat-label { font-size: 12px; color: #0066cc; font-weight: bold; }
          .stat-value { font-size: 20px; font-weight: bold; color: #0066cc; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { background: #0066cc; color: white; padding: 10px; text-align: left; font-weight: bold; font-size: 13px; }
          td { padding: 8px 10px; border-bottom: 1px solid #e0e0e0; font-size: 13px; }
          tr:hover { background: #f5f5f5; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999; }
          .date-range { color: #666; font-size: 13px; text-align: center; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hemodialysis Treatment Report</h1>
            <p>Full Session Report</p>
          </div>
          
          <div class="date-range">Report Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleString()}</div>
          
          <div class="section">
            <h2>Patient Information</h2>
            <div class="patient-info">
              <div><label>Full Name</label><span>${patient?.name || 'N/A'}</span></div>
              <div><label>PHN</label><span>${patient?.phn || 'N/A'}</span></div>
              <div><label>Age</label><span>${patient?.age || 'N/A'}</span></div>
              <div><label>Gender</label><span>${(patient?.gender || 'N/A').charAt(0).toUpperCase() + (patient?.gender || 'N/A').slice(1)}</span></div>
              <div><label>Contact</label><span>${patient?.contact || 'N/A'}</span></div>
              <div><label>Address</label><span>${patient?.address || 'N/A'}</span></div>
            </div>
          </div>

          <div class="section">
            <h2>Treatment Summary Statistics</h2>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-label">Total Sessions</div>
                <div class="stat-value">${stats.totalSessions || 0}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Avg Blood Pressure</div>
                <div class="stat-value">${stats.avgBloodPressure} mmHg</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Avg Arterial Pressure</div>
                <div class="stat-value">${stats.avgArterialPressure} mmHg</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Session Details (${filteredRecords.length} Sessions)</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Pressure</th>
                  <th>Arterial Pressure</th>
                  <th>Venous Pressure</th>
                  <th>Session Time (min)</th>
                  <th>UF Rate (ml/hr)</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${filteredRecords.map(r => `
                  <tr>
                    <td>${r.hemoDialysisSessionDate || 'N/A'}</td>
                    <td>${r.bloodPressure || 'N/A'}</td>
                    <td>${r.arterialPressure || 'N/A'}</td>
                    <td>${r.venousPressure || 'N/A'}</td>
                    <td>${r.sessionTime || 'N/A'}</td>
                    <td>${r.ufRate || 'N/A'}</td>
                    <td>${(r.otherNotes || 'N/A').substring(0, 30)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>This report is confidential and for medical use only.</p>
            <p>© Renal Unit Manager - ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const stats = calculateStatistics(filteredRecords);

  const getSelectedRecord = () => {
    if (!selectedRecord) return null;
    return filteredRecords.find(r => r.id === selectedRecord) || filteredRecords.find(r => r.hemoDialysisSessionDate === selectedRecord);
  };

  if (!patient?.phn) {
    return (
      <div className="space-y-8">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Treatment Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-600">Please select a patient to view their treatment summary.</p>
          </CardContent>
        </Card>
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Treatment Summary</CardTitle>
              <CardDescription className="text-blue-100">
                Comprehensive hemodialysis history and analytics for {patient.name}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={generateFullReport} className="bg-white text-blue-600 hover:bg-gray-100">
                <Printer className="w-4 h-4 mr-2" /> Generate Report
              </Button>
              <Button variant="outline" onClick={onBack} className="border-white text-white hover:bg-blue-500">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Date Filter */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => { setStartDate(''); setEndDate(''); }} className="w-full bg-gray-500 hover:bg-gray-600">Reset</Button>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600 font-semibold">
                Sessions in range: <span className="text-blue-600">{filteredRecords.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No treatment records found for this patient.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Patient Info Card */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold">{patient.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">PHN</p>
                  <p className="font-semibold">{patient.phn}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="font-semibold">{patient.age}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="font-semibold capitalize">{patient.gender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-600">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-500">{stats.avgBloodPressure} mmHg</div>
                <p className="text-sm text-gray-600">Avg Blood Pressure</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-500">{stats.avgArterialPressure} mmHg</div>
                <p className="text-sm text-gray-600">Avg Arterial Pressure</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-500">{stats.avgVenousPressure} mmHg</div>
                <p className="text-sm text-gray-600">Avg Venous Pressure</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Card>
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle>Treatment Analytics</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setChartsExpanded(!chartsExpanded)}
                  className="flex items-center gap-2"
                >
                  {chartsExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" /> Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> Expand
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className={chartsExpanded ? 'grid gap-6 grid-cols-1' : 'grid gap-6 grid-cols-1 lg:grid-cols-2'}>
                {/* Blood Pressure Trend */}
                <Card>
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-sm">Blood Pressure Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={chartsExpanded ? 400 : 250}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="bloodPressure"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                          name="BP (mmHg)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Arterial vs Venous Pressure */}
                <Card>
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-sm">Pressure Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={chartsExpanded ? 400 : 250}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="arterialPressure"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={false}
                          name="AP (mmHg)"
                        />
                        <Line
                          type="monotone"
                          dataKey="venousPressure"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={false}
                          name="VP (mmHg)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Session Duration & UF Rate - Full width when expanded */}
                {chartsExpanded && (
                  <Card className="lg:col-span-2">
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-sm">Session Duration & UF Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="sessionDuration" fill="#3b82f6" name="Duration (min)" />
                          <Bar yAxisId="right" dataKey="ufRate" fill="#f59e0b" name="UF Rate (mL/hr)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Hidden when expanded, visible when collapsed */}
                {!chartsExpanded && (
                  <Card>
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-sm">Session Duration & UF Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="sessionDuration" fill="#3b82f6" name="Duration (min)" />
                          <Bar yAxisId="right" dataKey="ufRate" fill="#f59e0b" name="UF Rate (mL/hr)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card>
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle>Session Details</CardTitle>
                <select
                  value={selectedRecord}
                  onChange={(e) => setSelectedRecord(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="">-- Select a session --</option>
                  {filteredRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.sessionDate} - Dr. {record.nephrologist}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {selectedRecord && getSelectedRecord() ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="text-xs text-gray-500">Session Date</p>
                    <p className="font-semibold">{getSelectedRecord()?.sessionDate}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold">{getSelectedRecord()?.sessionDuration || 'N/A'} min</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-3">
                    <p className="text-xs text-gray-500">Blood Pressure (Pre)</p>
                    <p className="font-semibold">{getSelectedRecord()?.bloodPressure || 'N/A'} mmHg</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="text-xs text-gray-500">Arterial Pressure</p>
                    <p className="font-semibold">{getSelectedRecord()?.arterialPressure || 'N/A'} mmHg</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <p className="text-xs text-gray-500">Venous Pressure</p>
                    <p className="font-semibold">{getSelectedRecord()?.venousPressure || 'N/A'} mmHg</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3">
                    <p className="text-xs text-gray-500">UF Rate</p>
                    <p className="font-semibold">{getSelectedRecord()?.ufRate || 'N/A'} mL/hr</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-3">
                    <p className="text-xs text-gray-500">Sodium Removed</p>
                    <p className="font-semibold">{getSelectedRecord()?.sodiumRemoved || 'N/A'} mEq</p>
                  </div>
                  <div className="border-l-4 border-cyan-500 pl-3">
                    <p className="text-xs text-gray-500">Weight Removed</p>
                    <p className="font-semibold">{getSelectedRecord()?.weightRemoved || 'N/A'} kg</p>
                  </div>
                  <div className="border-l-4 border-teal-500 pl-3">
                    <p className="text-xs text-gray-500">Nephrologist</p>
                    <p className="font-semibold">{getSelectedRecord()?.nephrologist}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select a session to view details.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default HDSummary;
