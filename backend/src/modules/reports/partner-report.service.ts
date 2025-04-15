import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '../../entities/partner.entity';
import { Application } from '../../entities/application.entity';
import { Contract } from '../../entities/contract.entity';
import { DateUtilsService } from '../utils/date-utils.service';
import { FilterUtilsService } from '../utils/filter-utils.service';

/**
 * パートナー関連のレポートを生成するサービス
 */
@Injectable()
export class PartnerReportService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    private dateUtilsService: DateUtilsService,
    private filterUtilsService: FilterUtilsService
  ) {}

  /**
   * パートナー別案件数レポートを生成
   */
  async getPartnerProjectsReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const projectWhereCondition: any = {};
    
    const dateFilter = this.dateUtilsService.getDateFilter(startDate, endDate);
    if (dateFilter) {
      projectWhereCondition.createdAt = dateFilter;
    }
    
    const departmentFilter = this.filterUtilsService.getDepartmentFilter(department);
    if (departmentFilter) {
      projectWhereCondition.departmentId = departmentFilter;
    }
    
    // データ取得
    const partners = await this.partnerRepository.find({
      relations: ['staff'],
    });
    
    // パートナー別に集計
    const tableData = await Promise.all(partners.map(async partner => {
      // このパートナーに関連する案件を取得
      const partnerApplications = await this.applicationRepository.find({
        where: {
          partnerId: partner.id
        },
        relations: ['project', 'project.contracts']
      });

      // アプリケーションから関連するプロジェクトを抽出
      const partnerProjects = partnerApplications
        .map(app => app.project)
        .filter((project, index, self) => 
          // 重複を削除
          index === self.findIndex(p => p.id === project.id)
        );
      
      // フィルター条件に合致する案件のみを対象とする
      const filteredProjects = partnerProjects.filter((project: any) => {
        let match = true;
        
        if (dateFilter && project.createdAt) {
          const projectDate = new Date(project.createdAt);
          if (dateFilter.gte && projectDate < dateFilter.gte) match = false;
          if (dateFilter.lte && projectDate > dateFilter.lte) match = false;
        }
        
        if (departmentFilter && project.departmentId !== departmentFilter) {
          match = false;
        }
        
        return match;
      });
      
      // 平均単価の計算
      let totalRate = 0;
      let rateCount = 0;
      
      filteredProjects.forEach((project: any) => {
        if (project.contracts) {
          project.contracts.forEach((contract: any) => {
            if (contract.monthlyRate) {
              totalRate += contract.monthlyRate;
              rateCount++;
            }
          });
        }
      });
      
      const averageRate = rateCount > 0 ? Math.round(totalRate / rateCount) : 0;
      
      return {
        partnerName: partner.name,
        projectCount: filteredProjects.length,
        staffCount: partner.staff?.length || 0,
        averageRate,
      };
    }));
    
    const filteredTableData = tableData.filter(item => item.projectCount > 0);
    
    // チャートデータの作成
    const chartData = {
      labels: filteredTableData.map(item => item.partnerName),
      projectCounts: filteredTableData.map(item => item.projectCount),
      staffCounts: filteredTableData.map(item => item.staffCount),
    };
    
    // サマリーデータの作成
    const totalProjects = filteredTableData.reduce((sum, item) => sum + item.projectCount, 0);
    const totalStaff = filteredTableData.reduce((sum, item) => sum + item.staffCount, 0);
    const totalPartners = filteredTableData.length;
    
    const summary = {
      'パートナー会社数': totalPartners,
      '総案件数': totalProjects,
      '総要員数': totalStaff,
      '平均案件数/パートナー': totalPartners > 0 ? Math.round(totalProjects / totalPartners * 10) / 10 : 0,
    };
    
    return {
      tableData: filteredTableData,
      chartData,
      summary,
    };
  }
}
