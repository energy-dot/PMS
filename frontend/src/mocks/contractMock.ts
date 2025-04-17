import { Contract } from '../shared-types';

// 契約情報のモックデータ
export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    projectId: 'proj-1',
    staffId: 'staff-1',
    startDate: '2023-04-01',
    endDate: '2023-09-30',
    rate: 800000,
    status: 'active',
    type: '準委任',
    paymentTerms: '月末締め翌月末払い',
    isAutoRenew: true,
    renewalNoticeDate: '2023-08-31',
    terminationNoticePeriod: 30,
    contractFile: '/uploads/contracts/contract-1.pdf',
    remarks: '特になし',
    notes: '初回契約'
  },
  {
    id: 'contract-2',
    projectId: 'proj-2',
    staffId: 'staff-2',
    startDate: '2023-05-15',
    endDate: '2023-12-31',
    rate: 900000,
    status: 'active',
    type: '派遣',
    paymentTerms: '月末締め翌月末払い',
    isAutoRenew: false,
    terminationNoticePeriod: 60,
    contractFile: '/uploads/contracts/contract-2.pdf',
    remarks: '特になし'
  },
  {
    id: 'contract-3',
    projectId: 'proj-3',
    staffId: 'staff-3',
    startDate: '2023-03-01',
    endDate: '2023-06-30',
    rate: 750000,
    status: 'completed',
    type: '準委任',
    paymentTerms: '月末締め翌月末払い',
    isAutoRenew: false,
    contractFile: '/uploads/contracts/contract-3.pdf',
    remarks: '契約終了'
  },
  {
    id: 'contract-4',
    projectId: 'proj-1',
    staffId: 'staff-4',
    startDate: '2023-06-01',
    endDate: '2023-11-30',
    rate: 850000,
    status: 'active',
    type: '準委任',
    paymentTerms: '月末締め翌月末払い',
    isAutoRenew: true,
    renewalNoticeDate: '2023-10-31',
    terminationNoticePeriod: 30,
    contractFile: '/uploads/contracts/contract-4.pdf'
  },
  {
    id: 'contract-5',
    projectId: 'proj-4',
    staffId: 'staff-5',
    startDate: '2023-07-01',
    endDate: '2024-06-30',
    rate: 950000,
    status: 'pending',
    type: '派遣',
    paymentTerms: '月末締め翌月末払い',
    isAutoRenew: false,
    terminationNoticePeriod: 90,
    remarks: '契約書準備中'
  }
];
