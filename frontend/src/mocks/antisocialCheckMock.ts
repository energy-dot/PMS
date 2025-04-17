import { AntisocialCheck } from '../shared-types';

// 反社会的勢力チェックリクエストのモックデータ
export interface AntisocialCheckRequest {
  companyName: string;
  representativeName: string;
}

// 反社会的勢力チェック結果のモックデータ
export const mockAntisocialChecks: AntisocialCheck[] = [
  {
    id: 'check-1',
    partnerId: 'partner-1',
    result: 'clean',
    score: 95.2,
    checkDate: '2023-04-15T10:30:00Z'
  },
  {
    id: 'check-2',
    partnerId: 'partner-2',
    result: 'clean',
    score: 97.8,
    checkDate: '2023-04-10T14:45:00Z'
  },
  {
    id: 'check-3',
    partnerId: 'partner-3',
    result: 'suspicious',
    score: 98.7,
    details: '一部の項目で注意が必要です。追加調査をお勧めします。',
    checkDate: '2023-04-05T09:15:00Z'
  },
  {
    id: 'check-4',
    partnerId: 'partner-4',
    result: 'blacklisted',
    score: 99.8,
    details: 'ブラックリストに登録されている可能性があります。詳細な調査が必要です。',
    checkDate: '2023-04-01T11:20:00Z'
  },
  {
    id: 'check-5',
    partnerId: 'partner-5',
    result: 'clean',
    score: 92.5,
    checkDate: '2023-03-28T16:30:00Z'
  }
];
