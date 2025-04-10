import '@testing-library/jest-dom';

// TextEncoder/TextDecoderのポリフィル
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// React Router用のモック
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: function BrowserRouter(props) { return props.children; },
  Routes: function Routes(props) { return props.children; },
  Route: function Route(props) { return props.children; },
  Navigate: function Navigate() { return null; },
  Outlet: function Outlet() { return null; },
  useNavigate: () => jest.fn(),
  Link: function Link(props) { return props.children; }
}));

// Zustandストアのモック
jest.mock('./store/authStore', () => ({
  useAuthStore: jest.fn().mockReturnValue({
    user: { id: '1', name: '管理者', role: 'admin' },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    clearError: jest.fn()
  })
}));
