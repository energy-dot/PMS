import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

/**
 * 共通の入力フィールドコンポーネント
 * React Hook FormやZodと連携して使用できます
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, helperText, className = '', ...props }, ref) => {
    // 一意のIDを生成（ラベルと入力フィールドを関連付けるため）
    const id = props.id || `input-${props.name || Math.random().toString(36).substring(2, 9)}`;
    
    // エラー状態のスタイル
    const errorClass = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    
    // コンテナのスタイル
    const containerClass = `${fullWidth ? 'w-full' : ''} ${className}`;
    
    // 入力フィールドのスタイル
    const inputClass = `border ${errorClass} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 p-2 ${fullWidth ? 'w-full' : ''}`;
    
    return (
      <div className={containerClass}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          id={id}
          ref={ref}
          className={inputClass}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;