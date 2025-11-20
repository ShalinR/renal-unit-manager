import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { usePatientContext } from '@/context/PatientContext';
import { useToast } from '@/hooks/use-toast';
import hdScheduleApi from '@/services/hdScheduleApi';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { formatDateToDDMMYYYY, isoStringToDate, toLocalISO } from '@/lib/dateUtils';

interface HDScheduleAppointmentProps {
  onBack: () => void;
}

type Slot = {
  id: string;
  label: string;
};

type Appointment = {
  id: string | number;
  phn: string;
  patientName: string;
  date: string; // yyyy-mm-dd
  slotId: string;
  notes?: string;
};

const DEFAULT_SLOTS: Slot[] = [
  { id: '06:00', label: '06:00 - 08:00' },
  { id: '08:00', label: '08:00 - 10:00' },
  { id: '10:00', label: '10:00 - 12:00' },
  { id: '12:00', label: '12:00 - 14:00' },
  { id: '14:00', label: '14:00 - 16:00' },
  { id: '16:00', label: '16:00 - 18:00' },
];

const STORAGE_KEY = 'hd-appointments-v1';

const HDScheduleAppointment: React.FC<HDScheduleAppointmentProps> = ({ onBack }) => {
  const { patient } = usePatientContext();
  const { toast } = useToast();

  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [slots] = useState<Slot[]>(DEFAULT_SLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Load appointments for selected date from backend
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const list = await hdScheduleApi.getAppointmentsByDate(date);
        if (!mounted) return;
        setAppointments(list || []);
      } catch (err) {
        console.error('Failed to load appointments', err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [date]);

  const todaysAppointments = useMemo(
    () => appointments.filter((a) => a.date === date),
    [appointments, date]
  );

  const slotTaken = (slotId: string) => todaysAppointments.some((a) => a.slotId === slotId);

  const handleBook = () => {
    if (!patient || !patient.phn) {
      toast({ title: 'Select Patient', description: 'Please select a patient before booking.', variant: 'destructive' });
      return;
    }
    if (!selectedSlot) {
      toast({ title: 'Select Slot', description: 'Please pick a time slot to schedule.', variant: 'destructive' });
      return;
    }

    if (slotTaken(selectedSlot)) {
      toast({ title: 'Slot Taken', description: 'Selected time slot is already booked.', variant: 'destructive' });
      return;
    }

    (async () => {
      try {
        const created = await hdScheduleApi.bookAppointment({
          phn: patient.phn,
          patientName: patient.name || patient.phn,
          date,
          slotId: selectedSlot!,
          notes: notes || undefined,
        });
        setAppointments((prev) => [...prev, created]);
        toast({ title: 'Booked', description: `Appointment booked for ${patient.name} on ${date} (${selectedSlot})` });
        setSelectedSlot(null);
        setNotes('');
      } catch (err: any) {
        console.error('Booking failed', err);
        const msg = err?.message || 'Failed to book appointment';
        toast({ title: 'Booking failed', description: msg, variant: 'destructive' });
      }
    })();
  };

  const handleCancel = (id: string | number) => {
    if (!confirm('Cancel this appointment?')) return;
    (async () => {
      try {
        await hdScheduleApi.cancelAppointment(Number(id));
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        toast({ title: 'Canceled', description: 'Appointment canceled.' });
      } catch (err) {
        console.error('Cancel failed', err);
        toast({ title: 'Cancel failed', description: 'Unable to cancel appointment', variant: 'destructive' });
      }
    })();
  };

  const patientAppointments = useMemo(
    () => appointments.filter((a) => a.phn === patient?.phn),
    [appointments, patient]
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle>Schedule Hemodialysis Appointment</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDateToDDMMYYYY(date) : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={isoStringToDate(date)}
                    onSelect={(selected) => {
                      if (selected) {
                        setDate(toLocalISO(selected));
                      }
                    }}
                    disabled={(calendarDate) => calendarDate > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Patient</Label>
              <div className="mt-1">
                <Input value={patient?.name || ''} placeholder="Select patient from search" disabled />
              </div>
            </div>
          </div>

          <div>
            <Label>Available Slots</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {slots.map((s) => {
                const taken = slotTaken(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSlot(s.id)}
                    disabled={taken}
                    className={`py-2 px-3 rounded border text-sm text-left ${
                      taken ? 'bg-red-100 border-red-200 text-red-700' : selectedSlot === s.id ? 'bg-blue-600 text-white' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{taken ? 'Booked' : 'Available'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>Notes (optional)</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes for the session" />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={handleBook} className="bg-blue-600 text-white">Book Slot</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments ({date})</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments for this date</p>
            ) : (
              <div className="space-y-2">
                {todaysAppointments
                  .sort((a, b) => (a.slotId > b.slotId ? 1 : -1))
                  .map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{a.patientName}</div>
                        <div className="text-xs text-muted-foreground">{a.slotId}</div>
                        {a.notes && <div className="text-xs">{a.notes}</div>}
                      </div>
                      <div>
                        <Button size="sm" variant="outline" onClick={() => handleCancel(a.id)}>Cancel</Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {patientAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments for selected patient</p>
            ) : (
              <div className="space-y-2">
                {patientAppointments
                  .sort((a, b) => (a.date > b.date ? 1 : -1))
                  .map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{a.date} • {a.slotId}</div>
                        {a.notes && <div className="text-xs">{a.notes}</div>}
                      </div>
                      <div>
                        <Button size="sm" variant="outline" onClick={() => handleCancel(a.id)}>Cancel</Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HDScheduleAppointment;
