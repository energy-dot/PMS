import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
