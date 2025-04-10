import { Section } from './section';

export interface Department {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  sections?: Section[];
  createdAt?: Date;
  updatedAt?: Date;
}
