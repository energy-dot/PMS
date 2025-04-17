# フロントエンド、バックエンド、データベースの整合性確認結果

## 実装済みサービスの整合性確認状況

以下のサービスについては実装が完了し、基本的な整合性確認も行いました：

- ✅ userService.ts
- ✅ projectService.ts
- ✅ staffService.ts
- ✅ partnerService.ts
- ✅ applicationService.ts
- ✅ contractService.ts
- ✅ evaluationService.ts
- ✅ baseContractService.ts
- ✅ contactPersonService.ts
- ✅ departmentService.ts
- ✅ sectionService.ts
- ✅ workflowService.ts
- ✅ notificationService.ts
- ✅ fileUploadService.ts
- ✅ masterDataService.ts
- ✅ antisocialCheckService.ts
- ✅ creditCheckService.ts
- ✅ authService.ts

各サービスは以下の共通パターンで実装されています：
- 環境変数（USE_MOCK_DATA）に基づいた切り替え機能
- エラーハンドリングの強化（handleApiError、logError関数の統合）
- リトライ機能の統合（callWithRetry関数の活用）
- モックデータの分離（専用のmocksディレクトリにモックファイルを作成）

## 1. ユーザーサービスの整合性確認

### フロントエンドとバックエンドのエンドポイント整合性

| フロントエンド (userService.ts) | バックエンド (users.controller.ts) | 整合性 | 備考 |
|--------------------------------|----------------------------------|-------|------|
| getUsers() | GET /users (findAll) | ✅ | 問題なし |
| getUserById(id) | GET /users/:id (findOne) | ✅ | 問題なし |
| createUser(data) | POST /users (create) | ✅ | 問題なし |
| updateUser(id, data) | PATCH /users/:id (update) | ✅ | 問題なし |
| deleteUser(id) | DELETE /users/:id (remove) | ✅ | 問題なし |
| searchUsers(query) | - | ❌ | バックエンドに検索エンドポイントが存在しない |
| authenticateUser(username, password) | - | ❌ | 認証エンドポイントはusers.controllerではなくauth.controllerにある可能性が高い |
| - | GET /users/me (getProfile) | ❌ | フロントエンドに対応するメソッドがない |
| - | PATCH /users/:id/status (toggleStatus) | ❌ | フロントエンドに対応するメソッドがない |
| - | POST /users/change-password (changePassword) | ❌ | フロントエンドに対応するメソッドがない |

### フロントエンドとデータベースのモデル整合性

| フロントエンド (User型) | データベース (user.entity.ts) | 整合性 | 備考 |
|------------------------|----------------------------|-------|------|
| id?: string | id: string | ✅ | フロントエンドではオプショナル、問題なし |
| username: string | username: string | ✅ | 問題なし |
| fullName?: string | fullName: string | ✅ | フロントエンドではオプショナル、問題なし |
| email: string | email: string | ✅ | バックエンドではnullable、フロントエンドでは必須 |
| role: string | role: string | ✅ | 問題なし |
| isActive: boolean | isActive: boolean | ✅ | 問題なし |
| name?: string | - | ❌ | データベースに対応するフィールドがない（fullNameと重複？） |
| department?: string | department: string | ✅ | 問題なし |
| position?: string | - | ❌ | データベースに対応するフィールドがない |
| - | password: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | lastLogin: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | createdAt: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | updatedAt: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |

### 整合性問題の概要

1. **エンドポイントの不一致**:
   - フロントエンドの`searchUsers`メソッドに対応するバックエンドエンドポイントがない
   - フロントエンドの`authenticateUser`メソッドはauth.controllerにある可能性が高い
   - バックエンドの`getProfile`、`toggleStatus`、`changePassword`エンドポイントに対応するフロントエンドメソッドがない

2. **モデルの不一致**:
   - フロントエンドの`name`フィールドはデータベースに存在しない（`fullName`と重複している可能性）
   - フロントエンドの`position`フィールドはデータベースに存在しない
   - データベースの`password`、`lastLogin`、`createdAt`、`updatedAt`フィールドはフロントエンドの型定義に存在しない

3. **型の不一致**:
   - `email`フィールドはフロントエンドでは必須だが、バックエンドではnullable

### 修正提案

1. **エンドポイントの整合性向上**:
   - バックエンドに検索エンドポイント（`/users/search`）を追加する
   - フロントエンドに`getProfile`、`toggleStatus`、`changePassword`メソッドを追加する
   - 認証関連のエンドポイントとサービスの整合性を確認する

2. **モデルの整合性向上**:
   - フロントエンドの`name`フィールドを削除し、`fullName`に統一する
   - フロントエンドに`position`フィールドが必要な場合は、データベースにも追加する
   - フロントエンドの型定義に`password`（@Excludeで保護）、`lastLogin`、`createdAt`、`updatedAt`フィールドを追加する

3. **型の整合性向上**:
   - フロントエンドとバックエンドで`email`フィールドの必須/オプショナル設定を統一する

## 2. プロジェクトサービスの整合性確認

### フロントエンドとバックエンドのエンドポイント整合性

| フロントエンド (projectService.ts) | バックエンド (projects.controller.ts) | 整合性 | 備考 |
|----------------------------------|-------------------------------------|-------|------|
| getProjects() | GET /projects (findAll) | ✅ | 問題なし |
| getProjectById(id) | GET /projects/:id (findOne) | ✅ | 問題なし |
| createProject(data) | POST /projects (create) | ✅ | 問題なし |
| updateProject(id, data) | PATCH /projects/:id (update) | ✅ | 問題なし |
| deleteProject(id) | DELETE /projects/:id (remove) | ✅ | 問題なし |
| searchProjects(params) | GET /projects/search (search) | ✅ | 問題なし |
| assignStaffToProject(projectId, staffIds) | - | ❌ | バックエンドに対応するエンドポイントがない |
| removeStaffFromProject(projectId, staffId) | - | ❌ | バックエンドに対応するエンドポイントがない |
| - | POST /projects/:id/approve (approve) | ❌ | フロントエンドに対応するメソッドがない |
| - | POST /projects/:id/reject (reject) | ❌ | フロントエンドに対応するメソッドがない |
| - | PATCH /projects/:id/status (updateStatus) | ❌ | フロントエンドに対応するメソッドがない |

### フロントエンドとデータベースのモデル整合性

| フロントエンド (Project型) | データベース (project.entity.ts) | 整合性 | 備考 |
|--------------------------|--------------------------------|-------|------|
| id?: string | id: string | ✅ | フロントエンドではオプショナル、問題なし |
| name: string | name: string | ✅ | 問題なし |
| description: string | description: string | ✅ | バックエンドではnullable、フロントエンドでは必須 |
| startDate: string | startDate: Date | ⚠️ | 型の不一致（文字列 vs 日付） |
| endDate: string | endDate: Date | ⚠️ | 型の不一致（文字列 vs 日付） |
| status: string | status: string | ✅ | 列挙値の違いに注意 |
| budget: number | budget: string | ⚠️ | 型の不一致（数値 vs 文字列） |
| departmentId?: string | departmentId: string | ⚠️ | フロントエンドではオプショナル、バックエンドでは必須 |
| code?: string | - | ❌ | データベースに対応するフィールドがない |
| managerId?: string | - | ❌ | データベースに対応するフィールドがない |
| partnerId?: string | - | ❌ | データベースに対応するフィールドがない |
| skills?: string[] | requiredSkills: string | ⚠️ | 型の不一致（配列 vs 文字列） |
| assignedStaffs?: string[] | - | ❌ | データベースに対応するフィールドがない |
| - | sectionId: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | rejectionReason: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | requiredNumber: number | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | location: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | workingHours: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | isRemote: boolean | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | remarks: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | requiredHeadcount: number | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | currentHeadcount: number | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | approvalStatus: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | contractType: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | rateMin: number | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | rateMax: number | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | isApproved: boolean | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | approvedBy: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | approvedAt: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | approverId: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | approvalDate: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | createdAt: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | updatedAt: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |

### 整合性問題の概要

1. **エンドポイントの不一致**:
   - フロントエンドの`assignStaffToProject`と`removeStaffFromProject`メソッドに対応するバックエンドエンドポイントがない
   - バックエンドの`approve`、`reject`、`updateStatus`エンドポイントに対応するフロントエンドメソッドがない

2. **モデルの不一致**:
   - 日付関連フィールド（startDate, endDate）の型の不一致（文字列 vs 日付）
   - budget フィールドの型の不一致（数値 vs 文字列）
   - skills フィールドの型の不一致（配列 vs 文字列）
   - フロントエンドの code, managerId, partnerId, assignedStaffs フィールドはデータベースに存在しない
   - データベースの多数のフィールド（sectionId, rejectionReason, requiredNumber など）はフロントエンドの型定義に存在しない

3. **必須/オプショナルの不一致**:
   - departmentId はフロントエンドではオプショナルだが、バックエンドでは必須
   - description はバックエンドではnullableだが、フロントエンドでは必須

### 修正提案

1. **エンドポイントの整合性向上**:
   - バックエンドに要員割り当て関連のエンドポイント（`/projects/:id/assign-staff`、`/projects/:id/staff/:staffId`）を追加する
   - フロントエンドに`approveProject`、`rejectProject`、`updateProjectStatus`メソッドを追加する

2. **モデルの整合性向上**:
   - 日付関連フィールドの型を統一する（Date型を使用するか、ISO文字列形式に統一）
   - budget フィールドの型を統一する（数値型を推奨）
   - skills フィールドの型を統一する（配列を推奨、文字列の場合はJSON形式で保存）
   - フロントエンドの型定義に不足しているフィールドを追加する
   - データベースに不足しているフィールドを追加する（必要な場合）

3. **必須/オプショナルの整合性向上**:
   - departmentId の必須/オプショナル設定を統一する
   - description の必須/オプショナル設定を統一する

## 3. スタッフサービスの整合性確認

### フロントエンドとバックエンドのエンドポイント整合性

| フロントエンド (staffService.ts) | バックエンド (staff.controller.ts) | 整合性 | 備考 |
|--------------------------------|----------------------------------|-------|------|
| getStaffs() | GET /staff (findAll) | ⚠️ | パス名の不一致（複数形vs単数形） |
| getStaffById(id) | GET /staff/:id (findOne) | ⚠️ | パス名の不一致（複数形vs単数形） |
| createStaff(data) | POST /staff (create) | ⚠️ | パス名の不一致（複数形vs単数形） |
| updateStaff(id, data) | PATCH /staff/:id (update) | ⚠️ | パス名の不一致（複数形vs単数形） |
| deleteStaff(id) | DELETE /staff/:id (remove) | ⚠️ | パス名の不一致（複数形vs単数形） |
| searchStaffs(params) | GET /staff/search (search) | ⚠️ | パス名の不一致（複数形vs単数形） |
| updateStaffSkills(id, skills) | - | ❌ | バックエンドに対応するエンドポイントがない |

### フロントエンドとデータベースのモデル整合性

| フロントエンド (Staff型) | データベース (staff.entity.ts) | 整合性 | 備考 |
|------------------------|----------------------------|-------|------|
| id?: string | id: string | ✅ | フロントエンドではオプショナル、問題なし |
| partnerId: string | - | ❌ | データベースにカラムとして直接存在しない（リレーションとして存在） |
| firstName: string | - | ❌ | データベースに対応するフィールドがない |
| lastName: string | - | ❌ | データベースに対応するフィールドがない |
| email: string | email: string | ✅ | バックエンドではnullable、フロントエンドでは必須 |
| phoneNumber?: string | phone: string | ⚠️ | フィールド名の不一致（phoneNumber vs phone） |
| skills: string[] | skills: string[] | ✅ | 問題なし |
| experience: number | experience: number | ✅ | バックエンドではnullable、フロントエンドでは必須 |
| hourlyRate: number | - | ❌ | データベースに対応するフィールドがない |
| availability: string | - | ❌ | データベースに対応するフィールドがない |
| status: string | status: string | ✅ | 列挙値の違いに注意 |
| name?: string | name: string | ✅ | バックエンドでは必須、フロントエンドではオプショナル |
| - | skillLevels: Record<string, number> | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | birthDate: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | gender: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | address: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | resume: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | remarks: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | departmentId: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | sectionId: string | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | createdAt: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |
| - | updatedAt: Date | ❌ | フロントエンドの型定義に対応するフィールドがない |

### 整合性問題の概要

1. **エンドポイントの不一致**:
   - フロントエンドでは「staffs」（複数形）を使用しているのに対し、バックエンドでは「staff」（単数形）を使用している
   - フロントエンドの`updateStaffSkills`メソッドに対応するバックエンドエンドポイントがない

2. **モデルの不一致**:
   - フロントエンドの`firstName`と`lastName`フィールドはデータベースに存在せず、代わりに`name`フィールドが使用されている
   - フロントエンドの`phoneNumber`フィールドはデータベースでは`phone`として定義されている
   - フロントエンドの`hourlyRate`と`availability`フィールドはデータベースに存在しない
   - データベースの多数のフィールド（skillLevels, birthDate, gender, address など）はフロントエンドの型定義に存在しない

3. **必須/オプショナルの不一致**:
   - `email`フィールドはフロントエンドでは必須だが、バックエンドではnullable
   - `experience`フィールドはフロントエンドでは必須だが、バックエンドではnullable
   - `name`フィールドはバックエンドでは必須だが、フロントエンドではオプショナル

### 修正提案

1. **エンドポイントの整合性向上**:
   - フロントエンドとバックエンドでパス名を統一する（「staff」または「staffs」に統一）
   - バックエンドに`/staff/:id/skills`エンドポイントを追加する

2. **モデルの整合性向上**:
   - フロントエンドとバックエンドで名前関連フィールドを統一する（`firstName`+`lastName`または`name`に統一）
   - フィールド名を統一する（`phoneNumber`と`phone`）
   - フロントエンドの型定義に不足しているフィールドを追加する
   - データベースに不足しているフィールドを追加する（必要な場合）

3. **必須/オプショナルの整合性向上**:
   - `email`、`experience`、`name`フィールドの必須/オプショナル設定を統一する

## 4. 補助サービスの整合性確認

### 4.1 応募関連サービス (applicationService.ts)

実装済みの機能：
- ✅ モックデータの分離（applicationMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.2 契約関連サービス (contractService.ts)

実装済みの機能：
- ✅ モックデータの分離（contractMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.3 評価関連サービス (evaluationService.ts)

実装済みの機能：
- ✅ モックデータの分離（evaluationMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.4 基本契約関連サービス (baseContractService.ts)

実装済みの機能：
- ✅ モックデータの分離（baseContractMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.5 連絡先関連サービス (contactPersonService.ts)

実装済みの機能：
- ✅ モックデータの分離（contactPersonMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.6 部門関連サービス (departmentService.ts)

実装済みの機能：
- ✅ モックデータの分離（departmentMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.7 セクション関連サービス (sectionService.ts)

実装済みの機能：
- ✅ モックデータの分離（sectionMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.8 ワークフロー関連サービス (workflowService.ts)

実装済みの機能：
- ✅ モックデータの分離（workflowMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.9 通知関連サービス (notificationService.ts)

実装済みの機能：
- ✅ モックデータの分離（notificationMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認
- ✅ 単体テストの実装（notificationService.test.ts）

### 4.10 ファイルアップロード関連サービス (fileUploadService.ts)

実装済みの機能：
- ✅ モックデータの分離（fileUploadMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認
- ✅ 単体テストの実装（fileUploadService.test.ts）

### 4.11 マスターデータ関連サービス (masterDataService.ts)

実装済みの機能：
- ✅ モックデータの分離（masterDataMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.12 反社チェック関連サービス (antisocialCheckService.ts)

実装済みの機能：
- ✅ モックデータの分離（antisocialCheckMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.13 信用チェック関連サービス (creditCheckService.ts)

実装済みの機能：
- ✅ モックデータの分離（creditCheckMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認

### 4.14 認証関連サービス (authService.ts)

実装済みの機能：
- ✅ モックデータの分離（authMock.tsの作成）
- ✅ 環境変数に基づいた切り替え機能の実装
- ✅ エラーハンドリングの強化
- ✅ リトライ機能の統合
- ✅ バックエンドAPIとの整合性確認
- ✅ セキュリティ設定との整合性確認

## 今後の課題

1. **残りのサービスの単体テスト実装**
   - 現在、notificationService、departmentService、fileUploadServiceのみテスト実装済み
   - 他のサービスについても同様のパターンでテストを実装する必要がある

2. **エンドツーエンドテストの実装**
   - 実際のユーザーフローを模したテストシナリオの作成
   - 環境変数切り替えによるモックデータと実際のAPIの両方でのテスト

3. **整合性問題の自動検出と修正**
   - TypeScriptの型定義とデータベースエンティティの自動比較スクリプトの作成
   - APIエンドポイントとフロントエンドサービスの自動比較スクリプトの作成
   - 整合性確認の定期実行計画の策定

4. **本番環境への展開準備**
   - ステージング環境でのテスト
   - 本番環境への展開手順の確立
   - モニタリングと問題対応の体制整備
