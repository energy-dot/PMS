import { Notification } from '../shared-types';

// 通知情報のモックデータ
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: '新規応募があります',
    message: 'プロジェクト「ECサイトリニューアル」に新しい応募がありました。',
    type: 'info',
    isRead: false,
    createdAt: '2023-05-20T10:30:00Z',
    relatedEntityId: 'proj-1',
    relatedEntityType: 'project',
    link: '/projects/proj-1/applications'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: '契約が承認されました',
    message: '「社内業務システム開発」の契約が承認されました。',
    type: 'success',
    isRead: true,
    createdAt: '2023-05-19T14:45:00Z',
    relatedEntityId: 'contract-1',
    relatedEntityType: 'contract',
    link: '/contracts/contract-1'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: '評価が完了しました',
    message: 'スタッフ「山田太郎」の評価が完了しました。',
    type: 'info',
    isRead: false,
    createdAt: '2023-05-18T16:20:00Z',
    relatedEntityId: 'staff-1',
    relatedEntityType: 'staff',
    link: '/staff/staff-1/evaluations'
  },
  {
    id: 'notif-4',
    userId: 'user-2',
    title: '承認依頼があります',
    message: 'プロジェクト「モバイルアプリ開発」の承認依頼があります。',
    type: 'warning',
    isRead: false,
    createdAt: '2023-05-20T09:15:00Z',
    relatedEntityId: 'request-2',
    relatedEntityType: 'workflow',
    link: '/workflows/requests/request-2'
  },
  {
    id: 'notif-5',
    userId: 'user-2',
    title: '契約が更新されました',
    message: '「データ分析基盤構築」の契約が更新されました。',
    type: 'success',
    isRead: true,
    createdAt: '2023-05-17T11:30:00Z',
    relatedEntityId: 'contract-2',
    relatedEntityType: 'contract',
    link: '/contracts/contract-2'
  },
  {
    id: 'notif-6',
    userId: 'user-3',
    title: '新規パートナー登録',
    message: '新しいパートナー「テクノソリューション株式会社」が登録されました。',
    type: 'info',
    isRead: false,
    createdAt: '2023-05-19T10:00:00Z',
    relatedEntityId: 'partner-3',
    relatedEntityType: 'partner',
    link: '/partners/partner-3'
  },
  {
    id: 'notif-7',
    userId: 'user-3',
    title: 'システムエラー',
    message: 'バッチ処理中にエラーが発生しました。システム管理者に連絡してください。',
    type: 'error',
    isRead: false,
    createdAt: '2023-05-20T03:45:00Z',
    relatedEntityId: 'system',
    relatedEntityType: 'system',
    link: '/system/logs'
  }
];
