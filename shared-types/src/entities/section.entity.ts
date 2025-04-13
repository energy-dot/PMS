/**
 * 部エンティティ
 */
export interface Section {
  // 一意のID
  id: string;
  
  // 部署名
  name: string;
  
  // 事業部ID
  departmentId: string;
  
  // 部コード
  code?: string;
  
  // 説明
  description?: string;
  
  // 作成日時
  createdAt: string;
  
  // 更新日時
  updatedAt: string;
}
