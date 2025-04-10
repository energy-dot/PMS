import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService, { Notification } from '../services/notificationService';
import userService from '../services/userService';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate();

  // 通知の種類に応じたアイコンを取得
  const getNotificationIcon = () => {
    switch (notification.notificationType) {
      case 'system':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case 'project':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
            </svg>
          </div>
        );
      case 'application':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case 'approval':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
    }
  };

  // 通知をクリックしたときの処理
  const handleClick = () => {
    // 未読の場合は既読にする
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    // 関連エンティティがある場合は該当ページに遷移
    if (notification.relatedEntityType && notification.relatedEntityId) {
      switch (notification.relatedEntityType) {
        case 'project':
          navigate(`/projects/${notification.relatedEntityId}`);
          break;
        case 'application':
          navigate(`/applications/${notification.relatedEntityId}`);
          break;
        case 'requestHistory':
          navigate(`/approvals/${notification.relatedEntityId}`);
          break;
        default:
          break;
      }
    }
  };

  // 日付のフォーマット
  const formatDate = (date: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`flex p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      {getNotificationIcon()}
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${!notification.isRead ? 'text-blue-800' : 'text-gray-800'}`}>
            {notification.title}
          </p>
          <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
      </div>
    </div>
  );
};

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 通知データの取得
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
        const currentUser = await userService.getCurrentUser();
        
        const data = await notificationService.getNotificationsByUser(currentUser.id);
        setNotifications(data);
      } catch (err: any) {
        setError(err.response?.data?.message || '通知データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  // 通知を既読にする
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      // 既読状態を更新
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // すべての通知を既読にする
  const handleMarkAllAsRead = async () => {
    try {
      // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
      const currentUser = await userService.getCurrentUser();
      
      await notificationService.markAllAsRead(currentUser.id);
      // すべての通知を既読状態に更新
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">通知一覧</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        >
          すべて既読にする
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center">通知はありません</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
