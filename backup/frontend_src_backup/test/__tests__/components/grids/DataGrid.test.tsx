import React from 'react';
import { render, screen } from '@testing-library/react';
import DataGrid from '../../../../components/grids/DataGrid';

// ag-grid-react のモック
jest.mock('ag-grid-react', () => ({
  AgGridReact: jest.fn().mockImplementation(props => (
    <div data-testid="mock-ag-grid" data-props={JSON.stringify(props)}>
      AG Grid Component
    </div>
  ))
}));

describe('DataGrid Component', () => {
  // 基本的なレンダリングテスト
  test('renders data grid with default props', () => {
    render(<DataGrid rowData={[]} columnDefs={[]} />);
    
    // データグリッドが表示されていることを確認
    expect(screen.getByTestId('mock-ag-grid')).toBeInTheDocument();
    
    // コンテナが正しいテーマクラスを持っていることを確認
    const container = screen.getByTestId('mock-ag-grid').parentElement;
    expect(container).toHaveClass('ag-theme-alpine');
  });

  // デフォルトのスタイルプロパティテスト
  test('applies default height and width styles', () => {
    render(<DataGrid rowData={[]} columnDefs={[]} />);
    
    // コンテナが正しいスタイルを持っていることを確認
    const container = screen.getByTestId('mock-ag-grid').parentElement;
    expect(container).toHaveStyle('height: 500px');
    expect(container).toHaveStyle('width: 100%');
  });

  // カスタムスタイルプロパティテスト
  test('applies custom height and width styles', () => {
    render(<DataGrid rowData={[]} columnDefs={[]} height={300} width="80%" />);
    
    // コンテナが正しいスタイルを持っていることを確認
    const container = screen.getByTestId('mock-ag-grid').parentElement;
    expect(container).toHaveStyle('height: 300px');
    expect(container).toHaveStyle('width: 80%');
  });

  // デフォルトのページネーションプロパティテスト
  test('passes default pagination props to AgGridReact', () => {
    render(<DataGrid rowData={[]} columnDefs={[]} />);
    
    // AgGridReactに正しいプロパティが渡されていることを確認
    const agGrid = screen.getByTestId('mock-ag-grid');
    const props = JSON.parse(agGrid.getAttribute('data-props') || '{}');
    
    expect(props.pagination).toBe(true);
    expect(props.paginationPageSize).toBe(10);
  });

  // カスタムのページネーションプロパティテスト
  test('passes custom pagination props to AgGridReact', () => {
    render(
      <DataGrid 
        rowData={[]} 
        columnDefs={[]} 
        pagination={false} 
        paginationPageSize={20} 
      />
    );
    
    // AgGridReactに正しいプロパティが渡されていることを確認
    const agGrid = screen.getByTestId('mock-ag-grid');
    const props = JSON.parse(agGrid.getAttribute('data-props') || '{}');
    
    expect(props.pagination).toBe(false);
    expect(props.paginationPageSize).toBe(20);
  });

  // データプロパティの受け渡しテスト
  test('passes row and column data to AgGridReact', () => {
    const rowData = [{ id: 1, name: 'Test' }];
    const columnDefs = [{ field: 'id' }, { field: 'name' }];
    
    render(<DataGrid rowData={rowData} columnDefs={columnDefs} />);
    
    // AgGridReactに正しいデータプロパティが渡されていることを確認
    const agGrid = screen.getByTestId('mock-ag-grid');
    const props = JSON.parse(agGrid.getAttribute('data-props') || '{}');
    
    expect(props.rowData).toEqual(rowData);
    expect(props.columnDefs).toEqual(columnDefs);
  });

  // その他のプロパティの受け渡しテスト
  test('passes additional props to AgGridReact', () => {
    render(
      <DataGrid 
        rowData={[]} 
        columnDefs={[]} 
        domLayout="autoHeight"
        rowSelection="multiple"
      />
    );
    
    // AgGridReactに追加のプロパティが渡されていることを確認
    const agGrid = screen.getByTestId('mock-ag-grid');
    const props = JSON.parse(agGrid.getAttribute('data-props') || '{}');
    
    expect(props.domLayout).toBe('autoHeight');
    expect(props.rowSelection).toBe('multiple');
  });
});
