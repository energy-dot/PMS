import { Section } from '../shared-types';

// セクション情報のモックデータ
export const mockSections: Section[] = [
  { 
    id: 'section-1', 
    name: 'フロントエンド開発チーム', 
    departmentId: 'dept-1', 
    leaderId: 'user-5', 
    memberCount: 15, 
    description: 'フロントエンド開発を担当するチーム',
    location: '東京本社 5階東',
    establishedDate: '2020-01-15'
  },
  { 
    id: 'section-2', 
    name: 'バックエンド開発チーム', 
    departmentId: 'dept-1', 
    leaderId: 'user-6', 
    memberCount: 20, 
    description: 'バックエンド開発を担当するチーム',
    location: '東京本社 5階西',
    establishedDate: '2020-01-15'
  },
  { 
    id: 'section-3', 
    name: 'インフラチーム', 
    departmentId: 'dept-1', 
    leaderId: 'user-7', 
    memberCount: 10, 
    description: 'インフラ構築と運用を担当するチーム',
    location: '東京本社 6階',
    establishedDate: '2020-02-01'
  },
  { 
    id: 'section-4', 
    name: '国内営業チーム', 
    departmentId: 'dept-2', 
    leaderId: 'user-8', 
    memberCount: 15, 
    description: '国内顧客向け営業活動を担当するチーム',
    location: '東京本社 3階東',
    establishedDate: '2020-01-15'
  },
  { 
    id: 'section-5', 
    name: '海外営業チーム', 
    departmentId: 'dept-2', 
    leaderId: 'user-9', 
    memberCount: 15, 
    description: '海外顧客向け営業活動を担当するチーム',
    location: '東京本社 3階西',
    establishedDate: '2020-03-01'
  },
  { 
    id: 'section-6', 
    name: '採用チーム', 
    departmentId: 'dept-3', 
    leaderId: 'user-10', 
    memberCount: 5, 
    description: '採用活動を担当するチーム',
    location: '東京本社 2階北',
    establishedDate: '2020-01-15'
  },
  { 
    id: 'section-7', 
    name: '人材育成チーム', 
    departmentId: 'dept-3', 
    leaderId: 'user-11', 
    memberCount: 5, 
    description: '社員教育と人材育成を担当するチーム',
    location: '東京本社 2階南',
    establishedDate: '2020-01-15'
  },
  { 
    id: 'section-8', 
    name: '会計チーム', 
    departmentId: 'dept-4', 
    leaderId: 'user-12', 
    memberCount: 4, 
    description: '会計処理を担当するチーム',
    location: '東京本社 2階東',
    establishedDate: '2020-01-15'
  },
  { 
    id: 'section-9', 
    name: '財務管理チーム', 
    departmentId: 'dept-4', 
    leaderId: 'user-13', 
    memberCount: 4, 
    description: '財務管理を担当するチーム',
    location: '東京本社 2階西',
    establishedDate: '2020-01-15'
  },
  { 
    id: 'section-10', 
    name: 'PMOチーム', 
    departmentId: 'dept-5', 
    leaderId: 'user-15', 
    memberCount: 6, 
    description: 'プロジェクト管理を担当するチーム',
    location: '東京本社 4階東',
    establishedDate: '2021-04-15'
  },
  { 
    id: 'section-11', 
    name: '品質管理チーム', 
    departmentId: 'dept-5', 
    leaderId: 'user-16', 
    memberCount: 6, 
    description: '品質管理を担当するチーム',
    location: '東京本社 4階西',
    establishedDate: '2021-04-15'
  }
];
