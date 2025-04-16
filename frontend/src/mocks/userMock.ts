import { User } from '../shared-types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    name: '管理者',
    role: 'admin',
    department: '管理部',
    position: 'マネージャー',
    isActive: true,
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    name: '一般ユーザー1',
    role: 'developer',
    department: '営業部',
    position: '担当者',
    isActive: true,
  },
  {
    id: '3',
    username: 'user2',
    email: 'user2@example.com',
    name: '一般ユーザー2',
    role: 'developer',
    department: '技術部',
    position: 'エンジニア',
    isActive: true,
  },
];
