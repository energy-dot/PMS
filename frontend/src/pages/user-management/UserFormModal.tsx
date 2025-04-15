import React from 'react';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

interface UserFormModalProps {
  show: boolean;
  onClose: () => void;
  formData: {
    username: string;
    email: string;
    fullName: string;
    password: string;
    role: string;
    department: string;
    isActive: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  modalMode: 'create' | 'edit';
  roles: any[];
  departments: any[];
  loading: boolean;
}

/**
 * ユーザーフォームモーダルコンポーネント
 */
export const UserFormModal: React.FC<UserFormModalProps> = ({
  show,
  onClose,
  formData,
  onChange,
  onSubmit,
  modalMode,
  roles,
  departments,
  loading
}) => {
  if (!show) return null;

  const title = modalMode === 'create' ? 'ユーザー作成' : 'ユーザー編集';
  const submitButtonText = modalMode === 'create' ? '作成' : '更新';

  return (
    <Modal
      title={title}
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={onSubmit}>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="ユーザー名"
                name="username"
                value={formData.username}
                onChange={onChange}
                required
                disabled={modalMode === 'edit'}
              />
            </div>
            <div>
              <Input
                label="メールアドレス"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="氏名"
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <Input
                label={modalMode === 'create' ? 'パスワード' : 'パスワード（変更する場合のみ）'}
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                required={modalMode === 'create'}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Select
                label="役割"
                name="role"
                value={formData.role}
                onChange={onChange}
                required
              >
                <option value="">選択してください</option>
                {roles.map(role => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Select
                label="部署"
                name="department"
                value={formData.department}
                onChange={onChange}
                required
              >
                <option value="">選択してください</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={onChange}
                className="mr-2"
              />
              <span>アカウントを有効にする</span>
            </label>
          </div>
        </div>
        
        <div className="bg-gray-100 px-4 py-3 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="mr-2"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
