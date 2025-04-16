import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import PartnerList from './pages/PartnerList';
import PartnerDetail from './pages/PartnerDetail';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import StaffList from './pages/StaffList';
import StaffDetail from './pages/StaffDetail';
import ContractList from './pages/ContractList';
import ContractDetail from './pages/ContractDetail';
import EvaluationList from './pages/EvaluationList';
import NotificationList from './pages/NotificationList';
import Reports from './pages/Reports';
import MasterData from './pages/MasterData';
import UserManagement from './pages/UserManagement';

// メインアプリコンポーネント
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="partners" element={<PartnerList />} />
            <Route path="partners/:id" element={<PartnerDetail />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="staff" element={<StaffList />} />
            <Route path="staff/:id" element={<StaffDetail />} />
            <Route path="contracts" element={<ContractList />} />
            <Route path="contracts/:id" element={<ContractDetail />} />
            <Route path="evaluations" element={<EvaluationList />} />
            <Route path="notifications" element={<NotificationList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="master" element={<MasterData />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
