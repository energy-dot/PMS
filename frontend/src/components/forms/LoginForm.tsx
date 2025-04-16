// components/forms/LoginForm.tsxの修正

import React, { useState } from 'react';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { validatePasswordStrength } from '../../utils/validation';

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
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; message: string } | null>(null);
  const [touched, setTouched] = useState<{ username: boolean; password: boolean }>({ username: false, password: false });

  // ユーザー名変更ハンドラー
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setTouched(prev => ({ ...prev, username: true }));
    
    // バリデーションエラーをクリア
    if (validationError && !e.target.value.trim()) {
      setValidationError('ユーザー名を入力してください');
    } else if (validationError) {
      setValidationError(null);
    }
  };

  // パスワード変更ハンドラー
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setTouched(prev => ({ ...prev, password: true }));
    
    // パスワード強度の検証
    if (newPassword) {
      setPasswordStrength(validatePasswordStrength(newPassword));
    } else {
      setPasswordStrength(null);
    }
    
    // バリデーションエラーをクリア
    if (validationError && !newPassword) {
      setValidationError('パスワードを入力してください');
    } else if (validationError) {
      setValidationError(null);
    }
  };

  // フォーカス喪失ハンドラー
  const handleBlur = (field: 'username' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // バリデーション
    if (field === 'username' && !username.trim()) {
      setValidationError('ユーザー名を入力してください');
    } else if (field === 'password' && !password) {
      setValidationError('パスワードを入力してください');
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 全フィールドをタッチ済みにする
    setTouched({ username: true, password: true });

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

  // フィールドのクラス名を取得
  const getFieldClassName = (field: 'username' | 'password') => {
    const baseClass = "form-control";
    const fieldValue = field === 'username' ? username : password;
    
    if (touched[field] && !fieldValue) {
      return `${baseClass} is-invalid`;
    }
    if (touched[field] && fieldValue) {
      return `${baseClass} is-valid`;
    }
    return baseClass;
  };

  // パスワード強度インジケーターのスタイル
  const getPasswordStrengthStyle = () => {
    if (!passwordStrength) return {};
    
    const { score } = passwordStrength;
    let color = '';
    let width = '0%';
    
    if (score === 1) {
      color = '#ff4d4d'; // 赤
      width = '20%';
    } else if (score === 2) {
      color = '#ffaa00'; // オレンジ
      width = '40%';
    } else if (score === 3) {
      color = '#ffff00'; // 黄色
      width = '60%';
    } else if (score === 4) {
      color = '#00cc00'; // 緑
      width = '80%';
    } else if (score === 5) {
      color = '#00aa00'; // 濃い緑
      width = '100%';
    }
    
    return {
      backgroundColor: color,
      width,
      height: '5px',
      borderRadius: '2px',
      transition: 'width 0.3s, background-color 0.3s'
    };
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
        <label htmlFor="username">
          ユーザー名
          <span className="required">*</span>
        </label>
        <input
          type="text"
          id="username"
          className={getFieldClassName('username')}
          value={username}
          onChange={handleUsernameChange}
          onBlur={() => handleBlur('username')}
          disabled={loading}
          required
        />
        {touched.username && !username.trim() && (
          <div className="invalid-feedback d-block">ユーザー名を入力してください</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">
          パスワード
          <span className="required">*</span>
        </label>
        <input
          type="password"
          id="password"
          className={getFieldClassName('password')}
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur('password')}
          disabled={loading}
          required
        />
        {touched.password && !password && (
          <div className="invalid-feedback d-block">パスワードを入力してください</div>
        )}
        
        {/* パスワード強度インジケーター */}
        {password && passwordStrength && (
          <div className="password-strength-container" style={{ marginTop: '5px' }}>
            <div className="password-strength-bar" style={{ backgroundColor: '#e0e0e0', height: '5px', borderRadius: '2px' }}>
              <div className="password-strength-indicator" style={getPasswordStrengthStyle()}></div>
            </div>
            <div className="password-strength-text" style={{ fontSize: '0.75rem', marginTop: '3px', color: '#666' }}>
              {passwordStrength.message}
            </div>
          </div>
        )}
      </div>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'ログイン中...' : 'ログイン'}
      </Button>
    </form>
  );
};

export default LoginForm;
