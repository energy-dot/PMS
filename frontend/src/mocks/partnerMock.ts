import { Partner } from '../shared-types';

export const mockPartners: Partner[] = [
  {
    id: 'partner-1',
    code: 'TS001',
    name: 'テックソリューション株式会社',
    address: '東京都渋谷区神宮前1-1-1',
    phoneNumber: '03-1234-5678',
    email: 'info@techsolution.example.com',
    website: 'https://techsolution.example.com',
    industry: 'IT',
    establishedDate: '2010-04-01',
    status: 'active',
  },
  {
    id: 'partner-2',
    code: 'DI002',
    name: 'デジタルイノベーション株式会社',
    address: '大阪府大阪市北区梅田2-2-2',
    phoneNumber: '06-2345-6789',
    email: 'info@digitalinnovation.example.com',
    website: 'https://digitalinnovation.example.com',
    industry: 'IT',
    establishedDate: '2015-07-15',
    status: 'active',
  },
  {
    id: 'partner-3',
    name: 'フューチャーテクノロジー株式会社',
    address: '福岡県福岡市博多区博多駅前3-3-3',
    phoneNumber: '092-3456-7890',
    email: 'info@futuretech.example.com',
    website: 'https://futuretech.example.com',
    industry: 'IT',
    establishedDate: '2018-01-10',
    status: 'pending',
  },
];
