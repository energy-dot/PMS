import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { WorkflowsService } from './workflows.service';
import { RequestHistory } from '../../entities/request-history.entity';
import { CreateRequestHistoryDto } from '../../dto/workflows/create-request-history.dto';
import { UpdateRequestHistoryDto } from '../../dto/workflows/update-request-history.dto';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  // 申請履歴関連のエンドポイント
  @Get('request-histories')
  findAllRequestHistories(): Promise<RequestHistory[]> {
    return this.workflowsService.findAllRequestHistories();
  }

  @Get('request-histories/:id')
  findRequestHistoryById(@Param('id') id: string): Promise<RequestHistory> {
    return this.workflowsService.findRequestHistoryById(id);
  }

  @Get('request-histories/project/:projectId')
  findRequestHistoriesByProjectId(@Param('projectId') projectId: string): Promise<RequestHistory[]> {
    return this.workflowsService.findRequestHistoriesByProjectId(projectId);
  }

  @Get('request-histories/requester/:requesterId')
  findRequestHistoriesByRequesterId(@Param('requesterId') requesterId: string): Promise<RequestHistory[]> {
    return this.workflowsService.findRequestHistoriesByRequesterId(requesterId);
  }

  @Get('request-histories/status/:requestStatus')
  findRequestHistoriesByStatus(@Param('requestStatus') requestStatus: string): Promise<RequestHistory[]> {
    return this.workflowsService.findRequestHistoriesByStatus(requestStatus);
  }

  @Post('request-histories')
  createRequestHistory(@Body() createRequestHistoryDto: CreateRequestHistoryDto): Promise<RequestHistory> {
    return this.workflowsService.createRequestHistory(createRequestHistoryDto);
  }

  @Patch('request-histories/:id')
  updateRequestHistory(
    @Param('id') id: string,
    @Body() updateRequestHistoryDto: UpdateRequestHistoryDto,
  ): Promise<RequestHistory> {
    return this.workflowsService.updateRequestHistory(id, updateRequestHistoryDto);
  }

  @Delete('request-histories/:id')
  removeRequestHistory(@Param('id') id: string): Promise<void> {
    return this.workflowsService.removeRequestHistory(id);
  }

  // プロジェクト承認関連のエンドポイント
  @Post('projects/:projectId/request-approval')
  requestProjectApproval(
    @Param('projectId') projectId: string,
    @Body() body: { requesterId: string; remarks?: string },
  ): Promise<RequestHistory> {
    return this.workflowsService.requestProjectApproval(projectId, body.requesterId, body.remarks);
  }

  @Post('request-histories/:id/approve')
  approveProject(
    @Param('id') id: string,
    @Body() body: { approverId: string; remarks?: string },
  ): Promise<RequestHistory> {
    return this.workflowsService.approveProject(id, body.approverId, body.remarks);
  }

  @Post('request-histories/:id/reject')
  rejectProject(
    @Param('id') id: string,
    @Body() body: { approverId: string; rejectionReason: string },
  ): Promise<RequestHistory> {
    return this.workflowsService.rejectProject(id, body.approverId, body.rejectionReason);
  }

  @Get('pending-approvals')
  getPendingApprovals(): Promise<RequestHistory[]> {
    return this.workflowsService.getPendingApprovals();
  }
}
