import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormSelectProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
  options: string[];
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  required = false,
  error,
  options,
  placeholder = 'Select an option',
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          onBlur={onBlur}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={error ? 'border-destructive focus:ring-destructive' : ''}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

