"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const create_partner_dto_1 = require("../dto/partners/create-partner.dto");
const create_project_dto_1 = require("../dto/projects/create-project.dto");
const create_staff_dto_1 = require("../dto/staff/create-staff.dto");
const create_contract_dto_1 = require("../dto/contracts/create-contract.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
describe('Validation Tests', () => {
    let validationPipe;
    beforeAll(async () => {
        validationPipe = new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        });
    });
    describe('Partner DTO Validation', () => {
        it('有効なパートナーDTOは検証に合格すること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_partner_dto_1.CreatePartnerDto, {
                name: 'テスト株式会社',
                address: '東京都渋谷区',
                phone: '03-1234-5678',
                email: 'test@example.com',
                status: '取引中'
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBe(0);
        });
        it('必須フィールドが欠けている場合はエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_partner_dto_1.CreatePartnerDto, {
                name: 'テスト株式会社',
                phone: '03-1234-5678'
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('address');
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
        it('無効なメールアドレスはエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_partner_dto_1.CreatePartnerDto, {
                name: 'テスト株式会社',
                address: '東京都渋谷区',
                phone: '03-1234-5678',
                email: 'invalid-email'
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('email');
            expect(errors[0].constraints).toHaveProperty('isEmail');
        });
        it('無効なステータスはエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_partner_dto_1.CreatePartnerDto, {
                name: 'テスト株式会社',
                address: '東京都渋谷区',
                phone: '03-1234-5678',
                status: '無効なステータス'
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('status');
            expect(errors[0].constraints).toHaveProperty('isEnum');
        });
    });
    describe('Project DTO Validation', () => {
        it('有効なプロジェクトDTOは検証に合格すること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_project_dto_1.CreateProjectDto, {
                name: 'テストプロジェクト',
                department: 'システム開発部',
                description: 'テスト用プロジェクトの説明',
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                status: '募集中',
                budget: "10000000"
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBe(0);
        });
        it('必須フィールドが欠けている場合はエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_project_dto_1.CreateProjectDto, {
                department: 'システム開発部',
                description: 'テスト用プロジェクトの説明',
                startDate: '2025-01-01',
                endDate: '2025-12-31'
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('name');
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
        it('終了日が開始日より前の場合はエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_project_dto_1.CreateProjectDto, {
                name: 'テストプロジェクト',
                department: 'システム開発部',
                description: 'テスト用プロジェクトの説明',
                startDate: '2025-12-31',
                endDate: '2025-01-01',
                status: '進行中',
                budget: "10000000"
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some(e => e.property === 'endDate')).toBe(true);
            expect(errors.some(e => e.constraints && e.constraints.isAfterDate)).toBe(true);
        });
    });
    describe('Staff DTO Validation', () => {
        it('有効なスタッフDTOは検証に合格すること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_staff_dto_1.CreateStaffDto, {
                name: '山田太郎',
                email: 'taro.yamada@example.com',
                phone: '090-1234-5678',
                skills: ['Java', 'Spring', 'SQL'],
                partner: { id: '1' }
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBe(0);
        });
        it('必須フィールドが欠けている場合はエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_staff_dto_1.CreateStaffDto, {
                email: 'taro.yamada@example.com',
                phone: '090-1234-5678'
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('name');
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });
        it('無効なメールアドレスはエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_staff_dto_1.CreateStaffDto, {
                name: '山田太郎',
                email: 'invalid-email',
                phone: '090-1234-5678',
                partner: { id: '1' }
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('email');
            expect(errors[0].constraints).toHaveProperty('isEmail');
        });
    });
    describe('Contract DTO Validation', () => {
        it('有効な契約DTOは検証に合格すること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_contract_dto_1.CreateContractDto, {
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                price: 800000,
                paymentTerms: '月額固定',
                status: '契約中',
                staff: { id: '1' },
                project: { id: '1' }
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBe(0);
        });
        it('必須フィールドが欠けている場合はエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_contract_dto_1.CreateContractDto, {
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                price: 800000,
                paymentTerms: '月額固定',
                status: '契約中'
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some(e => e.property === 'staff' || e.property === 'project')).toBe(true);
        });
        it('スタッフとプロジェクトが欠けている場合はエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_contract_dto_1.CreateContractDto, {
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                price: 800000,
                paymentTerms: '月額固定',
                status: '契約中'
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some(e => e.property === 'staff')).toBe(true);
            expect(errors.some(e => e.property === 'project')).toBe(true);
        });
        it('終了日が開始日より前の場合はエラーになること', async () => {
            const dto = (0, class_transformer_1.plainToClass)(create_contract_dto_1.CreateContractDto, {
                startDate: '2025-12-31',
                endDate: '2025-01-01',
                price: 800000,
                paymentTerms: '月額固定',
                status: '契約中',
                staff: { id: '1' },
                project: { id: '1' }
            });
            const errors = await (0, class_validator_1.validate)(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some(e => e.property === 'endDate')).toBe(true);
            expect(errors.some(e => e.constraints && e.constraints.isAfterDate)).toBe(true);
        });
    });
});
//# sourceMappingURL=validation.spec.js.map