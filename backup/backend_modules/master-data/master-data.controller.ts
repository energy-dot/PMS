import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import { CreateMasterDataDto } from '../../dto/master-data/create-master-data.dto';
import { UpdateMasterDataDto } from '../../dto/master-data/update-master-data.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('master-data')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get('types')
  async getMasterDataTypes() {
    return this.masterDataService.getMasterDataTypes();
  }

  @Post('types')
  @Roles('admin')
  async createMasterDataType(@Body() body: { type: string }) {
    return this.masterDataService.createMasterDataType(body.type);
  }

  @Get('type/:type')
  async getMasterDataByType(@Param('type') type: string) {
    return this.masterDataService.findByType(type);
  }

  @Post()
  @Roles('admin')
  async create(@Body() createMasterDataDto: CreateMasterDataDto) {
    return this.masterDataService.create(createMasterDataDto);
  }

  @Get()
  async findAll() {
    return this.masterDataService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.masterDataService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateMasterDataDto: UpdateMasterDataDto) {
    return this.masterDataService.update(id, updateMasterDataDto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.masterDataService.remove(id);
  }
}
