import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-primary-color">
          パートナー要員管理システム
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="btn btn-primary">
              通知 <span className="badge badge-secondary ml-2">3</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span>山田 太郎</span>
            <button className="btn btn-secondary">ログアウト</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
