import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const { isAuthenticated, login } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // コンポーネントマウント時のデバッグログ
  useEffect(() => {
    console.log("Login component mounted");
    console.log("Authentication state:", isAuthenticated);
  }, [isAuthenticated]);

  // すでに認証済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { username, password });
    
    try {
      await login(username, password);
      console.log("Login success");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || '認証に失敗しました');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">パートナー要員管理システム</h1>
        <p className="text-gray-600 text-center mb-8">アカウント情報でログインしてください</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ユーザー名を入力"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="パスワードを入力"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            ログイン
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">デモアカウント: admin / password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
