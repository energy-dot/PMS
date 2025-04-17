# スタッフサービス整合性分析レポート

## 1. エンドポイント整合性分析

### バックエンドエンドポイント（staff.controller.ts）
- `POST /staff` - スタッフ作成（admin, partner_manager権限必要）
- `GET /staff` - 全スタッフ取得
- `GET /staff/search` - スタッフ検索
- `GET /staff/:id` - 特定スタッフ取得
- `PATCH /staff/:id` - スタッフ更新（admin, partner_manager権限必要）
- `DELETE /staff/:id` - スタッフ削除（admin権限必要）

### フロントエンドAPI呼び出し（staffService.ts）
- `api.get('/staffs')` - 全スタッフ取得
- `api.get('/staffs/:id')` - 特定スタッフ取得
- `api.get('/staffs/search', { params })` - スタッフ検索
- `api.post('/staffs', data)` - スタッフ作成
- `api.put('/staffs/:id', data)` - スタッフ更新
- `api.delete('/staffs/:id')` - スタッフ削除
- `api.put('/staffs/:id/skills', { skills })` - スタッフのスキル更新

### 不整合点
1. **エンドポイントパスの不一致**:
   - バックエンドは`/staff`を使用しているが、フロントエンドは`/staffs`を使用している
   
2. **HTTPメソッドの不一致**:
   - バックエンドは`PATCH /staff/:id`を使用しているが、フロントエンドは`PUT /staffs/:id`を使用している
   
3. **存在しないエンドポイント**:
   - フロントエンドは`PUT /staffs/:id/skills`を使用しているが、バックエンドにこのエンドポイントが定義されていない

## 2. データモデル整合性分析

### バックエンドエンティティ（staff.entity.ts）
```typescript
// 主要フィールド
id: string;
name: string;
email: string;
phone: string;
status: string; // enum: '稼働中', '待機中', '契約終了', '選考中', '予約済み'
skills: string[];
skillLevels: Record<string, number>;
experience: number;
birthDate: Date;
gender: string;
address: string;
resume: string;
remarks: string;
departmentId: string;
sectionId: string;
createdAt: Date;
updatedAt: Date;
// リレーション
partner: Partner;
contracts: Contract[];
department: Department;
section: Section;
evaluations: Evaluation[];
```

### フロントエンドモデル（staffService.tsから推測）
```typescript
// Staff型（shared-types.tsで定義されていると推測）
id: string;
// SearchStaffParamsから推測されるフィールド
skills: string[];
availability: string; // バックエンドではstatusとして定義
experience: number;
partnerId: string; // バックエンドではpartnerリレーションとして定義
// その他のフィールドは明示的に使用されていないため不明
```

### 不整合点
1. **フィールド名の不一致**:
   - バックエンドは`status`を使用しているが、フロントエンドは`availability`を使用している可能性がある
   - バックエンドでは`partner`リレーションを使用しているが、フロントエンドでは`partnerId`を使用している

2. **フィールドの欠落**:
   - フロントエンドモデルには多くのバックエンドフィールド（email, phone, skillLevels, birthDate, genderなど）が明示的に使用されていない
   - リレーションフィールド（department, section, contracts, evaluationsなど）がフロントエンドモデルで扱われているかどうか不明

3. **ステータス値の不一致**:
   - バックエンドでは日本語のステータス値（'稼働中', '待機中'など）が使用されているが、フロントエンドでのステータス値が不明確

## 3. 認証・権限の整合性

1. **権限チェックの不一致**:
   - バックエンドでは各エンドポイントに`@Roles('admin', 'partner_manager')`などの権限設定があるが、フロントエンドではこの権限チェックが実装されているかどうか不明
   - フロントエンドでは権限に基づいた条件分岐やエラーハンドリングが必要

2. **認証トークンの扱い**:
   - バックエンドでは`JwtAuthGuard`を使用しているが、フロントエンドでのトークン管理方法が不明確

## 4. エラーハンドリングの整合性

1. **エラーハンドリングの実装**:
   - フロントエンドでは`handleApiError`と`logError`関数を使用してエラーハンドリングを実装している
   - バックエンドのエラーレスポンス形式とフロントエンドのエラーハンドリングが一致しているかどうか確認が必要

## 5. 修正提案

1. **エンドポイントパスの統一**:
   - バックエンドの`/staff`を`/staffs`に変更する、または
   - フロントエンドの`/staffs`を`/staff`に変更する

2. **HTTPメソッドの統一**:
   - フロントエンドの`api.put('/staffs/:id', data)`を`api.patch('/staffs/:id', data)`に変更する

3. **スキル更新エンドポイントの追加**:
   - バックエンドに`PUT /staff/:id/skills`エンドポイントを追加する、または
   - フロントエンドのスキル更新機能を既存のエンドポイントを使用するように変更する

4. **フィールド名の統一**:
   - フロントエンドの`availability`をバックエンドの`status`に合わせる、または
   - バックエンドとフロントエンドの間でデータ変換を行うマッピング層を追加する

5. **ステータス値の統一**:
   - バックエンドとフロントエンドでスタッフステータスの値を統一する

6. **権限チェックの実装**:
   - フロントエンドに権限チェックロジックを追加し、ユーザーのロールに基づいて機能へのアクセスを制限する
