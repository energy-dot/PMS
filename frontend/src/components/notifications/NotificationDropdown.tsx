import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import notificationService, { Notification } from '../services/notificationService';
import userService from '../services/userService';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 通知データの取得
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
        const currentUser = await userService.getCurrentUser();
        
        // 未読通知のみ取得
        const data = await notificationService.getUnreadNotificationsByUser(currentUser.id);
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 通知をクリックしたときの処理
  const handleNotificationClick = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      onClose();
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
      setNotifications([]);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  // 日付のフォーマット
  const formatDate = (date: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden"
    >
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">通知</h3>
        <button
          onClick={handleMarkAllAsRead}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          すべて既読にする
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">読み込み中...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">新しい通知はありません</div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.content}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <Link 
          to="/notifications" 
          className="block text-center text-sm text-blue-600 hover:text-blue-800"
          onClick={onClose}
        >
          すべての通知を見る
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
