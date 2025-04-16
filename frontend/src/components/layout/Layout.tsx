// components/layout/Layout.tsxの修正

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from '../notifications/NotificationBell';
import { useAuthStore } from '../../store/user/authStore';

// Layoutのプロパティ型を定義
interface LayoutProps {
  children: React.ReactNode;
}

// Layoutコンポーネント
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  // 現在のパスがアクティブかどうかを判定
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // サイドバーメニュー項目
  const menuItems = [
    {
      path: '/dashboard',
      label: 'ダッシュボード',
      icon: 'dashboard',
      roles: ['developer', 'partner_manager', 'admin', 'viewer'],
    },
    {
      path: '/partners',
      label: 'パートナー管理',
      icon: 'business',
      roles: ['partner_manager', 'admin'],
    },
    {
      path: '/staffs',
      label: 'スタッフ管理',
      icon: 'people',
      roles: ['partner_manager', 'admin'],
    },
    {
      path: '/projects',
      label: 'プロジェクト管理',
      icon: 'assignment',
      roles: ['developer', 'partner_manager', 'admin', 'viewer'],
    },
    {
      path: '/applications',
      label: '申請管理',
      icon: 'description',
      roles: ['developer', 'partner_manager', 'admin'],
    },
    {
      path: '/contracts',
      label: '契約管理',
      icon: 'receipt',
      roles: ['partner_manager', 'admin'],
    },
    {
      path: '/evaluations',
      label: '評価管理',
      icon: 'star',
      roles: ['developer', 'partner_manager', 'admin'],
    },
    {
      path: '/reports',
      label: 'レポート',
      icon: 'assessment',
      roles: ['partner_manager', 'admin', 'viewer'],
    },
    {
      path: '/users',
      label: 'ユーザー管理',
      icon: 'admin_panel_settings',
      roles: ['admin'],
    },
  ];

  // ユーザーの権限に基づいてメニュー項目をフィルタリング
  const filteredMenuItems = menuItems.filter(item => {
    if (!user || !user.role) return false;
    return item.roles.includes(user.role);
  });

  return (
    <div className="layout">
      {isAuthenticated ? (
        <>
          <header className="header">
            <div className="header-left">
              <div className="logo">
                <Link to="/dashboard">PMS</Link>
              </div>
            </div>
            <div className="header-right">
              {user && <NotificationBell userId={user.id || ''} />}
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-name">{user?.fullName}</span>
                  <span className="user-role">{user?.role}</span>
                </div>
                <div className="user-actions">
                  <button onClick={logout}>ログアウト</button>
                </div>
              </div>
            </div>
          </header>
          <div className="main-container">
            <aside className="sidebar">
              <nav className="sidebar-nav">
                <ul>
                  {filteredMenuItems.map((item, index) => (
                    <li key={index} className={isActive(item.path) ? 'active' : ''}>
                      <Link to={item.path}>
                        <i className="material-icons">{item.icon}</i>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
            <main className="content">{children}</main>
          </div>
        </>
      ) : (
        <main className="content-full">{children}</main>
      )}
    </div>
  );
};

export default Layout;
