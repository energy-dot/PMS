import React, { useState, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { UserTabs } from './user-management/UserTabs';
import { UserList } from './user-management/UserList';
import { RoleList } from './user-management/RoleList';
import { UserFormModal } from './user-management/UserFormModal';
import { RoleFormModal } from './user-management/RoleFormModal';

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
        <UserTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
        
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
          <UserList 
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            loading={loading}
          />
        )}
        
        {activeTab === 'roles' && (
          <RoleList 
            roles={roles}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
            loading={loading}
          />
        )}
      </div>
      
      {/* ユーザーフォームモーダル */}
      <UserFormModal
        show={showUserModal}
        onClose={handleCloseModal}
        formData={userFormData}
        onChange={handleUserFormChange}
        onSubmit={handleUserSubmit}
        modalMode={modalMode}
        roles={roles}
        departments={departments}
        loading={loading}
      />
      
      {/* 役割フォームモーダル */}
      <RoleFormModal
        show={showRoleModal}
        onClose={handleCloseModal}
        formData={roleFormData}
        onChange={handleRoleFormChange}
        onPermissionChange={handlePermissionChange}
        onSubmit={handleRoleSubmit}
        modalMode={modalMode}
        availablePermissions={availablePermissions}
        loading={loading}
      />
    </div>
  );
};

export default UserManagement;
