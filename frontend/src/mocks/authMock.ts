import { User } from '../shared-types';

// ログイン認証情報のインターフェース
export interface LoginCredentials {
  username: string;
  password: string;
}

// ログインレスポンスのインターフェース
export interface LoginResponse {
  user: User;
  accessToken: string;
}

// モックユーザーデータ
export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    fullName: '管理者ユーザー',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    department: '管理部',
    position: 'システム管理者',
    phoneNumber: '03-1234-5678',
    lastLoginAt: '2023-05-15T08:30:00Z'
  },
  {
    id: 'user-2',
    username: 'yamada',
    fullName: '山田太郎',
    email: 'yamada@example.com',
    role: 'manager',
    isActive: true,
    department: '営業部',
    position: '部長',
    phoneNumber: '03-1234-5679',
    lastLoginAt: '2023-05-14T15:45:00Z'
  },
  {
    id: 'user-3',
    username: 'tanaka',
    fullName: '田中花子',
    email: 'tanaka@example.com',
    role: 'staff',
    isActive: true,
    department: '開発部',
    position: 'プロジェクトリーダー',
    phoneNumber: '03-1234-5680',
    lastLoginAt: '2023-05-15T10:20:00Z'
  },
  {
    id: 'user-4',
    username: 'suzuki',
    fullName: '鈴木一郎',
    email: 'suzuki@example.com',
    role: 'staff',
    isActive: false,
    department: '人事部',
    position: '採用担当',
    phoneNumber: '03-1234-5681',
    lastLoginAt: '2023-04-30T09:15:00Z'
  },
  {
    id: 'user-5',
    username: 'sato',
    fullName: '佐藤健',
    email: 'sato@example.com',
    role: 'manager',
    isActive: true,
    department: '財務部',
    position: '課長',
    phoneNumber: '03-1234-5682',
    lastLoginAt: '2023-05-15T13:10:00Z'
  }
];
