// StaffList.tsxの修正 - ButtonVariantのインポートエラーを修正

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';

// ButtonVariantではなく、ButtonPropsをインポート
import Button, { ButtonProps } from '../components/common/Button';
import { Staff } from '../shared-types';
import { getStaffs, deleteStaff } from '../services/staffService';
import DepartmentSectionFilter from '../components/filters/DepartmentSectionFilter';

const StaffList: React.FC = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // スタッフデータの取得
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        setLoading(true);
        const data = await getStaffs();
        setStaffs(data);
        setFilteredStaffs(data);
        setLoading(false);
      } catch (err) {
        setError('スタッフデータの取得に失敗しました');
        setLoading(false);
        console.error('Failed to fetch staffs:', err);
      }
    };

    fetchStaffs();
  }, []);

  // 検索とフィルタリング
  useEffect(() => {
    let result = staffs;

    // 検索語でフィルタリング
    if (searchTerm) {
      result = result.filter(
        staff =>
          staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (staff.name && staff.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 部署でフィルタリング
    if (selectedDepartment) {
      // 実際のアプリケーションでは、スタッフと部署の関連付けに基づいてフィルタリング
      // このデモでは単純化のため、フィルタリングをスキップ
    }

    // セクションでフィルタリング
    if (selectedSection) {
      // 実際のアプリケーションでは、スタッフとセクションの関連付けに基づいてフィルタリング
      // このデモでは単純化のため、フィルタリングをスキップ
    }

    setFilteredStaffs(result);
  }, [staffs, searchTerm, selectedDepartment, selectedSection]);

  // スタッフ削除の処理
  const handleDelete = async (id: string) => {
    if (window.confirm('このスタッフを削除してもよろしいですか？')) {
      try {
        await deleteStaff(id);
        setStaffs(staffs.filter(staff => staff.id !== id));
        alert('スタッフが削除されました');
      } catch (err) {
        setError('スタッフの削除に失敗しました');
        console.error('Failed to delete staff:', err);
      }
    }
  };

  // 部署フィルターの変更ハンドラー
  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setSelectedSection(''); // 部署が変更されたらセクションをリセット
  };

  // セクションフィルターの変更ハンドラー
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="staff-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>スタッフ一覧</h2>
        <Link to="/staff/new">
          <Button variant="primary">
            <FaPlus className="mr-2" /> 新規スタッフ
          </Button>
        </Link>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="スタッフを検索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={8}>
          <DepartmentSectionFilter
            onDepartmentChange={handleDepartmentChange}
            onSectionChange={handleSectionChange}
            selectedDepartment={selectedDepartment}
            selectedSection={selectedSection}
          />
        </Col>
      </Row>

      {filteredStaffs.length === 0 ? (
        <div className="alert alert-info">スタッフが見つかりません</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>名前</th>
              <th>メールアドレス</th>
              <th>スキル</th>
              <th>経験年数</th>
              <th>時給</th>
              <th>稼働状況</th>
              <th>ステータス</th>
              <th>アクション</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs.map(staff => (
              <tr key={staff.id}>
                <td>
                  {staff.firstName} {staff.lastName}
                </td>
                <td>{staff.email}</td>
                <td>{staff.skills.join(', ')}</td>
                <td>{staff.experience}年</td>
                <td>¥{staff.hourlyRate.toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${staff.availability === 'available' ? 'bg-success' : staff.availability === 'partially_available' ? 'bg-warning' : 'bg-danger'}`}
                  >
                    {staff.availability === 'available'
                      ? '稼働可能'
                      : staff.availability === 'partially_available'
                        ? '一部稼働可能'
                        : '稼働不可'}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${staff.status === 'active' ? 'bg-success' : staff.status === 'assigned' ? 'bg-primary' : 'bg-secondary'}`}
                  >
                    {staff.status === 'active'
                      ? 'アクティブ'
                      : staff.status === 'assigned'
                        ? 'アサイン済み'
                        : '非アクティブ'}
                  </span>
                </td>
                <td>
                  <div className="d-flex">
                    <Link to={`/staff/${staff.id}`} className="btn btn-sm btn-info me-2">
                      <FaEye />
                    </Link>
                    <Link to={`/staff/${staff.id}/edit`} className="btn btn-sm btn-warning me-2">
                      <FaEdit />
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => staff.id && handleDelete(staff.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StaffList;
