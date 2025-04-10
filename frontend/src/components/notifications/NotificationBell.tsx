import React, { useState, useEffect } from 'react';
import { Bell } from 'react-feather';
import notificationService from '../../services/notificationService';
import userService from '../../services/userService';
import NotificationDropdown from '../notifications/NotificationDropdown';

const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 未読通知数の取得
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
        const currentUser = await userService.getCurrentUser();
        
        const count = await notificationService.countUnreadNotificationsByUser(currentUser.id);
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch unread notification count:', err);
      }
    };
    
    fetchUnreadCount();
    
    // 定期的に未読通知数を更新（1分ごと）
    const intervalId = setInterval(fetchUnreadCount, 60000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // ドロップダウンの表示/非表示を切り替え
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // ドロップダウンを閉じる
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={toggleDropdown}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {isDropdownOpen && (
        <NotificationDropdown onClose={closeDropdown} />
      )}
    </div>
  );
};

export default NotificationBell;
