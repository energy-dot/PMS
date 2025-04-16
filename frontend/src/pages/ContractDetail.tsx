import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Tabs from '../components/common/Tabs';
import contractService, { Contract } from '../services/contractService';
import fileUploadService from '../services/fileUploadService';

const ContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contract, setContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchContractData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 契約情報を取得
        const contractData = await contractService.getContract(id);
        setContract(contractData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'データの取得に失敗しました');
        console.error('Failed to fetch contract details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractData();
  }, [id]);

  useEffect(() => {
    if (!id || activeTab !== 'documents') return;

    const fetchDocuments = async () => {
      setIsDocumentsLoading(true);
      try {
        const data = await fileUploadService.getFilesByEntity('contract', id);
        setDocuments(data);
      } catch (err: any) {
        console.error('Failed to fetch documents:', err);
      } finally {
        setIsDocumentsLoading(false);
      }
    };

    fetchDocuments();
  }, [id, activeTab]);

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 契約ステータスに応じたスタイルを取得
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case '契約中':
        return 'status-badge status-active';
      case '契約終了':
        return 'status-badge status-completed';
      case '更新待ち':
        return 'status-badge status-pending';
      default:
        return 'status-badge';
    }
  };

  // 契約更新処理
  const handleRenewContract = () => {
    if (!id) return;
    navigate(`/contracts/renew/${id}`);
  };

  // 契約終了処理
  const handleTerminateContract = async () => {
    if (!id || !contract) return;

    if (!window.confirm('この契約を終了してもよろしいですか？')) {
      return;
    }

    try {
      await contractService.terminateContract(id);

      // 契約情報を再取得して表示を更新
      const updatedContract = await contractService.getContract(id);
      setContract(updatedContract);

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || '契約終了処理に失敗しました');
      console.error('Failed to terminate contract:', err);
    }
  };

  // ファイルアップロード処理
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', 'contract');
    formData.append('entityId', id);

    try {
      await fileUploadService.uploadFile(formData);

      // ドキュメント一覧を再取得
      const updatedDocuments = await fileUploadService.getFilesByEntity('contract', id);
      setDocuments(updatedDocuments);

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

  if (!contract) {
    return (
      <div className="text-center p-8">
        <p>契約情報が見つかりません。</p>
        <Button onClick={() => navigate('/contracts')} className="mt-4">
          一覧に戻る
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: '基本情報' },
    { id: 'documents', label: '契約書類' },
    { id: 'history', label: '更新履歴' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">契約詳細</h1>
        <div>
          <Button variant="secondary" onClick={() => navigate('/contracts')} className="mr-2">
            一覧に戻る
          </Button>
          {contract.status === '契約中' && (
            <>
              <Button onClick={handleRenewContract} className="mr-2" variant="primary">
                契約更新
              </Button>
              <Button onClick={handleTerminateContract} className="mr-2" variant="danger">
                契約終了
              </Button>
            </>
          )}
          <Button onClick={() => navigate(`/contracts/${id}/edit`)}>編集</Button>
        </div>
      </div>

      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}

      <div className="card p-6 mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <span className={getStatusStyle(contract.status)}>{contract.status}</span>
          </div>
          <div>
            <strong>登録日:</strong> {formatDate(contract.createdAt)}
            {contract.updatedAt && contract.updatedAt !== contract.createdAt && (
              <span>
                {' '}
                / <strong>更新日:</strong> {formatDate(contract.updatedAt)}
              </span>
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
                <h3 className="text-lg font-semibold mb-4">契約情報</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-2 text-left">要員名</th>
                      <td className="py-2">
                        <a
                          href={`/staff/${contract.staffId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contract.staff?.name || contract.staffId}
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">案件名</th>
                      <td className="py-2">
                        <a
                          href={`/projects/${contract.projectId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contract.project?.name || contract.projectId}
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">契約形態</th>
                      <td className="py-2">{contract.contractType || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">契約期間</th>
                      <td className="py-2">
                        {formatDate(contract.startDate)} 〜 {formatDate(contract.endDate)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">自動更新</th>
                      <td className="py-2">{contract.isAutoRenew ? '有り' : '無し'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">更新通知日</th>
                      <td className="py-2">{formatDate(contract.renewalNoticeDate) || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">金額・支払い条件</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-2 text-left">契約単価</th>
                      <td className="py-2">{contract.price?.toLocaleString() || '-'} 円</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">支払条件</th>
                      <td className="py-2">{contract.paymentTerms || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">備考</th>
                      <td className="py-2">{contract.remarks || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">契約書類</h3>
              <div>
                <input
                  type="file"
                  id="contract-document"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="contract-document">
                  <Button as="span" variant="primary" className="cursor-pointer">
                    書類アップロード
                  </Button>
                </label>
              </div>
            </div>

            {isDocumentsLoading ? (
              <div className="text-center py-4">書類データを読み込み中...</div>
            ) : documents.length > 0 ? (
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
                  {documents.map(doc => (
                    <tr key={doc.id} className="border-b">
                      <td className="py-2 px-4">{doc.originalName}</td>
                      <td className="py-2 px-4">{doc.mimeType}</td>
                      <td className="py-2 px-4">{(doc.size / 1024).toFixed(2)} KB</td>
                      <td className="py-2 px-4">{formatDate(doc.uploadDate)}</td>
                      <td className="py-2 px-4">
                        <a
                          href={`/api/file-upload/${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mr-2"
                        >
                          表示
                        </a>
                        <a
                          href={`/api/file-upload/download/${doc.id}`}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          ダウンロード
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm('このファイルを削除してもよろしいですか？')) {
                              fileUploadService.deleteFile(doc.id).then(() => {
                                setDocuments(documents.filter(d => d.id !== doc.id));
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
                この契約に関連する書類はまだアップロードされていません。
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">契約更新履歴</h3>

            <div className="text-center py-4">この契約の更新履歴はまだありません。</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetail;
