# フロントエンド、バックエンド、データベース間の整合性分析レポート

## 概要

本レポートは、パートナー要員管理システム（PMS）のフロントエンド、バックエンド、データベース間の整合性を分析し、不整合点と修正提案をまとめたものです。4つの主要サービス（ユーザー、プロジェクト、スタッフ、パートナー）について詳細な分析を行いました。

## 共通の不整合点

以下の不整合点は複数のサービスで共通して見られる問題です：

1. **HTTPメソッドの不一致**:
   - バックエンドは`PATCH`を使用しているが、フロントエンドは`PUT`を使用している
   
2. **エンドポイントパスの不一致**:
   - スタッフサービスではバックエンドは`/staff`を使用しているが、フロントエンドは`/staffs`を使用している
   
3. **存在しないエンドポイント**:
   - フロントエンドで使用されているエンドポイントがバックエンドに定義されていない
   
4. **未使用のエンドポイント**:
   - バックエンドで定義されているエンドポイントがフロントエンドで使用されていない
   
5. **フィールド名と型の不一致**:
   - バックエンドとフロントエンドでフィールド名や型が異なる
   
6. **ステータス値の不一致**:
   - バックエンドでは日本語のステータス値が使用されているが、フロントエンドでのステータス値が不明確
   
7. **権限チェックの不一致**:
   - バックエンドでは権限設定が明確だが、フロントエンドでの権限チェックが不明確

## サービス別の不整合点

### 1. ユーザーサービス

#### エンドポイント整合性
- バックエンドは`PATCH /users/:id`を使用しているが、フロントエンドは`PUT /users/:id`を使用している
- フロントエンドは`GET /users/search`を使用しているが、バックエンドにこのエンドポイントが定義されていない
- バックエンドの`GET /users/me`、`PATCH /users/:id/status`、`POST /users/change-password`がフロントエンドで使用されていない

#### データモデル整合性
- バックエンドは`fullName`を使用しているが、フロントエンドは`name`を使用している可能性がある
- フロントエンドモデルには`role`、`isActive`、`lastLogin`などのフィールドが明示的に使用されていない

### 2. プロジェクトサービス

#### エンドポイント整合性
- バックエンドは`PATCH /projects/:id`を使用しているが、フロントエンドは`PUT /projects/:id`を使用している
- フロントエンドは`POST /projects/:id/assign-staff`と`DELETE /projects/:id/staff/:staffId`を使用しているが、バックエンドにこれらのエンドポイントが定義されていない
- バックエンドの`POST /projects/:id/approve`、`POST /projects/:id/reject`、`PATCH /projects/:id/status`がフロントエンドで使用されていない

#### データモデル整合性
- バックエンドは`requiredSkills`（文字列）を使用しているが、フロントエンドは`skills`（配列）を使用している
- フロントエンドには`partnerId`フィールドがあるが、バックエンドには対応するフィールドがない
- フロントエンドには`assignedStaffs`フィールドがあるが、バックエンドには対応するフィールドがない

### 3. スタッフサービス

#### エンドポイント整合性
- バックエンドは`/staff`を使用しているが、フロントエンドは`/staffs`を使用している
- バックエンドは`PATCH /staff/:id`を使用しているが、フロントエンドは`PUT /staffs/:id`を使用している
- フロントエンドは`PUT /staffs/:id/skills`を使用しているが、バックエンドにこのエンドポイントが定義されていない

#### データモデル整合性
- バックエンドは`status`を使用しているが、フロントエンドは`availability`を使用している可能性がある
- バックエンドでは`partner`リレーションを使用しているが、フロントエンドでは`partnerId`を使用している

### 4. パートナーサービス

#### エンドポイント整合性
- バックエンドは`PATCH /partners/:id`を使用しているが、フロントエンドは`PUT /partners/:id`を使用している
- フロントエンドは`GET /partners/search`を使用しているが、バックエンドにこのエンドポイントが定義されていない

#### データモデル整合性
- フロントエンドには`code`フィールドがあるが、バックエンドには対応するフィールドがない
- バックエンドは`businessCategory`を使用しているが、フロントエンドは`industry`を使用している可能性がある

#### 認証・権限の整合性
- バックエンドではすべてのエンドポイントに`@Public()`デコレータが設定されており、認証が不要になっているが、`JwtAuthGuard`も適用されている矛盾がある

## 修正提案

### 1. HTTPメソッドの統一
```typescript
// 修正前（フロントエンド）
api.put('/users/:id', data)
api.put('/projects/:id', data)
api.put('/staffs/:id', data)
api.put('/partners/:id', data)

// 修正後（フロントエンド）
api.patch('/users/:id', data)
api.patch('/projects/:id', data)
api.patch('/staffs/:id', data)
api.patch('/partners/:id', data)
```

### 2. エンドポイントパスの統一（スタッフサービス）
```typescript
// 修正案1: バックエンドを変更
// controllers/staff.controller.ts
@Controller('staffs') // 'staff'から'staffs'に変更

// 修正案2: フロントエンドを変更
// services/staffService.ts
api.get('/staff') // '/staffs'から'/staff'に変更
```

### 3. 検索エンドポイントの追加
```typescript
// バックエンドに検索エンドポイントを追加
@Get('search')
search(@Query() searchDto: SearchDto) {
  return this.service.search(searchDto);
}
```

### 4. 要員割り当てエンドポイントの追加（プロジェクトサービス）
```typescript
// バックエンドに要員割り当てエンドポイントを追加
@Post(':id/assign-staff')
@Roles('admin', 'partner_manager')
assignStaff(@Param('id') id: string, @Body() data: { staffIds: string[] }) {
  return this.projectsService.assignStaff(id, data.staffIds);
}

@Delete(':id/staff/:staffId')
@Roles('admin', 'partner_manager')
removeStaff(@Param('id') id: string, @Param('staffId') staffId: string) {
  return this.projectsService.removeStaff(id, staffId);
}
```

### 5. フィールド名の統一
```typescript
// 修正案1: バックエンドを変更
// entities/user.entity.ts
@Column({ name: 'name' }) // 'full_name'から'name'に変更
name: string; // 'fullName'から'name'に変更

// 修正案2: フロントエンドを変更
// shared-types.ts
interface User {
  fullName: string; // 'name'から'fullName'に変更
}
```

### 6. データ変換層の追加
```typescript
// services/apiMapper.ts
export const mapUserFromApi = (apiUser: any): User => ({
  id: apiUser.id,
  name: apiUser.fullName, // バックエンドの'fullName'をフロントエンドの'name'にマッピング
  // 他のフィールドもマッピング
});

export const mapUserToApi = (user: User): any => ({
  id: user.id,
  fullName: user.name, // フロントエンドの'name'をバックエンドの'fullName'にマッピング
  // 他のフィールドもマッピング
});
```

### 7. 権限チェックの実装（フロントエンド）
```typescript
// services/authService.ts
export const hasPermission = (requiredRoles: string[]): boolean => {
  const currentUser = getCurrentUser();
  return currentUser && requiredRoles.includes(currentUser.role);
};

// components/ProjectActions.tsx
const canEditProject = hasPermission(['admin', 'partner_manager', 'developer']);
return (
  <div>
    {canEditProject && <button onClick={handleEdit}>編集</button>}
  </div>
);
```

### 8. 認証設定の整理（パートナーサービス）
```typescript
// controllers/partners.controller.ts
@Controller('partners')
export class PartnersController {
  // パブリックエンドポイント
  @Get()
  @Public()
  findAll() {
    return this.partnersService.findAll();
  }

  // 認証が必要なエンドポイント
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'partner_manager')
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }
}
```

## 実装計画

1. **フェーズ1: HTTPメソッドとエンドポイントパスの統一**
   - フロントエンドのHTTPメソッドを`PUT`から`PATCH`に変更
   - スタッフサービスのエンドポイントパスを統一

2. **フェーズ2: 不足エンドポイントの追加**
   - 検索エンドポイントの追加
   - 要員割り当てエンドポイントの追加
   - 未使用エンドポイントの実装

3. **フェーズ3: データモデルの統一**
   - フィールド名の統一
   - データ変換層の追加

4. **フェーズ4: 認証・権限の整理**
   - フロントエンドに権限チェックロジックを追加
   - バックエンドの認証設定を整理

5. **フェーズ5: テストと検証**
   - 各サービスの統合テストを実装
   - エンドツーエンドテストを実装

## 結論

フロントエンド、バックエンド、データベース間には複数の不整合点が存在しますが、これらは体系的に修正可能です。本レポートで提案した修正案を実装することで、システム全体の一貫性と保守性が向上し、将来的な拡張や変更が容易になります。
