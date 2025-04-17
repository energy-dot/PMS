import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from '../../dto/projects/create-project.dto';
import { UpdateProjectDto } from '../../dto/projects/update-project.dto';
import { SearchProjectsDto } from '../../dto/projects/search-projects.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
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
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Request() req: any, @Body('approverId') approverId?: string) {
    // 認証なしの場合はリクエストボディからユーザーIDを取得
    const approverIdToUse = req.user?.id || approverId || 'admin';
    return this.projectsService.approve(id, approverIdToUse);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.projectsService.reject(id, reason);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.projectsService.updateStatus(id, status);
  }

  @Post(':id/assign-staff')
  assignStaff(@Param('id') id: string, @Body('staffIds') staffIds: string[]) {
    return this.projectsService.assignStaff(id, staffIds);
  }

  @Delete(':id/staff/:staffId')
  removeStaff(@Param('id') id: string, @Param('staffId') staffId: string) {
    return this.projectsService.removeStaff(id, staffId);
  }
}
