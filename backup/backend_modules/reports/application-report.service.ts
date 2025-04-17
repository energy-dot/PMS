import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { DateUtilsService } from '../utils/date-utils.service';
import { FilterUtilsService } from '../utils/filter-utils.service';

/**
 * 応募状況に関するレポートを生成するサービス
 */
@Injectable()
export class ApplicationReportService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private dateUtilsService: DateUtilsService,
    private filterUtilsService: FilterUtilsService,
  ) {}

  /**
   * 応募状況集計レポートを生成
   */
  async getApplicationStatusReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const whereCondition: any = {};

    const dateFilter = this.dateUtilsService.getDateFilter(startDate, endDate);
    if (dateFilter) {
      whereCondition.createdAt = dateFilter;
    }

    // プロジェクト経由で部署フィルターを適用
    if (department && department !== 'all') {
      whereCondition.project = {
        departmentId: department,
      };
    }

    // データ取得
    const applications = await this.applicationRepository.find({
      where: whereCondition,
      relations: ['project'],
    });

    // ステータス別に集計
    const statusCounts: Record<string, number> = {};
    applications.forEach(application => {
      const status = application.status || '未設定';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // テーブルデータの作成
    const tableData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage:
        applications.length > 0 ? Math.round(((count as number) / applications.length) * 100) : 0,
    }));

    // チャートデータの作成
    const chartData = {
      labels: tableData.map(item => item.status),
      data: tableData.map(item => item.count),
    };

    // サマリーデータの作成
    const summary = {
      総応募数: applications.length,
      選考中: applications.filter(a =>
        ['書類選考中', '一次面接', '二次面接', '最終面接'].includes(a.status),
      ).length,
      内定: applications.filter(a => a.status === '内定').length,
      不採用: applications.filter(a => a.status === '不採用').length,
    };

    return {
      tableData,
      chartData,
      summary,
    };
  }
}
