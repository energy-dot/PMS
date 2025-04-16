import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'developer' | 'partner_manager' | 'admin' | 'viewer'>;
}

/**
 * 認証済みユーザーのみがアクセスできるルートを提供するコンポーネント
 * allowedRolesが指定された場合、そのロールを持つユーザーのみがアクセス可能
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 認証されていない場合はログインページにリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ロールが指定されており、かつユーザーがそのロールを持っていない場合
  if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // 権限不足の場合はダッシュボードにリダイレクト
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
