import React from 'react';
import { PatientForm, ValidationErrors } from '../../../../types/wardManagement';
import { ADMISSION_TYPES } from '../../../../utils/constants';
import ValidatedField from '../../ValidatedField';
import SectionTitle from '../../SectionTitle';

interface AdmissionSectionProps {
  form: PatientForm;
  errors: ValidationErrors;
  onChange: (field: keyof PatientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const AdmissionSection: React.FC<AdmissionSectionProps> = ({ form, errors, onChange }) => (
  <>
    <SectionTitle>Admission Details</SectionTitle>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <ValidatedField
        label="Ward *"
        error={errors.ward}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.ward}
            onChange={onChange("ward")}
          />
        }
      />
      <ValidatedField
        label="Ward Number"
        error={errors.wardNumber}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.wardNumber}
            onChange={onChange("wardNumber")}
          />
        }
      />
      <ValidatedField
        label="Bed ID"
        error={errors.bedId}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.bedId}
            onChange={onChange("bedId")}
          />
        }
      />
      <ValidatedField
        label="Date of Admission *"
        error={errors.admissionDate}
        children={
          <input
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.admissionDate}
            onChange={onChange("admissionDate")}
          />
        }
      />
      <ValidatedField
        label="Time of Admission"
        error={errors.admissionTime}
        children={
          <input
            type="time"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.admissionTime}
            onChange={onChange("admissionTime")}
          />
        }
      />
      <ValidatedField
        label="Type of Admission *"
        error={errors.admissionType}
        children={
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.admissionType}
            onChange={onChange("admissionType")}
          >
            <option value="">Select</option>
            {ADMISSION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        }
      />
      <ValidatedField
        label="Admitting Officer"
        error={errors.admittingOfficer}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.admittingOfficer}
            onChange={onChange("admittingOfficer")}
          />
        }
      />
      <ValidatedField
        label="Consultant Name"
        error={errors.consultantName}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.consultantName}
            onChange={onChange("consultantName")}
          />
        }
      />
      <ValidatedField
        label="Referring / Admitting Hospital"
        error={errors.referredBy}
        children={
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
            value={form.referredBy}
            onChange={onChange("referredBy")}
          />
        }
      />
    </div>

    <ValidatedField
      label="Presenting Complaints *"
      error={errors.presentingComplaints}
      children={
        <textarea
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
          rows={3}
          value={form.presentingComplaints}
          onChange={onChange("presentingComplaints")}
        />
      }
    />
  </>
);

export default AdmissionSection;