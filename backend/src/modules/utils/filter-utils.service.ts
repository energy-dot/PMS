import { Injectable } from '@nestjs/common';

/**
 * フィルター関連のユーティリティを提供するサービス
 */
@Injectable()
export class FilterUtilsService {
  /**
   * 部署フィルター条件の作成
   * @param department 部署ID
   * @returns 部署フィルター条件
   */
  getDepartmentFilter(department?: string): string | null {
    return department && department !== 'all' ? department : null;
  }

  /**
   * セクションフィルター条件の作成
   * @param section セクションID
   * @returns セクションフィルター条件
   */
  getSectionFilter(section?: string): string | null {
    return section && section !== 'all' ? section : null;
  }

  /**
   * ステータスフィルター条件の作成
   * @param status ステータス
   * @returns ステータスフィルター条件
   */
  getStatusFilter(status?: string): string | null {
    return status && status !== 'all' ? status : null;
  }

  /**
   * 検索条件からWhere句を構築
   * @param filters フィルター条件のオブジェクト
   * @returns TypeORMのWhere句オブジェクト
   */
  buildWhereClause(filters: Record<string, any>): Record<string, any> {
    const whereClause: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        whereClause[key] = value;
      }
    });

    return whereClause;
  }

  /**
   * 複数のフィルター条件を組み合わせたWhere句を構築
   * @param filters フィルター条件の配列
   * @returns TypeORMのWhere句オブジェクト
   */
  combineFilters(...filters: Record<string, any>[]): Record<string, any> {
    const combinedFilters: Record<string, any> = {};

    filters.forEach(filter => {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          combinedFilters[key] = value;
        }
      });
    });

    return combinedFilters;
  }
}
