// utils/validation.ts
// フォームバリデーション用のユーティリティ関数

/**
 * バリデーションエラーの型定義
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * バリデーションルールの型定義
 */
export interface ValidationRule {
  field: string;
  label: string;
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    match?: string;
    min?: number;
    max?: number;
    custom?: (value: any, formData: Record<string, any>) => string | null;
  };
}

/**
 * フォームデータのバリデーションを行う関数
 * @param formData フォームデータ
 * @param rules バリデーションルール
 * @returns バリデーションエラーの配列
 */
export const validateForm = (
  formData: Record<string, any>,
  rules: ValidationRule[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  rules.forEach((rule) => {
    const value = formData[rule.field];
    const { required, minLength, maxLength, pattern, email, match, min, max, custom } = rule.rules;

    // 必須チェック
    if (required && (value === undefined || value === null || value === '')) {
      errors[rule.field] = `${rule.label}は必須です`;
      return;
    }

    // 以降のチェックは値が存在する場合のみ行う
    if (value === undefined || value === null || value === '') {
      return;
    }

    // 文字列の場合のチェック
    if (typeof value === 'string') {
      // 最小文字数チェック
      if (minLength !== undefined && value.length < minLength) {
        errors[rule.field] = `${rule.label}は${minLength}文字以上で入力してください`;
        return;
      }

      // 最大文字数チェック
      if (maxLength !== undefined && value.length > maxLength) {
        errors[rule.field] = `${rule.label}は${maxLength}文字以下で入力してください`;
        return;
      }

      // パターンチェック
      if (pattern && !pattern.test(value)) {
        errors[rule.field] = `${rule.label}の形式が正しくありません`;
        return;
      }

      // メールアドレスチェック
      if (email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value)) {
          errors[rule.field] = `${rule.label}の形式が正しくありません`;
          return;
        }
      }

      // 一致チェック
      if (match && value !== formData[match]) {
        errors[rule.field] = `${rule.label}が一致しません`;
        return;
      }
    }

    // 数値の場合のチェック
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      const numValue = typeof value === 'number' ? value : Number(value);

      // 最小値チェック
      if (min !== undefined && numValue < min) {
        errors[rule.field] = `${rule.label}は${min}以上で入力してください`;
        return;
      }

      // 最大値チェック
      if (max !== undefined && numValue > max) {
        errors[rule.field] = `${rule.label}は${max}以下で入力してください`;
        return;
      }
    }

    // カスタムバリデーション
    if (custom) {
      const customError = custom(value, formData);
      if (customError) {
        errors[rule.field] = customError;
        return;
      }
    }
  });

  return errors;
};

/**
 * パスワード強度を検証する関数
 * @param password パスワード
 * @returns パスワード強度のスコア（0-4）と、メッセージ
 */
export const validatePasswordStrength = (password: string): { score: number; message: string } => {
  if (!password) {
    return { score: 0, message: 'パスワードを入力してください' };
  }

  let score = 0;
  const messages: string[] = [];

  // 長さチェック
  if (password.length >= 8) {
    score += 1;
  } else {
    messages.push('8文字以上');
  }

  // 大文字を含むかチェック
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    messages.push('大文字を含む');
  }

  // 小文字を含むかチェック
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    messages.push('小文字を含む');
  }

  // 数字を含むかチェック
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    messages.push('数字を含む');
  }

  // 特殊文字を含むかチェック
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    messages.push('特殊文字を含む');
  }

  // メッセージの生成
  let message = '';
  if (score < 3) {
    message = `パスワードが弱すぎます。${messages.join('、')}必要があります。`;
  } else if (score === 3) {
    message = 'パスワード強度：普通';
  } else if (score === 4) {
    message = 'パスワード強度：強い';
  } else {
    message = 'パスワード強度：非常に強い';
  }

  return { score, message };
};

/**
 * 日付形式を検証する関数
 * @param dateString 日付文字列
 * @returns エラーメッセージまたはnull
 */
export const validateDate = (dateString: string): string | null => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '有効な日付形式ではありません';
  }

  return null;
};

/**
 * 電話番号形式を検証する関数
 * @param phone 電話番号
 * @returns エラーメッセージまたはnull
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return null;
  }

  // 日本の電話番号形式（ハイフンあり・なし両対応）
  const phonePattern = /^(0\d{1,4}-\d{1,4}-\d{4}|\d{10,11})$/;
  if (!phonePattern.test(phone)) {
    return '有効な電話番号形式ではありません';
  }

  return null;
};

/**
 * 郵便番号形式を検証する関数
 * @param postalCode 郵便番号
 * @returns エラーメッセージまたはnull
 */
export const validatePostalCode = (postalCode: string): string | null => {
  if (!postalCode) {
    return null;
  }

  // 日本の郵便番号形式（ハイフンあり・なし両対応）
  const postalCodePattern = /^(\d{3}-\d{4}|\d{7})$/;
  if (!postalCodePattern.test(postalCode)) {
    return '有効な郵便番号形式ではありません';
  }

  return null;
};
