import { PartnerStatus } from '../enums';

export interface Partner {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  status: PartnerStatus;
  businessCategory?: string;
  establishedYear?: number;
  employeeCount?: number;
  annualRevenue?: string;
  antisocialCheckCompleted?: boolean;
  antisocialCheckDate?: Date;
  creditCheckCompleted?: boolean;
  creditCheckDate?: Date;
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
