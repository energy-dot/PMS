import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { UpdateUserDto } from '../../dto/users/update-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const user = new User();
    user.id = uuidv4();
    user.username = createUserDto.username;
    user.fullName = createUserDto.fullName;
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.role = createUserDto.role;
    user.department = createUserDto.department;
    user.isActive = createUserDto.isActive !== undefined ? createUserDto.isActive : true;
    
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }
    
    if (updateUserDto.fullName !== undefined) {
      user.fullName = updateUserDto.fullName;
    }
    
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    
    if (updateUserDto.password !== undefined) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }
    
    if (updateUserDto.department !== undefined) {
      user.department = updateUserDto.department;
    }
    
    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive;
    }
    
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async toggleStatus(id: string, isActive: boolean): Promise<User> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    user.isActive = isActive;
    
    return this.usersRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    
    return null;
  }

  async updateLastLogin(id: string): Promise<User> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    user.lastLogin = new Date();
    
    return this.usersRepository.save(user);
  }

  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    
    if (!isPasswordValid) {
      throw new Error('現在のパスワードが正しくありません');
    }
    
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    
    await this.usersRepository.save(user);
    
    return true;
  }
}
