import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { username } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    
    return null;
  }
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName, // 修正: full_name → fullName
        role: user.role,
      },
    };
  }
}
