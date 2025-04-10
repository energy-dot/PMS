-- 管理者ユーザーの作成
INSERT INTO users (username, password, full_name, role)
VALUES 
  ('admin', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', '管理者', 'admin'), -- パスワード: password
  ('partner_manager', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'パートナー管理者', 'partner_manager'),
  ('developer', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', '開発者', 'developer'),
  ('viewer', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', '閲覧者', 'viewer');

-- パートナー会社のサンプルデータ
INSERT INTO partners (name, address, phone, email, website, status, business_category, established_year, employee_count)
VALUES
  ('株式会社テクノソリューション', '東京都渋谷区神宮前5-52-2', '03-1234-5678', 'info@technosolution.co.jp', 'https://technosolution.co.jp', '取引中', 'システム開発', 2005, 120),
  ('デジタルイノベーション株式会社', '東京都新宿区西新宿2-8-1', '03-8765-4321', 'contact@digitalinnovation.co.jp', 'https://digitalinnovation.co.jp', '取引中', 'ITコンサルティング', 2010, 85),
  ('株式会社ITプロフェッショナル', '東京都千代田区丸の内1-9-1', '03-2345-6789', 'info@itprofessional.co.jp', 'https://itprofessional.co.jp', '取引停止', 'システム開発', 2008, 50),
  ('サイバーテック株式会社', '大阪府大阪市北区梅田3-1-3', '06-1234-5678', 'info@cybertech.co.jp', 'https://cybertech.co.jp', '取引中', 'インフラ構築', 2012, 65),
  ('株式会社システムクリエイト', '福岡県福岡市博多区博多駅前2-1-1', '092-123-4567', 'info@systemcreate.co.jp', 'https://systemcreate.co.jp', '候補', 'システム開発', 2015, 30);

-- 要員のサンプルデータ
INSERT INTO staff (name, email, phone, status, skills, experience, partner_id)
VALUES
  ('山田 太郎', 'yamada@technosolution.co.jp', '090-1234-5678', '稼働中', ARRAY['Java', 'Spring', 'AWS'], 8, (SELECT id FROM partners WHERE name = '株式会社テクノソリューション')),
  ('佐藤 次郎', 'sato@digitalinnovation.co.jp', '090-8765-4321', '稼働中', ARRAY['Python', 'Django', 'Docker'], 5, (SELECT id FROM partners WHERE name = 'デジタルイノベーション株式会社')),
  ('鈴木 三郎', 'suzuki@itprofessional.co.jp', '090-2345-6789', '契約終了', ARRAY['JavaScript', 'React', 'TypeScript'], 3, (SELECT id FROM partners WHERE name = '株式会社ITプロフェッショナル')),
  ('田中 四郎', 'tanaka@cybertech.co.jp', '090-3456-7890', '稼働中', ARRAY['C#', '.NET', 'Azure'], 7, (SELECT id FROM partners WHERE name = 'サイバーテック株式会社')),
  ('高橋 五郎', 'takahashi@systemcreate.co.jp', '090-4567-8901', '待機中', ARRAY['PHP', 'Laravel', 'MySQL'], 4, (SELECT id FROM partners WHERE name = '株式会社システムクリエイト'));

-- 案件のサンプルデータ
INSERT INTO projects (name, department, description, start_date, end_date, status, required_skills, required_number, location, is_remote)
VALUES
  ('Javaエンジニア募集', '開発1部', 'Javaを使用した基幹システムの開発', '2025-05-01', '2025-10-31', '募集中', 'Java, Spring, Oracle', 2, '東京都千代田区', false),
  ('インフラエンジニア', '基盤チーム', 'AWSを使用したクラウド環境の構築・運用', '2025-05-15', '2025-11-30', '選考中', 'AWS, Docker, Kubernetes', 1, '東京都中央区', true),
  ('フロントエンドエンジニア', '開発2部', 'React/TypeScriptを使用したWebアプリケーション開発', '2025-06-01', '2025-12-31', '承認待ち', 'JavaScript, React, TypeScript', 3, '東京都渋谷区', true),
  ('PMO支援', 'PMO', '大規模プロジェクトのPMO業務支援', '2025-05-01', '2026-03-31', '充足', 'Excel, PowerPoint, プロジェクト管理', 1, '東京都新宿区', false),
  ('テスト自動化エンジニア', '品質保証部', 'テスト自動化フレームワークの構築と実装', '2025-06-15', '2025-12-15', '差し戻し', 'Selenium, JUnit, Jenkins', 2, '大阪府大阪市', false);

-- 契約のサンプルデータ
INSERT INTO contracts (staff_id, project_id, start_date, end_date, price, status)
VALUES
  ((SELECT id FROM staff WHERE name = '山田 太郎'), (SELECT id FROM projects WHERE name = 'Javaエンジニア募集'), '2025-05-01', '2025-10-31', 800000, '契約中'),
  ((SELECT id FROM staff WHERE name = '佐藤 次郎'), (SELECT id FROM projects WHERE name = 'インフラエンジニア'), '2025-05-15', '2025-11-30', 750000, '契約中'),
  ((SELECT id FROM staff WHERE name = '鈴木 三郎'), (SELECT id FROM projects WHERE name = 'フロントエンドエンジニア'), '2025-01-01', '2025-03-31', 700000, '契約終了'),
  ((SELECT id FROM staff WHERE name = '田中 四郎'), (SELECT id FROM projects WHERE name = 'PMO支援'), '2025-05-01', '2026-03-31', 850000, '契約中'),
  ((SELECT id FROM staff WHERE name = '高橋 五郎'), (SELECT id FROM projects WHERE name = 'テスト自動化エンジニア'), '2025-04-01', '2025-04-30', 720000, '更新待ち');
