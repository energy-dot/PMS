import React from 'react';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface RoleFormModalProps {
  show: boolean;
  onClose: () => void;
  formData: {
    name: string;
    description: string;
    permissions: string[];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPermissionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  modalMode: 'create' | 'edit';
  availablePermissions: { value: string; label: string }[];
  loading: boolean;
}

/**
 * 役割フォームモーダルコンポーネント
 */
export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  show,
  onClose,
  formData,
  onChange,
  onPermissionChange,
  onSubmit,
  modalMode,
  availablePermissions,
  loading,
}) => {
  if (!show) return null;

  const title = modalMode === 'create' ? '役割作成' : '役割編集';
  const submitButtonText = modalMode === 'create' ? '作成' : '更新';

  return (
    <Modal isOpen={show} title={title} onClose={onClose} size="lg">
      <form onSubmit={onSubmit}>
        <div className="p-4">
          <div className="mb-4">
            <Input
              label="役割名"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              disabled={modalMode === 'edit'}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">権限</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availablePermissions.map(permission => (
                <div key={permission.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`permission-${permission.value}`}
                    name="permissions"
                    value={permission.value}
                    checked={formData.permissions.includes(permission.value)}
                    onChange={onPermissionChange}
                    className="mr-2"
                  />
                  <label htmlFor={`permission-${permission.value}`} className="text-sm">
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 px-4 py-3 flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose} className="mr-2">
            キャンセル
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
