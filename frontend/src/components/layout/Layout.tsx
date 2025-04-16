// components/layout/Layout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';
import './Layout.css'; // CSSファイルをインポート

// Layoutコンポーネント
const Layout: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-100">
      {isAuthenticated ? (
        <>
          {/* サイドバー - 外部コンポーネントとして使用 */}
          <Sidebar />
          
          {/* メインコンテンツ */}
          <div className="flex-1 overflow-auto ml-64">
            <main className="p-6">
              <Outlet />
            </main>
          </div>
        </>
      ) : (
        <div className="flex-1">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Layout;
