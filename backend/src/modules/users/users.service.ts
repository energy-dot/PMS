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

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  
  // コントローラーで使用されているメソッド
  async findOne(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`ユーザーID ${id} は見つかりませんでした`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = new User();
    user.id = uuidv4();
    user.username = createUserDto.username;
    user.password = hashedPassword;
    user.fullName = createUserDto.fullName;
    user.role = createUserDto.role;
    user.department = createUserDto.department || '';
    user.email = createUserDto.email || '';
    
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error(`ユーザーID ${id} は見つかりませんでした`);
    }
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error(`ユーザーID ${id} は見つかりませんでした`);
    }
    
    await this.usersRepository.remove(user);
  }
  
  // アクティブ状態の切り替え
  async toggleStatus(id: string, isActive: boolean): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = isActive;
    return this.usersRepository.save(user);
  }
  
  // パスワード変更
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.findOne(userId);
    
    // 古いパスワードを検証
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('現在のパスワードが正しくありません');
    }
    
    // 新しいパスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    return this.usersRepository.save(user);
  }
}
