import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Department, Section } from 'shared-types';
import departmentService from '../../services/departmentService';

interface DepartmentSectionFilterProps {
  onDepartmentChange?: (departmentId: string | null) => void;
  onSectionChange?: (sectionId: string | null) => void;
  selectedDepartmentId?: string | null;
  selectedSectionId?: string | null;
  className?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  disabled?: boolean;
  placeholder?: {
    department?: string;
    section?: string;
  };
}

/**
 * 事業部・部の階層フィルターコンポーネント
 * 事業部を選択すると、その事業部に所属する部のみが選択肢として表示される
 */
const DepartmentSectionFilter: React.FC<DepartmentSectionFilterProps> = ({
  onDepartmentChange,
  onSectionChange,
  selectedDepartmentId = null,
  selectedSectionId = null,
  className = '',
  showAllOption = true,
  allOptionLabel = 'すべて',
  disabled = false,
  placeholder = {
    department: '事業部を選択',
    section: '部を選択',
  },
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 事業部と部のデータを取得
  useEffect(() => {
    const fetchDepartmentsAndSections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const departmentsData = await departmentService.getDepartmentsWithSections();
        setDepartments(departmentsData);
        
        // 事業部に所属するすべての部をフラットな配列に変換
        const allSections = departmentsData.reduce<Section[]>((acc, dept) => {
          if (dept.sections && dept.sections.length > 0) {
            return [...acc, ...dept.sections];
          }
          return acc;
        }, []);
        
        setSections(allSections);
      } catch (err: any) {
        setError(err.response?.data?.message || 'データの取得に失敗しました');
        console.error('Failed to fetch departments and sections:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentsAndSections();
  }, []);

  // 選択された事業部に所属する部のみをフィルタリング
  const filteredSections = useMemo(() => {
    if (!selectedDepartmentId) {
      return sections;
    }
    return sections.filter(section => section.departmentId === selectedDepartmentId);
  }, [selectedDepartmentId, sections]);

  // 事業部選択時のハンドラ
  const handleDepartmentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value || null;
    if (onDepartmentChange) {
      onDepartmentChange(departmentId);
    }
    
    // 事業部が変更されたら、選択中の部をクリア
    if (onSectionChange) {
      onSectionChange(null);
    }
  }, [onDepartmentChange, onSectionChange]);

  // 部選択時のハンドラ
  const handleSectionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const sectionId = e.target.value || null;
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  }, [onSectionChange]);

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        <p>エラー: {error}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {/* 事業部選択 */}
      <div className="w-full sm:w-1/2">
        <select
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
          value={selectedDepartmentId || ''}
          onChange={handleDepartmentChange}
          disabled={disabled || isLoading}
          aria-label="事業部選択"
          data-testid="department-select"
        >
          {showAllOption && (
            <option value="">{allOptionLabel}</option>
          )}
          {!showAllOption && !selectedDepartmentId && (
            <option value="" disabled>
              {placeholder.department}
            </option>
          )}
          {departments.map(department => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* 部選択 */}
      <div className="w-full sm:w-1/2">
        <select
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
          value={selectedSectionId || ''}
          onChange={handleSectionChange}
          disabled={disabled || isLoading || (!selectedDepartmentId && !showAllOption)}
          aria-label="部選択"
          data-testid="section-select"
        >
          {showAllOption && (
            <option value="">{allOptionLabel}</option>
          )}
          {!showAllOption && !selectedSectionId && (
            <option value="" disabled>
              {placeholder.section}
            </option>
          )}
          {filteredSections.map(section => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DepartmentSectionFilter;
