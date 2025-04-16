import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ICellEditorParams } from 'ag-grid-community';

interface NumberEditorProps extends ICellEditorParams {
  min?: number; // 最小値
  max?: number; // 最大値
  step?: number; // ステップ値
  currency?: boolean; // 通貨表示
  currencySymbol?: string; // 通貨記号
  allowDecimals?: boolean; // 小数点を許可
  decimalPlaces?: number; // 小数点以下の桁数
  useThousandSeparator?: boolean; // 桁区切りを使用
}

/**
 * ag-Grid用のカスタム数値エディタコンポーネント
 * セル内で数値を編集する際に使用
 */
const NumberEditor = forwardRef((props: NumberEditorProps, ref) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [numericValue, setNumericValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // デフォルト設定
  const min = props.min !== undefined ? props.min : null;
  const max = props.max !== undefined ? props.max : null;
  const step = props.step || 1;
  const currency = props.currency || false;
  const currencySymbol = props.currencySymbol || '¥';
  const allowDecimals = props.allowDecimals !== undefined ? props.allowDecimals : true;
  const decimalPlaces = props.decimalPlaces !== undefined ? props.decimalPlaces : 0;
  const useThousandSeparator =
    props.useThousandSeparator !== undefined ? props.useThousandSeparator : true;

  // 入力値のパース
  const parseValue = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;

    let parsedValue: number;

    // 文字列型の場合
    if (typeof value === 'string') {
      // 通貨記号と桁区切りをクリーンアップ
      const cleanValue = value.replace(new RegExp(`[${currencySymbol}\\s,]`, 'g'), '').trim();

      parsedValue = Number(cleanValue);
    }
    // 数値型の場合
    else if (typeof value === 'number') {
      parsedValue = value;
    }
    // その他の型は変換を試みる
    else {
      parsedValue = Number(value);
    }

    // 無効な数値の場合
    if (isNaN(parsedValue)) {
      return null;
    }

    return parsedValue;
  };

  // 数値のフォーマット
  const formatValue = (value: number | null): string => {
    if (value === null) return '';

    let formatted: string;

    // 小数点以下の桁数を制限
    if (allowDecimals && decimalPlaces > 0) {
      formatted = value.toFixed(decimalPlaces);
    } else {
      formatted = Math.round(value).toString();
    }

    // 桁区切りを追加
    if (useThousandSeparator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formatted = parts.join('.');
    }

    // 通貨記号を追加
    if (currency) {
      formatted = `${currencySymbol}${formatted}`;
    }

    return formatted;
  };

  // 初期値の設定
  useEffect(() => {
    const parsedValue = parseValue(props.value);
    setNumericValue(parsedValue);

    // 編集開始時は整形せずそのまま表示（入力しやすいように）
    if (typeof props.value === 'string') {
      setDisplayValue(props.value);
    } else if (parsedValue !== null) {
      // 数値型の場合は文字列に変換
      setDisplayValue(String(parsedValue));
    } else {
      setDisplayValue('');
    }

    // フォーカスを当てる
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [props.value]);

  // 親コンポーネント(ag-Grid)から呼び出せるメソッドを定義
  useImperativeHandle(ref, () => {
    return {
      // エディタの値を取得
      getValue() {
        return numericValue;
      },

      // フォーカス時の挙動
      afterGuiAttached() {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      },

      // バリデーション
      isCancelBeforeStart() {
        return false;
      },

      // キーイベントの処理
      isCancelAfterEnd() {
        // エラーがある場合はキャンセル扱い
        return !!error;
      },
    };
  });

  // 入力値の検証
  const validateInput = (value: string): boolean => {
    // 空の場合はOK
    if (!value.trim()) {
      setError(null);
      return true;
    }

    // 数値に変換
    const cleanValue = value.replace(new RegExp(`[${currencySymbol}\\s,]`, 'g'), '').trim();

    // 数値のみ（小数点含む）の正規表現
    const numericRegex = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d*$/;

    // 数値形式のチェック
    if (!numericRegex.test(cleanValue)) {
      setError('有効な数値を入力してください');
      return false;
    }

    const numValue = parseFloat(cleanValue);

    // 範囲チェック
    if (min !== null && numValue < min) {
      setError(`${min}以上の値を入力してください`);
      return false;
    }

    if (max !== null && numValue > max) {
      setError(`${max}以下の値を入力してください`);
      return false;
    }

    setError(null);
    return true;
  };

  // 入力値変更時の処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayValue(value);

    // 検証
    if (validateInput(value)) {
      const parsed = parseValue(value);
      setNumericValue(parsed);
    }
  };

  // ステップボタンによる増減
  const stepValue = (amount: number) => {
    const currentValue = numericValue || 0;
    const newValue = currentValue + amount;

    // 範囲チェック
    if (min !== null && newValue < min) return;
    if (max !== null && newValue > max) return;

    setNumericValue(newValue);
    setDisplayValue(String(newValue));
    setError(null);
  };

  // Blur時の処理：値をフォーマット
  const handleBlur = () => {
    if (numericValue !== null) {
      setDisplayValue(formatValue(numericValue));
    }
  };

  return (
    <div className="number-editor-container">
      <div className="flex items-center w-full">
        {currency && (
          <div className="currency-symbol flex items-center justify-center px-2 bg-gray-100 border-2 border-r-0 border-blue-500 text-gray-500">
            {currencySymbol}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full h-full px-2 py-1 outline-none border-2 ${error ? 'border-red-500' : 'border-blue-500'} ${currency ? 'rounded-r-sm' : 'rounded-sm'}`}
          title={`Step: ${step}${min !== null ? `, Min: ${min}` : ''}${max !== null ? `, Max: ${max}` : ''}`}
        />

        <div className="flex flex-col ml-1">
          <button
            type="button"
            onClick={() => stepValue(step)}
            className="h-1/2 px-1 bg-blue-100 text-blue-800 text-xs rounded-t hover:bg-blue-200 focus:outline-none"
            title={`増加 (${step})`}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => stepValue(-step)}
            className="h-1/2 px-1 bg-blue-100 text-blue-800 text-xs rounded-b hover:bg-blue-200 focus:outline-none"
            title={`減少 (${step})`}
          >
            ▼
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
});

export default NumberEditor;
