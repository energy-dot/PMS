/// <reference types="vite/client" />

// AG-Gridのスタイルを適用するために追加のモジュール定義
declare module 'ag-grid-community/styles/ag-grid.css';
declare module 'ag-grid-community/styles/ag-theme-alpine.css';

// インラインCSSをJSXで使用するための型定義
declare namespace JSX {
  interface IntrinsicElements {
    'style': React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
  }
}
