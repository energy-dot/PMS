declare module 'exceljs' {
  export class Workbook {
    constructor();
    
    addWorksheet(name: string): Worksheet;
    
    xlsx: {
      write(stream: any): Promise<void>;
    };
  }
  
  export class Worksheet {
    mergeCells(range: string): void;
    getCell(address: string): Cell;
    addRow(data?: any[]): Row;
    columns: Column[];
    rowCount: number;
  }
  
  export class Cell {
    value: any;
    font?: any;
    fill?: any;
    border?: any;
    alignment?: any;
  }
  
  export class Row {
    eachCell(callback: (cell: Cell, colNumber: number) => void): void;
  }
  
  export interface Column {
    width?: number;
  }
}
