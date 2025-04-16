// components/filters/DepartmentSectionFilter.tsxの修正

import React, { useState, useEffect } from 'react';
import Select from '../common/Select';
import { Department } from '../../shared-types';
import departmentService from '../../services/departmentService';

// DepartmentSectionFilterのプロパティ型を定義
interface DepartmentSectionFilterProps {
  onDepartmentChange: (departmentId: string) => void;
  onSectionChange?: (sectionId: string) => void;
  selectedDepartmentId?: string;
  selectedSectionId?: string;
}

// DepartmentSectionFilterコンポーネント
const DepartmentSectionFilter: React.FC<DepartmentSectionFilterProps> = ({
  onDepartmentChange,
  onSectionChange,
  selectedDepartmentId,
  selectedSectionId,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 部署データの取得
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await departmentService.getDepartments();
        setDepartments(data);
      } catch (err) {
        setError('部署データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // 選択された部署が変更されたときにセクションを取得
  useEffect(() => {
    if (!selectedDepartmentId) {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await departmentService.getDepartmentSections(selectedDepartmentId);
        setSections(data);
      } catch (err) {
        setError('セクションデータの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [selectedDepartmentId]);

  // 部署選択ハンドラー
  const handleDepartmentChange = (value: string) => {
    onDepartmentChange(value);

    // 部署が変更されたらセクション選択をリセット
    if (onSectionChange) {
      onSectionChange('');
    }
  };

  return (
    <div className="department-section-filter">
      <div className="filter-group">
        <label>部署</label>
        <Select
          value={selectedDepartmentId || ''}
          onChange={handleDepartmentChange}
          options={[
            { value: '', label: '全ての部署' },
            ...departments.map(dept => ({
              value: dept.id || '',
              label: dept.name,
            })),
          ]}
          disabled={loading}
        />
      </div>

      {onSectionChange && (
        <div className="filter-group">
          <label>セクション</label>
          <Select
            value={selectedSectionId || ''}
            onChange={onSectionChange}
            options={[
              { value: '', label: '全てのセクション' },
              ...sections.map(section => ({
                value: section.id,
                label: section.name,
              })),
            ]}
            disabled={loading || !selectedDepartmentId}
          />
        </div>
      )}

      {error && <div className="filter-error">{error}</div>}
    </div>
  );
};

export default DepartmentSectionFilter;
