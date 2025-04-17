# 不整合修正実装ガイド

このガイドでは、統合レポートで特定された不整合を修正するための具体的な実装手順とコード例を提供します。

## 1. HTTPメソッドの統一

### 修正対象ファイル
- `/home/ubuntu/PMS/frontend/src/services/userService.ts`
- `/home/ubuntu/PMS/frontend/src/services/projectService.ts`
- `/home/ubuntu/PMS/frontend/src/services/staffService.ts`
- `/home/ubuntu/PMS/frontend/src/services/partnerService.ts`

### 修正内容
フロントエンドのHTTPメソッドを`PUT`から`PATCH`に変更します。

#### userService.ts の修正例
```typescript
// 修正前
export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error(`ユーザーID ${id} が見つかりません`);
      }
      const updatedUser: User = {
        ...user,
        ...data,
      };
      return updatedUser;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/users/${id}`, data));
  } catch (error) {
    logError(error, `updateUser(${id})`);
    throw handleApiError(error, `ユーザーID ${id} の情報更新に失敗しました`);
  }
};

// 修正後
export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error(`ユーザーID ${id} が見つかりません`);
      }
      const updatedUser: User = {
        ...user,
        ...data,
      };
      return updatedUser;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/users/${id}`, data));
  } catch (error) {
    logError(error, `updateUser(${id})`);
    throw handleApiError(error, `ユーザーID ${id} の情報更新に失敗しました`);
  }
};
```

同様の修正を他のサービスファイルにも適用します。

## 2. エンドポイントパスの統一（スタッフサービス）

### 修正案1: バックエンドを変更

#### 修正対象ファイル
- `/home/ubuntu/PMS/backend/src/modules/staff/staff.controller.ts`

#### 修正内容
```typescript
// 修正前
@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  // ...
}

// 修正後
@Controller('staffs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  // ...
}
```

### 修正案2: フロントエンドを変更

#### 修正対象ファイル
- `/home/ubuntu/PMS/frontend/src/services/staffService.ts`

#### 修正内容
```typescript
// 修正前
export const getStaffs = async (): Promise<Staff[]> => {
  try {
    if (USE_MOCK_DATA) {
      return mockStaffs;
    }
    
    return await callWithRetry(() => api.get('/staffs'));
  } catch (error) {
    logError(error, 'getStaffs');
    throw handleApiError(error, 'スタッフ情報の取得に失敗しました');
  }
};

// 修正後
export const getStaffs = async (): Promise<Staff[]> => {
  try {
    if (USE_MOCK_DATA) {
      return mockStaffs;
    }
    
    return await callWithRetry(() => api.get('/staff'));
  } catch (error) {
    logError(error, 'getStaffs');
    throw handleApiError(error, 'スタッフ情報の取得に失敗しました');
  }
};
```

同様の修正をstaffService.tsの他のメソッドにも適用します。

## 3. 検索エンドポイントの追加

### ユーザー検索エンドポイントの追加

#### 修正対象ファイル
- `/home/ubuntu/PMS/backend/src/modules/users/users.controller.ts`
- `/home/ubuntu/PMS/backend/src/modules/users/users.service.ts`
- `/home/ubuntu/PMS/backend/src/dto/users/search-users.dto.ts`（新規作成）

#### 修正内容

##### search-users.dto.ts（新規作成）
```typescript
export class SearchUsersDto {
  query?: string;
  role?: string;
  isActive?: boolean;
}
```

##### users.controller.ts
```typescript
// 追加
@Get('search')
@Roles('admin')
search(@Query() searchUsersDto: SearchUsersDto) {
  return this.usersService.search(searchUsersDto);
}
```

##### users.service.ts
```typescript
// 追加
async search(searchUsersDto: SearchUsersDto): Promise<User[]> {
  const { query, role, isActive } = searchUsersDto;
  
  const queryBuilder = this.usersRepository.createQueryBuilder('user');
  
  if (query) {
    queryBuilder.where(
      'user.username LIKE :query OR user.fullName LIKE :query OR user.email LIKE :query',
      { query: `%${query}%` }
    );
  }
  
  if (role) {
    queryBuilder.andWhere('user.role = :role', { role });
  }
  
  if (isActive !== undefined) {
    queryBuilder.andWhere('user.isActive = :isActive', { isActive });
  }
  
  return queryBuilder.getMany();
}
```

### パートナー検索エンドポイントの追加

#### 修正対象ファイル
- `/home/ubuntu/PMS/backend/src/modules/partners/partners.controller.ts`
- `/home/ubuntu/PMS/backend/src/modules/partners/partners.service.ts`
- `/home/ubuntu/PMS/backend/src/dto/partners/search-partners.dto.ts`（新規作成）

#### 修正内容

##### search-partners.dto.ts（新規作成）
```typescript
export class SearchPartnersDto {
  query?: string;
  status?: string;
  businessCategory?: string;
}
```

##### partners.controller.ts
```typescript
// 追加
@Get('search')
@Public()
search(@Query() searchPartnersDto: SearchPartnersDto) {
  return this.partnersService.search(searchPartnersDto);
}
```

##### partners.service.ts
```typescript
// 追加
async search(searchPartnersDto: SearchPartnersDto): Promise<Partner[]> {
  const { query, status, businessCategory } = searchPartnersDto;
  
  const queryBuilder = this.partnersRepository.createQueryBuilder('partner');
  
  if (query) {
    queryBuilder.where(
      'partner.name LIKE :query OR partner.email LIKE :query OR partner.phone LIKE :query',
      { query: `%${query}%` }
    );
  }
  
  if (status) {
    queryBuilder.andWhere('partner.status = :status', { status });
  }
  
  if (businessCategory) {
    queryBuilder.andWhere('partner.businessCategory = :businessCategory', { businessCategory });
  }
  
  return queryBuilder.getMany();
}
```

## 4. 要員割り当てエンドポイントの追加（プロジェクトサービス）

#### 修正対象ファイル
- `/home/ubuntu/PMS/backend/src/modules/projects/projects.controller.ts`
- `/home/ubuntu/PMS/backend/src/modules/projects/projects.service.ts`
- `/home/ubuntu/PMS/backend/src/dto/projects/assign-staff.dto.ts`（新規作成）

#### 修正内容

##### assign-staff.dto.ts（新規作成）
```typescript
export class AssignStaffDto {
  staffIds: string[];
}
```

##### projects.controller.ts
```typescript
// 追加
@Post(':id/assign-staff')
@Roles('admin', 'partner_manager')
assignStaff(@Param('id') id: string, @Body() assignStaffDto: AssignStaffDto) {
  return this.projectsService.assignStaff(id, assignStaffDto.staffIds);
}

@Delete(':id/staff/:staffId')
@Roles('admin', 'partner_manager')
removeStaff(@Param('id') id: string, @Param('staffId') staffId: string) {
  return this.projectsService.removeStaff(id, staffId);
}
```

##### projects.service.ts
```typescript
// 追加
async assignStaff(projectId: string, staffIds: string[]): Promise<Project> {
  const project = await this.findOne(projectId);
  if (!project) {
    throw new NotFoundException(`Project with ID ${projectId} not found`);
  }
  
  // プロジェクトと要員の関連付けを行う
  // 注: 実際の実装はデータベーススキーマに依存します
  // ここでは中間テーブル（project_staff）を使用すると仮定
  
  const queryRunner = this.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    for (const staffId of staffIds) {
      const staff = await this.staffRepository.findOne(staffId);
      if (!staff) {
        throw new NotFoundException(`Staff with ID ${staffId} not found`);
      }
      
      await queryRunner.manager.query(
        `INSERT INTO project_staff (project_id, staff_id) VALUES (?, ?)`,
        [projectId, staffId]
      );
    }
    
    await queryRunner.commitTransaction();
    
    // 更新されたプロジェクトを返す
    return this.findOne(projectId);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

async removeStaff(projectId: string, staffId: string): Promise<Project> {
  const project = await this.findOne(projectId);
  if (!project) {
    throw new NotFoundException(`Project with ID ${projectId} not found`);
  }
  
  const staff = await this.staffRepository.findOne(staffId);
  if (!staff) {
    throw new NotFoundException(`Staff with ID ${staffId} not found`);
  }
  
  // プロジェクトと要員の関連付けを解除する
  await this.connection.query(
    `DELETE FROM project_staff WHERE project_id = ? AND staff_id = ?`,
    [projectId, staffId]
  );
  
  // 更新されたプロジェクトを返す
  return this.findOne(projectId);
}
```

## 5. フィールド名の統一

### ユーザーモデルのフィールド名統一

#### 修正対象ファイル
- `/home/ubuntu/PMS/frontend/src/shared-types.ts`（または同等のファイル）

#### 修正内容
```typescript
// 修正前
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  department: string;
  // ...
}

// 修正後
export interface User {
  id: string;
  fullName: string; // nameからfullNameに変更
  username: string;
  email: string;
  department: string;
  // ...
}
```

### プロジェクトモデルのフィールド名統一

#### 修正対象ファイル
- `/home/ubuntu/PMS/frontend/src/shared-types.ts`（または同等のファイル）

#### 修正内容
```typescript
// 修正前
export interface Project {
  id: string;
  name: string;
  partnerId: string;
  status: string;
  skills: string[];
  assignedStaffs: string[];
  // ...
}

// 修正後
export interface Project {
  id: string;
  name: string;
  departmentId: string; // partnerIdからdepartmentIdに変更
  sectionId: string; // 追加
  status: string;
  requiredSkills: string; // skillsからrequiredSkillsに変更、型も配列から文字列に変更
  // assignedStaffsは別途リレーションとして扱う
  // ...
}
```

## 6. データ変換層の追加

#### 修正対象ファイル
- `/home/ubuntu/PMS/frontend/src/utils/apiMappers.ts`（新規作成）

#### 修正内容
```typescript
import { User, Project, Staff, Partner } from '../shared-types';

// ユーザーデータのマッピング
export const mapUserFromApi = (apiUser: any): User => ({
  id: apiUser.id,
  fullName: apiUser.fullName,
  username: apiUser.username,
  email: apiUser.email,
  department: apiUser.department,
  role: apiUser.role,
  isActive: apiUser.isActive,
  // 他のフィールドもマッピング
});

export const mapUserToApi = (user: User): any => ({
  id: user.id,
  fullName: user.fullName,
  username: user.username,
  email: user.email,
  department: user.department,
  role: user.role,
  isActive: user.isActive,
  // 他のフィールドもマッピング
});

// プロジェクトデータのマッピング
export const mapProjectFromApi = (apiProject: any): Project => ({
  id: apiProject.id,
  name: apiProject.name,
  departmentId: apiProject.departmentId,
  sectionId: apiProject.sectionId,
  status: apiProject.status,
  requiredSkills: apiProject.requiredSkills,
  // スキルを文字列から配列に変換
  skills: apiProject.requiredSkills ? apiProject.requiredSkills.split(',').map(s => s.trim()) : [],
  // 他のフィールドもマッピング
});

export const mapProjectToApi = (project: Project): any => ({
  id: project.id,
  name: project.name,
  departmentId: project.departmentId,
  sectionId: project.sectionId,
  status: project.status,
  // スキルを配列から文字列に変換
  requiredSkills: Array.isArray(project.skills) ? project.skills.join(', ') : project.requiredSkills,
  // 他のフィールドもマッピング
});

// スタッフデータのマッピング
export const mapStaffFromApi = (apiStaff: any): Staff => ({
  id: apiStaff.id,
  name: apiStaff.name,
  email: apiStaff.email,
  phone: apiStaff.phone,
  // statusをavailabilityにマッピング
  availability: apiStaff.status,
  skills: apiStaff.skills || [],
  experience: apiStaff.experience,
  // 他のフィールドもマッピング
});

export const mapStaffToApi = (staff: Staff): any => ({
  id: staff.id,
  name: staff.name,
  email: staff.email,
  phone: staff.phone,
  // availabilityをstatusにマッピング
  status: staff.availability,
  skills: staff.skills,
  experience: staff.experience,
  // 他のフィールドもマッピング
});

// パートナーデータのマッピング
export const mapPartnerFromApi = (apiPartner: any): Partner => ({
  id: apiPartner.id,
  name: apiPartner.name,
  // businessCategoryをindustryにマッピング
  industry: apiPartner.businessCategory,
  // codeフィールドはバックエンドにないため、デフォルト値または空文字を設定
  code: apiPartner.code || '',
  // 他のフィールドもマッピング
});

export const mapPartnerToApi = (partner: Partner): any => ({
  id: partner.id,
  name: partner.name,
  // industryをbusinessCategoryにマッピング
  businessCategory: partner.industry,
  // codeフィールドはバックエンドに送信しない
  // 他のフィールドもマッピング
});
```

## 7. 権限チェックの実装（フロントエンド）

#### 修正対象ファイル
- `/home/ubuntu/PMS/frontend/src/utils/authUtils.ts`（新規作成）

#### 修正内容
```typescript
import { User } from '../shared-types';

// 現在のユーザー情報を取得する関数
// 実際の実装はアプリケーションの状態管理方法に依存します
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

// 権限チェック関数
export const hasPermission = (requiredRoles: string[]): boolean => {
  const currentUser = getCurrentUser();
  return currentUser !== null && requiredRoles.includes(currentUser.role);
};

// 特定の権限チェック関数
export const isAdmin = (): boolean => {
  return hasPermission(['admin']);
};

export const isPartnerManager = (): boolean => {
  return hasPermission(['admin', 'partner_manager']);
};

export const isDeveloper = (): boolean => {
  return hasPermission(['admin', 'partner_manager', 'developer']);
};

export const canEditProject = (): boolean => {
  return hasPermission(['admin', 'partner_manager', 'developer']);
};

export const canEditStaff = (): boolean => {
  return hasPermission(['admin', 'partner_manager']);
};

export const canDeleteEntity = (): boolean => {
  return hasPermission(['admin']);
};
```

## 8. 認証設定の整理（パートナーサービス）

#### 修正対象ファイル
- `/home/ubuntu/PMS/backend/src/modules/partners/partners.controller.ts`

#### 修正内容
```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from '../../dto/partners/create-partner.dto';
import { UpdatePartnerDto } from '../../dto/partners/update-partner.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('partners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  // 公開エンドポイント
  @Get()
  @Public()
  findAll() {
    return this.partnersService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const partner = await this.partnersService.findOne(id);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  // 認証が必要なエンドポイント
  @Post()
  @Roles('admin', 'partner_manager')
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Patch(':id')
  @Roles('admin', 'partner_manager')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }

  // 検索エンドポイント（公開）
  @Get('search')
  @Public()
  search(@Query() searchPartnersDto: SearchPartnersDto) {
    return this.partnersService.search(searchPartnersDto);
  }
}
```

## 実装手順

1. **バックアップの作成**
   ```bash
   mkdir -p /home/ubuntu/PMS/backup
   cp -r /home/ubuntu/PMS/frontend/src/services /home/ubuntu/PMS/backup/frontend_services
   cp -r /home/ubuntu/PMS/backend/src/modules /home/ubuntu/PMS/backup/backend_modules
   ```

2. **フロントエンドの修正**
   - HTTPメソッドの統一
   - エンドポイントパスの統一（スタッフサービス）
   - データ変換層の追加
   - 権限チェックの実装

3. **バックエンドの修正**
   - 検索エンドポイントの追加
   - 要員割り当てエンドポイントの追加
   - 認証設定の整理

4. **テストと検証**
   - 各サービスの単体テスト
   - 統合テスト
   - エンドツーエンドテスト

5. **デプロイ**
   - ステージング環境へのデプロイ
   - テスト後、本番環境へのデプロイ
