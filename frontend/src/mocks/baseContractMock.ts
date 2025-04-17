import { BaseContract } from '../shared-types';

// 基本契約情報のモックデータ
export const mockBaseContracts: BaseContract[] = [
  {
    id: 'base-contract-1',
    partnerId: 'partner-1',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: 'active',
    terms: '基本契約書の内容...',
    contractType: 'basic',
    contractNumber: 'BC-2023-001',
    isAutoRenew: true,
    renewalNoticePeriod: 90,
    paymentTerms: '月末締め翌月末払い',
    attachments: ['/uploads/contracts/base-contract-1.pdf']
  },
  {
    id: 'base-contract-2',
    partnerId: 'partner-2',
    startDate: '2023-02-15',
    endDate: '2024-02-14',
    status: 'active',
    terms: 'NDA契約書の内容...',
    contractType: 'nda',
    contractNumber: 'NDA-2023-002',
    isAutoRenew: false,
    attachments: ['/uploads/contracts/base-contract-2.pdf']
  },
  {
    id: 'base-contract-3',
    partnerId: 'partner-3',
    startDate: '2022-10-01',
    endDate: '2023-09-30',
    status: 'active',
    terms: '基本契約書の内容...',
    contractType: 'basic',
    contractNumber: 'BC-2022-045',
    isAutoRenew: true,
    renewalNoticePeriod: 60,
    paymentTerms: '月末締め翌月末払い',
    attachments: ['/uploads/contracts/base-contract-3.pdf']
  },
  {
    id: 'base-contract-4',
    partnerId: 'partner-4',
    startDate: '2022-12-01',
    endDate: '2023-05-31',
    status: 'expired',
    terms: '基本契約書の内容...',
    contractType: 'basic',
    contractNumber: 'BC-2022-078',
    isAutoRenew: false,
    paymentTerms: '月末締め翌月末払い',
    attachments: ['/uploads/contracts/base-contract-4.pdf']
  },
  {
    id: 'base-contract-5',
    partnerId: 'partner-5',
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    status: 'draft',
    terms: '基本契約書の内容...',
    contractType: 'basic',
    contractNumber: 'BC-2023-015',
    isAutoRenew: true,
    renewalNoticePeriod: 90,
    paymentTerms: '月末締め翌月末払い'
  }
];
