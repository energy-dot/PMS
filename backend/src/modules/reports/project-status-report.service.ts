import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { DateUtilsService } from '../utils/date-utils.service';
import { FilterUtilsService } from '../utils/filter-utils.service';

/**
 * プロジェクトステータスレポートを生成するサービス
 */
@Injectable()
export class ProjectStatusReportService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private dateUtilsService: DateUtilsService,
    private filterUtilsService: FilterUtilsService
  ) {}

  /**
   * 案件ステータス集計レポートを生成
   */
  async getProjectStatusReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const whereCondition: any = {};
    
    const dateFilter = this.dateUtilsService.getDateFilter(startDate, endDate);
    if (dateFilter) {
      whereCondition.createdAt = dateFilter;
    }
    
    const departmentFilter = this.filterUtilsService.getDepartmentFilter(department);
    if (departmentFilter) {
      whereCondition.departmentId = departmentFilter;
    }
    
    // データ取得
    const projects = await this.projectRepository.find({
      where: whereCondition,
      relations: ['department'],
    });
    
    // ステータス別に集計
    const statusCounts: Record<string, number> = {};
    projects.forEach(project => {
      const status = project.status || '未設定';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // テーブルデータの作成
    const tableData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count as number) / projects.length * 100)
    }));
    
    // チャートデータの作成
    const chartData = {
      labels: tableData.map(item => item.status),
      data: tableData.map(item => item.count),
    };
    
    // サマリーデータの作成
    const summary = {
      '総案件数': projects.length,
      '進行中案件数': projects.filter(p => p.status === '進行中').length,
      '完了案件数': projects.filter(p => p.status === '完了').length,
      '中止案件数': projects.filter(p => p.status === '中止').length,
    };
    
    return {
      tableData,
      chartData,
      summary,
    };
  }

  /**
   * 月別案件推移レポートを生成
   */
  async getMonthlyProjectTrendReport(startDate?: string, endDate?: string, department?: string) {
    // 日付範囲の設定
    let start = startDate ? new Date(startDate) : new Date();
    start.setMonth(start.getMonth() - 11); // デフォルトは過去12ヶ月
    
    let end = endDate ? new Date(endDate) : new Date();
    
    // 部署フィルター
    const departmentFilter = this.filterUtilsService.getDepartmentFilter(department);
    
    // 月ごとのデータを格納する配列
    const monthlyData = [];
    
    // 開始月から終了月まで繰り返し
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // 月の初日と最終日
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      // 新規案件数（その月に作成された案件）
      const newProjectsWhere: any = {
        createdAt: Between(monthStart, monthEnd),
      };
      
      if (departmentFilter) {
        newProjectsWhere.departmentId = departmentFilter;
      }
      
      const newProjects = await this.projectRepository.count({
        where: newProjectsWhere,
      });
      
      // 終了案件数（その月に終了した案件）
      const endedProjectsWhere: any = {
        endDate: Between(monthStart, monthEnd),
      };
      
      if (departmentFilter) {
        endedProjectsWhere.departmentId = departmentFilter;
      }
      
      const endedProjects = await this.projectRepository.count({
        where: endedProjectsWhere,
      });
      
      // 進行中案件数（その月の間に進行中だった案件）
      const activeProjectsWhere: any = {
        startDate: LessThanOrEqual(monthEnd),
        endDate: MoreThanOrEqual(monthStart),
      };
      
      if (departmentFilter) {
        activeProjectsWhere.departmentId = departmentFilter;
      }
      
      const activeProjects = await this.projectRepository.count({
        where: activeProjectsWhere,
      });
      
      // 月データの追加
      monthlyData.push({
        month: `${year}/${month + 1}`,
        newProjects,
        endedProjects,
        activeProjects,
      });
      
      // 次の月へ
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // チャートデータの作成
    const chartData = {
      labels: monthlyData.map(item => item.month),
      newProjects: monthlyData.map(item => item.newProjects),
      endedProjects: monthlyData.map(item => item.endedProjects),
      activeProjects: monthlyData.map(item => item.activeProjects),
    };
    
    // サマリーデータの作成
    const totalNewProjects = monthlyData.reduce((sum, item) => sum + item.newProjects, 0);
    const totalEndedProjects = monthlyData.reduce((sum, item) => sum + item.endedProjects, 0);
    const averageActiveProjects = monthlyData.length > 0 ? 
      Math.round(monthlyData.reduce((sum, item) => sum + item.activeProjects, 0) / monthlyData.length) : 0;
    
    const summary = {
      '期間内新規案件数': totalNewProjects,
      '期間内終了案件数': totalEndedProjects,
      '平均進行中案件数': averageActiveProjects,
    };
    
    return {
      tableData: monthlyData,
      chartData,
      summary,
    };
  }
}
