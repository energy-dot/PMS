# パートナーサービス整合性分析レポート

## 1. エンドポイント整合性分析

### バックエンドエンドポイント（partners.controller.ts）
- `POST /partners` - パートナー作成
- `GET /partners` - 全パートナー取得
- `GET /partners/:id` - 特定パートナー取得
- `PATCH /partners/:id` - パートナー更新
- `DELETE /partners/:id` - パートナー削除

### フロントエンドAPI呼び出し（partnerService.ts）
- `api.get('/partners')` - 全パートナー取得
- `api.get('/partners/:id')` - 特定パートナー取得
- `api.post('/partners', data)` - パートナー作成
- `api.put('/partners/:id', data)` - パートナー更新
- `api.delete('/partners/:id')` - パートナー削除
- `api.get('/partners/search', { params: { query } })` - パートナー検索

### 不整合点
1. **HTTPメソッドの不一致**:
   - バックエンドは`PATCH /partners/:id`を使用しているが、フロントエンドは`PUT /partners/:id`を使用している
   
2. **存在しないエンドポイント**:
   - フロントエンドは`GET /partners/search`を使用しているが、バックエンドにこのエンドポイントが定義されていない

## 2. データモデル整合性分析

### バックエンドエンティティ（partner.entity.ts）
```typescript
// 主要フィールド
id: string;
name: string;
address: string;
phone: string;
email: string;
website: string;
status: string; // enum: '取引中', '取引停止', '候補'
businessCategory: string;
antisocialCheckCompleted: boolean;
antisocialCheckDate: Date;
creditCheckCompleted: boolean;
creditCheckDate: Date;
remarks: string;
createdAt: Date;
updatedAt: Date;
// リレーション
staff: Staff[];
antisocialChecks: AntisocialCheck[];
baseContracts: BaseContract[];
contactPersons: ContactPerson[];
creditChecks: CreditCheck[];
applications: Application[];
```

### フロントエンドモデル（partnerService.tsから推測）
```typescript
// Partner型（shared-types.tsで定義されていると推測）
id: string;
name: string;
code?: string; // バックエンドにはない
industry: string; // バックエンドではbusinessCategoryとして定義？
// その他のフィールドは明示的に使用されていないため不明
```

### 不整合点
1. **フィールド名と型の不一致**:
   - フロントエンドには`code`フィールドがあるが、バックエンドには対応するフィールドがない
   - バックエンドは`businessCategory`を使用しているが、フロントエンドは`industry`を使用している可能性がある

2. **フィールドの欠落**:
   - フロントエンドモデルには多くのバックエンドフィールド（address, phone, email, website, statusなど）が明示的に使用されていない
   - リレーションフィールド（staff, antisocialChecks, baseContractsなど）がフロントエンドモデルで扱われているかどうか不明

3. **ステータス値の不一致**:
   - バックエンドでは日本語のステータス値（'取引中', '取引停止', '候補'）が使用されているが、フロントエンドでのステータス値が不明確

## 3. 認証・権限の整合性

1. **権限チェックの不一致**:
   - バックエンドではすべてのエンドポイントに`@Public()`デコレータが設定されており、認証が不要になっているが、`JwtAuthGuard`も適用されている矛盾がある
   - フロントエンドでは認証や権限チェックの実装が不明確

2. **認証トークンの扱い**:
   - バックエンドでは`JwtAuthGuard`を使用しているが、`@Public()`デコレータによって無効化されている
   - フロントエンドでのトークン管理方法が不明確

## 4. エラーハンドリングの整合性

1. **エラーハンドリングの実装**:
   - バックエンドでは`findOne`メソッドで`NotFoundException`をスローしている
   - フロントエンドでは`handleApiError`と`logError`関数を使用してエラーハンドリングを実装している
   - バックエンドのエラーレスポンス形式とフロントエンドのエラーハンドリングが一致しているかどうか確認が必要

## 5. 修正提案

1. **HTTPメソッドの統一**:
   - フロントエンドの`api.put('/partners/:id', data)`を`api.patch('/partners/:id', data)`に変更する

2. **検索エンドポイントの追加**:
   - バックエンドに`GET /partners/search`エンドポイントを追加する、または
   - フロントエンドの検索ロジックを`GET /partners`を使用してクライアントサイドでフィルタリングするように変更する

3. **データモデルの統一**:
   - フロントエンドの`code`フィールドに対応するバックエンドのフィールドを追加する
   - フロントエンドの`industry`とバックエンドの`businessCategory`の対応関係を明確にする

4. **認証・権限の整理**:
   - バックエンドの認証設定を整理し、`@Public()`と`JwtAuthGuard`の矛盾を解消する
   - フロントエンドに適切な認証・権限チェックロジックを実装する

5. **ステータス値の統一**:
   - バックエンドとフロントエンドでパートナーステータスの値を統一する
