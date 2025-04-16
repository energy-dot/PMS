// pages/StaffSearch.tsxの修正

import React, { useState, useEffect } from 'react';
import DataGrid from '../components/grids/DataGrid';
import DepartmentSectionFilter from '../components/filters/DepartmentSectionFilter';
import { Staff } from '../shared-types';
import staffService, { SearchStaffParams } from '../services/staffService';
import partnerService from '../services/partnerService';

// StaffSearchコンポーネント
const StaffSearch: React.FC = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchStaffParams>({});
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [partnerNames, setPartnerNames] = useState<Record<string, string>>({});

  // スタッフデータの検索
  useEffect(() => {
    const searchStaffs = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await staffService.searchStaffs(searchParams);
        setStaffs(data);

        // パートナー名を取得
        const partnerIds = [...new Set(data.map(staff => staff.partnerId))];
        const partnerData: Record<string, string> = {};

        for (const partnerId of partnerIds) {
          try {
            const partner = await partnerService.getPartnerById(partnerId);
            partnerData[partnerId] = partner.name;
          } catch (err) {
            console.error(`Failed to fetch partner ${partnerId}:`, err);
            partnerData[partnerId] = partnerId;
          }
        }

        setPartnerNames(partnerData);
      } catch (err) {
        setError('スタッフデータの検索に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    searchStaffs();
  }, [searchParams]);

  // 検索パラメータの更新
  const updateSearchParams = (params: Partial<SearchStaffParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  // DataGridのカラム定義
  const columns = [
    {
      field: 'name',
      headerName: '氏名',
      width: 150,
      renderCell: (row: Staff) => <a href={`/staffs/${row.id}`}>{row.name}</a>,
    },
    {
      field: 'partnerId',
      headerName: 'パートナー',
      width: 200,
      renderCell: (row: Staff) => partnerNames[row.partnerId] || row.partnerId,
    },
    {
      field: 'skills',
      headerName: 'スキル',
      width: 300,
      renderCell: (row: Staff) => (
        <div className="skills-list">
          {row.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      ),
    },
    {
      field: 'availability',
      headerName: '稼働状況',
      width: 120,
      renderCell: (row: Staff) => {
        let statusClass = '';
        let statusText = '';

        switch (row.availability) {
          case 'available':
            statusClass = 'status-available';
            statusText = '稼働可能';
            break;
          case 'partially_available':
            statusClass = 'status-partial';
            statusText = '一部稼働可';
            break;
          case 'unavailable':
            statusClass = 'status-unavailable';
            statusText = '稼働不可';
            break;
          default:
            statusText = row.availability;
        }

        return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
      },
    },
  ];

  return (
    <div className="staff-search-page">
      <h1>スタッフ検索</h1>

      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>スキル</label>
            <input
              type="text"
              placeholder="スキルを入力（カンマ区切り）"
              onChange={e => {
                const skills = e.target.value
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean);
                updateSearchParams({ skills: skills.length > 0 ? skills : undefined });
              }}
              className="form-control"
            />
          </div>

          <div className="filter-group">
            <label>稼働状況</label>
            <select
              onChange={e => updateSearchParams({ availability: e.target.value || undefined })}
              className="form-control"
            >
              <option value="">すべて</option>
              <option value="available">稼働可能</option>
              <option value="partially_available">一部稼働可</option>
              <option value="unavailable">稼働不可</option>
            </select>
          </div>

          <div className="filter-group">
            <label>経験年数</label>
            <select
              onChange={e =>
                updateSearchParams({
                  experience: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="form-control"
            >
              <option value="">指定なし</option>
              <option value="1">1年以上</option>
              <option value="3">3年以上</option>
              <option value="5">5年以上</option>
              <option value="10">10年以上</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <DepartmentSectionFilter
            onDepartmentChange={setSelectedDepartmentId}
            selectedDepartmentId={selectedDepartmentId}
          />
        </div>
      </div>

      <DataGrid
        data={staffs}
        columns={columns}
        loading={loading}
        onRowClick={row => {
          window.location.href = `/staffs/${row.id}`;
        }}
        emptyMessage={error || 'スタッフデータがありません'}
      />
    </div>
  );
};

export default StaffSearch;
