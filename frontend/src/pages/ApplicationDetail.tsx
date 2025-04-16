import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import applicationService, {
  Application,
  InterviewRecord,
  CreateInterviewRecordDto,
} from '../services/applicationService';
import projectService from '../services/projectService';
import partnerService from '../services/partnerService';
import userService from '../services/userService';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [interviewRecords, setInterviewRecords] = useState<InterviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [statusOptions] = useState([
    '新規応募',
    '書類選考中',
    '書類NG',
    '書類OK',
    '面談調整中',
    '面談設定済',
    '面談NG',
    '面談OK',
    '内定',
    '採用',
    '見送り',
    '辞退',
  ]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Application>>({});
  const [newInterviewRecord, setNewInterviewRecord] = useState<CreateInterviewRecordDto>({
    applicationId: id || '',
    interviewDate: new Date(),
    interviewFormat: 'オンライン',
    evaluation: '',
    evaluationComment: '',
  });
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  // 応募者データの取得
  useEffect(() => {
    if (!id) return;

    const fetchApplicationData = async () => {
      setIsLoading(true);
      try {
        const data = await applicationService.getApplication(id);
        setApplication(data);
        setFormData(data);

        // 関連データの取得
        if (data.projectId) {
          try {
            const project = await projectService.getProject(data.projectId);
            setProjectName(project.name);
          } catch (err) {
            console.error('Failed to fetch project:', err);
          }
        }

        if (data.partnerId) {
          try {
            const partner = await partnerService.getPartner(data.partnerId);
            setPartnerName(partner.name);
          } catch (err) {
            console.error('Failed to fetch partner:', err);
          }
        }

        // 面談記録の取得
        try {
          const records = await applicationService.getInterviewRecordsByApplication(id);
          setInterviewRecords(records);
        } catch (err) {
          console.error('Failed to fetch interview records:', err);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '応募者データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationData();
  }, [id]);

  // フォーム入力の処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 新規面談記録フォーム入力の処理
  const handleInterviewInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewInterviewRecord({
      ...newInterviewRecord,
      [name]: name === 'interviewDate' ? new Date(value) : value,
    });
  };

  // 応募者情報の更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsLoading(true);
    try {
      const updatedApplication = await applicationService.updateApplication(id, formData);
      setApplication(updatedApplication);
      setEditMode(false);
      alert('応募者情報を更新しました');
    } catch (err: any) {
      setError(err.response?.data?.message || '更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 面談記録の追加
  const handleAddInterviewRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsLoading(true);
    try {
      const newRecord = await applicationService.createInterviewRecord(newInterviewRecord);
      setInterviewRecords([...interviewRecords, newRecord]);
      setShowInterviewForm(false);
      setNewInterviewRecord({
        applicationId: id,
        interviewDate: new Date(),
        interviewFormat: 'オンライン',
        evaluation: '',
        evaluationComment: '',
      });
      alert('面談記録を追加しました');
    } catch (err: any) {
      setError(err.response?.data?.message || '面談記録の追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 日付のフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 一覧画面に戻る
  const handleBack = () => {
    navigate('/applications');
  };

  if (isLoading && !application) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  if (error && !application) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert type="error">{error}</Alert>
        <Button onClick={handleBack} className="mt-4">
          一覧に戻る
        </Button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert type="error">応募者データが見つかりません</Alert>
        <Button onClick={handleBack} className="mt-4">
          一覧に戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">応募者詳細</h1>
        <div className="flex space-x-2">
          {!editMode ? (
            <Button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              編集
            </Button>
          ) : (
            <Button
              onClick={() => setEditMode(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              キャンセル
            </Button>
          )}
          <Button onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            一覧に戻る
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">応募者名</label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最寄り駅</label>
                <input
                  type="text"
                  name="nearestStation"
                  value={formData.nearestStation || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">希望単価</label>
                <input
                  type="text"
                  name="desiredRate"
                  value={formData.desiredRate || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">スキル概要</label>
                <textarea
                  name="skillSummary"
                  value={formData.skillSummary || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  書類選考コメント
                </label>
                <textarea
                  name="documentScreeningComment"
                  value={formData.documentScreeningComment || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                <textarea
                  name="remarks"
                  value={formData.remarks || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">応募者名</h3>
              <p className="mt-1 text-lg">{application.applicantName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">案件</h3>
              <p className="mt-1">{projectName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">パートナー会社</h3>
              <p className="mt-1">{partnerName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">応募日</h3>
              <p className="mt-1">{formatDate(application.applicationDate)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
              <p className="mt-1">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    application.status === '新規応募'
                      ? 'bg-blue-100 text-blue-800'
                      : application.status === '書類選考中'
                        ? 'bg-yellow-100 text-yellow-800'
                        : application.status === '書類NG'
                          ? 'bg-red-100 text-red-800'
                          : application.status === '書類OK'
                            ? 'bg-green-100 text-green-800'
                            : application.status === '面談調整中'
                              ? 'bg-purple-100 text-purple-800'
                              : application.status === '面談設定済'
                                ? 'bg-indigo-100 text-indigo-800'
                                : application.status === '面談NG'
                                  ? 'bg-red-100 text-red-800'
                                  : application.status === '面談OK'
                                    ? 'bg-green-100 text-green-800'
                                    : application.status === '内定'
                                      ? 'bg-green-200 text-green-800'
                                      : application.status === '採用'
                                        ? 'bg-green-300 text-green-800'
                                        : application.status === '見送り'
                                          ? 'bg-gray-100 text-gray-800'
                                          : application.status === '辞退'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {application.status}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">年齢</h3>
              <p className="mt-1">{application.age || '-'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">性別</h3>
              <p className="mt-1">{application.gender || '-'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">最寄り駅</h3>
              <p className="mt-1">{application.nearestStation || '-'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">希望単価</h3>
              <p className="mt-1">{application.desiredRate || '-'}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">スキル概要</h3>
              <p className="mt-1 whitespace-pre-line">{application.skillSummary || '-'}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">書類選考コメント</h3>
              <p className="mt-1 whitespace-pre-line">
                {application.documentScreeningComment || '-'}
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">備考</h3>
              <p className="mt-1 whitespace-pre-line">{application.remarks || '-'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">面談記録</h2>
          <Button
            onClick={() => setShowInterviewForm(!showInterviewForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {showInterviewForm ? '閉じる' : '面談記録を追加'}
          </Button>
        </div>

        {showInterviewForm && (
          <form
            onSubmit={handleAddInterviewRecord}
            className="mb-6 p-4 border border-gray-200 rounded-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">面談日</label>
                <input
                  type="date"
                  name="interviewDate"
                  value={
                    newInterviewRecord.interviewDate instanceof Date
                      ? newInterviewRecord.interviewDate.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={handleInterviewInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">面談形式</label>
                <select
                  name="interviewFormat"
                  value={newInterviewRecord.interviewFormat || ''}
                  onChange={handleInterviewInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="オンライン">オンライン</option>
                  <option value="対面">対面</option>
                  <option value="電話">電話</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">評価</label>
                <select
                  name="evaluation"
                  value={newInterviewRecord.evaluation || ''}
                  onChange={handleInterviewInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">選択してください</option>
                  <option value="A">A（採用推奨）</option>
                  <option value="B">B（採用可）</option>
                  <option value="C">C（保留）</option>
                  <option value="D">D（不採用）</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">評価コメント</label>
                <textarea
                  name="evaluationComment"
                  value={newInterviewRecord.evaluationComment || ''}
                  onChange={handleInterviewInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        )}

        {interviewRecords.length === 0 ? (
          <p className="text-gray-500 italic">面談記録はありません</p>
        ) : (
          <div className="space-y-4">
            {interviewRecords.map(record => (
              <div key={record.id} className="border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">面談日</h3>
                    <p className="mt-1">{formatDate(record.interviewDate)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">面談形式</h3>
                    <p className="mt-1">{record.interviewFormat}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">評価</h3>
                    <p className="mt-1">{record.evaluation || '-'}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">評価コメント</h3>
                    <p className="mt-1 whitespace-pre-line">{record.evaluationComment || '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
