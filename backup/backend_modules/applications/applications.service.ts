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
  // コントローラーとの互換性のためのエイリアス
  async findAllApplications(): Promise<Application[]> {
    return this.findAll();
  }

  async findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });
  }

  async findApplicationById(id: string): Promise<Application> {
    return this.findOne(id);
  }

  async findOne(id: string): Promise<Application> {
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
    return this.findByProject(projectId);
  }

  async findByProject(projectId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { projectId },
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });
  }

  async findApplicationsByPartnerId(partnerId: string): Promise<Application[]> {
    return this.findByStaff(partnerId);
  }

  async findByStaff(partnerId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { partnerId },
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });
  }

  async findApplicationsByStatus(status: string): Promise<Application[]> {
    return this.findByStatus(status);
  }

  async findByStatus(status: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { status },
      relations: ['project', 'partner', 'contactPerson', 'documentScreener', 'interviewRecords'],
    });
  }

  async createApplication(createApplicationDto: CreateApplicationDto): Promise<Application> {
    return this.create(createApplicationDto);
  }

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    // Create a properly typed object that matches the entity structure
    const applicationData: Partial<Application> = {
      ...createApplicationDto,
      applicationDate: new Date(createApplicationDto.applicationDate),
      finalResultNotificationDate: createApplicationDto.finalResultNotificationDate
        ? new Date(createApplicationDto.finalResultNotificationDate)
        : undefined,
    };

    const newApplication = this.applicationsRepository.create(applicationData);
    return this.applicationsRepository.save(newApplication);
  }

  async updateApplication(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.update(id, updateApplicationDto);
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findOne(id);

    // 日付フィールドの変換
    if (updateApplicationDto.applicationDate) {
      updateApplicationDto.applicationDate = new Date(updateApplicationDto.applicationDate) as any;
    }

    if (updateApplicationDto.finalResultNotificationDate) {
      updateApplicationDto.finalResultNotificationDate = new Date(
        updateApplicationDto.finalResultNotificationDate,
      ) as any;
    }

    // 更新対象のエンティティをマージ
    const updatedApplication = this.applicationsRepository.merge(application, updateApplicationDto);

    return this.applicationsRepository.save(updatedApplication);
  }

  async removeApplication(id: string): Promise<void> {
    return this.remove(id);
  }

  async remove(id: string): Promise<void> {
    const application = await this.findOne(id);
    await this.applicationsRepository.remove(application);
  }

  // 面談記録関連のメソッド
  async getInterviewRecords(applicationId: string): Promise<InterviewRecord[]> {
    return this.interviewRecordsRepository.find({
      where: { applicationId },
      relations: ['application', 'interviewer'],
    });
  }

  // 以下のメソッドはエイリアスまたは内部使用
  async addInterviewRecord(
    applicationId: string,
    createInterviewRecordDto: CreateInterviewRecordDto,
  ): Promise<InterviewRecord> {
    // 既存のcreateInterviewRecordメソッドを活用
    return this.createInterviewRecord({
      ...createInterviewRecordDto,
      applicationId: applicationId,
    });
  }

  async updateStatus(applicationId: string, status: string): Promise<Application> {
    const application = await this.findOne(applicationId);
    application.status = status;
    return this.applicationsRepository.save(application);
  }

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

  async createInterviewRecord(
    createInterviewRecordDto: CreateInterviewRecordDto,
  ): Promise<InterviewRecord> {
    // 関連する応募者が存在するか確認
    const application = await this.applicationsRepository.findOne({
      where: { id: createInterviewRecordDto.applicationId },
    });

    if (!application) {
      throw new BadRequestException(
        `応募ID ${createInterviewRecordDto.applicationId} は存在しません`,
      );
    }

    const newInterviewRecord = this.interviewRecordsRepository.create({
      ...createInterviewRecordDto,
      interviewDate: new Date(createInterviewRecordDto.interviewDate),
    });

    return this.interviewRecordsRepository.save(newInterviewRecord);
  }

  async updateInterviewRecord(
    id: string,
    updateInterviewRecordDto: UpdateInterviewRecordDto,
  ): Promise<InterviewRecord> {
    const interviewRecord = await this.findInterviewRecordById(id);

    // 日付フィールドの変換
    if (updateInterviewRecordDto.interviewDate) {
      updateInterviewRecordDto.interviewDate = new Date(
        updateInterviewRecordDto.interviewDate,
      ) as any;
    }

    // 更新対象のエンティティをマージ
    const updatedInterviewRecord = this.interviewRecordsRepository.merge(
      interviewRecord,
      updateInterviewRecordDto,
    );

    return this.interviewRecordsRepository.save(updatedInterviewRecord);
  }

  async removeInterviewRecord(id: string): Promise<void> {
    const interviewRecord = await this.findInterviewRecordById(id);
    await this.interviewRecordsRepository.remove(interviewRecord);
  }
}
