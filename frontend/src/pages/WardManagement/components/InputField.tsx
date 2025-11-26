import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string;
  max?: string;
  step?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  min, 
  max,
  step 
}) => (
  <label className="flex flex-col gap-1 text-xs">
    <span className="text-[11px] font-medium text-slate-600">{label}</span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
    />
  </label>
);

export default InputField;