import { Injectable } from '@nestjs/common';

/**
 * 日付関連のユーティリティを提供するサービス
 */
@Injectable()
export class DateUtilsService {
  /**
   * 日付フィルター条件の作成
   * @param startDate 開始日（文字列形式）
   * @param endDate 終了日（文字列形式）
   * @returns 日付フィルター条件オブジェクト
   */
  getDateFilter(startDate?: string, endDate?: string): { gte?: Date; lte?: Date } | null {
    const dateFilter: { gte?: Date; lte?: Date } = {};
    
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }
    
    return Object.keys(dateFilter).length > 0 ? dateFilter : null;
  }

  /**
   * 日付を指定されたフォーマットで文字列に変換
   * @param date 日付オブジェクトまたは日付文字列
   * @param format フォーマット（デフォルト: 'YYYY-MM-DD'）
   * @returns フォーマットされた日付文字列
   */
  formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
    if (!date) return '';
    
    const d = date instanceof Date ? date : new Date(date);
    
    // 無効な日付の場合は空文字を返す
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * 月の初日と最終日を取得
   * @param year 年
   * @param month 月（0-11）
   * @returns 月の初日と最終日のオブジェクト
   */
  getMonthStartAndEnd(year: number, month: number): { start: Date; end: Date } {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    
    return { start, end };
  }

  /**
   * 指定された日数を加算した日付を取得
   * @param date 基準日
   * @param days 加算する日数
   * @returns 加算後の日付
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * 指定された月数を加算した日付を取得
   * @param date 基準日
   * @param months 加算する月数
   * @returns 加算後の日付
   */
  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * 2つの日付の差分を日数で取得
   * @param date1 日付1
   * @param date2 日付2
   * @returns 日数差分
   */
  getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
