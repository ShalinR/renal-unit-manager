import React from 'react';
import { SectionCard } from '@/components/hemodialysis/SectionCard';
import { FormInput } from '@/components/hemodialysis/FormInput';
import { FormDateInput } from '@/components/hemodialysis/FormDateInput';
import { Calendar } from 'lucide-react';
import { HemodialysisRecord, ValidationErrors } from '@/types/hemodialysis';

interface DialysisSessionStepProps {
  formData: HemodialysisRecord;
  errors: ValidationErrors;
  touched: Set<string>;
  onFieldChange: (field: string, value: any) => void;
  onBlur: (field: string) => void;
}

export const DialysisSessionStep: React.FC<DialysisSessionStepProps> = ({
  formData,
  errors,
  touched,
  onFieldChange,
  onBlur,
}) => {
  const getError = (field: string) => touched.has(field) ? errors[field] : undefined;

  return (
    <SectionCard
      title="Dialysis Session"
      description="Session measurements and vitals"
      icon={Calendar}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDateInput
          id="session-date"
          label="Session Date"
          value={formData.session.date}
          onChange={(value) => onFieldChange('session.date', value)}
          onBlur={() => onBlur('session.date')}
          required
          error={getError('session.date')}
        />
        <FormInput
          id="session-duration"
          label="Duration"
          type="number"
          value={formData.session.durationMinutes}
          onChange={(value) => onFieldChange('session.durationMinutes', value)}
          onBlur={() => onBlur('session.durationMinutes')}
          required
          error={getError('session.durationMinutes')}
          unit="min"
          min={15}
          max={720}
        />
        <FormInput
          id="session-pre-weight"
          label="Pre-Dialysis Weight"
          type="number"
          value={formData.session.preDialysisWeightKg}
          onChange={(value) => onFieldChange('session.preDialysisWeightKg', value)}
          onBlur={() => onBlur('session.preDialysisWeightKg')}
          required
          error={getError('session.preDialysisWeightKg')}
          unit="kg"
          step={0.1}
        />
        <FormInput
          id="session-post-weight"
          label="Post-Dialysis Weight"
          type="number"
          value={formData.session.postDialysisWeightKg}
          onChange={(value) => onFieldChange('session.postDialysisWeightKg', value)}
          onBlur={() => onBlur('session.postDialysisWeightKg')}
          required
          error={getError('session.postDialysisWeightKg')}
          unit="kg"
          step={0.1}
        />
        <FormInput
          id="session-weight-gain"
          label="Inter-Dialytic Weight Gain"
          type="number"
          value={formData.session.interDialyticWeightGainKg}
          onChange={(value) => onFieldChange('session.interDialyticWeightGainKg', value)}
          unit="kg"
          step={0.1}
          placeholder="Auto-calculated"
        />
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-foreground mb-2">Blood Pressure *</p>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="session-bp-systolic"
              label="Systolic"
              type="number"
              value={formData.session.bloodPressure.systolic}
              onChange={(value) => onFieldChange('session.bloodPressure.systolic', value)}
              onBlur={() => onBlur('session.bloodPressure.systolic')}
              required
              error={getError('session.bloodPressure.systolic')}
              unit="mmHg"
            />
            <FormInput
              id="session-bp-diastolic"
              label="Diastolic"
              type="number"
              value={formData.session.bloodPressure.diastolic}
              onChange={(value) => onFieldChange('session.bloodPressure.diastolic', value)}
              onBlur={() => onBlur('session.bloodPressure.diastolic')}
              required
              error={getError('session.bloodPressure.diastolic')}
              unit="mmHg"
            />
          </div>
        </div>
        <FormInput
          id="session-pulse"
          label="Pulse Rate"
          type="number"
          value={formData.session.pulseRate}
          onChange={(value) => onFieldChange('session.pulseRate', value)}
          unit="bpm"
        />
        <FormInput
          id="session-oxygen"
          label="Oxygen Saturation"
          type="number"
          value={formData.session.oxygenSaturationPercent}
          onChange={(value) => onFieldChange('session.oxygenSaturationPercent', value)}
          onBlur={() => onBlur('session.oxygenSaturationPercent')}
          error={getError('session.oxygenSaturationPercent')}
          unit="%"
          min={0}
          max={100}
        />
        <FormInput
          id="session-blood-flow"
          label="Blood Flow Rate"
          type="number"
          value={formData.session.bloodFlowRate}
          onChange={(value) => onFieldChange('session.bloodFlowRate', value)}
          onBlur={() => onBlur('session.bloodFlowRate')}
          required
          error={getError('session.bloodFlowRate')}
          unit="mL/min"
          min={50}
          max={600}
        />
        <FormInput
          id="session-arterial-pressure"
          label="Arterial Pressure"
          type="number"
          value={formData.session.arterialPressure}
          onChange={(value) => onFieldChange('session.arterialPressure', value)}
          unit="mmHg"
        />
        <FormInput
          id="session-venous-pressure"
          label="Venous Pressure"
          type="number"
          value={formData.session.venousPressure}
          onChange={(value) => onFieldChange('session.venousPressure', value)}
          unit="mmHg"
        />
        <FormInput
          id="session-transmembrane-pressure"
          label="Transmembrane Pressure"
          type="number"
          value={formData.session.transmembranePressure}
          onChange={(value) => onFieldChange('session.transmembranePressure', value)}
          unit="mmHg"
        />
        <FormInput
          id="session-ultrafiltration"
          label="Ultrafiltration Volume"
          type="number"
          value={formData.session.ultrafiltrationVolume}
          onChange={(value) => onFieldChange('session.ultrafiltrationVolume', value)}
          unit="mL"
        />
      </div>
    </SectionCard>
  );
};

