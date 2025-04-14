// APIのベースURL
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api'; // 開発環境でもプロキシを使用

// ページネーションデフォルト設定
export const DEFAULT_PAGE_SIZE = 10;

// トークン保存のキー
export const AUTH_TOKEN_KEY = 'pms_auth_token';
export const USER_DATA_KEY = 'pms_user_data';

// その他の定数
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';