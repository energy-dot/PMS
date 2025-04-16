import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  loading: boolean;
}

/**
 * ユーザー一覧コンポーネント
 */
export const UserList: React.FC<UserListProps> = ({ users, onEditUser, onDeleteUser, loading }) => {
  // 役割の表示名を取得
  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'admin':
        return '管理者';
      case 'partner_manager':
        return 'パートナー管理者';
      case 'developer':
        return '開発担当者';
      case 'viewer':
        return '閲覧者';
      default:
        return role;
    }
  };

  // ユーザー列定義
  const userColumnDefs: ColDef[] = [
    {
      headerName: 'ユーザー名',
      field: 'username',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'メールアドレス',
      field: 'email',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: '氏名',
      field: 'fullName',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: '役割',
      field: 'role',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => {
        let roleClass = '';
        switch (params.value) {
          case 'admin':
            roleClass = 'bg-red-200 text-red-800';
            break;
          case 'partner_manager':
            roleClass = 'bg-blue-200 text-blue-800';
            break;
          case 'developer':
            roleClass = 'bg-green-200 text-green-800';
            break;
          case 'viewer':
            roleClass = 'bg-gray-200 text-gray-800';
            break;
          default:
            roleClass = 'bg-gray-200 text-gray-800';
        }

        const roleText = getRoleDisplayName(params.value);
        return `<span class="px-2 py-1 rounded-full text-xs ${roleClass}">${roleText}</span>`;
      },
    },
    {
      headerName: '部署',
      field: 'department',
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: '状態',
      field: 'isActive',
      sortable: true,
      filter: true,
      width: 100,
      cellRenderer: (params: any) => {
        return params.value
          ? '<span class="px-2 py-1 rounded-full text-xs bg-green-200 text-green-800">有効</span>'
          : '<span class="px-2 py-1 rounded-full text-xs bg-red-200 text-red-800">無効</span>';
      },
    },
    {
      headerName: '更新日',
      field: 'updatedAt',
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params: any) => {
        return params.value ? new Date(params.value).toLocaleString('ja-JP') : '';
      },
    },
    {
      headerName: '操作',
      field: 'id',
      sortable: false,
      filter: false,
      width: 150,
      cellRenderer: (params: any) => {
        return `
          <div class="flex space-x-2">
            <button class="edit-btn px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">編集</button>
            <button class="delete-btn px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">削除</button>
          </div>
        `;
      },
      onCellClicked: (params: any) => {
        const { event } = params;
        const target = event.target as HTMLElement;

        if (target.classList.contains('edit-btn')) {
          onEditUser(params.data);
        } else if (target.classList.contains('delete-btn')) {
          onDeleteUser(params.data.id);
        }
      },
    },
  ];

  return (
    <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
      <AgGridReact
        rowData={users}
        columnDefs={userColumnDefs}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
      />
    </div>
  );
};
