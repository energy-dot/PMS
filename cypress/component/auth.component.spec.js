// cypress/component/auth.component.spec.js
import React from 'react';
import LoginForm from '../../frontend/src/components/common/LoginForm';

describe('Auth Components', () => {
  beforeEach(() => {
    // モックデータをセットアップ
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-token-12345',
        user: {
          id: 1,
          username: 'testuser',
          role: 'admin'
        }
      }
    }).as('loginRequest');

    // フォームデータをロード
    cy.fixture('mock-form-data.json').then((formData) => {
      cy.wrap(formData[0]).as('loginForm');
    });
  });

  it('ログインフォームが正常にレンダリングされること', () => {
    // 最もシンプルなテストケースから始める
    cy.mountWithProviders(
      <LoginForm onLogin={cy.spy().as('loginSpy')} />
    );

    // フォーム要素が存在することを確認
    cy.get('form').should('exist');
    cy.get('input[type="text"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });
});
