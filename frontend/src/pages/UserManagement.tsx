// UserManagement.tsxの修正

import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { User } from '../shared-types';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    username: '',
    fullName: '',
    email: '',
    role: 'admin',
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setCurrentUser(null);
      setFormData({
        username: '',
        fullName: '',
        email: '',
        role: 'admin',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'role') {
      // roleフィールドの型を適切に処理
      const roleValue = value as User['role'];
      setFormData(prev => ({ ...prev, [name]: roleValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (currentUser) {
        // 更新の場合
        await updateUser(currentUser.id!, formData);
      } else {
        // 新規作成の場合
        await createUser(formData);
      }

      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, e: React.MouseEvent) => {
    // イベント伝播を防止
    e.stopPropagation();
    
    if (window.confirm('このユーザーを削除してもよろしいですか？')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleEditUser = (user: User, e: React.MouseEvent) => {
    // イベント伝播を防止
    e.stopPropagation();
    handleOpenModal(user);
  };

  const handleRowClick = (user: User) => {
    // 行クリック時の処理（必要に応じて実装）
    console.log('Row clicked:', user);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>ユーザー管理</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          新規ユーザー作成
        </Button>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ユーザー名</th>
            <th>氏名</th>
            <th>メールアドレス</th>
            <th>役割</th>
            <th>ステータス</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
              <td>{user.username}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? '有効' : '無効'}</td>
              <td>
                <Button 
                  variant="info" 
                  className="me-2" 
                  onClick={(e) => handleEditUser(user, e)}
                >
                  編集
                </Button>
                <Button 
                  variant="danger" 
                  onClick={(e) => handleDeleteUser(user.id!, e)}
                >
                  削除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={currentUser ? 'ユーザー編集' : '新規ユーザー作成'}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ユーザー名</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">氏名</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">メールアドレス</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">役割</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="admin">管理者</option>
              <option value="developer">開発者</option>
              <option value="partner_manager">パートナー管理者</option>
              <option value="viewer">閲覧者</option>
            </select>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="isActive">
              アカウント有効
            </label>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
              キャンセル
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
