import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { UpdateUserDto } from '../../dto/users/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.usersService.search(query);
  }

  @Get('me')
  getProfile(@Request() req: any) {
    // 認証なしの場合はダミーユーザーIDを使用
    const userId = req.user?.id || 'admin';
    return this.usersService.findOne(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.toggleStatus(id, isActive);
  }

  @Post('change-password')
  changePassword(
    @Request() req: any,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('userId') userId?: string,
  ) {
    // 認証なしの場合はリクエストボディからユーザーIDを取得
    const userIdToUse = req.user?.id || userId || 'admin';
    return this.usersService.changePassword(userIdToUse, oldPassword, newPassword);
  }
}
