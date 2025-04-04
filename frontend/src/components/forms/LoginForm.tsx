import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuthStore } from '../../store/authStore';

// Zodによるバリデーションスキーマ
const loginSchema = z.object({
  username: z.string().min(1, 'ユーザー名は必須です'),
  password: z.string().min(1, 'パスワードは必須です'),
});

// 入力フォームの型定義
type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await login(data.username, data.password);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">ログイン</h2>
      
      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={clearError}
        />
      )}
      
      <Input
        label="ユーザー名"
        {...register('username')}
        error={errors.username?.message}
        fullWidth
      />
      
      <Input
        label="パスワード"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        fullWidth
      />
      
      <div className="mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          fullWidth
        >
          ログイン
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
