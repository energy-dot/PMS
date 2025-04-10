// パートナーステータス
export enum PartnerStatus {
  ACTIVE = '取引中',
  SUSPENDED = '取引停止',
  CANDIDATE = '候補'
}

// 契約ステータス
export enum ContractStatus {
  ACTIVE = '契約中',
  RENEWAL = '更新待ち',
  COMPLETED = '契約終了'
}

// 案件ステータス
export enum ProjectStatus {
  RECRUITING = '募集中',
  SELECTING = '選考中',
  FULFILLED = '充足',
  PENDING_APPROVAL = '承認待ち',
  REJECTED = '差し戻し',
  COMPLETED = '終了'
}

// 要員ステータス
export enum StaffStatus {
  WORKING = '稼働中',
  WAITING = '待機中',
  TERMINATED = '契約終了'
}

// ユーザーロール
export enum UserRole {
  ADMIN = 'admin',
  PARTNER_MANAGER = 'partner_manager',
  DEVELOPER = 'developer',
  VIEWER = 'viewer'
}
