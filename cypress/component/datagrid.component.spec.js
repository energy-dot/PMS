// cypress/component/datagrid.component.spec.js
import React from 'react';
import DataGrid from '../../frontend/src/components/grids/DataGrid';

describe('DataGrid Component', () => {
  beforeEach(() => {
    // モックデータをロード
    cy.fixture('mock-grid-data.json').then((gridData) => {
      cy.wrap(gridData[0].columnDefs).as('columnDefs');
      cy.wrap(gridData[0].rowData).as('rowData');
    });
  });

  it('基本的なレンダリングが正常に行われること', () => {
    // 最もシンプルなテストケースから始める
    cy.get('@columnDefs').then((columnDefs) => {
      cy.get('@rowData').then((rowData) => {
        cy.mountWithProviders(
          <DataGrid 
            rowData={rowData} 
            columnDefs={columnDefs}
            title="テストデータグリッド"
          />
        );

        // タイトルが表示されていることを確認
        cy.contains('テストデータグリッド').should('be.visible');
        
        // ag-Gridが正しくレンダリングされていることを確認
        cy.get('.ag-root-wrapper').should('exist');
      });
    });
  });
});
