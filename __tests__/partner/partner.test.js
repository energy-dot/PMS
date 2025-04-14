import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// パートナー管理のモックコンポーネント
const TestPartnerComponent = () => {
  const [partners, setPartners] = React.useState([
    { id: '1', name: '株式会社テックパートナー', address: '東京都千代田区丸の内1-1-1', phone: '03-1111-2222', email: 'info@techpartner.example.com', businessCategory: 'システム開発' },
    { id: '2', name: 'デザインクリエイト株式会社', address: '東京都渋谷区神宮前2-2-2', phone: '03-3333-4444', email: 'info@designcreate.example.com', businessCategory: 'デザイン' },
    { id: '3', name: 'インフラソリューション株式会社', address: '東京都新宿区西新宿3-3-3', phone: '03-5555-6666', email: 'info@infrasolution.example.com', businessCategory: 'インフラ構築' }
  ]);
  const [selectedPartner, setSelectedPartner] = React.useState(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });
  
  const handleAddPartner = () => {
    setSelectedPartner(null);
    setIsFormVisible(true);
  };
  
  const handleEditPartner = (id) => {
    const partner = partners.find(p => p.id === id);
    setSelectedPartner(partner);
    setIsFormVisible(true);
  };
  
  const handleSavePartner = async (formData) => {
    try {
      if (selectedPartner) {
        // 編集の場合
        const response = await fetch(`/api/partners/${selectedPartner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          const updatedPartner = await response.json();
          setPartners(partners.map(p => p.id === updatedPartner.id ? updatedPartner : p));
          setMessage({ type: 'success', text: 'パートナー情報が正常に更新されました' });
        } else {
          setMessage({ type: 'error', text: '更新中にエラーが発生しました' });
        }
      } else {
        // 新規登録の場合
        const response = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          const newPartner = await response.json();
          setPartners([...partners, newPartner]);
          setMessage({ type: 'success', text: 'パートナーが正常に登録されました' });
        } else {
          setMessage({ type: 'error', text: '登録中にエラーが発生しました' });
        }
      }
      
      setIsFormVisible(false);
    } catch (error) {
      setMessage({ type: 'error', text: `エラーが発生しました: ${error.message}` });
    }
  };
  
  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch(`/api/partners?search=${searchTerm}`);
      if (response.ok) {
        const searchResults = await response.json();
        setPartners(searchResults);
      } else {
        setMessage({ type: 'error', text: '検索中にエラーが発生しました' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `エラーが発生しました: ${error.message}` });
    }
  };
  
  return (
    <div>
      <h1>パートナー管理</h1>
      <div className="partner-actions">
        <button data-testid="add-partner-button" onClick={handleAddPartner}>新規パートナー登録</button>
        <div className="search-container">
          <input data-testid="search-input" type="text" placeholder="パートナー名で検索" />
          <button data-testid="search-button" onClick={() => handleSearch(document.querySelector('[data-testid="search-input"]').value)}>検索</button>
        </div>
      </div>
      
      {message.text && (
        <div data-testid={`${message.type}-message`} className={`${message.type}-message`}>
          {message.text}
        </div>
      )}
      
      {isFormVisible ? (
        <div data-testid="partner-form" className="partner-form">
          <h2>{selectedPartner ? 'パートナー編集' : '新規パートナー登録'}</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              name: e.target.name.value,
              address: e.target.address.value,
              phone: e.target.phone.value,
              email: e.target.email.value,
              businessCategory: e.target.businessCategory.value
            };
            handleSavePartner(formData);
          }}>
            <div>
              <label htmlFor="name">名前</label>
              <input data-testid="name-input" id="name" name="name" defaultValue={selectedPartner?.name || ''} required />
            </div>
            <div>
              <label htmlFor="address">住所</label>
              <input data-testid="address-input" id="address" name="address" defaultValue={selectedPartner?.address || ''} required />
            </div>
            <div>
              <label htmlFor="phone">電話番号</label>
              <input data-testid="phone-input" id="phone" name="phone" defaultValue={selectedPartner?.phone || ''} required />
            </div>
            <div>
              <label htmlFor="email">メールアドレス</label>
              <input data-testid="email-input" id="email" name="email" type="email" defaultValue={selectedPartner?.email || ''} required />
            </div>
            <div>
              <label htmlFor="businessCategory">業種</label>
              <select data-testid="business-category-select" id="businessCategory" name="businessCategory" defaultValue={selectedPartner?.businessCategory || ''} required>
                <option value="">選択してください</option>
                <option value="システム開発">システム開発</option>
                <option value="インフラ構築">インフラ構築</option>
                <option value="デザイン">デザイン</option>
                <option value="コンサルティング">コンサルティング</option>
              </select>
            </div>
            <div>
              <button data-testid="save-button" type="submit">保存</button>
              <button data-testid="cancel-button" type="button" onClick={() => setIsFormVisible(false)}>キャンセル</button>
            </div>
          </form>
        </div>
      ) : (
        <table data-testid="partner-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>住所</th>
              <th>電話番号</th>
              <th>メール</th>
              <th>業種</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(partner => (
              <tr key={partner.id} data-testid={`partner-row-${partner.id}`}>
                <td>{partner.id}</td>
                <td>{partner.name}</td>
                <td>{partner.address}</td>
                <td>{partner.phone}</td>
                <td>{partner.email}</td>
                <td>{partner.businessCategory}</td>
                <td>
                  <button data-testid={`edit-button-${partner.id}`} onClick={() => handleEditPartner(partner.id)}>編集</button>
                  <button data-testid={`detail-button-${partner.id}`}>詳細</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// モックAPI
global.fetch = jest.fn((url, options) => {
  if (url.includes('/api/partners') && !options) {
    // 検索リクエスト
    const searchTerm = url.split('search=')[1];
    if (searchTerm === 'デザイン') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: '2', name: 'デザインクリエイト株式会社', address: '東京都渋谷区神宮前2-2-2', phone: '03-3333-4444', email: 'info@designcreate.example.com', businessCategory: 'デザイン' }
        ])
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    });
  } else if (url.includes('/api/partners') && options?.method === 'POST') {
    // 新規登録リクエスト
    const partnerData = JSON.parse(options.body);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: '4',
        ...partnerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    });
  } else if (url.includes('/api/partners/') && options?.method === 'PUT') {
    // 更新リクエスト
    const partnerId = url.split('/api/partners/')[1];
    const partnerData = JSON.parse(options.body);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: partnerId,
        ...partnerData,
        updatedAt: new Date().toISOString()
      })
    });
  }
  return Promise.reject(new Error('API not mocked'));
});

// React をグローバルに定義
global.React = {
  useState: jest.fn((initialValue) => [initialValue, jest.fn()]),
  useEffect: jest.fn(),
  useRef: jest.fn(() => ({ current: null })),
  useCallback: jest.fn((fn) => fn),
  useMemo: jest.fn((fn) => fn()),
  createContext: jest.fn(),
  useContext: jest.fn()
};

// useState のモックを上書き
global.React.useState = jest.fn((initialValue) => {
  const setStateMock = jest.fn((newValue) => {
    stateMock[0] = typeof newValue === 'function' ? newValue(stateMock[0]) : newValue;
    return stateMock[0];
  });
  const stateMock = [initialValue, setStateMock];
  return stateMock;
});

describe('パートナー管理機能のテスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('PARTNER-001: パートナー一覧が表示されること', () => {
    render(<TestPartnerComponent />);
    
    // パートナー一覧テーブルが表示されていることを確認
    expect(screen.getByTestId('partner-table')).toBeInTheDocument();
    
    // 3つのパートナーが表示されていることを確認
    expect(screen.getByTestId('partner-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('partner-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('partner-row-3')).toBeInTheDocument();
    
    // パートナー情報が正しく表示されていることを確認
    expect(screen.getByText('株式会社テックパートナー')).toBeInTheDocument();
    expect(screen.getByText('デザインクリエイト株式会社')).toBeInTheDocument();
    expect(screen.getByText('インフラソリューション株式会社')).toBeInTheDocument();
  });
  
  test('PARTNER-002: 新規パートナー登録フォームが表示されること', () => {
    render(<TestPartnerComponent />);
    
    // 新規パートナー登録ボタンをクリック
    fireEvent.click(screen.getByTestId('add-partner-button'));
    
    // フォームが表示されることを確認
    expect(screen.getByTestId('partner-form')).toBeInTheDocument();
    expect(screen.getByText('新規パートナー登録')).toBeInTheDocument();
    
    // 入力フィールドが空であることを確認
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('address-input')).toHaveValue('');
    expect(screen.getByTestId('phone-input')).toHaveValue('');
    expect(screen.getByTestId('email-input')).toHaveValue('');
  });
  
  test('PARTNER-003: パートナー情報を編集できること', async () => {
    render(<TestPartnerComponent />);
    
    // 編集ボタンをクリック
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // フォームが表示されることを確認
    expect(screen.getByTestId('partner-form')).toBeInTheDocument();
    expect(screen.getByText('パートナー編集')).toBeInTheDocument();
    
    // 入力フィールドに既存のデータが入力されていることを確認
    expect(screen.getByTestId('name-input')).toHaveValue('株式会社テックパートナー');
    expect(screen.getByTestId('address-input')).toHaveValue('東京都千代田区丸の内1-1-1');
    expect(screen.getByTestId('phone-input')).toHaveValue('03-1111-2222');
    expect(screen.getByTestId('email-input')).toHaveValue('info@techpartner.example.com');
    
    // データを編集
    fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '03-1111-3333' } });
    
    // 保存ボタンをクリック
    fireEvent.click(screen.getByTestId('save-button'));
    
    // APIリクエストが送信されたことを確認
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/partners/1', expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('03-1111-3333')
      }));
    });
    
    // 成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByTestId('success-message')).toHaveTextContent('パートナー情報が正常に更新されました');
    });
  });
  
  test('PARTNER-004: パートナーを検索できること', async () => {
    render(<TestPartnerComponent />);
    
    // 検索ボックスに入力
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'デザイン' } });
    
    // 検索ボタンをクリック
    fireEvent.click(screen.getByTestId('search-button'));
    
    // APIリクエストが送信されたことを確認
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/partners?search=デザイン');
    });
    
    // 検索結果が表示されることを確認（モックAPIの応答に基づく）
    await waitFor(() => {
      expect(screen.getByText('デザインクリエイト株式会社')).toBeInTheDocument();
      expect(screen.queryByText('株式会社テックパートナー')).not.toBeInTheDocument();
      expect(screen.queryByText('インフラソリューション株式会社')).not.toBeInTheDocument();
    });
  });
  
  test('PARTNER-005: 新規パートナーを登録できること', async () => {
    render(<TestPartnerComponent />);
    
    // 新規パートナー登録ボタンをクリック
    fireEvent.click(screen.getByTestId('add-partner-button'));
    
    // フォームが表示されることを確認
    expect(screen.getByTestId('partner-form')).toBeInTheDocument();
    
    // フォームに入力
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'テストパートナー株式会社' } });
    fireEvent.change(screen.getByTestId('address-input'), { target: { value: '東京都渋谷区渋谷1-1-1' } });
    fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '03-1234-5678' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'info@testpartner.example.com' } });
    fireEvent.change(screen.getByTestId('business-category-select'), { target: { value: 'システム開発' } });
    
    // 保存ボタンをクリック
    fireEvent.click(screen.getByTestId('save-button'));
    
    // APIリクエストが送信されたことを確認
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/partners', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('テストパートナー株式会社')
      }));
    });
    
    // 成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByTestId('success-message')).toHaveTextContent('パートナーが正常に登録されました');
    });
  });
});
