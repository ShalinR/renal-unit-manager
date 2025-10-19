import React from 'react';
import { SectionCard } from '@/components/hemodialysis/SectionCard';
import { FormInput } from '@/components/hemodialysis/FormInput';
import { FormSelect } from '@/components/hemodialysis/FormSelect';
import { FormTextArea } from '@/components/hemodialysis/FormTextArea';
import { Activity } from 'lucide-react';
import { HemodialysisRecord, AccessType, ValidationErrors } from '@/types/hemodialysis';

interface HDPrescriptionStepProps {
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

export const HDPrescriptionStep: React.FC<HDPrescriptionStepProps> = ({
  formData,
  errors,
  touched,
  onFieldChange,
  onBlur,
}) => {
  const getError = (field: string) => touched.has(field) ? errors[field] : undefined;

  return (
    <SectionCard
      title="HD Prescription"
      description="Dialysis prescription parameters"
      icon={Activity}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          id="prescription-access"
          label="Access"
          value={formData.prescription.access}
          onChange={(value) => onFieldChange('prescription.access', value as AccessType)}
          onBlur={() => onBlur('prescription.access')}
          required
          error={getError('prescription.access')}
          options={ACCESS_OPTIONS}
        />
        <FormInput
          id="prescription-duration"
          label="Duration"
          type="number"
          value={formData.prescription.durationMinutes}
          onChange={(value) => onFieldChange('prescription.durationMinutes', value)}
          onBlur={() => onBlur('prescription.durationMinutes')}
          required
          error={getError('prescription.durationMinutes')}
          unit="min"
          min={15}
          max={720}
        />
        <FormInput
          id="prescription-sodium"
          label="Sodium"
          type="number"
          value={formData.prescription.sodium}
          onChange={(value) => onFieldChange('prescription.sodium', value)}
          unit="mmol/L"
        />
        <FormInput
          id="prescription-bicarbonate"
          label="Bicarbonate"
          type="number"
          value={formData.prescription.bicarbonate}
          onChange={(value) => onFieldChange('prescription.bicarbonate', value)}
          unit="mmol/L"
        />
        <FormInput
          id="prescription-blood-flow"
          label="Blood Flow Rate"
          type="number"
          value={formData.prescription.bloodFlowRate}
          onChange={(value) => onFieldChange('prescription.bloodFlowRate', value)}
          onBlur={() => onBlur('prescription.bloodFlowRate')}
          required
          error={getError('prescription.bloodFlowRate')}
          unit="mL/min"
          min={50}
          max={600}
        />
        <FormInput
          id="prescription-dialysate-flow"
          label="Dialysate Flow Rate"
          type="number"
          value={formData.prescription.dialysateFlowRate}
          onChange={(value) => onFieldChange('prescription.dialysateFlowRate', value)}
          unit="mL/min"
        />
        <FormInput
          id="prescription-temperature"
          label="Temperature"
          type="number"
          value={formData.prescription.temperature}
          onChange={(value) => onFieldChange('prescription.temperature', value)}
          onBlur={() => onBlur('prescription.temperature')}
          error={getError('prescription.temperature')}
          unit="°C"
          min={34}
          max={40}
          step={0.1}
        />
        <FormInput
          id="prescription-dry-weight"
          label="Dry Weight"
          type="number"
          value={formData.prescription.dryWeightKg}
          onChange={(value) => onFieldChange('prescription.dryWeightKg', value)}
          onBlur={() => onBlur('prescription.dryWeightKg')}
          required
          error={getError('prescription.dryWeightKg')}
          unit="kg"
          step={0.1}
        />
        <FormInput
          id="prescription-ultrafiltration"
          label="Ultrafiltration Volume"
          type="number"
          value={formData.prescription.ultrafiltrationVolume}
          onChange={(value) => onFieldChange('prescription.ultrafiltrationVolume', value)}
          unit="mL"
        />
        <FormInput
          id="prescription-anticoagulation"
          label="Anticoagulation"
          value={formData.prescription.anticoagulation}
          onChange={(value) => onFieldChange('prescription.anticoagulation', value)}
          placeholder="Type and dose"
        />
        <FormInput
          id="prescription-erythropoetin"
          label="Erythropoetin Dose"
          value={formData.prescription.erythropoetinDose}
          onChange={(value) => onFieldChange('prescription.erythropoetinDose', value)}
        />
      </div>
      <div className="mt-4">
        <FormTextArea
          id="prescription-dialysis-profile"
          label="Dialysis Profile"
          value={formData.prescription.dialysisProfile}
          onChange={(value) => onFieldChange('prescription.dialysisProfile', value)}
          rows={3}
        />
      </div>
      <div className="mt-4">
        <FormTextArea
          id="prescription-other-treatment"
          label="Other Treatment"
          value={formData.prescription.otherTreatment}
          onChange={(value) => onFieldChange('prescription.otherTreatment', value)}
          rows={3}
        />
      </div>
    </SectionCard>
  );
};
