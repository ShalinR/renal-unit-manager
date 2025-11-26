import React from 'react';
import { PatientForm, ValidationErrors } from '../../../../types/wardManagement';
import ValidatedField from '../../ValidatedField';
import SectionTitle from '../../SectionTitle';

interface ExaminationSectionProps {
  form: PatientForm;
  errors: ValidationErrors;
  onChange: (field: keyof PatientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ExaminationSection: React.FC<ExaminationSectionProps> = ({ form, errors, onChange }) => {
  const bmi = form.examHeightCm && form.examWeightKg
    ? (() => {
        const h = Number(form.examHeightCm);
        const w = Number(form.examWeightKg);
        if (!h || !w) return "";
        const m = h / 100;
        return (w / (m * m)).toFixed(1);
      })()
    : "";

  return (
    <>
      <SectionTitle>Examinations</SectionTitle>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <ValidatedField
          label="Temperature (°C)"
          error={errors.examTempC}
          children={
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
              value={form.examTempC}
              onChange={onChange("examTempC")}
            />
          }
        />
        <ValidatedField
          label="Height (cm)"
          error={errors.examHeightCm}
          children={
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
              value={form.examHeightCm}
              onChange={onChange("examHeightCm")}
            />
          }
        />
        <ValidatedField
          label="Body Weight (kg)"
          error={errors.examWeightKg}
          children={
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
              value={form.examWeightKg}
              onChange={onChange("examWeightKg")}
            />
          }
        />
        <ValidatedField
          label="BMI (auto)"
          error={undefined}
          children={
            <input
              readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
              value={bmi}
            />
          }
        />
        <ValidatedField
          label="Blood Pressure (mmHg)"
          error={errors.examBloodPressure}
          children={
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
              value={form.examBloodPressure}
              onChange={onChange("examBloodPressure")}
              placeholder="e.g. 140/90"
            />
          }
        />
        <ValidatedField
          label="Heart Rate (bpm)"
          error={errors.examHeartRate}
          children={
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
              value={form.examHeartRate}
              onChange={onChange("examHeartRate")}
            />
          }
        />
        <ValidatedField
          label="Primary Diagnosis"
          error={errors.primaryDiagnosis}
          children={
            <textarea
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
              value={form.primaryDiagnosis}
              onChange={onChange("primaryDiagnosis")}
              rows={4} 
            />
          }
        />
      </div>
    </>
  );
};

export default ExaminationSection;