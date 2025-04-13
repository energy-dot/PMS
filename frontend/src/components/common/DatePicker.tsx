import React from 'react';

interface DatePickerProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
  minDate,
  maxDate,
  placeholder = '日付を選択',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        min={minDate}
        max={maxDate}
        placeholder={placeholder}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;
