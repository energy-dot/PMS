import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from '../../src/modules/applications/applications.service';
import { EvaluationsService } from '../../src/modules/evaluations/evaluations.service';
import { StaffService } from '../../src/modules/staff/staff.service';
import { ProjectsService } from '../../src/modules/projects/projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from '../../src/entities/application.entity';
import { Evaluation } from '../../src/entities/evaluation.entity';
import { EvaluationSkill } from '../../src/entities/evaluation-skill.entity';
import { Staff } from '../../src/entities/staff.entity';
import { Project } from '../../src/entities/project.entity';
import { InterviewRecord } from '../../src/entities/interview-record.entity';
import { Repository } from 'typeorm';

describe('Application Evaluation Integration', () => {
  let applicationsService: ApplicationsService;
  let evaluationsService: EvaluationsService;
  let staffService: StaffService;
  let projectsService: ProjectsService;
  let mockApplicationRepository: Partial<Repository<Application>>;
  let mockEvaluationRepository: Partial<Repository<Evaluation>>;
  let mockEvaluationSkillRepository: Partial<Repository<EvaluationSkill>>;
  let mockStaffRepository: Partial<Repository<Staff>>;
  let mockProjectRepository: Partial<Repository<Project>>;
  let mockInterviewRecordRepository: Partial<Repository<InterviewRecord>>;

  const mockProjects = [
    {
      id: 'project1',
      name: 'テストプロジェクト',
      description: 'テストプロジェクトの説明',
      status: '進行中',
    }
  ];

  const mockStaff = [
    {
      id: 'staff1',
      firstName: '太郎',
      lastName: 'テスト',
      email: 'test.taro@example.com',
      partnerId: 'partner1',
    }
  ];

  const mockApplications = [
    {
      id: 'application1',
      projectId: 'project1',
      staffId: 'staff1',
      status: '応募中',
      applicationDate: new Date('2025-01-01'),
      interviewRecords: [],
    }
  ];

  const mockEvaluations = [
    {
      id: 'evaluation1',
      staffId: 'staff1',
      projectId: 'project1',
      evaluationDate: new Date('2025-03-01'),
      overallRating: 4,
      comments: '良好なパフォーマンス',
      evaluationSkills: [],
    }
  ];

  beforeEach(async () => {
    // モックリポジトリの設定
    mockApplicationRepository = {
      find: jest.fn().mockResolvedValue(mockApplications),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const application = JSON.parse(JSON.stringify(mockApplications.find(a => a.id === where.id)));
        return Promise.resolve(application as Application);
      }),
      save: jest.fn().mockImplementation(application => {
        if (!(application as Application).id) {
          (application as Application).id = 'application2';
        }
        return Promise.resolve(application as Application);
      }),
      create: jest.fn().mockImplementation(dto => dto as Application),
    };

    mockEvaluationRepository = {
      find: jest.fn().mockResolvedValue(mockEvaluations),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const evaluation = JSON.parse(JSON.stringify(mockEvaluations.find(e => e.id === where.id)));
        return Promise.resolve(evaluation as Evaluation);
      }),
      save: jest.fn().mockImplementation(evaluation => {
        if (!(evaluation as Evaluation).id) {
          (evaluation as Evaluation).id = 'evaluation2';
        }
        return Promise.resolve(evaluation as Evaluation);
      }),
      create: jest.fn().mockImplementation(dto => dto as Evaluation),
    };

    mockEvaluationSkillRepository = {
      save: jest.fn().mockImplementation(skill => {
        if (!(skill as EvaluationSkill).id) {
          (skill as EvaluationSkill).id = 'skill1';
        }
        return Promise.resolve(skill as EvaluationSkill);
      }),
      create: jest.fn().mockImplementation(dto => dto as EvaluationSkill),
      find: jest.fn().mockResolvedValue([]),
    };

    mockStaffRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const staff = JSON.parse(JSON.stringify(mockStaff.find(s => s.id === where.id)));
        return Promise.resolve(staff as Staff);
      }),
      save: jest.fn().mockImplementation(staff => Promise.resolve(staff as Staff)),
    };

    mockProjectRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const project = JSON.parse(JSON.stringify(mockProjects.find(p => p.id === where.id)));
        return Promise.resolve(project as Project);
      }),
    };

    mockInterviewRecordRepository = {
      save: jest.fn().mockImplementation(record => {
        if (!(record as InterviewRecord).id) {
          (record as InterviewRecord).id = 'interview1';
        }
        return Promise.resolve(record as InterviewRecord);
      }),
      create: jest.fn().mockImplementation(dto => dto as InterviewRecord),
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        EvaluationsService,
        StaffService,
        ProjectsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepository,
        },
        {
          provide: getRepositoryToken(Evaluation),
          useValue: mockEvaluationRepository,
        },
        {
          provide: getRepositoryToken(EvaluationSkill),
          useValue: mockEvaluationSkillRepository,
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: mockStaffRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
        {
          provide: getRepositoryToken(InterviewRecord),
          useValue: mockInterviewRecordRepository,
        },
      ],
    }).compile();

    applicationsService = module.get<ApplicationsService>(ApplicationsService);
    evaluationsService = module.get<EvaluationsService>(EvaluationsService);
    staffService = module.get<StaffService>(StaffService);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('応募者管理と評価の連携', () => {
    it('応募者が面接を通過して要員になった場合、評価を登録できること', async () => {
      // 応募者の面接記録を追加
      const interviewRecordDto = {
        applicationId: 'application1',
        interviewDate: new Date('2025-02-01'),
        interviewers: ['面接官A', '面接官B'],
        result: '合格',
        feedback: '技術力が高く、コミュニケーション能力も良好',
      };

      // 応募者の面接記録を登録
      await applicationsService.addInterviewRecord('application1', interviewRecordDto);

      // 応募者のステータスを更新（採用）
      await applicationsService.updateStatus('application1', '採用');

      // 要員の評価を登録
      const evaluationDto = {
        staffId: 'staff1',
        projectId: 'project1',
        evaluationDate: new Date('2025-03-01'),
        overallRating: 4,
        comments: '良好なパフォーマンス',
      };

      const skillsDto = [
        {
          skillName: 'Java',
          rating: 4,
          comments: '実務経験あり',
        },
        {
          skillName: 'SQL',
          rating: 3,
          comments: '基本的なクエリは問題なく書ける',
        },
      ];

      // 評価を登録
      const evaluation = await evaluationsService.createEvaluation(evaluationDto);

      // スキル評価を登録
      for (const skillDto of skillsDto) {
        await evaluationsService.addSkillEvaluation(evaluation.id, skillDto);
      }

      // 面接記録が登録されたことを検証
      expect(mockInterviewRecordRepository.save).toHaveBeenCalled();

      // 応募者のステータスが更新されたことを検証
      expect(mockApplicationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'application1',
          status: '採用',
        })
      );

      // 評価が登録されたことを検証
      expect(mockEvaluationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          staffId: 'staff1',
          projectId: 'project1',
          overallRating: 4,
        })
      );

      // スキル評価が登録されたことを検証
      expect(mockEvaluationSkillRepository.save).toHaveBeenCalledTimes(2);
    });

    it('要員の評価履歴を取得できること', async () => {
      // 要員の評価履歴を取得
      const evaluations = await evaluationsService.findEvaluationsByStaffId('staff1');

      // 評価履歴が取得できたことを検証
      expect(mockEvaluationRepository.find).toHaveBeenCalled();
      expect(evaluations).toHaveLength(1);
      expect(evaluations[0].staffId).toBe('staff1');
    });

    it('案件の応募者一覧を取得できること', async () => {
      // 案件の応募者一覧を取得
      const applications = await applicationsService.findApplicationsByProjectId('project1');

      // 応募者一覧が取得できたことを検証
      expect(mockApplicationRepository.find).toHaveBeenCalled();
      expect(applications).toHaveLength(1);
      expect(applications[0].projectId).toBe('project1');
    });

    it('応募者の面接記録を取得できること', async () => {
      // モックの面接記録データ
      const mockInterviewRecords = [
        {
          id: 'interview1',
          applicationId: 'application1',
          interviewDate: new Date('2025-02-01'),
          interviewers: ['面接官A', '面接官B'],
          result: '合格',
          feedback: '技術力が高く、コミュニケーション能力も良好',
        }
      ];

      // 面接記録の取得をモック
      (mockInterviewRecordRepository.find as jest.Mock).mockResolvedValue(mockInterviewRecords);

      // 応募者の面接記録を取得
      const interviewRecords = await applicationsService.getInterviewRecords('application1');

      // 面接記録が取得できたことを検証
      expect(mockInterviewRecordRepository.find).toHaveBeenCalled();
      expect(interviewRecords).toHaveLength(1);
      expect(interviewRecords[0].applicationId).toBe('application1');
    });
  });
});
