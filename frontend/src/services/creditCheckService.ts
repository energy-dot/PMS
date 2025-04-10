import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface CreditCheck {
  id: string;
  partnerId?: string;
  partner?: any;
  checkDate: Date;
  checkedBy?: string;
  checkMethod?: string;
  result: string;
  creditScore?: number;
  financialStability?: string;
  paymentHistory?: string;
  expiryDate?: Date;
  documentFile?: string;
  remarks?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const creditCheckService = {
  getCreditChecks: async (): Promise<CreditCheck[]> => {
    const response = await axios.get(`${API_BASE_URL}/credit-checks`);
    return response.data;
  },

  getCreditCheck: async (id: string): Promise<CreditCheck> => {
    const response = await axios.get(`${API_BASE_URL}/credit-checks/${id}`);
    return response.data;
  },

  getCreditChecksByPartnerId: async (partnerId: string): Promise<CreditCheck[]> => {
    const response = await axios.get(`${API_BASE_URL}/credit-checks/partner/${partnerId}`);
    return response.data;
  },

  createCreditCheck: async (creditCheck: Omit<CreditCheck, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreditCheck> => {
    const response = await axios.post(`${API_BASE_URL}/credit-checks`, creditCheck);
    return response.data;
  },

  updateCreditCheck: async (id: string, creditCheck: Partial<CreditCheck>): Promise<CreditCheck> => {
    const response = await axios.patch(`${API_BASE_URL}/credit-checks/${id}`, creditCheck);
    return response.data;
  },

  deleteCreditCheck: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/credit-checks/${id}`);
  }
};

export default creditCheckService;
