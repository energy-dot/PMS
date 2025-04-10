import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PartnerList from './pages/PartnerList';
import PartnerDetail from './pages/PartnerDetail';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ProjectSearch from './pages/ProjectSearch';
import ProjectApprovalRequest from './pages/ProjectApprovalRequest';
import StaffList from './pages/StaffList';
import StaffDetail from './pages/StaffDetail';
import ContractList from './pages/ContractList';
import ContractDetail from './pages/ContractDetail';
import ApplicationList from './pages/ApplicationList';
import ApplicationDetail from './pages/ApplicationDetail';
import ApplicationNew from './pages/ApplicationNew';
import ApprovalList from './pages/ApprovalList';
import ApprovalDetail from './pages/ApprovalDetail';
import NotificationList from './pages/NotificationList';
import StaffEvaluationList from './pages/StaffEvaluationList';
import StaffEvaluationDetail from './pages/StaffEvaluationDetail';
import StaffEvaluationNew from './pages/StaffEvaluationNew';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/partners" element={<PartnerList />} />
                  <Route path="/partners/:id" element={<PartnerDetail />} />
                  <Route path="/projects" element={<ProjectList />} />
                  <Route path="/projects/search" element={<ProjectSearch />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/:id/request-approval" element={<ProjectApprovalRequest />} />
                  <Route path="/staff" element={<StaffList />} />
                  <Route path="/staff/search" element={<StaffSearch />} />
                  <Route path="/staff/:id" element={<StaffDetail />} />
                  <Route path="/contracts" element={<ContractList />} />
                  <Route path="/contracts/:id" element={<ContractDetail />} />
                  <Route path="/applications" element={<ApplicationList />} />
                  <Route path="/applications/new" element={<ApplicationNew />} />
                  <Route path="/applications/:id" element={<ApplicationDetail />} />
                  <Route path="/approvals" element={<ApprovalList />} />
                  <Route path="/approvals/:id" element={<ApprovalDetail />} />
                  <Route path="/notifications" element={<NotificationList />} />
                  <Route path="/evaluations" element={<StaffEvaluationList />} />
                  <Route path="/evaluations/new" element={<StaffEvaluationNew />} />
                  <Route path="/evaluations/:id" element={<StaffEvaluationDetail />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
