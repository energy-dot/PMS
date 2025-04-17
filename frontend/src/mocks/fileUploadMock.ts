import { FileUpload } from '../shared-types';

// ファイルアップロード情報のモックデータ
export const mockFileUploads: FileUpload[] = [
  {
    id: 'file-1',
    fileName: '要件定義書.pdf',
    originalName: '要件定義書_v1.2.pdf',
    mimeType: 'application/pdf',
    size: 1245678,
    path: '/uploads/documents/requirements_doc.pdf',
    entityType: 'project',
    entityId: 'proj-1',
    uploadedBy: 'user-1',
    uploadedAt: '2023-04-15T10:30:00Z',
    description: 'プロジェクト要件定義書'
  },
  {
    id: 'file-2',
    fileName: '契約書.pdf',
    originalName: '契約書_20230501.pdf',
    mimeType: 'application/pdf',
    size: 987654,
    path: '/uploads/contracts/contract_doc.pdf',
    entityType: 'contract',
    entityId: 'contract-1',
    uploadedBy: 'user-2',
    uploadedAt: '2023-05-01T14:45:00Z',
    description: '正式契約書'
  },
  {
    id: 'file-3',
    fileName: 'スキルシート.xlsx',
    originalName: '山田太郎_スキルシート.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 456789,
    path: '/uploads/skills/skill_sheet.xlsx',
    entityType: 'staff',
    entityId: 'staff-1',
    uploadedBy: 'user-3',
    uploadedAt: '2023-03-20T09:15:00Z',
    description: 'スタッフスキルシート'
  },
  {
    id: 'file-4',
    fileName: '議事録.docx',
    originalName: '2023年5月10日_会議議事録.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 345678,
    path: '/uploads/meetings/meeting_minutes.docx',
    entityType: 'project',
    entityId: 'proj-2',
    uploadedBy: 'user-1',
    uploadedAt: '2023-05-10T16:30:00Z',
    description: 'キックオフミーティング議事録'
  },
  {
    id: 'file-5',
    fileName: '提案書.pptx',
    originalName: 'プロジェクト提案書_v2.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 2345678,
    path: '/uploads/proposals/proposal_doc.pptx',
    entityType: 'project',
    entityId: 'proj-3',
    uploadedBy: 'user-4',
    uploadedAt: '2023-04-25T11:20:00Z',
    description: 'クライアント向け提案書'
  }
];
