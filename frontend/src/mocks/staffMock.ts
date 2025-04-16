import { Staff } from '../shared-types';

// 検索パラメータの型定義
export interface SearchStaffParams {
  skills?: string[];
  availability?: string;
  experience?: number;
  partnerId?: string;
}

export const mockStaffs: Staff[] = [
  {
    id: 'staff-1',
    name: '山田太郎',
    partnerId: 'partner-1',
    firstName: '太郎',
    lastName: '山田',
    email: 'yamada@example.com',
    phoneNumber: '090-1234-5678',
    skills: ['Java', 'Spring', 'AWS'],
    experience: 5,
    hourlyRate: 5000,
    availability: 'available',
    status: 'available',
  },
  {
    id: 'staff-2',
    name: '佐藤次郎',
    partnerId: 'partner-1',
    firstName: '次郎',
    lastName: '佐藤',
    email: 'sato@example.com',
    phoneNumber: '090-2345-6789',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 3,
    hourlyRate: 4500,
    availability: 'partially_available',
    status: 'assigned',
  },
  {
    id: 'staff-3',
    name: '鈴木花子',
    partnerId: 'partner-2',
    firstName: '花子',
    lastName: '鈴木',
    email: 'suzuki@example.com',
    phoneNumber: '090-3456-7890',
    skills: ['Python', 'Django', 'GCP'],
    experience: 4,
    hourlyRate: 4800,
    availability: 'available',
    status: 'available',
  },
];
