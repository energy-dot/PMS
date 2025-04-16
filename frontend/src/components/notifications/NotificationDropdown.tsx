// components/notifications/NotificationDropdown.tsxの修正

import React from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '../../shared-types';

// NotificationDropdownのプロパティ型を定義
interface NotificationDropdownProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  loading?: boolean;
  error?: string | null;
}

// NotificationDropdownコンポーネント
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onNotificationClick,
  onMarkAllAsRead,
  loading = false,
  error = null,
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>通知</h3>
        <Link to="/notifications">すべて表示</Link>
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
              onClick={() => onNotificationClick(notification)}
            >
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">{notification.createdAt}</div>
            </div>
          ))
        )}
      </div>

      <div className="notification-footer">
        <button className="mark-all-read" onClick={onMarkAllAsRead} disabled={unreadCount === 0}>
          すべて既読にする
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
