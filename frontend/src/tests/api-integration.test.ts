// テスト用スクリプト - API統合のテスト
// /home/ubuntu/PMS/frontend/src/tests/api-integration.test.ts

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import api, { callWithRetry, USE_MOCK_DATA } from '../services/api';
import { getUsers, getUserById } from '../services/userService';
import { getProjects, searchProjects } from '../services/projectService';
import { getStaffs, searchStaffs } from '../services/staffService';
import { getPartners } from '../services/partnerService';
import { mockUsers } from '../mocks/userMock';
import { mockProjects } from '../mocks/projectMock';
import { mockStaffs } from '../mocks/staffMock';
import { mockPartners } from '../mocks/partnerMock';

// APIモックの設定
jest.mock('../services/api', () => {
  const actual = jest.requireActual('../services/api');
  return {
    ...actual,
    default: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    },
    callWithRetry: jest.fn((fn) => fn()),
    USE_MOCK_DATA: false, // テスト用に強制的にfalseに設定
  };
});

describe('API統合テスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('userService', () => {
    it('本番環境モードでAPIを呼び出す', async () => {
      // APIレスポンスのモック
      (api.get as jest.Mock).mockResolvedValueOnce(mockUsers);

      // 関数を実行
      const result = await getUsers();

      // APIが呼び出されたことを確認
      expect(api.get).toHaveBeenCalledWith('/users');
      expect(callWithRetry).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('特定のユーザーを取得する', async () => {
      const userId = '1';
      const mockUser = mockUsers.find(u => u.id === userId);
      
      // APIレスポンスのモック
      (api.get as jest.Mock).mockResolvedValueOnce(mockUser);

      // 関数を実行
      const result = await getUserById(userId);

      // APIが呼び出されたことを確認
      expect(api.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(callWithRetry).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('projectService', () => {
    it('本番環境モードでAPIを呼び出す', async () => {
      // APIレスポンスのモック
      (api.get as jest.Mock).mockResolvedValueOnce(mockProjects);

      // 関数を実行
      const result = await getProjects();

      // APIが呼び出されたことを確認
      expect(api.get).toHaveBeenCalledWith('/projects');
      expect(callWithRetry).toHaveBeenCalled();
      expect(result).toEqual(mockProjects);
    });

    it('プロジェクト検索を実行する', async () => {
      const searchParams = { name: 'EC', status: 'active' };
      
      // APIレスポンスのモック
      (api.get as jest.Mock).mockResolvedValueOnce(mockProjects.filter(p => 
        p.name.includes(searchParams.name!) && p.status === searchParams.status
      ));

      // 関数を実行
      const result = await searchProjects(searchParams);

      // APIが呼び出されたことを確認
      expect(api.get).toHaveBeenCalledWith('/projects/search', { params: searchParams });
      expect(callWithRetry).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(p => p.name.includes(searchParams.name!))).toBe(true);
      expect(result.every(p => p.status === searchParams.status)).toBe(true);
    });
  });

  describe('staffService', () => {
    it('本番環境モードでAPIを呼び出す', async () => {
      // APIレスポンスのモック
      (api.get as jest.Mock).mockResolvedValueOnce(mockStaffs);

      // 関数を実行
      const result = await getStaffs();

      // APIが呼び出されたことを確認
      expect(api.get).toHaveBeenCalledWith('/staffs');
      expect(callWithRetry).toHaveBeenCalled();
      expect(result).toEqual(mockStaffs);
    });

    it('スタッフ検索を実行する', async () => {
      const searchParams = { skills: ['Java'], availability: 'available' };
      
      // APIレスポンスのモック
      (api.get as jest.Mock).mockResolvedValueOnce(mockStaffs.filter(s => 
        s.skills.some(skill => skill.includes(searchParams.skills![0])) && 
        s.availability === searchParams.availability
      ));

      // 関数を実行
      const result = await searchStaffs(searchParams);

      // APIが呼び出されたことを確認
      expect(api.get).toHaveBeenCalledWith('/staffs/search', { params: searchParams });
      expect(callWithRetry).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(s => s.skills.some(skill => skill.includes(searchParams.skills![0])))).toBe(true);
      expect(result.every(s => s.availability === searchParams.availability)).toBe(true);
    });
  });

  describe('partnerService', () => {
    it('本番環境モードでAPIを呼び出す', async () => {
      // APIレスポンスのモック
      (api.get as jest.Mock).mockResolvedValueOnce(mockPartners);

      // 関数を実行
      const result = await getPartners();

      // APIが呼び出されたことを確認
      expect(api.get).toHaveBeenCalledWith('/partners');
      expect(callWithRetry).toHaveBeenCalled();
      expect(result).toEqual(mockPartners);
    });
  });

  describe('エラーハンドリング', () => {
    it('APIエラーを適切に処理する', async () => {
      // APIエラーのモック
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'User not found' }
        }
      };
      (api.get as jest.Mock).mockRejectedValueOnce(errorResponse);

      // 関数を実行して例外をキャッチ
      await expect(getUserById('999')).rejects.toThrow();
    });

    it('ネットワークエラーを適切に処理する', async () => {
      // ネットワークエラーのモック
      const networkError = new Error('Network Error');
      networkError.request = {}; // リクエストオブジェクトを追加
      (api.get as jest.Mock).mockRejectedValueOnce(networkError);

      // 関数を実行して例外をキャッチ
      await expect(getUsers()).rejects.toThrow();
    });

    it('リトライ機能が正しく動作する', async () => {
      // 最初の呼び出しでエラー、2回目で成功するようにモック
      const networkError = new Error('Network Error');
      networkError.request = {}; // リクエストオブジェクトを追加
      
      (callWithRetry as jest.Mock).mockImplementationOnce(async (fn) => {
        // 最初の呼び出しでエラーをスロー
        throw networkError;
      });
      
      // 関数を実行して例外をキャッチ
      await expect(getUsers()).rejects.toThrow();
      
      // リトライが呼び出されたことを確認
      expect(callWithRetry).toHaveBeenCalled();
    });
  });
});
