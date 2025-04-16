// constants/menuItems.ts

/**
 * サイドバーメニュー項目の定義
 * アプリケーション全体で一貫したメニュー構造を提供します
 */

export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  roles: Array<'developer' | 'partner_manager' | 'admin' | 'viewer'>;
  count?: number;
}

/**
 * メニュー項目の定義
 * 全てのメニュー項目はここで一元管理します
 */
export const menuItems: MenuItem[] = [
  {
    path: '/',
    label: 'ダッシュボード',
    icon: 'dashboard',
    roles: ['developer', 'partner_manager', 'admin', 'viewer'],
  },
  {
    path: '/partners',
    label: 'パートナー管理',
    icon: 'business',
    roles: ['partner_manager', 'admin'],
  },
  {
    path: '/staff',
    label: 'スタッフ管理',
    icon: 'people',
    roles: ['partner_manager', 'admin'],
  },
  {
    path: '/projects',
    label: 'プロジェクト管理',
    icon: 'assignment',
    roles: ['developer', 'partner_manager', 'admin', 'viewer'],
  },
  {
    path: '/applications',
    label: '申請管理',
    icon: 'description',
    roles: ['developer', 'partner_manager', 'admin'],
  },
  {
    path: '/contracts',
    label: '契約管理',
    icon: 'receipt',
    roles: ['partner_manager', 'admin'],
  },
  {
    path: '/evaluations',
    label: '評価管理',
    icon: 'star',
    roles: ['developer', 'partner_manager', 'admin'],
  },
  {
    path: '/reports',
    label: 'レポート',
    icon: 'assessment',
    roles: ['partner_manager', 'admin', 'viewer'],
  },
  {
    path: '/users',
    label: 'ユーザー管理',
    icon: 'admin_panel_settings',
    roles: ['admin'],
  },
];

/**
 * ユーザーロールに基づいてメニュー項目をフィルタリングする関数
 * @param userRole ユーザーロール
 * @returns フィルタリングされたメニュー項目の配列
 */
export const getFilteredMenuItems = (userRole?: string): MenuItem[] => {
  if (!userRole) return [];
  
  return menuItems.filter(item => 
    item.roles.includes(userRole as 'developer' | 'partner_manager' | 'admin' | 'viewer')
  );
};

export default menuItems;
