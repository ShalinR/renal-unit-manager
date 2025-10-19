import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormDateInput } from '@/components/hemodialysis/FormDateInput';
import { FormInput } from '@/components/hemodialysis/FormInput';
import { FormTextArea } from '@/components/hemodialysis/FormTextArea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Save } from 'lucide-react';

interface AppointmentForm {
  date: string;
  timeSlot: string;
  durationMinutes: number;
  notes?: string;
}

export const ScheduleAppointment: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AppointmentForm>({
    date: '',
    timeSlot: '',
    durationMinutes: 240,
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSchedule = () => {
    if (!formData.date || !formData.timeSlot) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Here you would integrate with your backend
    toast({
      title: 'Appointment Scheduled',
      description: `Dialysis session scheduled for ${formData.date} at ${formData.timeSlot}`,
    });

    // Reset form
    setFormData({
      date: '',
      timeSlot: '',
      durationMinutes: 240,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Schedule New Appointment</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDateInput
              id="appointment-date"
              label="Appointment Date"
              value={formData.date}
              onChange={(value) => handleFieldChange('date', value)}
              required
            />
            <FormInput
              id="appointment-time"
              label="Time Slot"
              type="text"
              value={formData.timeSlot}
              onChange={(value) => handleFieldChange('timeSlot', value)}
              placeholder="e.g., 09:00 AM"
              required
            />
          </div>

          <FormInput
            id="appointment-duration"
            label="Expected Duration"
            type="number"
            value={formData.durationMinutes}
            onChange={(value) => handleFieldChange('durationMinutes', value)}
            unit="minutes"
            min={15}
            max={720}
            required
          />

          <FormTextArea
            id="appointment-notes"
            label="Notes"
            value={formData.notes}
            onChange={(value) => handleFieldChange('notes', value)}
            placeholder="Add any special instructions or notes for this appointment"
            rows={4}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setFormData({ date: '', timeSlot: '', durationMinutes: 240 })}
            >
              Clear
            </Button>
            <Button onClick={handleSchedule} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Available Time Slots</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['07:00 AM', '09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'].map(time => (
            <Button
              key={time}
              variant="outline"
              size="sm"
              onClick={() => handleFieldChange('timeSlot', time)}
              className={formData.timeSlot === time ? 'bg-primary text-primary-foreground' : ''}
            >
              {time}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
