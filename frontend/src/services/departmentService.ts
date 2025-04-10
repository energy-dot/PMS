import api from './api';
import { Department, Section } from 'shared-types';

// 部門リスト（キャッシュ）
let departmentsCache: Department[] = [];
// 部リスト（キャッシュ）
let sectionsCache: Section[] = [];
// 最終取得時刻
let lastFetchTime = 0;
// キャッシュの有効期限（ミリ秒）
const CACHE_EXPIRY = 5 * 60 * 1000; // 5分

/**
 * 事業部関連のAPI操作を行うサービス
 */
const departmentService = {
  /**
   * 事業部一覧を取得
   * @returns 事業部一覧
   */
  async getDepartments(): Promise<Department[]> {
    try {
      // キャッシュが有効な場合はキャッシュから返す
      if (departmentsCache.length > 0 && Date.now() - lastFetchTime < CACHE_EXPIRY) {
        return departmentsCache;
      }

      const response = await api.get<Department[]>('/departments');
      // キャッシュを更新
      departmentsCache = response.data;
      lastFetchTime = Date.now();
      return response.data;
    } catch (error) {
      console.error('Get departments error:', error);
      throw error;
    }
  },

  /**
   * 事業部と所属する部を一度に取得
   * @returns 部情報を含む事業部一覧
   */
  async getDepartmentsWithSections(): Promise<Department[]> {
    try {
      // キャッシュが有効な場合はキャッシュから返す
      if (departmentsCache.length > 0 && sectionsCache.length > 0 && Date.now() - lastFetchTime < CACHE_EXPIRY) {
        return departmentsCache;
      }

      const response = await api.get<Department[]>('/departments/with-sections');
      
      // キャッシュを更新
      departmentsCache = response.data;
      
      // セクションキャッシュを更新
      sectionsCache = [];
      response.data.forEach(dept => {
        if (dept.sections && dept.sections.length > 0) {
          sectionsCache = [...sectionsCache, ...dept.sections];
        }
      });
      
      lastFetchTime = Date.now();
      return response.data;
    } catch (error) {
      console.error('Get departments with sections error:', error);
      throw error;
    }
  },

  /**
   * 事業部に所属する部一覧を取得
   * @param departmentId 事業部ID
   * @returns 部一覧
   */
  async getSectionsByDepartment(departmentId: string): Promise<Section[]> {
    try {
      // キャッシュが有効でセクションが存在する場合はキャッシュからフィルタリングして返す
      if (sectionsCache.length > 0 && Date.now() - lastFetchTime < CACHE_EXPIRY) {
        return sectionsCache.filter(section => section.departmentId === departmentId);
      }

      const response = await api.get<Section[]>(`/departments/${departmentId}/sections`);
      return response.data;
    } catch (error) {
      console.error(`Get sections for department ${departmentId} error:`, error);
      throw error;
    }
  },

  /**
   * 部一覧を取得
   * @returns 部一覧
   */
  async getSections(): Promise<Section[]> {
    try {
      // キャッシュが有効な場合はキャッシュから返す
      if (sectionsCache.length > 0 && Date.now() - lastFetchTime < CACHE_EXPIRY) {
        return sectionsCache;
      }

      const response = await api.get<Section[]>('/sections');
      // キャッシュを更新
      sectionsCache = response.data;
      lastFetchTime = Date.now();
      return response.data;
    } catch (error) {
      console.error('Get sections error:', error);
      throw error;
    }
  },

  /**
   * キャッシュから部一覧を取得（同期版）
   * すでにキャッシュがあることを前提とする
   */
  getSections(): Section[] {
    return sectionsCache;
  },

  /**
   * キャッシュから事業部一覧を取得（同期版）
   * すでにキャッシュがあることを前提とする
   */
  getDepartments(): Department[] {
    return departmentsCache;
  },

  /**
   * キャッシュをクリア
   */
  clearCache() {
    departmentsCache = [];
    sectionsCache = [];
    lastFetchTime = 0;
  }
};

export default departmentService;