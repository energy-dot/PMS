# パートナー要員管理システム モックデータから本番環境APIへの移行計画

## 概要

現在の実装では、フロントエンドの各サービスファイルでモックデータが使用されており、本番環境用のAPIエンドポイント呼び出しはコメントアウトされています。この計画では、モックデータから本番環境のAPIエンドポイントへの移行手順を詳細に説明します。

## 共通パターン

分析の結果、すべてのサービスファイルで以下の共通パターンが確認されました：

1. 本番環境用のAPIエンドポイント呼び出しがコメントアウトされている
2. 代わりにハードコードされたモックデータが実装されている
3. 各CRUDオペレーション（Create, Read, Update, Delete）に対応する関数が実装されている

## 移行戦略

移行は以下の戦略で進めます：

1. **段階的移行**: すべてのサービスを一度に移行するのではなく、モジュール単位で段階的に移行します
2. **テスト駆動**: 各モジュールの移行後、単体テストと統合テストを実施して機能を検証します
3. **フォールバック機構**: 本番APIが利用できない場合にモックデータにフォールバックする仕組みを実装します
4. **環境変数による制御**: 開発環境と本番環境を環境変数で切り替えられるようにします

## モジュール単位の移行計画

### 1. API基盤の整備

#### 1.1 環境変数の設定

```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_DATA=true

// .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_USE_MOCK_DATA=false
```

#### 1.2 API基盤の強化（api.ts）

```typescript
// api.tsの修正
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // トークンの取得と設定
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // エラーハンドリング
    if (error.response) {
      // サーバーからのレスポンスがある場合
      console.error('API Error:', error.response.status, error.response.data);
      
      // 認証エラー（401）の場合はログアウト処理
      if (error.response.status === 401) {
        // ログアウト処理
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない場合
      console.error('No response received:', error.request);
    } else {
      // リクエスト設定中にエラーが発生した場合
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// リトライ機能付きAPI呼び出し
export const callWithRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // ネットワークエラーまたは5xxエラーの場合のみリトライ
      if (!error.response || (error.response && error.response.status >= 500)) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        continue;
      }
      
      // その他のエラーはリトライしない
      throw error;
    }
  }
  
  throw lastError;
};

export default api;
export { USE_MOCK_DATA };
```

### 2. モックデータの分離

各サービスファイルからモックデータを分離し、専用のモックデータファイルに移動します。

```typescript
// mocks/userMock.ts
import { User } from '../shared-types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    name: '管理者',
    role: 'admin',
    department: '管理部',
    position: 'マネージャー',
    isActive: true,
  },
  // 他のモックデータ...
];

// mocks/projectMock.ts
// mocks/staffMock.ts
// 他のモックデータファイル...
```

### 3. サービスファイルの修正

各サービスファイルを以下のパターンで修正します。

#### 3.1 userService.ts

```typescript
import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { User } from '../shared-types';
import { mockUsers } from '../mocks/userMock';

// ユーザーデータの取得
export const getUsers = async (): Promise<User[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockUsers;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/users'));
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

// ユーザーデータの取得（ID指定）
export const getUserById = async (id: string): Promise<User> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/users/${id}`));
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}:`, error);
    throw error;
  }
};

// 他のメソッドも同様に修正...

// デフォルトエクスポート
const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
```

#### 3.2 projectService.ts

```typescript
import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Project } from '../shared-types';
import { mockProjects } from '../mocks/projectMock';

// プロジェクトデータの取得
export const getProjects = async (): Promise<Project[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockProjects;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/projects'));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};

// 他のメソッドも同様に修正...

// デフォルトエクスポート
const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
};

export default projectService;
```

#### 3.3 staffService.ts

```typescript
import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Staff } from '../shared-types';
import { mockStaffs } from '../mocks/staffMock';

// 検索パラメータの型定義
export interface SearchStaffParams {
  skills?: string[];
  availability?: string;
  experience?: number;
  partnerId?: string;
}

// スタッフ情報を取得する
export const getStaffs = async (): Promise<Staff[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockStaffs;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/staffs'));
  } catch (error) {
    console.error('スタッフ情報の取得に失敗しました', error);
    throw error;
  }
};

// 他のメソッドも同様に修正...

// デフォルトエクスポート
const staffService = {
  getStaffs,
  getStaffById,
  searchStaffs,
  deleteStaff,
};

export default staffService;
```

### 4. その他のサービスファイルの修正

同様のパターンで以下のサービスファイルも修正します：

- antisocialCheckService.ts
- applicationService.ts
- authService.ts
- baseContractService.ts
- contactPersonService.ts
- contractService.ts
- creditCheckService.ts
- departmentService.ts
- evaluationService.ts
- fileUploadService.ts
- masterDataService.ts
- notificationService.ts
- partnerService.ts
- sectionService.ts
- workflowService.ts

### 5. エラーハンドリングの強化

各サービスファイルでのエラーハンドリングを強化します。

```typescript
// エラーハンドリングユーティリティ
// utils/errorHandler.ts
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const handleApiError = (error: any, defaultMessage: string): never => {
  if (error instanceof ApiError) {
    throw error;
  }
  
  if (error.response) {
    throw new ApiError(
      error.response.data.message || defaultMessage,
      error.response.status
    );
  }
  
  throw new ApiError(defaultMessage, 500);
};
```

### 6. テスト戦略

#### 6.1 単体テスト

各サービスファイルに対する単体テストを実装します。

```typescript
// __tests__/services/userService.test.ts
import { getUsers, getUserById } from '../../services/userService';
import api from '../../services/api';
import { mockUsers } from '../../mocks/userMock';

// APIモックの設定
jest.mock('../../services/api');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getUsers', () => {
    it('should fetch users from API', async () => {
      // APIレスポンスのモック
      (api.get as jest.Mock).mockResolvedValue(mockUsers);
      
      const result = await getUsers();
      
      expect(api.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });
    
    it('should handle API errors', async () => {
      // APIエラーのモック
      const error = new Error('API error');
      (api.get as jest.Mock).mockRejectedValue(error);
      
      await expect(getUsers()).rejects.toThrow('API error');
    });
  });
  
  // 他のテストケース...
});
```

#### 6.2 統合テスト

フロントエンドとバックエンドの統合テストを実装します。

```typescript
// __tests__/integration/userFlow.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserList from '../../components/UserList';
import { getUsers } from '../../services/userService';

// サービスモックの設定
jest.mock('../../services/userService');

describe('User Flow', () => {
  it('should display users and allow editing', async () => {
    // サービスレスポンスのモック
    (getUsers as jest.Mock).mockResolvedValue([
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        name: '管理者',
        role: 'admin',
        department: '管理部',
        position: 'マネージャー',
        isActive: true,
      },
    ]);
    
    render(<UserList />);
    
    // ユーザーリストが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText('管理者')).toBeInTheDocument();
    });
    
    // 編集ボタンをクリック
    userEvent.click(screen.getByText('編集'));
    
    // 編集フォームが表示されるのを確認
    expect(screen.getByLabelText('名前')).toHaveValue('管理者');
    
    // 他のテストステップ...
  });
});
```

## 移行スケジュール

移行は以下のスケジュールで進めます：

1. **準備フェーズ（1週間）**
   - 環境変数の設定
   - API基盤の強化
   - モックデータの分離

2. **コア機能の移行（2週間）**
   - userService.ts
   - projectService.ts
   - staffService.ts
   - partnerService.ts

3. **補助機能の移行（2週間）**
   - contractService.ts
   - evaluationService.ts
   - applicationService.ts
   - その他のサービス

4. **テストと検証（1週間）**
   - 単体テスト
   - 統合テスト
   - エンドツーエンドテスト

5. **本番環境への展開（1週間）**
   - ステージング環境でのテスト
   - 本番環境への展開
   - モニタリングと問題対応

## リスクと対策

1. **APIの仕様変更**
   - リスク: バックエンドAPIの仕様が変更される可能性がある
   - 対策: APIクライアントに型定義を導入し、型安全性を確保する

2. **パフォーマンスの低下**
   - リスク: モックデータからAPIへの切り替えによりレスポンス時間が増加する可能性がある
   - 対策: キャッシュ機構の導入、ページネーションの最適化

3. **認証・認可の問題**
   - リスク: 本番環境ではトークンベースの認証が必要になる
   - 対策: 認証トークンの管理機構を実装し、期限切れの自動更新を行う

4. **ネットワーク障害**
   - リスク: ネットワーク接続の問題でAPIにアクセスできない場合がある
   - 対策: リトライ機構、オフラインモード、エラー表示の改善

## 結論

この移行計画に従って実装を進めることで、モックデータから本番環境APIへのスムーズな移行が可能になります。環境変数による制御とフォールバック機構により、開発環境と本番環境の切り替えが容易になり、段階的な移行とテストが可能になります。
