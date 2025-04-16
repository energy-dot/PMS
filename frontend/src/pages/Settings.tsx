import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useAuthStore } from '../store/authStore';

// ダークモード用のスタイル定義
const darkModeStyles = {
  body: 'bg-gray-900 text-white',
  card: 'bg-gray-800 border-gray-700',
  input: 'bg-gray-700 border-gray-600 text-white',
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  },
  text: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    muted: 'text-gray-400',
  },
};

// ライトモード用のスタイル定義
const lightModeStyles = {
  body: 'bg-gray-100 text-gray-900',
  card: 'bg-white border-gray-200',
  input: 'bg-white border-gray-300 text-gray-900',
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  },
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
  },
};

const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ユーザー設定
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appNotifications: true,
    dailyDigest: false,
    notifyOnProjectChanges: true,
    notifyOnApplicationChanges: true,
    notifyOnApprovalRequests: true,
  });

  // 表示設定
  const [displaySettings, setDisplaySettings] = useState({
    itemsPerPage: 10,
    defaultView: 'list',
    compactMode: false,
    showFilters: true,
  });

  // 初期設定の読み込み
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        // ローカルストレージからダークモード設定を読み込む
        let savedDarkMode = false;
        try {
          savedDarkMode = localStorage.getItem('darkMode') === 'true';
        } catch (storageError) {
          console.warn('ローカルストレージへのアクセスエラー:', storageError);
          // メモリ内の状態を使用して続行
        }
        setDarkMode(savedDarkMode);

        // ダークモードを適用
        try {
          if (savedDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (domError) {
          console.warn('DOM操作エラー:', domError);
        }

        // APIから通知設定を読み込む
        if (user && user.id) {
          try {
            const notificationResponse = await axios.get(
              `${API_BASE_URL}/users/${user.id}/notification-settings`
            );
            setNotificationSettings(notificationResponse.data);

            const displayResponse = await axios.get(
              `${API_BASE_URL}/users/${user.id}/display-settings`
            );
            setDisplaySettings(displayResponse.data);
          } catch (apiError: any) {
            console.warn('API呼び出しエラー:', apiError);
            // エラーがあっても続行（デフォルト設定を使用）
          }
        }

        setLoading(false);
      } catch (err: any) {
        setError('設定の読み込みに失敗しました: ' + (err.message || '不明なエラー'));
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // ダークモード切り替え
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // ローカルストレージに保存
    try {
      localStorage.setItem('darkMode', String(newDarkMode));
    } catch (storageError) {
      console.warn('ローカルストレージへの保存エラー:', storageError);
      // ストレージエラーがあっても続行
    }

    // HTML要素にクラスを適用
    try {
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (domError) {
      console.warn('DOM操作エラー:', domError);
    }
  };

  // 通知設定の変更ハンドラー
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 表示設定の変更ハンドラー
  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setDisplaySettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(newValue) : newValue,
    }));
  };

  // 設定保存ハンドラー
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user && user.id) {
        // 通知設定の保存
        await axios.put(
          `${API_BASE_URL}/users/${user.id}/notification-settings`,
          notificationSettings
        );

        // 表示設定の保存
        await axios.put(`${API_BASE_URL}/users/${user.id}/display-settings`, displaySettings);

        setSuccess('設定を保存しました');
        setTimeout(() => setSuccess(null), 3000);
      }

      setLoading(false);
    } catch (err: any) {
      setError('設定の保存に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };

  // 現在のモードに基づいたスタイルを取得
  const styles = darkMode ? darkModeStyles : lightModeStyles;

  return (
    <div className={`p-4 ${styles.body}`}>
      <h1 className={`text-2xl font-bold mb-6 ${styles.text.primary}`}>設定</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} className="mb-4" />}

      <div className={`p-4 rounded-lg shadow-md mb-6 ${styles.card}`}>
        <h2 className={`text-xl font-semibold mb-4 ${styles.text.primary}`}>表示設定</h2>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className={`font-medium ${styles.text.secondary}`}>ダークモード</label>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="darkMode"
                id="darkMode"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                style={{
                  top: '0',
                  right: darkMode ? '0' : '6px',
                  transition: 'right 0.2s ease-in-out',
                  backgroundColor: darkMode ? '#4F46E5' : '#fff',
                  borderColor: darkMode ? '#4F46E5' : '#D1D5DB',
                }}
              />
              <label
                htmlFor="darkMode"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${darkMode ? 'bg-indigo-300' : 'bg-gray-300'}`}
              ></label>
            </div>
          </div>
          <p className={`text-sm mt-1 ${styles.text.muted}`}>
            ダークモードを有効にすると、画面の背景が暗くなります
          </p>
        </div>

        <div className="mb-4">
          <label className={`block font-medium mb-1 ${styles.text.secondary}`}>
            1ページあたりの表示件数
          </label>
          <select
            name="itemsPerPage"
            value={displaySettings.itemsPerPage}
            onChange={handleDisplayChange}
            className={`w-full p-2 border rounded-md ${styles.input}`}
          >
            <option value={5}>5件</option>
            <option value={10}>10件</option>
            <option value={20}>20件</option>
            <option value={50}>50件</option>
            <option value={100}>100件</option>
          </select>
        </div>

        <div className="mb-4">
          <label className={`block font-medium mb-1 ${styles.text.secondary}`}>
            デフォルト表示
          </label>
          <select
            name="defaultView"
            value={displaySettings.defaultView}
            onChange={handleDisplayChange}
            className={`w-full p-2 border rounded-md ${styles.input}`}
          >
            <option value="list">リスト表示</option>
            <option value="grid">グリッド表示</option>
            <option value="kanban">カンバン表示</option>
          </select>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="compactMode"
              name="compactMode"
              checked={displaySettings.compactMode}
              onChange={handleDisplayChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="compactMode" className={`ml-2 block ${styles.text.secondary}`}>
              コンパクトモード
            </label>
          </div>
          <p className={`text-sm mt-1 ${styles.text.muted}`}>
            UI要素の間隔を狭くして、より多くの情報を表示します
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showFilters"
              name="showFilters"
              checked={displaySettings.showFilters}
              onChange={handleDisplayChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showFilters" className={`ml-2 block ${styles.text.secondary}`}>
              フィルターを常に表示
            </label>
          </div>
          <p className={`text-sm mt-1 ${styles.text.muted}`}>
            リスト画面でフィルターパネルを常に表示します
          </p>
        </div>
      </div>

      <div className={`p-4 rounded-lg shadow-md mb-6 ${styles.card}`}>
        <h2 className={`text-xl font-semibold mb-4 ${styles.text.primary}`}>通知設定</h2>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={notificationSettings.emailNotifications}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className={`ml-2 block ${styles.text.secondary}`}>
              メール通知
            </label>
          </div>
          <p className={`text-sm mt-1 ${styles.text.muted}`}>重要な通知をメールで受け取ります</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="appNotifications"
              name="appNotifications"
              checked={notificationSettings.appNotifications}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="appNotifications" className={`ml-2 block ${styles.text.secondary}`}>
              アプリ内通知
            </label>
          </div>
          <p className={`text-sm mt-1 ${styles.text.muted}`}>アプリ内で通知を受け取ります</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="dailyDigest"
              name="dailyDigest"
              checked={notificationSettings.dailyDigest}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="dailyDigest" className={`ml-2 block ${styles.text.secondary}`}>
              デイリーダイジェスト
            </label>
          </div>
          <p className={`text-sm mt-1 ${styles.text.muted}`}>
            1日1回、すべての通知をまとめて受け取ります
          </p>
        </div>

        <h3 className={`font-semibold mt-4 mb-2 ${styles.text.secondary}`}>通知を受け取る項目</h3>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyOnProjectChanges"
              name="notifyOnProjectChanges"
              checked={notificationSettings.notifyOnProjectChanges}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="notifyOnProjectChanges"
              className={`ml-2 block ${styles.text.secondary}`}
            >
              案件の変更
            </label>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyOnApplicationChanges"
              name="notifyOnApplicationChanges"
              checked={notificationSettings.notifyOnApplicationChanges}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="notifyOnApplicationChanges"
              className={`ml-2 block ${styles.text.secondary}`}
            >
              応募状況の変更
            </label>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyOnApprovalRequests"
              name="notifyOnApprovalRequests"
              checked={notificationSettings.notifyOnApprovalRequests}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="notifyOnApprovalRequests"
              className={`ml-2 block ${styles.text.secondary}`}
            >
              承認リクエスト
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="primary"
          onClick={handleSaveSettings}
          disabled={loading}
          className={styles.button.primary}
        >
          {loading ? '保存中...' : '設定を保存'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
