import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/modules/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository;

  const mockUsers = [
    {
      id: '1',
      username: 'testuser1',
      password: 'hashedpassword1',
      fullName: 'Test User 1',
      role: 'user',
      department: 'IT',
      email: 'test1@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      username: 'testuser2',
      password: 'hashedpassword2',
      fullName: 'Test User 2',
      role: 'admin',
      department: 'HR',
      email: 'test2@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockUsersRepository = {
      find: jest.fn().mockResolvedValue(mockUsers),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const user = mockUsers.find(u => u.id === where.id || u.username === where.username);
        return Promise.resolve(user);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(user => {
        if (!user.id) {
          user.id = String(Date.now());
        }
        return Promise.resolve(user);
      }),
      merge: jest.fn().mockImplementation((user, dto) => ({ ...user, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    
    // モックbcrypt
    jest.spyOn(bcrypt, 'hash').mockImplementation((password, salt) => {
      return Promise.resolve(`hashed_${password}`);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUsersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const result = await service.findById('1');
      expect(result).toEqual(mockUsers[0]);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.findById('999');
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const result = await service.findByUsername('testuser1');
      expect(result).toEqual(mockUsers[0]);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser1' } });
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.findByUsername('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'password123',
        fullName: 'New User',
        role: 'user',
        department: 'Sales',
        email: 'new@example.com',
      };

      const result = await service.create(createUserDto);

      expect(result).toHaveProperty('id');
      expect(result.username).toBe(createUserDto.username);
      expect(result.password).toBe('hashed_password123');
      expect(result.fullName).toBe(createUserDto.fullName);
      expect(result.role).toBe(createUserDto.role);
      expect(result.department).toBe(createUserDto.department);
      expect(result.email).toBe(createUserDto.email);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto = {
        fullName: 'Updated Name',
        email: 'updated@example.com',
      };

      const result = await service.update('1', updateUserDto);

      expect(result.id).toBe('1');
      expect(result.fullName).toBe('Updated Name');
      expect(result.email).toBe('updated@example.com');
      expect(mockUsersRepository.merge).toHaveBeenCalled();
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });

    it('should hash password if provided in update', async () => {
      const updateUserDto = {
        password: 'newpassword',
      };

      await service.update('1', updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    });

    it('should throw error if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('999', { fullName: 'Test' })).rejects.toThrow(
        'ユーザーID 999 は見つかりませんでした',
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      await service.remove('1');
      expect(mockUsersRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('999')).rejects.toThrow(
        'ユーザーID 999 は見つかりませんでした',
      );
    });
  });
});
