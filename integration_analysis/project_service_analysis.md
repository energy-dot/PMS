# プロジェクトサービス整合性分析レポート

## 1. エンドポイント整合性分析

### バックエンドエンドポイント（projects.controller.ts）
- `POST /projects` - プロジェクト作成（admin, partner_manager, developer権限必要）
- `GET /projects` - 全プロジェクト取得
- `GET /projects/search` - プロジェクト検索
- `GET /projects/:id` - 特定プロジェクト取得
- `PATCH /projects/:id` - プロジェクト更新（admin, partner_manager, developer権限必要）
- `DELETE /projects/:id` - プロジェクト削除（admin権限必要）
- `POST /projects/:id/approve` - プロジェクト承認（admin, partner_manager権限必要）
- `POST /projects/:id/reject` - プロジェクト却下（admin, partner_manager権限必要）
- `PATCH /projects/:id/status` - プロジェクトステータス更新（admin, partner_manager権限必要）

### フロントエンドAPI呼び出し（projectService.ts）
- `api.get('/projects')` - 全プロジェクト取得
- `api.get('/projects/:id')` - 特定プロジェクト取得
- `api.post('/projects', data)` - プロジェクト作成
- `api.put('/projects/:id', data)` - プロジェクト更新
- `api.delete('/projects/:id')` - プロジェクト削除
- `api.get('/projects/search', { params })` - プロジェクト検索
- `api.post('/projects/:id/assign-staff', { staffIds })` - プロジェクトに要員割り当て
- `api.delete('/projects/:id/staff/:staffId')` - プロジェクトから要員削除

### 不整合点
1. **HTTPメソッドの不一致**:
   - バックエンドは`PATCH /projects/:id`を使用しているが、フロントエンドは`PUT /projects/:id`を使用している
   
2. **存在しないエンドポイント**:
   - フロントエンドは`POST /projects/:id/assign-staff`と`DELETE /projects/:id/staff/:staffId`を使用しているが、バックエンドにこれらのエンドポイントが定義されていない

3. **未使用のエンドポイント**:
   - バックエンドの`POST /projects/:id/approve`、`POST /projects/:id/reject`、`PATCH /projects/:id/status`がフロントエンドで使用されていない

## 2. データモデル整合性分析

### バックエンドエンティティ（project.entity.ts）
```typescript
// 主要フィールド
id: string;
name: string;
departmentId: string;
sectionId: string;
description: string;
startDate: Date;
endDate: Date;
status: string; // enum: '募集中', '選考中', '充足', '承認待ち', '差し戻し', '終了'
rejectionReason: string;
requiredSkills: string;
requiredNumber: number;
budget: string;
location: string;
workingHours: string;
isRemote: boolean;
remarks: string;
requiredHeadcount: number;
currentHeadcount: number;
approvalStatus: string;
contractType: string;
rateMin: number;
rateMax: number;
isApproved: boolean;
approvedBy: string;
approvedAt: Date;
approverId: string;
approvalDate: Date;
createdAt: Date;
updatedAt: Date;
// リレーション
department: Department;
section: Section;
contracts: Contract[];
applications: Application[];
evaluations: Evaluation[];
```

### フロントエンドモデル（projectService.tsから推測）
```typescript
// Project型（shared-types.tsで定義されていると推測）
id: string;
name: string;
partnerId: string; // バックエンドにはない
status: string;
skills: string[]; // バックエンドではrequiredSkillsとして文字列
assignedStaffs: string[]; // バックエンドにはない
// その他のフィールドは明示的に使用されていないため不明
```

### 不整合点
1. **フィールド名と型の不一致**:
   - バックエンドは`requiredSkills`（文字列）を使用しているが、フロントエンドは`skills`（配列）を使用している
   - フロントエンドには`partnerId`フィールドがあるが、バックエンドには対応するフィールドがない
   - フロントエンドには`assignedStaffs`フィールドがあるが、バックエンドには対応するフィールドがない

2. **フィールドの欠落**:
   - フロントエンドモデルには多くのバックエンドフィールド（departmentId, sectionId, description, startDate, endDateなど）が明示的に使用されていない
   - リレーションフィールド（department, section, contracts, applicationsなど）がフロントエンドモデルで扱われているかどうか不明

3. **ステータス値の不一致**:
   - バックエンドでは日本語のステータス値（'募集中', '選考中'など）が使用されているが、フロントエンドでのステータス値が不明確

## 3. 認証・権限の整合性

1. **権限チェックの不一致**:
   - バックエンドでは各エンドポイントに`@Roles('admin', 'partner_manager', 'developer')`などの権限設定があるが、フロントエンドではこの権限チェックが実装されているかどうか不明
   - フロントエンドでは権限に基づいた条件分岐やエラーハンドリングが必要

2. **認証トークンの扱い**:
   - バックエンドでは`JwtAuthGuard`を使用しているが、フロントエンドでのトークン管理方法が不明確

## 4. エラーハンドリングの整合性

1. **エラーハンドリングの実装**:
   - フロントエンドでは`handleApiError`と`logError`関数を使用してエラーハンドリングを実装している
   - バックエンドのエラーレスポンス形式とフロントエンドのエラーハンドリングが一致しているかどうか確認が必要

## 5. 修正提案

1. **HTTPメソッドの統一**:
   - フロントエンドの`api.put('/projects/:id', data)`を`api.patch('/projects/:id', data)`に変更する

2. **要員割り当てエンドポイントの追加**:
   - バックエンドに`POST /projects/:id/assign-staff`と`DELETE /projects/:id/staff/:staffId`エンドポイントを追加する、または
   - フロントエンドの要員割り当て機能を既存のエンドポイントを使用するように変更する

3. **未使用エンドポイントの実装**:
   - フロントエンドに`POST /projects/:id/approve`、`POST /projects/:id/reject`、`PATCH /projects/:id/status`の実装を追加する

4. **データモデルの統一**:
   - フロントエンドの`skills`（配列）とバックエンドの`requiredSkills`（文字列）の扱いを統一する
   - フロントエンドの`partnerId`とバックエンドのデータモデルの対応関係を明確にする
   - フロントエンドの`assignedStaffs`に対応するバックエンドのデータ構造を追加する

5. **ステータス値の統一**:
   - バックエンドとフロントエンドでプロジェクトステータスの値を統一する

6. **権限チェックの実装**:
   - フロントエンドに権限チェックロジックを追加し、ユーザーのロールに基づいて機能へのアクセスを制限する
