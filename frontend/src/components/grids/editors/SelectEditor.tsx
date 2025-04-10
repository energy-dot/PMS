import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ICellEditorParams } from 'ag-grid-community';

interface SelectEditorProps extends ICellEditorParams {
  values: string[];
  valueLabels?: Record<string, string>; // オプションの値とラベルのマッピング
  allowEmpty?: boolean; // 空の選択を許可するかどうか
  emptyText?: string; // 空の選択のテキスト
  width?: string | number; // 選択ボックスの幅
}

/**
 * ag-Grid用のカスタムセレクトエディタコンポーネント
 * セル内でドロップダウンリストを表示する
 */
const SelectEditor = forwardRef((props: SelectEditorProps, ref) => {
  const [value, setValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // デフォルト値の設定
  const allowEmpty = props.allowEmpty !== undefined ? props.allowEmpty : true;
  const emptyText = props.emptyText || '選択してください';
  const width = props.width || '100%';

  // 初期値の設定
  useEffect(() => {
    setValue(props.value ? props.value.toString() : '');
    
    // フォーカスを当てる
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, [props.value]);

  // 親コンポーネント(ag-Grid)から呼び出せるメソッドを定義
  useImperativeHandle(ref, () => {
    return {
      // エディタの値を取得
      getValue() {
        return value;
      },
      
      // フォーカス時の挙動
      afterGuiAttached() {
        if (selectRef.current) {
          selectRef.current.focus();
          // セレクトボックスを開く
          setTimeout(() => {
            if (selectRef.current) {
              try {
                selectRef.current.click();
              } catch (e) {
                console.error('Failed to click select element', e);
              }
            }
          }, 50);
        }
      },
      
      // 入力がないときの扱い
      isPopup() {
        return false;
      }
    };
  });

  // 値が変更された時の処理
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
    setIsOpen(false);
    
    // 値が変更された場合、セルの編集を完了するために少し遅延させる
    setTimeout(() => {
      try {
        if (props.api) {
          props.api.stopEditing();
        }
      } catch (e) {
        console.error('Failed to stop editing', e);
      }
    }, 100);
  };

  // クリックハンドラ
  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  // 外部クリックを検知してドロップダウンを閉じる
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // スタイリング
  const selectStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    padding: '2px 4px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
  };

  return (
    <div className="select-editor-wrapper relative" ref={wrapperRef}>
      <select
        ref={selectRef}
        value={value}
        onChange={handleChange}
        onClick={handleSelectClick}
        className="w-full h-full px-2 py-1 outline-none border-2 border-blue-500 rounded-sm bg-white"
        style={selectStyle}
      >
        {allowEmpty && (
          <option value="" disabled={!allowEmpty}>{emptyText}</option>
        )}
        {props.values.map((option) => (
          <option key={option} value={option}>
            {props.valueLabels ? props.valueLabels[option] : option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
});

export default SelectEditor;