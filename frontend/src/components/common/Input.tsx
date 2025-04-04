import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-error-color' : '';

  return (
    <div className={`form-group ${widthClass}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`form-input ${errorClass} ${className}`}
        {...rest}
      />
      {error && <div className="form-error">{error}</div>}
      {helperText && !error && <div className="text-gray-500 text-sm mt-1">{helperText}</div>}
    </div>
  );
};

export default Input;
