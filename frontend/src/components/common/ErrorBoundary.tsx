// components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorMessage from './ErrorMessage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // エラーログの記録
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // エラー監視サービスへの送信などを行うことも可能
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // カスタムフォールバックUIが提供されている場合はそれを使用
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // デフォルトのエラーメッセージを表示
      return (
        <ErrorMessage
          title="エラーが発生しました"
          message="予期しないエラーが発生しました。ページを再読み込みしてください。"
          error={this.state.error}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
