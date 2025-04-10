import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Query } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from '../../dto/sections/create-section.dto';
import { UpdateSectionDto } from '../../dto/sections/update-section.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('sections')
@UseGuards(JwtAuthGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Get()
  @Public()
  findAll(@Query('departmentId') departmentId?: string) {
    if (departmentId) {
      return this.sectionsService.findByDepartment(departmentId);
    }
    return this.sectionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const section = await this.sectionsService.findOne(id);
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(id);
  }
}
