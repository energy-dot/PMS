import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Tabs from '../components/common/Tabs';
import staffService, { Staff } from '../services/staffService';
import contractService, { Contract } from '../services/contractService';
import evaluationService, { Evaluation } from '../services/evaluationService';
import fileUploadService from '../services/fileUploadService';

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [isContractsLoading, setIsContractsLoading] = useState(false);
  const [isEvaluationsLoading, setIsEvaluationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillSheets, setSkillSheets] = useState<any[]>([]);
  const [isSkillSheetsLoading, setIsSkillSheetsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchStaffData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 要員情報を取得
        const staffData = await staffService.getStaff(id);
        setStaff(staffData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'データの取得に失敗しました');
        console.error('Failed to fetch staff details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, [id]);

  useEffect(() => {
    if (!id || activeTab !== 'contracts') return;

    const fetchContracts = async () => {
      setIsContractsLoading(true);
      try {
        const data = await contractService.getContractsByStaffId(id);
        setContracts(data);
      } catch (err: any) {
        console.error('Failed to fetch contracts:', err);
      } finally {
        setIsContractsLoading(false);
      }
    };

    fetchContracts();
  }, [id, activeTab]);

  useEffect(() => {
    if (!id || activeTab !== 'evaluations') return;

    const fetchEvaluations = async () => {
      setIsEvaluationsLoading(true);
      try {
        const data = await evaluationService.getEvaluationsByStaffId(id);
        setEvaluations(data);
      } catch (err: any) {
        console.error('Failed to fetch evaluations:', err);
      } finally {
        setIsEvaluationsLoading(false);
      }
    };

    fetchEvaluations();
  }, [id, activeTab]);

  useEffect(() => {
    if (!id || activeTab !== 'skillsheets') return;

    const fetchSkillSheets = async () => {
      setIsSkillSheetsLoading(true);
      try {
        const data = await fileUploadService.getFilesByEntity('staff', id);
        setSkillSheets(data);
      } catch (err: any) {
        console.error('Failed to fetch skill sheets:', err);
      } finally {
        setIsSkillSheetsLoading(false);
      }
    };

    fetchSkillSheets();
  }, [id, activeTab]);

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 要員ステータスに応じたスタイルを取得
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case '稼働中':
        return 'status-badge status-active';
      case '待機中':
        return 'status-badge status-pending';
      case '契約終了':
        return 'status-badge status-completed';
      default:
        return 'status-badge';
    }
  };

  // スキルシートアップロード処理
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', 'staff');
    formData.append('entityId', id);
    
    try {
      await fileUploadService.uploadFile(formData);
      
      // スキルシート一覧を再取得
      const updatedSkillSheets = await fileUploadService.getFilesByEntity('staff', id);
      setSkillSheets(updatedSkillSheets);
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ファイルアップロードに失敗しました');
      console.error('Failed to upload file:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>データを読み込み中...</p>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center p-8">
        <p>要員情報が見つかりません。</p>
        <Button
          onClick={() => navigate('/staff')}
          className="mt-4"
        >
          一覧に戻る
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: '基本情報' },
    { id: 'skills', label: 'スキル情報' },
    { id: 'contracts', label: '契約履歴' },
    { id: 'evaluations', label: '評価履歴' },
    { id: 'skillsheets', label: 'スキルシート' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">{staff.name}</h1>
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate('/staff')}
            className="mr-2"
          >
            一覧に戻る
          </Button>
          <Button
            onClick={() => navigate(`/staff-evaluations/new?staffId=${id}`)}
            className="mr-2"
            variant="primary"
          >
            評価登録
          </Button>
          <Button
            onClick={() => navigate(`/staff/${id}/edit`)}
          >
            編集
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}
      
      <div className="card p-6 mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <span className={getStatusStyle(staff.status)}>{staff.status}</span>
          </div>
          <div>
            <strong>登録日:</strong> {formatDate(staff.createdAt)}
            {staff.updatedAt && staff.updatedAt !== staff.createdAt && (
              <span> / <strong>更新日:</strong> {formatDate(staff.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>
      
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === 'info' && (
          <div className="card p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">基本情報</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-2 text-left">氏名</th>
                      <td className="py-2">{staff.name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">所属会社</th>
                      <td className="py-2">
                        <a href={`/partners/${staff.partnerId}`} className="text-blue-600 hover:underline">
                          {staff.partner?.name || staff.partnerId}
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">メールアドレス</th>
                      <td className="py-2">{staff.email || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">電話番号</th>
                      <td className="py-2">{staff.phone || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">生年月日</th>
                      <td className="py-2">{formatDate(staff.birthDate) || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">性別</th>
                      <td className="py-2">{staff.gender || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">住所</th>
                      <td className="py-2">{staff.address || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">ステータス</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-2 text-left">現在のステータス</th>
                      <td className="py-2">{staff.status}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">経験年数</th>
                      <td className="py-2">{staff.experience ? `${staff.experience}年` : '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">備考</th>
                      <td className="py-2">{staff.remarks || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'skills' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">スキル情報</h3>
              <Button
                onClick={() => navigate(`/staff/${id}/skills/edit`)}
                variant="primary"
              >
                スキル編集
              </Button>
            </div>
            
            {staff.skills && staff.skills.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">言語・フレームワーク</h4>
                  <ul className="list-disc pl-5">
                    {staff.skills
                      .filter(skill => typeof skill === 'string')
                      .map((skill, index) => (
                        <li key={index} className="mb-1">{skill}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">その他スキル</h4>
                  <p>{staff.resume || '詳細なスキル情報はスキルシートをご確認ください。'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                スキル情報が登録されていません。
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'contracts' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">契約履歴</h3>
            
            {isContractsLoading ? (
              <div className="text-center py-4">契約データを読み込み中...</div>
            ) : contracts.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">案件名</th>
                    <th className="py-2 px-4 text-left">契約期間</th>
                    <th className="py-2 px-4 text-left">単価</th>
                    <th className="py-2 px-4 text-left">ステータス</th>
                    <th className="py-2 px-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="border-b">
                      <td className="py-2 px-4">
                        <a href={`/projects/${contract.projectId}`} className="text-blue-600 hover:underline">
                          {contract.project?.name || contract.projectId}
                        </a>
                      </td>
                      <td className="py-2 px-4">
                        {formatDate(contract.startDate)} 〜 {formatDate(contract.endDate)}
                      </td>
                      <td className="py-2 px-4">{contract.price?.toLocaleString() || '-'} 円</td>
                      <td className="py-2 px-4">
                        <span className={getStatusStyle(contract.status)}>{contract.status}</span>
                      </td>
                      <td className="py-2 px-4">
                        <a href={`/contracts/${contract.id}`} className="text-blue-600 hover:underline">
                          詳細
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">
                契約履歴はまだありません。
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'evaluations' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">評価履歴</h3>
              <Button
                onClick={() => navigate(`/staff-evaluations/new?staffId=${id}`)}
                variant="primary"
              >
                新規評価登録
              </Button>
            </div>
            
            {isEvaluationsLoading ? (
              <div className="text-center py-4">評価データを読み込み中...</div>
            ) : evaluations.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">評価日</th>
                    <th className="py-2 px-4 text-left">案件</th>
                    <th className="py-2 px-4 text-left">評価者</th>
                    <th className="py-2 px-4 text-left">総合評価</th>
                    <th className="py-2 px-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((evaluation) => (
                    <tr key={evaluation.id} className="border-b">
                      <td className="py-2 px-4">{formatDate(evaluation.evaluationDate)}</td>
                      <td className="py-2 px-4">
                        <a href={`/projects/${evaluation.projectId}`} className="text-blue-600 hover:underline">
                          {evaluation.project?.name || evaluation.projectId}
                        </a>
                      </td>
                      <td className="py-2 px-4">{evaluation.evaluator?.fullName || evaluation.evaluatorId}</td>
                      <td className="py-2 px-4">{evaluation.overallRating} / 5</td>
                      <td className="py-2 px-4">
                        <a href={`/staff-evaluations/${evaluation.id}`} className="text-blue-600 hover:underline">
                          詳細
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">
                評価履歴はまだありません。
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'skillsheets' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">スキルシート</h3>
              <div>
                <input
                  type="file"
                  id="skill-sheet"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="skill-sheet">
                  <Button
                    as="span"
                    variant="primary"
                    className="cursor-pointer"
                  >
                    スキルシートアップロード
                  </Button>
                </label>
              </div>
            </div>
            
            {isSkillSheetsLoading ? (
              <div className="text-center py-4">スキルシートを読み込み中...</div>
            ) : skillSheets.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">ファイル名</th>
                    <th className="py-2 px-4 text-left">種類</th>
                    <th className="py-2 px-4 text-left">サイズ</th>
                    <th className="py-2 px-4 text-left">アップロード日</th>
                    <th className="py-2 px-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {skillSheets.map((sheet) => (
                    <tr key={sheet.id} className="border-b">
                      <td className="py-2 px-4">{sheet.originalName}</td>
                      <td className="py-2 px-4">{sheet.mimeType}</td>
                      <td className="py-2 px-4">{(sheet.size / 1024).toFixed(2)} KB</td>
                      <td className="py-2 px-4">{formatDate(sheet.uploadDate)}</td>
                      <td className="py-2 px-4">
                        <a
                          href={`/api/file-upload/${sheet.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mr-2"
                        >
                          表示
                        </a>
                        <a
                          href={`/api/file-upload/download/${sheet.id}`}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          ダウンロード
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm('このファイルを削除してもよろしいですか？')) {
                              fileUploadService.deleteFile(sheet.id).then(() => {
                                setSkillSheets(skillSheets.filter(s => s.id !== sheet.id));
                              });
                            }
                          }}
                          className="text-red-600 hover:underline"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">
                スキルシートはまだアップロードされていません。
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDetail;
