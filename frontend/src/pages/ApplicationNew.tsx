import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import applicationService, { CreateApplicationDto } from '../services/applicationService';
import projectService from '../services/projectService';
import partnerService from '../services/partnerService';

const ApplicationNew: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [formData, setFormData] = useState<CreateApplicationDto>({
    projectId: '',
    partnerId: '',
    applicantName: '',
    applicationDate: new Date(),
    status: '新規応募'
  });
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [partnersLoaded, setPartnersLoaded] = useState(false);

  // 案件とパートナー会社のデータを取得
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
        setProjectsLoaded(true);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('案件データの取得に失敗しました');
      }
    };

    const fetchPartners = async () => {
      try {
        const data = await partnerService.getPartners();
        setPartners(data);
        setPartnersLoaded(true);
      } catch (err) {
        console.error('Failed to fetch partners:', err);
        setError('パートナー会社データの取得に失敗しました');
      }
    };

    fetchProjects();
    fetchPartners();
  }, []);

  // フォーム入力の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'applicationDate' ? new Date(value) : value
    });
  };

  // 応募者情報の登録
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await applicationService.createApplication(formData);
      alert('応募者情報を登録しました');
      navigate('/applications');
    } catch (err: any) {
      setError(err.response?.data?.message || '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 一覧画面に戻る
  const handleBack = () => {
    navigate('/applications');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">応募者新規登録</h1>
        <Button onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
          一覧に戻る
        </Button>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {(!projectsLoaded || !partnersLoaded) ? (
          <div className="flex justify-center items-center h-64">データ読み込み中...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  案件 <span className="text-red-600">*</span>
                </label>
                <select
                  name="projectId"
                  value={formData.projectId || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">選択してください</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パートナー会社 <span className="text-red-600">*</span>
                </label>
                <select
                  name="partnerId"
                  value={formData.partnerId || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">選択してください</option>
                  {partners.map(partner => (
                    <option key={partner.id} value={partner.id}>{partner.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  応募者名 <span className="text-red-600">*</span>
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  応募日 <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="applicationDate"
                  value={formData.applicationDate instanceof Date 
                    ? formData.applicationDate.toISOString().split('T')[0] 
                    : ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年齢
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  性別
                </label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最寄り駅
                </label>
                <input
                  type="text"
                  name="nearestStation"
                  value={formData.nearestStation || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  希望単価
                </label>
                <input
                  type="text"
                  name="desiredRate"
                  value={formData.desiredRate || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  スキル概要
                </label>
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
                  備考
                </label>
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
                {isLoading ? '登録中...' : '登録'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationNew;
