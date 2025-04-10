import api from './api';

// 営業窓口担当者の型定義
export interface ContactPerson {
  id: string;
  partner: {
    id: string;
    name: string;
  };
  name: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  type: '主要担当' | '営業担当' | '技術担当' | 'その他';
  remarks?: string;
  preferredContactMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 営業窓口担当者作成用DTO
export interface ContactPersonDto {
  partnerId: string;
  name: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  type?: '主要担当' | '営業担当' | '技術担当' | 'その他';
  remarks?: string;
  preferredContactMethod?: string;
}

// 営業窓口担当者更新用DTO
export interface UpdateContactPersonDto extends Partial<Omit<ContactPersonDto, 'partnerId'>> {}

/**
 * 営業窓口担当者関連のAPI操作を行うサービス
 */
const contactPersonService = {
  /**
   * 営業窓口担当者一覧を取得
   * @returns 営業窓口担当者一覧
   */
  async getContactPersons(): Promise<ContactPerson[]> {
    try {
      const response = await api.get<ContactPerson[]>('/contact-persons');
      return response.data;
    } catch (error) {
      console.error('Get contact persons error:', error);
      throw error;
    }
  },

  /**
   * 特定のパートナー会社の営業窓口担当者一覧を取得
   * @param partnerId パートナー会社ID
   * @returns 営業窓口担当者一覧
   */
  async getContactPersonsByPartnerId(partnerId: string): Promise<ContactPerson[]> {
    try {
      const response = await api.get<ContactPerson[]>(`/contact-persons/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error(`Get contact persons for partner ${partnerId} error:`, error);
      throw error;
    }
  },

  /**
   * 営業窓口担当者詳細を取得
   * @param id 営業窓口担当者ID
   * @returns 営業窓口担当者詳細
   */
  async getContactPerson(id: string): Promise<ContactPerson> {
    try {
      const response = await api.get<ContactPerson>(`/contact-persons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get contact person ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 営業窓口担当者を作成
   * @param contactPersonData 営業窓口担当者データ
   * @returns 作成された営業窓口担当者
   */
  async createContactPerson(contactPersonData: ContactPersonDto): Promise<ContactPerson> {
    try {
      const response = await api.post<ContactPerson>('/contact-persons', contactPersonData);
      return response.data;
    } catch (error) {
      console.error('Create contact person error:', error);
      throw error;
    }
  },

  /**
   * 営業窓口担当者を更新
   * @param id 営業窓口担当者ID
   * @param contactPersonData 更新データ
   * @returns 更新された営業窓口担当者
   */
  async updateContactPerson(id: string, contactPersonData: UpdateContactPersonDto): Promise<ContactPerson> {
    try {
      const response = await api.patch<ContactPerson>(`/contact-persons/${id}`, contactPersonData);
      return response.data;
    } catch (error) {
      console.error(`Update contact person ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 営業窓口担当者を削除
   * @param id 営業窓口担当者ID
   * @returns 削除結果
   */
  async deleteContactPerson(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/contact-persons/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete contact person ${id} error:`, error);
      throw error;
    }
  }
};

export default contactPersonService;
