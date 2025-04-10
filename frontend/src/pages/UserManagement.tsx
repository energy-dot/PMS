import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// ユーザー型定義
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

// 役割型定義
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  
  // モーダル関連の状態
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // ユーザーフォームデータ
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: '',
    department: '',
    isActive: true
  });
  
  // 役割フォームデータ
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  
  // 利用可能な権限リスト
  const availablePermissions = [
    { value: 'read:projects', label: '案件閲覧' },
    { value: 'write:projects', label: '案件編集' },
    { value: 'read:partners', label: 'パートナー閲覧' },
    { value: 'write:partners', label: 'パートナー編集' },
    { value: 'read:staff', label: '要員閲覧' },
    { value: 'write:staff', label: '要員編集' },
    { value: 'read:contracts', label: '契約閲覧' },
    { value: 'write:contracts', label: '契約編集' },
    { value: 'read:evaluations', label: '評価閲覧' },
    { value: 'write:evaluations', label: '評価編集' },
    { value: 'read:applications', label: '応募閲覧' },
    { value: 'write:applications', label: '応募編集' },
    { value: 'read:reports', label: 'レポート閲覧' },
    { value: 'write:reports', label: 'レポート作成' },
    { value: 'admin:users', label: 'ユーザー管理' },
    { value: 'admin:master-data', label: 'マスターデータ管理' },
    { value: 'admin:system', label: 'システム管理' }
  ];
  
  // ユーザー列定義
  const userColumnDefs: ColDef[] = [
    { 
      headerName: 'ユーザー名', 
      field: 'username', 
      sortable: true, 
      filter: true, 
      flex: 1 
    },
    { 
      headerName: 'メールアドレス', 
      field: 'email', 
      sortable: true, 
      filter: true, 
      flex: 1 
    },
    { 
      headerName: '氏名', 
      field: 'fullName', 
      sortable: true, 
      filter: true, 
      flex: 1 
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
      }
    },
    { 
      headerName: '部署', 
      field: 'department', 
      sortable: true, 
      filter: true, 
      width: 150 
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
      }
    },
    { 
      headerName: '更新日', 
      field: 'updatedAt', 
      sortable: true, 
      filter: true, 
      width: 150,
      cellRenderer: (params: any) => {
        return params.value ? new Date(params.value).toLocaleString('ja-JP') : '';
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
          handleEditUser(params.data);
        } else if (target.classList.contains('delete-btn')) {
          handleDeleteUser(params.data.id);
        }
      }
    }
  ];
  
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
          handleEditRole(params.data);
        } else if (target.classList.contains('delete-btn')) {
          handleDeleteRole(params.data.id);
        }
      }
    }
  ];
  
  // 役割の表示名を取得
  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'admin': return '管理者';
      case 'partner_manager': return 'パートナー管理者';
      case 'developer': return '開発担当者';
      case 'viewer': return '閲覧者';
      default: return role;
    }
  };
  
  // 初期データの読み込み
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // ユーザーデータの取得
        const usersResponse = await axios.get(`${API_BASE_URL}/users`);
        setUsers(usersResponse.data);
        
        // 役割データの取得
        const rolesResponse = await axios.get(`${API_BASE_URL}/roles`);
        setRoles(rolesResponse.data);
        
        // 部署データの取得
        const departmentsResponse = await axios.get(`${API_BASE_URL}/departments`);
        setDepartments(departmentsResponse.data);
        
        setLoading(false);
      } catch (err: any) {
        setError('データの取得に失敗しました: ' + (err.message || '不明なエラー'));
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // タブ切り替えハンドラー
  const handleTabChange = (tab: 'users' | 'roles') => {
    setActiveTab(tab);
  };
  
  // ユーザー新規作成ハンドラー
  const handleCreateUser = () => {
    setModalMode('create');
    setCurrentItem(null);
    setUserFormData({
      username: '',
      email: '',
      fullName: '',
      password: '',
      role: '',
      department: '',
      isActive: true
    });
    setShowUserModal(true);
  };
  
  // ユーザー編集ハンドラー
  const handleEditUser = (user: User) => {
    setModalMode('edit');
    setCurrentItem(user);
    setUserFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      password: '',
      role: user.role,
      department: user.department,
      isActive: user.isActive
    });
    setShowUserModal(true);
  };
  
  // ユーザー削除ハンドラー
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('このユーザーを削除してもよろしいですか？')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      
      // ユーザーリストを再取得
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
      
      setSuccess('ユーザーを削除しました');
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (err: any) {
      setError('ユーザーの削除に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  // 役割新規作成ハンドラー
  const handleCreateRole = () => {
    setModalMode('create');
    setCurrentItem(null);
    setRoleFormData({
      name: '',
      description: '',
      permissions: []
    });
    setShowRoleModal(true);
  };
  
  // 役割編集ハンドラー
  const handleEditRole = (role: Role) => {
    setModalMode('edit');
    setCurrentItem(role);
    setRoleFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setShowRoleModal(true);
  };
  
  // 役割削除ハンドラー
  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('この役割を削除してもよろしいですか？この役割に関連付けられたユーザーがいる場合、削除できません。')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/roles/${id}`);
      
      // 役割リストを再取得
      const response = await axios.get(`${API_BASE_URL}/roles`);
      setRoles(response.data);
      
      setSuccess('役割を削除しました');
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (err: any) {
      setError('役割の削除に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  // ユーザーフォーム入力変更ハンドラー
  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setUserFormData({
      ...userFormData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  // 役割フォーム入力変更ハンドラー
  const handleRoleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setRoleFormData({
      ...roleFormData,
      [name]: value
    });
  };
  
  // 権限チェックボックス変更ハンドラー
  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setRoleFormData({
        ...roleFormData,
        permissions: [...roleFormData.permissions, value]
      });
    } else {
      setRoleFormData({
        ...roleFormData,
        permissions: roleFormData.permissions.filter(p => p !== value)
      });
    }
  };
  
  // ユーザーフォーム送信ハンドラー
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (modalMode === 'create') {
        await axios.post(`${API_BASE_URL}/users`, userFormData);
        setSuccess('ユーザーを作成しました');
      } else {
        const updateData = { ...userFormData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await axios.patch(`${API_BASE_URL}/users/${currentItem.id}`, updateData);
        setSuccess('ユーザーを更新しました');
      }
      
      setShowUserModal(false);
      
      // ユーザーリストを再取得
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
      
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (err: any) {
      setError('ユーザーの保存に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  // 役割フォーム送信ハンドラー
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (modalMode === 'create') {
        await axios.post(`${API_BASE_URL}/roles`, roleFormData);
        setSuccess('役割を作成しました');
      } else {
        await axios.patch(`${API_BASE_URL}/roles/${currentItem.id}`, roleFormData);
        setSuccess('役割を更新しました');
      }
      
      setShowRoleModal(false);
      
      // 役割リストを再取得
      const response = await axios.get(`${API_BASE_URL}/roles`);
      setRoles(response.data);
      
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (err: any) {
      setError('役割の保存に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  // モーダルを閉じるハンドラー
  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowRoleModal(false);
  };
  
  // 管理者権限チェック
  const isAdmin = currentUser?.role === 'admin';
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">ユーザー・アクセス権限管理</h1>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} className="mb-4" />}
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange('users')}
          >
            ユーザー管理
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'roles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange('roles')}
          >
            役割・権限管理
          </button>
        </div>
        
        <div className="flex justify-end mb-4">
          {isAdmin && activeTab === 'users' && (
            <Button
              type="button"
              variant="primary"
              onClick={handleCreateUser}
              disabled={loading}
            >
              新規ユーザー作成
            </Button>
          )}
          
          {isAdmin && activeTab === 'roles' && (
            <Button
              type="button"
              variant="primary"
              onClick={handleCreateRole}
              disabled={loading}
            >
              新規役割作成
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        {activeTab === 'users' && (
          <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
            <AgGridReact
              rowData={users}
              columnDefs={userColumnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
            />
          </div>
        )}
        
        {activeTab === 'roles' && (
          <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
            <AgGridReact
              rowData={roles}
              columnDefs={roleColumnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
            />
          </div>
        )}
      </div>
      
      {/* ユーザー編集モーダル */}
      <Modal
        isOpen={showUserModal}
        onClose={handleCloseModal}
        title={modalMode === 'create' ? 'ユーザー新規作成' : 'ユーザー編集'}
      >
        <form onSubmit={handleUserSubmit}>
          <div className="space-y-4">
            <Input
              label="ユーザー名"
              name="username"
              value={userFormData.username}
              onChange={handleUserFormChange}
              required
              disabled={modalMode === 'edit'}
            />
            
            <Input
              label="メールアドレス"
              name="email"
              type="email"
              value={userFormData.email}
              onChange={handleUserFormChange}
              required
            />
            
            <Input
              label="氏名"
              name="fullName"
              value={userFormData.fullName}
              onChange={handleUserFormChange}
              required
            />
            
            <Input
              label={modalMode === 'create' ? 'パスワード' : 'パスワード（変更する場合のみ入力）'}
              name="password"
              type="password"
              value={userFormData.password}
              onChange={handleUserFormChange}
              required={modalMode === 'create'}
            />
            
            <Select
              label="役割"
              name="role"
              value={userFormData.role}
              onChange={handleUserFormChange}
              options={[
                { value: '', label: '役割を選択' },
                { value: 'admin', label: '管理者' },
                { value: 'partner_manager', label: 'パートナー管理者' },
                { value: 'developer', label: '開発担当者' },
                { value: 'viewer', label: '閲覧者' }
              ]}
              required
            />
            
            <Select
              label="部署"
              name="department"
              value={userFormData.department}
              onChange={handleUserFormChange}
              options={[
                { value: '', label: '部署を選択' },
                ...departments.map(dept => ({
                  value: dept.name,
                  label: dept.name
                }))
              ]}
              required
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={userFormData.isActive}
                onChange={handleUserFormChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                アクティブ（有効）
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* 役割編集モーダル */}
      <Modal
        isOpen={showRoleModal}
        onClose={handleCloseModal}
        title={modalMode === 'create' ? '役割新規作成' : '役割編集'}
      >
        <form onSubmit={handleRoleSubmit}>
          <div className="space-y-4">
            <Input
              label="役割名"
              name="name"
              value={roleFormData.name}
              onChange={handleRoleFormChange}
              required
              disabled={modalMode === 'edit'}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                name="description"
                value={roleFormData.description}
                onChange={handleRoleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                権限
              </label>
              <div className="grid grid-cols-2 gap-2 border p-3 rounded-md max-h-60 overflow-y-auto">
                {availablePermissions.map(permission => (
                  <div key={permission.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={permission.value}
                      name="permissions"
                      value={permission.value}
                      checked={roleFormData.permissions.includes(permission.value)}
                      onChange={handlePermissionChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={permission.value} className="ml-2 block text-sm text-gray-900">
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
