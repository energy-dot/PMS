import { MasterData } from '../shared-types';

// マスターデータのモックデータ
export const mockMasterDataTypes: string[] = [
  'project_status',
  'project_type',
  'contract_type',
  'skill_category',
  'skill_level',
  'industry',
  'business_size',
  'payment_term',
  'evaluation_criteria',
  'partner_status'
];

// マスターデータのモックデータ
export const mockMasterData: MasterData[] = [
  // プロジェクトステータス
  {
    id: 'master-1',
    type: 'project_status',
    name: 'planning',
    displayName: '計画中',
    description: 'プロジェクトが計画段階にあります',
    sortOrder: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-2',
    type: 'project_status',
    name: 'in_progress',
    displayName: '進行中',
    description: 'プロジェクトが実行段階にあります',
    sortOrder: 2,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-3',
    type: 'project_status',
    name: 'completed',
    displayName: '完了',
    description: 'プロジェクトが完了しました',
    sortOrder: 3,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-4',
    type: 'project_status',
    name: 'cancelled',
    displayName: '中止',
    description: 'プロジェクトが中止されました',
    sortOrder: 4,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  
  // プロジェクトタイプ
  {
    id: 'master-5',
    type: 'project_type',
    name: 'system_development',
    displayName: 'システム開発',
    description: '新規システムの開発プロジェクト',
    sortOrder: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-6',
    type: 'project_type',
    name: 'system_maintenance',
    displayName: 'システム保守',
    description: '既存システムの保守プロジェクト',
    sortOrder: 2,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-7',
    type: 'project_type',
    name: 'consulting',
    displayName: 'コンサルティング',
    description: 'ITコンサルティングプロジェクト',
    sortOrder: 3,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  
  // 契約タイプ
  {
    id: 'master-8',
    type: 'contract_type',
    name: 'fixed_price',
    displayName: '固定価格',
    description: '固定価格での契約',
    sortOrder: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-9',
    type: 'contract_type',
    name: 'time_and_materials',
    displayName: '時間・材料ベース',
    description: '時間と材料に基づく契約',
    sortOrder: 2,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-10',
    type: 'contract_type',
    name: 'retainer',
    displayName: '顧問契約',
    description: '定期的な支払いによる顧問契約',
    sortOrder: 3,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  
  // スキルカテゴリ
  {
    id: 'master-11',
    type: 'skill_category',
    name: 'programming',
    displayName: 'プログラミング',
    description: 'プログラミング言語やフレームワークに関するスキル',
    sortOrder: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-12',
    type: 'skill_category',
    name: 'database',
    displayName: 'データベース',
    description: 'データベース関連のスキル',
    sortOrder: 2,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-13',
    type: 'skill_category',
    name: 'infrastructure',
    displayName: 'インフラストラクチャ',
    description: 'サーバー、ネットワーク、クラウドなどのインフラ関連スキル',
    sortOrder: 3,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  
  // スキルレベル
  {
    id: 'master-14',
    type: 'skill_level',
    name: 'beginner',
    displayName: '初級',
    description: '基本的な知識と経験を持つレベル',
    sortOrder: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-15',
    type: 'skill_level',
    name: 'intermediate',
    displayName: '中級',
    description: '実務経験があり、自立して作業できるレベル',
    sortOrder: 2,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-16',
    type: 'skill_level',
    name: 'advanced',
    displayName: '上級',
    description: '高度な知識と経験を持ち、他者を指導できるレベル',
    sortOrder: 3,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-17',
    type: 'skill_level',
    name: 'expert',
    displayName: 'エキスパート',
    description: '専門家レベルの知識と経験を持ち、複雑な問題を解決できるレベル',
    sortOrder: 4,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  
  // 業界
  {
    id: 'master-18',
    type: 'industry',
    name: 'finance',
    displayName: '金融',
    description: '銀行、保険、証券などの金融業界',
    sortOrder: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-19',
    type: 'industry',
    name: 'manufacturing',
    displayName: '製造業',
    description: '製造業全般',
    sortOrder: 2,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'master-20',
    type: 'industry',
    name: 'retail',
    displayName: '小売業',
    description: '小売業全般',
    sortOrder: 3,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];
