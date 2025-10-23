import React from 'react';
import { SectionCard } from '@/components/hemodialysis/SectionCard';
import { FormTextArea } from '@/components/hemodialysis/FormTextArea';
import { FileText } from 'lucide-react';
import { HemodialysisRecord } from '@/types/hemodialysis';

interface OtherNotesStepProps {
  formData: HemodialysisRecord;
  onFieldChange: (field: string, value: any) => void;
}

export const OtherNotesStep: React.FC<OtherNotesStepProps> = ({
  formData,
  onFieldChange,
}) => {
  return (
    <SectionCard
      title="Other Notes"
      description="Additional observations and comments"
      icon={FileText}
    >
      <FormTextArea
        id="other-notes"
        label="Notes"
        value={formData.otherNotes}
        onChange={(value) => onFieldChange('otherNotes', value)}
        rows={6}
        placeholder="Document any additional observations, complications, or special instructions..."
      />
    </SectionCard>
  );
};

