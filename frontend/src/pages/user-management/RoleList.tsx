import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RoleListProps {
  roles: Role[];
  onEditRole: (role: Role) => void;
  onDeleteRole: (id: string) => void;
  loading: boolean;
}

/**
 * 役割一覧コンポーネント
 */
export const RoleList: React.FC<RoleListProps> = ({
  roles,
  onEditRole,
  onDeleteRole,
  loading
}) => {
  // 役割列定義
  const roleColumnDefs: ColDef[] = [
    { 
      headerName: '役割名', 
      field: 'name', 
      sortable: true, 
      filter: true, 
      flex: 1 
    },
    { 
      headerName: '説明', 
      field: 'description', 
      sortable: true, 
      filter: true, 
      flex: 2 
    },
    { 
      headerName: '権限数', 
      field: 'permissions', 
      sortable: true, 
      filter: true, 
      width: 100,
      valueGetter: (params: any) => {
        return params.data?.permissions?.length || 0;
      }
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
          onEditRole(params.data);
        } else if (target.classList.contains('delete-btn')) {
          onDeleteRole(params.data.id);
        }
      }
    }
  ];

  return (
    <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
      <AgGridReact
        rowData={roles}
        columnDefs={roleColumnDefs}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
      />
    </div>
  );
};
