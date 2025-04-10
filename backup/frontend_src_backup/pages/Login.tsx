import React from 'react';
import LoginForm from '../components/forms/LoginForm';

const Login: React.FC = () => {
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
