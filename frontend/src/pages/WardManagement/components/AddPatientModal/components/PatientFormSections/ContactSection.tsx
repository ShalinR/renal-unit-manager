import React from 'react';
import { PatientForm, ValidationErrors } from '../../../../types/wardManagement';
import ValidatedField from '../../ValidatedField';
import SectionTitle from '../../SectionTitle';

interface ContactSectionProps {
  form: PatientForm;
  errors: ValidationErrors;
  onChange: (field: keyof PatientForm) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ form, errors, onChange }) => (
  <>
    <SectionTitle>Contact & Socio-demographic</SectionTitle>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <ValidatedField
        label="Telephone (10 digits)"
        error={errors.phone}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.phone}
            onChange={onChange("phone")}
            maxLength={10}
          />
        }
      />
      <ValidatedField
        label="NIC (10 characters)"
        error={errors.nic}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.nic}
            onChange={onChange("nic")}
            maxLength={10}
          />
        }
      />
      <ValidatedField
        label="MOH Area"
        error={errors.mohArea}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.mohArea}
            onChange={onChange("mohArea")}
          />
        }
      />
      <ValidatedField
        label="Address"
        error={errors.address}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.address}
            onChange={onChange("address")}
          />
        }
      />
      <ValidatedField
        label="Ethnic Group"
        error={errors.ethnicGroup}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.ethnicGroup}
            onChange={onChange("ethnicGroup")}
          />
        }
      />
      <ValidatedField
        label="Religion"
        error={errors.religion}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.religion}
            onChange={onChange("religion")}
          />
        }
      />
      <ValidatedField
        label="Occupation"
        error={errors.occupation}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.occupation}
            onChange={onChange("occupation")}
          />
        }
      />
      <ValidatedField
        label="Marital Status"
        error={errors.maritalStatus}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.maritalStatus}
            onChange={onChange("maritalStatus")}
          />
        }
      />
    </div>
  </>
);

export default ContactSection;