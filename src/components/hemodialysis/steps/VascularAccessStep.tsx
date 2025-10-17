import React, { useState } from 'react';
import { SectionCard } from '@/components/hemodialysis/SectionCard';
import { FormInput } from '@/components/hemodialysis/FormInput';
import { FormSelect } from '@/components/hemodialysis/FormSelect';
import { FormTextArea } from '@/components/hemodialysis/FormTextArea';
import { FormDateInput } from '@/components/hemodialysis/FormDateInput';
import { Droplet } from 'lucide-react';
import { HemodialysisRecord, AccessType, ValidationErrors } from '@/types/hemodialysis';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { WeeklyTimetable } from '@/components/hemodialysis/WeeklyTimetable';

interface VascularAccessStepProps {
  formData: HemodialysisRecord;
  errors: ValidationErrors;
  touched: Set<string>;
  onFieldChange: (field: string, value: any) => void;
  onBlur: (field: string) => void;
}

const ACCESS_OPTIONS: AccessType[] = [
  'AV Fistula',
  'AV Graft',
  'Permcath',
  'Temporary catheter',
  'Other',
];

export const VascularAccessStep: React.FC<VascularAccessStepProps> = ({
  formData,
  errors,
  touched,
  onFieldChange,
  onBlur,
}) => {
  const mockData = [
    { name: 'John Doe', date: '2025-10-01', session: 'Morning' },
    { name: 'Jane Smith', date: '2025-10-01', session: 'Afternoon' },
    { name: 'Alice Johnson', date: '2025-10-02', session: 'Evening' },
  ];

  const weeklySchedule = [
    { name: 'John Doe', sessions: [
      { day: 'Monday', time: '8:00 AM' },
      { day: 'Wednesday', time: '2:00 PM' },
      { day: 'Friday', time: '6:00 PM' },
    ]},
    { name: 'Jane Smith', sessions: [
      { day: 'Tuesday', time: '9:00 AM' },
      { day: 'Thursday', time: '3:00 PM' },
    ]},
    { name: 'Alice Johnson', sessions: [
      { day: 'Monday', time: '7:00 PM' },
      { day: 'Thursday', time: '10:00 AM' },
    ]},
  ];

  const getError = (field: string) => touched.has(field) ? errors[field] : undefined;

  return (
    <SectionCard
      title="Vascular Access"
      description="Access site information"
      icon={Droplet}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          id="vascular-access"
          label="Access"
          value={formData.vascularAccess.access}
          onChange={(value) => onFieldChange('vascularAccess.access', value as AccessType)}
          onBlur={() => onBlur('vascularAccess.access')}
          required
          error={getError('vascularAccess.access')}
          options={ACCESS_OPTIONS}
        />
        <FormDateInput
          id="vascular-date"
          label="Date of Creation"
          value={formData.vascularAccess.dateOfCreation}
          onChange={(value) => onFieldChange('vascularAccess.dateOfCreation', value)}
        />

        <FormInput
          id="vascular-created-by"
          label="Created By"
          value={formData.vascularAccess.createdBy}
          onChange={(value) => onFieldChange('vascularAccess.createdBy', value)}
          placeholder="Clinician name"
        />
      </div>
      <div className="mt-4">
        <FormTextArea
          id="vascular-complications"
          label="Complications"
          value={formData.vascularAccess.complications}
          onChange={(value) => onFieldChange('vascularAccess.complications', value)}
          rows={4}
          placeholder="Document any access complications or observations"
        />
      </div>
    </SectionCard>
  );
};
