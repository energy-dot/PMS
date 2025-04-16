import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ICellEditorParams } from 'ag-grid-community';

interface TagEditorProps extends ICellEditorParams {
  availableTags?: string[]; // 選択可能なタグリスト（オプション）
  delimiter?: string; // タグ区切り文字（デフォルトはカンマ）
  maxTags?: number; // 最大タグ数（オプション）
}

/**
 * ag-Grid用のカスタムタグエディタコンポーネント
 * セル内で複数のタグを入力・選択できる
 */
const TagEditor = forwardRef((props: TagEditorProps, ref) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // デフォルト設定
  const delimiter = props.delimiter || ',';
  const maxTags = props.maxTags || 0; // 0は無制限
  const availableTags = props.availableTags || [];

  // 初期値の設定
  useEffect(() => {
    if (props.value) {
      // 文字列の場合はデリミタで分割
      if (typeof props.value === 'string') {
        setTags(
          props.value
            .split(delimiter)
            .map(tag => tag.trim())
            .filter(Boolean)
        );
      }
      // 配列の場合はそのまま使用
      else if (Array.isArray(props.value)) {
        setTags(props.value.map(String));
      }
    } else {
      setTags([]);
    }

    // フォーカスを当てる
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.value, delimiter]);

  // 親コンポーネント(ag-Grid)から呼び出せるメソッドを定義
  useImperativeHandle(ref, () => {
    return {
      // エディタの値を取得
      getValue() {
        // デリミタで結合して返す
        return tags.join(delimiter + ' ');
      },

      // フォーカス時の挙動
      afterGuiAttached() {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },

      // 入力がないときの扱い
      isPopup() {
        // ポップアップとして扱わないようにfalseを返す
        return false;
      },
    };
  });

  // 入力値が変更された時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // サジェスト候補を更新
    if (value.trim() && availableTags.length > 0) {
      const filtered = availableTags.filter(
        tag => tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // キー入力時の処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // バックスペースキー: 入力が空の場合、最後のタグを削除
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
      return;
    }

    // タグ追加: Enter, Tab, デリミタ
    if ((e.key === 'Enter' || e.key === 'Tab' || e.key === delimiter) && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
      return;
    }

    // ESCキー: サジェスト非表示
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // タグ追加
  const addTag = (value: string) => {
    // カンマ区切りの場合は複数タグとして扱う
    const newTags = value
      .split(delimiter)
      .map(tag => tag.trim())
      .filter(tag => tag && !tags.includes(tag));

    if (newTags.length > 0) {
      // 最大タグ数のチェック
      if (maxTags > 0 && tags.length + newTags.length > maxTags) {
        alert(`タグは最大${maxTags}個までです`);
        return;
      }

      setTags([...tags, ...newTags]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // タグ削除
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // サジェスト選択
  const selectSuggestion = (suggestion: string) => {
    addTag(suggestion);
    setShowSuggestions(false);

    // 入力にフォーカスを戻す
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 外部クリックを検知してサジェストを閉じる
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="tag-editor-container w-full h-full p-1 bg-white border-2 border-blue-500 rounded-sm flex flex-wrap items-center gap-1 overflow-y-auto relative"
    >
      {/* タグ表示エリア */}
      {tags.map((tag, index) => (
        <div
          key={index}
          className="tag-item bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center"
        >
          <span className="tag-text mr-1">{tag}</span>
          <button
            type="button"
            className="tag-remove-btn text-blue-600 hover:text-blue-800 focus:outline-none"
            onClick={() => removeTag(tag)}
            title="タグを削除"
          >
            &times;
          </button>
        </div>
      ))}

      {/* 入力エリア */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? 'タグを入力...' : ''}
        className="tag-input flex-grow outline-none border-none px-1 py-0.5 text-sm min-w-[50px]"
        style={{ width: 'auto', minWidth: '50px' }}
      />

      {/* サジェスト候補 */}
      {showSuggestions && (
        <div
          className="suggestions absolute left-0 mt-1 w-full bg-white shadow-lg rounded-md py-1 z-10 border border-gray-300 max-h-40 overflow-y-auto"
          style={{ top: '100%' }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item px-3 py-1 text-sm hover:bg-blue-50 cursor-pointer"
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default TagEditor;
