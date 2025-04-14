// cypress/support/test-providers.jsx
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

// Simple mock localStorage for tests
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => {
      return store[key] || null;
    },
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Basic test providers wrapper component
export const TestProviders = ({ children, initialEntries = ['/'] }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Setup global mocks before tests
export const setupGlobalMocks = () => {
  // Mock localStorage
  cy.window().then((win) => {
    Object.defineProperty(win, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });
};

// Mount component with all providers
export const mountWithProviders = (component, options = {}) => {
  const { initialEntries = ['/'], ...mountOptions } = options;
  
  // Setup global mocks
  setupGlobalMocks();
  
  // Mount with providers
  return cy.mount(
    <TestProviders initialEntries={initialEntries}>
      {component}
    </TestProviders>,
    mountOptions
  );
};
