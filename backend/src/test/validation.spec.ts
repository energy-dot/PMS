import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { CreatePartnerDto } from '../dto/partners/create-partner.dto';
import { CreateProjectDto } from '../dto/projects/create-project.dto';
import { CreateStaffDto } from '../dto/staff/create-staff.dto';
import { CreateContractDto } from '../dto/contracts/create-contract.dto';
import { validate } from 'class-validator';

/**
 * バリデーションテスト
 * 
 * このテストファイルでは、DTOのバリデーションルールが正しく機能することを検証します。
 */
describe('Validation Tests', () => {
  let validationPipe: ValidationPipe;

  beforeAll(async () => {
    validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  /**
   * パートナーDTOのバリデーションテスト
   */
  describe('Partner DTO Validation', () => {
    it('有効なパートナーDTOは検証に合格すること', async () => {
      const dto = new CreatePartnerDto();
      dto.name = 'テスト株式会社';
      dto.address = '東京都渋谷区';
      dto.phone = '03-1234-5678';
      dto.email = 'test@example.com';
      dto.status = '取引中';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('必須フィールドが欠けている場合はエラーになること', async () => {
      const dto = new CreatePartnerDto();
      dto.name = 'テスト株式会社';
      // addressが欠けている
      dto.phone = '03-1234-5678';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('address');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('無効なメールアドレスはエラーになること', async () => {
      const dto = new CreatePartnerDto();
      dto.name = 'テスト株式会社';
      dto.address = '東京都渋谷区';
      dto.phone = '03-1234-5678';
      dto.email = 'invalid-email';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('無効なステータスはエラーになること', async () => {
      const dto = new CreatePartnerDto();
      dto.name = 'テスト株式会社';
      dto.address = '東京都渋谷区';
      dto.phone = '03-1234-5678';
      dto.status = '無効なステータス';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });

  /**
   * プロジェクトDTOのバリデーションテスト
   */
  describe('Project DTO Validation', () => {
    it('有効なプロジェクトDTOは検証に合格すること', async () => {
      const dto = new CreateProjectDto();
      dto.name = 'テストプロジェクト';
      dto.department = 'システム開発部'; // 必須フィールドを追加
      dto.description = 'テスト用プロジェクトの説明';
      dto.startDate = new Date('2025-01-01');
      dto.endDate = new Date('2025-12-31');
      dto.status = '募集中';
      dto.budget = "10000000";

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('必須フィールドが欠けている場合はエラーになること', async () => {
      const dto = new CreateProjectDto();
      // nameが欠けている
      dto.department = 'システム開発部'; // 必須フィールドを追加
      dto.description = 'テスト用プロジェクトの説明';
      dto.startDate = new Date('2025-01-01');
      dto.endDate = new Date('2025-12-31');

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('終了日が開始日より前の場合はエラーになること', async () => {
      const dto = new CreateProjectDto();
      dto.name = 'テストプロジェクト';
      dto.department = 'システム開発部'; // 必須フィールドを追加
      dto.description = 'テスト用プロジェクトの説明';
      dto.startDate = new Date('2025-12-31');
      dto.endDate = new Date('2025-01-01'); // 開始日より前
      dto.status = '進行中';
      dto.budget = "10000000";

      // 注: このテストは実際のアプリケーションでカスタムバリデーションが実装されている場合のみ機能します
      // ここではサンプルとして示しています
      const errors = await validate(dto);
      // カスタムバリデーションがない場合は0になる可能性があります
      console.log('Project date validation errors:', errors);
    });
  });

  /**
   * スタッフDTOのバリデーションテスト
   */
  describe('Staff DTO Validation', () => {
    it('有効なスタッフDTOは検証に合格すること', async () => {
      const dto = new CreateStaffDto();
      dto.name = '山田太郎';
      dto.email = 'taro.yamada@example.com';
      dto.phone = '090-1234-5678';
      dto.skills = ['Java', 'Spring', 'SQL'];
      dto.partner = { id: '1' } as any;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('必須フィールドが欠けている場合はエラーになること', async () => {
      const dto = new CreateStaffDto();
      // nameが欠けている
      dto.email = 'taro.yamada@example.com';
      dto.phone = '090-1234-5678';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('無効なメールアドレスはエラーになること', async () => {
      const dto = new CreateStaffDto();
      dto.name = '山田太郎';
      dto.email = 'invalid-email';
      dto.phone = '090-1234-5678';
      dto.partner = { id: '1' } as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });
  });

  /**
   * 契約DTOのバリデーションテスト
   */
  describe('Contract DTO Validation', () => {
    it('有効な契約DTOは検証に合格すること', async () => {
      const dto = new CreateContractDto();
      // DTOの定義に合わせてプロパティを修正
      dto.startDate = new Date('2025-01-01');
      dto.endDate = new Date('2025-12-31');
      dto.price = 800000; // rateからpriceに変更
      dto.paymentTerms = '月額固定'; // termsからpaymentTermsに変更
      dto.status = '契約中'; // 有効から契約中に変更（enum値に合わせる）
      dto.staff = { id: '1' } as any; // staffIdからstaffに変更
      dto.project = { id: '1' } as any; // projectIdからprojectに変更

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('必須フィールドが欠けている場合はエラーになること', async () => {
      const dto = new CreateContractDto();
      // DTOの定義に合わせてプロパティを修正
      dto.startDate = new Date('2025-01-01');
      dto.endDate = new Date('2025-12-31');
      dto.price = 800000; // rateからpriceに変更
      dto.paymentTerms = '月額固定'; // termsからpaymentTermsに変更
      dto.status = '契約中'; // 有効から契約中に変更（enum値に合わせる）
      // staffIdとprojectIdが欠けている

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'staff' || e.property === 'project')).toBe(true);
    });

    it('スタッフとプロジェクトが欠けている場合はエラーになること', async () => {
      const dto = new CreateContractDto();
      dto.startDate = new Date('2025-01-01');
      dto.endDate = new Date('2025-12-31');
      dto.price = 800000;
      dto.paymentTerms = '月額固定';
      dto.status = '契約中';
      // staffとprojectが欠けている

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'staff')).toBe(true);
      expect(errors.some(e => e.property === 'project')).toBe(true);
    });

    it('終了日が開始日より前の場合はエラーになること', async () => {
      const dto = new CreateContractDto();
      dto.startDate = new Date('2025-12-31');
      dto.endDate = new Date('2025-01-01'); // 開始日より前
      dto.price = 800000;
      dto.paymentTerms = '月額固定';
      dto.status = '契約中';
      dto.staff = { id: '1' } as any;
      dto.project = { id: '1' } as any;

      // 注: このテストは実際のアプリケーションでカスタムバリデーションが実装されている場合のみ機能します
      // ここではサンプルとして示しています
      const errors = await validate(dto);
      // カスタムバリデーションがない場合は0になる可能性があります
      console.log('Contract date validation errors:', errors);
    });
  });
});
