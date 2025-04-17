# ユーザーサービス整合性分析レポート

## 1. エンドポイント整合性分析

### バックエンドエンドポイント（users.controller.ts）
- `POST /users` - ユーザー作成（admin権限必要）
- `GET /users` - 全ユーザー取得（admin権限必要）
- `GET /users/me` - 自分のプロフィール取得
- `GET /users/:id` - 特定ユーザー取得（admin権限必要）
- `PATCH /users/:id` - ユーザー更新（admin権限必要）
- `DELETE /users/:id` - ユーザー削除（admin権限必要）
- `PATCH /users/:id/status` - ユーザーステータス変更（admin権限必要）
- `POST /users/change-password` - パスワード変更

### フロントエンドAPI呼び出し（userService.ts）
- `api.get('/users')` - 全ユーザー取得
- `api.get('/users/:id')` - 特定ユーザー取得
- `api.post('/users', data)` - ユーザー作成
- `api.put('/users/:id', data)` - ユーザー更新
- `api.delete('/users/:id')` - ユーザー削除
- `api.get('/users/search', { params: { query } })` - ユーザー検索
- `api.post('/auth/login', { username, password })` - ユーザー認証

### 不整合点
1. **HTTPメソッドの不一致**:
   - バックエンドは`PATCH /users/:id`を使用しているが、フロントエンドは`PUT /users/:id`を使用している
   
2. **存在しないエンドポイント**:
   - フロントエンドは`GET /users/search`を使用しているが、バックエンドにこのエンドポイントが定義されていない
   - フロントエンドは`POST /auth/login`を使用しているが、これはusers.controller.tsではなく別のコントローラーで定義されている可能性がある

3. **未使用のエンドポイント**:
   - バックエンドの`GET /users/me`、`PATCH /users/:id/status`、`POST /users/change-password`がフロントエンドで使用されていない

## 2. データモデル整合性分析

### バックエンドエンティティ（user.entity.ts）
```typescript
// 主要フィールド
id: string;
username: string;
password: string;
fullName: string;
email: string;
department: string;
role: string;
isActive: boolean;
lastLogin: Date;
createdAt: Date;
updatedAt: Date;
// リレーション
notifications: Notification[];
notificationSettings: NotificationSetting[];
screenedApplications: Application[];
receivedEvaluations: Evaluation[];
givenEvaluations: Evaluation[];
conductedInterviews: InterviewRecord[];
```

### フロントエンドモデル（userService.tsから推測）
```typescript
// User型（shared-types.tsで定義されていると推測）
id: string;
name: string; // fullNameに対応？
username: string;
email: string;
department: string;
// その他のフィールドは明示的に使用されていないため不明
```

### 不整合点
1. **フィールド名の不一致**:
   - バックエンドは`fullName`を使用しているが、フロントエンドは`name`を使用している可能性がある

2. **フィールドの欠落**:
   - フロントエンドモデルには`role`、`isActive`、`lastLogin`などのフィールドが明示的に使用されていない
   - リレーションフィールド（notifications、evaluationsなど）がフロントエンドモデルで扱われているかどうか不明

3. **型の不一致**:
   - フロントエンドの型定義が不完全なため、型の不一致があるかどうか完全には判断できない

## 3. 認証・権限の整合性

1. **権限チェックの不一致**:
   - バックエンドではほとんどのエンドポイントに`@Roles('admin')`が設定されているが、フロントエンドではこの権限チェックが実装されているかどうか不明
   - フロントエンドでは権限に基づいた条件分岐やエラーハンドリングが必要

2. **認証トークンの扱い**:
   - バックエンドでは`JwtAuthGuard`を使用しているが、フロントエンドでのトークン管理方法が不明確

## 4. エラーハンドリングの整合性

1. **エラーハンドリングの実装**:
   - フロントエンドでは`handleApiError`と`logError`関数を使用してエラーハンドリングを実装している
   - バックエンドのエラーレスポンス形式とフロントエンドのエラーハンドリングが一致しているかどうか確認が必要

## 5. 修正提案

1. **HTTPメソッドの統一**:
   - フロントエンドの`api.put('/users/:id', data)`を`api.patch('/users/:id', data)`に変更する

2. **検索エンドポイントの追加**:
   - バックエンドに`GET /users/search`エンドポイントを追加する、または
   - フロントエンドの検索ロジックを`GET /users`を使用してクライアントサイドでフィルタリングするように変更する

3. **未使用エンドポイントの実装**:
   - フロントエンドに`GET /users/me`、`PATCH /users/:id/status`、`POST /users/change-password`の実装を追加する

4. **フィールド名の統一**:
   - フロントエンドの`name`を`fullName`に変更する、または
   - バックエンドとフロントエンドの間でデータ変換を行うマッピング層を追加する

5. **型定義の完全化**:
   - フロントエンドの`User`型定義を完全にし、バックエンドのエンティティと一致させる

6. **権限チェックの実装**:
   - フロントエンドに権限チェックロジックを追加し、ユーザーのロールに基づいて機能へのアクセスを制限する
