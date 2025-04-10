import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">ページが見つかりません</p>
      <p className="mb-4">お探しのページは存在しないか、移動した可能性があります。</p>
      <a href="/" className="btn btn-primary">
        ホームに戻る
      </a>
    </div>
  );
};

export default NotFound;
