// src/services/apiUtils.ts
export const callWithRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    console.log(
      `API呼び出しに失敗しました。${delay}ms後に再試行します。残り再試行回数: ${retries}`
    );

    await new Promise(resolve => setTimeout(resolve, delay));
    return callWithRetry(fn, retries - 1, delay * 2);
  }
};
