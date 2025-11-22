import React from 'react';

interface ReadFieldProps {
  label: string;
  value?: string;
}

const ReadField: React.FC<ReadFieldProps> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-medium text-slate-500">{label}</span>
    <input
      readOnly
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
      value={value || ""}
    />
  </div>
);

export default ReadField;