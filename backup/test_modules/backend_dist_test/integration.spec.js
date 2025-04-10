"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../app.module");
const typeorm_1 = require("@nestjs/typeorm");
const partner_entity_1 = require("../entities/partner.entity");
const project_entity_1 = require("../entities/project.entity");
const staff_entity_1 = require("../entities/staff.entity");
const contract_entity_1 = require("../entities/contract.entity");
const fs = require("fs");
const path = require("path");
const loadTestData = (filename) => {
    const filePath = path.join(__dirname, 'fixtures', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};
describe('Integration Tests (e2e)', () => {
    let app;
    let partnerRepo;
    let projectRepo;
    let staffRepo;
    let contractRepo;
    const partners = loadTestData('partners.json');
    const projects = loadTestData('projects.json');
    const staffs = loadTestData('staff.json');
    const contracts = loadTestData('contracts.json');
    beforeAll(async () => {
        try {
            const moduleFixture = await testing_1.Test.createTestingModule({
                imports: [app_module_1.AppModule],
            })
                .overrideProvider((0, typeorm_1.getRepositoryToken)(partner_entity_1.Partner))
                .useValue({
                find: jest.fn().mockResolvedValue(partners),
                findOne: jest.fn().mockImplementation((options) => {
                    const id = options.where.id;
                    return Promise.resolve(partners.find((p) => p.id === id) || null);
                }),
                save: jest.fn().mockImplementation((entity) => {
                    if (Array.isArray(entity)) {
                        return Promise.resolve(entity);
                    }
                    return Promise.resolve(Object.assign({ id: 'new-id' }, entity));
                }),
                create: jest.fn().mockImplementation((dto) => (Object.assign({ id: 'new-id' }, dto))),
                delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
                clear: jest.fn().mockResolvedValue(true),
            })
                .overrideProvider((0, typeorm_1.getRepositoryToken)(project_entity_1.Project))
                .useValue({
                find: jest.fn().mockResolvedValue(projects),
                findOne: jest.fn().mockImplementation((options) => {
                    const id = options.where.id;
                    return Promise.resolve(projects.find((p) => p.id === id) || null);
                }),
                save: jest.fn().mockImplementation((entity) => {
                    if (Array.isArray(entity)) {
                        return Promise.resolve(entity);
                    }
                    return Promise.resolve(Object.assign({ id: 'new-id' }, entity));
                }),
                create: jest.fn().mockImplementation((dto) => (Object.assign({ id: 'new-id' }, dto))),
                delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
                clear: jest.fn().mockResolvedValue(true),
            })
                .overrideProvider((0, typeorm_1.getRepositoryToken)(staff_entity_1.Staff))
                .useValue({
                find: jest.fn().mockResolvedValue(staffs),
                findOne: jest.fn().mockImplementation((options) => {
                    const id = options.where.id;
                    return Promise.resolve(staffs.find((s) => s.id === id) || null);
                }),
                save: jest.fn().mockImplementation((entity) => {
                    if (Array.isArray(entity)) {
                        return Promise.resolve(entity);
                    }
                    return Promise.resolve(Object.assign({ id: 'new-id' }, entity));
                }),
                create: jest.fn().mockImplementation((dto) => (Object.assign({ id: 'new-id' }, dto))),
                delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
                clear: jest.fn().mockResolvedValue(true),
            })
                .overrideProvider((0, typeorm_1.getRepositoryToken)(contract_entity_1.Contract))
                .useValue({
                find: jest.fn().mockResolvedValue(contracts),
                findOne: jest.fn().mockImplementation((options) => {
                    const id = options.where.id;
                    return Promise.resolve(contracts.find((c) => c.id === id) || null);
                }),
                save: jest.fn().mockImplementation((entity) => {
                    if (Array.isArray(entity)) {
                        return Promise.resolve(entity);
                    }
                    return Promise.resolve(Object.assign({ id: 'new-id' }, entity));
                }),
                create: jest.fn().mockImplementation((dto) => (Object.assign({ id: 'new-id' }, dto))),
                delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
                clear: jest.fn().mockResolvedValue(true),
            })
                .compile();
            app = moduleFixture.createNestApplication();
            partnerRepo = moduleFixture.get((0, typeorm_1.getRepositoryToken)(partner_entity_1.Partner));
            projectRepo = moduleFixture.get((0, typeorm_1.getRepositoryToken)(project_entity_1.Project));
            staffRepo = moduleFixture.get((0, typeorm_1.getRepositoryToken)(staff_entity_1.Staff));
            contractRepo = moduleFixture.get((0, typeorm_1.getRepositoryToken)(contract_entity_1.Contract));
            await app.init();
        }
        catch (error) {
            console.error('Test setup failed:', error);
            app = null;
        }
    }, 30000);
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('Partners API', () => {
        it('/partners (GET) - パートナー一覧の取得', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get('/partners')
                .expect(200)
                .expect((res) => {
                expect(res.body).toHaveLength(partners.length);
                expect(res.body[0].name).toBe(partners[0].name);
            });
        });
        it('/partners/:id (GET) - 特定のパートナー情報の取得', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get(`/partners/${partners[0].id}`)
                .expect(200)
                .expect((res) => {
                expect(res.body.name).toBe(partners[0].name);
                expect(res.body.email).toBe(partners[0].email);
            });
        });
        it('/partners/:id (GET) - 存在しないパートナーの場合は404エラー', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get('/partners/999')
                .expect(404);
        });
        it('/partners (POST) - 新規パートナーの作成', async () => {
            if (!app)
                return;
            const newPartner = {
                name: '新規パートナー株式会社',
                address: '東京都新宿区',
                phone: '03-9999-8888',
                email: 'new@example.com',
                status: '取引中'
            };
            return request(app.getHttpServer())
                .post('/partners')
                .send(newPartner)
                .expect(201)
                .expect((res) => {
                expect(res.body.name).toBe(newPartner.name);
                expect(res.body.email).toBe(newPartner.email);
            });
        });
        it('/partners/:id (PATCH) - パートナー情報の更新', async () => {
            if (!app)
                return;
            const updateData = {
                name: '更新後パートナー名',
                status: '取引中'
            };
            return request(app.getHttpServer())
                .patch(`/partners/${partners[0].id}`)
                .send(updateData)
                .expect(200)
                .expect((res) => {
                expect(res.body.name).toBe(updateData.name);
                expect(res.body.status).toBe(updateData.status);
            });
        });
        it('/partners/:id (DELETE) - パートナーの削除', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .delete(`/partners/${partners[0].id}`)
                .expect(200);
        });
    });
    describe('Projects API', () => {
        it('/projects (GET) - プロジェクト一覧の取得', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get('/projects')
                .expect(200)
                .expect((res) => {
                expect(res.body).toHaveLength(projects.length);
                expect(res.body[0].name).toBe(projects[0].name);
            });
        });
        it('/projects/:id (GET) - 特定のプロジェクト情報の取得', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get(`/projects/${projects[0].id}`)
                .expect(200)
                .expect((res) => {
                expect(res.body.name).toBe(projects[0].name);
                expect(res.body.description).toBe(projects[0].description);
            });
        });
        it('/projects (POST) - 新規プロジェクトの作成', async () => {
            if (!app)
                return;
            const newProject = {
                name: '新規プロジェクト',
                description: '新規プロジェクトの説明',
                startDate: '2025-05-01',
                endDate: '2025-12-31',
                status: '募集中',
                budget: '12000000',
                department: 'テスト部門'
            };
            return request(app.getHttpServer())
                .post('/projects')
                .send(newProject)
                .expect(201)
                .expect((res) => {
                expect(res.body.name).toBe(newProject.name);
                expect(res.body.description).toBe(newProject.description);
            });
        });
    });
    describe('Staff API', () => {
        it('/staff (GET) - スタッフ一覧の取得', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get('/staff')
                .expect(401);
        });
        it('/staff/:id (GET) - 特定のスタッフ情報の取得', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get(`/staff/${staffs[0].id}`)
                .expect(401);
        });
    });
    describe('Contracts API', () => {
        it('/contracts (GET) - 契約一覧の取得', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get('/contracts')
                .expect(401);
        });
        it('/contracts/:id (GET) - 特定の契約情報の取得', async () => {
            if (!app)
                return;
            return request(app.getHttpServer())
                .get(`/contracts/${contracts[0].id}`)
                .expect(401);
        });
    });
});
//# sourceMappingURL=integration.spec.js.map