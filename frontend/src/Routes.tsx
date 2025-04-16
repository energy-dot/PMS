import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';

// ページコンポーネントのインポート
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ProjectSearch from './pages/ProjectSearch';
import ApplicationList from './pages/ApplicationList';
import ApplicationDetail from './pages/ApplicationDetail';
import ApplicationNew from './pages/ApplicationNew';
import ContractList from './pages/ContractList';
import ContractDetail from './pages/ContractDetail';
import PartnerList from './pages/PartnerList';
import PartnerDetail from './pages/PartnerDetail';
import StaffList from './pages/StaffList';
import StaffDetail from './pages/StaffDetail';
import StaffSearch from './pages/StaffSearch';
import StaffEvaluationList from './pages/StaffEvaluationList';
import StaffEvaluationDetail from './pages/StaffEvaluationDetail';
import StaffEvaluationNew from './pages/StaffEvaluationNew';
import EvaluationList from './pages/EvaluationList';
import ApprovalList from './pages/ApprovalList';
import ApprovalDetail from './pages/ApprovalDetail';
import ProjectApprovalRequest from './pages/ProjectApprovalRequest';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import NotificationList from './pages/NotificationList';
import MasterData from './pages/MasterData';

const Routes: React.FC = () => {
  return (
    <RouterRoutes>
      {/* 認証不要のルート */}
      <Route path="/login" element={<Login />} />

      {/* 認証が必要なルート */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/search" element={<ProjectSearch />} />
        <Route path="/applications" element={<ApplicationList />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
        <Route path="/applications/new" element={<ApplicationNew />} />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/contracts/:id" element={<ContractDetail />} />
        <Route path="/partners" element={<PartnerList />} />
        <Route path="/partners/:id" element={<PartnerDetail />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/:id" element={<StaffDetail />} />
        <Route path="/staff/search" element={<StaffSearch />} />
        <Route path="/evaluations" element={<EvaluationList />} />
        <Route path="/staff-evaluations" element={<StaffEvaluationList />} />
        <Route path="/staff-evaluations/:id" element={<StaffEvaluationDetail />} />
        <Route path="/staff-evaluations/new" element={<StaffEvaluationNew />} />
        <Route path="/approvals" element={<ApprovalList />} />
        <Route path="/approvals/:id" element={<ApprovalDetail />} />
        <Route path="/project-approval-request" element={<ProjectApprovalRequest />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/master-data" element={<MasterData />} />
      </Route>

      {/* 管理者専用ルート */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/user-management" element={<UserManagement />} />
      </Route>

      {/* 404ページ */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
