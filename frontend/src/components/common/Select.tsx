// Selectコンポーネントの型定義
import React, { ChangeEvent, SelectHTMLAttributes } from 'react';

// Selectコンポーネントのプロパティ型定義
export interface SelectOption {
  value: any;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
}

// Selectコンポーネント
const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  ...rest
}) => {
  return (
    <div className="form-group mb-3">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        {...rest}
      >
        <option value="">選択してください</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Select;
