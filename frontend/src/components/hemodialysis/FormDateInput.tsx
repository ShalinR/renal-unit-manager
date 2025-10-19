import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDateToDDMMYYYY, parseDDMMYYYYToISO, formatDateToInputValue } from '@/lib/dateUtils';

interface FormDateInputProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
}

export const FormDateInput: React.FC<FormDateInputProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  required = false,
  error,
}) => {
  const [displayValue, setDisplayValue] = useState(formatDateToDDMMYYYY(value));
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label>
      <Input
        id={id}
        type="date"
        value={formatDateToInputValue(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      <p className="text-xs text-muted-foreground">Format: dd/mm/yyyy</p>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
