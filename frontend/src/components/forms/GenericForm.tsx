// components/forms/GenericForm.tsxの修正

import React, { useEffect } from 'react';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Select from '../common/Select';
import { validateForm, ValidationRule } from '../../utils/validation';

// フォームフィールドの型定義
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'tel' | 'postal';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: any;
  disabled?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  match?: string;
  customValidator?: (value: any, formData: Record<string, any>) => string | null;
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
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
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
  validateOnChange = false,
  validateOnBlur = true,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialValues);
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  // 初期値が変更された場合にフォームデータを更新
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  // バリデーションルールの作成
  const createValidationRules = (): ValidationRule[] => {
    return fields.map(field => ({
      field: field.name,
      label: field.label,
      rules: {
        required: field.required,
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        email: field.type === 'email',
        match: field.match,
        min: field.min,
        max: field.max,
        custom: field.customValidator,
      }
    }));
  };

  // フォームのバリデーション
  const validateFormData = () => {
    const rules = createValidationRules();
    const errors = validateForm(formData, rules);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // フォーム値変更ハンドラー
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    // 変更時バリデーション
    if (validateOnChange) {
      const rules = createValidationRules().filter(rule => rule.field === name);
      const fieldErrors = validateForm({ [name]: value }, rules);
      
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (fieldErrors[name]) {
          newErrors[name] = fieldErrors[name];
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  };

  // フォーカス喪失ハンドラー
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // ブラー時バリデーション
    if (validateOnBlur) {
      const rules = createValidationRules().filter(rule => rule.field === name);
      const fieldErrors = validateForm(formData, rules);
      
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (fieldErrors[name]) {
          newErrors[name] = fieldErrors[name];
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 全フィールドをタッチ済みにする
    const allTouched: Record<string, boolean> = {};
    fields.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    // バリデーション
    if (!validateFormData()) {
      return;
    }

    onSubmit(formData);
  };

  // フィールドのクラス名を取得
  const getFieldClassName = (fieldName: string) => {
    const baseClass = "form-control";
    if (touched[fieldName] && validationErrors[fieldName]) {
      return `${baseClass} is-invalid`;
    }
    if (touched[fieldName] && !validationErrors[fieldName]) {
      return `${baseClass} is-valid`;
    }
    return baseClass;
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
              onBlur={() => handleBlur(field.name)}
              options={field.options || []}
              disabled={loading || field.disabled}
              className={getFieldClassName(field.name)}
            />
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              className={getFieldClassName(field.name)}
              value={formData[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              disabled={loading || field.disabled}
              rows={field.rows || 3}
              minLength={field.minLength}
              maxLength={field.maxLength}
              required={field.required}
            />
          ) : field.type === 'checkbox' ? (
            <div className="form-check">
              <input
                type="checkbox"
                id={field.name}
                className="form-check-input"
                checked={formData[field.name] || false}
                onChange={e => handleChange(field.name, e.target.checked)}
                onBlur={() => handleBlur(field.name)}
                disabled={loading || field.disabled}
                required={field.required}
              />
            </div>
          ) : (
            <input
              type={field.type}
              id={field.name}
              className={getFieldClassName(field.name)}
              value={formData[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              disabled={loading || field.disabled}
              min={field.min}
              max={field.max}
              minLength={field.minLength}
              maxLength={field.maxLength}
              pattern={field.pattern?.source}
              required={field.required}
            />
          )}

          {touched[field.name] && validationErrors[field.name] && (
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
