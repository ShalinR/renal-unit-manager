import React from 'react';

interface HeaderFieldProps {
  label: string;
  value?: any;
}

const HeaderField: React.FC<HeaderFieldProps> = ({ label, value }) => {
  const safeValue =
    value === null || value === undefined || value === "" ? "–" : String(value);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-900">
        {safeValue}
      </span>
    </div>
  );
};

export default HeaderField;