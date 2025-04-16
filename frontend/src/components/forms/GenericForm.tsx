// components/forms/GenericForm.tsxの修正

import React from 'react';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Select from '../common/Select';

// フォームフィールドの型定義
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: any;
  disabled?: boolean;
  rows?: number;
  min?: number;
  max?: number;
}

// GenericFormのプロパティ型を定義
interface GenericFormProps {
  fields: FormField[];
  onSubmit: (formData: Record<string, any>) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  initialValues?: Record<string, any>;
}

// GenericFormコンポーネント
const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  onSubmit,
  submitButtonText = '保存',
  cancelButtonText = 'キャンセル',
  onCancel,
  loading = false,
  error,
  initialValues = {},
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialValues);
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  // フォーム値変更ハンドラー
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // エラーをクリア
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const errors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label}は必須です`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="generic-form">
      {error && <Alert type="danger" message={error} />}

      {fields.map((field, index) => (
        <div key={index} className="form-group">
          <label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>

          {field.type === 'select' ? (
            <Select
              id={field.name}
              value={formData[field.name] || ''}
              onChange={value => handleChange(field.name, value)}
              options={field.options || []}
              disabled={loading || field.disabled}
            />
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              className="form-control"
              value={formData[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={loading || field.disabled}
              rows={field.rows || 3}
            />
          ) : field.type === 'checkbox' ? (
            <div className="form-check">
              <input
                type="checkbox"
                id={field.name}
                className="form-check-input"
                checked={formData[field.name] || false}
                onChange={e => handleChange(field.name, e.target.checked)}
                disabled={loading || field.disabled}
              />
            </div>
          ) : (
            <input
              type={field.type}
              id={field.name}
              className="form-control"
              value={formData[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={loading || field.disabled}
              min={field.min}
              max={field.max}
            />
          )}

          {validationErrors[field.name] && (
            <div className="invalid-feedback d-block">{validationErrors[field.name]}</div>
          )}
        </div>
      ))}

      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelButtonText}
          </Button>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? '処理中...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default GenericForm;
