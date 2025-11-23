import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePatientContext } from "@/context/PatientContext";
import {
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import hdScheduleApi from "@/services/hdScheduleApi";

type Slot = { id: string; label: string };
const DEFAULT_SLOTS: Slot[] = [
  { id: "06:00", label: "06:00 - 08:00" },
  { id: "08:00", label: "08:00 - 10:00" },
  { id: "10:00", label: "10:00 - 12:00" },
  { id: "12:00", label: "12:00 - 14:00" },
  { id: "14:00", label: "14:00 - 16:00" },
  { id: "16:00", label: "16:00 - 18:00" },
];

const weekdayDates = (center: Date) => {
  // return Sunday..Saturday of the week containing center
  const day = center.getDay();
  const sunday = new Date(center);
  sunday.setDate(center.getDate() - day);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push(d);
  }
  return days;
};

const fmt = (d: Date) => d.toISOString().slice(0, 10);

const HDWeekScheduleFloating: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { patient } = usePatientContext();
  const { toast } = useToast();
  const [center, setCenter] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [appointmentsByDate, setAppointmentsByDate] = useState<
    Record<string, any[]>
  >({});
  const [bookingId, setBookingId] = useState<string | null>(null);

  const days = useMemo(() => weekdayDates(center), [center]);

  const loadWeek = async () => {
    setLoading(true);
    try {
      const promises = days.map((d) =>
        hdScheduleApi.getAppointmentsByDate(fmt(d)).catch(() => [])
      );
      const results = await Promise.all(promises);
      const map: Record<string, any[]> = {};
      days.forEach((d, i) => (map[fmt(d)] = results[i] || []));
      setAppointmentsByDate(map);
    } catch (e) {
      console.error("Failed to load week", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeek();
    const handler = () => loadWeek();
    window.addEventListener("hd-schedule-updated", handler as EventListener);
    return () =>
      window.removeEventListener(
        "hd-schedule-updated",
        handler as EventListener
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  const isTaken = (dateStr: string, slotId: string) =>
    (appointmentsByDate[dateStr] || []).some((a) => a.slotId === slotId);

  const getAppointment = (dateStr: string, slotId: string) =>
    (appointmentsByDate[dateStr] || []).find((a) => a.slotId === slotId);

  const handleBook = async (dateStr: string, slotId: string) => {
    if (!patient?.phn) {
      toast({
        title: "Select Patient",
        description: "Please select a patient before booking.",
        variant: "destructive",
      });
      return;
    }
    setBookingId(`${dateStr}-${slotId}`);
    try {
      await hdScheduleApi.bookAppointment({
        phn: patient.phn,
        patientName: patient.name || patient.phn,
        date: dateStr,
        slotId,
      });
      toast({ title: "Booked", description: `Booked ${dateStr} ${slotId}` });
    } catch (err: any) {
      toast({
        title: "Booking failed",
        description: err?.message || "Unable to book",
        variant: "destructive",
      });
    } finally {
      setBookingId(null);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this appointment?")) return;
    setBookingId(`cancel-${id}`);
    try {
      await hdScheduleApi.cancelAppointment(id);
      toast({ title: "Canceled" });
    } catch (err) {
      toast({
        title: "Cancel failed",
        description: "Unable to cancel",
        variant: "destructive",
      });
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-[1100px] max-w-full max-h-[85vh] overflow-hidden shadow-2xl rounded-2xl bg-white flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Weekly Schedule</h2>
              <p className="text-sm text-blue-100">Hemodialysis Timetable</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCenter(
                    new Date(
                      center.getFullYear(),
                      center.getMonth(),
                      center.getDate() - 7
                    )
                  )
                }
                className="p-2 hover:bg-blue-500 rounded-lg transition"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCenter(new Date())}
                className="px-3 py-1 text-sm hover:bg-blue-500 rounded transition font-medium"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCenter(
                    new Date(
                      center.getFullYear(),
                      center.getMonth(),
                      center.getDate() + 7
                    )
                  )
                }
                className="p-2 hover:bg-blue-500 rounded-lg transition"
                aria-label="Next week"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-500 rounded-lg transition ml-2"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-4 mb-6">
                  {days.map((d) => {
                    const dateStr = fmt(d);
                    const dayName = d.toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                    const dayNum = d.getDate();
                    const isToday = fmt(new Date()) === dateStr;
                    return (
                      <div
                        key={dateStr}
                        className={`flex flex-col rounded-xl overflow-hidden border-2 transition ${isToday ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
                      >
                        {/* Day Header */}
                        <div
                          className={`p-3 ${isToday ? "bg-blue-100" : "bg-gradient-to-b from-gray-50 to-gray-25"} border-b border-gray-200`}
                        >
                          <div className="font-bold text-gray-900">
                            {dayName}
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {dayNum}
                          </div>
                          <div className="text-xs text-gray-500">{dateStr}</div>
                        </div>

                        {/* Slots */}
                        <div className="space-y-2 p-3 flex-1">
                          {DEFAULT_SLOTS.map((s) => {
                            const appt = getAppointment(dateStr, s.id);
                            const isLoading =
                              bookingId === `${dateStr}-${s.id}` ||
                              bookingId === `cancel-${appt?.id}`;
                            return (
                              <div key={s.id} className="flex flex-col">
                                <div className="text-xs font-semibold text-gray-700 mb-1">
                                  {s.label}
                                </div>
                                {appt ? (
                                  <div className="bg-gradient-to-br from-red-50 to-red-25 border border-red-200 rounded-lg p-2 shadow-sm hover:shadow-md transition">
                                    <div className="flex items-start gap-1 mb-1">
                                      <CheckCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                      <div className="text-xs font-bold text-red-700 truncate flex-1">
                                        {appt.patientName}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleCancel(appt.id)}
                                      disabled={isLoading}
                                      className="text-xs text-red-600 hover:text-red-700 font-semibold disabled:opacity-50 text-left hover:underline"
                                    >
                                      {isLoading ? "Canceling..." : "✕ Cancel"}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleBook(dateStr, s.id)}
                                    disabled={isLoading || !patient?.phn}
                                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white text-xs font-bold rounded-lg transition disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                  >
                                    {isLoading ? "⏳" : "+ Book"}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Patient Info Footer */}
                {patient?.phn && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Selected Patient
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.name || patient.phn}
                      </div>
                    </div>
                  </div>
                )}
                {!patient?.phn && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Select a Patient
                      </div>
                      <div className="text-sm text-gray-600">
                        Please select a patient from the search to book
                        appointments.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HDWeekScheduleFloating;
