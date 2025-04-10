import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // すでに認証済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-color">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">パートナー要員管理システム</h1>
          <p className="text-gray-600">アカウント情報でログインしてください</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;