import { ContractStatus } from '../enums';

export interface Staff {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Contract {
  id: string;
  staff: Staff;
  project: Project;
  startDate: Date;
  endDate: Date;
  price: number;
  paymentTerms?: string;
  status: ContractStatus;
  contractFile?: string;
  remarks?: string;
  isAutoRenew?: boolean;
  renewalNoticeDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
