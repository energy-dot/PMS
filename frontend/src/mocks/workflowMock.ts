import { Workflow, RequestHistory } from '../shared-types';

// ワークフロー情報のモックデータ
export const mockWorkflows: Workflow[] = [
  {
    id: 'workflow-1',
    name: 'プロジェクト承認ワークフロー',
    description: 'プロジェクトの承認プロセスを管理するワークフロー',
    steps: [
      { id: 'step-1', name: '申請', role: 'requester', order: 1 },
      { id: 'step-2', name: '部門長承認', role: 'department_manager', order: 2 },
      { id: 'step-3', name: '経営承認', role: 'executive', order: 3 }
    ],
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'workflow-2',
    name: '契約承認ワークフロー',
    description: '契約の承認プロセスを管理するワークフロー',
    steps: [
      { id: 'step-4', name: '申請', role: 'requester', order: 1 },
      { id: 'step-5', name: '法務確認', role: 'legal', order: 2 },
      { id: 'step-6', name: '財務承認', role: 'finance', order: 3 },
      { id: 'step-7', name: '最終承認', role: 'executive', order: 4 }
    ],
    isActive: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z'
  },
  {
    id: 'workflow-3',
    name: '経費申請ワークフロー',
    description: '経費申請の承認プロセスを管理するワークフロー',
    steps: [
      { id: 'step-8', name: '申請', role: 'requester', order: 1 },
      { id: 'step-9', name: '上長承認', role: 'manager', order: 2 },
      { id: 'step-10', name: '経理承認', role: 'accounting', order: 3 }
    ],
    isActive: true,
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z'
  }
];

// リクエスト履歴のモックデータ
export const mockRequestHistories: RequestHistory[] = [
  {
    id: 'request-1',
    workflowId: 'workflow-1',
    requesterId: 'user-1',
    targetId: 'project-1',
    targetType: 'project',
    status: 'approved',
    currentStep: 3,
    steps: [
      {
        stepId: 'step-1',
        status: 'completed',
        actorId: 'user-1',
        actionDate: '2023-03-01T10:00:00Z',
        remarks: '新規プロジェクト承認申請'
      },
      {
        stepId: 'step-2',
        status: 'completed',
        actorId: 'user-2',
        actionDate: '2023-03-02T14:30:00Z',
        remarks: '部門予算内につき承認'
      },
      {
        stepId: 'step-3',
        status: 'completed',
        actorId: 'user-3',
        actionDate: '2023-03-03T11:15:00Z',
        remarks: '経営会議にて承認済み'
      }
    ],
    createdAt: '2023-03-01T10:00:00Z',
    updatedAt: '2023-03-03T11:15:00Z'
  },
  {
    id: 'request-2',
    workflowId: 'workflow-1',
    requesterId: 'user-4',
    targetId: 'project-2',
    targetType: 'project',
    status: 'pending',
    currentStep: 2,
    steps: [
      {
        stepId: 'step-1',
        status: 'completed',
        actorId: 'user-4',
        actionDate: '2023-03-10T09:45:00Z',
        remarks: '緊急プロジェクト承認申請'
      },
      {
        stepId: 'step-2',
        status: 'pending',
        actorId: null,
        actionDate: null,
        remarks: null
      }
    ],
    createdAt: '2023-03-10T09:45:00Z',
    updatedAt: '2023-03-10T09:45:00Z'
  },
  {
    id: 'request-3',
    workflowId: 'workflow-2',
    requesterId: 'user-5',
    targetId: 'contract-1',
    targetType: 'contract',
    status: 'rejected',
    currentStep: 2,
    steps: [
      {
        stepId: 'step-4',
        status: 'completed',
        actorId: 'user-5',
        actionDate: '2023-03-15T13:20:00Z',
        remarks: '新規契約承認申請'
      },
      {
        stepId: 'step-5',
        status: 'rejected',
        actorId: 'user-6',
        actionDate: '2023-03-16T10:30:00Z',
        remarks: '契約条件の見直しが必要'
      }
    ],
    createdAt: '2023-03-15T13:20:00Z',
    updatedAt: '2023-03-16T10:30:00Z'
  },
  {
    id: 'request-4',
    workflowId: 'workflow-3',
    requesterId: 'user-7',
    targetId: 'expense-1',
    targetType: 'expense',
    status: 'approved',
    currentStep: 3,
    steps: [
      {
        stepId: 'step-8',
        status: 'completed',
        actorId: 'user-7',
        actionDate: '2023-03-20T11:00:00Z',
        remarks: '出張費用申請'
      },
      {
        stepId: 'step-9',
        status: 'completed',
        actorId: 'user-8',
        actionDate: '2023-03-21T09:15:00Z',
        remarks: '出張内容確認済み'
      },
      {
        stepId: 'step-10',
        status: 'completed',
        actorId: 'user-9',
        actionDate: '2023-03-22T14:45:00Z',
        remarks: '経理確認済み'
      }
    ],
    createdAt: '2023-03-20T11:00:00Z',
    updatedAt: '2023-03-22T14:45:00Z'
  },
  {
    id: 'request-5',
    workflowId: 'workflow-1',
    requesterId: 'user-10',
    targetId: 'project-3',
    targetType: 'project',
    status: 'pending',
    currentStep: 1,
    steps: [
      {
        stepId: 'step-1',
        status: 'pending',
        actorId: null,
        actionDate: null,
        remarks: null
      }
    ],
    createdAt: '2023-03-25T15:30:00Z',
    updatedAt: '2023-03-25T15:30:00Z'
  }
];
