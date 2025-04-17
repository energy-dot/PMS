import { Department, Section } from '../shared-types';

// 部署情報のモックデータ
export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    code: 'DEV',
    name: '開発部',
    managerId: 'user-1',
    description: 'システム開発を担当する部署',
    establishedDate: '2020-01-01',
    headcount: 45,
    budget: 150000000,
    location: '東京本社 5階',
    sections: [
      { id: 'section-1', name: 'フロントエンド開発チーム', leaderId: 'user-5', memberCount: 15 },
      { id: 'section-2', name: 'バックエンド開発チーム', leaderId: 'user-6', memberCount: 20 },
      { id: 'section-3', name: 'インフラチーム', leaderId: 'user-7', memberCount: 10 }
    ]
  },
  {
    id: 'dept-2',
    code: 'SALES',
    name: '営業部',
    managerId: 'user-2',
    description: '顧客開拓と営業活動を担当する部署',
    establishedDate: '2020-01-01',
    headcount: 30,
    budget: 120000000,
    location: '東京本社 3階',
    sections: [
      { id: 'section-4', name: '国内営業チーム', leaderId: 'user-8', memberCount: 15 },
      { id: 'section-5', name: '海外営業チーム', leaderId: 'user-9', memberCount: 15 }
    ]
  },
  {
    id: 'dept-3',
    code: 'HR',
    name: '人事部',
    managerId: 'user-3',
    description: '採用と人材育成を担当する部署',
    establishedDate: '2020-01-01',
    headcount: 10,
    budget: 50000000,
    location: '東京本社 2階',
    sections: [
      { id: 'section-6', name: '採用チーム', leaderId: 'user-10', memberCount: 5 },
      { id: 'section-7', name: '人材育成チーム', leaderId: 'user-11', memberCount: 5 }
    ]
  },
  {
    id: 'dept-4',
    code: 'FINANCE',
    name: '財務部',
    managerId: 'user-4',
    description: '会計と財務管理を担当する部署',
    establishedDate: '2020-01-01',
    headcount: 8,
    budget: 40000000,
    location: '東京本社 2階',
    sections: [
      { id: 'section-8', name: '会計チーム', leaderId: 'user-12', memberCount: 4 },
      { id: 'section-9', name: '財務管理チーム', leaderId: 'user-13', memberCount: 4 }
    ]
  },
  {
    id: 'dept-5',
    code: 'PM',
    name: 'プロジェクト管理部',
    managerId: 'user-14',
    description: 'プロジェクトの進行管理を担当する部署',
    establishedDate: '2021-04-01',
    headcount: 12,
    budget: 60000000,
    location: '東京本社 4階',
    sections: [
      { id: 'section-10', name: 'PMOチーム', leaderId: 'user-15', memberCount: 6 },
      { id: 'section-11', name: '品質管理チーム', leaderId: 'user-16', memberCount: 6 }
    ]
  }
];

// セクション情報のモックデータ
export const mockSections: Section[] = [
  { id: 'section-1', name: 'フロントエンド開発チーム', departmentId: 'dept-1', leaderId: 'user-5', memberCount: 15, description: 'フロントエンド開発を担当するチーム' },
  { id: 'section-2', name: 'バックエンド開発チーム', departmentId: 'dept-1', leaderId: 'user-6', memberCount: 20, description: 'バックエンド開発を担当するチーム' },
  { id: 'section-3', name: 'インフラチーム', departmentId: 'dept-1', leaderId: 'user-7', memberCount: 10, description: 'インフラ構築と運用を担当するチーム' },
  { id: 'section-4', name: '国内営業チーム', departmentId: 'dept-2', leaderId: 'user-8', memberCount: 15, description: '国内顧客向け営業活動を担当するチーム' },
  { id: 'section-5', name: '海外営業チーム', departmentId: 'dept-2', leaderId: 'user-9', memberCount: 15, description: '海外顧客向け営業活動を担当するチーム' },
  { id: 'section-6', name: '採用チーム', departmentId: 'dept-3', leaderId: 'user-10', memberCount: 5, description: '採用活動を担当するチーム' },
  { id: 'section-7', name: '人材育成チーム', departmentId: 'dept-3', leaderId: 'user-11', memberCount: 5, description: '社員教育と人材育成を担当するチーム' },
  { id: 'section-8', name: '会計チーム', departmentId: 'dept-4', leaderId: 'user-12', memberCount: 4, description: '会計処理を担当するチーム' },
  { id: 'section-9', name: '財務管理チーム', departmentId: 'dept-4', leaderId: 'user-13', memberCount: 4, description: '財務管理を担当するチーム' },
  { id: 'section-10', name: 'PMOチーム', departmentId: 'dept-5', leaderId: 'user-15', memberCount: 6, description: 'プロジェクト管理を担当するチーム' },
  { id: 'section-11', name: '品質管理チーム', departmentId: 'dept-5', leaderId: 'user-16', memberCount: 6, description: '品質管理を担当するチーム' }
];
