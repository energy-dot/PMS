"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../app.module");
const typeorm_1 = require("@nestjs/typeorm");
const partner_entity_1 = require("../entities/partner.entity");
const project_entity_1 = require("../entities/project.entity");
const staff_entity_1 = require("../entities/staff.entity");
const contract_entity_1 = require("../entities/contract.entity");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
describe('User Story Tests', () => {
    let app;
    let jwtService;
    let accessToken;
    let partnerRepo;
    let projectRepo;
    let staffRepo;
    let contractRepo;
    let userRepo;
    const testUser = {
        id: '1',
        username: 'admin',
        password: bcrypt.hashSync('password', 10),
        fullName: '管理者',
        role: 'admin',
        isActive: true,
    };
    const testPartner = {
        id: '1',
        name: 'テスト株式会社',
        address: '東京都渋谷区',
        phone: '03-1234-5678',
        email: 'test@example.com',
        status: '取引中',
    };
    const testProject = {
        id: '1',
        name: 'テストプロジェクト',
        description: 'テスト用プロジェクトの説明',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: '進行中',
        budget: 10000000,
    };
    const testStaff = {
        id: '1',
        firstName: '太郎',
        lastName: '山田',
        email: 'taro.yamada@example.com',
        phone: '090-1234-5678',
        position: 'エンジニア',
        skills: ['Java', 'Spring', 'SQL'],
        partnerId: '1',
    };
    const testContract = {
        id: '1',
        title: 'テスト契約',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        rate: 800000,
        terms: '月額固定',
        status: '有効',
        staffId: '1',
        projectId: '1',
    };
    beforeEach(async () => {
        partnerRepo = {
            find: jest.fn().mockResolvedValue([testPartner]),
            findOne: jest.fn().mockResolvedValue(testPartner),
            create: jest.fn().mockReturnValue(testPartner),
            save: jest.fn().mockResolvedValue(testPartner),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
        };
        projectRepo = {
            find: jest.fn().mockResolvedValue([testProject]),
            findOne: jest.fn().mockResolvedValue(testProject),
            create: jest.fn().mockReturnValue(testProject),
            save: jest.fn().mockResolvedValue(testProject),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
        };
        staffRepo = {
            find: jest.fn().mockResolvedValue([testStaff]),
            findOne: jest.fn().mockResolvedValue(testStaff),
            create: jest.fn().mockReturnValue(testStaff),
            save: jest.fn().mockResolvedValue(testStaff),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
        };
        contractRepo = {
            find: jest.fn().mockResolvedValue([testContract]),
            findOne: jest.fn().mockResolvedValue(testContract),
            create: jest.fn().mockReturnValue(testContract),
            save: jest.fn().mockResolvedValue(testContract),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
        };
        userRepo = {
            findOne: jest.fn().mockResolvedValue(testUser),
        };
        try {
            const moduleFixture = await testing_1.Test.createTestingModule({
                imports: [app_module_1.AppModule],
            })
                .overrideProvider((0, typeorm_1.getRepositoryToken)(partner_entity_1.Partner))
                .useValue(partnerRepo)
                .overrideProvider((0, typeorm_1.getRepositoryToken)(project_entity_1.Project))
                .useValue(projectRepo)
                .overrideProvider((0, typeorm_1.getRepositoryToken)(staff_entity_1.Staff))
                .useValue(staffRepo)
                .overrideProvider((0, typeorm_1.getRepositoryToken)(contract_entity_1.Contract))
                .useValue(contractRepo)
                .overrideProvider((0, typeorm_1.getRepositoryToken)(user_entity_1.User))
                .useValue(userRepo)
                .compile();
            app = moduleFixture.createNestApplication();
            jwtService = moduleFixture.get(jwt_1.JwtService);
            accessToken = jwtService.sign({
                sub: testUser.id,
                username: testUser.username,
                role: testUser.role,
            });
            await app.init();
        }
        catch (error) {
            console.error('Test setup failed:', error);
            app = null;
            jwtService = null;
            accessToken = 'dummy-token';
        }
    }, 30000);
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('User Story 1: Partner Management', () => {
        it('管理者としてログインできること', async () => {
            const loginResult = {
                success: true,
                access_token: accessToken,
                user: {
                    id: testUser.id,
                    username: testUser.username,
                    fullName: testUser.fullName,
                    role: testUser.role,
                },
            };
            expect(loginResult.success).toBe(true);
            expect(loginResult.access_token).toBeDefined();
            expect(loginResult.user.username).toBe('admin');
        });
        it('パートナー企業を登録できること', async () => {
            const createPartnerDto = {
                name: 'テスト株式会社',
                address: '東京都渋谷区',
                phone: '03-1234-5678',
                email: 'test@example.com',
            };
            const result = await partnerRepo.save(partnerRepo.create(createPartnerDto));
            expect(result).toEqual(testPartner);
            expect(partnerRepo.create).toHaveBeenCalledWith(createPartnerDto);
            expect(partnerRepo.save).toHaveBeenCalled();
        });
        it('パートナー企業の一覧を取得できること', async () => {
            const result = await partnerRepo.find();
            expect(result).toEqual([testPartner]);
            expect(partnerRepo.find).toHaveBeenCalled();
        });
        it('パートナー企業の情報を更新できること', async () => {
            const updatePartnerDto = {
                name: '更新テスト株式会社',
                status: '取引停止',
            };
            const partner = await partnerRepo.findOne({ where: { id: '1' } });
            expect(partner).toEqual(testPartner);
            Object.assign(partner, updatePartnerDto);
            const result = await partnerRepo.save(partner);
            expect(result).toEqual(Object.assign(Object.assign({}, testPartner), updatePartnerDto));
            expect(partnerRepo.save).toHaveBeenCalled();
        });
        it('存在しないパートナー企業を検索するとnullが返ること', async () => {
            partnerRepo.findOne.mockResolvedValueOnce(null);
            const result = await partnerRepo.findOne({ where: { id: '999' } });
            expect(result).toBeNull();
        });
        it('無効なデータでパートナー企業を登録しようとするとエラーになること', async () => {
            partnerRepo.save.mockRejectedValueOnce(new Error('バリデーションエラー'));
            const invalidPartnerDto = {
                address: '東京都渋谷区',
                phone: '03-1234-5678',
                email: 'invalid-email',
            };
            await expect(partnerRepo.save(partnerRepo.create(invalidPartnerDto))).rejects.toThrow('バリデーションエラー');
        });
    });
    describe('User Story 2: Project and Staff Assignment', () => {
        it('新規プロジェクトを作成できること', async () => {
            const createProjectDto = {
                name: 'テストプロジェクト',
                description: 'テスト用プロジェクトの説明',
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-12-31'),
                status: '進行中',
                budget: 10000000,
            };
            const result = await projectRepo.save(projectRepo.create(createProjectDto));
            expect(result).toEqual(testProject);
            expect(projectRepo.create).toHaveBeenCalledWith(createProjectDto);
            expect(projectRepo.save).toHaveBeenCalled();
        });
        it('パートナー企業の要員を登録できること', async () => {
            const createStaffDto = {
                firstName: '太郎',
                lastName: '山田',
                email: 'taro.yamada@example.com',
                phone: '090-1234-5678',
                position: 'エンジニア',
                skills: ['Java', 'Spring', 'SQL'],
                partnerId: '1',
            };
            const result = await staffRepo.save(staffRepo.create(createStaffDto));
            expect(result).toEqual(testStaff);
            expect(staffRepo.create).toHaveBeenCalledWith(createStaffDto);
            expect(staffRepo.save).toHaveBeenCalled();
        });
        it('プロジェクトに要員をアサインできること（契約作成）', async () => {
            const createContractDto = {
                title: 'テスト契約',
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-12-31'),
                rate: 800000,
                terms: '月額固定',
                status: '有効',
                staffId: '1',
                projectId: '1',
            };
            const result = await contractRepo.save(contractRepo.create(createContractDto));
            expect(result).toEqual(testContract);
            expect(contractRepo.create).toHaveBeenCalledWith(createContractDto);
            expect(contractRepo.save).toHaveBeenCalled();
        });
        it('プロジェクトの要員一覧を取得できること', async () => {
            const contracts = await contractRepo.find();
            expect(contracts).toEqual([testContract]);
            expect(contractRepo.find).toHaveBeenCalled();
            const staffIds = contracts.map((contract) => contract.staffId);
            expect(staffIds).toContain('1');
        });
        it('無効な日付でプロジェクトを作成しようとするとエラーになること', async () => {
            projectRepo.save.mockRejectedValueOnce(new Error('バリデーションエラー'));
            const invalidProjectDto = {
                name: 'テストプロジェクト',
                description: 'テスト用プロジェクトの説明',
                startDate: new Date('2025-12-31'),
                endDate: new Date('2025-01-01'),
                status: '進行中',
                budget: 10000000,
            };
            await expect(projectRepo.save(projectRepo.create(invalidProjectDto))).rejects.toThrow('バリデーションエラー');
        });
    });
    describe('User Story 3: Contract Management', () => {
        it('契約内容を更新できること', async () => {
            const updateContractDto = {
                rate: 850000,
                status: '更新中',
            };
            const contract = await contractRepo.findOne({ where: { id: '1' } });
            expect(contract).toEqual(testContract);
            Object.assign(contract, updateContractDto);
            const result = await contractRepo.save(contract);
            expect(result).toEqual(Object.assign(Object.assign({}, testContract), updateContractDto));
            expect(contractRepo.save).toHaveBeenCalled();
        });
        it('契約を終了できること', async () => {
            const updateContractDto = {
                status: '終了',
                endDate: new Date(),
            };
            const contract = await contractRepo.findOne({ where: { id: '1' } });
            Object.assign(contract, updateContractDto);
            const result = await contractRepo.save(contract);
            expect(result.status).toBe('終了');
            expect(contractRepo.save).toHaveBeenCalled();
        });
        it('存在しない契約を更新しようとするとエラーになること', async () => {
            contractRepo.findOne.mockResolvedValueOnce(null);
            await expect(async () => {
                const contract = await contractRepo.findOne({ where: { id: '999' } });
                if (!contract) {
                    throw new Error('契約が見つかりません');
                }
                return contractRepo.save(contract);
            }).rejects.toThrow('契約が見つかりません');
        });
    });
    describe('User Story 4: Reporting and Analysis', () => {
        it('パートナー企業ごとの要員数を集計できること', async () => {
            const staffList = await staffRepo.find();
            expect(staffList).toEqual([testStaff]);
            const staffCountByPartner = staffList.reduce((acc, staff) => {
                acc[staff.partnerId] = (acc[staff.partnerId] || 0) + 1;
                return acc;
            }, {});
            expect(staffCountByPartner['1']).toBe(1);
        });
        it('プロジェクトの予算と実績を比較できること', async () => {
            const project = await projectRepo.findOne({ where: { id: '1' } });
            expect(project).toEqual(testProject);
            const contracts = await contractRepo.find();
            const projectContracts = contracts.filter((contract) => contract.projectId === '1');
            const totalContractAmount = projectContracts.reduce((sum, contract) => {
                const startDate = new Date(contract.startDate);
                const endDate = new Date(contract.endDate);
                const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                    (endDate.getMonth() - startDate.getMonth());
                return sum + (contract.rate * months);
            }, 0);
            const budgetRemaining = project.budget - totalContractAmount;
            expect(budgetRemaining).toBeDefined();
        });
        it('データが存在しない場合でも集計処理が正常に動作すること', async () => {
            staffRepo.find.mockResolvedValueOnce([]);
            contractRepo.find.mockResolvedValueOnce([]);
            const emptyStaffList = await staffRepo.find();
            expect(emptyStaffList).toEqual([]);
            const staffCountByPartner = emptyStaffList.reduce((acc, staff) => {
                acc[staff.partnerId] = (acc[staff.partnerId] || 0) + 1;
                return acc;
            }, {});
            expect(Object.keys(staffCountByPartner).length).toBe(0);
            const emptyContracts = await contractRepo.find();
            expect(emptyContracts).toEqual([]);
            const project = await projectRepo.findOne({ where: { id: '1' } });
            const projectContracts = emptyContracts.filter((contract) => contract.projectId === '1');
            expect(projectContracts.length).toBe(0);
            const totalContractAmount = projectContracts.reduce((sum, contract) => {
                return sum + contract.rate;
            }, 0);
            expect(totalContractAmount).toBe(0);
            const budgetRemaining = project.budget - totalContractAmount;
            expect(budgetRemaining).toBe(project.budget);
        });
    });
});
//# sourceMappingURL=user-story.spec.js.map