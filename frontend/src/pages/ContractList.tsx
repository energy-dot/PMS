import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColDef } from 'ag-grid-community';
import DataGrid from '../components/grids/DataGrid';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import contractService, { Contract } from '../services/contractService';
import staffService from '../services/staffService';
import projectService from '../services/projectService';
import { DateEditor, SelectEditor, NumberEditor } from '../components/grids/editors';

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<{ id: string; name: string }[]>([]);
  const [projectOptions, setProjectOptions] = useState<{ id: string; name: string }[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  // 契約データ、要員、案件データの取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 契約データを取得
        const contractsData = await contractService.getContracts();
        setContracts(contractsData);

        // 要員データを取得（選択肢用）
        const staffData = await staffService.getAllStaff();
        setStaffOptions(
          staffData.map(staff => ({
            id: staff.id,
            name: staff.name,
          }))
        );

        // 案件データを取得（選択肢用）
        const projectsData = await projectService.getProjects();
        setProjectOptions(
          projectsData.map(project => ({
            id: project.id,
            name: project.name,
          }))
        );
      } catch (err: any) {
        setError(err.response?.data?.message || 'データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 新規登録処理
  const handleCreateContract = () => {
    // 編集モードの時は確認ダイアログ
    if (isEditable) {
      if (window.confirm('編集モードを終了して新規登録しますか？')) {
        setIsEditable(false);
        handleAddNewRow();
      }
    } else {
      // 編集モードを有効にして新規行を追加
      setIsEditable(true);
      setTimeout(() => {
        handleAddNewRow();
      }, 100);
    }
  };

  // グリッドに新規行を追加
  const handleAddNewRow = () => {
    // 現在の日付
    const today = new Date();
    // 6ヶ月後の日付
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    // 新規契約データの作成
    const newContract: any = {
      id: `new-${Date.now()}`,
      staffId: null,
      projectId: null,
      startDate: today,
      endDate: sixMonthsLater,
      price: 0,
      status: '契約中',
      isNew: true, // 新規行フラグ
    };

    // 新規行を追加
    setContracts(prev => [newContract, ...prev]);
  };

  // 詳細画面へ遷移
  const handleViewContract = (id: string) => {
    navigate(`/contracts/${id}`);
  };

  // 更新画面へ遷移
  const handleUpdateContract = (id: string) => {
    navigate(`/contracts/${id}/edit`);
  };

  // 編集モードの切り替え
  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  // セル編集時の処理
  const handleCellValueChanged = async (params: any) => {
    // 一括保存の場合
    if (params.type === 'saveAll') {
      setIsLoading(true);
      try {
        const promises = params.modifiedRows.map((row: any) => {
          const updateData = { ...row };

          // データクリーニング
          delete updateData._modified; // 変更追跡用プロパティを削除

          // 日付フィールドの処理
          if (updateData.startDate && !(updateData.startDate instanceof Date)) {
            updateData.startDate = new Date(updateData.startDate);
          }

          if (updateData.endDate && !(updateData.endDate instanceof Date)) {
            updateData.endDate = new Date(updateData.endDate);
          }

          // 必須フィールドの確認と設定
          if (!updateData.staffId && staffOptions.length > 0) {
            updateData.staffId = staffOptions[0].id;
          }

          if (!updateData.projectId && projectOptions.length > 0) {
            updateData.projectId = projectOptions[0].id;
          }

          if (!updateData.startDate) {
            updateData.startDate = new Date();
          }

          if (!updateData.endDate) {
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 6);
            updateData.endDate = endDate;
          }

          if (!updateData.price) {
            updateData.price = 0;
          }

          if (!updateData.status) {
            updateData.status = '契約中';
          }

          // 新規行の場合
          if (row.isNew) {
            delete updateData.isNew;
            delete updateData.id;
            return contractService.createContract(updateData);
          } else {
            // 既存行の更新
            return contractService.updateContract(row.id, updateData);
          }
        });

        await Promise.all(promises);

        // データ再取得
        const data = await contractService.getContracts();
        setContracts(data);

        // 成功メッセージを表示
        alert('変更を保存しました');
      } catch (err: any) {
        setError(err.response?.data?.message || '変更の保存に失敗しました');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 単一セル編集のハンドリング（即時保存しない場合）
  };

  // 行削除時のハンドラ
  const handleRowDeleted = async (data: Contract): Promise<boolean> => {
    // 新規行の場合は単に画面から消すだけ
    if (data.isNew) {
      return true;
    }

    try {
      // 既存データの場合はAPIで削除
      await contractService.deleteContract(data.id);
      return true;
    } catch (err) {
      setError('削除に失敗しました');
      return false;
    }
  };

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 金額を表示用にフォーマット
  const formatPrice = (price: number): string => {
    return price.toLocaleString('ja-JP') + '円';
  };

  // 契約期間を表示用にフォーマット
  const formatPeriod = (startDate: Date | string, endDate: Date | string): string => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // 契約データ列定義
  const columnDefs = useMemo<ColDef<Contract>[]>(
    () => [
      {
        field: 'staffId',
        headerName: '要員名',
        width: 150,
        editable: true,
        cellEditor: SelectEditor,
        cellEditorParams: {
          values: staffOptions.map(s => s.id),
          valueLabels: staffOptions.reduce((acc, s) => ({ ...acc, [s.id]: s.name }), {}),
        },
        valueGetter: params => params.data?.staffId || params.data?.staff?.id || null,
        valueFormatter: params => {
          const staffId = params.value;
          if (!staffId) return '';
          return staffOptions.find(s => s.id === staffId)?.name || params.data?.staff?.name || '';
        },
      },
      {
        field: 'projectId',
        headerName: '案件名',
        flex: 1,
        editable: true,
        cellEditor: SelectEditor,
        cellEditorParams: {
          values: projectOptions.map(p => p.id),
          valueLabels: projectOptions.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {}),
        },
        valueGetter: params => params.data?.projectId || params.data?.project?.id || null,
        valueFormatter: params => {
          const projectId = params.value;
          if (!projectId) return '';
          return (
            projectOptions.find(p => p.id === projectId)?.name || params.data?.project?.name || ''
          );
        },
      },
      {
        field: 'startDate',
        headerName: '開始日',
        width: 120,
        editable: true,
        cellEditor: DateEditor,
        valueFormatter: params => formatDate(params.value),
      },
      {
        field: 'endDate',
        headerName: '終了日',
        width: 120,
        editable: true,
        cellEditor: DateEditor,
        valueFormatter: params => formatDate(params.value),
      },
      {
        field: 'price',
        headerName: '契約単価',
        width: 120,
        editable: true,
        cellEditor: NumberEditor,
        cellEditorParams: {
          min: 0,
          step: 10000,
          currency: true,
          currencySymbol: '¥',
          useThousandSeparator: true,
        },
        valueFormatter: params => {
          if (!params.value && params.value !== 0) return '-';
          return formatPrice(params.value);
        },
      },
      {
        field: 'status',
        headerName: 'ステータス',
        width: 120,
        editable: true,
        cellEditor: SelectEditor,
        cellEditorParams: {
          values: ['契約中', '更新待ち', '契約終了'],
          allowEmpty: false,
        },
        cellRenderer: (params: import('ag-grid-community').ICellRendererParams<Contract>) => {
          const status = params.value;
          if (!status) return null;

          let className = '';
          switch (status) {
            case '契約中':
              className = 'bg-green-100 text-green-800';
              break;
            case '更新待ち':
              className = 'bg-yellow-100 text-yellow-800';
              break;
            case '契約終了':
              className = 'bg-gray-100 text-gray-800';
              break;
            default:
              className = 'bg-gray-100 text-gray-800';
          }

          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
              {status}
            </span>
          );
        },
      },
      {
        headerName: '操作',
        width: 120,
        editable: false,
        cellRenderer: (params: import('ag-grid-community').ICellRendererParams<Contract>) => {
          const id = params.data?.id || '';

          // 新規行の場合や編集モードの場合は操作ボタンを非表示
          if (params.data?.isNew || isEditable) return null;

          return (
            <div className="flex space-x-1">
              <button
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewContract(id);
                }}
              >
                詳細
              </button>
            </div>
          );
        },
      },
    ],
    [staffOptions, projectOptions, isEditable]
  );

  // APIがまだ整備されていない場合のフォールバックデータ
  const fallbackData = [
    {
      id: '1',
      staff: { id: '1', name: '山田 太郎' },
      staffId: '1',
      project: { id: '1', name: 'Javaエンジニア募集' },
      projectId: '1',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-10-31'),
      price: 800000,
      status: '契約中' as const,
    },
    {
      id: '2',
      staff: { id: '2', name: '佐藤 次郎' },
      staffId: '2',
      project: { id: '2', name: 'インフラエンジニア' },
      projectId: '2',
      startDate: new Date('2025-05-15'),
      endDate: new Date('2025-11-30'),
      price: 750000,
      status: '契約中' as const,
    },
    {
      id: '3',
      staff: { id: '3', name: '鈴木 三郎' },
      staffId: '3',
      project: { id: '3', name: 'フロントエンドエンジニア' },
      projectId: '3',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      price: 700000,
      status: '契約終了' as const,
    },
  ];

  // 表示用のデータ（APIから取得したデータがない場合はフォールバックデータを使用）
  const displayContracts = contracts.length > 0 ? contracts : fallbackData;

  // アクションボタン定義
  const actionButtons = [
    {
      label: isEditable ? '編集モード終了' : '編集モード',
      onClick: toggleEditMode,
      variant: isEditable ? 'warning' : 'primary',
    },
    {
      label: '新規登録',
      onClick: handleCreateContract,
      variant: 'success' as const,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">契約一覧</h1>
      </div>

      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}

      <DataGrid
        title="契約一覧"
        data={displayContracts}
        columns={columnDefs}
        pagination={true}
        pageSize={10}
        onRowClick={(data) => {
          if (data.id) {
            handleViewContract(data.id);
          }
        }}
        actionButtons={actionButtons}
        exportOptions={{
          fileName: '契約一覧',
          sheetName: '契約',
        }}
        loading={isLoading}
        error={error}
        editable={isEditable}
        onCellValueChanged={handleCellValueChanged}
        onRowDeleted={handleRowDeleted}
        height={600}
        checkboxSelection={isEditable}
      />

      {/* エクセルライクなグリッド表示のためのカスタムCSS */}
      <style jsx global>{`
        /* ステータス表示用の基本スタイル */
        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          display: inline-block;
          line-height: 1;
        }

        /* スタイルバリエーション */
        .status-active {
          background-color: #d1fae5;
          color: #047857;
        }

        .status-pending {
          background-color: #fef3c7;
          color: #b45309;
        }

        .status-completed {
          background-color: #e5e7eb;
          color: #4b5563;
        }

        .status-rejected {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        /* 編集モード時のセルスタイル強化 */
        .ag-theme-alpine-edit-mode .ag-cell-editable {
          background-color: rgba(240, 248, 255, 0.2);
        }

        /* 編集モード時のホバースタイル */
        .ag-theme-alpine-edit-mode .ag-cell-editable:hover {
          background-color: rgba(224, 242, 254, 0.5);
          box-shadow: inset 0 0 0 1px #4299e1;
        }

        /* 新規行のスタイル強化 */
        .ag-row-new {
          background-color: rgba(240, 255, 240, 0.4) !important;
        }

        /* 変更行のスタイル強化 */
        .ag-row-modified {
          background-color: rgba(255, 255, 224, 0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default ContractList;
