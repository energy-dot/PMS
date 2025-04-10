import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Partner } from '../../entities/partner.entity';
import { Staff } from '../../entities/staff.entity';
import { Contract } from '../../entities/contract.entity';
import { Application } from '../../entities/application.entity';
import { Evaluation } from '../../entities/evaluation.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,
  ) {}

  // 日付フィルター条件の作成
  private getDateFilter(startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }
    
    return Object.keys(dateFilter).length > 0 ? dateFilter : null;
  }

  // 部署フィルター条件の作成
  private getDepartmentFilter(department?: string) {
    return department && department !== 'all' ? department : null;
  }

  // 案件ステータス集計レポート
  async getProjectStatusReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const whereCondition: any = {};
    
    const dateFilter = this.getDateFilter(startDate, endDate);
    if (dateFilter) {
      whereCondition.createdAt = dateFilter;
    }
    
    const departmentFilter = this.getDepartmentFilter(department);
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

  // パートナー別案件数レポート
  async getPartnerProjectsReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const projectWhereCondition: any = {};
    
    const dateFilter = this.getDateFilter(startDate, endDate);
    if (dateFilter) {
      projectWhereCondition.createdAt = dateFilter;
    }
    
    const departmentFilter = this.getDepartmentFilter(department);
    if (departmentFilter) {
      projectWhereCondition.departmentId = departmentFilter;
    }
    
    // データ取得
    const partners = await this.partnerRepository.find({
      relations: ['projects', 'staff', 'projects.contracts'],
    });
    
    // パートナー別に集計
    const tableData = partners.map(partner => {
      // フィルター条件に合致する案件のみを対象とする
      const filteredProjects = partner.projects.filter(project => {
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
      
      filteredProjects.forEach(project => {
        project.contracts?.forEach(contract => {
          if (contract.monthlyRate) {
            totalRate += contract.monthlyRate;
            rateCount++;
          }
        });
      });
      
      const averageRate = rateCount > 0 ? Math.round(totalRate / rateCount) : 0;
      
      return {
        partnerName: partner.name,
        projectCount: filteredProjects.length,
        staffCount: partner.staff?.length || 0,
        averageRate,
      };
    }).filter(item => item.projectCount > 0);
    
    // チャートデータの作成
    const chartData = {
      labels: tableData.map(item => item.partnerName),
      projectCounts: tableData.map(item => item.projectCount),
      staffCounts: tableData.map(item => item.staffCount),
    };
    
    // サマリーデータの作成
    const totalProjects = tableData.reduce((sum, item) => sum + item.projectCount, 0);
    const totalStaff = tableData.reduce((sum, item) => sum + item.staffCount, 0);
    const totalPartners = tableData.length;
    
    const summary = {
      'パートナー会社数': totalPartners,
      '総案件数': totalProjects,
      '総要員数': totalStaff,
      '平均案件数/パートナー': totalPartners > 0 ? Math.round(totalProjects / totalPartners * 10) / 10 : 0,
    };
    
    return {
      tableData,
      chartData,
      summary,
    };
  }

  // 応募状況集計レポート
  async getApplicationStatusReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const whereCondition: any = {};
    
    const dateFilter = this.getDateFilter(startDate, endDate);
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
      percentage: applications.length > 0 ? Math.round((count as number) / applications.length * 100) : 0
    }));
    
    // チャートデータの作成
    const chartData = {
      labels: tableData.map(item => item.status),
      data: tableData.map(item => item.count),
    };
    
    // サマリーデータの作成
    const summary = {
      '総応募数': applications.length,
      '選考中': applications.filter(a => ['書類選考中', '一次面接', '二次面接', '最終面接'].includes(a.status)).length,
      '内定': applications.filter(a => a.status === '内定').length,
      '不採用': applications.filter(a => a.status === '不採用').length,
    };
    
    return {
      tableData,
      chartData,
      summary,
    };
  }

  // 要員評価集計レポート
  async getStaffEvaluationReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const whereCondition: any = {};
    
    const dateFilter = this.getDateFilter(startDate, endDate);
    if (dateFilter) {
      whereCondition.createdAt = dateFilter;
    }
    
    // スタッフ経由で部署フィルターを適用
    if (department && department !== 'all') {
      whereCondition.staff = {
        departmentId: department,
      };
    }
    
    // データ取得
    const evaluations = await this.evaluationRepository.find({
      where: whereCondition,
      relations: ['staff', 'evaluationSkills'],
    });
    
    // カテゴリ別に集計
    const categoryScores: Record<string, { scores: number[], sum: number, count: number }> = {};
    
    evaluations.forEach(evaluation => {
      evaluation.evaluationSkills?.forEach(skill => {
        const category = skill.category || '未分類';
        
        if (!categoryScores[category]) {
          categoryScores[category] = {
            scores: [],
            sum: 0,
            count: 0,
          };
        }
        
        categoryScores[category].scores.push(skill.score);
        categoryScores[category].sum += skill.score;
        categoryScores[category].count += 1;
      });
    });
    
    // テーブルデータの作成
    const tableData = Object.entries(categoryScores).map(([category, data]) => {
      const scores = data.scores;
      return {
        category,
        averageScore: data.count > 0 ? Math.round((data.sum / data.count) * 100) / 100 : 0,
        maxScore: scores.length > 0 ? Math.max(...scores) : 0,
        minScore: scores.length > 0 ? Math.min(...scores) : 0,
      };
    });
    
    // チャートデータの作成
    const chartData = {
      labels: tableData.map(item => item.category),
      averageScores: tableData.map(item => item.averageScore),
    };
    
    // サマリーデータの作成
    const totalEvaluations = evaluations.length;
    const totalStaff = new Set(evaluations.map(e => e.staffId)).size;
    
    let allScores: number[] = [];
    Object.values(categoryScores).forEach(data => {
      allScores = allScores.concat(data.scores);
    });
    
    const overallAverage = allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100) / 100
      : 0;
    
    const summary = {
      '評価総数': totalEvaluations,
      '評価対象要員数': totalStaff,
      '全体平均スコア': overallAverage,
    };
    
    return {
      tableData,
      chartData,
      summary,
    };
  }

  // 契約状況サマリーレポート
  async getContractSummaryReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const whereCondition: any = {};
    
    const dateFilter = this.getDateFilter(startDate, endDate);
    if (dateFilter) {
      whereCondition.startDate = dateFilter;
    }
    
    // プロジェクト経由で部署フィルターを適用
    if (department && department !== 'all') {
      whereCondition.project = {
        departmentId: department,
      };
    }
    
    // データ取得
    const contracts = await this.contractRepository.find({
      where: whereCondition,
      relations: ['project', 'staff'],
    });
    
    // 契約タイプ別に集計
    const typeCounts: Record<string, { count: number, totalRate: number, totalAmount: number }> = {};
    contracts.forEach(contract => {
      const type = contract.type || '未設定';
      
      if (!typeCounts[type]) {
        typeCounts[type] = {
          count: 0,
          totalRate: 0,
          totalAmount: 0,
        };
      }
      
      typeCounts[type].count += 1;
      typeCounts[type].totalRate += contract.monthlyRate || 0;
      
      // 契約金額の計算（単価 × 工数）
      const amount = (contract.monthlyRate || 0) * (contract.manMonth || 1);
      typeCounts[type].totalAmount += amount;
    });
    
    // テーブルデータの作成
    const tableData = Object.entries(typeCounts).map(([contractType, data]) => ({
      contractType,
      count: data.count,
      averageRate: data.count > 0 ? Math.round(data.totalRate / data.count) : 0,
      totalAmount: data.totalAmount,
    }));
    
    // チャートデータの作成
    const chartData = {
      labels: tableData.map(item => item.contractType),
      counts: tableData.map(item => item.count),
      averageRates: tableData.map(item => item.averageRate),
    };
    
    // サマリーデータの作成
    const totalContracts = contracts.length;
    const totalAmount = tableData.reduce((sum, item) => sum + item.totalAmount, 0);
    const averageRate = totalContracts > 0
      ? Math.round(contracts.reduce((sum, contract) => sum + (contract.monthlyRate || 0), 0) / totalContracts)
      : 0;
    
    const summary = {
      '契約総数': totalContracts,
      '平均単価': `¥${averageRate.toLocaleString()}`,
      '合計金額': `¥${totalAmount.toLocaleString()}`,
    };
    
    return {
      tableData,
      chartData,
      summary,
    };
  }

  // 月別案件推移レポート
  async getMonthlyProjectTrendReport(startDate?: string, endDate?: string, department?: string) {
    // 日付範囲の設定
    let start = startDate ? new Date(startDate) : new Date();
    start.setMonth(start.getMonth() - 11); // デフォルトは過去12ヶ月
    
    let end = endDate ? new Date(endDate) : new Date();
    
    // 部署フィルター
    const departmentFilter = this.getDepartmentFilter(department);
    
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
      '期間': `${start.toISOString().split('T')[0]} 〜 ${end.toISOString().split('T')[0]}`,
      '新規案件総数': totalNewProjects,
      '終了案件総数': totalEndedProjects,
      '平均進行中案件数': averageActiveProjects,
    };
    
    return {
      tableData: monthlyData,
      chartData,
      summary,
    };
  }
}
