import React from 'react';
import { PatientForm, ValidationErrors } from '../../../../types/wardManagement';
import ValidatedField from '../../ValidatedField';
import SectionTitle from '../../SectionTitle';

interface IdentitySectionProps {
  form: PatientForm;
  errors: ValidationErrors;
  onChange: (field: keyof PatientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const IdentitySection: React.FC<IdentitySectionProps> = ({ form, errors, onChange }) => (
  <>
    <SectionTitle>Identity</SectionTitle>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <ValidatedField
        label="PHN *"
        error={errors.phn}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.phn}
            onChange={onChange("phn")}
          />
        }
      />
      <ValidatedField
        label="BHT Number (optional)"
        error={errors.bht}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.bht}
            onChange={onChange("bht")}
          />
        }
      />
      <ValidatedField
        label="Patient Name *"
        error={errors.name}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.name}
            onChange={onChange("name")}
          />
        }
      />
      <ValidatedField
        label="Date of Birth *"
        error={errors.dob}
        children={
          <input
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.dob}
            onChange={onChange("dob")}
          />
        }
      />
      <ValidatedField
        label="Sex *"
        error={errors.sex}
        children={
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.sex}
            onChange={onChange("sex")}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        }
      />
    </div>
  </>
);

export default IdentitySection;