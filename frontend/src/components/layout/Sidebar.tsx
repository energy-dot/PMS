import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/', label: 'ダッシュボード' },
    { path: '/partners', label: 'パートナー会社' },
    { path: '/projects', label: '案件管理' },
    { path: '/applications', label: '応募管理' },
    { path: '/staff', label: '要員管理' },
    { path: '/contracts', label: '契約管理' },
    { path: '/requests', label: '依頼・連絡' },
    { path: '/evaluations', label: '要員評価' },
    { path: '/reports', label: 'レポート' },
    { path: '/master', label: 'マスターデータ' },
  ];

  return (
    <aside className="bg-white shadow-sm w-64 min-h-screen">
      <nav className="p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive
                      ? 'bg-primary-color text-white'
                      : 'hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
