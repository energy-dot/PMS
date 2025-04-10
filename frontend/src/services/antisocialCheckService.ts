import api from './api';

// 反社チェックの型定義
export interface AntisocialCheck {
  id: string;
  partner: {
    id: string;
    name: string;
  };
  checkDate: Date;
  checkedBy?: string;
  checkMethod?: string;
  result: '問題なし' | '要確認' | 'NG';
  expiryDate?: Date;
  documentFile?: string;
  remarks?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 反社チェック作成用DTO
export interface AntisocialCheckDto {
  partnerId: string;
  checkDate: Date;
  checkedBy?: string;
  checkMethod?: string;
  result: '問題なし' | '要確認' | 'NG';
  expiryDate?: Date;
  documentFile?: string;
  remarks?: string;
  isCompleted?: boolean;
}

// 反社チェック更新用DTO
export interface UpdateAntisocialCheckDto extends Partial<Omit<AntisocialCheckDto, 'partnerId'>> {}

/**
 * 反社チェック関連のAPI操作を行うサービス
 */
const antisocialCheckService = {
  /**
   * 反社チェック一覧を取得
   * @returns 反社チェック一覧
   */
  async getAntisocialChecks(): Promise<AntisocialCheck[]> {
    try {
      const response = await api.get<AntisocialCheck[]>('/antisocial-checks');
      return response.data;
    } catch (error) {
      console.error('Get antisocial checks error:', error);
      throw error;
    }
  },

  /**
   * 特定のパートナー会社の反社チェック一覧を取得
   * @param partnerId パートナー会社ID
   * @returns 反社チェック一覧
   */
  async getAntisocialChecksByPartnerId(partnerId: string): Promise<AntisocialCheck[]> {
    try {
      const response = await api.get<AntisocialCheck[]>(`/antisocial-checks/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error(`Get antisocial checks for partner ${partnerId} error:`, error);
      throw error;
    }
  },

  /**
   * 反社チェック詳細を取得
   * @param id 反社チェックID
   * @returns 反社チェック詳細
   */
  async getAntisocialCheck(id: string): Promise<AntisocialCheck> {
    try {
      const response = await api.get<AntisocialCheck>(`/antisocial-checks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get antisocial check ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 反社チェックを作成
   * @param antisocialCheckData 反社チェックデータ
   * @returns 作成された反社チェック
   */
  async createAntisocialCheck(antisocialCheckData: AntisocialCheckDto): Promise<AntisocialCheck> {
    try {
      const response = await api.post<AntisocialCheck>('/antisocial-checks', antisocialCheckData);
      return response.data;
    } catch (error) {
      console.error('Create antisocial check error:', error);
      throw error;
    }
  },

  /**
   * 反社チェックを更新
   * @param id 反社チェックID
   * @param antisocialCheckData 更新データ
   * @returns 更新された反社チェック
   */
  async updateAntisocialCheck(id: string, antisocialCheckData: UpdateAntisocialCheckDto): Promise<AntisocialCheck> {
    try {
      const response = await api.patch<AntisocialCheck>(`/antisocial-checks/${id}`, antisocialCheckData);
      return response.data;
    } catch (error) {
      console.error(`Update antisocial check ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 反社チェックを削除
   * @param id 反社チェックID
   * @returns 削除結果
   */
  async deleteAntisocialCheck(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/antisocial-checks/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete antisocial check ${id} error:`, error);
      throw error;
    }
  }
};

export default antisocialCheckService;
