import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from '../../dto/projects/create-project.dto';
import { UpdateProjectDto } from '../../dto/projects/update-project.dto';
import { SearchProjectsDto } from '../../dto/projects/search-projects.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('admin', 'partner_manager', 'developer')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('search')
  search(@Query() searchProjectsDto: SearchProjectsDto) {
    return this.projectsService.search(searchProjectsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'partner_manager', 'developer')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/approve')
  @Roles('admin', 'partner_manager')
  approve(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.approve(id, req.user.id);
  }

  @Post(':id/reject')
  @Roles('admin', 'partner_manager')
  reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.projectsService.reject(id, reason);
  }

  @Patch(':id/status')
  @Roles('admin', 'partner_manager')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.projectsService.updateStatus(id, status);
  }
}
