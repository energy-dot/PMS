/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Input from '../../../components/common/Input';
import LoginForm from '../../../components/forms/LoginForm';
import { useAuthStore } from '../../../store/authStore';

// TextEncoderとTextDecoderのポリフィル
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// モックの作成
jest.mock('../../../store/authStore', () => ({
  useAuthStore: jest.fn()
}));

/**
 * 入力バリデーションの境界値テスト
 * 
 * このテストでは、フォーム入力の境界値ケースをテストします。
 * 特に、空入力、最大長入力、特殊文字入力などのエッジケースに焦点を当てます。
 */
describe('Input Validation Edge Cases', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    const mockLogin = jest.fn();
    const mockClearError = jest.fn();

    const mockAuthStore = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: mockLogin,
      logout: jest.fn(),
      clearError: mockClearError
    };

    (useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);
  });

  // エッジケース1: 空文字入力
  test('validates empty input fields', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // 空のフォームを送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // バリデーションエラーが表示されることを確認
    expect(screen.getByText('ユーザー名は必須です')).toBeInTheDocument();
    expect(screen.getByText('パスワードは必須です')).toBeInTheDocument();
  });

  // エッジケース2: 空白のみの入力
  test('validates whitespace-only inputs', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // 空白のみの入力でフォームを送信
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: '   ' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // バリデーションエラーが表示されることを確認
    // 注: 実際の実装によっては、空白のみの入力も有効と見なされる場合があります
    expect(screen.getByText('ユーザー名は必須です')).toBeInTheDocument();
    expect(screen.getByText('パスワードは必須です')).toBeInTheDocument();
  });

  // エッジケース3: 極端に長い入力
  test('handles extremely long input values', () => {
    // 単体のInputコンポーネントをテスト
    render(<Input label="テスト" />);
    
    // 1000文字の長い文字列を生成
    const longString = 'a'.repeat(1000);
    
    // 長い文字列を入力
    fireEvent.change(screen.getByLabelText('テスト'), { target: { value: longString } });
    
    // 入力が受け付けられることを確認
    expect(screen.getByLabelText('テスト')).toHaveValue(longString);
  });

  // エッジケース4: 特殊文字を含む入力
  test('handles inputs with special characters', () => {
    // 単体のInputコンポーネントをテスト
    render(<Input label="テスト" />);
    
    // 特殊文字を含む文字列
    const specialChars = '!@#$%^&*()_+{}|:"<>?[];\',./-=';
    
    // 特殊文字を入力
    fireEvent.change(screen.getByLabelText('テスト'), { target: { value: specialChars } });
    
    // 入力が受け付けられることを確認
    expect(screen.getByLabelText('テスト')).toHaveValue(specialChars);
  });

  // エッジケース5: 日本語や絵文字などの非ASCII文字
  test('handles non-ASCII characters', () => {
    // 単体のInputコンポーネントをテスト
    render(<Input label="テスト" />);
    
    // 日本語と絵文字を含む文字列
    const nonAsciiChars = '日本語テスト😊🎉🔥';
    
    // 非ASCII文字を入力
    fireEvent.change(screen.getByLabelText('テスト'), { target: { value: nonAsciiChars } });
    
    // 入力が受け付けられることを確認
    expect(screen.getByLabelText('テスト')).toHaveValue(nonAsciiChars);
  });

  // エッジケース6: HTMLタグを含む入力（XSS対策）
  test('handles inputs with HTML tags', () => {
    // 単体のInputコンポーネントをテスト
    render(<Input label="テスト" />);
    
    // HTMLタグを含む文字列
    const htmlString = '<script>alert("XSS")</script><img src="x" onerror="alert(\'XSS\')">';
    
    // HTMLタグを含む文字列を入力
    fireEvent.change(screen.getByLabelText('テスト'), { target: { value: htmlString } });
    
    // 入力が受け付けられることを確認（エスケープされるべき）
    expect(screen.getByLabelText('テスト')).toHaveValue(htmlString);
  });
});
