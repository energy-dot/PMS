import { ContractStatus } from '../enums';

export interface CreateContractDto {
  staff: { id: string };
  project: { id: string };
  startDate: Date;
  endDate: Date;
  price: number;
  paymentTerms?: string;
  status?: ContractStatus;
  contractFile?: string;
  remarks?: string;
  isAutoRenew?: boolean;
  renewalNoticeDate?: Date;
}

export interface UpdateContractDto extends Partial<CreateContractDto> {}
