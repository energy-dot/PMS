import { Section } from './section.entity';

/**
 * 事業部エンティティ
 */
export interface Department {
  // 一意のID
  id: string;
  
  // 事業部名
  name: string;
  
  // 事業部コード
  code?: string;
  
  // 説明
  description?: string;
  
  // 所属する部の一覧
  sections?: Section[];
  
  // 作成日時
  createdAt: string;
  
  // 更新日時
  updatedAt: string;
}
