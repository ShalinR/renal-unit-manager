import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateDisplay } from '@/lib/dateUtils';

interface DialysisSession {
  date: string; // ISO yyyy-mm-dd
  status: 'completed' | 'scheduled' | 'missed';
  notes?: string;
}

type AccessType = 'AV Fistula' | 'AV Graft' | 'Permcath' | 'Temporary catheter' | 'Other';

interface HDPrescription {
  access: AccessType;
  durationMinutes: number;
  dialysisProfile?: string;
  sodium?: number;
  bicarbonate?: number;
  bloodFlowRate: number;
  dialysateFlowRate?: number;
  temperature?: number;
  dryWeightKg: number;
  ultrafiltrationVolume?: number;
  anticoagulation?: string;
  erythropoetinDose?: string;
  otherTreatment?: string;
}

interface VascularAccess {
  access: AccessType;
  dateOfCreation?: string;
  createdBy?: string;
  complications?: string;
}

interface BloodPressure {
  systolic: number;
  diastolic: number;
}

interface DialysisSessionRecord {
  date: string;
  durationMinutes: number;
  preDialysisWeightKg: number;
  postDialysisWeightKg: number;
  interDialyticWeightGainKg?: number;
  bloodPressure: BloodPressure;
  pulseRate?: number;
  oxygenSaturationPercent?: number;
  bloodFlowRate: number;
  arterialPressure?: number;
  venousPressure?: number;
  transmembranePressure?: number;
  ultrafiltrationVolume?: number;
}

interface HemodialysisRecord {
  id?: string;
  prescription: HDPrescription;
  vascularAccess: VascularAccess;
  session: DialysisSessionRecord;
  otherNotes?: string;
  createdBy?: string; // who filled the form
  createdAt?: string;
  updatedAt?: string;
}

// Mock sessions - replace with actual data
const mockSessions: DialysisSession[] = [
  { date: '2025-09-28', status: 'completed', notes: 'Session completed successfully' },
  { date: '2025-09-30', status: 'scheduled' },
  { date: '2025-10-02', status: 'scheduled' },
  { date: '2025-10-04', status: 'scheduled' },
];

// Mock full reports keyed by ISO date
const mockReports: Record<string, HemodialysisRecord> = {
  '2025-09-28': {
    id: 'r-20250928',
    prescription: {
      access: 'AV Fistula',
      durationMinutes: 240,
      dialysisProfile: 'Standard',
      sodium: 140,
      bicarbonate: 32,
      bloodFlowRate: 350,
      dialysateFlowRate: 500,
      temperature: 36.5,
      dryWeightKg: 70,
      ultrafiltrationVolume: 1200,
      anticoagulation: 'Heparin 1000 IU bolus',
      erythropoetinDose: 'EPO 4000 IU',
      otherTreatment: 'Vitamin D injection'
    },
    vascularAccess: {
      access: 'AV Fistula',
      dateOfCreation: '2020-03-12',
      createdBy: 'Dr. Silva',
      complications: 'None'
    },
    session: {
      date: '2025-09-28',
      durationMinutes: 240,
      preDialysisWeightKg: 71.2,
      postDialysisWeightKg: 70.0,
      interDialyticWeightGainKg: 1.2,
      bloodPressure: { systolic: 120, diastolic: 78 },
      pulseRate: 78,
      oxygenSaturationPercent: 98,
      bloodFlowRate: 350,
      arterialPressure: 120,
      venousPressure: 180,
      transmembranePressure: 150,
      ultrafiltrationVolume: 1200
    },
    otherNotes: 'No complications observed',
    createdBy: 'Nurse Kamal',
    createdAt: '2025-09-28T08:30:00Z',
    updatedAt: '2025-09-28T12:45:00Z'
  },
  // Add other mock reports as required
};

export const DialysisCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showReport, setShowReport] = useState<boolean>(false);

  // find a session object for a given date
  const findSessionForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockSessions.find(s => s.date === dateStr) ?? null;
  };

  const selectedSession = selectedDate ? findSessionForDate(selectedDate) : null;

  // find report for selected date
  const selectedReport = selectedDate
    ? mockReports[selectedDate.toISOString().split('T')[0]] ?? null
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Dialysis Schedule</h3>
            <div className="text-sm text-muted-foreground">Select a date to view details</div>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              setSelectedDate(d);
              setShowReport(false); // hide report when date changes
            }}
            className="rounded-md border"
            modifiers={{
              completed: (date) => findSessionForDate(date)?.status === 'completed',
              scheduled: (date) => findSessionForDate(date)?.status === 'scheduled',
              missed: (date) => findSessionForDate(date)?.status === 'missed',
            }}
            modifiersClassNames={{
              completed: 'bg-primary/20 text-primary font-bold',
              scheduled: 'bg-accent text-accent-foreground font-bold',
              missed: 'bg-destructive/20 text-destructive font-bold',
            }}
          />

          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent border-2 border-accent-foreground"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/20 border-2 border-destructive"></div>
              <span>Missed</span>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Session Details</h3>

          {selectedSession ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDateDisplay(selectedSession.date)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    selectedSession.status === 'completed'
                      ? 'default'
                      : selectedSession.status === 'scheduled'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                </Badge>
              </div>

              {selectedSession.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedSession.notes}</p>
                </div>
              )}

              <div className="pt-3">
                {selectedReport ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowReport(prev => !prev)}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-primary bg-white text-primary hover:bg-primary/5"
                    >
                      {showReport ? 'Hide full report' : 'View full report'}
                    </button>

                    <a
                      href={`#report-${selectedReport.id}`}
                      className="text-sm text-muted-foreground hover:underline"
                      onClick={(e) => {
                        // ensure the report is visible if user clicks this link
                        e.preventDefault();
                        setShowReport(true);
                      }}
                    >
                      Open report detail panel
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">No full report available for this date</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a date to view session details</p>
          )}
        </Card>

        <Card className="p-6 mt-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Sessions</h3>
          <div className="space-y-2">
            {mockSessions
              .filter(s => s.status === 'scheduled')
              .slice(0, 3)
              .map((session, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="text-sm">{formatDateDisplay(session.date)}</span>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6 mt-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Patient Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-sm">Total Sessions</span>
              <span className="font-medium">{mockSessions.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-sm">Completed</span>
              <span className="font-medium">{mockSessions.filter(s => s.status === 'completed').length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-sm">Scheduled</span>
              <span className="font-medium">{mockSessions.filter(s => s.status === 'scheduled').length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-sm">Missed</span>
              <span className="font-medium">{mockSessions.filter(s => s.status === 'missed').length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Expanded report panel shown when showReport is true */}
      {showReport && selectedReport && (
        <div className="lg:col-span-3">
          <Card className="p-6 mt-4" id={`report-${selectedReport.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Full Hemodialysis Report</h3>
                <p className="text-sm text-muted-foreground">
                  Date {formatDateDisplay(selectedReport.session.date)} • Filled by {selectedReport.createdBy ?? '—'}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedReport.createdAt ? `Created ${formatDateDisplay(selectedReport.createdAt)}` : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <section className="col-span-1 md:col-span-1">
                <h4 className="font-medium mb-2">HD Prescription</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Access</strong> {selectedReport.prescription.access}</div>
                  <div><strong>Duration</strong> {selectedReport.prescription.durationMinutes} minutes</div>
                  <div><strong>Blood flow rate</strong> {selectedReport.prescription.bloodFlowRate} mL/min</div>
                  <div><strong>Dry weight</strong> {selectedReport.prescription.dryWeightKg} kg</div>
                  {selectedReport.prescription.sodium !== undefined && <div><strong>Sodium</strong> {selectedReport.prescription.sodium} mmol/L</div>}
                  {selectedReport.prescription.bicarbonate !== undefined && <div><strong>Bicarbonate</strong> {selectedReport.prescription.bicarbonate} mmol/L</div>}
                  {selectedReport.prescription.temperature !== undefined && <div><strong>Temperature</strong> {selectedReport.prescription.temperature} °C</div>}
                  {selectedReport.prescription.anticoagulation && <div><strong>Anticoagulation</strong> {selectedReport.prescription.anticoagulation}</div>}
                  {selectedReport.prescription.erythropoetinDose && <div><strong>Erythropoetin</strong> {selectedReport.prescription.erythropoetinDose}</div>}
                  {selectedReport.prescription.otherTreatment && <div><strong>Other</strong> {selectedReport.prescription.otherTreatment}</div>}
                </div>
              </section>

              <section className="col-span-1 md:col-span-1">
                <h4 className="font-medium mb-2">Vascular Access</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Access</strong> {selectedReport.vascularAccess.access}</div>
                  {selectedReport.vascularAccess.dateOfCreation && <div><strong>Date of creation</strong> {formatDateDisplay(selectedReport.vascularAccess.dateOfCreation)}</div>}
                  {selectedReport.vascularAccess.createdBy && <div><strong>Created by</strong> {selectedReport.vascularAccess.createdBy}</div>}
                  {selectedReport.vascularAccess.complications && <div><strong>Complications</strong> {selectedReport.vascularAccess.complications}</div>}
                </div>
              </section>

              <section className="col-span-1 md:col-span-1">
                <h4 className="font-medium mb-2">Session Summary</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Duration</strong> {selectedReport.session.durationMinutes} minutes</div>
                  <div><strong>Pre weight</strong> {selectedReport.session.preDialysisWeightKg} kg</div>
                  <div><strong>Post weight</strong> {selectedReport.session.postDialysisWeightKg} kg</div>
                  {selectedReport.session.interDialyticWeightGainKg !== undefined && <div><strong>Interdialytic gain</strong> {selectedReport.session.interDialyticWeightGainKg} kg</div>}
                  <div><strong>BP</strong> {selectedReport.session.bloodPressure.systolic}/{selectedReport.session.bloodPressure.diastolic} mmHg</div>
                  {selectedReport.session.pulseRate !== undefined && <div><strong>Pulse</strong> {selectedReport.session.pulseRate} bpm</div>}
                  {selectedReport.session.oxygenSaturationPercent !== undefined && <div><strong>SpO2</strong> {selectedReport.session.oxygenSaturationPercent} %</div>}
                  <div><strong>Blood flow</strong> {selectedReport.session.bloodFlowRate} mL/min</div>
                  {selectedReport.session.arterialPressure !== undefined && <div><strong>Arterial pressure</strong> {selectedReport.session.arterialPressure} mmHg</div>}
                  {selectedReport.session.venousPressure !== undefined && <div><strong>Venous pressure</strong> {selectedReport.session.venousPressure} mmHg</div>}
                  {selectedReport.session.transmembranePressure !== undefined && <div><strong>Transmembrane pressure</strong> {selectedReport.session.transmembranePressure} mmHg</div>}
                  {selectedReport.session.ultrafiltrationVolume !== undefined && <div><strong>Ultrafiltration</strong> {selectedReport.session.ultrafiltrationVolume} mL</div>}
                </div>
              </section>
            </div>

            {selectedReport.otherNotes && (
              <div className="mt-4">
                <h4 className="font-medium mb-1">Other notes</h4>
                <p className="text-sm">{selectedReport.otherNotes}</p>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowReport(false)}
                className="px-4 py-2 rounded-md border border-primary bg-white text-primary"
              >
                Close report
              </button>
              <a
                href="#print"
                className="px-4 py-2 rounded-md bg-primary text-white"
                onClick={(e) => {
                  e.preventDefault();
                  // implement print or open full page view
                  window.print();
                }}
              >
                Print report
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
