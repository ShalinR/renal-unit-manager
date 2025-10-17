import React from 'react';

interface WeeklyTimetableProps {
  onClose: () => void;
}

export const WeeklyTimetable: React.FC<WeeklyTimetableProps> = ({ onClose }) => {
  // Mock schedule: patient -> day/time
  const weeklySchedule = [
    // Existing example patients
    { name: 'John Doe', sessions: [
      { day: 'Monday', time: '08:00' },
      { day: 'Wednesday', time: '14:00' },
      { day: 'Friday', time: '18:00' },
    ]},
    { name: 'Jane Smith', sessions: [
      { day: 'Tuesday', time: '09:00' },
      { day: 'Thursday', time: '15:00' },
    ]},
    { name: 'Alice Johnson', sessions: [
      { day: 'Monday', time: '19:00' },
      { day: 'Thursday', time: '10:00' },
    ]},

    // Sri Lankan patients (Sinhala, Tamil and Muslim name examples)
    { name: 'Kamal Perera', sessions: [
      { day: 'Monday', time: '07:00' },
      { day: 'Thursday', time: '13:00' },
    ]},
    { name: 'Nirosha Fernando', sessions: [
      { day: 'Tuesday', time: '09:00' },
      { day: 'Friday', time: '11:00' },
    ]},
    { name: 'Saman de Silva', sessions: [
      { day: 'Wednesday', time: '10:00' },
      { day: 'Saturday', time: '14:00' },
    ]},
    { name: 'Chamari Jayasinghe', sessions: [
      { day: 'Monday', time: '11:00' },
      { day: 'Thursday', time: '15:00' },
    ]},
    { name: 'Arul Prakash', sessions: [
      { day: 'Tuesday', time: '08:00' },
      { day: 'Friday', time: '13:00' },
    ]},
    { name: 'Sivanesan K', sessions: [
      { day: 'Wednesday', time: '09:00' },
      { day: 'Sunday', time: '17:00' },
    ]},
    { name: 'Mohamed Rizvi', sessions: [
      { day: 'Thursday', time: '07:00' },
      { day: 'Saturday', time: '18:00' },
    ]},
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '17:00', '18:00', '19:00'];

  // Build a map day->time->list of patient names
  const tableMap: Record<string, Record<string, string[]>> = {};
  days.forEach(d => {
    tableMap[d] = {};
    timeSlots.forEach(t => (tableMap[d][t] = []));
  });

  weeklySchedule.forEach((p) => {
    p.sessions.forEach(s => {
      const day = s.day;
      // normalize times to HH:MM (mock data already)
      const time = s.time.length === 5 ? s.time : s.time.padStart(5, '0');
      if (tableMap[day] && tableMap[day][time]) {
        tableMap[day][time].push(p.name);
      }
    });
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Weekly Dialysis Timetable</h2>
          <button onClick={onClose} className="text-sm text-red-600 px-3 py-1">Close</button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50 sticky left-0 z-10">Time</th>
                {days.map((d) => (
                  <th key={d} className="border p-2 bg-gray-50 text-left">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="align-top">
                  <td className="border p-2 font-mono w-20">{time}</td>
                  {days.map((d) => (
                    <td key={d + time} className="border p-2 align-top">
                      {tableMap[d][time].length > 0 ? (
                        tableMap[d][time].map((name, idx) => (
                          <div key={idx} className="text-sm bg-primary/10 text-primary rounded px-1 py-0.5 mb-1">{name}</div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};