import React from 'react';
import { MagnifyingGlassIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4">
      {/* 左側：タイトルとトグルボタン */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="ml-4 text-xl font-semibold text-gray-800">パートナー要員管理システム</h1>
      </div>

      {/* 右側：検索、通知、ユーザー */}
      <div className="flex items-center space-x-4">
        {/* 検索ボックス */}
        <div className="relative">
          <input
            type="text"
            placeholder="検索..."
            className="py-2 pl-10 pr-4 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* 通知アイコン */}
        <div className="relative">
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* ユーザーアバター */}
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            管
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-700">管理者</p>
            <p className="text-xs text-gray-500">管理者</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
