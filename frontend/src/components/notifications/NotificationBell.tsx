// components/notifications/NotificationBell.tsxの修正

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
        const data = await notificationService.getUserNotifications(userId);
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
        await notificationService.markAsRead(notification.id || '');

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
    <div className="notification-bell">
      <button className="notification-bell-button" onClick={toggleDropdown} aria-label="通知">
        <i className="icon-bell"></i>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>通知</h3>
            <Link to="/notifications" onClick={() => setShowDropdown(false)}>
              すべて表示
            </Link>
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">読み込み中...</div>
            ) : error ? (
              <div className="notification-error">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">通知はありません</div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.createdAt}</div>
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <button
              className="mark-all-read"
              onClick={async () => {
                try {
                  await notificationService.markAllAsRead(userId);
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
