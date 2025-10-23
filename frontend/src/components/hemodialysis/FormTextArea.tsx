import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormTextAreaProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  rows?: number;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  required = false,
  error,
  placeholder,
  rows = 4,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label>
      <Textarea
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        rows={rows}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

