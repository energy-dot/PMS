// shared-typesモジュールの型定義
export interface User {
  id?: string;
  username: string;
  fullName?: string; // オプショナルに変更
  email: string;
  role: 'developer' | 'partner_manager' | 'admin' | 'viewer' | 'user'; // 'user'を追加
  isActive: boolean;
  name?: string; // モックデータで使用されているため追加
  department?: string; // モックデータで使用されているため追加
  position?: string; // モックデータで使用されているため追加
}

export interface Partner {
  id?: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  industry: string;
  establishedDate: string;
  status: 'active' | 'inactive' | 'blacklisted' | 'pending';
  code?: string;
}

export interface Staff {
  id?: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  availability: 'available' | 'unavailable' | 'partially_available';
  status: 'active' | 'inactive' | 'available' | 'assigned';
  name?: string; // モックデータで使用されているため追加
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  budget: number;
  departmentId?: string; // オプショナルに変更
  code?: string;
  managerId?: string; // モックデータで使用されているため追加
  partnerId?: string; // モックデータで使用されているため追加
  skills?: string[]; // モックデータで使用されているため追加
  assignedStaffs?: string[]; // モックデータで使用されているため追加
}

export interface Department {
  id?: string;
  name: string;
  managerId?: string;
  parentDepartmentId?: string;
  code?: string;
  sections?: any[]; // モックデータで使用されているため追加
}

export interface Contract {
  id?: string;
  projectId: string;
  staffId: string;
  startDate: string;
  endDate: string;
  rate: number;
  status: 'draft' | 'active' | 'completed' | 'terminated';
}

export interface Application {
  id?: string;
  projectId: string;
  partnerId: string;
  staffId?: string;
  applicationDate: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

export interface Evaluation {
  id?: string;
  staffId: string;
  projectId: string;
  evaluatorId: string;
  evaluationDate: string;
  technicalScore?: number; // オプショナルに変更
  communicationScore?: number; // オプショナルに変更
  attitudeScore?: number; // オプショナルに変更
  comments?: string;
  // モックデータで使用されているフィールドを追加
  overallRating?: number;
  technicalSkills?: number;
  communicationSkills?: number;
  problemSolving?: number;
  teamwork?: number;
  leadership?: number;
  skillRatings?: Array<{ skillName: string; rating: number }>;
}

export interface Role {
  id?: string;
  name: string;
  permissions: string[];
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// 他の型定義も必要に応じて追加
