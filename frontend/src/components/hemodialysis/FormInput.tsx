import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'date';
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  required = false,
  error,
  unit,
  min,
  max,
  step,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value ?? ''}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${error ? 'border-destructive focus-visible:ring-destructive' : ''} ${unit ? 'pr-16' : ''}`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

