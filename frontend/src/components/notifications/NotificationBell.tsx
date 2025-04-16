// components/notifications/NotificationBell.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '../../shared-types';
import notificationService from '../../services/notificationService';

// NotificationBellのプロパティ型を定義
interface NotificationBellProps {
  userId: string;
}

// NotificationBellコンポーネント
const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 通知データの取得
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        // 修正: getUserNotifications関数の代わりにgetNotificationsByUser関数を使用
        const data = await notificationService.getNotificationsByUser(userId);
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      } catch (err) {
        setError('通知データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // 定期的に通知を更新
    const interval = setInterval(fetchNotifications, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [userId]);

  // 通知をクリックしたときの処理
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markNotificationAsRead(notification.id || '');

        // 通知の既読状態を更新
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
        );

        // 未読カウントを更新
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('通知の既読処理に失敗しました', err);
      }
    }

    setShowDropdown(false);
  };

  // ドロップダウンの表示/非表示を切り替え
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none" 
        onClick={toggleDropdown} 
        aria-label="通知"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">通知</h3>
            <Link 
              to="/notifications" 
              onClick={() => setShowDropdown(false)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              すべて表示
            </Link>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">読み込み中...</div>
            ) : error ? (
              <div className="p-4 text-center text-sm text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">通知はありません</div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString('ja-JP')}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 bg-gray-50 border-t">
            <button
              className={`w-full py-1 text-xs rounded ${
                unreadCount === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={async () => {
                try {
                  await notificationService.markAllNotificationsAsRead(userId);
                  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                  setUnreadCount(0);
                } catch (err) {
                  console.error('全通知の既読処理に失敗しました', err);
                }
              }}
              disabled={unreadCount === 0}
            >
              すべて既読にする
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
