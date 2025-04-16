import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // ユーザーがない場合は何も表示しない（認証されていない場合）
  if (!user) return null;

  // 外側クリックを検出して、メニューを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ログアウトハンドラー
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ダミー通知データ
  const notifications = [
    {
      id: 1,
      title: '契約期間終了間近',
      message: '山田太郎さんの契約が30日以内に終了します。',
      time: '15分前',
      read: false,
    },
    {
      id: 2,
      title: '新規案件申請の承認依頼',
      message: '佐藤一郎さんから申請があります。',
      time: '1時間前',
      read: false,
    },
    {
      id: 3,
      title: '反社チェック有効期限切れ',
      message: '株式会社テクノソリューションズの反社チェックの有効期限が切れています。',
      time: '3時間前',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white h-16 shadow z-10 flex items-center fixed top-0 right-0 left-0 px-6 ml-64">
      <div className="flex-1 flex items-center justify-between">
        {/* ページタイトル（オプション） */}
        {pageTitle && (
          <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
            パートナー要員管理システム
          </h1>
        )}

        {/* 右側の要素（通知とユーザーメニュー） */}
        <div className="flex items-center ml-auto">
          {/* 検索バー */}
          <div className="hidden md:block mr-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="検索..."
                className="block w-full bg-gray-100 border border-transparent rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* 通知ボタン */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {/* 未読通知バッジ */}
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* 通知ドロップダウン */}
            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">通知</h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {unreadCount}件の未読
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map(notification => (
                          <Link
                            key={notification.id}
                            to="/notifications"
                            className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${notification.read ? '' : 'bg-blue-50'}`}
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {notification.time}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">通知はありません</div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 px-4 py-2">
                    <Link
                      to="/notifications"
                      className="block text-center text-sm font-medium text-primary-600 hover:text-primary-800"
                      onClick={() => setShowNotifications(false)}
                    >
                      すべての通知を見る
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 区切り線 */}
          <div className="h-6 w-px bg-gray-300 mx-3" />

          {/* ユーザーメニュー */}
          <div className="relative ml-3" ref={userMenuRef}>
            <div>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                id="user-menu-button"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <span className="sr-only">ユーザーメニューを開く</span>
                <div className="mr-2 text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">{user.fullName}</div>
                  <div className="text-xs text-gray-500">
                    {user.role === 'admin' && '管理者'}
                    {user.role === 'developer' && '開発担当者'}
                    {user.role === 'partner_manager' && 'パートナー管理担当者'}
                    {user.role === 'viewer' && '閲覧者'}
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
                </div>
              </button>
            </div>

            {/* ドロップダウンメニュー */}
            {showUserMenu && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex={-1}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.username}</p>
                </div>

                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setShowUserMenu(false)}
                >
                  プロフィール
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowUserMenu(false)}
                  >
                    システム設定
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
