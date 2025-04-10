import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UsersService } from '../../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService;
  let mockJwtService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
    fullName: 'Test User',
    role: 'user',
    department: 'IT',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    mockUsersService = {
      findByUsername: jest.fn().mockImplementation(username => {
        if (username === 'testuser') {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      }),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('test-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    
    // モックbcrypt
    jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash) => {
      return Promise.resolve(password === 'correctpassword');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const result = await service.validateUser('testuser', 'correctpassword');
      
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        fullName: mockUser.fullName,
        role: mockUser.role,
        department: mockUser.department,
        email: mockUser.email,
      });
      
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
    });

    it('should return null when user does not exist', async () => {
      const result = await service.validateUser('nonexistentuser', 'password');
      
      expect(result).toBeNull();
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('nonexistentuser');
    });

    it('should return null when password is incorrect', async () => {
      const result = await service.validateUser('testuser', 'wrongpassword');
      
      expect(result).toBeNull();
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    });
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const user = {
        id: mockUser.id,
        username: mockUser.username,
        fullName: mockUser.fullName,
        role: mockUser.role,
      };
      
      const result = await service.login(user);
      
      expect(result).toEqual({ access_token: 'test-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
        role: user.role,
      });
    });
  });
});
