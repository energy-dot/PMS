import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import Alert from '../common/Alert';
import Button from '../common/Button';

/**
 * アプリケーションの基本レイアウト
 * サイドバー、ヘッダー、メインコンテンツエリアを含む
 */
const Layout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageTitle, setPageTitle] = useState('ダッシュボード');
  const location = useLocation();
  const [sessionTimeout, setSessionTimeout] = useState<number | null>(null);
  const [showSessionAlert, setShowSessionAlert] = useState(false);

  // 認証されていない場合はログインページにリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // URLパスに基づいてページタイトルを設定
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') {
      setPageTitle('ダッシュボード');
    } else if (path.startsWith('/partners')) {
      setPageTitle('パートナー会社管理');
    } else if (path.startsWith('/projects')) {
      setPageTitle('案件管理');
    } else if (path.startsWith('/staff')) {
      setPageTitle('要員管理');
    } else if (path.startsWith('/contracts')) {
      setPageTitle('契約管理');
    } else if (path.startsWith('/evaluations')) {
      setPageTitle('要員評価');
    } else if (path.startsWith('/notifications')) {
      setPageTitle('通知');
    } else if (path.startsWith('/reports')) {
      setPageTitle('レポート');
    } else if (path.startsWith('/master')) {
      setPageTitle('マスターデータ管理');
    } else if (path.startsWith('/users')) {
      setPageTitle('ユーザー管理');
    }
  }, [location]);

  // セッションタイムアウト警告のシミュレーション (本番では実際のセッション管理と連携)
  useEffect(() => {
    // 30分後にセッション警告を表示
    const warningTimeout = setTimeout(() => {
      setShowSessionAlert(true);
      // 5分後にセッションタイムアウト
      setSessionTimeout(300);
    }, 30 * 60 * 1000);

    return () => clearTimeout(warningTimeout);
  }, []);

  // セッションタイムアウトカウントダウン
  useEffect(() => {
    if (sessionTimeout === null) return;

    const interval = setInterval(() => {
      setSessionTimeout(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          // セッションタイムアウト時の処理
          // 本番環境では実際のログアウト処理を呼び出す
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionTimeout]);

  // セッション延長ハンドラー
  const handleExtendSession = () => {
    setShowSessionAlert(false);
    setSessionTimeout(null);
    // 本番環境では実際のセッション延長APIを呼び出す
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header pageTitle={pageTitle} />
        
        <main className="flex-1 p-6 overflow-auto pt-16">
          <div className="max-w-7xl mx-auto">
            {/* 固定のページヘッダー */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
            </div>
            
            {/* メインコンテンツ */}
            <Outlet />
          </div>
          
          {/* セッションタイムアウト警告 */}
          {showSessionAlert && (
            <div className="fixed bottom-4 right-4 z-50">
              <div className="bg-white rounded-lg shadow-lg p-4 border border-yellow-200">
                <Alert
                  variant="warning"
                  message={`セッションが${Math.floor(sessionTimeout! / 60)}分${sessionTimeout! % 60}秒後にタイムアウトします。セッションを延長しますか？`}
                  onClose={() => setShowSessionAlert(false)}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleExtendSession}
                  >
                    セッションを延長
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;