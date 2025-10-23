import React from 'react';
import { SectionCard } from '@/components/hemodialysis/SectionCard';
import { FormInput } from '@/components/hemodialysis/FormInput';
import { CheckCircle } from 'lucide-react';
import { HemodialysisRecord, ValidationErrors } from '@/types/hemodialysis';
import { formatDateDisplay } from '@/lib/dateUtils';

interface ConfirmationStepProps {
  formData: HemodialysisRecord;
  errors: ValidationErrors;
  touched: Set<string>;
  filledBy: string;
  onFilledByChange: (value: string) => void;
  onBlur: (field: string) => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  errors,
  touched,
  filledBy,
  onFilledByChange,
  onBlur,
}) => {
  const getError = (field: string) => touched.has(field) ? errors[field] : undefined;

  return (
    <SectionCard
      title="Review & Confirm"
      description="Please review the information and confirm who filled out this form"
      icon={CheckCircle}
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-foreground">Session Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Date:</span>
              <span className="ml-2 text-foreground font-medium">
                {formatDateDisplay(formData.session.date)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2 text-foreground font-medium">
                {formData.session.durationMinutes} min
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Access:</span>
              <span className="ml-2 text-foreground font-medium">
                {formData.prescription.access}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Blood Flow:</span>
              <span className="ml-2 text-foreground font-medium">
                {formData.session.bloodFlowRate} mL/min
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Pre-Dialysis Weight:</span>
              <span className="ml-2 text-foreground font-medium">
                {formData.session.preDialysisWeightKg} kg
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Post-Dialysis Weight:</span>
              <span className="ml-2 text-foreground font-medium">
                {formData.session.postDialysisWeightKg} kg
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Blood Pressure:</span>
              <span className="ml-2 text-foreground font-medium">
                {formData.session.bloodPressure.systolic}/{formData.session.bloodPressure.diastolic} mmHg
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Weight Gain:</span>
              <span className="ml-2 text-foreground font-medium">
                {formData.session.interDialyticWeightGainKg?.toFixed(2) ?? 'N/A'} kg
              </span>
            </div>
          </div>
        </div>

        {/* Filled by */}
        <div>
          <FormInput
            id="filled-by"
            label="Form Filled By"
            value={filledBy}
            onChange={onFilledByChange}
            onBlur={() => onBlur('filledBy')}
            required
            error={getError('filledBy')}
            placeholder="Enter your name"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Please confirm your identity before submitting this form
          </p>
        </div>
      </div>
    </SectionCard>
  );
};

