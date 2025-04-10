import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import contractService, { Contract } from '../services/contractService';

const ContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 金額を表示用にフォーマット
  const formatPrice = (price: number): string => {
    return price.toLocaleString('ja-JP') + '円';
  };

  // 契約ステータスに応じたスタイルを取得
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case '契約中':
        return 'status-badge status-active';
      case '更新待ち':
        return 'status-badge status-pending';
      case '契約終了':
        return 'status-badge status-completed';
      default:
        return 'status-badge';
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
        <Button
          onClick={() => navigate('/contracts')}
          className="mt-4"
        >
          一覧に戻る
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">契約詳細</h1>
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate('/contracts')}
            className="mr-2"
          >
            一覧に戻る
          </Button>
          <Button
            onClick={() => navigate(`/contracts/${id}/edit`)}
          >
            編集
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}
      
      <div className="card p-6">
        <div className="flex justify-between mb-4">
          <div>
            <span className={getStatusStyle(contract.status)}>{contract.status}</span>
          </div>
          <div>
            <strong>登録日:</strong> {formatDate(contract.createdAt)}
            {contract.updatedAt && contract.updatedAt !== contract.createdAt && (
              <span> / <strong>更新日:</strong> {formatDate(contract.updatedAt)}</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">契約情報</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <th className="py-2 text-left">要員名</th>
                  <td className="py-2">
                    <a href={`/staff/${contract.staff.id}`} className="text-primary-color hover:underline">
                      {contract.staff.name}
                    </a>
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">案件名</th>
                  <td className="py-2">
                    <a href={`/projects/${contract.project.id}`} className="text-primary-color hover:underline">
                      {contract.project.name}
                    </a>
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">契約期間</th>
                  <td className="py-2">
                    {formatDate(contract.startDate)} 〜 {formatDate(contract.endDate)}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">契約単価</th>
                  <td className="py-2">{formatPrice(contract.price)}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">支払条件</th>
                  <td className="py-2">{contract.paymentTerms || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">詳細情報</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <th className="py-2 text-left">自動更新</th>
                  <td className="py-2">{contract.isAutoRenew ? 'あり' : 'なし'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">更新通知日</th>
                  <td className="py-2">{formatDate(contract.renewalNoticeDate)}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">契約書ファイル</th>
                  <td className="py-2">
                    {contract.contractFile ? 
                      <a href={contract.contractFile} target="_blank" rel="noopener noreferrer" className="text-primary-color hover:underline">
                        ダウンロード
                      </a> : 
                      '-'
                    }
                  </td>
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
    </div>
  );
};

export default ContractDetail;
