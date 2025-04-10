import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestHistory } from '../../entities/request-history.entity';
import { Project } from '../../entities/project.entity';
import { CreateRequestHistoryDto } from '../../dto/workflows/create-request-history.dto';
import { UpdateRequestHistoryDto } from '../../dto/workflows/update-request-history.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(RequestHistory)
    private requestHistoriesRepository: Repository<RequestHistory>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  // 申請履歴関連のメソッド
  async findAllRequestHistories(): Promise<RequestHistory[]> {
    return this.requestHistoriesRepository.find({
      relations: ['project', 'requester', 'approver'],
    });
  }

  async findRequestHistoryById(id: string): Promise<RequestHistory> {
    const requestHistory = await this.requestHistoriesRepository.findOne({
      where: { id },
      relations: ['project', 'requester', 'approver'],
    });

    if (!requestHistory) {
      throw new NotFoundException(`申請履歴ID ${id} は見つかりませんでした`);
    }

    return requestHistory;
  }

  async findRequestHistoriesByProjectId(projectId: string): Promise<RequestHistory[]> {
    return this.requestHistoriesRepository.find({
      where: { projectId },
      relations: ['project', 'requester', 'approver'],
    });
  }

  async findRequestHistoriesByRequesterId(requesterId: string): Promise<RequestHistory[]> {
    return this.requestHistoriesRepository.find({
      where: { requesterId },
      relations: ['project', 'requester', 'approver'],
    });
  }

  async findRequestHistoriesByStatus(status: string): Promise<RequestHistory[]> {
    return this.requestHistoriesRepository.find({
      where: { requestStatus: status },
      relations: ['project', 'requester', 'approver'],
    });
  }

  async createRequestHistory(createRequestHistoryDto: CreateRequestHistoryDto): Promise<RequestHistory> {
    // 関連するプロジェクトが存在するか確認
    const project = await this.projectsRepository.findOne({
      where: { id: createRequestHistoryDto.projectId },
    });

    if (!project) {
      throw new BadRequestException(`プロジェクトID ${createRequestHistoryDto.projectId} は存在しません`);
    }

    const newRequestHistory = new RequestHistory();
    Object.assign(newRequestHistory, {
      ...createRequestHistoryDto,
      requestDate: new Date(createRequestHistoryDto.requestDate),
      approvalDate: createRequestHistoryDto.approvalDate 
        ? new Date(createRequestHistoryDto.approvalDate) 
        : null,
    });

    return this.requestHistoriesRepository.save(newRequestHistory);
  }

  async updateRequestHistory(id: string, updateRequestHistoryDto: UpdateRequestHistoryDto): Promise<RequestHistory> {
    const requestHistory = await this.findRequestHistoryById(id);

    // 日付フィールドの変換
    if (updateRequestHistoryDto.requestDate) {
      updateRequestHistoryDto.requestDate = new Date(updateRequestHistoryDto.requestDate) as any;
    }
    
    if (updateRequestHistoryDto.approvalDate) {
      updateRequestHistoryDto.approvalDate = new Date(updateRequestHistoryDto.approvalDate) as any;
    }

    // 更新対象のエンティティをマージ
    const updatedRequestHistory = this.requestHistoriesRepository.merge(requestHistory, updateRequestHistoryDto);
    
    return this.requestHistoriesRepository.save(updatedRequestHistory);
  }

  async removeRequestHistory(id: string): Promise<void> {
    const requestHistory = await this.findRequestHistoryById(id);
    await this.requestHistoriesRepository.remove(requestHistory);
  }

  // プロジェクト承認関連のメソッド
  async requestProjectApproval(projectId: string, requesterId: string, remarks?: string): Promise<RequestHistory> {
    // プロジェクトの存在確認
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`プロジェクトID ${projectId} は存在しません`);
    }

    // プロジェクトのステータスを更新
    project.approvalStatus = '承認待ち';
    await this.projectsRepository.save(project);

    // 申請履歴を作成
    const requestHistory = new RequestHistory();
    Object.assign(requestHistory, {
      projectId,
      requesterId,
      requestType: '案件承認申請',
      requestStatus: '承認待ち',
      requestDate: new Date(),
      remarks,
    });

    return this.requestHistoriesRepository.save(requestHistory);
  }

  async approveProject(requestHistoryId: string, approverId: string, remarks?: string): Promise<RequestHistory> {
    // 申請履歴の存在確認
    const requestHistory = await this.findRequestHistoryById(requestHistoryId);

    if (requestHistory.requestStatus !== '承認待ち') {
      throw new BadRequestException('この申請は既に処理されています');
    }

    // 申請履歴を更新
    requestHistory.requestStatus = '承認済み';
    requestHistory.approverId = approverId;
    requestHistory.approvalDate = new Date();
    requestHistory.remarks = remarks || requestHistory.remarks;

    // プロジェクトのステータスを更新
    const project = await this.projectsRepository.findOne({
      where: { id: requestHistory.projectId },
    });

    if (!project) {
      throw new NotFoundException(`プロジェクトID ${requestHistory.projectId} は存在しません`);
    }

    project.approvalStatus = '承認済み';
    project.approverId = approverId;
    project.approvalDate = new Date();
    await this.projectsRepository.save(project);

    return this.requestHistoriesRepository.save(requestHistory);
  }

  async rejectProject(requestHistoryId: string, approverId: string, rejectionReason: string): Promise<RequestHistory> {
    // 申請履歴の存在確認
    const requestHistory = await this.findRequestHistoryById(requestHistoryId);

    if (requestHistory.requestStatus !== '承認待ち') {
      throw new BadRequestException('この申請は既に処理されています');
    }

    // 申請履歴を更新
    requestHistory.requestStatus = '差戻し';
    requestHistory.approverId = approverId;
    requestHistory.approvalDate = new Date();
    requestHistory.rejectionReason = rejectionReason;

    // プロジェクトのステータスを更新
    const project = await this.projectsRepository.findOne({
      where: { id: requestHistory.projectId },
    });

    if (!project) {
      throw new NotFoundException(`プロジェクトID ${requestHistory.projectId} は存在しません`);
    }

    project.approvalStatus = '差戻し';
    project.approverId = approverId;
    project.approvalDate = new Date();
    project.rejectionReason = rejectionReason;
    await this.projectsRepository.save(project);

    return this.requestHistoriesRepository.save(requestHistory);
  }

  async getPendingApprovals(): Promise<RequestHistory[]> {
    return this.requestHistoriesRepository.find({
      where: { requestStatus: '承認待ち' },
      relations: ['project', 'requester'],
    });
  }
}
