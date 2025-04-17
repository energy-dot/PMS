import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="partners" element={<div className="p-4"><h1 className="text-2xl font-bold">パートナー会社</h1></div>} />
          <Route path="projects" element={<div className="p-4"><h1 className="text-2xl font-bold">案件管理</h1></div>} />
          <Route path="staff" element={<div className="p-4"><h1 className="text-2xl font-bold">要員管理</h1></div>} />
          <Route path="contracts" element={<div className="p-4"><h1 className="text-2xl font-bold">契約管理</h1></div>} />
          <Route path="evaluations" element={<div className="p-4"><h1 className="text-2xl font-bold">要員評価</h1></div>} />
          <Route path="notifications" element={<div className="p-4"><h1 className="text-2xl font-bold">通知</h1></div>} />
          <Route path="reports" element={<div className="p-4"><h1 className="text-2xl font-bold">レポート</h1></div>} />
          <Route path="master-data" element={<div className="p-4"><h1 className="text-2xl font-bold">マスターデータ</h1></div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
