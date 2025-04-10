import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { InterviewRecord } from '../../entities/interview-record.entity';
import { CreateApplicationDto } from '../../dto/applications/create-application.dto';
import { UpdateApplicationDto } from '../../dto/applications/update-application.dto';
import { CreateInterviewRecordDto } from '../../dto/applications/create-interview-record.dto';
import { UpdateInterviewRecordDto } from '../../dto/applications/update-interview-record.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(InterviewRecord)
    private interviewRecordsRepository: Repository<InterviewRecord>,
  ) {}

  // 応募者関連のメソッド
  async findAllApplications(): Promise<Application[]> {
    return this.applicationsRepository.find({
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });
  }

  async findApplicationById(id: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });

    if (!application) {
      throw new NotFoundException(`応募ID ${id} は見つかりませんでした`);
    }

    return application;
  }

  async findApplicationsByProjectId(projectId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { projectId },
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });
  }

  async findApplicationsByPartnerId(partnerId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { partnerId },
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });
  }

  async findApplicationsByStatus(status: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { status },
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });
  }

  async createApplication(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const newApplication = this.applicationsRepository.create({
      ...createApplicationDto,
      applicationDate: new Date(createApplicationDto.applicationDate),
      finalResultNotificationDate: createApplicationDto.finalResultNotificationDate 
        ? new Date(createApplicationDto.finalResultNotificationDate) 
        : null,
    });

    return this.applicationsRepository.save(newApplication);
  }

  async updateApplication(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findApplicationById(id);

    // 日付フィールドの変換
    if (updateApplicationDto.applicationDate) {
      updateApplicationDto.applicationDate = new Date(updateApplicationDto.applicationDate) as any;
    }
    
    if (updateApplicationDto.finalResultNotificationDate) {
      updateApplicationDto.finalResultNotificationDate = new Date(updateApplicationDto.finalResultNotificationDate) as any;
    }

    // 更新対象のエンティティをマージ
    const updatedApplication = this.applicationsRepository.merge(application, updateApplicationDto);
    
    return this.applicationsRepository.save(updatedApplication);
  }

  async removeApplication(id: string): Promise<void> {
    const application = await this.findApplicationById(id);
    await this.applicationsRepository.remove(application);
  }

  // 面談記録関連のメソッド
  async findAllInterviewRecords(): Promise<InterviewRecord[]> {
    return this.interviewRecordsRepository.find({
      relations: ['application', 'interviewer'],
    });
  }

  async findInterviewRecordById(id: string): Promise<InterviewRecord> {
    const interviewRecord = await this.interviewRecordsRepository.findOne({
      where: { id },
      relations: ['application', 'interviewer'],
    });

    if (!interviewRecord) {
      throw new NotFoundException(`面談記録ID ${id} は見つかりませんでした`);
    }

    return interviewRecord;
  }

  async findInterviewRecordsByApplicationId(applicationId: string): Promise<InterviewRecord[]> {
    return this.interviewRecordsRepository.find({
      where: { applicationId },
      relations: ['application', 'interviewer'],
    });
  }

  async createInterviewRecord(createInterviewRecordDto: CreateInterviewRecordDto): Promise<InterviewRecord> {
    // 関連する応募者が存在するか確認
    const application = await this.applicationsRepository.findOne({
      where: { id: createInterviewRecordDto.applicationId },
    });

    if (!application) {
      throw new BadRequestException(`応募ID ${createInterviewRecordDto.applicationId} は存在しません`);
    }

    const newInterviewRecord = this.interviewRecordsRepository.create({
      ...createInterviewRecordDto,
      interviewDate: new Date(createInterviewRecordDto.interviewDate),
    });

    return this.interviewRecordsRepository.save(newInterviewRecord);
  }

  async updateInterviewRecord(id: string, updateInterviewRecordDto: UpdateInterviewRecordDto): Promise<InterviewRecord> {
    const interviewRecord = await this.findInterviewRecordById(id);

    // 日付フィールドの変換
    if (updateInterviewRecordDto.interviewDate) {
      updateInterviewRecordDto.interviewDate = new Date(updateInterviewRecordDto.interviewDate) as any;
    }

    // 更新対象のエンティティをマージ
    const updatedInterviewRecord = this.interviewRecordsRepository.merge(interviewRecord, updateInterviewRecordDto);
    
    return this.interviewRecordsRepository.save(updatedInterviewRecord);
  }

  async removeInterviewRecord(id: string): Promise<void> {
    const interviewRecord = await this.findInterviewRecordById(id);
    await this.interviewRecordsRepository.remove(interviewRecord);
  }
}
