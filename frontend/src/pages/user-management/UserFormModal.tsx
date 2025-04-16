import React from 'react';
import Select from '../../components/common/Select';
import { SelectOption } from '../../components/common/Select';
import { User } from '../../shared-types';

// UserFormModalのSelect要素を修正
const UserFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  userData?: any;
}> = ({ isOpen, onClose, onSubmit, userData }) => {
  // コンポーネントの実装
  // ...

  // Selectコンポーネントのoptions属性を追加
  const departmentOptions: SelectOption[] = [
    { value: 'sales', label: '営業部' },
    { value: 'engineering', label: '技術部' },
    { value: 'hr', label: '人事部' },
  ];

  const roleOptions: SelectOption[] = [
    { value: 'developer', label: '開発者' },
    { value: 'partner_manager', label: 'パートナー管理者' },
    { value: 'admin', label: '管理者' },
    { value: 'viewer', label: '閲覧者' },
  ];

  return (
    <div>
      {/* 他のコンポーネント */}
      <Select
        label="部署"
        name="department"
        value={userData?.department || ''}
        onChange={() => {}}
        options={departmentOptions}
        required={true}
      />

      <Select
        label="役割"
        name="role"
        value={userData?.role || ''}
        onChange={() => {}}
        options={roleOptions}
        required={true}
      />
      {/* 他のコンポーネント */}
    </div>
  );
};

export default UserFormModal;
