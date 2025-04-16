// components/forms/LoginForm.tsxの修正

import React, { useState } from 'react';
import Button from '../common/Button';
import Alert from '../common/Alert';

// LoginFormのプロパティ型を定義
interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  error?: string;
  loading?: boolean;
}

// LoginFormコンポーネント
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error, loading = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // フォーム送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 入力検証
    if (!username.trim()) {
      setValidationError('ユーザー名を入力してください');
      return;
    }

    if (!password) {
      setValidationError('パスワードを入力してください');
      return;
    }

    setValidationError(null);
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {(error || validationError) && (
        <Alert
          type="danger"
          message={error || validationError || ''}
          onClose={() => setValidationError(null)}
        />
      )}

      <div className="form-group">
        <label htmlFor="username">ユーザー名</label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">パスワード</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'ログイン中...' : 'ログイン'}
      </Button>
    </form>
  );
};

export default LoginForm;
