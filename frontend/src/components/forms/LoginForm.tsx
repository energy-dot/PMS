import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuthStore } from '../../store/authStore';

// バリデーションスキーマの定義
const loginSchema = z.object({
  username: z.string().min(1, 'ユーザー名は必須です'),
  password: z.string().min(1, 'パスワードは必須です'),
});

// 入力フォームの型定義
type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, networkError, clearError, isAuthenticated } = useAuthStore();
  
  // リダイレクト先を取得（デフォルトはダッシュボード）
  const from = location.state?.from?.pathname || '/';
  
  // 認証状態が変わったときにリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });
  
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.username, data.password);
    } catch (error) {
      // エラーはuseAuthStoreで処理されているのでここでは何もしない
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card p-6 shadow-lg bg-white rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">ログイン</h2>
      
      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={clearError}
        />
      )}
      
      <div className="mb-4">
        <Input
          label="ユーザー名"
          {...register('username')}
          error={errors.username?.message}
          fullWidth
          data-testid="username-input"
        />
      </div>
      
      <div className="mb-6">
        <Input
          label="パスワード"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          fullWidth
          data-testid="password-input"
        />
      </div>
      
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        fullWidth
        data-testid="login-button"
      >
        ログイン
      </Button>
      
      {networkError && (
        <div className="mt-4 text-center text-sm text-red-600">
          <p className="font-medium">サーバー接続エラー</p>
          <p>サーバーが起動していない可能性があります。<br />
          システム管理者に連絡するか、start-system.shを実行してください。</p>
        </div>
      )}
    </form>
  );
};

export default LoginForm;