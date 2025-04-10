import React from 'react';
import { AgGridReactProps } from 'ag-grid-react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataGridProps extends AgGridReactProps {
  height?: number | string;
  width?: number | string;
}

const DataGrid: React.FC<DataGridProps> = ({
  height = 500,
  width = '100%',
  pagination = true,
  paginationPageSize = 10,
  ...rest
}) => {
  return (
    <div className="ag-theme-alpine" style={{ height, width }}>
      <AgGridReact
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        {...rest}
      />
    </div>
  );
};

export default DataGrid;
