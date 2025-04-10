import React from 'react';
import { useForm, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../common/Button';
import Alert from '../common/Alert';

type GenericFormProps<T extends z.ZodTypeAny> = {
  schema: T;
  defaultValues?: z.infer<T>;
  onSubmit: SubmitHandler<z.infer<T>>;
  children: (methods: UseFormReturn<z.infer<T>>) => React.ReactNode;
  submitLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  cancelButton?: boolean;
  onCancel?: () => void;
};

/**
 * 汎用フォームコンポーネント
 * Zodスキーマを使用したバリデーション機能付きフォーム
 */
function GenericForm<T extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  children,
  submitLabel = '保存',
  isLoading = false,
  error = null,
  onClearError,
  cancelButton = false,
  onCancel
}: GenericFormProps<T>) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert 
          variant="error" 
          message={error} 
          onClose={onClearError} 
        />
      )}

      {children(methods)}

      <div className="flex justify-end space-x-4 pt-4">
        {cancelButton && (
          <Button 
            type="button" 
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            キャンセル
          </Button>
        )}
        <Button 
          type="submit" 
          variant="primary"
          isLoading={isLoading}
          disabled={!formState.isValid || isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default GenericForm;