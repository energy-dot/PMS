// components/common/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  error?: Error | null;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'エラー',
  message,
  error,
  onRetry
}) => {
  return (
    <div className="error-message-container" style={{
      padding: '1rem',
      margin: '1rem 0',
      backgroundColor: '#fff5f5',
      border: '1px solid #feb2b2',
      borderRadius: '0.375rem',
      color: '#c53030'
    }}>
      <h3 style={{ marginTop: 0, color: '#c53030' }}>{title}</h3>
      <p>{message}</p>
      
      {error && process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <summary>詳細情報（開発環境のみ表示）</summary>
          <pre style={{ 
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#fff',
            border: '1px solid #eee',
            borderRadius: '0.25rem',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {error.toString()}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#c53030',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          再試行
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
