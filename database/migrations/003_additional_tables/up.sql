-- 応募者（applications）テーブル
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  contact_person_id UUID REFERENCES contact_persons(id) ON DELETE SET NULL,
  applicant_name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(50),
  nearest_station VARCHAR(255),
  desired_rate VARCHAR(255),
  skill_summary TEXT,
  skill_sheet_url VARCHAR(255),
  application_date TIMESTAMP NOT NULL,
  application_source VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT '新規応募',
  document_screener_id UUID REFERENCES users(id) ON DELETE SET NULL,
  document_screening_comment TEXT,
  final_result_notification_date TIMESTAMP,
  remarks TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 面接記録（interview_records）テーブル
CREATE TABLE IF NOT EXISTS interview_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  interview_date TIMESTAMP NOT NULL,
  interview_format VARCHAR(50) NOT NULL,
  evaluation_score INTEGER,
  evaluation_comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 要員評価（evaluations）テーブル
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  evaluation_date TIMESTAMP NOT NULL,
  technical_skill_rating INTEGER NOT NULL,
  communication_rating INTEGER NOT NULL,
  teamwork_rating INTEGER NOT NULL,
  delivery_rating INTEGER NOT NULL,
  overall_rating INTEGER NOT NULL,
  strengths TEXT,
  areas_for_improvement TEXT,
  comments TEXT,
  is_final BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 評価スキル（evaluation_skills）テーブル
CREATE TABLE IF NOT EXISTS evaluation_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  skill_rating INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 通知（notifications）テーブル
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  priority VARCHAR(50) DEFAULT 'normal',
  expiration_date TIMESTAMP,
  action_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 通知設定（notification_settings）テーブル
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  is_email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  is_in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, notification_type)
);

-- 依頼ワークフロー（requests）テーブル
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type VARCHAR(50) NOT NULL,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT '承認待ち',
  request_date TIMESTAMP NOT NULL,
  approval_date TIMESTAMP,
  rejection_date TIMESTAMP,
  rejection_reason TEXT,
  details JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 依頼履歴（request_history）テーブル
CREATE TABLE IF NOT EXISTS request_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  comment TEXT,
  action_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- スキルカテゴリ（skill_categories）テーブル
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- スキル（skills）テーブル
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_applications_project ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_partner ON applications(partner_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_interview_records_application ON interview_records(application_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_staff ON evaluations(staff_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_project ON evaluations(project_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_skills_evaluation ON evaluation_skills(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notification_settings_user ON notification_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_approver ON requests(approver_id);
CREATE INDEX IF NOT EXISTS idx_requests_staff ON requests(staff_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_request_histories_request ON request_histories(request_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
