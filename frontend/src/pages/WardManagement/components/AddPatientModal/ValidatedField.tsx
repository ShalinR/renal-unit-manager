import React from 'react';

interface ValidatedFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const ValidatedField: React.FC<ValidatedFieldProps> = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-medium text-slate-600">{label}</span>
    {children}
    {error && (
      <span className="text-[10px] font-medium text-red-500">
        {error}
      </span>
    )}
  </div>
);

export default ValidatedField;