// services/projectService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Project } from '../shared-types';
import { mockProjects } from '../mocks/projectMock';
import { handleApiError, logError } from '../utils/errorHandler';

// プロジェクトデータの取得
export const getProjects = async (): Promise<Project[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockProjects;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/projects'));
  } catch (error) {
    logError(error, 'getProjects');
    throw handleApiError(error, 'プロジェクト情報の取得に失敗しました');
  }
};

// プロジェクトデータの取得（ID指定）
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const project = mockProjects.find(p => p.id === id);
      if (!project) {
        throw new Error(`Project with ID ${id} not found`);
      }
      return project;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/projects/${id}`));
  } catch (error) {
    logError(error, `getProjectById(${id})`);
    throw handleApiError(error, `プロジェクト情報(ID: ${id})の取得に失敗しました`);
  }
};

// プロジェクトデータの作成
export const createProject = async (data: Omit<Project, 'id'>): Promise<Project> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const newId = Math.floor(Math.random() * 1000).toString();
      const newProject: Project = {
        id: newId,
        ...data,
      };
      return newProject;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/projects', data));
  } catch (error) {
    logError(error, 'createProject');
    throw handleApiError(error, 'プロジェクトの作成に失敗しました');
  }
};

// プロジェクトデータの更新
export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const project = mockProjects.find(p => p.id === id);
      if (!project) {
        throw new Error(`Project with ID ${id} not found`);
      }
      const updatedProject: Project = {
        ...project,
        ...data,
      };
      return updatedProject;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/projects/${id}`, data));
  } catch (error) {
    logError(error, `updateProject(${id})`);
    throw handleApiError(error, `プロジェクト情報(ID: ${id})の更新に失敗しました`);
  }
};

// プロジェクトデータの削除
export const deleteProject = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: Project with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/projects/${id}`));
  } catch (error) {
    logError(error, `deleteProject(${id})`);
    throw handleApiError(error, `プロジェクト(ID: ${id})の削除に失敗しました`);
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
    if (USE_MOCK_DATA) {
      // モックデータを使用
      let projects = mockProjects;

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
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/projects/search', { params }));
  } catch (error) {
    logError(error, 'searchProjects');
    throw handleApiError(error, 'プロジェクト検索に失敗しました');
  }
};

// プロジェクトに要員を割り当てる
export const assignStaffToProject = async (projectId: string, staffIds: string[]): Promise<Project> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const project = mockProjects.find(p => p.id === projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      
      // 既存の要員と新しい要員をマージ（重複を排除）
      const currentStaffs = project.assignedStaffs || [];
      const updatedStaffs = [...new Set([...currentStaffs, ...staffIds])];
      
      const updatedProject: Project = {
        ...project,
        assignedStaffs: updatedStaffs
      };
      
      return updatedProject;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post(`/projects/${projectId}/assign-staff`, { staffIds }));
  } catch (error) {
    logError(error, `assignStaffToProject(${projectId})`);
    throw handleApiError(error, 'プロジェクトへの要員割り当てに失敗しました');
  }
};

// プロジェクトから要員を削除する
export const removeStaffFromProject = async (projectId: string, staffId: string): Promise<Project> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const project = mockProjects.find(p => p.id === projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      
      // 指定された要員を削除
      const currentStaffs = project.assignedStaffs || [];
      const updatedStaffs = currentStaffs.filter(id => id !== staffId);
      
      const updatedProject: Project = {
        ...project,
        assignedStaffs: updatedStaffs
      };
      
      return updatedProject;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.delete(`/projects/${projectId}/staff/${staffId}`));
  } catch (error) {
    logError(error, `removeStaffFromProject(${projectId}, ${staffId})`);
    throw handleApiError(error, 'プロジェクトからの要員削除に失敗しました');
  }
};

// デフォルトエクスポート
const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
  assignStaffToProject,
  removeStaffFromProject
};

export default projectService;
