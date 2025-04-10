import { Department } from './department';

export interface Section {
  id: string;
  departmentId: string;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  department?: Department;
  createdAt?: Date;
  updatedAt?: Date;
}
