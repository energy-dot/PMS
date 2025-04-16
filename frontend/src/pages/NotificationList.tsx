// pages/NotificationList.tsxの修正

import React, { useState, useEffect } from 'react';
import DataGrid from '../components/grids/DataGrid';
import { Notification } from '../shared-types';
import notificationService from '../services/notificationService';
import { useAuthStore } from '../store/user/authStore';

// NotificationListコンポーネント
const NotificationList: React.FC = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 通知データの取得
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await notificationService.getUserNotifications(user.id || '');
        setNotifications(data);
      } catch (err) {
        setError('通知データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // 通知を既読にする
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);

      // 通知の既読状態を更新
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('通知の既読処理に失敗しました', err);
    }
  };

  // すべての通知を既読にする
  const markAllAsRead = async () => {
    if (!user || !user.id) return;

    try {
      await notificationService.markAllAsRead(user.id);

      // すべての通知を既読に更新
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('全通知の既読処理に失敗しました', err);
    }
  };

  // DataGridのカラム定義
  const columns = [
    {
      field: 'title',
      headerName: 'タイトル',
      width: 200,
    },
    {
      field: 'message',
      headerName: 'メッセージ',
      width: 400,
    },
    {
      field: 'createdAt',
      headerName: '日時',
      width: 150,
    },
    {
      field: 'isRead',
      headerName: 'ステータス',
      width: 100,
      renderCell: (row: Notification) => (
        <span className={`status-badge ${row.isRead ? 'status-read' : 'status-unread'}`}>
          {row.isRead ? '既読' : '未読'}
        </span>
      ),
    },
  ];

  // アクションボタン定義
  const actionButtons = [
    {
      label: 'すべて既読にする',
      onClick: markAllAsRead,
      variant: 'primary' as const,
      disabled: notifications.every(n => n.isRead),
    },
  ];

  return (
    <div className="notification-list-page">
      <h1>通知一覧</h1>

      <DataGrid
        data={notifications}
        columns={columns}
        loading={loading}
        actionButtons={actionButtons}
        onRowClick={row => {
          if (!row.isRead) {
            markAsRead(row.id || '');
          }
        }}
        emptyMessage={error || '通知はありません'}
      />
    </div>
  );
};

export default NotificationList;
