import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import NotificationBell from '../notifications/NotificationBell';
import { menuItems, MenuItem } from '../../constants/menuItems';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed: propCollapsed, onToggle }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // 内部状態とpropsのどちらを使うか決定
  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;

  // 内部またはpropsを通じてトグル
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  // ユーザーがない場合は何も表示しない（認証されていない場合）
  if (!user) return null;

  // 現在のユーザーロールに基づいてフィルタリング
  const filteredNavItems = menuItems.filter(item => !item.roles || item.roles.includes(user.role));

  return (
    <div
      className={`bg-gray-900 text-white h-screen fixed top-0 left-0 z-20 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* ロゴ */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {!collapsed && <Link to="/" className="text-xl font-bold">PMS</Link>}
        <button
          onClick={handleToggle}
          className="p-2 rounded-full hover:bg-gray-700 focus:outline-none ml-auto"
          aria-label={collapsed ? 'サイドバーを展開' : 'サイドバーを折りたたむ'}
        >
          {collapsed ? (
            <span className="material-icons">chevron_right</span>
          ) : (
            <span className="material-icons">chevron_left</span>
          )}
        </button>
      </div>

      {/* 通知ベル */}
      <div className="px-4 py-2">
        {!collapsed && user && <NotificationBell userId={user.id || ''} />}
      </div>
      
      {/* ユーザー情報 */}
      <div className="px-4 py-2 border-b border-gray-700">
        <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user.fullName ? user.fullName.charAt(0) : 'U'}
          </div>

          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.fullName || '管理者'}</p>
              <p className="text-xs text-gray-400">
                {user.role === 'admin' && '管理者'}
                {user.role === 'developer' && '開発担当者'}
                {user.role === 'partner_manager' && 'パートナー管理担当者'}
                {user.role === 'viewer' && '閲覧者'}
              </p>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <button 
            onClick={logout}
            className="mt-2 w-full px-3 py-1 text-sm text-white bg-gray-700 rounded hover:bg-gray-600"
          >
            ログアウト
          </button>
        )}
      </div>

      {/* ナビゲーションメニュー */}
      <nav className="mt-5 px-2 space-y-1 flex-1 overflow-y-auto">
        {filteredNavItems.map(item => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <span className="material-icons">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.label}</span>}

              {!collapsed && item.count && (
                <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
