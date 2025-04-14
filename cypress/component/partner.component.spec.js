// cypress/component/partner.component.spec.js
import React from 'react';
import PartnerList from '../../frontend/src/components/partner/PartnerList';

describe('Partner Components', () => {
  beforeEach(() => {
    // パートナーデータをロード
    cy.fixture('partners.json').then((partners) => {
      cy.wrap(partners).as('partners');
    });

    // APIモックのセットアップ
    cy.intercept('GET', '/api/partners*', (req) => {
      cy.get('@partners').then((partners) => {
        req.reply({
          statusCode: 200,
          body: {
            data: partners,
            total: partners.length,
            page: 1,
            limit: 10
          }
        });
      });
    }).as('getPartners');
  });

  describe('PartnerList Component', () => {
    it('パートナー一覧が正常にレンダリングされること', () => {
      // 最もシンプルなテストケースから始める
      cy.mountWithProviders(
        <PartnerList />
      );

      // APIリクエストが送信されたことを確認
      cy.wait('@getPartners');

      // データグリッドが表示されていることを確認
      cy.get('.ag-root-wrapper').should('exist');
    });
  });
});
