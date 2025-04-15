import React from 'react';

interface UserTabsProps {
  activeTab: 'users' | 'roles';
  onTabChange: (tab: 'users' | 'roles') => void;
}

/**
 * ユーザー管理画面のタブコンポーネント
 */
export const UserTabs: React.FC<UserTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b mb-4">
      <button
        className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => onTabChange('users')}
      >
        ユーザー管理
      </button>
      <button
        className={`px-4 py-2 font-medium ${activeTab === 'roles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => onTabChange('roles')}
      >
        役割・権限管理
      </button>
    </div>
  );
};
