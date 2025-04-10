import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/layout/Header';
import userEvent from '@testing-library/user-event';

// Headerコンポーネントは react-router-dom の Link を使用しているため、
// テスト時には BrowserRouter でラップする必要があります
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  test('renders application title', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('パートナー要員管理システム')).toBeInTheDocument();
  });

  test('title links to home page', () => {
    renderWithRouter(<Header />);
    const titleLink = screen.getByText('パートナー要員管理システム');
    expect(titleLink.closest('a')).toHaveAttribute('href', '/');
  });

  test('displays notification button with badge', () => {
    renderWithRouter(<Header />);
    const notificationButton = screen.getByText(/通知/i);
    expect(notificationButton).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('displays user name', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
  });

  test('displays logout button', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('ログアウト')).toBeInTheDocument();
  });
});
