import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from '../../dto/staff/create-staff.dto';
import { UpdateStaffDto } from '../../dto/staff/update-staff.dto';
import { SearchStaffDto } from '../../dto/staff/search-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get('search')
  search(@Query() searchStaffDto: SearchStaffDto) {
    return this.staffService.search(searchStaffDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
