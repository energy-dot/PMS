import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { Application } from '../../entities/application.entity';
import { InterviewRecord } from '../../entities/interview-record.entity';
import { CreateApplicationDto } from '../../dto/applications/create-application.dto';
import { UpdateApplicationDto } from '../../dto/applications/update-application.dto';
import { CreateInterviewRecordDto } from '../../dto/applications/create-interview-record.dto';
import { UpdateInterviewRecordDto } from '../../dto/applications/update-interview-record.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // 応募者関連のエンドポイント
  @Get()
  findAllApplications(): Promise<Application[]> {
    return this.applicationsService.findAllApplications();
  }

  @Get(':id')
  findApplicationById(@Param('id') id: string): Promise<Application> {
    return this.applicationsService.findApplicationById(id);
  }

  @Get('project/:projectId')
  findApplicationsByProjectId(@Param('projectId') projectId: string): Promise<Application[]> {
    return this.applicationsService.findApplicationsByProjectId(projectId);
  }

  @Get('partner/:partnerId')
  findApplicationsByPartnerId(@Param('partnerId') partnerId: string): Promise<Application[]> {
    return this.applicationsService.findApplicationsByPartnerId(partnerId);
  }

  @Get('status/:status')
  findApplicationsByStatus(@Param('status') status: string): Promise<Application[]> {
    return this.applicationsService.findApplicationsByStatus(status);
  }

  @Post()
  createApplication(@Body() createApplicationDto: CreateApplicationDto): Promise<Application> {
    return this.applicationsService.createApplication(createApplicationDto);
  }

  @Patch(':id')
  updateApplication(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.updateApplication(id, updateApplicationDto);
  }

  @Delete(':id')
  removeApplication(@Param('id') id: string): Promise<void> {
    return this.applicationsService.removeApplication(id);
  }

  // 面談記録関連のエンドポイント
  @Get('interview-records')
  findAllInterviewRecords(): Promise<InterviewRecord[]> {
    return this.applicationsService.findAllInterviewRecords();
  }

  @Get('interview-records/:id')
  findInterviewRecordById(@Param('id') id: string): Promise<InterviewRecord> {
    return this.applicationsService.findInterviewRecordById(id);
  }

  @Get(':applicationId/interview-records')
  findInterviewRecordsByApplicationId(
    @Param('applicationId') applicationId: string,
  ): Promise<InterviewRecord[]> {
    return this.applicationsService.findInterviewRecordsByApplicationId(applicationId);
  }

  @Post('interview-records')
  createInterviewRecord(
    @Body() createInterviewRecordDto: CreateInterviewRecordDto,
  ): Promise<InterviewRecord> {
    return this.applicationsService.createInterviewRecord(createInterviewRecordDto);
  }

  @Patch('interview-records/:id')
  updateInterviewRecord(
    @Param('id') id: string,
    @Body() updateInterviewRecordDto: UpdateInterviewRecordDto,
  ): Promise<InterviewRecord> {
    return this.applicationsService.updateInterviewRecord(id, updateInterviewRecordDto);
  }

  @Delete('interview-records/:id')
  removeInterviewRecord(@Param('id') id: string): Promise<void> {
    return this.applicationsService.removeInterviewRecord(id);
  }
}
