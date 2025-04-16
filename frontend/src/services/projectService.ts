// services/projectService.tsの修正 - APIのインポート方法を修正

import api from './api';
import { Project } from '../shared-types';

// プロジェクトデータの取得
export const getProjects = async (): Promise<Project[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.get('/projects');
    // return response.data;

    // デモ用のモックデータ
    return [
      {
        id: '1',
        name: 'ECサイトリニューアル',
        partnerId: '101',
        startDate: '2023-01-01',
        endDate: '2023-06-30',
        status: 'active',
        description: '既存ECサイトのUI/UXの改善とバックエンドの刷新',
        budget: 15000000,
        assignedStaffs: ['201', '202', '203'],
        skills: ['React', 'Node.js', 'MongoDB'],
      },
      {
        id: '2',
        name: '社内業務システム開発',
        partnerId: '102',
        startDate: '2023-02-15',
        endDate: '2023-12-31',
        status: 'active',
        description: '人事・経理・営業支援のための統合業務システムの開発',
        budget: 25000000,
        assignedStaffs: ['204', '205', '206', '207'],
        skills: ['Java', 'Spring', 'PostgreSQL', 'Angular'],
      },
      {
        id: '3',
        name: 'モバイルアプリ開発',
        partnerId: '103',
        startDate: '2022-10-01',
        endDate: '2023-03-31',
        status: 'completed',
        description: 'iOSとAndroid向けの顧客向けモバイルアプリケーションの開発',
        budget: 12000000,
        assignedStaffs: ['208', '209'],
        skills: ['Swift', 'Kotlin', 'Firebase'],
      },
    ];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};

// プロジェクトデータの取得（ID指定）
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.get(`/projects/${id}`);
    // return response.data;

    // デモ用のモックデータ
    const projects = await getProjects();
    const project = projects.find(p => p.id === id);

    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }

    return project;
  } catch (error) {
    console.error(`Failed to fetch project with ID ${id}:`, error);
    throw error;
  }
};

// プロジェクトデータの作成
export const createProject = async (data: Omit<Project, 'id'>): Promise<Project> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.post('/projects', data);
    // return response.data;

    // デモ用のモックデータ
    const newId = Math.floor(Math.random() * 1000).toString();
    const newProject: Project = {
      id: newId,
      ...data,
    };

    return newProject;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
};

// プロジェクトデータの更新
export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.put(`/projects/${id}`, data);
    // return response.data;

    // デモ用のモックデータ
    const project = await getProjectById(id);
    const updatedProject: Project = {
      ...project,
      ...data,
    };

    return updatedProject;
  } catch (error) {
    console.error(`Failed to update project with ID ${id}:`, error);
    throw error;
  }
};

// プロジェクトデータの削除
export const deleteProject = async (id: string): Promise<void> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // await api.delete(`/projects/${id}`);

    // デモ用のモックデータ
    // 実際には何もしない
    console.log(`Project with ID ${id} deleted`);
  } catch (error) {
    console.error(`Failed to delete project with ID ${id}:`, error);
    throw error;
  }
};

// プロジェクト検索
export const searchProjects = async (params: {
  name?: string;
  partnerId?: string;
  status?: string;
  skills?: string[];
}): Promise<Project[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.get('/projects/search', { params });
    // return response.data;

    // デモ用のモックデータ
    let projects = await getProjects();

    // 検索条件によるフィルタリング
    if (params.name) {
      projects = projects.filter(p => p.name.toLowerCase().includes(params.name!.toLowerCase()));
    }

    if (params.partnerId) {
      projects = projects.filter(p => p.partnerId === params.partnerId);
    }

    if (params.status) {
      projects = projects.filter(p => p.status === params.status);
    }

    if (params.skills && params.skills.length > 0) {
      projects = projects.filter(p => params.skills!.some(skill => p.skills?.includes(skill)));
    }

    return projects;
  } catch (error) {
    console.error('Failed to search projects:', error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
};

export default projectService;
