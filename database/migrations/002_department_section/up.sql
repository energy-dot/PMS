-- 事業部マスターテーブル
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 部マスターテーブル
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- projectsテーブルの変更：departmentをFK化
-- まず古いカラムから新しいカラムへデータを移行するためにカラムを追加
ALTER TABLE projects ADD COLUMN department_id UUID;
ALTER TABLE projects ADD COLUMN section_id UUID;

-- インデックス追加
CREATE INDEX idx_sections_department ON sections(department_id);
CREATE INDEX idx_projects_department ON projects(department_id);
CREATE INDEX idx_projects_section ON projects(section_id);

-- マスターデータ挿入：事業部
INSERT INTO departments (code, name, display_order) VALUES
  ('DEV', '開発事業部', 10),
  ('SALES', '営業事業部', 20),
  ('ADMIN', '管理部門', 30),
  ('INFRA', 'インフラ事業部', 40),
  ('DX', 'DX推進事業部', 50);

-- マスターデータ挿入：部
-- 開発事業部の部
INSERT INTO sections (department_id, code, name, display_order) VALUES
  ((SELECT id FROM departments WHERE code = 'DEV'), 'DEV_WEB', 'Web開発部', 10),
  ((SELECT id FROM departments WHERE code = 'DEV'), 'DEV_APP', 'アプリ開発部', 20),
  ((SELECT id FROM departments WHERE code = 'DEV'), 'DEV_AI', 'AI開発部', 30);

-- 営業事業部の部
INSERT INTO sections (department_id, code, name, display_order) VALUES
  ((SELECT id FROM departments WHERE code = 'SALES'), 'SALES_EAST', '東日本営業部', 10),
  ((SELECT id FROM departments WHERE code = 'SALES'), 'SALES_WEST', '西日本営業部', 20),
  ((SELECT id FROM departments WHERE code = 'SALES'), 'SALES_PARTNER', 'パートナー営業部', 30);

-- 管理部門の部
INSERT INTO sections (department_id, code, name, display_order) VALUES
  ((SELECT id FROM departments WHERE code = 'ADMIN'), 'ADMIN_HR', '人事部', 10),
  ((SELECT id FROM departments WHERE code = 'ADMIN'), 'ADMIN_FIN', '財務部', 20),
  ((SELECT id FROM departments WHERE code = 'ADMIN'), 'ADMIN_GEN', '総務部', 30);

-- インフラ事業部の部
INSERT INTO sections (department_id, code, name, display_order) VALUES
  ((SELECT id FROM departments WHERE code = 'INFRA'), 'INFRA_NW', 'ネットワーク部', 10),
  ((SELECT id FROM departments WHERE code = 'INFRA'), 'INFRA_SV', 'サーバー部', 20),
  ((SELECT id FROM departments WHERE code = 'INFRA'), 'INFRA_SEC', 'セキュリティ部', 30);

-- DX推進事業部の部
INSERT INTO sections (department_id, code, name, display_order) VALUES
  ((SELECT id FROM departments WHERE code = 'DX'), 'DX_CONS', 'DXコンサルティング部', 10),
  ((SELECT id FROM departments WHERE code = 'DX'), 'DX_DATA', 'データ分析部', 20),
  ((SELECT id FROM departments WHERE code = 'DX'), 'DX_CLOUD', 'クラウド推進部', 30);
