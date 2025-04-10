import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationsService } from '../../src/modules/evaluations/evaluations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Evaluation } from '../../src/entities/evaluation.entity';
import { EvaluationSkill } from '../../src/entities/evaluation-skill.entity';

describe('EvaluationsService', () => {
  let service: EvaluationsService;
  let mockEvaluationsRepository;
  let mockEvaluationSkillsRepository;

  const mockEvaluations = [
    {
      id: '1',
      staffId: 'staff1',
      projectId: 'project1',
      evaluatorId: 'user1',
      evaluationDate: new Date('2025-01-15'),
      overallRating: 4,
      strengths: '技術力が高い、コミュニケーション能力が優れている',
      weaknesses: '納期管理にやや課題あり',
      comments: 'テスト評価1',
      createdAt: new Date(),
      updatedAt: new Date(),
      staff: { id: 'staff1', fullName: 'テスト要員1' },
      project: { id: 'project1', name: 'テストプロジェクト1' },
      evaluator: { id: 'user1', fullName: 'テスト評価者1' },
      evaluationSkills: [],
    },
    {
      id: '2',
      staffId: 'staff2',
      projectId: 'project2',
      evaluatorId: 'user2',
      evaluationDate: new Date('2025-02-10'),
      overallRating: 3,
      strengths: '業務知識が豊富、チームワークに優れている',
      weaknesses: '技術的なスキルアップが必要',
      comments: 'テスト評価2',
      createdAt: new Date(),
      updatedAt: new Date(),
      staff: { id: 'staff2', fullName: 'テスト要員2' },
      project: { id: 'project2', name: 'テストプロジェクト2' },
      evaluator: { id: 'user2', fullName: 'テスト評価者2' },
      evaluationSkills: [],
    },
  ];

  const mockEvaluationSkills = [
    {
      id: '1',
      evaluationId: '1',
      category: '技術スキル',
      skillName: 'Java',
      score: 4,
      comments: '実務経験が豊富',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      evaluationId: '1',
      category: 'ソフトスキル',
      skillName: 'コミュニケーション',
      score: 5,
      comments: 'チーム内外とのコミュニケーションが優れている',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      evaluationId: '2',
      category: '技術スキル',
      skillName: 'JavaScript',
      score: 3,
      comments: '基本的な知識はあるが、応用力に課題あり',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockEvaluationsRepository = {
      find: jest.fn().mockResolvedValue(mockEvaluations),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const evaluation = mockEvaluations.find(e => e.id === where.id);
        return Promise.resolve(evaluation);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(evaluation => {
        if (!evaluation.id) {
          evaluation.id = String(Date.now());
        }
        return Promise.resolve(evaluation);
      }),
      merge: jest.fn().mockImplementation((evaluation, dto) => ({ ...evaluation, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    mockEvaluationSkillsRepository = {
      find: jest.fn().mockImplementation(({ where }) => {
        const skills = mockEvaluationSkills.filter(s => s.evaluationId === where.evaluationId);
        return Promise.resolve(skills);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(skill => {
        if (!skill.id) {
          skill.id = String(Date.now());
        }
        return Promise.resolve(skill);
      }),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationsService,
        {
          provide: getRepositoryToken(Evaluation),
          useValue: mockEvaluationsRepository,
        },
        {
          provide: getRepositoryToken(EvaluationSkill),
          useValue: mockEvaluationSkillsRepository,
        },
      ],
    }).compile();

    service = module.get<EvaluationsService>(EvaluationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of evaluations', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockEvaluations);
      expect(mockEvaluationsRepository.find).toHaveBeenCalledWith({
        relations: ['staff', 'project', 'evaluator', 'evaluationSkills'],
      });
    });
  });

  describe('findOne', () => {
    it('should return an evaluation by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockEvaluations[0]);
      expect(mockEvaluationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['staff', 'project', 'evaluator', 'evaluationSkills'],
      });
    });

    it('should throw error if evaluation not found', async () => {
      mockEvaluationsRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(
        '評価ID 999 は見つかりませんでした',
      );
    });
  });

  describe('create', () => {
    it('should create a new evaluation', async () => {
      const createEvaluationDto = {
        staffId: 'staff3',
        projectId: 'project3',
        evaluatorId: 'user3',
        evaluationDate: new Date('2025-03-01'),
        overallRating: 4,
        strengths: '新規要員の強み',
        weaknesses: '新規要員の弱み',
        comments: '新規評価コメント',
      };

      const result = await service.create(createEvaluationDto);

      expect(result).toHaveProperty('id');
      expect(result.staffId).toBe(createEvaluationDto.staffId);
      expect(result.projectId).toBe(createEvaluationDto.projectId);
      expect(result.evaluatorId).toBe(createEvaluationDto.evaluatorId);
      expect(result.evaluationDate).toEqual(createEvaluationDto.evaluationDate);
      expect(result.overallRating).toBe(createEvaluationDto.overallRating);
      expect(result.strengths).toBe(createEvaluationDto.strengths);
      expect(result.weaknesses).toBe(createEvaluationDto.weaknesses);
      expect(result.comments).toBe(createEvaluationDto.comments);

      expect(mockEvaluationsRepository.create).toHaveBeenCalledWith(createEvaluationDto);
      expect(mockEvaluationsRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing evaluation', async () => {
      const updateEvaluationDto = {
        overallRating: 5,
        comments: '更新評価コメント',
      };

      const result = await service.update('1', updateEvaluationDto);

      expect(result.id).toBe('1');
      expect(result.overallRating).toBe(5);
      expect(result.comments).toBe('更新評価コメント');
      expect(mockEvaluationsRepository.merge).toHaveBeenCalled();
      expect(mockEvaluationsRepository.save).toHaveBeenCalled();
    });

    it('should throw error if evaluation not found', async () => {
      mockEvaluationsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('999', { comments: 'テスト' })).rejects.toThrow(
        '評価ID 999 は見つかりませんでした',
      );
    });
  });

  describe('remove', () => {
    it('should remove an evaluation', async () => {
      await service.remove('1');
      expect(mockEvaluationsRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if evaluation not found', async () => {
      mockEvaluationsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('999')).rejects.toThrow(
        '評価ID 999 は見つかりませんでした',
      );
    });
  });

  describe('findByStaff', () => {
    it('should return evaluations filtered by staff', async () => {
      mockEvaluationsRepository.find.mockResolvedValueOnce([mockEvaluations[0]]);
      
      const result = await service.findByStaff('staff1');
      
      expect(result).toEqual([mockEvaluations[0]]);
      expect(mockEvaluationsRepository.find).toHaveBeenCalledWith({
        where: { staffId: 'staff1' },
        relations: ['staff', 'project', 'evaluator', 'evaluationSkills'],
      });
    });
  });

  describe('findByProject', () => {
    it('should return evaluations filtered by project', async () => {
      mockEvaluationsRepository.find.mockResolvedValueOnce([mockEvaluations[0]]);
      
      const result = await service.findByProject('project1');
      
      expect(result).toEqual([mockEvaluations[0]]);
      expect(mockEvaluationsRepository.find).toHaveBeenCalledWith({
        where: { projectId: 'project1' },
        relations: ['staff', 'project', 'evaluator', 'evaluationSkills'],
      });
    });
  });

  describe('addSkill', () => {
    it('should add a skill to an evaluation', async () => {
      const createSkillDto = {
        evaluationId: '1',
        category: '技術スキル',
        skillName: 'Spring',
        score: 4,
        comments: '新規スキル評価',
      };

      const mockSavedSkill = {
        id: '4',
        ...createSkillDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEvaluationSkillsRepository.save.mockResolvedValueOnce(mockSavedSkill);

      const result = await service.addSkill(createSkillDto);

      expect(result).toEqual(mockSavedSkill);
      expect(mockEvaluationSkillsRepository.create).toHaveBeenCalledWith(createSkillDto);
      expect(mockEvaluationSkillsRepository.save).toHaveBeenCalled();
    });
  });

  describe('getSkills', () => {
    it('should return skills for an evaluation', async () => {
      const result = await service.getSkills('1');
      
      expect(result).toEqual([mockEvaluationSkills[0], mockEvaluationSkills[1]]);
      expect(mockEvaluationSkillsRepository.find).toHaveBeenCalledWith({
        where: { evaluationId: '1' },
      });
    });
  });

  describe('removeSkill', () => {
    it('should remove a skill from an evaluation', async () => {
      await service.removeSkill('1');
      expect(mockEvaluationSkillsRepository.remove).toHaveBeenCalled();
    });
  });
});
