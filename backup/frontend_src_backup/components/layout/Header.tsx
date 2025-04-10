import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-primary-color">
          パートナー要員管理システム
        </Link>
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="btn btn-primary">
                通知 <span className="badge badge-secondary ml-2">3</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>{user?.name || 'ユーザー'}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>ログアウト</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
