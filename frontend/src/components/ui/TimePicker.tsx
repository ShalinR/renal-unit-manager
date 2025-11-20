import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  minuteStep?: number; // allow future customization (e.g. 5, 15)
}

// Parses a HH:MM string into hour/minute numbers
function parseTime(value?: string): { hour: string; minute: string } {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) {
    return { hour: '', minute: '' };
  }
  const [h, m] = value.split(':');
  return { hour: h, minute: m };
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled,
  className,
  placeholder = 'Select time',
  minuteStep = 1
}) => {
  const { hour, minute } = parseTime(value);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => String(i * minuteStep).padStart(2, '0'));

  const displayValue = hour && minute ? `${hour}:${minute}` : placeholder;

  const handleHourChange = (newHour: string) => {
    const finalMinute = minute || '00';
    onChange(`${newHour}:${finalMinute}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    const finalHour = hour || '00';
    onChange(`${finalHour}:${newMinute}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={`w-full h-10 justify-start text-left font-mono border-2 border-gray-200 ${className || ''}`}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Hour (00-23)</label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={hour}
                onChange={(e) => handleHourChange(e.target.value)}
              >
                <option value="" disabled>Select</option>
                {hours.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Minute (00-59)</label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={minute}
                onChange={(e) => handleMinuteChange(e.target.value)}
              >
                <option value="" disabled>Select</option>
                {minutes.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            24-hour format. Select hour then minute.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
