import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  DocumentDuplicateIcon, 
  StarIcon, 
  BellIcon, 
  DocumentChartBarIcon, 
  Cog8ToothIcon 
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'ダッシュボード', path: '/dashboard', icon: HomeIcon },
    { name: 'パートナー会社', path: '/partners', icon: BuildingOfficeIcon },
    { name: '案件管理', path: '/projects', icon: DocumentTextIcon },
    { name: '要員管理', path: '/staff', icon: UserGroupIcon },
    { name: '契約管理', path: '/contracts', icon: DocumentDuplicateIcon },
    { name: '要員評価', path: '/evaluations', icon: StarIcon },
    { name: '通知', path: '/notifications', icon: BellIcon, badge: 3 },
    { name: 'レポート', path: '/reports', icon: DocumentChartBarIcon },
    { name: 'マスターデータ', path: '/master-data', icon: Cog8ToothIcon },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex flex-col`}>
      {/* ロゴ部分 */}
      <div className="p-4 flex items-center justify-center h-16 border-b border-gray-700">
        {isOpen ? (
          <h1 className="text-xl font-bold">PMS</h1>
        ) : (
          <h1 className="text-xl font-bold">P</h1>
        )}
      </div>

      {/* メニュー部分 */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-6 w-6 mr-3" />
                {isOpen && (
                  <span className="flex-1">{item.name}</span>
                )}
                {isOpen && item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ユーザー情報部分 */}
      <div className="p-4 border-t border-gray-700 flex items-center">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
          管
        </div>
        {isOpen && (
          <div>
            <p className="text-sm font-medium">管理者</p>
            <p className="text-xs text-gray-400">管理者</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
