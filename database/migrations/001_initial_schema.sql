-- データベース作成
CREATE DATABASE partner_management;

-- データベースに接続
\c partner_management;

-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- パートナー会社テーブル
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  website VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT '候補',
  business_category VARCHAR(255),
  established_year INTEGER,
  employee_count INTEGER,
  annual_revenue VARCHAR(255),
  antisocial_check_completed BOOLEAN NOT NULL DEFAULT FALSE,
  antisocial_check_date TIMESTAMP,
  credit_check_completed BOOLEAN NOT NULL DEFAULT FALSE,
  credit_check_date TIMESTAMP,
  remarks TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 要員テーブル
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT '待機中',
  skills TEXT[],
  experience INTEGER,
  birth_date TIMESTAMP,
  gender VARCHAR(50),
  address TEXT,
  resume TEXT,
  remarks TEXT,
  partner_id UUID NOT NULL REFERENCES partners(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 案件テーブル
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT '承認待ち',
  required_skills TEXT,
  required_experience TEXT,
  required_number INTEGER,
  budget VARCHAR(255),
  location VARCHAR(255),
  working_hours VARCHAR(255),
  is_remote BOOLEAN NOT NULL DEFAULT FALSE,
  remarks TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 契約テーブル
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  price NUMERIC NOT NULL,
  payment_terms TEXT,
  status VARCHAR(50) NOT NULL DEFAULT '契約中',
  contract_file TEXT,
  remarks TEXT,
  is_auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
  renewal_notice_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_staff_partner ON staff(partner_id);
CREATE INDEX idx_contracts_staff ON contracts(staff_id);
CREATE INDEX idx_contracts_project ON contracts(project_id);
