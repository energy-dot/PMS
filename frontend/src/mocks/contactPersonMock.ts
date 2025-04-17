import { ContactPerson } from '../shared-types';

// 連絡先担当者のモックデータ
export const mockContactPersons: ContactPerson[] = [
  {
    id: 'contact-1',
    partnerId: 'partner-1',
    name: '佐藤一郎',
    position: '営業部長',
    email: 'sato@example.com',
    phoneNumber: '03-1234-5678',
    isPrimary: true,
    department: '営業部',
    mobileNumber: '090-1234-5678',
    notes: '主要連絡先'
  },
  {
    id: 'contact-2',
    partnerId: 'partner-1',
    name: '田中花子',
    position: '人事担当',
    email: 'tanaka@example.com',
    phoneNumber: '03-8765-4321',
    isPrimary: false,
    department: '人事部',
    mobileNumber: '080-8765-4321',
    notes: '採用関連の連絡先'
  },
  {
    id: 'contact-3',
    partnerId: 'partner-2',
    name: '鈴木太郎',
    position: '代表取締役',
    email: 'suzuki@example.com',
    phoneNumber: '03-2345-6789',
    isPrimary: true,
    department: '経営企画部',
    mobileNumber: '090-2345-6789',
    notes: '重要事項は直接連絡'
  },
  {
    id: 'contact-4',
    partnerId: 'partner-3',
    name: '高橋次郎',
    position: '技術部長',
    email: 'takahashi@example.com',
    phoneNumber: '03-3456-7890',
    isPrimary: true,
    department: '技術部',
    mobileNumber: '080-3456-7890',
    notes: '技術的な質問はこちらへ'
  },
  {
    id: 'contact-5',
    partnerId: 'partner-3',
    name: '渡辺和子',
    position: '経理担当',
    email: 'watanabe@example.com',
    phoneNumber: '03-4567-8901',
    isPrimary: false,
    department: '経理部',
    mobileNumber: '090-4567-8901',
    notes: '請求書関連の連絡先'
  }
];
