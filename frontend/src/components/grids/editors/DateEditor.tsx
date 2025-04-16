import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ICellEditorParams } from 'ag-grid-community';

/**
 * ag-Grid用のカスタム日付エディタコンポーネント
 * セル内で日付ピッカーを表示する
 */
const DateEditor = forwardRef((props: ICellEditorParams, ref) => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初期値の設定
  useEffect(() => {
    // 値がDate型の場合はフォーマット
    if (props.value instanceof Date) {
      setValue(formatDateForInput(props.value));
    }
    // 値が文字列の場合は日付に変換を試みる
    else if (typeof props.value === 'string') {
      try {
        if (props.value) {
          const date = new Date(props.value);
          // 有効な日付かチェック
          if (!isNaN(date.getTime())) {
            setValue(formatDateForInput(date));
          } else {
            setValue('');
            setError('無効な日付形式です');
          }
        } else {
          setValue('');
        }
      } catch (e) {
        setValue('');
        setError('日付の変換に失敗しました');
      }
    }
    // 値がない場合は空文字
    else {
      setValue('');
    }

    // フォーカスを当てる
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.value]);

  // 親コンポーネント(ag-Grid)から呼び出せるメソッドを定義
  useImperativeHandle(ref, () => {
    return {
      // エディタの値を取得
      getValue() {
        // 値がない場合はnullを返す
        if (!value) return null;

        try {
          // 返す値はDate型に変換
          const date = new Date(value);

          // 有効な日付かチェック
          if (isNaN(date.getTime())) {
            setError('無効な日付形式です');
            return null;
          }

          return date;
        } catch (e) {
          setError('日付の変換に失敗しました');
          return null;
        }
      },

      // フォーカス時の挙動
      afterGuiAttached() {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      },

      // キーイベントの処理
      isCancelAfterEnd() {
        // 入力がない場合はキャンセル扱い
        return !value;
      },

      // 入力値の検証
      isPopup() {
        // カレンダーUIがページ上でフロートしていることを示す
        return false;
      },
    };
  });

  // 日付をinput[type="date"]用にフォーマット (YYYY-MM-DD)
  const formatDateForInput = (date: Date): string => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // 日付変更時の処理
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 入力値の検証
    if (newValue) {
      try {
        const date = new Date(newValue);
        if (isNaN(date.getTime())) {
          setError('無効な日付形式です');
        } else {
          setError(null);
        }
      } catch (e) {
        setError('日付の変換に失敗しました');
      }
    } else {
      setError(null);
    }
  };

  // 現在の日付を設定するヘルパーボタン
  const setTodayDate = () => {
    const today = new Date();
    setValue(formatDateForInput(today));
    setError(null);
  };

  return (
    <div className="ag-date-editor">
      <div className="flex items-center w-full">
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={handleDateChange}
          className={`w-full h-full px-2 py-1 outline-none border-2 ${error ? 'border-red-500' : 'border-blue-500'} rounded-sm`}
        />
        <button
          type="button"
          onClick={setTodayDate}
          className="ml-1 px-1 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 focus:outline-none"
          title="今日の日付を設定"
        >
          今日
        </button>
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
});

export default DateEditor;
